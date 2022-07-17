const { DataTypes } = require("sequelize");
const Guilds = require("./Guilds");
const Users = require("./Users");

module.exports = (sequelize) => {
	return sequelize.define("djusers", {
		djUserId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Users,
				key: "userId",
			},
		},
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Guilds,
				key: "guildId",
			},
		},
	});
};
