import clinicService from "../services/clinicService";

const handleCreateClinic = async (req, res) => {
	try {
		const data = await clinicService.createClinic(req.body);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleGetClinics = async (req, res) => {
	try {
		const data = await clinicService.getClinics();

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleEditClinic = async (req, res) => {
	try {
		const data = await clinicService.editClinic(req.body);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleDeleteClinic = async (req, res) => {
	try {
		const id = req.query.id;
		const data = await clinicService.deleteClinic(id);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleGetClinic = async (req, res) => {
	try {
		const id = req.query.id;
		const data = await clinicService.getClinic(id);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleGetDoctorClinic = async (req, res) => {
	try {
		const { clinicId } = req.query;
		const data = await clinicService.getDoctorClinic(clinicId);

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
	handleCreateClinic: handleCreateClinic,
	handleGetClinics: handleGetClinics,
	handleEditClinic: handleEditClinic,
	handleDeleteClinic: handleDeleteClinic,
	handleGetClinic: handleGetClinic,
	handleGetDoctorClinic: handleGetDoctorClinic,
};
