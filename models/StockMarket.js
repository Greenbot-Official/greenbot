module.exports = (sequelize, DataTypes) => {
	return sequelize.define('stockmarket', {
		company_name: {
			type: DataTypes.STRING,
			unique: true,
		},
		value_per_stock: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};