const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('หยุดเล่นเพลงและล้างคิวทั้งหมด'),

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
                flags: 64
            });
        }

        // หยุดเพลงและล้างคิว
        player.stop();
        player.queue.clear();

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setAuthor({ name: 'ล้างคิวแล้ว', iconURL: interaction.user.displayAvatarURL() })
            .setDescription('⏹️ หยุดเล่นเพลงและล้างคิวทั้งหมดเรียบร้อย')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};