const formatDate = (string) => {
	const day = string.slice(0, 2);
	const month = string.slice(3, 6);
	const year = string.slice(6, 10);
	const date = new Date(year + "/" + month + day);
	return date;
};

const databaseDate = (stringDate) => {
	return console.log(stringDate.substring(0, 10) + "_" + stringDate.substring(10 + 1));
};

module.exports = { formatDate, databaseDate };
