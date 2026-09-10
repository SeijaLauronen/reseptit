function parseCsv(text) {
    const lines = text
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter(line => line.trim() !== "");

    if (lines.length === 0) {
        return [];
    }

    const headers = lines[0].split(";");

    return lines.slice(1).map(line => {
        const values = line.split(";");

        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index] ?? "";
        });

        return row;
    });
}

function parseNumber(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const number = Number(String(value).replace(",", "."));

    return Number.isNaN(number) ? null : number;
}

module.exports = {
    parseCsv,
    parseNumber
};