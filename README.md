# 📁 Bot WhatsApp Fauzialifatah

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced GitHub Stats Card with SVG Icons</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --card-bg: #1e293b; /* Slate-800 */
            --card-border: #334155; /* Slate-700 */
            --text-light: #e2e8f0; /* Slate-200 */
            --text-medium: #94a3b8; /* Slate-400 */
            --primary-color-start: #ec4899; /* Pink-500 */
            --primary-color-end: #a855f7; /* Purple-500 */
            --circle-bg: #334155; /* Slate-700 */
            --circle-inner-bg: #1e293b; /* Same as card bg */
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1a202c, #0f172a); /* Dark gradient background */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 1.5rem;
            overflow: hidden;
        }

        .github-card {
            background-color: var(--card-bg);
            border-radius: 1rem;
            padding: 2rem;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--card-border);
            color: var(--text-light);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            position: relative;
            overflow: hidden;
        }

        .github-card:hover {
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 2px var(--primary-color-end);
        }

        .github-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
            pointer-events: none;
            opacity: 0.8;
            transition: opacity 0.3s ease-in-out;
        }

        .github-card:hover::before {
            opacity: 1;
        }

        .card-title {
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--primary-color-start);
            margin-bottom: 1.5rem;
            text-align: center;
            letter-spacing: -0.025em;
        }

        .stat-grid {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 0.75rem 1.5rem;
            align-items: center;
        }

        .stat-item {
            display: flex;
            align-items: center;
        }

        .icon svg { /* Styling for the SVG itself */
            width: 1.4rem;
            height: 1.4rem;
            stroke: currentColor; /* Use parent's color */
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none; /* No fill by default for outline icons */
            transition: transform 0.2s ease-in-out;
        }

        .icon {
            margin-right: 0.75rem;
            font-size: 1.4rem;
            width: 1.4rem;
            text-align: center;
            color: var(--primary-color-end);
            filter: drop-shadow(0 0 5px rgba(168, 85, 247, 0.4));
        }

        .stat-item:hover .icon svg {
            transform: scale(1.1); /* Slight bounce on hover */
        }

        .stat-label {
            font-weight: 500;
            color: var(--text-medium);
            white-space: nowrap;
        }

        .stat-value {
            font-weight: 700;
            color: var(--text-light);
            font-size: 1.1rem;
        }

        .progress-section {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 2rem;
            position: relative;
        }

        .progress-circle-container {
            position: relative;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: var(--circle-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .progress-circle {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(
                var(--primary-color-start) 0%,
                var(--primary-color-end) 70%,
                transparent 70%
            );
            transition: background 0.5s ease-in-out;
        }

        .progress-circle-inner {
            position: absolute;
            width: 85px;
            height: 85px;
            border-radius: 50%;
            background-color: var(--circle-inner-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            font-weight: 800;
            color: var(--primary-color-end);
            z-index: 1;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
        }

        /* Responsive adjustments */
        @media (min-width: 640px) {
            .card-content-wrapper {
                display: flex;
                align-items: center;
                gap: 2rem;
            }
            .progress-section {
                margin-top: 0;
            }
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen p-4">

    <div class="github-card">
        <h2 class="card-title">Itsukiiiiii's GitHub Stats</h2>

        <div class="card-content-wrapper">
            <div class="stat-grid flex-grow">
                <div class="stat-item">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </span>
                    <span class="stat-label">Total Stars Earned:</span>
                </div>
                <span class="stat-value text-right">34</span>

                <div class="stat-item">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </span>
                    <span class="stat-label">Total Commits (2025):</span>
                </div>
                <span class="stat-value text-right">244</span>

                <div class="stat-item">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="18" cy="18" r="3"></circle>
                            <circle cx="6" cy="6" r="3"></circle>
                            <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                            <line x1="6" y1="9" x2="6" y2="18"></line>
                        </svg>
                    </span>
                    <span class="stat-label">Total PRs:</span>
                </div>
                <span class="stat-value text-right">1</span>

                <div class="stat-item">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </span>
                    <span class="stat-label">Total Issues:</span>
                </div>
                <span class="stat-value text-right">0</span>

                <div class="stat-item">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </span>
                    <span class="stat-label">Contributed to (last year):</span>
                </div>
                <span class="stat-value text-right">0</span>
            </div>

            <div class="progress-section flex-shrink-0">
                <div class="progress-circle-container">
                    <div class="progress-circle"></div>
                    <div class="progress-circle-inner">B-</div>
                </div>
            </div>
        </div>
    </div>

</body>
</html>



### 
**Untuk membuat bot WhatsApp berbasis Baileys yang rapi dan mudah dikelola, penting untuk memiliki tata letak folder dan file yang terstruktur. Ini membantu Anda dan orang lain memahami di mana setiap bagian kode berada. Struktur ini mendukung fleksibilitas dalam menggunakan ESM (import/export) dan CJS (require/module.exports) dalam proyek Node.js Anda.**
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
**Handler untuk perintah rename**
```bash
@param {Object} m Objek pesan mentah dari Baileys.
@param {Object} plug Objek konteks yang diteruskan ke plugin.
@param {string} plug.text Isi pesan yang diketik oleh pengguna.
@param {import('@whiskeysockets/baileys').WASocket} plug.client Objek client Baileys untuk interaksi
```

[Saluran](https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z)
