import CryptoJS from "crypto-js";

const hashPass = process.env.HASH_KEY;

const encrypt = (data) => {
	const encryptedData = CryptoJS.AES.encrypt(
		JSON.stringify(data),
		hashPass
	).toString();
	return encryptedData;
};

const decrypt = (data) => {
	const bytes = CryptoJS.AES.decrypt(data, hashPass);
	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	return decryptedData;
};

const encryptString = (message) => {
	const encryptedData = CryptoJS.AES.encrypt(message, hashPass);
	return encryptedData;
};

const decryptString = (messageDecrypt) => {
	const bytes = CryptoJS.AES.decrypt(messageDecrypt, hashPass);
	const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
	return decryptedData;
};

module.exports = {
	encrypt: encrypt,
	decrypt: decrypt,
	encryptString: encryptString,
	decryptString: decryptString,
};
