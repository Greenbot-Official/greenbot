module.exports = (sequelize, DataTypes) => {
	return sequelize.define('shop', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		enchant: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		damage: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		heal: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	}, {
		timestamps: false,
	});
};