import db from "../models/index";
import commonService from "./commonService";
require("dotenv").config();

const createSpecialty = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				let imageHash = "";
				if (data.image) {
					imageHash = commonService.encrypt(data.image);
				}

				await db.Specialty.create({
					name: data.name,
					image: imageHash,
					descriptionHTML: data.descriptionHTML,
					descriptionMarkdown: data.descriptionMarkdown,
				});

				resolve({
					errorCode: 0,
					message: "Create specialty successfully",
				});
			}
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

const getSpecialties = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let specialties = await db.Specialty.findAll();
			const result = specialties.map((specialty) => {
				let image = specialty.image
					? commonService.decrypt(specialty.image)
					: null;
				return {
					...specialty,
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

const editSpecialty = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.id) {
				return resolve({
					errorCode: 2,
					message: "Missing params!",
				});
			}

			const specialty = await db.Specialty.findOne({
				where: { id: data.id },
				raw: false,
			});
			if (specialty) {
				specialty.name = data.name;
				specialty.descriptionHTML = data.descriptionHTML;
				specialty.descriptionMarkdown = data.descriptionMarkdown;
				if (data.image) {
					const imageHash = commonService.encrypt(data.image);
					specialty.image = imageHash;
				}

				await specialty.save();

				resolve({
					errorCode: 0,
					message: "Update user successfully",
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

const deleteSpecialty = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				return resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			}

			const specialty = await db.Specialty.findOne({
				where: { id: id },
				raw: false,
			});
			if (!specialty) {
				return resolve({
					errorCode: 2,
					message: "not_found",
				});
			}

			await specialty.destroy();
			resolve({
				errorCode: 0,
				message: "Deleted successfully",
			});
		} catch (error) {
			reject(error);
		}
	});
};

const getSpecialty = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				return resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			}

			const specialty = await db.Specialty.findOne({
				where: { id: id },
			});
			if (!specialty) {
				return resolve({
					errorCode: 2,
					message: "not_found",
				});
			}

			resolve({
				errorCode: 0,
				data: specialty,
			});
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	createSpecialty: createSpecialty,
	getSpecialties: getSpecialties,
	editSpecialty: editSpecialty,
	deleteSpecialty: deleteSpecialty,
	getSpecialty: getSpecialty,
};
