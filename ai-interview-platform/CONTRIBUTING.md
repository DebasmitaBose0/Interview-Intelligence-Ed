# Contributing to Camsense AI

Thank you for your interest in contributing to Camsense AI! We want to build the most robust, secure, and beautiful open-source AI mock interview platform, and your contributions are key to making this happen.

As a project admin, I have identified several codebase **loopholes** (security risks, design limitations, and code smells) below. We encourage you to tackle any of these issues to improve the platform's stability and enterprise readiness.

---

## 🔍 Identified Loopholes & Good First Issues

Here is the list of major improvements needed in the codebase. Please feel free to open a Pull Request addressing any of these:

### 1. 🛡️ Authentication Bypass Vulnerability
*   **File:** [`server/middleware/authMiddleware.js`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/server/middleware/authMiddleware.js)
*   **The Issue:** On line 15, the token verification check includes:
    ```javascript
    if (token === 'demo_token_active' || token.length < 50)
    ```
    This allows any token shorter than 50 characters (e.g. `Bearer admin`) to automatically bypass Firebase Auth verification and assume a full "Demo Candidate" profile in any environment.
*   **The Fix:** Restrict the bypass logic strictly to development environments (`process.env.NODE_ENV === 'development'`) or remove the length-based bypass altogether, requiring real Firebase JWT token validation.

### 2. 💽 File Storage Leak & Potential DoS
*   **File:** [`server/controllers/resumeController.js`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/server/controllers/resumeController.js)
*   **The Issue:** When a resume is uploaded, it writes the raw buffer to disk in `uploads/` via `fs.writeFileSync`. Since the application is currently running statelessly, these files are never referenced again and are never deleted, which will eventually exhaust server disk storage and trigger a Denial of Service (DoS) crash.
*   **The Fix:** Either disable disk writing entirely in stateless mode, implement a cron-like cleanup worker that automatically deletes temp uploads older than 1 hour, or add support for secure S3/Cloudinary object uploads.

### 3. 🚨 Unhandled JSON Parsing Crashes
*   **File:** [`server/services/geminiService.js`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/server/services/geminiService.js)
*   **The Issue:** The LLM services call `JSON.parse(result.response.text())` directly in several paths (e.g., `extractResumeData`, `analyzeSkillsWithGemini`, `generateQuestionsFromResume`, `evaluateAnswer`). If the Gemini API returns markdown formatting wraps (like ` ```json ... ``` `) or malformed JSON, the server crashes with a 500 error on the frontend.
*   **The Fix:** Wrap parsing blocks in a helper function located in `server/utils/sanitizers/jsonSanitizer.js` that sanitizes markdown blocks and utilizes a try-catch block to supply a schema-valid fallback structure instead of throwing.

### 4. 🔗 Utility Mismatch & Import Bug
*   **File:** [`server/controllers/resumeController.js`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/server/controllers/resumeController.js)
*   **The Issue:** The controller imports `extractTextFromBuffer` on line 2, which does not exist in `pdfParser.js` (which actually exports `extractTextFromPDF`). Consequently, the controller requires `pdf-parse` again locally to process buffers, causing code duplication and bypassing the regex ASCII fallback logic implemented in `pdfParser.js`.
*   **The Fix:** Change the import on line 2 to match the exported helper `extractTextFromPDF` and refactor the controller's PDF handling to utilize the utility, importing the local parser fallback from `server/utils/parsers/resumeParser.js`.

### 5. 🛑 Missing Global Error-Handling Middleware
*   **File:** [`server/app.js`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/server/app.js)
*   **The Issue:** The Express application registers routes but fails to define a final error-catching middleware `(err, req, res, next) => { ... }`. When an unhandled error occurs, Node/Express returns a default HTML stack trace to the user, exposing folders, internal library structures, and system configurations.
*   **The Fix:** Append a centralized global error-handler middleware `server/middleware/error/errorHandler.js` to the end of the middleware chain in `app.js` to return standardized JSON error bodies:
    ```javascript
    app.use((err, req, res, next) => {
      res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    });
    ```

### 6. 🗄️ Database Layer Inconsistency
*   **Files:** [`database/schema.sql`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/database/schema.sql) and [`server/models/`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/server/models)
*   **The Issue:** The codebase has a PostgreSQL SQL file (`database/schema.sql`) and several Mongoose model files (e.g., `User.js`, `Interview.js`, `Report.js`) under MongoDB, but neither are connected to the routes. The application runs statelessly, ignoring all database logic.
*   **The Fix:** Establish a clean configuration flag (e.g., `DATABASE_PROVIDER=mongodb|postgres|stateless`) and implement the database integration in the controllers so users can select between stateless sandbox testing or persistent record storage.

### 7. 🧭 Router Navigation Limitation
*   **File:** [`client/src/App.jsx`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/client/src/App.jsx)
*   **The Issue:** The React application manages pages using a flat `currentTab` state wrapper instead of a router. This causes page-refresh state loss (resetting the interview session), blocks the browser back button, and makes specific paths unshareable.
*   **The Fix:** Transition the layout from state-based tab switches to `react-router-dom` to support browser history and deep linking.

### 8. 🌐 Node.js Runtime Version Compatibility
*   **File:** [`server/controllers/interviewController.js`](file:///c:/Users/SOUMADEEP/OneDrive/Desktop/Education/ai-interview-platform/server/controllers/interviewController.js) (Line 159)
*   **The Issue:** The controller uses Node's global `fetch` API to talk to JDoodle. Global `fetch` is only natively supported in Node.js v18+. If developers deploy on older Node LTS releases, the execution throws a ReferenceError.
*   **The Fix:** Import `node-fetch` or utilize standard HTTP libraries like `axios` to ensure compatibility across older runtime environments.

---

## 🛠️ Contribution Workflow

### 1. Setup Your Branch
1. Fork the repository and clone it locally.
2. Create a new branch naming it relative to the issue you are fixing:
   ```bash
   git checkout -b fix/jwt-bypass-vulnerability
   # or
   git checkout -b feat/centralized-error-handling
   ```

### 2. Implementation Rules
- **Stateless/Stateful Grace**: Ensure that whatever changes you make do not break the "Offline/Stateless" fallback mechanisms. Developers should be able to spin up the codebase without paid API keys and still test client flows.
- **Maintain Comments**: Maintain structural comments in the files you modify.
- **Verify Linting**: Run `npm run lint` in the client directory to check for styling and syntax violations before committing.

### 3. Commit Guidelines
We follow semantic commit styling. Ensure your commits are structured clean:
- `fix: resolve auth length bypass in authMiddleware`
- `feat: implement global express error handling response`
- `docs: update setup steps for PostgreSQL config`

### 4. Opening a Pull Request
When submitting your PR:
1. Reference the loophole or issue number you are resolving.
2. Provide a brief summary of how your fix resolves the vulnerability or enhances code quality.
3. List the manual testing steps you ran to verify that the app still compiles.
