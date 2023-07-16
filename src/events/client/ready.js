const client = require("../../bot");
const config = require("../../config/main");
var count = 0;

module.exports = {
	name: "ready",
	once: false,
	async execute() {
		console.log(`${client.user.tag} 已上線`.green.bold);
	},
};
