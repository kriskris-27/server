// src/utils/aiml.ts
import axios from 'axios';

const API_KEY = process.env.AIMLAPI_KEY;
const BASE_URL = 'https://api.aimlapi.com/v1';

interface AIMLResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export async function callAimLapi(prompt: string): Promise<string> {
    if (!API_KEY) {
        throw new Error('API key is missing');
    }

    try {
        console.log('Calling AIML API for document structuring...');
        const response = await axios.post<AIMLResponse>(
            `${BASE_URL}/chat/completions`,
            {
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert computer science course developer and designer. Your task is to enhance the raw documentation and convert into a structured course format.
                        You must respond with ONLY a valid JSON object, following this exact structure:
                        {
                            "courseTitle": "string",
                            "modules": [
                                {
                                    "moduleTitle": "string",
                                    "lessons": [
                                        {
                                            "title": "string",
                                            "content": "string",
                                            "example": "string",
                                        }
                                    ]
                                }
                            ]
                        }
                        Do  include  explanations text 
                        dont include outside the JSON object.`
                    },
                    {
                        role: 'user',
                        content: `Convert this documentation into a structured course. Maintain the original order and hierarchy. Be concise but faithful to the content:

                        ${prompt}`
                    }
                ],
                temperature: 0.3, // Lower temperature for more consistent JSON output
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );

        const content = response.data.choices[0].message.content;
        
        // Validate that the response is valid JSON
        try {
            const parsed = JSON.parse(content);
            // Basic structure validation
            if (!parsed.courseTitle || !Array.isArray(parsed.modules)) {
                throw new Error('Invalid response structure');
            }
            return content;
        } catch (parseError) {
            console.error('Failed to parse AIML response as JSON:', parseError);
            console.error('Raw response:', content);
            throw new Error('AI response was not in valid JSON format');
        }
    } catch (error: any) {
        console.error('AIML API Error:', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        throw error;
    }
}
