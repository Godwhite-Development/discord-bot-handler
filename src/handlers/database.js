const { MongoDBConnector } = require("discord.js-v14-helper");
const connect = require("../database/connect");

module.exports = async (client, config) => {
	if (!config.database.mongodb_uri) return;

	console.log(
		"------------------------------| 框架 - 資料庫連 |------------------------------"
			.blue.bold,
	);
	console.log("[資料庫] 正在連結至MongoDB...".yellow);

	await connect(config.database.mongodb_uri);
};
