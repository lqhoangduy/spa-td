import nodemailer from "nodemailer";
import { LANGUAGES } from "../utils/contants";
require("dotenv").config();

const sendMail = async (data) => {
	const mailUser = process.env.MAIL_USER;
	const mailPassword = process.env.MAIL_PASSWORD;

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: mailUser,
			pass: mailPassword,
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: `"Rejuvenate Spa" <${mailUser}>`,
		to: data.receiverEmail,
		subject:
			data.language === LANGUAGES.EN
				? "Information to book an appointment"
				: "Thông tin đặt lịch khám",
		html: buildTemplateEmail(data),
	});

	console.log("Message sent: %s", info.messageId);
};

const buildTemplateEmail = (data) => {
	if (data.language === LANGUAGES.EN) {
		return `
      <h3>Dear ${data.name}!</h3>
      <p>You have booked an appointment on the Rejuvenate Spa website</p>
      <p>Please check and confirm the information below:</p>
      <div>
        <ul>
        <li><b>Doctor: ${data.doctorName}</b></li>
        <li><b>Time: ${data.time}</b></li>
        <li><b>Phone number: ${data.phone}</b></li>
        </ul>
      </div>
      <p>Please click on the link below to confirm and complete the booking information.</p>
      <a href=${data.redirectUrl} target="_blank">Click here to confirm</a>
      <p>
        <strong>Rejuvenate Spa</strong> sincerely thank!!!
      </p>
    `;
	} else {
		return `
      <h3>Xin chào ${data.name}!</h3>
      <p>Bạn đã đặt lịch khám trên website của Rejuvenate Spa</p>
      <p>Vui lòng kiểm tra và xác nhận lại thông tin dưới đây: </p>
      <div>
        <ul>
        <li><b>Bác sĩ: ${data.doctorName}</b></li>
        <li><b>Thời gian: ${data.time}</b></li>
        <li><b>Số điện thoại: ${data.phone}</b></li>
        </ul>
      </div>
      <p>Vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thông tin đặt lịch.</p>
      <a href=${data.redirectUrl} target="_blank">Nhấn vào đây để xác nhận</a>
      <p>
        <strong>Rejuvenate Spa</strong> xin chân thành cảm ơn!!!
      </p>
    `;
	}
};

module.exports = {
	sendMail: sendMail,
};
