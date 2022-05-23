const formatDate = (string) => {
    const day = string.slice(0, 2)
    const month = string.slice(3, 6)
    const year = string.slice(6, 10)
	const date = new Date(year + "/" + month + day);
    return date;

};

module.exports = formatDate;
