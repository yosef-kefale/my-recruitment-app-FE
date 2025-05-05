import { CohereClient } from 'cohere-ai';

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY || '',
});

export async function generateJobDescription(
  title: string,
  position: string,
  industry: string,
  employmentType: string,
  experienceLevel: string,
  skills: string[],
  requirements: string[],
  responsibilities: string[],
  additionalContext?: string
): Promise<string> {
  try {
    console.log('AI Service - Additional Context:', additionalContext);

    if (!additionalContext || additionalContext.trim() === '') {
      throw new Error('Please provide job details in the additional context field');
    }

    const prompt = `Based on the following job details, generate a professional job description. Use the provided information as the primary source and incorporate the supplementary details where relevant.

Primary Job Details:
${additionalContext}

Supplementary Information:
Job Title: ${title}
Position: ${position}
Industry: ${industry}
Employment Type: ${employmentType}
Experience Level: ${experienceLevel}
${skills.length > 0 ? `Key Skills: ${skills.join(', ')}` : ''}
${requirements.length > 0 ? `Requirements: ${requirements.join(', ')}` : ''}
${responsibilities.length > 0 ? `Responsibilities: ${responsibilities.join(', ')}` : ''}

Please generate a comprehensive job description that:
1. Uses the primary job details as the main content
2. Incorporates relevant supplementary information
3. Maintains a professional and engaging tone
4. Includes all necessary sections (introduction, responsibilities, requirements, etc.)
5. Presents the information in a clear and structured format`;

    const response = await cohere.generate({
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE',
    });

    if (!response.generations || response.generations.length === 0) {
      throw new Error('No response generated from AI');
    }

    return response.generations[0].text;
  } catch (error) {
    console.error('Error generating job description:', error);
    throw new Error('Failed to generate job description. Please try again later.');
  }
} 