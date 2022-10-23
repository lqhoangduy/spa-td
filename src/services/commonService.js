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

module.exports = {
	encrypt: encrypt,
	decrypt: decrypt,
};
