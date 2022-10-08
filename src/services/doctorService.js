import * as _ from "lodash";
import moment from "moment";
import sequelize, { Op } from "sequelize";
import db from "../models/index";
import commonService from "../services/commonService";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE || 10;

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

const createSchedules = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data?.schedules?.length || !data.doctorId) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				let schedules = data.schedules;

				schedules = schedules.map((item) => {
					return {
						...item,
						maxNumber: MAX_NUMBER_SCHEDULE,
					};
				});

				const doctorId = data.doctorId;
				const toDay = moment().startOf("day").toDate();

				await db.Schedule.destroy({
					where: {
						doctorId: doctorId,
						[Op.and]: [
							sequelize.where(
								sequelize.fn("date", sequelize.col("date")),
								">=",
								toDay
							),
						],
					},
				});

				await db.Schedule.bulkCreate(schedules);

				resolve({
					errorCode: 0,
					message: "Save doctor's schedules successfully",
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const getSchedules = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const toDay = moment().startOf("day").toDate();
				const schedules = await db.Schedule.findAll({
					where: {
						doctorId: id,
						[Op.and]: [
							sequelize.where(
								sequelize.fn("date", sequelize.col("date")),
								">=",
								toDay
							),
						],
					},
				});

				resolve({
					errorCode: 0,
					data: schedules,
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const deleteSchedules = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const toDay = moment().startOf("day").toDate();
				await db.Schedule.destroy({
					where: {
						doctorId: id,
						[Op.and]: [
							sequelize.where(
								sequelize.fn("date", sequelize.col("date")),
								">=",
								toDay
							),
						],
					},
				});

				resolve({
					errorCode: 0,
					data: true,
					message: "Deleted successfully doctor's schedule",
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
	createSchedules: createSchedules,
	getSchedules: getSchedules,
	deleteSchedules: deleteSchedules,
};
