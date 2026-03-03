const { getByCategory, getAll } = require('../../Plugin/crysCmd');
const { getVar } = require('../../Plugin/configManager');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: 'menu',
    alias: ['help', 'list', 'cmds'],
    desc: 'Show all commands',
    category: 'Bot',
    reactions: {
        start: '💬',
        success: '✨'
    },

    execute: async (sock, m, { prefix, config, reply }) => {

        // Safely extract sender from m object
        const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
        const senderNumber = sender.split('@')[0] || 'Unknown';

        const cats = getByCategory();

        const botName =
            getVar('botName', config.settings?.title || 'CRYSNOVA AI');

        const uptime = Math.floor((Date.now() - global.crysStats.startTime) / 60000);

        const total = new Set(
            [...getAll().values()]
                .filter(cmd => !cmd?.isAlias)
                .map(cmd => cmd.name?.toLowerCase())
        ).size;

        const now = new Date();

        const time = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Africa/Lagos'
        }).toLowerCase();

        // Get storage info
        const getStorage = () => {
            try {
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const usedGB = (usedMem / 1024 / 1024 / 1024).toFixed(1);
                const totalGB = (totalMem / 1024 / 1024 / 1024).toFixed(1);
                const percent = Math.round((usedMem / totalMem) * 100);
                return `${usedGB}/${totalGB}GB (${percent}%)`;
            } catch {
                return 'N/A';
            }
        };

        // Get WhatsApp real name - AGGRESSIVE FETCHING
        const getWhatsAppName = async (jid) => {
            if (!jid) return 'Unknown';
            
            try {
                // Method 1: Check store.contacts (Map)
                const contact = sock.store?.contacts?.get?.(jid);
                
                if (contact) {
                    if (contact.notify && contact.notify.trim() !== '') {
                        return contact.notify;
                    } else if (contact.name && contact.name.trim() !== '') {
                        return contact.name;
                    } else if (contact.verifiedName && contact.verifiedName.trim() !== '') {
                        return contact.verifiedName;
                    }
                }
                
                // Method 2: Check m.pushName (comes with message)
                if (m.pushName && m.pushName.trim() !== '' && m.pushName !== jid.split('@')[0]) {
                    return m.pushName;
                }
                
                // Method 3: Force fetch from WhatsApp
                try {
                    // Try to get profile picture URL (this triggers contact info fetch sometimes)
                    await sock.profilePictureUrl(jid, 'image').catch(() => {});
                } catch {}
                
                // Method 4: Use sock.getName with await
                const fetchedName = await sock.getName(jid);
                if (fetchedName && fetchedName !== jid && fetchedName.trim() !== '' && !fetchedName.includes('@')) {
                    return fetchedName;
                }
                
                // Method 5: Check if it's in group metadata (for groups)
                if (m.isGroup && m.chat) {
                    try {
                        const meta = await sock.groupMetadata(m.chat);
                        const participant = meta.participants.find(p => p.id === jid);
                        if (participant?.notify && participant.notify.trim() !== '') {
                            return participant.notify;
                        }
                    } catch {}
                }
                
                // Method 6: Check global.contacts if exists
                if (global.contacts && global.contacts[jid]) {
                    const gc = global.contacts[jid];
                    if (gc.notify) return gc.notify;
                    if (gc.name) return gc.name;
                }
                
                // Final fallback
                return jid.split('@')[0];
            } catch (e) {
                console.log('[Menu] Name fetch error:', e.message);
                return jid.split('@')[0];
            }
        };

        // Get user info with await
        const userName = await getWhatsAppName(sender);

        let text = '';

        text += ` ╭─❍ *${botName.toUpperCase()} V2*\n`;
        text += ` │ ❏ USER     : ${userName}\n`;
        text += ` │ ❏ NUMBER   : ${senderNumber}\n`;
        text += ` │ ❏ PREFIX   : ${prefix}\n`;
        text += ` │ ❏ COMMANDS : ${total}\n`;
        text += ` │ ❏ UPTIME   : ${uptime} MIN\n`;
        text += ` │ ❏ MODE     : ${config.status?.public ? 'PUBLIC' : 'PRIVATE'}\n`;
        text += ` │ ❏ STORAGE  : ${getStorage()}\n`;
        text += ` ╰─ 𓄄 \`\`\`${time}\`\`\`\n\n`;

        for (const [cat, cmds] of Object.entries(cats)) {

            text += `> ╭─❍ *${cat.toUpperCase()}*\n`;

            const shown = new Set();

            for (const cmd of cmds) {
                if (!cmd?.name) continue;
                const name = cmd.name.toLowerCase();
                if (shown.has(name)) continue;
                shown.add(name);
                text += `> │ ➫ ${prefix}${cmd.name}\n`;
            }

            text += `> ╰──────────────────\n\n`;
        }

        text += ` ╭─❍ *DEVELOPER*\n`;
        text += ` │ ✰ 𝗖𝗢𝗗𝗘𝗫 𝐀𝐈\n`;
        text += ` │ ➤ VERSION : 2.0.0\n`;
        text += ` ╰──────────────────`;

        // =============================
        // Image download once system
        // =============================

        const imagePath = path.join(__dirname, "../../assets/menu.png");

        async function getMenuImage() {
            if (fs.existsSync(imagePath)) {
                return fs.readFileSync(imagePath);
            }

            try {
                const res = await axios.get(
                    config.thumbnail || config.thumbUrl || "https://i.imgur.com/BoN9kdC.png",
                    { responseType: "arraybuffer" }
                );

                fs.mkdirSync(path.dirname(imagePath), { recursive: true });
                fs.writeFileSync(imagePath, res.data);

                return res.data;
            } catch (err) {
                console.log("Image download failed:", err.message);
                return null;
            }
        }

        const imageBuffer = await getMenuImage();

        await sock.sendMessage(
            m.chat,
            imageBuffer
                ? {
                    image: imageBuffer,
                    caption: text
                  }
                : {
                    text: text
                  },
            { quoted: m }
        );
    }
};
