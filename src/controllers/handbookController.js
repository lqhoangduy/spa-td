import handbookService from "../services/handbookService";

const handleCreateHandbook = async (req, res) => {
	try {
		const data = await handbookService.createHandbook(req.body);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleGetHandbooks = async (req, res) => {
	try {
		const data = await handbookService.getHandbooks();

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleEditHandbook = async (req, res) => {
	try {
		const data = await handbookService.editHandbook(req.body);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleDeleteHandbook = async (req, res) => {
	try {
		const id = req.query.id;
		const data = await handbookService.deleteHandbook(id);

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(200).json({
			errorCode: -1,
			message: "Error from server",
		});
	}
};

const handleGetHandbook = async (req, res) => {
	try {
		const id = req.query.id;
		const data = await handbookService.getHandbook(id);

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
	handleCreateHandbook: handleCreateHandbook,
	handleGetHandbooks: handleGetHandbooks,
	handleEditHandbook: handleEditHandbook,
	handleDeleteHandbook: handleDeleteHandbook,
	handleGetHandbook: handleGetHandbook,
};
