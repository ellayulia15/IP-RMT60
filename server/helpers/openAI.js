require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getAIResponse(question) {
    const systemMessage = `Anda adalah chatbot layanan pelanggan untuk S Tour and Travel.
Beberapa informasi penting:
- Kami menyediakan paket wisata dan layanan sewa kendaraan
- Kami memiliki berbagai paket wisata seperti wisata alam, wisata hiburan, dan ziarah wali
- Untuk kendaraan, kami menyediakan bus, elf, dan mobil dengan berbagai kapasitas
- Jika ditanya detail spesifik harga atau paket, minta pengguna untuk menanyakan paket atau kendaraan spesifik
- Selalu bersikap ramah dan profesional`;

    const completion = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 200
    });

    return completion.choices[0].message.content;
}

module.exports = { getAIResponse };