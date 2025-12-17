const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('ข้ามไปเล่นเพลงถัดไปในคิว'),

    async execute(interaction, client) {
        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel หรือไม่
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องเข้า Voice Channel ก่อนใช้คำสั่งนี้!',
                flags: 64
            });
        }

        // ดึง player
        const player = client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: '❌ ไม่มีเพลงกำลังเล่นอยู่!',
                flags: 64
            });
        }

        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel เดียวกันกับบอทหรือไม่
        if (voiceChannel.id !== player.voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องอยู่ใน Voice Channel เดียวกันกับบอท!',
                ephemeral: true
            });
        }

        // ดึงเพลงถัดไปก่อน skip
        const nextTrack = player.queue[0];

        // ข้ามไปเพลงถัดไป
        player.stop();

        let description = '⏭️ ข้ามเพลงแล้ว';
        if (nextTrack) {
            description = `⏭️ ข้ามไปเล่น **[${nextTrack.info.title}](${nextTrack.info.uri})**`;
        } else {
            description = '⏭️ ข้ามเพลงแล้ว (ไม่มีเพลงถัดไปในคิว)';
        }

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setAuthor({ name: 'ข้ามเพลง', iconURL: interaction.user.displayAvatarURL() })
            .setDescription(description)
            .setThumbnail(nextTrack?.info?.artworkUrl || nextTrack?.info?.thumbnail || null)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};