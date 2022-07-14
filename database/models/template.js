const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	return 0;
	return sequelize.define("template", {
		prop1: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		prop2: {
			type: DataTypes.STRING,
		},
		prop3: {
			type: DataTypes.STRING,
		},
	});
};
