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
	// Check email exist
	// Compare password
	// Return user info
	// access_token: ...
	const userData = await userService.handleUserLogin(email, password);
	return res.status(200).json({
		errorCode: userData.errorCode,
		message: userData.message,
		user: userData.user ? userData.user : {},
	});
};

module.exports = {
	handleLogin: handleLogin,
};
