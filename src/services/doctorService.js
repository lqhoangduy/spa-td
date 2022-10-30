import * as _ from "lodash";
import moment from "moment";
import sequelize, { Op } from "sequelize";
import db from "../models/index";
import commonService from "../services/commonService";
import mailService from "../services/mailService";
import { STATUS } from "../utils/contants";
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
				!request.contentMarkdown ||
				!request.priceId ||
				!request.provinceId ||
				!request.paymentId
			) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				// Markdown
				const markdown = await db.Markdown.findOne({
					where: { doctorId: request.doctorId },
					raw: false,
				});
				if (markdown) {
					markdown.contentHTML = request.contentHTML;
					markdown.contentMarkdown = request.contentMarkdown;
					markdown.description = request.description;

					await markdown.save();
				} else {
					await db.Markdown.create({
						contentHTML: request.contentHTML,
						contentMarkdown: request.contentMarkdown,
						doctorId: request.doctorId,
						description: request.description,
					});
				}

				// Doctor info
				const doctorInfo = await db.DoctorInfo.findOne({
					where: { doctorId: request.doctorId },
					raw: false,
				});

				if (doctorInfo) {
					doctorInfo.priceId = request.priceId;
					doctorInfo.provinceId = request.provinceId;
					doctorInfo.paymentId = request.paymentId;
					doctorInfo.note = request.note;
					doctorInfo.specialtyId = request.specialtyId;
					doctorInfo.clinicId = request.clinicId;

					await doctorInfo.save();
				} else {
					await db.DoctorInfo.create({
						doctorId: request.doctorId,
						priceId: request.priceId,
						provinceId: request.provinceId,
						paymentId: request.paymentId,
						note: request.note,
						specialtyId: request.specialtyId,
						clinicId: request.clinicId,
					});
				}

				resolve({
					errorCode: 0,
					data: true,
					message: "Save info successfully",
				});
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
				const doctorInfo = await db.DoctorInfo.findOne({
					where: { doctorId: doctorId },
				});
				resolve({
					errorCode: 0,
					data: {
						...markdown,
						...doctorInfo,
					},
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
						exclude: ["password"],
					},
					include: [
						{
							model: db.Markdown,
							attributes: ["description", "contentHTML", "contentMarkdown"],
						},
						{
							model: db.DoctorInfo,
							attributes: {
								exclude: ["id", "doctorId"],
							},
							include: [
								{
									model: db.Allcode,
									as: "priceData",
									attributes: ["valueVi", "valueEn"],
								},
								{
									model: db.Allcode,
									as: "provinceData",
									attributes: ["valueVi", "valueEn"],
								},
								{
									model: db.Allcode,
									as: "paymentData",
									attributes: ["valueVi", "valueEn"],
								},
								{
									model: db.Clinic,
									as: "clinicData",
									attributes: ["name", "address"],
								},
							],
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

const getDoctorByIds = (ids) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!ids?.length) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const users = await db.User.findAll({
					where: { id: ids, roleId: "R2" },
					order: [["createdAt", "DESC"]],
					attributes: {
						exclude: ["password"],
					},
					include: [
						{
							model: db.Markdown,
							attributes: ["description", "contentHTML", "contentMarkdown"],
						},
						{
							model: db.DoctorInfo,
							attributes: {
								exclude: ["id", "doctorId"],
							},
							include: [
								{
									model: db.Allcode,
									as: "priceData",
									attributes: ["valueVi", "valueEn"],
								},
								{
									model: db.Allcode,
									as: "provinceData",
									attributes: ["valueVi", "valueEn"],
								},
								{
									model: db.Allcode,
									as: "paymentData",
									attributes: ["valueVi", "valueEn"],
								},
								{
									model: db.Clinic,
									as: "clinicData",
									attributes: ["name", "address"],
								},
							],
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

const getSchedulesByDate = (doctorId, date) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doctorId || !date) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const formatDate = moment(new Date(date)).startOf("days").toDate();
				const schedules = await db.Schedule.findAll({
					where: {
						doctorId: doctorId,
						[Op.and]: [
							sequelize.where(
								sequelize.fn("date", sequelize.col("date")),
								"=",
								formatDate
							),
						],
					},
					include: [
						{
							model: db.Allcode,
							as: "timeTypeData",
							attributes: ["valueVi", "valueEn"],
						},
						{
							model: db.User,
							as: "doctorData",
							attributes: ["firstName", "lastName"],
						},
					],
					raw: true,
					nest: true,
				});

				resolve({
					errorCode: 0,
					data: schedules || [],
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const getExtraInfo = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const doctorInfo = await db.DoctorInfo.findOne({
					where: { doctorId: id },
					attributes: {
						exclude: ["id, doctorId"],
					},
					include: [
						{
							model: db.Allcode,
							as: "priceData",
							attributes: ["valueVi", "valueEn"],
						},
						{
							model: db.Allcode,
							as: "provinceData",
							attributes: ["valueVi", "valueEn"],
						},
						{
							model: db.Allcode,
							as: "paymentData",
							attributes: ["valueVi", "valueEn"],
						},
						{
							model: db.Clinic,
							as: "clinicData",
							attributes: ["name", "address"],
						},
					],
					raw: true,
					nest: true,
				});

				resolve({
					errorCode: 0,
					data: doctorInfo,
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const getPatientBooking = (doctorId, date) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doctorId || !date) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const formatDate = moment(new Date(date)).startOf("days").toDate();

				const booking = await db.Booking.findAll({
					where: {
						doctorId: doctorId,
						statusId: STATUS.CONFIRMED,
						[Op.and]: [
							sequelize.where(
								sequelize.fn("date", sequelize.col("date")),
								"=",
								formatDate
							),
						],
					},
					include: [
						{
							model: db.User,
							as: "patientData",
							attributes: [
								"id",
								"email",
								"firstName",
								"lastName",
								"phoneNumber",
								"gender",
								"address",
							],
							include: [
								{
									model: db.Allcode,
									as: "genderData",
									attributes: ["valueVi", "valueEn"],
								},
							],
						},
						{
							model: db.Allcode,
							as: "timeBookingData",
							attributes: ["valueVi", "valueEn"],
						},
					],
					raw: true,
					nest: true,
				});

				resolve({
					errorCode: 0,
					data: booking,
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const sendRemedy = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (
				!request.email ||
				!request.doctorId ||
				!request.patientId ||
				!request.timeType ||
				!request.date
			) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const formatDate = moment(new Date(request.date))
					.startOf("days")
					.toDate();

				const booking = await db.Booking.findOne({
					where: {
						doctorId: request.doctorId,
						patientId: request.patientId,
						timeType: request.timeType,
						statusId: STATUS.CONFIRMED,
						[Op.and]: [
							sequelize.where(
								sequelize.fn("date", sequelize.col("date")),
								"=",
								formatDate
							),
						],
					},
					raw: false,
				});

				if (booking) {
					booking.statusId = STATUS.DONE;
					await booking.save();

					const dataMail = {
						language: request.language,
						receiverEmail: request.email,
						patientName: request.patientName,
						doctorName: request.doctorName,
						time: request.time,
						image: request.image,
					};
					await mailService.sendMailConfirm(dataMail);
				}

				resolve({
					errorCode: 0,
					data: booking,
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
	getSchedulesByDate: getSchedulesByDate,
	getExtraInfo: getExtraInfo,
	getDoctorByIds: getDoctorByIds,
	getPatientBooking: getPatientBooking,
	sendRemedy: sendRemedy,
};
