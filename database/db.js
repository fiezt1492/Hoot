const Sequelize = require("sequelize");
const config = require("../config.json");

module.exports = () => {
	dbType = config.use_database;

	console.log("[DB] Connecting database type: " + dbType);

	if (dbType == "sqlite") {
		return new Sequelize({
			dialect: "sqlite",
			storage: config.database[dbType].file,
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
