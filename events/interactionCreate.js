// const { Events, MessageFlags, Collection } = require('discord.js');

// module.exports = {
// 	name: Events.InteractionCreate,
// 	async execute(interaction) {

// 		if (!interaction.isChatInputCommand()) return;

// 		if (interaction.isChatInputCommand()) {
// 			const command = interaction.client.commands.get(interaction.commandName);

// 			if (!command) {
// 				console.error(`No command matching ${interaction.commandName} was found.`);
// 				return;
// 			}

// 			try {
// 				const { cooldowns } = interaction.client;

// 				if (!cooldowns.has(command.data.name)) {
// 					cooldowns.set(command.data.name, new Collection());
// 				}

// 				const now = Date.now();
// 				const timestamps = cooldowns.get(command.data.name);
// 				const defaultCooldownDuration = 5;
// 				const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

// 				if (timestamps.has(interaction.user.id)) {
// 					const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
// 					if (now < expirationTime) {
// 						const expiredTimestamp = Math.round(expirationTime / 1_000);
// 						return interaction.reply({
// 							content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
// 							flags: MessageFlags.Ephemeral,
// 						});
// 					}
// 				}

// 				timestamps.set(interaction.user.id, now);
// 				setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

// 				await command.execute(interaction, interaction.client);
// 			} catch (error) {
// 				console.error(error);
// 				if (interaction.replied || interaction.deferred) {
// 					await interaction.followUp({
// 						content: `There was an error while executing this command!`,
// 					});
// 				} else {
// 					await interaction.reply({
// 						content: 'There was an error while executing this command!',
// 						flags: MessageFlags.Ephemeral,
// 					});
// 				}
// 			}
// 		} else if (interaction.isAutocomplete()) {
// 			const command = interaction.client.commands.get(interaction.commandName);
// 			if (!command) {
// 				console.error(`No command matching ${interaction.commandName} was found.`);
// 				return;
// 			}
// 			try {
// 				await command.autocomplete(interaction);
// 			} catch (error) {
// 				console.error(error);
// 			}
// 		}
// 	},
// };





const { Events, MessageFlags, Collection } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// ======================================
		// 1. AUTOCOMPLETE HANDLER (จัดการก่อน)
		// ======================================
		// เมื่อผู้ใช้พิมพ์ใน autocomplete field จะทริกเกอร์ส่วนนี้
		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			
			// ตรวจสอบว่ามี command นี้หรือไม่
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			// ตรวจสอบว่า command มี autocomplete function หรือไม่
			if (!command.autocomplete) {
				console.error(`No autocomplete handler found for ${interaction.commandName}`);
				return;
			}

			try {
				// เรียกใช้ autocomplete function ของ command
				// ส่ง interaction และ client ไปให้
				await command.autocomplete(interaction, interaction.client);
			} catch (error) {
				console.error(`Error in autocomplete for ${interaction.commandName}:`, error);
			}
			return; // หยุดการทำงานหลังจากจัดการ autocomplete
		}

		// ======================================
		// 2. SLASH COMMAND HANDLER
		// ======================================
		// เมื่อผู้ใช้กด Enter หรือเลือกคำสั่งจะทริกเกอร์ส่วนนี้
		if (!interaction.isChatInputCommand()) return;

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			// ตรวจสอบว่ามี command นี้หรือไม่
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				// ======================================
				// 3. COOLDOWN SYSTEM (ระบบคูลดาวน์)
				// ======================================
				const { cooldowns } = interaction.client;

				// สร้าง Collection สำหรับเก็บ cooldown ของแต่ละ command
				if (!cooldowns.has(command.data.name)) {
					cooldowns.set(command.data.name, new Collection());
				}

				const now = Date.now(); // เวลาปัจจุบัน (milliseconds)
				const timestamps = cooldowns.get(command.data.name); // ดึง cooldown ของ command นี้
				const defaultCooldownDuration = 5; // ค่าเริ่มต้น 5 วินาที
				const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000; // แปลงเป็น milliseconds

				// ตรวจสอบว่าผู้ใช้อยู่ใน cooldown หรือไม่
				if (timestamps.has(interaction.user.id)) {
					const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
					
					// ถ้ายังไม่หมดเวลา cooldown
					if (now < expirationTime) {
						const expiredTimestamp = Math.round(expirationTime / 1_000);
						return interaction.reply({
							content: `⏳ กรุณารอสักครู่ คุณใช้คำสั่ง \`${command.data.name}\` ได้อีกครั้ง <t:${expiredTimestamp}:R>`,
							flags: MessageFlags.Ephemeral, // ข้อความจะมองเห็นเฉพาะผู้ใช้
						});
					}
				}

				// บันทึกเวลาที่ใช้คำสั่ง
				timestamps.set(interaction.user.id, now);
				// ลบ cooldown หลังจากเวลาผ่านไป
				setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

				// ======================================
				// 4. EXECUTE COMMAND (รันคำสั่ง)
				// ======================================
				await command.execute(interaction, interaction.client);

			} catch (error) {
				// ======================================
				// 5. ERROR HANDLING (จัดการ Error)
				// ======================================
				console.error(error);
				
				// ข้อความ error ที่จะแสดงให้ผู้ใช้
				const errorMessage = {
					content: '❌ เกิดข้อผิดพลาดในการรันคำสั่ง!',
					flags: MessageFlags.Ephemeral,
				};

				// ตรวจสอบว่า interaction ได้ reply หรือ defer ไปแล้วหรือยัง
				if (interaction.replied || interaction.deferred) {
					// ถ้า reply แล้วให้ใช้ followUp
					await interaction.followUp(errorMessage);
				} else {
					// ถ้ายังไม่ reply ให้ใช้ reply
					await interaction.reply(errorMessage);
				}
			}
		}
	},
};