require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getAIResponse(question) {
    const completion = await client.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
            {
                role: "user",
                content: question,
            },
        ],
    });
    return completion.choices[0].message.content;
}

module.exports = { getAIResponse };