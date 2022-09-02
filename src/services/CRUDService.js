import bcrypt from "bcryptjs";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

const createNewUser = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const hashPasswordFromBcrypt = await hashUserPassword(data.password);

			await db.User.create({
				email: data.email,
				password: hashPasswordFromBcrypt,
				firstName: data.firstName,
				lastName: data.lastName,
				address: data.address,
				phoneNumber: data.phoneNumber,
				gender: data.gender === "1" ? true : false,
				roleId: data.roleId,
			});

			resolve("ok! create a new user succeed");
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

const getAllUser = () => {
	return new Promise((resolve, reject) => {
		try {
			const users = db.User.findAll({
				raw: true,
			});
			resolve(users);
		} catch (error) {
			reject(error);
		}
	});
};

const getUserInfoById = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await db.User.findOne({ where: { id: userId }, raw: true });
			if (user) {
				resolve(user);
			} else {
				resolve({});
			}
		} catch (error) {
			reject(error);
		}
	});
};

const updateUserData = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await db.User.findOne({ where: { id: data.id } });
			if (user) {
				user.firstName = data.firstName;
				user.lastName = data.lastName;
				user.address = data.address;

				await user.save();

				const allUser = await db.User.findAll({
					raw: true,
				});
				resolve(allUser);
			} else {
				resolve();
			}
		} catch (error) {
			reject(error);
		}
	});
};

const deleteUserById = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await db.User.findOne({ where: { id: id } });
			if (user) {
				await user.destroy();
			}
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	createNewUser: createNewUser,
	getAllUser: getAllUser,
	getUserInfoById: getUserInfoById,
	updateUserData: updateUserData,
	deleteUserById: deleteUserById,
};
