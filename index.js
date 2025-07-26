import { createRequire } from 'module';
import qrcode from 'qrcode-terminal';
import pkg from '@whiskeysockets/baileys';
const { makeWASocket, useMultiFileAuthState, DisconnectReason, Presence, Browsers } = pkg;

import { Boom } from '@hapi/boom';
import P from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

let currentSock = null;

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cjsStyleData = {
    message: "Data dalam gaya CommonJS"
};

export const esmMessage = "Pesan dari ES Module export";

console.log('\n=====================================');
console.log('         BOT WHATSAPP DIMULAI        ');
console.log('=====================================\n');

const PLUGINS_DIR = path.resolve(__dirname, "./command");

const pluginsLoader = async (directory) => {
    let plugins = [];
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        if (filePath.endsWith(".js")) {
            try {
                const pluginModule = await import(filePath);
                const pluginHandler = pluginModule.default;

                if (typeof pluginHandler === 'function' && pluginHandler.command) {
                    plugins.push(pluginHandler);
                } else {
                    console.log(`[PLUGIN ERROR] Plugin ${filePath} tidak memiliki struktur yang diharapkan (export default function dengan properti 'command').`);
                }
            } catch (error) {
                console.log(`[PLUGIN ERROR] Gagal memuat plugin ${filePath}:`, error);
            }
        }
    }
    return plugins;
};

async function connectToWhatsApp() {
    if (currentSock) {
        console.log('[RESTART] Menutup koneksi WhatsApp sebelumnya...');
        try {
            await currentSock.end();
        } catch (error) {
            console.log('[RESTART ERROR] Gagal menutup koneksi sebelumnya:', error);
        }
        currentSock = null;
    }

    const { state, saveCreds } = await useMultiFileAuthState('sesi');

    const sock = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: true,
      auth: state,
      browser: Browsers.macOS('Desktop'),
      msgRetryCounterMap: {},
      retryRequestDelayMs: 250,
      markOnlineOnConnect: false,
      emitOwnEvents: true,
      patchMessageBeforeSending: (msg) => {
        if (msg.contextInfo) delete msg.contextInfo.mentionedJid;
        return msg;
      }
    });

    currentSock = sock;

    const pluginsDisable = false;
    const loadedPlugins = await pluginsLoader(PLUGINS_DIR);
    console.log(`[PLUGIN LOADER] Memuat ${loadedPlugins.length} plugin dari ${PLUGINS_DIR}`);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n[QR] Silakan scan QR code ini dengan aplikasi WhatsApp Anda:');
            qrcode.generate(qr, { small: true });
            return;
        }

        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(`[KONEKSI] Terputus. Status Kode: ${reason}`);
            
            if (currentSock === null && reason !== DisconnectReason.loggedOut && reason !== DisconnectReason.badSession) {
                console.log('[RESTART] Koneksi ditutup karena file utama diubah, menunggu proses restart.');
                return;
            }

            if (reason === DisconnectReason.badSession) {
                console.log('[PERINGATAN] Sesi buruk! Hapus folder "baileys_auth_info" dan scan ulang.');
                connectToWhatsApp();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log('[INFO] Koneksi ditutup, mencoba menyambungkan ulang...');
                connectToWhatsApp();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log('[INFO] Koneksi terputus, mencoba menyambungkan ulang...');
                connectToWhatsApp();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log('[PERINGATAN] Perangkat logout! Hapus folder "baileys_auth_info" dan scan ulang.');
                connectToWhatsApp();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log('[INFO] Restart diperlukan, mencoba menyambungkan ulang...');
                connectToWhatsApp();
            } else if (reason === DisconnectReason.timedOut) {
                console.log('[INFO] Timeout, mencoba menyambungkan ulang...');
                connectToWhatsApp();
            } else {
                console.log(`[ERROR] Koneksi ditutup: ${reason}, ${lastDisconnect?.error}`);
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('[KONEKSI] Berhasil terhubung ke WhatsApp!');
        } else if (connection === 'connecting') {
            console.log('[KONEKSI] Sedang mencoba terhubung...');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            for (let msg of messages) {
                if (!msg.key.fromMe && msg.message) {
                    let messageBody = '';
                    if (msg.message.conversation) {
                        messageBody = msg.message.conversation;
                    } else if (msg.message.extendedTextMessage?.text) {
                        messageBody = msg.message.extendedTextMessage.text;
                    } else if (msg.message.imageMessage?.caption) {
                        messageBody = msg.message.imageMessage?.caption;
                    } else if (msg.message.videoMessage?.caption) {
                        messageBody = msg.message.videoMessage.caption;
                    }
                    else if (msg.message.listMessage?.description) {
                           messageBody = msg.message.listMessage.description;
                    } else if (msg.message.buttonsMessage?.content?.text) {
                           messageBody = msg.message.buttonsMessage.content.text;
                    } else if (msg.message.templateButtonReplyMessage?.selectedDisplayText) {
                           messageBody = msg.message.templateButtonReplyMessage.selectedDisplayText;
                    } else if (msg.message.reactionMessage?.text) {
                           messageBody = msg.message.reactionMessage.text;
                    }

                    const sender = msg.key.remoteJid;
                    const lowerCaseBody = messageBody.toLowerCase().trim();
                    const command = lowerCaseBody.split(' ')[0];

                    if (pluginsDisable) {
                           console.log(`[INFO] Plugin dinonaktifkan. Pesan tidak diproses sebagai perintah dari ${sender}.`);
                           continue;
                    }

                    const plug = {
                        sock,
                        command: command,
                        text: messageBody,
                        isBot: msg.key.fromMe,
                        cjsStyleData: cjsStyleData,
                        esmMessage: esmMessage,
                        m: msg,
                    };

                    let commandHandled = false;
                    let matchedCommand = '';
                    for (let pluginHandler of loadedPlugins) {
                        if (typeof pluginHandler === 'function' && pluginHandler.command) {
                            const commandsToMatch = Array.isArray(pluginHandler.command) ? pluginHandler.command : [pluginHandler.command];

                            console.log(`[DEBUG KOMPARASI] Mencoba mencocokkan perintah: "${command}" dengan plugin: "${pluginHandler.command}"`);

                            const foundCommand = commandsToMatch.find(cmd => cmd === command);
                            if (foundCommand) {
                                await pluginHandler(msg, plug);
                                commandHandled = true;
                                matchedCommand = foundCommand;
                                break;
                            }
                        }
                    }

                    if (commandHandled) {
                        console.log(`[PERINTAH DITERIMA] ${matchedCommand} dari ${sender}`);
                    } else {
                        console.log(`[INFO] Pesan tidak diproses sebagai perintah dari ${sender}: "${messageBody}"`);
                    }
                }
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

connectToWhatsApp();

let fileToWatch = require.resolve(__filename)

fs.watchFile(fileToWatch, () => {
    fs.unwatchFile(fileToWatch);
    console.log(`\x1b[0;32m${__filename}\x1b[1;32m updated! Merestart bot...\x1b[0m`);
    if (currentSock) {
        currentSock.end().catch(e => console.error("[RESTART ERROR] Gagal menutup koneksi socket:", e));
        currentSock = null;
    }
    delete require.cache[fileToWatch]; 
    require(fileToWatch); 
});
