const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('ดูคิวเพลงตอนนี้'),

    async execute(interaction, client) {
        console.log('🎵 Queue command - Fixed Version v2.0');

        const player = client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: '❌ ไม่มีเพลงกำลังเล่นอยู่!',
                flags: 64,
            });
        }

        const current = player.current;
        const queue = player.queue;

        if (!current && (!queue || queue.length === 0)) {
            return interaction.reply({
                content: '📭 ตอนนี้ยังไม่มีเพลงในคิวเลย',
                flags: 64,
            });
        }

        // ตั้งค่า Pagination
        const songsPerPage = 10;
        const totalPages = Math.ceil(queue.length / songsPerPage) || 1;
        let currentPage = 1;

        // ฟังก์ชันสร้าง Embed
        const generateEmbed = (page) => {
            const start = (page - 1) * songsPerPage;
            const end = start + songsPerPage;
            const queuePage = queue.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor('#018ec3')
                .setTitle(`Queue: ${interaction.guild.name} (${queue.length + 1} Tracks)`);

            // Now playing
            if (current) {
                let currentTitle = current.info.title.length > 50
                    ? current.info.title.substring(0, 47) + '...'
                    : current.info.title;
                currentTitle = currentTitle.replace(/[\[\]\(\)]/g, '');

                const currentUri = current.info.uri || `https://www.youtube.com/watch?v=${current.info.identifier}`;

                embed.setDescription(
                    `**Now playing**\n` +
                    `[${currentTitle}](${currentUri}) • ${formatTime(current.info.length)}`
                );

                // ปกเพลง
                if (current.info.thumbnail) {
                    embed.setThumbnail(current.info.thumbnail);
                }
            }

            // Separator หลัง Now playing
            if (queue.length > 0) {
                embed.addFields({
                    name: '\u200b',
                    value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                    inline: false
                });
            }

            // แสดงคิว (1 เพลง = 1 field)
            if (queue.length > 0) {
                for (let i = 0; i < queuePage.length; i++) {
                    const track = queuePage[i];
                    const position = start + i + 1;

                    // ลบตัวอักษรพิเศษที่ทำให้ markdown link พัง
                    let title = track.info.title.length > 50
                        ? track.info.title.substring(0, 47) + '...'
                        : track.info.title;
                    title = title.replace(/[\[\]\(\)]/g, '');

                    // สร้าง link จาก uri หรือ identifier
                    const trackUri = track.info.uri || `https://www.youtube.com/watch?v=${track.info.identifier}`;

                    embed.addFields({
                        name: '\u200b',
                        value: `**${position}.** [${title}](${trackUri})  \`${formatTime(track.info.length)}\``,
                        inline: false
                    });
                }
            }

            // Separator ก่อน Settings
            embed.addFields({
                name: '\u200b',
                value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                inline: false
            });

            // Settings
            let loopStatus = '`off`';
            if (player.loop === 'track') loopStatus = '`track`';
            else if (player.loop === 'queue') loopStatus = '`queue`';

            const volume = player.volume || 100;

            embed.addFields({
                name: 'Settings',
                value: `Loop: ${loopStatus}`,
                inline: false
            });

            return embed;
        };

        // ฟังก์ชันสร้างปุ่ม
        const generateButtons = (page, total) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('queue_first')
                    .setLabel('First')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId('queue_prev')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId('queue_page')
                    .setLabel(`Page ${page}/${total}`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('queue_next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === total),
                new ButtonBuilder()
                    .setCustomId('queue_last')
                    .setLabel('Last')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === total)
            );
        };

        // ส่ง Embed แรก
        const embed = generateEmbed(currentPage);
        const components = queue.length > songsPerPage ? [generateButtons(currentPage, totalPages)] : [];

        const response = await interaction.reply({
            embeds: [embed],
            components: components,
            withResponse: true
        });

        // ถ้าไม่มีหลายหน้า ไม่ต้องสร้าง Collector
        if (queue.length <= songsPerPage) return;

        // ดึง message จาก response (Discord.js v14.8+)
        const message = response.resource.message;

        // สร้าง Button Collector
        const collector = message.createMessageComponentCollector({
            time: 300000 // 5 นาที
        });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.user.id !== interaction.user.id) {
                return buttonInteraction.reply({
                    content: '❌ คุณไม่สามารถใช้ปุ่มนี้ได้!',
                    flags: 64
                });
            }

            switch (buttonInteraction.customId) {
                case 'queue_first':
                    currentPage = 1;
                    break;
                case 'queue_prev':
                    currentPage = Math.max(1, currentPage - 1);
                    break;
                case 'queue_next':
                    currentPage = Math.min(totalPages, currentPage + 1);
                    break;
                case 'queue_last':
                    currentPage = totalPages;
                    break;
            }

            await buttonInteraction.update({
                embeds: [generateEmbed(currentPage)],
                components: [generateButtons(currentPage, totalPages)]
            });
        });

        collector.on('end', () => {
            // ปิดปุ่มเมื่อหมดเวลา
            message.edit({
                components: []
            }).catch(() => { });
        });
    }
};

// ฟังก์ชันแปลงเวลา (milliseconds เป็น mm:ss)
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}