import specialtyService from "../services/specialtyService";

const handleCreateSpecialty = async (req, res) => {
	try {
		const data = await specialtyService.createSpecialty(req.body);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleGetSpecialties = async (req, res) => {
	try {
		const data = await specialtyService.getSpecialties();

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleEditSpecialty = async (req, res) => {
	try {
		const data = await specialtyService.editSpecialty(req.body);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleDeleteSpecialty = async (req, res) => {
	try {
		const id = req.query.id;
		const data = await specialtyService.deleteSpecialty(id);

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
	handleCreateSpecialty: handleCreateSpecialty,
	handleGetSpecialties: handleGetSpecialties,
	handleEditSpecialty: handleEditSpecialty,
	handleDeleteSpecialty: handleDeleteSpecialty,
};
