import express from "express";
const cloudinary = require("cloudinary");
const fs = require("fs");
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";

// we will upload image on cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

const router = express.Router();

const initWebRoutes = (app) => {
	router.get("/", homeController.getHomePage);
	router.get("/about", homeController.getAboutPage);
	router.get("/crud", homeController.getCRUD);

	router.post("/post-crud", homeController.postCRUD);
	router.get("/get-crud", homeController.displayGetCRUD);
	router.get("/edit-crud", homeController.getEditCRUD);
	router.post("/put-crud", homeController.putCRUD);
	router.get("/delete-crud", homeController.deleteCRUD);

	// User
	router.post("/api/login", userController.handleLogin);
	router.get("/api/get-users", userController.handleGetAllUsers);
	router.post("/api/create-user", userController.handleCreateUser);
	router.put("/api/edit-user", userController.handleEditUser);
	router.delete("/api/delete-user", userController.handleDeleteUser);
	router.get("/api/all-code", userController.handleGetAllCode);

	// Doctor
	router.get("/api/top-doctor-home", doctorController.handleGetTopDoctorHome);
	router.get("/api/get-all-doctors", doctorController.handleGetAllDoctors);
	router.get("/api/get-info-doctor", doctorController.handleGetInfoDoctor);
	router.post("/api/save-info-doctor", doctorController.handleSaveInfoDoctor);
	router.get(
		"/api/get-detail-doctor-by-id",
		doctorController.handleGetDetailDoctorById
	);
	router.post("/api/get-doctor-by-ids", doctorController.handleGetDoctorByIds);
	router.get(
		"/api/get-extra-info-doctor",
		doctorController.handleGetExtraInfoDoctor
	);
	router.get(
		"/api/get-patient-booking",
		doctorController.handleGetPatientBooking
	);

	// Schedules
	router.post("/api/create-schedules", doctorController.handleCreateSchedules);
	router.get("/api/get-schedules", doctorController.handleGetSchedules);
	router.delete(
		"/api/delete-schedules",
		doctorController.handleDeleteSchedules
	);
	router.get(
		"/api/get-schedules-by-date",
		doctorController.handleGetSchedulesByDate
	);

	// Book appointment
	router.post("/api/book-appointment", patientController.handleBookAppointment);
	router.post(
		"/api/verify-book-appointment",
		patientController.handleVerifyBookAppointment
	);

	// Specialty
	router.post(
		"/api/create-specialty",
		specialtyController.handleCreateSpecialty
	);
	router.get("/api/get-specialties", specialtyController.handleGetSpecialties);
	router.put("/api/edit-specialty", specialtyController.handleEditSpecialty);
	router.delete(
		"/api/delete-specialty",
		specialtyController.handleDeleteSpecialty
	);
	router.get("/api/get-specialty", specialtyController.handleGetSpecialty);
	router.get(
		"/api/get-doctor-specialty",
		specialtyController.handleGetDoctorSpecialty
	);

	// Clinic
	router.post("/api/create-clinic", clinicController.handleCreateClinic);
	router.get("/api/get-clinics", clinicController.handleGetClinics);
	router.put("/api/edit-clinic", clinicController.handleEditClinic);
	router.delete("/api/delete-clinic", clinicController.handleDeleteClinic);
	router.get("/api/get-clinic", clinicController.handleGetClinic);
	router.get("/api/get-doctor-clinic", clinicController.handleGetDoctorClinic);

	// Upload image only admin can use
	router.post("/api/upload", (req, res) => {
		try {
			if (!req.files || Object.keys(req.files).length === 0)
				return res
					.status(200)
					.json({ errorCode: 1, message: "No files were uploaded." });

			const file = req.files.file;
			if (file.size > 1024 * 1024) {
				removeTmp(file.tempFilePath);
				return res
					.status(200)
					.json({ errorCode: 2, message: "Size too large" });
			}

			if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
				removeTmp(file.tempFilePath);
				return res
					.status(200)
					.json({ errorCode: 3, message: "File format is incorrect." });
			}

			cloudinary.v2.uploader.upload(
				file.tempFilePath,
				{ folder: "test" },
				async (err, result) => {
					if (err) throw err;

					removeTmp(file.tempFilePath);

					res.json({
						errorCode: 0,
						data: { public_id: result.public_id, url: result.secure_url },
					});
				}
			);
		} catch (err) {
			return res.status(500).json({ errorCode: 4, message: err.message });
		}
	});

	// Delete image only admin can use
	router.post("/api/destroy", (req, res) => {
		try {
			const { public_id } = req.body;
			if (!public_id)
				return res
					.status(200)
					.json({ errorCode: 1, message: "No images Selected" });

			cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
				if (err) throw err;

				res.json({ errorCode: 0, message: "Deleted Image" });
			});
		} catch (err) {
			return res.status(500).json({ errorCode: 2, message: err.message });
		}
	});

	const removeTmp = (path) => {
		fs.unlink(path, (err) => {
			if (err) throw err;
		});
	};

	return app.use("/", router);
};

module.exports = initWebRoutes;
