import { Request,Response } from "express";
import { openai } from "../utils/openai";

export const structureDoc = async(req:Request ,res:Response) =>{
    const {rawText} = req.body;

    if(!rawText) {
        return res.status(400).json({message : 'Missing documentation text'});
    }

    try {
        const prompt = `
You are an expert course designer. Convert the following raw text into a structured course. 

Organize it into Modules and Lessons. Each Module should have a title and a list of Lessons. Each Lesson should have:
- A title
- Core content from the original text

Do not hallucinate, preserve the structure, and be concise but faithful.

Respond strictly in this JSON format:

{
  "courseTitle": "string",
  "modules": [
    {
      "moduleTitle": "string",
      "lessons": [
        {
          "title": "string",
          "content": "string"
        }
      ]
    }
  ]
}

Here is the documentation:
---
${rawText}
---
    `;
    const completion = await openai.chat.completions.create({
        model: 'gpt-4',
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
    })

    const output = completion.choices[0]?.message?.content;

    const parsed = JSON.parse(output!);
    return res.status(200).json(parsed);
    }catch(err){
        console.error('AI Error',err);
        return res.status(500).json({message:'AI failed to generate structure'})

    }
}

