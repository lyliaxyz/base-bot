import { DeepAI } from '../lib/scrape/deepai-api.js';

const handler = async (m, plug) => {
    const { sock, args, config } = plug;
    if (!args) {
        return sock.sendMessage(m.key.remoteJid, { text: `Contoh: ${config.prefix}deepai halo, apa kabar?` }, { quoted: m });
    }
    await sock.sendMessage(m.key.remoteJid, { text: config.mess.wait }, { quoted: m });

    try {
        const result = await DeepAI(args);
        if (result && result.output) {
            await sock.sendMessage(m.key.remoteJid, { text: result.output }, { quoted: m });
        } else {
            await sock.sendMessage(m.key.remoteJid, { text: 'Tidak dapat mendapatkan respons dari DeepAI. Silakan coba lagi nanti.' }, { quoted: m });
        }
    } catch (error) {
        console.error("[DEEPAI COMMAND ERROR]", error);
        await sock.sendMessage(m.key.remoteJid, { text: `Terjadi kesalahan saat memproses permintaan DeepAI: ${error.message}` }, { quoted: m });
    }
};

handler.help = ['deepai <teks>'];
handler.tags = ['ai'];
handler.command = ['deepai', 'dai'];
handler.limit = true;

export default handler;
