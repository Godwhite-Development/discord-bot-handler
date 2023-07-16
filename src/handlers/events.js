const fs = require("fs");
const { Table } = require("console-table-printer");

module.exports = async function loadEvents(client, config) {
	console.log(
		"------------------------------| 框架 - 事件管理 |------------------------------"
			.blue.bold,
	);

	await client.events.clear();

	const p = new Table({
		columns: [
			{ name: "index", title: "編號" },
			{ name: "file", title: "檔案", alignment: "left" },
			{ name: "event", title: "事件", alignment: "left" },
		],
	});

	fs.readdirSync("./src/events/").forEach((dir) => {
		const files = fs
			.readdirSync("./src/events/" + dir)
			.filter((file) => file.endsWith(".js"));

		for (let file of files) {
			delete require.cache[require.resolve("../events/" + dir + "/" + file)];

			const event = require("../events/" + dir + "/" + file);

			const execute = (...args) => event.execute(...args, client);

			client.events.set(file, { event: event.name, execute: execute });

			if (execute.once) {
				client.once(event.name, execute);
			} else {
				client.on(event.name, execute);
			}

			p.addRow(
				{
					index: client.events.size,
					file: file,
					event: event.name,
				},
				{ color: "green" },
			);
		}
	});

	/*for (let file of fs
    .readdirSync("./src/events")
    .filter((file) => file.endsWith(".js"))) {
    require("../events/" + file);

    p.addRow(
      {
        file: file,
      },
      { color: "green" },
    );
  }*/
	p.printTable();
};
