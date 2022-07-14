const { DataTypes } = require("sequelize");
const DjRoles = require("./DjRoles")
const DjUsers = require("./DjUsers")

module.exports = (sequelize) => {
	return sequelize.define("guilds", {
		guildId: {
			type: DataTypes.STRING,
			primaryKey: true,
            allowNull: false
		},
	});
};