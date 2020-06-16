module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		max_health: {
			type: DataTypes.INTEGER,
			defaultValue: 5,
			allowNull: false,
		},
		health: {
			type: DataTypes.INTEGER,
			defaultValue: 5,
			allowNull: false,
		},
		weapon: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 5,
			allowNull: false,
		},
		fish_exp: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		biggest_catch: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		crime_exp: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};