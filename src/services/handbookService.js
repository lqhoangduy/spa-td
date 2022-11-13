import db from "../models/index";
import commonService from "./commonService";
import doctorService from "./doctorService";
require("dotenv").config();

const createHandbook = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.title || !data.descriptionHTML || !data.descriptionMarkdown) {
				resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			} else {
				let imageHash = "";
				if (data.image) {
					imageHash = commonService.encrypt(data.image);
				}

				await db.Handbook.create({
					title: data.title,
					image: imageHash,
					descriptionHTML: data.descriptionHTML,
					descriptionMarkdown: data.descriptionMarkdown,
				});

				resolve({
					errorCode: 0,
					message: "Create handbook successfully",
				});
			}
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

const getHandbooks = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let handbooks = await db.Handbook.findAll();
			const result = handbooks.map((handbook) => {
				let image = handbook.image
					? commonService.decrypt(handbook.image)
					: null;
				return {
					...handbook,
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

const editHandbook = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.id) {
				return resolve({
					errorCode: 2,
					message: "Missing params!",
				});
			}

			const handbook = await db.Handbook.findOne({
				where: { id: data.id },
				raw: false,
			});
			if (handbook) {
				handbook.title = data.title;
				handbook.descriptionHTML = data.descriptionHTML;
				handbook.descriptionMarkdown = data.descriptionMarkdown;
				if (data.image) {
					const imageHash = commonService.encrypt(data.image);
					handbook.image = imageHash;
				}

				await handbook.save();

				resolve({
					errorCode: 0,
					message: "Update handbook successfully",
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

const deleteHandbook = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				return resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			}

			const handbook = await db.Handbook.findOne({
				where: { id: id },
				raw: false,
			});
			if (!handbook) {
				return resolve({
					errorCode: 2,
					message: "not_found",
				});
			}

			await handbook.destroy();
			resolve({
				errorCode: 0,
				message: "Deleted successfully",
			});
		} catch (error) {
			reject(error);
		}
	});
};

const getHandbook = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				return resolve({
					errorCode: 1,
					message: "Missing params!",
				});
			}

			const handbook = await db.Handbook.findOne({
				where: { id: id },
			});
			if (!handbook) {
				return resolve({
					errorCode: 2,
					message: "not_found",
				});
			}

			const image = handbook?.image
				? commonService.decrypt(handbook.image)
				: null;
			handbook.image = image;

			resolve({
				errorCode: 0,
				data: handbook,
			});
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	createHandbook: createHandbook,
	getHandbooks: getHandbooks,
	editHandbook: editHandbook,
	deleteHandbook: deleteHandbook,
	getHandbook: getHandbook,
};
