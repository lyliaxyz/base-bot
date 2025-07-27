    import fetch from 'node-fetch';

    const handler = async (m, plug) => {
        const { sock, args } = plug;

        if (!args) {
            await sock.sendMessage(m.key.remoteJid, { text: "Penggunaan: !getfile <URL_file_raw>" });
            return;
        }

        const fileUrl = args;

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                await sock.sendMessage(m.key.remoteJid, { text: `Gagal mengambil file: ${response.status} ${response.statusText}` });
                return;
            }
            const fileContent = await response.text();
            await sock.sendMessage(m.key.remoteJid, { text: `*${fileUrl}*\n\`\`\`\n${fileContent}\n\`\`\`` });
        } catch (error) {
            console.error("[GETFILE ERROR]", error);
            await sock.sendMessage(m.key.remoteJid, { text: `Terjadi kesalahan saat mengambil file: ${error.message}` });
        }
    };

    handler.help = ['getfile <URL_file_raw>'];
    handler.tags = ['utility'];
    handler.command = ["getfile"];

    export default handler;
