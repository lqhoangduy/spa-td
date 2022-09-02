import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";

require("dotenv").config();

const app = express();

const corsOptions = {
	origin: true,
	credentials: true,
};
app.use(cors(corsOptions));

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

const port = process.env.PORT || 6969;

app.listen(port, () => {
	console.log("Backend Nodejs is running on port :" + port);
});
