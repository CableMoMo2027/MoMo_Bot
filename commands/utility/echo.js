const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption((option) => option
        .setName('input')
        .setDescription('The input to echo back')
        .setRequired(true)
        .setMaxLength(2_000),
    )
    .addBooleanOption((option) =>
        option.setName('ephemeral')
            .setDescription('Whether or not the echo should be ephemeral'),
    );