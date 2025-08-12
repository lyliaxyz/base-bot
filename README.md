# 📁Script Bot WhatsApp By Fauzialifatah 

### 
**Update script base bot whatsapp yang sudah cukup support @lid ( Local Identifier ) dan @jid ( Jabber ID ) jika ada kendala dalam script tersebut kamu bisa ngefix sendiri atau tungguh update selanjutnya terimakasih atas penggunaan script base sayamenggunakan bailyes costum atau mood agar lebih stabil, Struktur ini mendukung fleksibilitas dalam menggunakan ESM (import/export) proyek Node.js.**

**Bot ini dirancang untuk berjalan dengan Node.js versi 24 atau yang lebih baru, yang mendukung fungsionalitas QR code untuk koneksi WhatsApp.**
```bash

/base-bot/
├── index.js
├── package.json
├── sesi/ (folder ini akan dibuat otomatis oleh Baileys)
├── settings/
│   ├── config.js
│   └── colors.js
├── handler.js
├── command/
│   ├── flux.js
│   ├── menu.js
│   └── deepai.js
└── lib/
    └── scrape/
        ├── deepai-api.js
        └── fluxai-api.js 
```

### 
**Parameter yang Diteruskan ke Plugin Handler:**
```bash
@param {Object} m: Objek pesan mentah dari Baileys.
@param {Object} plug: Objek konteks yang diteruskan ke plugin, berisi properti berikut:
plug.sock: Objek WASocket dari Baileys untuk interaksi (mengirim pesan, dll.).
plug.command: String nama perintah yang terdeteksi.
plug.text: Isi pesan lengkap yang diketik oleh pengguna.
plug.args: Argumen setelah nama perintah.
plug.isBot: Boolean, true jika pesan berasal dari bot itu sendiri.
plug.m: Objek pesan mentah yang sama dengan parameter m (disediakan untuk kemudahan).
plug.config: Objek konfigurasi global bot dari settings/config.js.
plug.isGroup: Boolean, true jika pesan berasal dari grup.
```

[Saluran](https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z)
