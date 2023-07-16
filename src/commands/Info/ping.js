const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require("discord.js");

module.exports = {
	command_data: {
		name: "ping",
		description: "Check the Bot ping",
		name_localizations: {
			"zh-TW": "取得延遲",
		},
		description_localizations: {
			"zh-TW": "取得機器人延遲",
		},
		type: 1,
		options: [],
		permissions: {
			DEFAULT_PERMISSIONS: "",
			DEFAULT_MEMBER_PERMISSIONS: "",
		},
	},
	role_perms: null,
	developers_only: false,
	category: "info",
	run: async (client, interaction) => {
		await interaction.deferReply();

		const embed = new EmbedBuilder()
			.setTitle("🏓 乓！")
			.setDescription(`延遲：\`${client.ws.ping}\` 毫秒！`)
			.setTimestamp()
			.setColor("Random");

		return interaction.editReply({
			embeds: [embed],
		});
	},
};
