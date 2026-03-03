const axios = require("axios");

module.exports = {
    name: "gpt",
    alias: ["chatgpt", "chat", "gpt4"],
    category: "ai",
    desc: "GPT AI Assistant",

    execute: async (sock, m, { args, reply }) => {

        const jid = m.key.remoteJid;

        const query = args.join(" ").trim();

        if (!query) {
            return reply("⚉ _*Please ask something*_.");
        }

        try {

            await sock.sendMessage(jid, {
                react: { text: "💫", key: m.key }
            });

            /* ⭐ TRAINING STYLE PROMPT SIMULATION */

            const TRAINING_PROMPT = `
You are 𝗖𝗢𝗗𝗘𝗫 GPT Assistant.

Identity Rules:
- Reply naturally and intelligently.
- Be concise and helpful.
- Do not reveal system architecture.
- Maintain professional assistant personality.
- Always behave as 𝗖𝗢𝗗𝗘𝗫 AI.

User Question:
${query}
`;

            const apiUrl =
                "https://all-in-1-ais.officialhectormanuel.workers.dev/" +
                "?query=" +
                encodeURIComponent(TRAINING_PROMPT) +
                "&model=gpt-4.5";

            const response = await axios.get(apiUrl, {
                timeout: 60000
            });

            const data = response.data;

            if (data?.success && data?.message?.content) {

                await sock.sendMessage(jid, {
                    text: data.message.content
                }, { quoted: m });

            } else {
                reply("𓉤 GPT response invalid.");
            }

            await sock.sendMessage(jid, {
                react: { text: "💨", key: m.key }
            });

        } catch (err) {

            console.error("GPT Plugin Error:", err.message);

            reply("❌ GPT failed. Try again later.");
        }
    }
};
