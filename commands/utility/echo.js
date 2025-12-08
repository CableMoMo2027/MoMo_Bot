// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('echo')
//         .setDescription('Replies with your input!')
//         .addStringOption((option) => option
//             .setName('input')
//             .setDescription('The input to echo back')
//             .setRequired(true)
//             .setMaxLength(2_000),
//         )
//         .addBooleanOption((option) => option
//             .setName('ephemeral')
//             .setDescription('Whether or not the echo should be ephemeral')
//         )
//         .addBooleanOption((option) => option
//             .setName('embed')
//             .setDescription('Whether or not the response should be an embed')
//         ),
        
//     async execute(interaction) {
//         const input = interaction.options.getString('input');
//         const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
//         const embed = interaction.options.getBoolean('embed') ?? false;

//         if (embed) {
//             const replyEmbed = new EmbedBuilder().setDescription(input);
//             await interaction.reply({ embeds: [replyEmbed], ephemeral });
//         } else {
//             await interaction.reply({ content: input, ephemeral });
//         }
//     }
// }



const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
                .setMaxLength(2000),
        )
        .addBooleanOption(option =>
            option
                .setName('ephemeral')
                .setDescription('Whether the reply should be ephemeral')
        )
        .addBooleanOption(option =>
            option
                .setName('embed')
                .setDescription('Reply using embed')
        ),

    async execute(interaction) {
        const input = interaction.options.getString('input');
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
        const embed = interaction.options.getBoolean('embed') ?? false;

        if (embed) {
            // ส่งแบบ embed
            return interaction.reply({
                embeds: [{
                    title: "Echo",
                    description: input,
                }],
                ephemeral: ephemeral,
            });
        }

        // ส่งแบบข้อความปกติ
        return interaction.reply({
            content: input,
            ephemeral: ephemeral,
        });
    },
};
