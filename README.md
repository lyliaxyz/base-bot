# 📁 Base script bot whatsapp

### 
**Handler untuk perintah rename**
```bash
@param {Object} m Objek pesan mentah dari Baileys.
@param {Object} plug Objek konteks yang diteruskan ke plugin.
@param {string} plug.text Isi pesan yang diketik oleh pengguna.
@param {import('@whiskeysockets/baileys').WASocket} plug.client Objek client Baileys untuk interaksi
```

### 
**Handler untuk perintah rename**
```bash
logger: P({ level: 'silent' }): Ini mengatur sistem pencatatan aktivitas (logging) bot Anda. P adalah alias untuk pino, logger berkinerja tinggi. Dengan level: 'silent', bot tidak akan menampilkan log apapun ke konsol, menjaga tampilan terminal Anda tetap bersih. Anda bisa mengubahnya ke 'info' atau 'debug' jika butuh melihat lebih banyak detail.

printQRInTerminal: true: Pengaturan ini memberitahu Baileys untuk menampilkan QR Code langsung di terminal Anda. Ini krusial untuk proses login awal bot atau saat sesi login Anda kedaluwarsa. Anda perlu memindai QR Code ini menggunakan aplikasi WhatsApp di ponsel Anda.

auth: state: Properti ini menyediakan kredensial sesi login bot Anda. state didapat dari useMultiFileAuthState, yang berfungsi memuat atau menyimpan data sesi bot Anda (misal, di folder baileys_auth_info atau sessions sesuai config.js Anda). Ini memungkinkan bot untuk tetap login tanpa perlu scan QR setiap kali dihidupkan ulang.

browser: Browsers.macOS('Desktop'): Ini mensimulasikan bot Anda terhubung dari aplikasi WhatsApp Desktop di macOS. User-agent ini dapat membantu meningkatkan stabilitas koneksi dan membuatnya terlihat lebih seperti koneksi klien resmi, mengurangi kemungkinan deteksi sebagai aktivitas tidak biasa.

msgRetryCounterMap: {}: Ini adalah objek internal Baileys yang digunakan untuk melacak percobaan pengiriman ulang pesan. Bot menginisialisasi sebagai objek kosong dan Baileys akan mengelolanya secara otomatis untuk memastikan pesan terkirim dengan andal.

retryRequestDelayMs: 250: Ini mengatur penundaan (dalam milidetik) antara percobaan ulang permintaan ke server WhatsApp jika ada masalah jaringan sementara. Nilai 250 ms (0.25 detik) adalah jeda singkat yang baik untuk menunggu sebentar tanpa membuat bot terlalu lambat.

markOnlineOnConnect: false: Dengan pengaturan ini, bot Anda tidak akan otomatis terlihat "online" di WhatsApp segera setelah terhubung. Ini berguna jika Anda ingin bot hanya terlihat online saat aktif merespons, bukan setiap saat.

emitOwnEvents: true: Ini menentukan apakah Baileys akan memancarkan event untuk pesan atau status yang dibuat oleh bot itu sendiri. Ini bisa berguna untuk debugging atau skenario di mana bot perlu memproses pesannya sendiri.

patchMessageBeforeSending: (msg) => { if (msg.contextInfo) delete msg.contextInfo.mentionedJid; return msg; }: Ini adalah fungsi kustom yang dijalankan sebelum setiap pesan dikirim. Baris if (msg.contextInfo) delete msg.contextInfo.mentionedJid; adalah perbaikan umum yang direkomendasikan untuk menghindari bug atau crash terkait properti mentionedJid di Baileys, terutama saat membalas pesan.
```
