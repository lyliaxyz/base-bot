import { fluxAI } from '../lib/scrape/fluxai-api.js';

const handler = async (m, plug) => {
    const { sock, args, config } = plug;

    if (!args) {
        return sock.sendMessage(m.key.remoteJid, { text: `Contoh: ${config.prefix}flux buatkan burung terbang di atas awan` }, { quoted: m });
    }

    const waitMessage = config.mess.wait;
    await sock.sendMessage(m.key.remoteJid, { text: waitMessage }, { quoted: m });

    try {
        const imageUrl = await fluxAI(args);

        if (imageUrl) {
            await sock.sendMessage(m.key.remoteJid, { image: { url: imageUrl }, caption: `Hasil dari prompt: "${args}"` }, { quoted: m });
        } else {
            await sock.sendMessage(m.key.remoteJid, { text: 'Gagal membuat gambar atau tidak ada URL gambar yang ditemukan.' }, { quoted: m });
        }
    } catch (error) {
        console.error("[FLUXAI ERROR]", error);
        await sock.sendMessage(m.key.remoteJid, { text: `Terjadi kesalahan saat memproses permintaan gambar: ${error.message}` }, { quoted: m });
    }
};

handler.help = ['flux <prompt>'];
handler.tags = ['ai', 'gambar'];
handler.command = ['flux'];
handler.limit = true;

export default handler;
