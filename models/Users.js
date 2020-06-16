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
		turn: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		combat: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		combat_target_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		combat_target: {
			type: DataTypes.STRING,
			allowNull: true,
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
		combat_exp: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};