// © 2026 𝗖𝗢𝗗𝗘𝗫 𝐀𝐈 V2.0 - All Rights Reserved.
// Auto-loads from user-config.json (created during first setup)
const fs = require('fs');
const path = require('path');

/*
──────────────────────────────
Load User Config
──────────────────────────────
*/

const USER_CONFIG_PATH = path.join(__dirname, '../database/user-config.json');

let userConfig = {};

try {
    if (fs.existsSync(USER_CONFIG_PATH)) {
        userConfig = JSON.parse(fs.readFileSync(USER_CONFIG_PATH, 'utf8'));
    }
} catch {}

/*
──────────────────────────────
Default Number (Auto Assign)
──────────────────────────────
*/

const defaultNumber = "2348077528901"; //make sure this is your number change it from mine 

/*
──────────────────────────────
Config Builder (Crash Safe)
──────────────────────────────
*/

const config = {

    owner: userConfig?.owner?.number || defaultNumber,

    botNumber: userConfig?.bot?.number ||
               userConfig?.owner?.number ||
               defaultNumber,

    session: "sessions",

    thumbUrl: "https://crysnovax-media-api.crysnovax.workers.dev/1772552786848-media",

    status: {
        public: userConfig?.bot?.public ?? false,
        terminal: userConfig?.bot?.terminal ?? true,
        reactsw: userConfig?.bot?.reactsw ?? true
    },

    message: {
        owner: "no, this is for owners only by 𝗖𝗢𝗗𝗘𝗫 ☠️",
        group: "this is for groups only by 𝗖𝗢𝗗𝗘𝗫 ☠️",
        admin: "this command is for admin only by 𝗖𝗢𝗗𝗘𝗫 ☠️",
        private: "this is specifically for private chat by 𝗖𝗢𝗗𝗘𝗫 ☠️"
    },

    mess: {
        owner: "This command is only for the bot owner! by 𝗖𝗢𝗗𝗘𝗫 ☠️",
        done: "Mode changed successfully! ✓𓄄",
        error: "Something went wrong!✘𓄄",
        wait: "Please wait...⚉"
    },

    settings: {
        title: userConfig?.bot?.name || "𝗖𝗢𝗗𝗘𝗫 𝐀𝐈",
        packname: userConfig?.bot?.name || "𝗖𝗢𝗗𝗘𝗫",
        prefix: userConfig?.bot?.prefix || ".",
        description: "Professional WhatsApp Bot - 𝗖𝗢𝗗𝗘𝗫 𝐀𝐈 V2.0",
        author: "https://github.com/CODEXAI999/CODEX-AI",
        footer: "𝗖𝗢𝗗𝗘𝗫: @CODEXA1999",

        ownerJid: userConfig?.owner?.jid ||
                  `${defaultNumber}@s.whatsapp.net`,

        ownerName: userConfig?.owner?.name || "𝗖𝗢𝗗𝗘𝗫"
    },

    newsletter: {
        name: userConfig?.bot?.name || "𝗖𝗢𝗗𝗘𝗫 𝐀𝐈 V2",
        id: "0@newsletter"
    },

    api: {
        baseurl: "https://hector-api.vercel.app/",
        apikey: "hector",
        groq: process.env.GROQ_API_KEY || ""
    },

    sticker: {
        packname: userConfig?.bot?.name || "𝗖𝗢𝗗𝗘𝗫 𝐀𝐈 V2",
        author: "𝗖𝗢𝗗𝗘𝗫"
    }
};

module.exports = config;
