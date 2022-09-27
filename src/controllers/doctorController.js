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

const handleGetAllDoctors = async (req, res) => {
	try {
		const response = await doctorService.getAllDoctors();
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleSaveInfoDoctor = async (req, res) => {
	try {
		const response = await doctorService.saveInfoDoctor(req.body);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleGetInfoDoctor = async (req, res) => {
	try {
		const { doctorId } = req.query;
		const response = await doctorService.getInfoDoctor(doctorId);
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
	handleGetAllDoctors: handleGetAllDoctors,
	handleSaveInfoDoctor: handleSaveInfoDoctor,
	handleGetInfoDoctor: handleGetInfoDoctor,
};
