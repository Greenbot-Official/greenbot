module.exports = (sequelize, DataTypes) => {
	return sequelize.define('stocks', {
		user_id: DataTypes.STRING,
		stock_id: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	}, {
		timestamps: false,
	});
};