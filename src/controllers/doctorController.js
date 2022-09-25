import doctorService from "../services/doctorService";

const handleGetTopDoctorHome = async (req, res) => {
	const { limit = 10 } = req.query;
	try {
		const response = await doctorService.getTopDoctorHome(limit);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

module.exports = {
	handleGetTopDoctorHome: handleGetTopDoctorHome,
};
