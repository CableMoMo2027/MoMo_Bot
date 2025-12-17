// events/lavalink/trackStart.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'trackStart',
    execute(client, player, track) {
        const channel = global.client.channels.cache.get(player.textChannel);
        if (!channel) return;

        // สร้าง link จาก uri หรือ identifier
        const trackUri = track.info.uri || `https://www.youtube.com/watch?v=${track.info.identifier}`;

        // ลบตัวอักษรพิเศษที่ทำให้ markdown link พัง
        const title = track.info.title
            .replace(/[\[\]\(\)]/g, '');

        const embed = new EmbedBuilder()
            .setColor('#018ec3')
            .setAuthor({ name: 'Now playing', iconURL: client.user.displayAvatarURL() })
            .setDescription(`**[${title}](${trackUri})**  \`${formatTime(track.info.length)}\`\nRequested by ${track.info.requester || 'Unknown'}`)
            .setThumbnail(track.info.thumbnail || track.info.artworkUrl || null);

        channel.send({ embeds: [embed] });
    },
};

// ฟังก์ชันแปลงเวลา
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
