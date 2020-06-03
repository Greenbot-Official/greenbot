module.exports = (sequelize, DataTypes) => {
	return sequelize.define('company', {
		user_id: DataTypes.STRING,
    company_id: DataTypes.STRING,
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    percent_owned: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
	}, {
		timestamps: false,
	});
};