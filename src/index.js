require("colors");
process.env.TZ = "Asia/Taipei";
process.tmp = { grab: [] };

const { ClientIntents, ClientPartials } = require("discord.js-v14-helper");
const { Client, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config/main");

const client = new Client({
	intents: ClientIntents,
	partials: ClientPartials,
	presence: {},
});

client.version = require("../package.json").version;

client.commands = new Collection();
client.developer_commands = new Collection();
client.events = new Collection();
client.interactions = new Collection();
client.config = config;

module.exports = client;

async function loadhandler() {
	const loadcommands = require("./handlers/application_commands");
	await loadcommands(client, config);

	const loadEvents = require("./handlers/events");
	await loadEvents(client, config);

	for (let handler of ["database", "functions", "interactions", "error"]) {
		await require("./handlers/" + handler)(client, config);
	}
}

loadhandler();

client.login(config.client.token);
