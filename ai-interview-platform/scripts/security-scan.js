const fs = require('fs');
const path = require('path');

const INJECTION_PATTERNS = [
  { pattern: /\$where/i, name: '$where operator', severity: 'critical' },
  { pattern: /\$gt\b/i, name: '$gt operator', severity: 'high' },
  { pattern: /\$gte\b/i, name: '$gte operator', severity: 'high' },
  { pattern: /\$lt\b/i, name: '$lt operator', severity: 'high' },
  { pattern: /\$lte\b/i, name: '$lte operator', severity: 'high' },
  { pattern: /\$ne\b/i, name: '$ne operator', severity: 'high' },
  { pattern: /\$regex/i, name: '$regex operator', severity: 'high' },
  { pattern: /\$exists/i, name: '$exists operator', severity: 'medium' },
  { pattern: /\$eq\b/i, name: '$eq operator', severity: 'medium' },
  { pattern: /\$mod/i, name: '$mod operator', severity: 'medium' },
  { pattern: /\$where\s*['"]/, name: 'Unsanitized $where', severity: 'critical' },
  { pattern: /\$func/i, name: '$func operator', severity: 'high' },
];

const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.git', 'coverage'];
const EXCLUDE_FILES = ['*sanitize*', '*test*', 'security-scan.js'];

function shouldExclude(filePath) {
  const relative = path.relative(process.cwd(), filePath);
  for (const dir of EXCLUDE_DIRS) {
    if (relative.includes(dir)) return true;
  }
  for (const pattern of EXCLUDE_FILES) {
    if (pattern.startsWith('*') && pattern.endsWith('*')) {
      const base = pattern.slice(1, -1);
      if (path.basename(filePath).includes(base)) return true;
    }
  }
  return false;
}

function scanFile(filePath) {
  if (shouldExclude(filePath)) return [];
  const ext = path.extname(filePath);
  if (!['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'].includes(ext)) return [];

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const findings = [];

    for (const { pattern, name, severity } of INJECTION_PATTERNS) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(content)) !== null) {
        const lineNumber = (content.slice(0, match.index).match(/\n/g) || []).length + 1;
        const contextStart = Math.max(0, match.index - 40);
        const contextEnd = Math.min(content.length, match.index + match[0].length + 40);
        const context = content.slice(contextStart, contextEnd).replace(/\n/g, ' ').trim();

        findings.push({
          file: filePath,
          line: lineNumber,
          severity,
          pattern: name,
          context,
        });
      }
    }

    return findings;
  } catch {
    return [];
  }
}

function scanDirectory(dirPath) {
  let findings = [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory() && !shouldExclude(fullPath)) {
        findings = findings.concat(scanDirectory(fullPath));
      } else if (entry.isFile()) {
        findings = findings.concat(scanFile(fullPath));
      }
    }
  } catch { }
  return findings;
}

const findings = scanDirectory(process.cwd());

const bySeverity = { critical: [], high: [], medium: [], low: [] };
findings.forEach(f => {
  if (bySeverity[f.severity]) bySeverity[f.severity].push(f);
});

console.log('\n=== NoSQL Injection Security Scan ===\n');

if (findings.length === 0) {
  console.log('No potential injection patterns found.');
  process.exit(0);
}

for (const [severity, items] of Object.entries(bySeverity)) {
  if (items.length === 0) continue;
  const color = severity === 'critical' ? '\x1b[31m' : severity === 'high' ? '\x1b[33m' : '\x1b[36m';
  console.log(`${color}[${severity.toUpperCase()}]\x1b[0m ${items.length} finding(s)`);
  items.slice(0, 10).forEach(f => {
    console.log(`  ${f.file}:${f.line}`);
    console.log(`    ${f.pattern}: ${f.context.slice(0, 100)}`);
  });
  if (items.length > 10) {
    console.log(`  ... and ${items.length - 10} more`);
  }
  console.log();
}

const criticalCount = bySeverity.critical.length;
const highCount = bySeverity.high.length;

if (criticalCount > 0 || highCount > 5) {
  console.log(`\x1b[31mFAIL: ${criticalCount} critical, ${highCount} high severity findings\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32mPASS: ${findings.length} total findings (acceptable)\x1b[0m`);
  process.exit(0);
}