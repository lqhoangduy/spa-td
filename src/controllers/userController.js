import userService from "../services/userService";

const handleLogin = async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(500).json({
			errorCode: 1,
			message: "Missing inputs parameter!!!",
		});
	}
	// Return user info
	// access_token: ...
	const userData = await userService.handleUserLogin(email, password);
	return res.status(200).json({
		errorCode: userData.errorCode,
		message: userData.message,
		user: userData.user ? userData.user : {},
	});
};

const handleGetAllUsers = async (req, res) => {
	const id = req.query.id; // ALL, SINGLE

	if (!id) {
		return res.status(200).json({
			errorCode: 1,
			message: "Missing required parameter",
			user: [],
		});
	}

	const users = await userService.getAllUsers(id);

	return res.status(200).json({
		errorCode: 0,
		message: "Ok",
		users,
	});
};

const handleCreateUser = async (req, res) => {
	const result = await userService.createNewUser(req.body);

	return res.status(200).json(result);
};

const handleEditUser = async (req, res) => {
	const data = req.body;
	const result = await userService.editUser(data);
	return res.status(200).json(result);
};

const handleDeleteUser = async (req, res) => {
	if (!req.body.id) {
		return res.status(200).json({
			errorCode: 1,
			message: "Missing parameter required!!!",
		});
	}

	const result = await userService.deleteUser(req.body.id);

	return res.status(200).json(result);
};

const handleGetAllCode = async (req, res) => {
	try {
		const data = await userService.getAllCode(req.query.type);

		return res.status(200).json(data);
	} catch (error) {
		console.error("Get all code error", error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

module.exports = {
	handleLogin: handleLogin,
	handleGetAllUsers: handleGetAllUsers,
	handleCreateUser: handleCreateUser,
	handleEditUser: handleEditUser,
	handleDeleteUser: handleDeleteUser,
	handleGetAllCode: handleGetAllCode,
};
