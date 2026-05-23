const { GoogleGenerativeAI } = require('@google/generative-ai');

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });
};

/**
 * PATH 1 — Resume Upload Flow
 * Uses Gemini to extract skills, education, experience and projects from raw resume text.
 * Replaces all NLP/regex heuristic parsing.
 */
const extractResumeData = async (resumeText) => {
  console.log('[Gemini] Extracting structured profile from resume text...');
  const model = getModel();

  const prompt = `
You are an expert Resume Parser AI. 
Analyze the following resume text and extract all relevant professional information.

Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Respond ONLY with a valid raw JSON object matching this schema exactly:
{
  "skills": ["array of all technical skills, programming languages, frameworks, tools found"],
  "education": ["array of education entries as readable strings, e.g. 'B.Tech Computer Science - XYZ University (2020-2024)'"],
  "experience": ["array of work experience entries as readable strings, e.g. 'Software Engineer at ABC Corp (2022-2024) - Built REST APIs'"],
  "projects": ["array of project descriptions as readable strings, e.g. 'AI Chatbot - Built with Python and OpenAI API'"],
  "summary": "2-3 sentence professional summary of the candidate"
}

Rules:
- Extract ALL technical skills mentioned (languages, frameworks, tools, cloud, databases)
- Be thorough - do not miss any skills
- Keep strings concise and readable
- Return empty arrays [] if a section is not found
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  const data = JSON.parse(result.response.text());
  console.log(`[Gemini] Extracted ${data.skills?.length || 0} skills from resume.`);
  return data;
};

/**
 * PATH 2 — Job Description Matching Flow
 * Uses Gemini to compare resume skills against JD requirements.
 * Replaces all NLP/regex skill matching logic.
 */
const analyzeSkillsWithGemini = async (resumeText, jobDescription) => {
  console.log('[Gemini] Analyzing JD match against resume...');
  const model = getModel();

  const prompt = `
You are an expert ATS (Applicant Tracking System) AI and Career Coach.
Compare the candidate's resume against the job description and produce a detailed skill match analysis.

Resume Text:
"""
${resumeText.slice(0, 6000)}
"""

Job Description:
"""
${jobDescription.slice(0, 3000)}
"""

Instructions:
1. Extract ALL technical and professional skills required in the Job Description.
2. Cross-reference with the resume - find matches including synonyms (ReactJS = React, Postgres = PostgreSQL, etc.).
3. List skills from the JD that are missing or weak in the resume.
4. Calculate a realistic match percentage (0-100) based on skill overlap.
5. Write a 2-3 sentence personalized recommendation for the candidate.

Respond ONLY with a valid raw JSON object:
{
  "matchPercentage": <integer 0-100>,
  "jdSkills": ["all skills extracted from the job description"],
  "matchingSkills": ["skills found in both resume and JD"],
  "missingSkills": ["skills in JD but absent/weak in resume"],
  "recommendation": "personalized strategic advice string"
}
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  const data = JSON.parse(result.response.text());
  data.matchPercentage = Math.min(Math.max(Number(data.matchPercentage) || 20, 10), 100);

  console.log(`[Gemini] JD match: ${data.matchPercentage}%, ${data.matchingSkills?.length} matching, ${data.missingSkills?.length} missing.`);
  return { success: true, source: 'gemini-1.5-flash', ...data };
};

module.exports = { extractResumeData, analyzeSkillsWithGemini };
