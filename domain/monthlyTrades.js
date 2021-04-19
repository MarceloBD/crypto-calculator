const getTrades = require("../data/trades");
const TRADES = getTrades.TRADES();
const Csv = require("../data/csv");
const {
  round,
  money,
  accumulated,
  moneySum,
  roundSum,
  coloredLog,
} = require("./utils");

const getAllValues = (trades) => {
  return trades.map((trade) => {
    return trade.type === "buy" ? trade.value : -trade.value;
  });
};

const getAllQuantities = (trades) => {
  return trades.map((trade) => {
    return trade.type === "buy" ? trade.quantity : -trade.quantity;
  });
};

const getAllTaxesValues = (trades) => {
  return trades.map((trade) => {
    return trade.type === "buy"
      ? round(trade.price * trade.tax)
      : round(trade.tax);
  });
};

const getAllTaxesQuantities = (trades) => {
  return trades.map((trade) => {
    return trade.type === "buy" ? round(trade.tax) : 0;
  });
};

const getMeanPrice = (
  trade,
  idx,
  allValues,
  buyTaxesValues,
  allQuantities,
  allTaxesQuantities
) => {
  const buyTaxesQuantities = allTaxesQuantities.map((tax, idx) =>
    TRADES[idx].type === "buy" ? tax : 0
  );

  let index = idx;

  if (trade.type === "sell") {
    const oldBuys = TRADES.filter(
      (t, index) => idx > index && t.type === "buy"
    );

    index = TRADES.indexOf(oldBuys[oldBuys.length - 1]);
  }

  return money(
    (accumulated(allValues, index, moneySum) -
      accumulated(buyTaxesValues, index, moneySum)) /
      (accumulated(allQuantities, index, roundSum) -
        accumulated(buyTaxesQuantities, index, roundSum))
  );
};

const getTotalSold = (trades) => {
  return trades.reduce(
    (acc, cur) => (cur.type === "sell" ? acc + cur.value : acc),
    0
  );
};

const getBuyTaxesValues = (trades) => {
  return getAllTaxesValues(trades).map((tax, idx) =>
    TRADES[idx].type === "buy" ? tax : 0
  );
};

const monthlyTrades = () => {
  const csv = new Csv();

  const allTaxesValues = getAllTaxesValues(TRADES);
  const allTaxesQuantities = getAllTaxesQuantities(TRADES);
  const allQuantities = getAllQuantities(TRADES);
  const allValues = getAllValues(TRADES);
  const totalSold = getTotalSold(TRADES);
  const buyTaxesValues = getBuyTaxesValues(TRADES);

  csv.generate(
    TRADES.map((trade, idx) => {
      return {
        Indice: idx,
        "Preço da moeda": trade.price,

        "Quantidade de cripto": trade.quantity,
        "Taxa em quantidade de cripto": allTaxesQuantities[idx],
        "Quantidade de cripto menos taxas":
          trade.quantity - allTaxesQuantities[idx],

        "Quantidade de cripto acumulada": accumulated(
          allQuantities,
          idx,
          roundSum
        ),
        "Taxa em quantidade acumulada": accumulated(
          allTaxesQuantities,
          idx,
          roundSum
        ),
        "Quantidade de cripto menos taxas acumulada": accumulated(
          allQuantities,
          idx,
          roundSum
        )
          ? accumulated(allQuantities, idx, roundSum) -
            accumulated(allTaxesQuantities, idx, roundSum)
          : 0,

        "Valor reais": trade.value,
        "Taxa em reais": allTaxesValues[idx],
        "Valor reais menos taxas": trade.value - allTaxesValues[idx],

        "Valor reais acumulado": accumulated(allValues, idx, moneySum),
        "Taxa em reais acumulada": accumulated(buyTaxesValues, idx, moneySum),
        "Valor reais menos taxas acumulado":
          accumulated(allValues, idx, moneySum) -
            accumulated(buyTaxesValues, idx, moneySum) >
          0
            ? accumulated(allValues, idx, moneySum) -
              accumulated(buyTaxesValues, idx, moneySum)
            : 0,

        "Preco medio": getMeanPrice(
          trade,
          idx,
          allValues,
          buyTaxesValues,
          allQuantities,
          allTaxesQuantities
        ),

        "Lucro de venda":
          trade.type === "sell"
            ? trade.value -
              allTaxesValues[idx] -
              trade.quantity *
                getMeanPrice(
                  trade,
                  idx - 1,
                  allValues,
                  buyTaxesValues,
                  allQuantities,
                  allTaxesQuantities
                )
            : "-",

        Imposto:
          trade.type === "sell"
            ? (trade.value -
                allTaxesValues[idx] -
                trade.quantity *
                  getMeanPrice(
                    trade,
                    idx - 1,
                    allValues,
                    buyTaxesValues,
                    allQuantities,
                    allTaxesQuantities
                  )) *
              0.15
            : "-",
        Tipo: trade.type === "buy" ? "Compra" : "Venda",
      };
    })
  );

  process.stdout.write("Valor alienado (vendido) foi de: ");
  coloredLog(totalSold);
  if (totalSold > 35000) {
    console.log(
      "Você DEVE declarar Darf do mês devido ao valor de venda ser maior que 35 mil"
    );
  } else {
    console.log(
      "Você NÃO deve declarar Darf do mês devido ao valor de venda ser menor que 35 mil"
    );
  }
};

module.exports = {
  monthlyTrades,
  getAllValues,
  getAllQuantities,
  getAllTaxesValues,
  getAllTaxesQuantities,
};
