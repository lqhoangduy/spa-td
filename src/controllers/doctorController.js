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

const handleGetDetailDoctorById = async (req, res) => {
	try {
		const { id } = req.query;
		const response = await doctorService.getDetailDoctorById(id);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleGetDoctorByIds = async (req, res) => {
	try {
		const { ids } = req.body;
		const response = await doctorService.getDoctorByIds(ids);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleCreateSchedules = async (req, res) => {
	try {
		const response = await doctorService.createSchedules(req.body);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleGetSchedules = async (req, res) => {
	try {
		const { id } = req.query;
		const response = await doctorService.getSchedules(id);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleDeleteSchedules = async (req, res) => {
	try {
		const { id } = req.query;
		const response = await doctorService.deleteSchedules(id);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleGetSchedulesByDate = async (req, res) => {
	try {
		const { doctorId, date } = req.query;
		const response = await doctorService.getSchedulesByDate(doctorId, date);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleGetExtraInfoDoctor = async (req, res) => {
	try {
		const { id } = req.query;
		const response = await doctorService.getExtraInfo(id);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleGetPatientBooking = async (req, res) => {
	try {
		const { doctorId, date } = req.query;
		const response = await doctorService.getPatientBooking(doctorId, date);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleSendRemedy = async (req, res) => {
	try {
		const response = await doctorService.sendRemedy(req.body);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res
			.status(200)
			.json({ errorCode: -1, message: "Error from server" });
	}
};

const handleGetListDoctor = async (req, res) => {
	try {
		const { provinceId } = req.query;
		const data = await doctorService.getListDoctor(provinceId);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleCancelPatientBooking = async (req, res) => {
	try {
		const data = await doctorService.cancelPatientBooking(req.body);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

module.exports = {
	handleGetTopDoctorHome: handleGetTopDoctorHome,
	handleGetAllDoctors: handleGetAllDoctors,
	handleSaveInfoDoctor: handleSaveInfoDoctor,
	handleGetInfoDoctor: handleGetInfoDoctor,
	handleGetDetailDoctorById: handleGetDetailDoctorById,
	handleCreateSchedules: handleCreateSchedules,
	handleGetSchedules: handleGetSchedules,
	handleDeleteSchedules: handleDeleteSchedules,
	handleGetSchedulesByDate: handleGetSchedulesByDate,
	handleGetExtraInfoDoctor: handleGetExtraInfoDoctor,
	handleGetDoctorByIds: handleGetDoctorByIds,
	handleGetPatientBooking: handleGetPatientBooking,
	handleSendRemedy: handleSendRemedy,
	handleGetListDoctor: handleGetListDoctor,
	handleCancelPatientBooking: handleCancelPatientBooking,
};
