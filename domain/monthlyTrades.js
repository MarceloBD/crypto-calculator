const getTrades = require("../data/trades");
const TRADES = getTrades.TRADES();
const Csv = require("../data/csv");
const { round, money, accumulated, moneySum, roundSum } = require("./utils");

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

const getAllTaxesQuantity = (trades) => {
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
  allTaxesQuantity
) => {
  const buyTaxesQuantities = allTaxesQuantity.map((tax, idx) =>
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

const monthlyTrades = () => {
  const csv = new Csv();

  const allTaxesValues = getAllTaxesValues(TRADES);
  const allTaxesQuantity = getAllTaxesQuantity(TRADES);
  const allQuantities = getAllQuantities(TRADES);
  const allValues = getAllValues(TRADES);

  let totalSelling = 0;

  const buyTaxesValues = allTaxesValues.map((tax, idx) =>
    TRADES[idx].type === "buy" ? tax : 0
  );

  csv.generate(
    TRADES.map((trade, idx) => {
      if (trade.type === "sell") {
        totalSelling += trade.value;
      }
      return {
        Indice: idx,
        "Preço da moeda": trade.price,

        "Quantidade de cripto": trade.quantity,
        "Taxa em quantidade de cripto": allTaxesQuantity[idx],
        "Quantidade de cripto menos taxas":
          trade.quantity - allTaxesQuantity[idx],

        "Quantidade de cripto acumulada": accumulated(
          allQuantities,
          idx,
          roundSum
        ),
        "Taxa em quantidade acumulada": accumulated(
          allTaxesQuantity,
          idx,
          roundSum
        ),
        "Quantidade de cripto menos taxas acumulada": accumulated(
          allQuantities,
          idx,
          roundSum
        )
          ? accumulated(allQuantities, idx, roundSum) -
            accumulated(allTaxesQuantity, idx, roundSum)
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
          allTaxesQuantity
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
                  allTaxesQuantity
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
                    allTaxesQuantity
                  )) *
              0.15
            : "-",
        Tipo: trade.type === "buy" ? "Compra" : "Venda",
      };
    })
  );

  console.log(totalSelling);
};

module.exports = { monthlyTrades, getAllValues, getAllQuantities };
