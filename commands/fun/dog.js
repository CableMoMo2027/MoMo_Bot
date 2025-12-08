const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

// In-memory cache สำหรับรายชื่อสายพันธุ์หมา
let breedsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ชั่วโมง

// ฟังก์ชันดึงและ cache รายชื่อสายพันธุ์
async function fetchBreeds() {
	// ถ้ามี cache และยังไม่หมดอายุ ให้ใช้ cache
	if (breedsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
		return breedsCache;
	}

	try {
		const res = await fetch('https://dog.ceo/api/breeds/list/all');
		const data = await res.json();

		if (data.status === 'success') {
			breedsCache = Object.keys(data.message);
			cacheTimestamp = Date.now();
			return breedsCache;
		}
	} catch (error) {
		console.error('Error fetching breeds:', error);
		// ถ้า fetch ไม่สำเร็จแต่มี cache เก่า ให้ใช้ cache เก่าแทน
		if (breedsCache) return breedsCache;
	}

	return [];
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dog')
		.setDescription('Get a cute picture of a dog!')
		.addStringOption(option =>
			option
				.setName('breed')
				.setDescription('Breed of dog (optional)')
				.setAutocomplete(true)
		),

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();

		try {
			// ดึงรายชื่อสายพันธุ์จาก cache
			const breeds = await fetchBreeds();

			// กรองตามที่ผู้ใช้พิมพ์
			const filtered = breeds
				.filter(breed => breed.toLowerCase().startsWith(focusedValue.toLowerCase()))
				.slice(0, 25); // Discord รับได้สูงสุด 25 ตัวเลือก

				console.log('Autocomplete filtered breeds:', filtered);

			// ส่งผลลัพธ์กลับ
			await interaction.respond(
				filtered.map(breed => ({ name: breed, value: breed }))
			);
		} catch (error) {
			console.error('Autocomplete error:', error);
			await interaction.respond([]);
		}
	},
	async execute(interaction) {
		await interaction.deferReply();

		const breed = interaction.options.getString('breed');

		let url = 'https://dog.ceo/api/breeds/image/random';

		if (breed) {
			url = `https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random`;
		}

		try {
			const res = await fetch(url);
			const data = await res.json();

			if (data.status !== 'success') {
				return interaction.editReply(`❌ ไม่พบสายพันธุ์ \`${breed}\``);
			}

			const embed = new EmbedBuilder()
				.setTitle(breed ? `🐶 Breed: ${breed}` : '🐶 Random Dog!')
				.setImage(data.message)
				.setColor('Blue');

			return interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			return interaction.editReply('❌ เกิดข้อผิดพลาดในการดึงข้อมูล');
		}
	},
};
