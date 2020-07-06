module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_effects', {
    user_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    burn: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    fish_effect: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
		},
	}, {
		timestamps: false,
	});
};