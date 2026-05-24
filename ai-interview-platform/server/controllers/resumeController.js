// Removed Resume model import as we are fully stateless
const { extractTextFromBuffer } = require('../utils/pdfParser');
const { extractResumeData, analyzeSkillsWithGemini } = require('../services/geminiService');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');

/**
 * Resume Upload Flow (from diagram):
 * File Upload → Extract Raw Text → Gemini AI Parsing → Skill Extraction → MongoDB Save
 * POST /api/resume/upload
 */
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a PDF or DOCX resume file.' });
    }

    const { originalname, buffer, mimetype } = req.file;
    console.log(`[Resume Upload] Received: ${originalname} (${mimetype})`);

    // Step 1: Extract raw text from PDF or DOCX
    let rawText = '';
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const pdfParse = require('pdf-parse');
      const pdfData = await pdfParse(buffer);
      rawText = pdfData.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    } else {
      return res.status(400).json({ success: false, message: 'Only PDF and DOCX files are supported.' });
    }

    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Could not extract readable text from this file. Please try another file.' });
    }

    console.log(`[Resume Upload] Extracted ${rawText.length} characters. Sending to Gemini...`);

    // Step 2: Gemini AI — extract structured profile (replaces all NLP/regex)
    const geminiData = await extractResumeData(rawText);

    // Step 3: Save file to disk
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const tempFileName = `${Date.now()}_${originalname.replace(/\s+/g, '_')}`;
    const tempFilePath = path.join(uploadDir, tempFileName);
    fs.writeFileSync(tempFilePath, buffer);

    console.log(`[Resume Upload] Processed statelessly. Skills extracted: ${geminiData.skills?.length || 0}`);

    res.status(200).json({
      success: true,
      message: `Resume analyzed by Gemini AI statelessly. Extracted ${geminiData.skills?.length || 0} skills.`,
      data: {
        id: `stateless_${Date.now()}`,
        fileName: originalname,
        skills: geminiData.skills || [],
        education: geminiData.education || [],
        experience: geminiData.experience || [],
        projects: geminiData.projects || [],
        summary: geminiData.summary || '',
        extractedText: rawText // Return this for JD matching if needed
      }
    });

  } catch (error) {
    console.error('[Resume Upload] Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fetch candidate's stored resume profile
 * GET /api/resume/me
 */
exports.getResume = async (req, res) => {
  try {
    res.status(404).json({ success: false, message: 'Persistent resume profiles are disabled in stateless mode.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * JD Matching Flow (from diagram):
 * Job Description Input → Gemini AI → Skill Extraction & Matching → Results
 * POST /api/resume/analyze-jd
 */
exports.analyzeJobDescription = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Please paste a complete job description (at least 20 characters).' });
    }

    // In stateless mode, the frontend must pass the resume content to this endpoint
    const { resumeContent } = req.body;
    
    if (!resumeContent) {
      return res.status(400).json({ success: false, message: 'Missing resume content in stateless payload.' });
    }

    const analysisResult = await analyzeSkillsWithGemini(resumeContent, jobDescription);

    res.status(200).json({
      success: true,
      message: 'Job description analyzed with Gemini AI',
      data: analysisResult
    });

  } catch (error) {
    console.error('[JD Analysis] Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
