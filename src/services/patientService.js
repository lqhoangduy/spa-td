import moment from "moment";
import sequelize, { Op } from "sequelize";
import db from "../models/index";
import { DEFAULT_PASSWORD, ROLES, STATUS } from "../utils/contants";
import { v4 as uuidv4 } from "uuid";
import mailService from "./mailService";
import commonService from "./commonService";
import userService from "./userService";
require("dotenv").config();

const buildUrlVerify = (doctorId) => {
	const urlWeb = process.env.URL_WEB;
	const token = uuidv4();
	const tokenEncrypt = commonService.encrypt({ token });
	const urlVerify = `${urlWeb}/verify-booking?id=${doctorId}&token=${tokenEncrypt}`;

	return {
		url: urlVerify,
		token: token,
	};
};

const bookAppointment = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (
				!data.email ||
				!data.doctorId ||
				!data.date ||
				!data.timeType ||
				!data.name
			) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				let result = {};

				// Get or create patient
				const defaultPassword = await userService.hashUserPassword(
					DEFAULT_PASSWORD
				);

				const [user, isUserCreate] = await db.User.findOrCreate({
					where: { email: data.email },
					defaults: {
						email: data.email,
						roleId: ROLES.PATIENT,
						firstName: data.name,
						lastName: "",
						gender: data.gender,
						phoneNumber: data.phoneNumber,
						address: data.address,
						roleId: ROLES.PATIENT,
						password: defaultPassword,
					},
				});

				result.user = user;
				result.isUserCreate = isUserCreate;

				// Generate token & build url verify
				const { url, token } = buildUrlVerify(data.doctorId);

				// Create booking record
				if (user) {
					const formatDate = moment(new Date(data.date))
						.startOf("days")
						.toDate();

					const [booking, isBookingCreated] = await db.Booking.findOrCreate({
						where: {
							patientId: user.id,
						},
						defaults: {
							statusId: STATUS.NEW,
							doctorId: data.doctorId,
							patientId: user.id,
							date: formatDate,
							timeType: data.timeType,
							token: token,
						},
					});

					result.booking = booking;
					result.isBookingCreated = isBookingCreated;
				}

				if (result.booking && result.user) {
					const dataMail = {
						language: data.language,
						receiverEmail: data.email,
						name: data.name,
						doctorName: data.doctorName,
						time: data.timeString,
						phone: data.phoneNumber,
						redirectUrl: url,
					};
					await mailService.sendMail(dataMail);

					resolve({
						errorCode: 0,
						message: "Booking success",
						data: result,
					});
				} else {
					resolve({
						errorCode: 1,
						message: "Booking fail",
						data: result,
					});
				}
			}
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

const verifyBookAppointment = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.token || !data.doctorId) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				const { token } = commonService.decrypt(data.token);

				const appointment = await db.Booking.findOne({
					where: {
						doctorId: data.doctorId,
						token: token,
						statusId: STATUS.NEW,
					},
					raw: false,
				});

				if (appointment) {
					const toDay = moment().startOf("day").toDate();
					const validDate = moment(new Date(appointment.date)).isSameOrAfter(
						toDay
					);

					if (validDate) {
						appointment.statusId = STATUS.CONFIRMED;

						await appointment.save();

						resolve({
							errorCode: 0,
							message: "Update the appointment success!",
						});
					} else {
						resolve({
							errorCode: 1,
							message: "out_of_date",
						});
					}
				} else {
					resolve({
						errorCode: 2,
						message: "not_found",
					});
				}
			}
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

module.exports = {
	bookAppointment: bookAppointment,
	verifyBookAppointment: verifyBookAppointment,
};
