const Sequelize = require("sequelize");
const config = require("../config.json");
// const fs = require("fs");

module.exports = () => {
	dbType = config.use_database;
	console.log("[DB] Connecting database type: " + dbType);

	if (dbType == "sqlite") {
		const sqliteFilePath = config.database[dbType].file;
		// fs.closeSync(fs.openSync(sqliteFilePath, "w"))
		return new Sequelize({
			dialect: "sqlite",
			storage: sqliteFilePath,
		});
	} else {
		return new Sequelize(
			config.database.name,
			config.database[dbType].user,
			config.database[dbType].pass,
			{
				host: config.database[dbType].host,
				port: config.database[dbType].port,
				dialect: dbType,
			}
		);
	}
};
