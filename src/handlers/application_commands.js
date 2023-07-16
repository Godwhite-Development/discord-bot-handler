const fs = require("fs");
const { REST, Routes, PermissionsBitField } = require("discord.js");
const { Table } = require("console-table-printer");

module.exports = async function loadcommands(client, config) {
	console.log(
		"------------------------------| 框架 - 載入指令 |------------------------------"
			.blue.bold,
	);

	await client.commands.clear();
	await client.developer_commands.clear();

	const p = new Table({
		columns: [
			{ name: "index", title: "編號" },
			{ name: "file", title: "檔案", alignment: "left" },
			{ name: "name", title: "指令", alignment: "left" },
			{ name: "name_localization", title: "中文指令", alignment: "left" },
			{ name: "description", title: "詳細資訊", alignment: "left" },
			{
				name: "description_localization",
				title: "中文詳細資訊",
				alignment: "left",
			},
		],
	});

	let commands = [];
	let developer_commands = [];

	fs.readdirSync("./src/commands/").forEach((dir) => {
		const files = fs
			.readdirSync("./src/commands/" + dir)
			.filter((file) => file.endsWith(".js"));

		for (let file of files) {
			delete require.cache[require.resolve("../commands/" + dir + "/" + file)];
			let pulled = require("../commands/" + dir + "/" + file);
			let pull = pulled.command_data;

			if ((pull.name, pull.description, pull.type == 1)) {
				if (pulled.developers_only) {
					client.commands.set(pull.name, pulled);

					p.addRow(
						{
							index: client.commands.size,
							file: file,
							name: pull.name,
							name_localization: pull.name_localizations["zh-TW"] || "null",
							description: pull.description,
							description_localization:
								pull.description_localizations["zh-TW"] || "null",
						},
						{ color: "green" },
					);

					developer_commands.push({
						name: pull.name,
						description: pull.description,
						type: pull.type || 1,
						options: pull.options ? pull.options : null,
						default_permission: pull.permissions.DEFAULT_PERMISSIONS
							? pull.permissions.DEFAULT_PERMISSIONS
							: null,
						default_member_permissions: pull.permissions
							.DEFAULT_MEMBER_PERMISSIONS
							? PermissionsBitField.resolve(
									pull.permissions.DEFAULT_MEMBER_PERMISSIONS,
							  ).toString()
							: null,
						name_localizations: pull.name_localizations
							? pull.name_localizations
							: null,
						description_localizations: pull.description_localizations
							? pull.description_localizations
							: null,
						dm_permission: pull.dm ? true : false,
					});
				} else {
					client.commands.set(pull.name, pulled);

					p.addRow(
						{
							index: client.commands.size,
							file: file,
							name: pull.name,
							name_localization: pull.name_localizations["zh-TW"] || "null",
							description: pull.description,
							description_localization:
								pull.description_localizations["zh-TW"] || "null",
						},
						{ color: "green" },
					);

					commands.push({
						name: pull.name,
						description: pull.description,
						type: pull.type || 1,
						options: pull.options ? pull.options : null,
						default_permission: pull.permissions.DEFAULT_PERMISSIONS
							? pull.permissions.DEFAULT_PERMISSIONS
							: null,
						default_member_permissions: pull.permissions
							.DEFAULT_MEMBER_PERMISSIONS
							? PermissionsBitField.resolve(
									pull.permissions.DEFAULT_MEMBER_PERMISSIONS,
							  ).toString()
							: null,
						name_localizations: pull.name_localizations
							? pull.name_localizations
							: null,
						description_localizations: pull.description_localizations
							? pull.description_localizations
							: null,
						dm_permission: pull.dm ? true : false,
					});
				}
			} else {
				p.addRow(
					{
						index: "X",
						file: file,
						name: pull.name || "無法載入",
						name_localization: pull.name_localizations["zh-TW"] || "無法載入",
						description: pull.description || "無法載入",
						description_localization:
							pull.description_localizations["zh-TW"] || "無法載入",
					},
					{ color: "red" },
				);
				continue;
			}
		}
	});

	p.printTable();

	console.log(
		"------------------------------| 框架 - 註冊指令 |------------------------------"
			.blue.bold,
	);

	const rest = new REST({ version: "10" }).setToken(config.client.token);

	console.log("[註冊] 正在註冊一般指令...".yellow);

	try {
		rest.put(Routes.applicationCommands(config.client.id), {
			body: commands,
		});
		console.log("[註冊] 結束註冊一般指令".green.bold);
	} catch (err) {
		console.log(err);
	}

	console.log("[註冊] 正在註冊開發者指令...".yellow);

	try {
		rest.put(
			Routes.applicationGuildCommands(
				config.client.id,
				config.guilds.developer_only,
			),
			{
				body: developer_commands,
			},
		);
		console.log("[註冊] 結束註冊開發者指令".green.bold);
	} catch (err) {
		console.log(err);
	}
};
