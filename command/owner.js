// command/sendkontak.js
const handler = async (m, plug) => {
    const { sock } = plug;
    const { owner } = plug.config;

    const phoneNumber = owner;
    const contactName = "Fauzialifatah";

    const vcard = 'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        `FN:${contactName}\n` +
        `TEL;type=CELL;waid=${phoneNumber}:${phoneNumber}\n` +
        'END:VCARD';

    await sock.sendMessage(m.key.remoteJid, {
        contacts: {
            displayName: contactName,
            contacts: [{ vcard }]
        }
    });
};

handler.help = ['owner'];
handler.tags = ['general'];
handler.command = ["kontak"];

export default handler;