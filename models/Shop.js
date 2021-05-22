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
			unique: true,
		},
		damage: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		attribute: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		scale: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		heal: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		ecost: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
		desc: {
			type: DataTypes.STRING,
			defaultValue: 'no description provided',
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};