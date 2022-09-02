import db from "../models/index";
import CRUDService from "../services/CRUDService";

const getHomePage = async (req, res) => {
	try {
		const data = await db.User.findAll();
		return res.render("homepage.ejs", {
			data: JSON.stringify(data),
		});
	} catch (error) {
		console.log(error);
	}
};

const getAboutPage = (req, res) => {
	return res.render("test/about.ejs");
};

const getCRUD = (req, res) => {
	return res.render("crud.ejs");
};

const postCRUD = async (req, res) => {
	const message = await CRUDService.createNewUser(req.body);
	return res.send("Post crud form server");
};

const displayGetCRUD = async (req, res) => {
	const data = await CRUDService.getAllUser();
	return res.render("displayCRUD.ejs", {
		dataTable: data,
	});
};

const getEditCRUD = async (req, res) => {
	const userId = req.query.id;
	if (userId) {
		const userData = await CRUDService.getUserInfoById(userId);
		return res.render("editCRUD.ejs", {
			user: userData,
		});
	} else {
		return res.send("User not found");
	}
};

const putCRUD = async (req, res) => {
	const data = req.body;
	const allUser = await CRUDService.updateUserData(data);
	return res.render("displayCRUD.ejs", {
		dataTable: allUser,
	});
};

const deleteCRUD = async (req, res) => {
	const id = req.query.id;
	if (id) {
		await CRUDService.deleteUserById(id);
		return res.send("Delete user successfully!!! ");
	} else {
		return res.send("User not found");
	}
};

module.exports = {
	getHomePage: getHomePage,
	getAboutPage: getAboutPage,
	getCRUD: getCRUD,
	postCRUD: postCRUD,
	displayGetCRUD: displayGetCRUD,
	getEditCRUD: getEditCRUD,
	putCRUD: putCRUD,
	deleteCRUD: deleteCRUD,
};
