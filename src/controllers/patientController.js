import db from "../models/index";
import patientService from "../services/patientService";

const handleBookAppointment = async (req, res) => {
	try {
		const data = await patientService.bookAppointment(req.body);

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
	handleBookAppointment: handleBookAppointment,
};
