const { DataTypes } = require("sequelize");
const Users = require("./Users");

module.exports = (sequelize) => {
	return sequelize.define("playlists", {
		playlistOwnerId: {
			type: DataTypes.STRING,
			primaryKey: true,
			// references: {
			// 	model: Users,
			// 	key: "userId",
			// },
		},
		playlistId: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {
				// not: /^[^<>%$]*$/gi,
				len: [1, 100],
			},
		},
		data: {
			type: DataTypes.JSON,
			defaultValue: {
				songs: [],
			},
		},
	});
};
