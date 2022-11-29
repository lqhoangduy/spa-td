"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Clinic extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Clinic.hasMany(models.DoctorInfo, {
				foreignKey: "clinicId",
				as: "clinicData",
			});
		}
	}
	Clinic.init(
		{
			name: DataTypes.STRING,
			address: DataTypes.STRING,
			image: DataTypes.STRING,
			descriptionHTML: DataTypes.TEXT("long"),
			descriptionMarkdown: DataTypes.TEXT("long"),
		},
		{
			sequelize,
			modelName: "Clinic",
			freezeTableName: true,
			tableName: "clinics",
		}
	);
	return Clinic;
};
