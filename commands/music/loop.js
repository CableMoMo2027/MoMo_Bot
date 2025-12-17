const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('ตั้งค่าการวนซ้ำเพลง')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('เลือกโหมดการวนซ้ำ')
                .setRequired(true)
                .addChoices(
                    { name: '🔁 วนซ้ำเพลงปัจจุบัน', value: 'track' },
                    { name: '🔂 วนซ้ำทั้งคิว', value: 'queue' },
                    { name: '❌ ปิดการวนซ้ำ', value: 'off' }
                )),
    
    async execute(interaction, client) {
        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel หรือไม่
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องเข้า Voice Channel ก่อนใช้คำสั่งนี้!',
                flags: 64, // EPHEMERAL flag
            });
        }

        // ดึง player
        const player = client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: '❌ ไม่มีเพลงกำลังเล่นอยู่!',
                flags: 64, // EPHEMERAL flag
            });
        }

        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel เดียวกันกับบอทหรือไม่
        if (voiceChannel.id !== player.voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องอยู่ใน Voice Channel เดียวกันกับบอท!',
                flags: 64, // EPHEMERAL flag
            });
        }

        // ตรวจสอบว่ามีเพลงกำลังเล่นอยู่หรือไม่
        if (!player.current) {
            return interaction.reply({
                content: '❌ ไม่มีเพลงกำลังเล่นอยู่!',
                flags: 64, // EPHEMERAL flag
            });
        }

        const mode = interaction.options.getString('mode');
        const currentTrack = player.current;

        try {
            let embed;

            switch (mode) {
                case 'track':
                    // วนซ้ำเพลงปัจจุบัน
                    player.setLoop('track');
                    embed = new EmbedBuilder()
                        .setColor('#018ec3')
                        .setTitle('🔁 เปิดการวนซ้ำเพลงปัจจุบัน')
                        .setDescription(`กำลังวนซ้ำ: **${currentTrack.info.title}**`)
                        .addFields(
                            { name: '👤 ศิลปิน', value: currentTrack.info.author, inline: true },
                            { name: '⏱️ ระยะเวลา', value: formatTime(currentTrack.info.length), inline: true }
                        )
                        .setThumbnail(currentTrack.info.thumbnail || null)
                        .setTimestamp();
                    break;

                case 'queue':
                    // วนซ้ำทั้งคิว
                    player.setLoop('queue');
                    embed = new EmbedBuilder()
                        .setColor('#018ec3')
                        .setTitle('🔂 เปิดการวนซ้ำทั้งคิว')
                        .setDescription(`กำลังเล่น: **${currentTrack.info.title}**`)
                        .addFields(
                            { name: '🎵 จำนวนเพลงในคิว', value: `${player.queue.size + 1} เพลง`, inline: true },
                            { name: '⏱️ เพลงปัจจุบัน', value: formatTime(currentTrack.info.length), inline: true }
                        )
                        .setThumbnail(currentTrack.info.thumbnail || null)
                        .setTimestamp();
                    break;

                case 'off':
                    // ปิดการวนซ้ำ
                    player.setLoop('none');
                    embed = new EmbedBuilder()
                        .setColor('#018ec3')
                        .setTitle('❌ ปิดการวนซ้ำแล้ว')
                        .setDescription(`กำลังเล่น: **${currentTrack.info.title}**`)
                        .addFields(
                            { name: '🎵 สถานะ', value: 'เล่นปกติ (ไม่วนซ้ำ)', inline: true },
                            { name: '📝 คิว', value: `${player.queue.size} เพลงถัดไป`, inline: true }
                        )
                        .setThumbnail(currentTrack.info.thumbnail || null)
                        .setTimestamp();
                    break;

                default:
                    return interaction.reply({
                        content: '❌ โหมดไม่ถูกต้อง!',
                        flags: 64, // EPHEMERAL flag
                    });
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error setting loop mode:', error);
            return interaction.reply({
                content: '❌ เกิดข้อผิดพลาดในการตั้งค่าการวนซ้ำ!',
                flags: 64, // EPHEMERAL flag
            });
        }
    }
};

// ฟังก์ชันแปลงเวลา (milliseconds เป็น mm:ss)
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}