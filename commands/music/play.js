const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('เล่นเพลงจาก URL หรือค้นหาเพลง')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('ชื่อเพลงหรือ URL ที่ต้องการเล่น')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel หรือไม่
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องเข้า Voice Channel ก่อนใช้คำสั่งนี้!',
                ephemeral: true
            });
        }

        // ตรวจสอบว่า bot มีสิทธิ์เข้า voice channel หรือไม่
        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply({
                content: '❌ บอทไม่มีสิทธิ์เข้า Voice Channel หรือพูดได้!',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const query = interaction.options.getString('query');

        try {
            // ค้นหาเพลง
            const result = await interaction.client.riffy.resolve({
                query: query,
                requester: interaction.user
            });

            if (!result || !result.tracks.length) {
                return interaction.editReply('❌ ไม่พบเพลงที่คุณค้นหา!');
            }

            const { loadType, tracks, playlistInfo } = result;

            // สร้าง player ถ้ายังไม่มี
            let player = interaction.client.riffy.players.get(interaction.guildId);

            if (!player) {
                player = interaction.client.riffy.createConnection({
                    guildId: interaction.guildId,
                    voiceChannel: voiceChannel.id,
                    textChannel: interaction.channelId,
                    deaf: true
                });
            }

            if (loadType === 'playlist') {
                // ถ้าเป็น playlist ให้เพิ่มทั้งหมดเข้าคิว
                for (const track of tracks) {
                    player.queue.add(track);
                }

                await interaction.editReply(
                    `📋 เพิ่ม Playlist: **${playlistInfo.name}** (${tracks.length} เพลง)`
                );
            } else {
                // เพิ่มเพลงเข้าคิว
                const track = tracks[0];
                player.queue.add(track);

                await interaction.editReply(
                    `✅ เพิ่มเข้าคิว: **${track.info.title}** โดย **${track.info.author}**`
                );
            }

            // ถ้าไม่มีเพลงกำลังเล่นอยู่ ให้เริ่มเล่น
            if (!player.playing && !player.paused) {
                player.play();
            }
        } catch (error) {
            console.error('Error in play command:', error);
            return interaction.editReply('❌ เกิดข้อผิดพลาดในการเล่นเพลง!');
        }
    }
};