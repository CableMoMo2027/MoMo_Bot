const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('247')
        .setDescription('Toggle 24/7 mode - keeps bot online in voice channel')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('เลือกโหมด')
                .setRequired(true)
                .addChoices(
                    { name: '🌕 เปิด (On)', value: 'on' },
                    { name: '🌙 ปิด (Off)', value: 'off' }
                )),

    async execute(interaction, client) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;
        const mode = interaction.options.getString('mode');

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
                content: '❌ ไม่มีบอทในห้องเสียง!',
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

        // Set 24/7 mode based on option
        player.twentyFourSeven = (mode === 'on');

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setAuthor({ name: 'โหมด 24/7', iconURL: interaction.user.displayAvatarURL() })
            .setDescription(player.twentyFourSeven
                ? '🌕 เปิดใช้งานโหมด 24/7 แล้ว'
                : '🌙 ปิดใช้งานโหมด 24/7 แล้ว')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};