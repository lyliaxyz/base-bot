import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { watchFile, unwatchFile } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const globalConfig = {
    owner: "6282132710183",
    namaOwner: "fauziS",
    mess: {
        ingroup: "Lucu banget, fitur ini cuma buat grup",
        admin: "tidak lucu, hanya admin grup yang menggunakan fitur ini",
        owner: "Wah! Kamu bukan pemilikku.",
        premium: "Anda bukan pengguna premium",
        seller: "Anda belum memiliki akses sebagai penjual",
        wait: "tolong tunggu kontol"
    }
};
function loadConfig() {
}

let file = __filename;
watchFile(file, () => {
    unwatchFile(file);
    console.log('\x1b[0;32m' + file + ' \x1b[1;32mupdated!\x1b[0m');
});

export default globalConfig;
