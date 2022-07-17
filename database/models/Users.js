const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
	return sequelize.define("users", {
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		proTier: {
			type: DataTypes.SMALLINT,
			default: 0,
		},
		proAt: {
			type: DataTypes.DATE,
		},
	});
};
