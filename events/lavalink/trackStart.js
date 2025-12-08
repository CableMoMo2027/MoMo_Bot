// events/lavalink/trackStart.js
module.exports = {
    name: 'trackStart',
    execute(client, player, track) {
        const channel = global.client.channels.cache.get(player.textChannel);
        if (!channel) return;

        channel.send({
            content: `🎶 กำลังเล่น: **${track.info.title}** โดย **${track.info.author}**`
        });
    },
};
