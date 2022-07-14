// const Sequelize = require("sequelize");
const fs = require("fs");
const sequelize = require("./db")();
const config = require("../config.json");

const models = {};

const modelFiles = fs
	.readdirSync("./database/models")
	.filter((file) => file.endsWith(".js"));

for (const file of modelFiles) {
	const name = `${file.split(".")[0]}`;
	const model = require(`./models/${file}`)(sequelize);
	if (!model) continue;
	models[name] = model;
	console.log(`[DB] ${name} Model Loaded `);
}

const Playlists = require("./models/Playlists")(sequelize);
const Guilds = require("./models/Guilds")(sequelize);
const DjRoles = require("./models/DjRoles")(sequelize);
const DjUsers = require("./models/DjUsers")(sequelize);

(async () => {
	// await sequelize.sync({ force: config.dev === "on" ? true : false });
	await sequelize.sync();
	// Guilds.hasMany(DjRoles);
	// Guilds.hasMany(DjUsers);
	console.log("[DB] Synced");
})();

module.exports = {
	models: models,
	sequelize: sequelize,
};
