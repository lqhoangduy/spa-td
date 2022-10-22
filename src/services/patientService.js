import e from "express";
import moment from "moment";
import sequelize, { Op } from "sequelize";
import db from "../models/index";
import { LANGUAGES, ROLES, STATUS } from "../utils/contants";
import mailService from "./mailService";
import userService from "./userService";
require("dotenv").config();

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
				const dataMail = {
					language: data.language,
					receiverEmail: data.email,
					name: data.name,
					doctorName: data.doctorName,
					time: data.timeString,
					phone: data.phoneNumber,
					redirectUrl: "fb.com/lqhoangduy",
				};
				await mailService.sendMail(dataMail);

				let result = {};

				// Get or create patient
				const [user, isUserCreate] = await db.User.findOrCreate({
					where: { email: data.email },
					defaults: {
						email: data.email,
						roleId: ROLES.PATIENT,
					},
				});

				result.user = user;
				result.isUserCreate = isUserCreate;

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
						},
					});

					result.booking = booking;
					result.isBookingCreated = isBookingCreated;
				}

				if (result.booking && result.user) {
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

module.exports = {
	bookAppointment: bookAppointment,
};
