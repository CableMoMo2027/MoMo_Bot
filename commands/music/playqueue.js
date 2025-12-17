const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playqueue')
        .setDescription('เลือกเล่นเพลงที่ต้องการจากในคิว'),

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

        const queue = player.queue;

        // ตรวจสอบว่ามีเพลงในคิวหรือไม่
        if (!queue || queue.length === 0) {
            return interaction.reply({
                content: '❌ ไม่มีเพลงในคิว!',
                flags: 64
            });
        }

        // ฟังก์ชันแปลงเวลา
        const formatDuration = (ms) => {
            const seconds = Math.floor(ms / 1000);
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        };

        // ตั้งค่า Pagination
        const songsPerPage = 10;
        const totalSongs = queue.length;
        const totalPages = Math.ceil(totalSongs / songsPerPage) || 1;
        let currentPage = 1;

        // ฟังก์ชันสร้าง Embed
        const generateEmbed = (page) => {
            const start = (page - 1) * songsPerPage;
            const end = start + songsPerPage;
            const queuePage = queue.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor('#018ec3')
                .setTitle('🎵 เลือกเพลงที่ต้องการเล่น')
                .setDescription(`เลือกเพลงจาก Dropdown Menu ด้านล่าง\nทั้งหมด **${totalSongs}** เพลงในคิว`);

            // แสดงคิว - จำกัดความยาวไม่เกิน 1024 ตัวอักษร (Discord limit)
            let queueList = '';
            const maxFieldLength = 1024;

            for (let i = 0; i < queuePage.length; i++) {
                const track = queuePage[i];
                const position = start + i + 1;

                // ลดความยาว title ให้สั้นลงเพื่อให้พอดีกับ limit
                let title = track.info.title.length > 35
                    ? track.info.title.substring(0, 32) + '...'
                    : track.info.title;
                title = title.replace(/[\[\]\(\)]/g, '');

                const trackUri = track.info.uri || `https://www.youtube.com/watch?v=${track.info.identifier}`;
                const duration = formatDuration(track.info.length);

                const line = `**${position}.** [${title}](${trackUri})  \`${duration}\`\n`;

                // ตรวจสอบว่าเพิ่มบรรทัดนี้แล้วจะเกิน limit หรือไม่
                if ((queueList + line).length > maxFieldLength - 20) {
                    queueList += `... และอีก ${queuePage.length - i} เพลง`;
                    break;
                }

                queueList += line;
            }

            embed.addFields({
                name: `📋 คิว (หน้า ${page}/${totalPages})`,
                value: queueList || 'ไม่มีเพลง',
                inline: false
            });

            return embed;
        };

        // ฟังก์ชันสร้าง Select Menu
        const generateSelectMenu = (page) => {
            const start = (page - 1) * songsPerPage;
            const end = start + songsPerPage;
            const queuePage = queue.slice(start, end);

            const options = queuePage.map((track, i) => {
                const position = start + i + 1;
                let title = track.info.title.length > 80
                    ? track.info.title.substring(0, 77) + '...'
                    : track.info.title;

                return {
                    label: `${position}. ${title}`,
                    description: `⏱️ ${formatDuration(track.info.length)}`,
                    value: `track_${start + i}`
                };
            });

            return new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('playq_select')
                    .setPlaceholder('🎵 เลือกเพลงที่ต้องการเล่น...')
                    .addOptions(options)
            );
        };

        // ฟังก์ชันสร้างปุ่ม Pagination
        const generateButtons = (page, total) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('playq_first')
                    .setLabel('First')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId('playq_prev')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId('playq_page')
                    .setLabel(`Page ${page}/${total}`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('playq_next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === total),
                new ButtonBuilder()
                    .setCustomId('playq_last')
                    .setLabel('Last')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === total)
            );
        };

        // สร้าง Cancel button
        const cancelRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('playq_cancel')
                .setLabel('ยกเลิก')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌')
        );

        // สร้าง components
        const getComponents = (page, total) => {
            const components = [generateSelectMenu(page)];
            if (total > 1) {
                components.push(generateButtons(page, total));
            }
            components.push(cancelRow);
            return components;
        };

        // ส่ง Embed แรก
        const response = await interaction.reply({
            embeds: [generateEmbed(currentPage)],
            components: getComponents(currentPage, totalPages),
            withResponse: true
        });

        const message = response.resource.message;

        // สร้าง Collector
        const collector = message.createMessageComponentCollector({
            time: 120000 // 2 นาที
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({
                    content: '❌ คุณไม่สามารถใช้ปุ่มนี้ได้!',
                    flags: 64
                });
            }

            // Handle Cancel
            if (i.customId === 'playq_cancel') {
                collector.stop('cancelled');
                return i.update({
                    content: '❌ ยกเลิกการเลือกเพลงแล้ว',
                    embeds: [],
                    components: []
                });
            }

            // Handle Pagination
            if (i.customId.startsWith('playq_') && i.customId !== 'playq_select') {
                switch (i.customId) {
                    case 'playq_first':
                        currentPage = 1;
                        break;
                    case 'playq_prev':
                        currentPage = Math.max(1, currentPage - 1);
                        break;
                    case 'playq_next':
                        currentPage = Math.min(totalPages, currentPage + 1);
                        break;
                    case 'playq_last':
                        currentPage = totalPages;
                        break;
                }

                return i.update({
                    embeds: [generateEmbed(currentPage)],
                    components: getComponents(currentPage, totalPages)
                });
            }

            // Handle Select Menu
            if (i.customId === 'playq_select') {
                const targetIndex = parseInt(i.values[0].split('_')[1]);
                const targetTrack = queue[targetIndex];
                const position = targetIndex + 1;

                if (!targetTrack) {
                    return i.reply({
                        content: '❌ ไม่พบเพลงที่เลือก!',
                        flags: 64
                    });
                }

                // ลบเพลงก่อนหน้าตำแหน่งที่เลือกออกจากคิว
                if (targetIndex > 0) {
                    queue.splice(0, targetIndex);
                }

                // หยุดเพลงปัจจุบันเพื่อเล่นเพลงถัดไป (ซึ่งตอนนี้คือเพลงที่เลือก)
                player.stop();

                collector.stop('selected');

                // สร้าง Embed แจ้งผลลัพธ์
                const embed = new EmbedBuilder()
                    .setColor('#018ec3')
                    .setTitle('⏭️ ข้ามไปเล่นเพลงที่เลือก')
                    .setDescription(`**[${targetTrack.info.title}](${targetTrack.info.uri})**  \`${formatDuration(targetTrack.info.length)}\``)
                    .setThumbnail(targetTrack.info.artworkUrl || targetTrack.info.thumbnail || null)
                    .setFooter({ text: `กำลังเล่นเพลงที่ ${position} จากทั้งหมด ${totalSongs} เพลงในคิว` });

                return i.update({
                    embeds: [embed],
                    components: []
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                message.edit({
                    content: '⏱️ หมดเวลาในการเลือกเพลง',
                    embeds: [],
                    components: []
                }).catch(() => { });
            }
        });
    }
};
