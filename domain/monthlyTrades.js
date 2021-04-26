const Csv = require("../data/csv");
const { coloredLog } = require("./utils");
const Trades = require("./trades");
const chart = require("../data/charts");
const xlsx = require("../data/xlsx")

const translateType = (type) => {
  if (type === "buy") {
    return "Compra";
  }
  if (type === "sell") {
    return "Venda";
  }
  return;
};

const monthlyTrades = () => {
  const csv = new Csv();

  const monthTrades = new Trades(xlsx.readTrades().filter(row => row.coin === 'bitcoin'));
  monthTrades.buildTrades();

  csv.generate(
    monthTrades.tradesObj.map((trade) => {
      return {
        Indice: trade.idx,
        Data: trade.date,

        "Preço da moeda": trade.price,

        "Quantidade de cripto": trade.quantity,
        "Taxa em quantidade de cripto": trade.taxQuantity,
        "Quantidade de cripto menos taxas": trade.quantityWithoutTaxes,

        "Quantidade de cripto acumulada": trade.quantityAccumulated,
        "Taxa em quantidade acumulada": trade.taxQuantityAccumulated,
        "Quantidade de cripto menos taxas acumulada":
          trade.quantityWithoutTaxesAccumulated,

        "Valor reais": trade.value,
        "Taxa em reais": trade.taxValue,
        "Valor reais menos taxas": trade.valueWithoutTaxes,

        "Valor reais acumulado": trade.valueAccumulated,
        "Taxa em reais acumulada": trade.taxValueAccumulated,
        "Valor reais menos taxas acumulado": trade.valueWithoutTaxesAccumulated,

        "Preco medio": trade.meanPrice,

        "Lucro de venda": trade.sellGain,

        Imposto: trade.governmentTax,
        Tipo: translateType(trade.type),
      };
    })
  );

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

  chart(monthTrades.tradesObj);
};

module.exports = {
  monthlyTrades,
};
