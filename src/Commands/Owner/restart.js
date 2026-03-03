module.exports = {

    name: 'control',

    alias: ['restart', 'reboot', 'stopbot'],

    desc: 'Restart or stop the bot (owner only)',

    category: 'Owner',

    ownerOnly: true,

    execute: async (sock, m, { reply, args }) => {

        const action = args[0]?.toLowerCase();

        if (!action || !['restart', 'stop'].includes(action)) {

            return reply(

                '_⚙️ Usage:_\n' +

                '✪ .control restart  → restart the bot\n' +

                '✪ .control stop     → stop the bot'

            );

        }

        if (action === 'restart') {

            await reply('_🔄 Restarting 𝗖𝗢𝗗𝗘𝗫 AI V2..._');

            // Graceful restart using a process manager

            setTimeout(() => process.exit(0), 1000);

        } else if (action === 'stop') {

            await reply('_🛑 Stopping CRYSNOVA AI V2..._');

            // Exit without auto-restart (if not using PM2/Forever)

            setTimeout(() => process.exit(0), 1000);

        }

    }

};
