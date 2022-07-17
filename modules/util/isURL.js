const { URL } = require("url");

module.exports = (input) => {
	if (typeof input !== "string" || input.includes(" ")) return false;
	try {
		const url = new URL(input);
		if (!["https:", "http:"].includes(url.protocol) || !url.host) return false;
	} catch {
		return false;
	}
	return true;
};
