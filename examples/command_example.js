const {} = require("discord.js");

module.exports = {
	command_data: {
		name: String,
		description: String,
		type: Number,
		options: Array[Object],
	},
	role_perms: Array[String],
	developers_only: Boolean,
	owner_only: Boolean,
	logger: Boolean,
	category: String,
	run: function (...args) {},
};
