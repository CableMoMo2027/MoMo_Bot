const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			await interaction.editReply('Pong!');

		} catch (error) {
			console.error('Error deferring reply:', error);
		}
	},
};