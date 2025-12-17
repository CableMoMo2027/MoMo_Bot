const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('เล่นเพลงจาก URL หรือค้นหาเพลง')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('ชื่อเพลงหรือ URL ที่ต้องการเล่น')
                .setRequired(false)
                .setAutocomplete(true)
        ),
    // .addStringOption(option =>
    //     option.setName('search')
    //         .setDescription('ค้นหาเพลงและแสดงรายการให้เลือก 5 เพลง')
    //         .setRequired(false)
    // ),

    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();

        // ถ้ายังไม่ได้พิมพ์อะไร หรือพิมพ์น้อยเกินไป
        if (!focusedValue || focusedValue.length < 2) {
            return interaction.respond([
                { name: '🔍 พิมพ์ชื่อเพลงอย่างน้อย 2 ตัวอักษร...', value: 'search_placeholder' }
            ]);
        }

        // ตรวจสอบว่าเป็น URL ที่สามารถเล่นได้ทันที
        const isDirectURL = /^(https?:\/\/)?(music\.youtube\.com\/playlist\?list=|open\.spotify\.com\/playlist\/|www\.youtube\.com\/watch\?v=|youtube\.com\/watch\?v=|youtu\.be\/)/i.test(focusedValue);

        if (isDirectURL) {
            try {
                // ดึงข้อมูลจาก URL
                const result = await client.riffy.resolve({
                    query: focusedValue,
                    requester: interaction.user
                });

                if (!result || !result.tracks.length) {
                    const truncatedValue = focusedValue.length > 100 ? focusedValue.substring(0, 100) : focusedValue;
                    return interaction.respond([
                        { name: `🔗 ${focusedValue.substring(0, 90)}`, value: truncatedValue }
                    ]);
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

                // ถ้าเป็น playlist
                if (result.loadType === 'playlist') {
                    const playlistName = result.playlistInfo?.name || 'Unknown Playlist';
                    const trackCount = result.tracks.length;
                    let displayName = `📋 ${playlistName} | ${trackCount} เพลง`;
                    if (displayName.length > 100) {
                        displayName = displayName.substring(0, 97) + '...';
                    }
                    const truncatedValue = focusedValue.length > 100 ? focusedValue.substring(0, 100) : focusedValue;
                    return interaction.respond([
                        { name: displayName, value: truncatedValue }
                    ]);
                }

                // ถ้าเป็นเพลงเดี่ยว
                const track = result.tracks[0];
                const duration = formatDuration(track.info.length);
                const artist = track.info.author || 'Unknown Artist';
                const title = track.info.title || 'Unknown Title';

                let displayName = `🎵 ${title} | ${artist} [${duration}]`;
                if (displayName.length > 100) {
                    displayName = `🎵 ${title.substring(0, 60)}... [${duration}]`;
                }
                if (displayName.length > 100) {
                    displayName = displayName.substring(0, 97) + '...';
                }

                // ใช้ track URI แทน URL ที่ถูก truncate เพื่อให้เล่นเพลงถูกต้อง
                return interaction.respond([
                    { name: displayName, value: track.info.uri }
                ]);

            } catch (error) {
                console.error('URL preview error:', error);
                const truncatedValue = focusedValue.length > 100 ? focusedValue.substring(0, 100) : focusedValue;
                return interaction.respond([
                    { name: `🔗 ${focusedValue.substring(0, 90)}`, value: truncatedValue }
                ]);
            }
        }

        // ตรวจสอบว่าเป็น URL อื่นๆ ที่ไม่ใช่ direct URL
        const isOtherURL = /^(https?:\/\/)/i.test(focusedValue);
        if (isOtherURL) {
            const truncatedValue = focusedValue.length > 100 ? focusedValue.substring(0, 100) : focusedValue;
            return interaction.respond([
                { name: `🔗 ${focusedValue.substring(0, 90)}`, value: truncatedValue }
            ]);
        }

        try {
            // ค้นหาเพลงจาก query
            const result = await client.riffy.resolve({
                query: focusedValue,
                requester: interaction.user
            });

            if (!result || !result.tracks.length) {
                return interaction.respond([
                    { name: '❌ ไม่พบเพลงที่คุณค้นหา', value: 'no_results' }
                ]);
            }

            // ฟังก์ชันแปลงเวลา
            const formatDuration = (ms) => {
                const seconds = Math.floor(ms / 1000);
                const minutes = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            };

            // แปลงผลการค้นหาเป็น choices (สูงสุด 25 รายการ)
            const choices = result.tracks.slice(0, 25).map(track => {
                const duration = formatDuration(track.info.length);
                // จำกัดความยาวให้ไม่เกิน 100 ตัวอักษร (Discord limit)
                const maxTitleLength = 70;
                const title = track.info.title.length > maxTitleLength
                    ? track.info.title.substring(0, maxTitleLength - 3) + '...'
                    : track.info.title;

                // สร้าง name และตรวจสอบความยาว
                let name = `🎵 ${title} [${duration}]`;
                if (name.length > 100) {
                    name = name.substring(0, 97) + '...';
                }

                return {
                    name: name,
                    value: track.info.uri || track.info.title
                };
            });

            await interaction.respond(choices);

        } catch (error) {
            console.error('Autocomplete error:', error);
            return interaction.respond([
                { name: '⚠️ เกิดข้อผิดพลาดในการค้นหา', value: 'error' }
            ]);
        }
    },

    async execute(interaction, client) {
        const queryOption = interaction.options.getString('query');
        const searchOption = interaction.options.getString('search');

        // ตรวจสอบว่าต้องใส่อย่างใดอย่างหนึ่ง
        if (!queryOption && !searchOption) {
            return interaction.reply({
                content: '❌ กรุณาใส่ **query** (ชื่อเพลง/URL) หรือ **search** (ค้นหาเพลง)',
                flags: 64
            });
        }

        // ตรวจสอบว่าใส่ทั้งสองอย่างพร้อมกัน
        if (queryOption && searchOption) {
            return interaction.reply({
                content: '❌ กรุณาเลือกใช้ **query** หรือ **search** อย่างใดอย่างหนึ่ง',
                flags: 64
            });
        }

        // ตรวจสอบว่าผู้ใช้อยู่ใน voice channel หรือไม่
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ คุณต้องเข้า Voice Channel ก่อนใช้คำสั่งนี้!',
                flags: 64
            });
        }

        // ตรวจสอบว่า bot มีสิทธิ์เข้า voice channel หรือไม่
        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply({
                content: '❌ บอทไม่มีสิทธิ์เข้า Voice Channel หรือพูดได้!',
                flags: 64
            });
        }

        await interaction.deferReply();

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

        // ฟังก์ชันเล่นเพลง
        const playTrack = async (track) => {
            try {
                let player = interaction.client.riffy.players.get(interaction.guildId);

                if (!player) {
                    player = interaction.client.riffy.createConnection({
                        guildId: interaction.guildId,
                        voiceChannel: voiceChannel.id,
                        textChannel: interaction.channelId,
                        deaf: true
                    });
                }

                player.queue.add(track);

                // Embed แบบ minimal
                const trackEmbed = new EmbedBuilder()
                    .setColor('#018ec3')
                    .setAuthor({ name: 'Added to queue', iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(`**[${track.info.title}](${track.info.uri})**  \`${formatDuration(track.info.length)}\`\nRequested by ${interaction.user}`)
                    .setThumbnail(track.info.artworkUrl || track.info.thumbnail || null);

                if (!player.playing && !player.paused) {
                    await player.play();
                }

                return trackEmbed;
            } catch (error) {
                console.error('Error playing track:', error);
                throw error;
            }
        };

        try {
            // ========================================
            // กรณีที่ 1: ใช้ query (เล่นโดยตรงด้วย autocomplete)
            // ========================================
            if (queryOption) {
                // ข้าม placeholder และ error values
                if (queryOption === 'search_placeholder' || queryOption === 'no_results' || queryOption === 'error') {
                    return interaction.editReply('❌ กรุณาค้นหาเพลงที่ต้องการใหม่อีกครั้ง');
                }

                // ตรวจสอบว่าเป็น URL หรือมีคำว่า playlist หรือไม่
                const isURL = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com|spotify\.com|soundcloud\.com)/i.test(queryOption);
                const isPlaylist = /playlist/i.test(queryOption);

                // ตรวจสอบ URL ที่สามารถเล่นได้ทันทีโดยไม่ต้อง search (รองรับทั้ง www และไม่มี www)
                const isDirectPlayURL = /^(https?:\/\/)?(www\.)?(music\.youtube\.com\/playlist\?list=|open\.spotify\.com\/playlist\/|youtube\.com\/watch\?v=|youtu\.be\/)/i.test(queryOption);

                // ถ้าเป็น playlist URL ให้ resolve และแสดงข้อมูลก่อน
                if (isPlaylist) {
                    const playlistResult = await interaction.client.riffy.resolve({
                        query: queryOption,
                        requester: interaction.user
                    });

                    if (!playlistResult || !playlistResult.tracks.length) {
                        return interaction.editReply('❌ ไม่พบ Playlist ที่คุณค้นหา!');
                    }

                    const { tracks, playlistInfo } = playlistResult;

                    let player = interaction.client.riffy.players.get(interaction.guildId);

                    if (!player) {
                        player = interaction.client.riffy.createConnection({
                            guildId: interaction.guildId,
                            voiceChannel: voiceChannel.id,
                            textChannel: interaction.channelId,
                            deaf: true
                        });
                    }

                    // เพิ่มทุกเพลงเข้า queue
                    for (const track of tracks) {
                        player.queue.add(track);
                    }

                    const playlistEmbed = new EmbedBuilder()
                        .setColor('#5865F2')
                        .setAuthor({ name: '✨ เพิ่ม Playlist แล้ว', iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`### ${playlistInfo?.name || 'Unknown Playlist'}\n\n> 🎵 **${tracks.length}** เพลง  •  👤 ${interaction.user}\n\n────────────────────`)
                        .setFooter({ text: '🎶 เพลิดเพลินไปกับ MoMo Music', iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp();

                    if (!player.playing && !player.paused) {
                        await player.play();
                    }

                    return interaction.editReply({ embeds: [playlistEmbed] });
                }

                // ถ้าไม่ใช่ playlist ให้ค้นหาปกติ (ถ้าเป็น URL ตรงๆ ไม่ต้อง search)
                const result = await interaction.client.riffy.resolve({
                    query: (isURL || isDirectPlayURL) ? queryOption : queryOption,
                    requester: interaction.user
                });

                // // DEBUG: แสดงค่าที่ได้รับ
                // console.log('=== DEBUG PLAY ===');
                // console.log('queryOption:', queryOption);
                // console.log('isURL:', isURL);
                // console.log('isDirectPlayURL:', isDirectPlayURL);
                // console.log('Query used:', (isURL || isDirectPlayURL) ? queryOption : queryOption);
                // console.log('Result:', result);
                // console.log('Result tracks:', result?.tracks);

                if (!result || !result.tracks.length) {
                    return interaction.editReply('❌ ไม่พบเพลงที่คุณค้นหา!');
                }

                const { loadType, tracks, playlistInfo } = result;

                let player = interaction.client.riffy.players.get(interaction.guildId);

                if (!player) {
                    player = interaction.client.riffy.createConnection({
                        guildId: interaction.guildId,
                        voiceChannel: voiceChannel.id,
                        textChannel: interaction.channelId,
                        deaf: true
                    });
                }

                // จัดการ Playlist (กรณี URL ที่ไม่มีคำว่า playlist แต่เป็น playlist จริง)
                if (loadType === 'playlist') {
                    for (const track of tracks) {
                        player.queue.add(track);
                    }

                    const playlistEmbed = new EmbedBuilder()
                        .setColor('#5865F2')
                        .setAuthor({ name: '✨ เพิ่ม Playlist แล้ว', iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`### ${playlistInfo?.name || 'Unknown Playlist'}\n\n> 🎵 **${tracks.length}** เพลง  •  👤 ${interaction.user}\n\n────────────────────`)
                        .setFooter({ text: '🎶 เพลิดเพลินไปกับ MoMo Music', iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp();

                    if (!player.playing && !player.paused) {
                        await player.play();
                    }

                    return interaction.editReply({ embeds: [playlistEmbed] });
                }

                // จัดการเพลงเดี่ยว
                const track = tracks[0];
                const trackEmbed = await playTrack(track);
                return interaction.editReply({ embeds: [trackEmbed] });

            }
            console.log();
            // ========================================
            // กรณีที่ 2: ใช้ search (ค้นหาและแสดงปุ่มให้เลือก 5 เพลง)
            // ========================================
            if (searchOption) {
                const result = await interaction.client.riffy.resolve({
                    query: searchOption,
                    requester: interaction.user
                });

                if (!result || !result.tracks.length) {
                    return interaction.editReply('❌ ไม่พบเพลงที่คุณค้นหา!');
                }

                const tracks = result.tracks;
                const searchResults = tracks.slice(0, 5);

                // สร้าง Embed แสดงผลการค้นหา พร้อมปกเพลงแรก
                const firstTrack = searchResults[0];
                const searchEmbed = new EmbedBuilder()
                    .setColor('#018ec3')
                    .setTitle('🔍 ผลการค้นหาเพลง')
                    .setDescription(`กรุณาเลือกเพลงที่ต้องการเล่น (ภายใน 60 วินาที)\n\n${searchResults.map((track, index) => {
                        const duration = formatDuration(track.info.length);
                        return `**${index + 1}.** [${track.info.title}](${track.info.uri})\n🎤 ${track.info.author} | ⏱️ ${duration}`;
                    }).join('\n\n')}`)
                    .setThumbnail(firstTrack.info.artworkUrl || firstTrack.info.thumbnail || null)
                    .setFooter({ text: `ค้นหาโดย ${interaction.user.tag}` })
                    .setTimestamp();

                // สร้างปุ่มสำหรับเลือกเพลง
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('track_0')
                            .setLabel('1')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('1️⃣'),
                        new ButtonBuilder()
                            .setCustomId('track_1')
                            .setLabel('2')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('2️⃣'),
                        new ButtonBuilder()
                            .setCustomId('track_2')
                            .setLabel('3')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('3️⃣'),
                        new ButtonBuilder()
                            .setCustomId('track_3')
                            .setLabel('4')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('4️⃣'),
                        new ButtonBuilder()
                            .setCustomId('track_4')
                            .setLabel('5')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('5️⃣')
                    );

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('cancel')
                            .setLabel('ยกเลิก')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('❌')
                    );

                const response = await interaction.editReply({
                    embeds: [searchEmbed],
                    components: [row1, row2]
                });

                // รอการตอบสนองจากปุ่ม
                const collector = response.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 60000 // 60 วินาที
                });

                collector.on('collect', async i => {
                    // ตรวจสอบว่าเป็นคนเดียวกับที่ใช้คำสั่ง
                    if (i.user.id !== interaction.user.id) {
                        return i.reply({
                            content: '❌ คุณไม่ได้เป็นคนใช้คำสั่งนี้!',
                            flags: 64
                        });
                    }

                    if (i.customId === 'cancel') {
                        collector.stop('cancelled');
                        return i.update({
                            content: '❌ ยกเลิกการเลือกเพลงแล้ว',
                            embeds: [],
                            components: []
                        });
                    }

                    // ดึงเลขจาก customId (track_0 -> 0)
                    const trackIndex = parseInt(i.customId.split('_')[1]);
                    const selectedTrack = searchResults[trackIndex];

                    if (!selectedTrack) {
                        return i.reply({
                            content: '❌ เกิดข้อผิดพลาดในการเลือกเพลง',
                            flags: 64
                        });
                    }

                    await i.deferUpdate();
                    collector.stop('selected');

                    try {
                        const trackEmbed = await playTrack(selectedTrack);
                        await i.editReply({
                            embeds: [trackEmbed],
                            components: []
                        });
                    } catch (error) {
                        console.error('Error playing selected track:', error);
                        await i.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('#FF0000')
                                    .setTitle('❌ เกิดข้อผิดพลาด')
                                    .setDescription('ไม่สามารถเล่นเพลงได้ในขณะนี้')
                                    .setTimestamp()
                            ],
                            components: []
                        });
                    }
                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        interaction.editReply({
                            content: '⏱️ หมดเวลาในการเลือกเพลง',
                            embeds: [],
                            components: []
                        }).catch(console.error);
                    }
                });
            }

        } catch (error) {
            console.error('Error in play command:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#018ec3')
                .setTitle('❌ เกิดข้อผิดพลาด')
                .setDescription('ไม่สามารถเล่นเพลงได้ในขณะนี้')
                .setTimestamp();

            return interaction.editReply({ embeds: [errorEmbed], components: [] });
        }
    }
};