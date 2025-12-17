// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('guide')
//         .setDescription('Search discordjs.guide!')
//         .addStringOption((option) => option
//             .setName('query')
//             .setDescription('Phrase to search for')
//             .setAutocomplete(true))
//         .addStringOption((option) => option
//             .setName('version')
//             .setDescription('Version to search in')
//             .setAutocomplete(true),
//         ),
//     async autocomplete(interaction) {
//         const focusedOption = interaction.options.getFocused(true);
//         let choices;
//         if (focusedOption.name === 'query') {
//             choices = [
//                 'Popular Topics: Threads',
//                 'Sharding: Getting started',
//                 'Library: Voice Connections',
//                 'Interactions: Replying to slash commands',
//                 'Popular Topics: Embed preview',
//             ];
//         }
//         if (focusedOption.name === 'version') {
//             choices = ['v9', 'v11', 'v12', 'v13', 'v14'];
//         }
//         const filtered = choices.filter((choice) => choice.startsWith(focusedOption.value));
//         await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
//     },
//     async execute(interaction) {
//         const query = interaction.options.getString('query');
//         const version = interaction.options.getString('version') || 'v14';
//     }
// };


const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('Search discordjs.guide!')
        .addStringOption((option) => option
            .setName('query')
            .setDescription('Phrase to search for')
            .setAutocomplete(true))
        .addStringOption((option) => option
            .setName('version')
            .setDescription('Version to search in')
            .setAutocomplete(true)),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (focusedOption.name === 'query') {
            choices = [
                'Popular Topics: Threads',
                'Sharding: Getting started',
                'Library: Voice Connections',
                'Interactions: Replying to slash commands',
                'Popular Topics: Embed preview',
                'Creating Your Bot: Initial files',
                'Creating Your Bot: Configuration files',
                'Creating Commands: Command handling',
                'Interactions: Buttons',
                'Interactions: Select menus',
            ];
        }

        if (focusedOption.name === 'version') {
            choices = ['v14', 'v13', 'v12', 'v11', 'v9'];
        }

        const filtered = choices.filter((choice) => 
            choice.toLowerCase().includes(focusedOption.value.toLowerCase())
        );

        await interaction.respond(
            filtered.slice(0, 25).map((choice) => ({ name: choice, value: choice }))
        );
    },

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const version = interaction.options.getString('version') || 'v14';

        if (!query) {
            return interaction.reply({
                content: '📚 Discord.js Guide: https://discordjs.guide/',
                flags: 64
            });
        }

        // สร้าง URL สำหรับค้นหา
        const searchQuery = encodeURIComponent(query);
        const guideUrl = `https://discordjs.guide/?search=${searchQuery}`;

        // แปลง query เป็น slug สำหรับลิงก์โดยตรง
        const slug = query.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        const embed = new EmbedBuilder()
            .setTitle('📚 Discord.js Guide')
            .setDescription(`**Query:** ${query}\n**Version:** ${version}`)
            .addFields(
                { 
                    name: '🔍 Search Results', 
                    value: `[Click here to search](${guideUrl})` 
                },
                { 
                    name: '📖 Documentation', 
                    value: `[Discord.js Docs](https://discord.js.org/#/docs/discord.js/${version}/general/welcome)` 
                }
            )
            .setColor('Blue')
            .setFooter({ text: `Version: ${version}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
// ```

// ## คำอธิบาย:

// ### 1. **Autocomplete Function**
// - แสดงตัวเลือกที่เกี่ยวข้องขณะพิมพ์
// - กรอง choices ด้วย `includes()` แทน `startsWith()` เพื่อค้นหาที่ดีกว่า
// - จำกัดผลลัพธ์ไม่เกิน 25 รายการ (ข้อจำกัดของ Discord)

// ### 2. **Execute Function**
// - ถ้าไม่ใส่ query = แสดงลิงก์ guide หลัก
// - สร้าง embed พร้อมลิงก์ค้นหาและ documentation
// - แสดง version ที่เลือก (default เป็น v14)

// ## วิธีใช้คำสั่ง:
// ```
// /guide query:Threads version:v14
// /guide query:Buttons
// /guide