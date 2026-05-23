import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function init () {
    await Avatar.lang.addPluginPak('VDM');
}

export async function action(data, callback) {

    const L = await Avatar.lang.getPak('VDM', data.language);

    try {

         const tblActions = {
            getVdm: () => getVdm(data.client, L)
        };

        info("VDM:", data.action.command, L.get("plugin.from"), data.client);

       if (tblActions[data.action.command]) {
            await tblActions[data.action.command]();
        }

    } catch (err) {
        error("VDM Error:", err.message);
        if (data.client) Avatar.Speech.end(data.client);
    }

    callback();
};


const getVdm = async (client, L) => {

	try {

	const response = await fetch('http://www.viedemerde.fr/aleatoire')
	
	if (response.status !== 200) {
	    throw new Error(L.get("speech.errorHttp"));
	}
    
	const html = await response.text();
    const $ = cheerio.load(html);

	const firstVdm = $('a.block.text-blue-500.dark\\:text-white.my-4').first().text();

        if (!firstVdm) {
            throw new Error(L.get("speech.errorEmpty"));
        }


       Avatar.speak(L.get(["speech.vdm", firstVdm]), client, () => { Avatar.Speech.end(client) });

    } catch (err) {
	Avatar.speak(`${L.get("speech.errorAccess")}, ${err.message}`, client, () => {Avatar.Speech.end(client)});
	};
}