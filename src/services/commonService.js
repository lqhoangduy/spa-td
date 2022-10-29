import CryptoJS from "crypto-js";

const hashPass = process.env.HASH_KEY;
const hashIV = "0123456789ABCDEF";

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

const encryptData = (data) => {
	const Key = CryptoJS.enc.Utf8.parse(hashPass);
	const IV = CryptoJS.enc.Utf8.parse(hashIV);
	const encryptedText = CryptoJS.AES.encrypt(JSON.stringify(data), Key, {
		iv: IV,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});
	return encryptedText.toString(CryptoJS.format.Base64);
};

const decryptData = (encryptedData) => {
	const C = CryptoJS;
	const Key = C.enc.Utf8.parse(hashPass);
	const IV = C.enc.Utf8.parse(hashIV);
	const decryptedText = C.AES.decrypt(encryptedData, Key, {
		iv: IV,
		mode: C.mode.CBC,
		padding: C.pad.Pkcs7,
	});
	return JSON.parse(decryptedText.toString(CryptoJS.enc.Utf8));
};

module.exports = {
	encrypt: encrypt,
	decrypt: decrypt,
	encryptData: encryptData,
	decryptData: decryptData,
};
