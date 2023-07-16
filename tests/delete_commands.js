require("colors");
const { REST, Routes } = require("discord.js");
const config = require("../src/config/main.js");
const rest = new REST({ version: "10" }).setToken(config.client.token);

rest
	.put(Routes.applicationCommands(config.client.id), { body: [] })
	.then(() => {
		console.log("已刪除所有斜線指令".green.bold);
	})
	.catch((err) => {
		console.log("刪除指令時發生錯誤".red.bold);
		console.error(err);
	});
