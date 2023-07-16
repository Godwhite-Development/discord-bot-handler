const { create, get, url } = require("sourcebin");
const {
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = async (client, config) => {
	process.on("unhandledRejection", async (error) => {
		console.error(error.stack || error);
	});

	process.on("uncaughtException", async (error) => {
		console.error(error.stack || error);
	});

	process.on("uncaughtExceptionMonitor", async (error) => {
		console.error(error.stack);
	});
};
