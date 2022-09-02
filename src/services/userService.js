import db from "../models/index";
import bcrypt from "bcryptjs";

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
				attributes: ["email", "roleId", "password"],
				raw: true,
			});
			resolve(user);
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	handleUserLogin: handleUserLogin,
};
