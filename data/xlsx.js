const xlsx = require("xlsx");
const path = require("path");
const { format } = require("date-fns");

const readTrades = () => {
  const data = xlsx.readFile(path.resolve(__dirname, "xlsx/cripto.xlsx"), {
    cellDates: true,
  });

  const json = xlsx.utils.sheet_to_json(data.Sheets[data.SheetNames[0]], {
    dateNF: "dd-mm-yyyy",
  });

  return json.map((row) => ({
    coin: row.moeda,
    date: format(new Date(row.data), 'yyyy-MM-dd'),
    type: row.tipo === "compra" ? "buy" : "sell",
    quantity: row.quantidade,
    value: row.valor,
    price: row.preço,
    tax: row.taxa,
  }));
};

console.log(readTrades());

module.exports = { readTrades };
