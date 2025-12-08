const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('next')
        .setDescription('ข้ามไปเล่นเพลงถัดไปในคิว'),
    
    async execute(interaction, client) {
        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel หรือไม่
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องเข้า Voice Channel ก่อนใช้คำสั่งนี้!',
                ephemeral: true
            });
        }

        // ดึง player
        const player = client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: '❌ ไม่มีเพลงกำลังเล่นอยู่!',
                ephemeral: true
            });
        }

        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel เดียวกันกับบอทหรือไม่
        if (voiceChannel.id !== player.voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องอยู่ใน Voice Channel เดียวกันกับบอท!',
                ephemeral: true
            });
        }

        // ตรวจสอบว่ามีเพลงในคิวหรือไม่
        if (player.queue.size === 0) {
            return interaction.reply({
                content: '❌ ไม่มีเพลงถัดไปในคิว!',
                ephemeral: true
            });
        }

        // ข้ามไปเพลงถัดไป
        player.stop();

        await interaction.reply('⏭️ ข้ามไปเพลงถัดไป!');
    }
};