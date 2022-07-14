const { DataTypes } = require("sequelize");
const Guilds = require("./Guilds");

module.exports = (sequelize) => {
	return sequelize.define("djroles", {
		djRoleId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
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
