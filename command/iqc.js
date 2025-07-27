import fetch from 'node-fetch';

const handler = async (m, plug) => {
    const { sock, args } = plug;
    const text = args;

    if (!text) {
        await sock.sendMessage(m.key.remoteJid, { text: 'Penggunaan: .iqc jam|batre|pesan\nContoh: .iqc 18:00|40|hai hai' }, { quoted: m });
        return;
    }

    let [time, battery, ...msg] = text.split('|');
    if (!time || !battery || msg.length === 0) {
        await sock.sendMessage(m.key.remoteJid, { text: 'Format salahh gunakan:\n.iqc jam|batre|pesan\nContoh:\n.iqc 18:00|40|hai hai' }, { quoted: m });
        return;
    }
    let messageText = encodeURIComponent(msg.join('|').trim());
    let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${battery}&carrierName=INDOSAT&messageText=${messageText}&emojiStyle=apple`;

    try {
        let res = await fetch(url);
        if (!res.ok) {
            await sock.sendMessage(m.key.remoteJid, { text: 'Gagal fetch url: ' + res.status + ' ' + res.statusText }, { quoted: m });
            return;
        }

        let buffer = await res.buffer();
        await sock.sendMessage(m.key.remoteJid, { image: buffer }, { quoted: m });
    } catch (error) {
        console.error("[IQC ERROR]", error);
        await sock.sendMessage(m.key.remoteJid, { text: `Terjadi kesalahan: ${error.message}` }, { quoted: m });
    }
};

handler.help = ['iqc jam|batre|pesan'];
handler.tags = ['maker'];
handler.command = ['iqc'];

export default handler;