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

const sendMailConfirm = async (data) => {
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

	let attachments = [];

	if (data?.image) {
		attachments.push({
			filename: data.language === LANGUAGES.EN ? "result.jpg" : "ketqua.jpg",
			path: data?.image,
		});
	}

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: `"Rejuvenate Spa" <${mailUser}>`,
		to: data.receiverEmail,
		subject:
			data.language === LANGUAGES.EN
				? "Examination results"
				: "Kết quả khám bệnh",
		html: buildTemplateEmailRemedy(data),
		attachments: attachments,
	});

	console.log("Message sent: %s", info.messageId);
};

const buildTemplateEmailRemedy = (data) => {
	if (data.language === LANGUAGES.EN) {
		return `
      <h3>Dear ${data.patientName}!</h3>
      <p>Rejuvenate Spa would like to send information about medical examination results:</p>
      <div>
        <ul>
        <li><b>Patient: ${data.doctorName}</b></li>
        <li><b>Time: ${data.time}</b></li>
        </ul>
      </div>
			<p>
				<b>Note of doctor: </b>
				${data.note}
			</p>
      <p>Please check the picture of the prescription/ examination results in the attached file.</p>
      <p>
        <strong>Rejuvenate Spa</strong> sincerely thank!!!
      </p>
    `;
	} else {
		return `
      <h3>Xin chào ${data.patientName}!</h3>
      <p>Rejuvenate Spa xin gửi thông tin kết quả khám bệnh:</p>
      <div>
        <ul>
        <li><b>Bệnh nhân: ${data.doctorName}</b></li>
        <li><b>Thời gian khám: ${data.time}</b></li>
        </ul>
      </div>
			<p>
				<b>Ghi chú của bác sĩ: </b>
				${data.note}
			</p>
      <p>Bạn vui lòng kiểm tra ảnh đơn thuốc/ kết quả khám trong file đính kèm.</p>
      <p>
        <strong>Rejuvenate Spa</strong> xin chân thành cảm ơn!!!
      </p>
    `;
	}
};
module.exports = {
	sendMail: sendMail,
	sendMailConfirm: sendMailConfirm,
};
