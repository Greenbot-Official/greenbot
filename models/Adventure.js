module.exports = (sequelize, DataTypes) => {
	return sequelize.define('adventure', {
    user_id: {
      type: DataTypes.STRING,
    },
    x_pos: {
      type: DataTypes.INTEGER,
    },
    y_pos: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      allowNull: false,
    },
    player: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    explored: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
	}, {
		timestamps: false,
	});
};