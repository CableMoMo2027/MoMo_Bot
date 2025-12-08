// const { Events } = require('discord.js');

// module.exports = {
// 	name: Events.ClientReady,
// 	once: true,
// 	execute(client) {
// 		console.log(`Ready! Logged in as ${client.user.tag}`);
		
// 		// Initialize Riffy
// 		client.riffy.init(client);
// 		console.log(`[RIFFY] Initialized`);
// 	},
// };

const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Ready! Logged in as ${client.user.tag}`);

        client.riffy.init(client.user.id);

		// Initialize Riffy
		client.riffy.init(client);
		console.log(`[RIFFY] Initialized`);
    },
};
