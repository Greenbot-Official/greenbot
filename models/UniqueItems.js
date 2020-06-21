module.exports = (sequelize, DataTypes) => {
	return sequelize.define('unique_item', {
		user_id: DataTypes.STRING,
		item_id: {
      type: DataTypes.STRING,
			unique: true,
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
		effect: {
      type: DataTypes.STRING,
      allowNull: true,
    },
	}, {
		timestamps: false,
	});
};