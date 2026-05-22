/**
 * Ollama LLM Service for AI Question Generation
 * Integrates dynamic prompt engineering with robust developer offline schema fallbacks.
 */

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Generate technical, HR, and coding questions using local Ollama LLM.
 * Falls back gracefully to high-quality deterministic mock generation if Ollama is not active.
 * 
 * @param {object} params - Input parameters.
 * @param {string} params.role - Target interview role.
 * @param {string} params.experience - Candidate experience level.
 * @param {Array<string>} params.skills - Extracted resume skills list.
 * @param {string} params.jobDescription - pasted JD context.
 * @returns {Promise<object>} Categorized questions object.
 */
const generateCategorizedQuestions = async ({ role, experience, skills, jobDescription }) => {
  const skillsStr = skills && skills.length > 0 ? skills.join(', ') : 'General track proficiencies';
  
  const systemPrompt = `You are a futuristic AI Technical Recruiter.
Generate customized interview questions for a candidate with the following credentials:
- Target Role: ${role}
- Experience Level: ${experience}
- Core Skills: ${skillsStr}
- Job Description: ${jobDescription || 'Standard requirements'}

You MUST generate three distinct categories of questions:
1. Technical Questions (assessing core syntax, system design, and tool integrations matching their skills)
2. HR Questions (assessing behavioral scenarios, leadership qualities, and communication tempos customized to their experience level)
3. Coding Questions (assessing data structures, space-time complexities, and algorithmic designs)

Output strictly a JSON object with this EXACT structure, containing no other text or explanation:
{
  "technical": [
    "first technical question text",
    "second technical question text"
  ],
  "hr": [
    "first HR question text",
    "second HR question text"
  ],
  "coding": [
    "first coding problem text"
  ]
}`;

  try {
    console.log(`[Ollama] Dispatching generation request to model '${OLLAMA_MODEL}' at ${OLLAMA_HOST}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for fast response

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: systemPrompt,
        stream: false,
        format: 'json'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama service returned status ${response.status}`);
    }

    const resJson = await response.json();
    const cleanResponseText = resJson.response || '';

    // Attempt to parse clean JSON object from the response string
    const jsonStart = cleanResponseText.indexOf('{');
    const jsonEnd = cleanResponseText.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsedData = JSON.parse(cleanResponseText.substring(jsonStart, jsonEnd));
      if (parsedData.technical && parsedData.hr && parsedData.coding) {
        console.log('✔ Ollama dynamic question generation completed successfully.');
        return parsedData;
      }
    }
    
    throw new Error('Ollama output did not match expected JSON schema boundaries');
  } catch (error) {
    console.warn(`⚠️ Ollama offline or inactive (${error.message}). Invoking custom deterministic generator...`);
    
    // Developer Offline Deterministic Fallback Engine
    const mockDb = {
      'Frontend Engineer': {
        technical: [
          `How would you optimize React's reconciliation engine specifically when managing complex ${skillsStr} components?`,
          `Explain how you would minimize paint-reflow barriers in a production layout containing advanced elements.`
        ],
        hr: [
          `Describe a situation at your ${experience} level where you had to negotiate layout design trade-offs with backend developers.`,
          `How do you manage sprint boundaries when client specifications shift mid-cycle?`
        ],
        coding: [
          `Write a JavaScript function that flattens a deeply nested array structure, filtering out null values while maintaining O(N) space efficiency.`
        ]
      },
      'Backend Engineer': {
        technical: [
          `Explain your approach to designing a high-throughput API layer using ${skillsStr} while maintaining optimal database lock boundaries.`,
          `How do you design a distributed rate-limiter across multi-tenant servers?`
        ],
        hr: [
          `Detail a scenario where you had to refactor a slow backend database query under extreme production load.`,
          `How do you mentor junior backend developers to adopt optimal secure coding practices?`
        ],
        coding: [
          `Write a Node.js script that parses a stream of incoming HTTP logs, extracting key metrics and returning top latency endpoints in O(1) time.`
        ]
      },
      'Fullstack Engineer': {
        technical: [
          `Describe the performance trade-offs between utilizing Server-Sent Events (SSE) versus WebSockets in ${skillsStr} applications.`,
          `How do you secure serverless functions against advanced cross-site scripting vulnerabilities?`
        ],
        hr: [
          `As a ${experience} candidate, how do you balance business priority timelines with technical debt refactoring?`,
          `Tell us about a time you owned a full-stack feature launch from database schema design to frontend deployment.`
        ],
        coding: [
          `Design a custom event emitter interface supporting subscription, publishing, and unsubscribe functions.`
        ]
      },
      'AI / ML Engineer': {
        technical: [
          `Explain the mathematical difference between standard self-attention and FlashAttention when training on ${skillsStr} models.`,
          `How do you mitigate semantic embedding drift inside large retrieval vector indexes?`
        ],
        hr: [
          `Describe a situation where a model's production outputs began to show bias, and explain how you resolved it.`,
          `How do you articulate AI model black-box decisions to non-technical business partners?`
        ],
        coding: [
          `Write a python/JS matrix multiplication helper function that optimizes row-wise cache access patterns.`
        ]
      }
    };

    const trackMatch = mockDb[role] || mockDb['Frontend Engineer'];
    return trackMatch;
  }
};

module.exports = { generateCategorizedQuestions };
