module.exports = (sequelize, DataTypes) => {
	return sequelize.define('adventure', {
    user_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    x_pos: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    y_pos: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    room_type: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    player: {
      type: DataTypes.BOOLEAN,
      unique: true,
    },
	}, {
		timestamps: false,
	});
};