const csv = require("fast-csv");
const fs = require("fs");

module.exports = class Csv {
  generate(data) {
    const csvStream = csv.format({ headers: true });
    csvStream.pipe(fs.createWriteStream(`csv${Date.now()}.csv`));
    data.forEach((row) => {
      csvStream.write(row);
    });
  }
};
