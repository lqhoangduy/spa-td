import db from "../models/index";
import commonService from "./commonService";
import doctorService from "./doctorService";
require("dotenv").config();

const createClinic = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (
				!data.name ||
				!data.address ||
				!data.descriptionHTML ||
				!data.descriptionMarkdown
			) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				let imageHash = "";
				if (data.image) {
					imageHash = commonService.encrypt(data.image);
				}

				await db.Clinic.create({
					name: data.name,
					address: data.address,
					image: imageHash,
					descriptionHTML: data.descriptionHTML,
					descriptionMarkdown: data.descriptionMarkdown,
				});

				resolve({
					errorCode: 0,
					message: "Create clinic successfully",
				});
			}
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

const getClinics = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let clinics = await db.Clinic.findAll();
			const result = clinics.map((clinic) => {
				let image = clinic.image ? commonService.decrypt(clinic.image) : null;
				return {
					...clinic,
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

const editClinic = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.id) {
				return resolve({
					errorCode: 2,
					message: "Missing params!",
				});
			}

			const clinic = await db.Clinic.findOne({
				where: { id: data.id },
				raw: false,
			});
			if (clinic) {
				clinic.name = data.name;
				clinic.address = data.address;
				clinic.descriptionHTML = data.descriptionHTML;
				clinic.descriptionMarkdown = data.descriptionMarkdown;
				if (data.image) {
					const imageHash = commonService.encrypt(data.image);
					clinic.image = imageHash;
				}

				await clinic.save();

				resolve({
					errorCode: 0,
					message: "Update clinic successfully",
				});
			} else {
				resolve({
					errorCode: 1,
					message: "not_found",
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const deleteClinic = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				return resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			}

			const clinic = await db.Clinic.findOne({
				where: { id: id },
				raw: false,
			});
			if (!clinic) {
				return resolve({
					errorCode: 2,
					message: "not_found",
				});
			}

			await clinic.destroy();
			resolve({
				errorCode: 0,
				message: "Deleted successfully",
			});
		} catch (error) {
			reject(error);
		}
	});
};

const getClinic = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				return resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			}

			const clinic = await db.Clinic.findOne({
				where: { id: id },
			});
			if (!clinic) {
				return resolve({
					errorCode: 2,
					message: "not_found",
				});
			}

			const image = clinic?.image ? commonService.decrypt(clinic.image) : null;
			clinic.image = image;

			resolve({
				errorCode: 0,
				data: clinic,
			});
		} catch (error) {
			reject(error);
		}
	});
};

const getDoctorClinic = (clinicId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!clinicId) {
				return resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			}

			const doctorClinic = await db.DoctorInfo.findAll({
				where: {
					clinicId: clinicId,
				},
				attributes: ["doctorId"],
			});

			const doctorIds = (doctorClinic || []).map((item) => item.doctorId);

			let result = [];

			if (doctorIds?.length) {
				const resultDoctor = await doctorService.getDoctorByIds(doctorIds);
				result = resultDoctor?.data || [];
			}

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
	createClinic: createClinic,
	getClinics: getClinics,
	editClinic: editClinic,
	deleteClinic: deleteClinic,
	getClinic: getClinic,
	getDoctorClinic: getDoctorClinic,
};
