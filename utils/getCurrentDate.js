const currentDate = (type) => {
	const newDate = new Date();

	const date = {
		year: newDate.getFullYear().toString(),
		month:
			newDate.getMonth().toString().length < 2
				? "0" + newDate.getMonth().toString()
				: newDate.getMonth().toString(),
		day:
			newDate.getDate().toString().length < 2 ? "0" + newDate.getDate().toString() : newDate.getDate().toString(),
		hours:
			newDate.getHours().toString().length < 2
				? "0" + newDate.getHours().toString()
				: newDate.getHours().toString(),
		minutes:
			newDate.getMinutes().toString().length < 2
				? "0" + newDate.getMinutes().toString()
				: newDate.getMinutes().toString(),
		seconds:
			newDate.getSeconds().toString().length < 2
				? "0" + newDate.getSeconds().toString()
				: newDate.getSeconds().toString(),
	};

	switch (type) {
		case "time":
			return `${date.hours}:${date.minutes}:${date.seconds}`;

		case "date":
			return `${date.year}-${date.month}-${date.day}`;

		case "full":
			return `${date.year}-${date.month}-${date.day}-${date.hours}:${date.minutes}:${date.seconds}`;

		default:
			break;
	}
};

module.exports = currentDate;
