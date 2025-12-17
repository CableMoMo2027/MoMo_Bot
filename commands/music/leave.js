const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('ให้บอทออกจาก Voice Channel'),

    async execute(interaction) {
        const client = interaction.client;

        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel หรือไม่
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องเข้า Voice Channel ก่อนใช้คำสั่งนี้!',
                flags: 64
            });
        }

        // ดึง player จาก client.riffy
        const player = client.riffy?.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: '❌ บอทไม่ได้อยู่ใน Voice Channel!',
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

        // เก็บ channel ID ก่อน destroy
        const channelId = voiceChannel.id;

        // ทำลาย player และออกจาก voice channel
        player.destroy();

        // สร้าง Embed (ใช้ <#id> เพื่อให้กดไปที่ channel ได้)
        const embed = new EmbedBuilder()
            .setColor('#018ec3')
            .setAuthor({
                name: 'Disconnected!',
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`MoMo just leave from <#${channelId}>.`);

        await interaction.reply({ embeds: [embed] });
    }
};
