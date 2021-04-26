const xlsx = require("xlsx");
const path = require("path");
const { format } = require("date-fns");

const getType = (type) => {
  if (type === "compra") {
    return "buy";
  }
  if (type === "venda") {
    return "sell";
  }
  return;
};

const readTrades = () => {
  const data = xlsx.readFile(path.resolve(__dirname, "xlsx/cripto.xlsx"), {
    cellDates: true,
  });

  const json = [];

  data.SheetNames.forEach((sheet) => {
    json.push(
      ...xlsx.utils.sheet_to_json(data.Sheets[sheet], {
        dateNF: "dd-mm-yyyy",
      })
    );
  });

  return json.map((row) => ({
    coin: row.moeda,
    date: format(new Date(row.data), "yyyy-MM-dd"),
    type: getType(row.tipo),
    quantity: row.quantidade,
    value: row.valor,
    price: row.preço,
    tax: row.taxa,
  }));
};

module.exports = { readTrades };
