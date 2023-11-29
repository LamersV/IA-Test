import dotenv from "dotenv";
dotenv.config();

import fs from "fs";

import OpenAI from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function main(path) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.1,
        
        // response_format: { type: "json_object" },
        messages: [
            { role: "user", content: "Qual o melhor time do mundo?" },
        ]
    });

    console.log(completion);
}

main();