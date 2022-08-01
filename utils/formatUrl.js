const formatUrl = (string) => {
    const formatDescription = [string].map((i) => i.replace(/&/g, "%26")).join("");
    const slicedString = formatDescription.substring(43);
    return slicedString;
};

module.exports = { formatUrl }