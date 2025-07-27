const handler = async (m, plug) => {
    const { sock } = plug;

    const menubot = `
Hallo kak👋
Owner script: https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z
`;
    await sock.sendMessage(m.key.remoteJid, { text: menubot.trim() });
};

handler.help = ['menu'];
handler.tags = ['general'];
handler.command = ["menu"];

export default handler;