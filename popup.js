function registerSettings() {
	// Create the setting for disabling/re-enabling the popup.
	game.settings.register("foundry-pf2e-mukrags-trove", "popupVis", {
		name: "Renable One-Time Popup",
		scope: "client",
		hint: "Renables the popup displayed when the module was first activated, will force a reload to immediately present the pop up, useful if you need to retrive the bug report URL ",
		requiresReload: true,
		config: true,
		type: Boolean,
		default: true
})
};

Hooks.once("init", () => {
	//Wait until the game is initialized, then register the settings created previously.
	registerSettings();
});

Hooks.once('ready', async function () {
    if (game.user.isGM) {
        if (game.settings.get("foundry-pf2e-mukrags-trove", "popupVis") == true) {
            let d = new Dialog({
                title: "Premium Content Activated",

                content: `
                <h3>
								Thank you for purchasing Mukrag's Trove of Soul and Matter by James Beck and Dylan Wokeck, with art by Aeledfyr!
								</h3>
								<p>
								This FoundryVTT module has been prepared by Avery for Eldritch Osiris Games, please report any bugs to:
								<a href="https://github.com/Eldritch-Osiris-Games/foundry-pf2e-mukrags-trove/issues">GitHub</a>
								</p>
                `,
                buttons: {
                    one: {
                        label: "Close",
                        callback: () => game.settings.set("foundry-pf2e-mukrags-trove", "popupVis", false)
                    },
                },
            },{ width: 450});
            d.render(true);
        }
    }

if(game.modules.get("pf2e-tokens-bestiaries")?.active){
	async function getJSON(path){
		const response = await fetch(path);
		const json = await response.json();
		return json;
	}
	async function replaceArt(){
	    let filepath = `modules/foundry-pf2e-mukrags-trove/scripts/token_art.json`;
	    let actors = await getJSON(filepath);
	    const updates = actors.map(a => ({_id: a.id, img: a.data.token.img2, token: { img: a.data.token.img,}}));
	    let gamePack = 'foundry-pf2e-mukrags-trove.mukrags-trove-actors'
	    try {
	        const pack = game.packs.get(gamePack);
	        pack.configure({locked: false})
	        const docs = await pack.getDocuments();
	        const updated = await Actor.updateDocuments(updates, {pack: gamePack});
	        pack.configure({locked: true});
				} catch (error) {
        console.error(`Could not load data for ${gamePack}. That pack may not exist in this world or it may be damaged.`)
    }
 }
 replaceArt();
}


})
