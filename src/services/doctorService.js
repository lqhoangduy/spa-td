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
				const image = user.image ? commonService.decrypt(user.image) : null;
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

const getAllDoctors = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const doctors = await db.User.findAll({
				where: {
					roleId: "R2",
				},
				attributes: {
					exclude: ["password", "image"],
				},
			});
			resolve({
				errorCode: 0,
				data: doctors,
			});
		} catch (error) {
			reject(error);
		}
	});
};

const saveInfoDoctor = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (
				!request.doctorId ||
				!request.contentHTML ||
				!request.contentMarkdown
			) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const markdown = await db.Markdown.findOne({
					where: { doctorId: request.doctorId },
					raw: false,
				});
				if (markdown) {
					markdown.contentHTML = request.contentHTML;
					markdown.contentMarkdown = request.contentMarkdown;
					markdown.doctorId = request.doctorId;
					markdown.description = request.description;

					await markdown.save();
					resolve({
						errorCode: 0,
						data: true,
						message: "Update info successfully",
					});
				} else {
					await db.Markdown.create({
						contentHTML: request.contentHTML,
						contentMarkdown: request.contentMarkdown,
						doctorId: request.doctorId,
						description: request.description,
					});
					resolve({
						errorCode: 0,
						data: true,
						message: "Create info successfully",
					});
				}
			}
		} catch (error) {
			reject(error);
		}
	});
};

const getInfoDoctor = (doctorId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doctorId) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const markdown = await db.Markdown.findOne({
					where: { doctorId: doctorId },
				});
				resolve({
					errorCode: 0,
					data: markdown,
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const getDetailDoctorById = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const user = await db.User.findOne({
					where: { id: id },
					attributes: {
						exclude: ["password, image"],
					},
					include: [
						{
							model: db.Markdown,
							attributes: ["description", "contentHTML", "contentMarkdown"],
						},
						{
							model: db.Allcode,
							as: "positionData",
							attributes: ["valueVi", "valueEn"],
						},
					],
					raw: true,
					nest: true,
				});

				if (user) {
					const image = user?.image ? commonService.decrypt(user.image) : null;
					user.image = image;
				}

				resolve({
					errorCode: 0,
					data: user,
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	getTopDoctorHome: getTopDoctorHome,
	getAllDoctors: getAllDoctors,
	saveInfoDoctor: saveInfoDoctor,
	getInfoDoctor: getInfoDoctor,
	getDetailDoctorById: getDetailDoctorById,
};
