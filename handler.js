export const setupMessageHandler = (sock, loadedPlugins, globalConfig, userLimits, checkAndApplyLimit) => {
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            const now = Date.now();

            for (let msg of messages) {
                if (msg.key.fromMe || !msg.message) {
                    continue;
                }

                const isGroup = msg.key.remoteJid.endsWith('@g.us');

                let messageBody = '';
                if (msg.message.conversation) {
                    messageBody = msg.message.conversation;
                } else if (msg.message.extendedTextMessage?.text) {
                    messageBody = msg.message.extendedTextMessage.text;
                } else if (msg.message.imageMessage?.caption) {
                    messageBody = msg.message.imageMessage.caption;
                } else if (msg.message.videoMessage?.caption) {
                    messageBody = msg.message.videoMessage.caption;
                } else if (msg.message.listMessage?.description) {
                    messageBody = msg.message.listMessage.description;
                } else if (msg.message.buttonsMessage?.content?.text) {
                    messageBody = msg.message.buttonsMessage.content.text;
                } else if (msg.message.templateButtonReplyMessage?.selectedDisplayText) {
                    messageBody = msg.message.templateButtonReplyMessage.selectedDisplayText;
                } else if (msg.message.reaction?.text) {
                    messageBody = msg.message.reaction.text;
                } else if (msg.message.stickerMessage) {
                    continue;
                }

                const sender = msg.key.remoteJid;
                const lowerCaseBody = messageBody.toLowerCase().trim();

                let command = '';
                let args = '';

                const prefix = globalConfig.prefix;

                if (lowerCaseBody.startsWith(prefix)) {
                    const contentWithoutPrefix = lowerCaseBody.slice(prefix.length).trim();
                    const parts = contentWithoutPrefix.split(' ');
                    command = parts[0];
                    args = parts.slice(1).join(' ');
                } else {
                    console.log(`[INFO] Pesan non-perintah (tanpa prefix) dari ${sender}: "${messageBody}"`);
                    continue;
                }

                const plug = {
                    sock,
                    command: command,
                    text: messageBody,
                    args: args,
                    isBot: msg.key.fromMe,
                    m: msg,
                    config: globalConfig,
                    isGroup: isGroup
                };

                let commandHandled = false;
                let matchedCommand = '';

                console.log(`[PESAN MASUK] Dari: ${sender} | Tipe: ${Object.keys(msg.message)[0]} | Body: "${messageBody}" | Group: ${isGroup ? 'Ya' : 'Tidak'}`);
                console.log(`[DETEKSI PERINTAH] Command: "${command}" | Args: "${args}"`);


                for (let pluginHandler of loadedPlugins) {
                    if (typeof pluginHandler === 'function' && pluginHandler.command) {
                        const commandsToMatch = Array.isArray(pluginHandler.command) ? pluginHandler.command : [pluginHandler.command];

                        const foundCommand = commandsToMatch.find(cmd => cmd === command);
                        if (foundCommand) {
                            if (pluginHandler.group && !isGroup) {
                                await sock.sendMessage(sender, { text: globalConfig.mess.ingroup }, { quoted: msg });
                                console.log(`[INFO PERINTAH] Perintah "${foundCommand}" hanya untuk grup, tapi digunakan di chat pribadi oleh ${sender}.`);
                                commandHandled = true;
                                break;
                            }

                            if (pluginHandler.private && isGroup) {
                                await sock.sendMessage(sender, { text: globalConfig.mess.privateChat }, { quoted: msg });
                                console.log(`[INFO PERINTAH] Perintah "${foundCommand}" hanya untuk chat pribadi, tapi digunakan di grup oleh ${sender}.`);
                                commandHandled = true;
                                break;
                            }

                            if (globalConfig.limit.enable && pluginHandler.limit) {
                                const userJid = msg.key.participant || msg.key.remoteJid;
                                if (userJid.replace(/@.+/, '') === globalConfig.owner) {
                                     console.log(`[INFO LIMIT] Owner ${userJid} menggunakan perintah "${foundCommand}", tanpa limit.`);
                                } else if (!checkAndApplyLimit(userJid)) {
                                    const userData = userLimits[userJid];
                                    const timeDiff = userData.lastUsed + globalConfig.limit.resetIntervalMs - now;
                                    const remainingHours = Math.ceil(timeDiff / (60 * 60 * 1000));
                                    const remainingMinutes = Math.ceil(timeDiff / (60 * 1000));
                                    
                                    let remainingTimeMessage;
                                    if (remainingHours > 0) {
                                        remainingTimeMessage = `${remainingHours} jam`;
                                    } else {
                                        remainingTimeMessage = `${remainingMinutes} menit`;
                                    }

                                    let limitMessage = globalConfig.limit.message
                                        .replace('%maxDaily%', globalConfig.limit.maxDaily)
                                        .replace('%resetHours%', globalConfig.limit.resetIntervalMs / (60 * 60 * 1000))
                                        .replace('%remainingTime%', remainingTimeMessage);

                                    await sock.sendMessage(sender, { text: limitMessage }, { quoted: msg });
                                    console.log(`[LIMIT TERDAHLANG] Pengguna ${userJid} mencapai limit untuk perintah "${foundCommand}".`);
                                    commandHandled = true;
                                    break;
                                } else {
                                     console.log(`[INFO LIMIT] Pengguna ${userJid} menggunakan perintah "${foundCommand}", sisa limit: ${globalConfig.limit.maxDaily - userLimits[userJid].count}`);
                                }
                            }

                            try {
                                await pluginHandler(msg, plug);
                                commandHandled = true;
                                matchedCommand = foundCommand;
                                console.log(`[PERINTAH DITERIMA] "${matchedCommand}" dari ${sender}`);
                                break;
                            } catch (error) {
                                console.error(`[ERROR EXECUTION] Gagal menjalankan perintah "${foundCommand}" dari ${sender}:`, error);
                                await sock.sendMessage(sender, { text: `Maaf, terjadi kesalahan saat menjalankan perintah "${foundCommand}". Silakan coba lagi nanti.` }, { quoted: msg });
                            }
                        }
                    }
                }
            }
        }
    });
};

