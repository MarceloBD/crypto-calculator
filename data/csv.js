const csv = require("fast-csv");
const fs = require("fs");

module.exports = class Csv {
  generate(data, coin) {
    const csvStream = csv.format({ headers: true });
    csvStream.pipe(fs.createWriteStream(`csv_${Date.now()}_${coin}.csv`));
    data.forEach((row) => {
      csvStream.write(row);
    });
  }
};
