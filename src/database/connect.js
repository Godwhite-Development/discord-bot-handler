const mongoose = require("mongoose");

async function connect(mongodb_uri) {
	mongoose.set("strictQuery", false);
	mongoose.connect(mongodb_uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	const db = mongoose.connection;
	db.on("error", (err) => console.error("[資料庫] 在連線時發生錯誤".red, err));
	db.once("open", (db) => console.log("[資料庫] 成功連線".green));
}

module.exports = connect;
