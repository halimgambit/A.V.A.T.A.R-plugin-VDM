import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function init () {
    await Avatar.lang.addPluginPak('VDM');
}

export async function action(data, callback) {
    try {
        const L = await Avatar.lang.getPak('VDM', data.language);

        const tblActions = {
            getVdm: () => getVdm(data.client, L, callback)
        };

        info("VDM:", data.action.command, "from", data.client);

        if (tblActions[data.action.command]) {
            await tblActions[data.action.command]();
        } else {
            callback();
        }

    } catch (err) {
        error("VDM Error:", err.message);
        if (data.client) Avatar.Speech.end(data.client);
        callback();
    }
};

const getVdm = async (client, L, callback) => {
    try {
        const response = await fetch('http://www.viedemerde.fr/aleatoire');
        
        if (response.status !== 200) {
            throw new Error(L.get(["speech.errorHttp"]));
        }
        
        const html = await response.text();
        const $ = cheerio.load(html);

        const firstVdm = $('a.block.text-blue-500.dark\\:text-white.my-4').first().text().trim();

        if (!firstVdm) {
            throw new Error(L.get(["speech.errorEmpty"]));
        }

        const texte = L.get(["speech.vdm", firstVdm]);

        info(texte);

        Avatar.speak(texte, client, () => { 
            callback();
        });

    } catch (err) {
        Avatar.speak(`${L.get(["speech.errorAccess"])}, ${err.message}`, client, () => {
            callback();
        });
    }
}
