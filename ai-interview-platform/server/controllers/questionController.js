const ROLE_QUESTIONS = {
  'Frontend Engineer': [
    "Could you explain how React's reconciliation algorithm (Fiber) differs from the old stack reconciler and how it improves layout responsiveness?",
    "What are your core strategies for optimizing Cumulative Layout Shift (CLS) and Largest Contentful Paint (LCP) in a large-scale single-page application?",
    "How does the CSS containment property (`contain`) impact paint reflow boundaries, and when should you utilize it in compound UI elements?"
  ],
  'Backend Engineer': [
    "How would you design a distributed rate limiter for a multi-tenant API gateway, and what are the trade-offs between Redis Token Bucket and Leaky Bucket?",
    "Can you detail your strategy for handling eventual consistency issues when migrating an monolithic DB transaction to a Saga Pattern orchestrator?",
    "How do you profile and eliminate database lock contention in PostgreSQL under high read-write concurrency scenarios?"
  ],
  'Fullstack Engineer': [
    "Describe the architectural trade-offs between implementing Server-Sent Events (SSE) versus WebSockets for a live system telemetry dashboard.",
    "How do you design a secure token rotation policy for hybrid client applications, and how do you protect cookies against advanced CSS Injection?",
    "Explain how you would optimize a serverless cold-start bottleneck when deploying an API gateway backend backed by a relational database."
  ],
  'AI / ML Engineer': [
    "What are the main performance trade-offs between using FlashAttention-2 vs standard self-attention mechanisms during LLM inference loops?",
    "How do you identify and mitigate semantic drift in production vector embeddings when fine-tuning a retrieval-augmented generation pipeline?",
    "Can you explain the structural differences between LoRA and QLoRA, and how they reduce quantizing overhead during PEFT cycles?"
  ]
};

// @desc    Generate customized situational questions based on role, difficulty and JD
// @route   POST /api/interview/questions
// @access  Private
exports.generateQuestion = async (req, res) => {
  try {
    const { role, difficulty, experience, jobDescription } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Please specify target role' });
    }

    const defaultList = ROLE_QUESTIONS[role] || ROLE_QUESTIONS['Frontend Engineer'];
    
    // Dynamically enrich or customize based on difficulty or JD presence
    let tailoredQuestions = [...defaultList];

    if (difficulty === 'Hard') {
      tailoredQuestions = tailoredQuestions.map(q => `[Advanced Scenario] ${q}`);
    }

    if (jobDescription && jobDescription.trim().length > 0) {
      tailoredQuestions.push(`Situational Context Problem: Based on your job description requirements, how would you design a performance-critical loop that integrates key scaling parameters?`);
    }

    res.json({
      success: true,
      data: {
        role,
        difficulty: difficulty || 'Medium',
        experience: experience || 'Mid-level',
        questions: tailoredQuestions,
      }
    });
  } catch (error) {
    console.error('Question Generation Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};