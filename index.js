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
import { pathToFileURL } from 'url';

import globalConfig from './settings/config.js';

let currentSock = null;

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
                const fileUrl = pathToFileURL(filePath).href;
                const pluginModule = await import(fileUrl);
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
        try {
            if (currentSock && typeof currentSock.end === 'function') {
                await currentSock.end();
            }
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

            if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.badSession) {
                console.log('[PERINGATAN] Sesi buruk atau logout! Hapus folder "sesi" dan scan ulang untuk memulai sesi baru.');
                connectToWhatsApp();
            } else if (reason === DisconnectReason.connectionClosed ||
                reason === DisconnectReason.connectionLost ||
                reason === DisconnectReason.restartRequired ||
                reason === DisconnectReason.timedOut) {
                console.log('[INFO] Koneksi terputus/restart diperlukan, mencoba menyambungkan ulang...');
                connectToWhatsApp();
            } else {
                console.log(`[ERROR] Koneksi ditutup dengan alasan tidak terduga: ${reason}, ${lastDisconnect?.error}`);
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
                        messageBody = msg.message.imageMessage.caption;
                    } else if (msg.message.videoMessage?.caption) {
                        messageBody = msg.message.videoMessage.caption;
                    } else if (msg.message.listMessage?.description) {
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

                    const parts = lowerCaseBody.split(' ');
                    const command = parts[0];
                    const args = parts.slice(1).join(' ');

                    const plug = {
                        sock,
                        command: command,
                        text: messageBody,
                        args: args,
                        isBot: msg.key.fromMe,
                        m: msg,
                        config: globalConfig
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
