const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Sends a random gif!')
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('The gif category')
				.setRequired(true)
				.addChoices(
					{ name: 'Funny', value: 'gif_funny' },
					{ name: 'Meme', value: 'gif_meme' },
					{ name: 'Movie', value: 'gif_movie' },
				),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const category = interaction.options.getString('category');

		// แปลง category เป็น search term
		const searchTerms = {
			'gif_funny': 'funny',
			'gif_meme': 'meme',
			'gif_movie': 'movie'
		};

		const searchTerm = searchTerms[category];

		try {
			// ใช้ Tenor API (ต้องมี API key)
			const apiKey = 'AIzaSyA4D4Q5eMRCcf9sPeft1GWC4zoht9s4rvs'; // ต้องไปสมัครที่ https://tenor.com/gifapi
			const url = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=50`;

			const res = await fetch(url);
			const data = await res.json();

			if (!data.results || data.results.length === 0) {
				return interaction.editReply('❌ ไม่พบ GIF ในหมวดหมู่นี้');
			}

			// สุ่ม GIF
			const randomGif = data.results[Math.floor(Math.random() * data.results.length)];

			const embed = new EmbedBuilder()
				.setTitle(`🎬 ${category.replace('gif_', '').toUpperCase()} GIF`)
				.setImage(randomGif.media_formats.gif.url)
				.setColor('Random')
				.setFooter({ text: 'Powered by Tenor' });

			return interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error(error);
			return interaction.editReply('❌ เกิดข้อผิดพลาดในการดึง GIF');
		}
	},
};