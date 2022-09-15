"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("users", [
			{
				email: "admin@gmail.com",
				password: "123456",
				firstName: "Hoang",
				lastName: "Duy",
				address: "VN",
				gender: "M",
				roleId: "R1",
				phoneNumber: "0961884661",
				positionId: "P0",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("users", null, {});
	},
};
