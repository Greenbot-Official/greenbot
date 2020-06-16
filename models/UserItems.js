module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_item', {
		user_id: DataTypes.STRING,
		item_id: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		equipped: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
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