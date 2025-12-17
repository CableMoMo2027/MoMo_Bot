require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Riffy } = require('riffy');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
    ]
});

// Load commands
client.commands = new Collection();
client.cooldowns = new Collection();
client.musicQueues = new Map(); 

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`[COMMAND] Loaded: ${command.data.name} from ${path.relative(__dirname, filePath)}`);
        } else {
            console.log(`[WARNING] Missing "data" or "execute" in ${filePath}`);
        }
    }
}

// console.log('lavalink debug :', process.env.LAVALINK_HOST, process.env.LAVALINK_PORT, process.env.LAVALINK_PASSWORD, process.env.LAVALINK_SECURE);

// สร้าง Riffy instance
client.riffy = new Riffy(client, [
    {
        host: process.env.LAVALINK_HOST,
        port: Number(process.env.LAVALINK_PORT),
        password: process.env.LAVALINK_PASSWORD,
        secure: process.env.LAVALINK_SECURE === "true"
    }
], {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: process.env.LAVALINK_SEARCHPLAT, // ใช้ YouTube Music เป็นค่าเริ่มต้น
    restVersion: "v4"
});
const eventsPath = path.join(__dirname, 'events');
const trackStart = require('./events/lavalink/trackStart.js');
const queueEnd = require('./events/lavalink/queueEnd.js');
const nodeConnect = require('./events/lavalink/nodeConnect.js');
const nodeError = require('./events/lavalink/nodeError.js');

client.riffy.on('queueEnd', (player) => {
    queueEnd.execute(client, player);
});

client.riffy.on('nodeConnect', (node) => {
    nodeConnect.execute(client, node);
});

client.riffy.on('nodeError', (node, error) => {
    nodeError.execute(client, node, error);
});

client.on('raw', (d) => {
    client.riffy.updateVoiceState(d);
});

// ฟังก์ชันโหลด events แบบ recursive
function loadEvents(dir) {
	const items = fs.readdirSync(dir, { withFileTypes: true });
	
	for (const item of items) {
		const itemPath = path.join(dir, item.name);
		
		if (item.isDirectory()) {
			// ถ้าเป็น folder ให้เข้าไปโหลดไฟล์ข้างใน
			loadEvents(itemPath);
		} else if (item.isFile() && item.name.endsWith('.js')) {
			// ถ้าเป็นไฟล์ .js ให้โหลด event
			const event = require(itemPath);
			
			// ตรวจสอบว่า event นี้เป็น riffy event หรือ discord event
			if (itemPath.includes('lavalink')) {
				// Riffy events
				if (event.once) {
					client.riffy.once(event.name, (...args) => event.execute(...args, client));
					console.log(`[RIFFY-EVENT] Loaded (once): ${event.name} from ${path.relative(__dirname, itemPath)}`);
				} else {
					client.riffy.on(event.name, (...args) => event.execute(...args, client));
					console.log(`[RIFFY-EVENT] Loaded (on): ${event.name} from ${path.relative(__dirname, itemPath)}`);
				}
			} else {
				// Discord events
				if (event.once) {
					client.once(event.name, (...args) => event.execute(...args, client));
					console.log(`[EVENT] Loaded (once): ${event.name} from ${path.relative(__dirname, itemPath)}`);
				} else {
					client.on(event.name, (...args) => event.execute(...args, client));
					console.log(`[EVENT] Loaded (on): ${event.name} from ${path.relative(__dirname, itemPath)}`);
				}
			}
		}
	}
}

// เริ่มโหลด events
loadEvents(eventsPath);

global.client = client;

// Login
client.login(process.env.TOKEN);
