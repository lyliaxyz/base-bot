# 📁 Base script bot whatsapp

### 
**Daftar script**
```bash

├── package.json
├── index.js                 <-- File utama bot Anda (titik masuk)
├── sesi/      <-- Folder untuk menyimpan sesi WhatsApp (otomatis dibuat)
│   ├── creds.json
│   └── ... (file sesi lainnya)
└── command/                <-- Folder untuk semua perintah (plugins) bot
    ├── menu.js             <-- Contoh plugin untuk perintah 'menu'
    └── ... (plugin lainnya)
```

### 
**Handler untuk perintah rename**
```bash
@param {Object} m Objek pesan mentah dari Baileys.
@param {Object} plug Objek konteks yang diteruskan ke plugin.
@param {string} plug.text Isi pesan yang diketik oleh pengguna.
@param {import('@whiskeysockets/baileys').WASocket} plug.client Objek client Baileys untuk interaksi
```
