const client = require("../../bot");
const config = require("../../config/main");
const ms = require("ms");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {
		if (
			interaction.isChatInputCommand() ||
			interaction.isUserContextMenuCommand() ||
			interaction.isMessageContextMenuCommand()
		) {
			const command = await client.commands.get(interaction.commandName);

			if (!command)
				return interaction.reply({
					content: `\`❌\` 找不到此指令`,
					ephemeral: true,
				});

			try {
				if (command.owner_only && typeof command.owner_only === "boolean") {
					if (config.users.owner !== interaction.user.id) {
						return interaction.reply({
							content: `\`❌\` 很抱歉，此指令只允許擁有者使用！`,
							ephemeral: true,
						});
					}
				}

				if (
					command.developers_only &&
					typeof command.owner_only === "boolean"
				) {
					if (
						config.users?.developers &&
						config.users?.developers?.length > 0
					) {
						if (
							!config.users.developers.some(
								(dev) => interaction.user.id === dev,
							)
						)
							return interaction.reply({
								content: `\`❌\` 很抱歉，此指令只允許開發者使用！`,
								ephemeral: true,
							});
					}
				}

				if (command.role_perms) {
					if (Array.isArray(command.role_perms)) {
						if (command.role_perms?.length > 0) {
							let boolean = false;

							await command.role_perms.forEach((r) => {
								const role = interaction.guild.roles.cache.get(r);

								if (!role) return;

								if (!interaction.member.roles) boolean = false;
								if (
									interaction.member.roles.cache.some((r1) => r1.id === role.id)
								)
									boolean = true;
							});

							if (boolean === false)
								return interaction.reply({
									content: `\`❌\` 很抱歉，您沒有使用此指令的權限！`,
									ephemeral: true,
								});
						}
					} else if (typeof command.role_perms === "string") {
						const role = interaction.guild.roles.cache.get(command.role_perms);

						if (role) {
							if (!interaction.member.roles.cache.has(role))
								return interaction.reply({
									content: `\`❌\` 很抱歉，您沒有使用此指令的權限！`,
									ephemeral: true,
								});
						}
					}
				}

				command.run(client, interaction, config);

				if (
					command.logger == null ||
					(command.logger && typeof command.logger === "boolean")
				) {
					if (!config.channels?.log.command) return;

					const embed = new EmbedBuilder()
						.setTitle(`斜線指令 ${interaction.commandName} 被使用了`)
						.setAuthor({
							name: client.user.username,
							iconURL: client.user.displayAvatarURL({
								dynamic: true,
							}),
						})
						.setFields(
							{
								name: "伺服器",
								value: `> ${interaction.guild.name} (\`${interaction.guild.id}\`)`,
							},
							{
								name: "使用者",
								value: `> ${interaction.user} ${interaction.user.tag.replace(
									/#0(?!.*\w)/,
									"",
								)} (${interaction.user.id})`,
							},
							{
								name: "使用於",
								value: `> <t:${Math.floor(
									interaction.createdTimestamp / 1000,
								)}> (<t:${Math.floor(interaction.createdTimestamp / 1000)}:R>)`,
							},
						)
						.setColor("Random");

					return process.functions.sendmessage(
						{ embeds: [embed] },
						config.channels.log.command,
					);
				}
			} catch (err) {
				console.warn(
					`[警告] 使用指令 \'${interaction.commandName}\' 時發生錯誤`.yellow,
				);
				console.log(err);
			}
		} else return;
	},
};
