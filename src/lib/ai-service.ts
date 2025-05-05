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
  responsibilities: string[]
): Promise<string> {
  try {
    const prompt = `Generate a professional job description for a ${experienceLevel} ${position} position in the ${industry} industry.
    
Job Title: ${title}
Employment Type: ${employmentType}
Experience Level: ${experienceLevel}
Industry: ${industry}

Key Skills: ${skills.join(', ')}
Requirements: ${requirements.join(', ')}
Responsibilities: ${responsibilities.join(', ')}

Please generate a comprehensive job description that includes:
1. An engaging introduction
2. Key responsibilities
3. Required qualifications and skills
4. Preferred qualifications
5. Company benefits and culture (if applicable)

Format the description in a professional and engaging way.`;

    const response = await cohere.generate({
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE',
    });

    return response.generations[0].text;
  } catch (error) {
    console.error('Error generating job description:', error);
    throw new Error('Failed to generate job description. Please try again later.');
  }
} 