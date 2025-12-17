// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('pause')
//         .setDescription('หยุดชั่วคราวหรือเล่นเพลงต่อ')
//         .addStringOption(option =>
//             option.setName('action')
//                 .setDescription('เลือกการกระทำ')
//                 .setRequired(true)
//                 .addChoices(
//                     { name: '⏸️ หยุดเพลง', value: 'pause' },
//                     { name: '▶️ เล่นต่อ', value: 'resume' }
//                 )),
    
//     async execute(interaction, client) {
//         // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel หรือไม่
//         const member = interaction.member;
//         const voiceChannel = member.voice.channel;

//         if (!voiceChannel) {
//             return interaction.reply({
//                 content: '❌ คุณต้องเข้า Voice Channel ก่อนใช้คำสั่งนี้!',
//                 ephemeral: true
//             });
//         }

//         // ดึง player
//         const player = client.riffy.players.get(interaction.guildId);

//         if (!player) {
//             return interaction.reply({
//                 content: '❌ ไม่มีเพลงกำลังเล่นอยู่!',
//                 ephemeral: true
//             });
//         }

//         // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel เดียวกันกับบอทหรือไม่
//         if (voiceChannel.id !== player.voiceChannel) {
//             return interaction.reply({
//                 content: '❌ คุณต้องอยู่ใน Voice Channel เดียวกันกับบอท!',
//                 ephemeral: true
//             });
//         }

//         // ตรวจสอบว่ามีเพลงกำลังเล่นอยู่หรือไม่
//         if (!player.current) {
//             return interaction.reply({
//                 content: '❌ ไม่มีเพลงกำลังเล่นอยู่!',
//                 ephemeral: true
//             });
//         }

//         const action = interaction.options.getString('action');
//         const currentTrack = player.current;

//         try {
//             let embed;

//             if (action === 'pause') {
//                 // ตรวจสอบว่าเพลงหยุดอยู่แล้วหรือไม่
//                 if (player.paused) {
//                     return interaction.reply({
//                         content: '⏸️ เพลงหยุดอยู่แล้ว!',
//                         ephemeral: true
//                     });
//                 }

//                 // หยุดเพลง
//                 player.pause(true);
                
//                 embed = new EmbedBuilder()
//                     .setColor('#FF9900')
//                     .setTitle('⏸️ หยุดเพลงชั่วคราว')
//                     .setDescription(`หยุดเล่น: **${currentTrack.info.title}**`)
//                     .addFields(
//                         { name: '👤 ศิลปิน', value: currentTrack.info.author, inline: true },
//                         { name: '⏱️ ระยะเวลา', value: formatTime(currentTrack.info.length), inline: true },
//                         { name: '🎵 สถานะ', value: '⏸️ หยุดชั่วคราว', inline: true }
//                     )
//                     .setThumbnail(currentTrack.info.thumbnail || null)
//                     .setFooter({ text: `ขอโดย ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
//                     .setTimestamp();

//             } else if (action === 'resume') {
//                 // ตรวจสอบว่าเพลงกำลังเล่นอยู่แล้วหรือไม่
//                 if (!player.paused) {
//                     return interaction.reply({
//                         content: '▶️ เพลงกำลังเล่นอยู่แล้ว!',
//                         ephemeral: true
//                     });
//                 }

//                 // เล่นเพลงต่อ
//                 player.pause(false);
                
//                 embed = new EmbedBuilder()
//                     .setColor('#00FF00')
//                     .setTitle('▶️ เล่นเพลงต่อ')
//                     .setDescription(`กำลังเล่น: **${currentTrack.info.title}**`)
//                     .addFields(
//                         { name: '👤 ศิลปิน', value: currentTrack.info.author, inline: true },
//                         { name: '⏱️ ระยะเวลา', value: formatTime(currentTrack.info.length), inline: true },
//                         { name: '🎵 สถานะ', value: '▶️ กำลังเล่น', inline: true }
//                     )
//                     .setThumbnail(currentTrack.info.thumbnail || null)
//                     .setFooter({ text: `ขอโดย ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
//                     .setTimestamp();
//             }

//             await interaction.reply({ embeds: [embed] });

//         } catch (error) {
//             console.error('Error pausing/resuming:', error);
//             return interaction.reply({
//                 content: '❌ เกิดข้อผิดพลาดในการหยุด/เล่นเพลง!',
//                 ephemeral: true
//             });
//         }
//     }
// };

// // ฟังก์ชันแปลงเวลา (milliseconds เป็น mm:ss)
// function formatTime(ms) {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = Math.floor((ms % 60000) / 1000);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
// }
























const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('หยุดชั่วคราวหรือเล่นเพลงต่อ')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('เลือกการกระทำ')
                .setRequired(true)
                .addChoices(
                    { name: '⏸️ หยุดเพลง', value: 'pause' },
                    { name: '▶️ เล่นต่อ', value: 'resume' }
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

        const action = interaction.options.getString('action');
        const currentTrack = player.current;

        try {
            let embed;

            if (action === 'pause') {
                // ตรวจสอบว่าเพลงหยุดอยู่แล้วหรือไม่
                if (player.paused) {
                    return interaction.reply({
                        content: '⏸️ เพลงหยุดอยู่แล้ว!',
                        flags: 64
                    });
                }

                // หยุดเพลง
                player.pause(true);
                
                embed = new EmbedBuilder()
                    .setColor('#018ec3')
                    .setTitle('⏸️ หยุดเพลงชั่วคราว')
                    .setDescription(`หยุดเล่น: **${currentTrack.info.title}**`)
                    .addFields(
                        { name: '👤 ศิลปิน', value: currentTrack.info.author, inline: true },
                        { name: '⏱️ ระยะเวลา', value: formatTime(currentTrack.info.length), inline: true },
                        { name: '🎵 สถานะ', value: '⏸️ หยุดชั่วคราว', inline: true }
                    )
                    .setThumbnail(currentTrack.info.thumbnail || null)
                    .setFooter({ text: `ขอโดย ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

            } else if (action === 'resume') {
                // ตรวจสอบว่าเพลงกำลังเล่นอยู่แล้วหรือไม่
                if (!player.paused) {
                    return interaction.reply({
                        content: '▶️ เพลงกำลังเล่นอยู่แล้ว!',
                        flags: 64
                    });
                }

                // เล่นเพลงต่อ
                player.pause(false);
                
                embed = new EmbedBuilder()
                    .setColor('#018ec3')
                    .setTitle('▶️ เล่นเพลงต่อ')
                    .setDescription(`กำลังเล่น: **${currentTrack.info.title}**`)
                    .addFields(
                        { name: '👤 ศิลปิน', value: currentTrack.info.author, inline: true },
                        { name: '⏱️ ระยะเวลา', value: formatTime(currentTrack.info.length), inline: true },
                        { name: '🎵 สถานะ', value: '▶️ กำลังเล่น', inline: true }
                    )
                    .setThumbnail(currentTrack.info.thumbnail || null)
                    .setFooter({ text: `ขอโดย ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error pausing/resuming:', error);
            return interaction.reply({
                content: '❌ เกิดข้อผิดพลาดในการหยุด/เล่นเพลง!',
                flags: 64
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