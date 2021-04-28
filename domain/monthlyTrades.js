const Csv = require("../data/csv");
const Trades = require("./trades");
const chart = require("../data/charts");
const xlsx = require("../data/xlsx");

const translateType = (type) => {
  if (type === "buy") {
    return "Compra";
  }
  if (type === "sell") {
    return "Venda";
  }
  return;
};

const analyzeCoin = (input, coin) => {
  console.info("Analisando: ", coin);
  const csv = new Csv();

  const monthTrades = new Trades(input.filter((row) => row.coin === coin));
  monthTrades.buildTrades();

  csv.generate(
    monthTrades.tradesObj.map((trade) => {
      return {
        Indice: trade.idx,
        Data: trade.date,

        "Preco da moeda": trade.price,

        "Quantidade de cripto (bruto)": trade.quantity,
        "Taxa em quantidade de cripto": trade.taxQuantity,
        "Quantidade de cripto menos taxas (liquido)": trade.quantityWithoutTaxes,

        "Valor reais (bruto)": trade.value,
        "Taxa em reais": trade.taxValue,
        "Valor reais menos taxas (liquido)": trade.valueWithoutTaxes,

        "Saldo de cripto (bruto)": trade.quantityAccumulated,
        "Taxa em quantidade acumulada": trade.taxQuantityAccumulated,
        "Saldo de cripto menos taxas acumulada (liquido)":
          trade.quantityWithoutTaxesAccumulated,

        "Saldo reais acumulado (bruto)": trade.valueAccumulated,
        "Taxa em reais acumulada": trade.taxValueAccumulated,
        "Saldo reais menos taxas acumulado (liquido)": trade.valueWithoutTaxesAccumulated,

        "Preco medio": trade.meanPrice ? trade.meanPrice : "-",

        "Lucro de venda (liquido)": trade.sellGain,

        Imposto: trade.governmentTax,
        Tipo: translateType(trade.type),
      };
    }),
    coin
  );
  chart(monthTrades.tradesObj, coin);
};


const monthlyTrades = () => {
  const input = xlsx.readTrades();
  new Set(input.map((row) => row.coin)).forEach((coin) =>
    analyzeCoin(input, coin)
  );
  /*
  process.stdout.write("Valor alienado (vendido) foi de: ");
  coloredLog(monthTrades.totalSold);
  if (monthTrades.totalSold > 35000) {
    console.log(
      "Você DEVE declarar Darf do mês devido ao valor de venda ser maior que 35 mil"
    );
  } else {
    console.log(
      "Você NÃO deve declarar Darf do mês devido ao valor de venda ser menor que 35 mil"
    );
  }
  */
};

module.exports = {
  monthlyTrades,
};
