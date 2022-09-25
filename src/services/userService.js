import db from "../models/index";
import bcrypt from "bcryptjs";

import commonService from "../services/commonService";

const salt = bcrypt.genSaltSync(10);

const handleUserLogin = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			const userData = {};
			const user = await checkUserEmail(email);
			if (!!user) {
				const { password: hashPass, ...restUser } = user;
				const checkPassword = bcrypt.compareSync(password, hashPass);
				if (checkPassword) {
					userData.errorCode = 0;
					userData.message = "Login successfully.";
					userData.user = restUser;
				} else {
					userData.errorCode = 3;
					userData.message = "Wrong password!!!";
				}
			} else {
				userData.errorCode = 1;
				userData.message = `Your's email isn't exist. Please try other email!!!`;
			}
			resolve(userData);
		} catch (error) {
			reject(error);
		}
	});
};
const checkUserEmail = (email) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await db.User.findOne({
				where: { email: email },
				attributes: ["email", "roleId", "password", "firstName", "lastName"],
				raw: true,
			});
			resolve(user);
		} catch (error) {
			reject(error);
		}
	});
};

const getAllUsers = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let users = null;
			if (userId === "ALL") {
				users = await db.User.findAll({
					attributes: {
						exclude: ["password"],
					},
				});
			} else if (userId) {
				users = await db.User.findOne({
					where: { id: userId },
					attributes: {
						exclude: ["password"],
					},
				});
			}
			const result = users.map((user) => {
				let image = user.image ? commonService.decrypt(user.image) : null;
				return {
					...user,
					image: image,
				};
			});
			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

const createNewUser = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Check exist email
			const user = await checkUserEmail(data.email);

			if (!!user) {
				return resolve({
					errorCode: 1,
					message: "Your email is already used!!!",
				});
			}

			const hashPasswordFromBcrypt = await hashUserPassword(data.password);

			let imageHash = "";
			if (data.avatar) {
				imageHash = commonService.encrypt(data.avatar);
			}

			await db.User.create({
				email: data.email,
				password: hashPasswordFromBcrypt,
				firstName: data.firstName,
				lastName: data.lastName,
				address: data.address,
				phoneNumber: data.phoneNumber,
				gender: data.gender,
				roleId: data.roleId,
				positionId: data.positionId,
				image: imageHash,
			});

			resolve({
				errorCode: 0,
				message: "Create user successfully",
			});
		} catch (error) {
			reject(error);
		}
	});
};

const hashUserPassword = (password) => {
	return new Promise(async (resolve, reject) => {
		try {
			const hashPassword = await bcrypt.hashSync(password, salt);
			resolve(hashPassword);
		} catch (error) {
			reject(error);
		}
	});
};

const deleteUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await db.User.findOne({ where: { id }, raw: false });
			if (!user) {
				return resolve({
					errorCode: 2,
					message: "User isn't exist!!!",
				});
			}

			await user.destroy();
			resolve({
				errorCode: 0,
				message: "Deleted user successfully",
			});
		} catch (error) {
			reject(error);
		}
	});
};

const editUser = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.id) {
				return resolve({
					errorCode: 2,
					message: "Missing parameter required",
				});
			}

			const user = await db.User.findOne({
				where: { id: data.id },
				raw: false,
			});
			if (user) {
				user.firstName = data.firstName;
				user.lastName = data.lastName;
				user.address = data.address;
				if (data.phoneNumber) {
					user.phoneNumber = data.phoneNumber;
				}
				if (data.gender) {
					user.gender = data.gender;
				}
				if (data.roleId) {
					user.roleId = data.roleId;
				}
				if (data.positionId) {
					user.positionId = data.positionId;
				}
				if (data.avatar) {
					const imageHash = commonService.encrypt(data.avatar);
					user.image = imageHash;
				}

				await user.save();

				resolve({
					errorCode: 0,
					message: "Update user successfully",
				});
			} else {
				resolve({
					errorCode: 1,
					message: "User not found",
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const getAllCode = async (type) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!type) {
				resolve({
					errorCode: 1,
					message: "Missing required parameters!",
				});
			} else {
				const allCode = await db.Allcode.findAll({
					where: {
						type,
					},
				});

				resolve({
					errorCode: 0,
					data: allCode,
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	handleUserLogin: handleUserLogin,
	getAllUsers: getAllUsers,
	createNewUser: createNewUser,
	deleteUser: deleteUser,
	editUser: editUser,
	getAllCode: getAllCode,
};
