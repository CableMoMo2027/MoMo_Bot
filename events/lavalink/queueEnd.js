module.exports = {
	name: 'queueEnd',
	execute(player, client) {
		const channel = client.channels.cache.get(player.textChannel);

		if (channel) {
			channel.send('✅ เล่นเพลงในคิวหมดแล้ว!');
		}
		player.destroy();
	},
};