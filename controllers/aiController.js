import { callGemini } from '../service/aiService.js';
import Joi from 'joi';

// Validation schema
const analyzeResumeSchema = Joi.object({
  text: Joi.string().trim().min(10).required(),
});

export const analyzeResume = async (req, res) => {
  const { error } = analyzeResumeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Invalid input', details: error.details });
  }

  const resumeText = req.body.text;
  const prompt = `
    Analyze this resume for ATS (Applicant Tracking System) compatibility:
    ${resumeText}

    Provide an evaluation focusing on:
    - ATS keyword optimization (Does the resume include industry-relevant keywords?)
    - Skills relevancy (Are the listed skills aligned with typical job requirements in this field?)
    - Experience relevancy (Does the work experience align with the job role you're targeting?)
    - Formatting and readability (Is the resume formatted in a way that ATS can easily parse and read it?)
    - Suggestions for improving ATS compatibility (What can be improved for better ATS scoring?)
    - Overall ATS score (Provide a score based on the ATS compatibility).
`;


  try {
    const result = await callGemini(prompt);
    //  console.log("Raw Gemini Result:", result);
    res.status(200).json({ analysis: result });
  } catch (error) {
    console.error(`[Analyze Resume] Error: ${error.message}`, {
      stack: error.stack,
      data: req.body,
    });
    res.status(500).json({ message: 'Error analyzing resume', error });
  }
};

export const recommendJobs = async (req, res) => {
  try {
    const skills = req.body.skills || ""; // or from resume analysis
    const prompt = `Suggest suitable jobs for a person with the following skills: ${skills}`;
    const result = await callGemini(prompt); // Changed to callGemini
    res.status(200).json({ recommendations: result });
  } catch (error) {
    res.status(500).json({ message: "Error recommending jobs", error });
  }
};

const generateCoverLetterSchema = Joi.object({
  resumeText: Joi.string().required(),
  jobTitle: Joi.string().required(),
  companyName: Joi.string().required(),
  jobDescription: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.string().required(),
});

export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeText, jobTitle, companyName, jobDescription, name, email, phone, address,date } = req.body;
    const prompt = `
You are a professional cover letter writer. Based on the candidate's resume and the target job, generate a highly personalized, recruiter-ready cover letter in the following exact format. Do NOT change the structure. Replace placeholders with real content based on the resume and job title.

Format:
[Your Name]  ,${name}
[Your Address]  ,${address}
[Your Email] ,${email} 
[Your Phone Number] ,${phone} 
[Date],${date}

Hiring Manager  
[Company Name]  
[Company Address]

Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With [X years] of experience in [industry/role], I have developed a proven track record of [relevant achievements/skills]. I am excited about the opportunity to contribute to [specific project, value, or mission of the company].

In my previous role at [Previous Company], I [describe a key accomplishment that matches the job]. My background in [skill/technology] combined with my ability to [soft skill] makes me confident in my ability to add value to your team.

What particularly draws me to [Company Name] is [mention something specific about the company culture, mission, or job description]. I am eager to bring my passion for [industry/role] and my commitment to excellence to your team.

Thank you for considering my application. I would welcome the opportunity to discuss how my experience aligns with your team’s needs.

Sincerely,  
[Your Name]

Inputs:
Resume:
\\\`
${resumeText}
\\\`

Target Job Title: ${jobTitle}  
Company Name: ${companyName}  
(Optional) Job Description:
\\\`
${jobDescription}
\\\`
`;
    const result = await callGemini(prompt); // Changed to callGemini
    res.status(200).json({ coverLetter: result });
  } catch (error) {
    res.status(500).json({ message: "Error generating cover letter", error });
  }
};

// chatAssistant function
export const chatAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    const prompt = `Answer the following user question in the context of a job portal: ${question}`;
    const result = await callGemini(prompt); // Changed to callGemini
    res.status(200).json({ response: result });
  } catch (error) {
    res.status(500).json({ message: "Error processing chat", error });
  }
};
