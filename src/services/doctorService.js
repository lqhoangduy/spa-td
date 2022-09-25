import db from "../models/index";

import commonService from "../services/commonService";

const getTopDoctorHome = (limit) => {
	return new Promise(async (resolve, reject) => {
		try {
			const users = await db.User.findAll({
				where: {
					roleId: "R2",
				},
				limit: Number(limit),
				order: [["createdAt", "DESC"]],
				attributes: {
					exclude: ["password"],
				},
				include: [
					{
						model: db.Allcode,
						as: "positionData",
						attributes: ["valueVi", "valueEn"],
					},
					{
						model: db.Allcode,
						as: "genderData",
						attributes: ["valueVi", "valueEn"],
					},
				],
				raw: true,
				nest: true,
			});
			const result = users.map((user) => {
				let image = user.image ? commonService.decrypt(user.image) : null;
				return {
					...user,
					image: image,
				};
			});
			resolve({
				errorCode: 0,
				data: result,
			});
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	getTopDoctorHome: getTopDoctorHome,
};
