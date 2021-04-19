const TRADES = require("../data/trades");
const Csv = require("../data/csv");
const { round, money, accumulated, moneySum, roundSum } = require("./utils");

const monthlyTrades = () => {
  const csv = new Csv();
  const allTaxesValues = [];
  const allTaxesQuantity = [];
  const allValues = [];
  const allQuantities = [];

  TRADES.reduce((acc, cur) => {
    if (cur.type === "buy") {
      allValues.push(cur.value);
      return round(acc + cur.value);
    }
    allValues.push(-cur.value);
    return round(acc - cur.value);
  }, 0);

  TRADES.reduce((acc, cur) => {
    if (cur.type === "buy") {
      allQuantities.push(cur.quantity);
      return round(acc + cur.quantity);
    }
    allQuantities.push(-cur.quantity);
    return round(acc - cur.quantity);
  }, 0);

  TRADES.reduce((acc, cur) => {
    if (cur.type === "buy") {
      allTaxesValues.push(round(cur.price * cur.tax));
      return round(acc + cur.price * cur.tax);
    }
    allTaxesValues.push(round(cur.tax));
    return round(acc + cur.tax);
  }, 0);

  TRADES.reduce((acc, cur) => {
    if (cur.type === "buy") {
      allTaxesQuantity.push(round(cur.tax));
      return round(acc + cur.tax);
    }
    allTaxesQuantity.push(0);
    return round(acc);
  }, 0);

  let totalSelling = 0;

  const buyTaxesValues = allTaxesValues.map((tax, idx) =>
    TRADES[idx].type === "buy" ? tax : 0
  );

  const buyTaxesQuantities = allTaxesQuantity.map((tax, idx) =>
    TRADES[idx].type === "buy" ? tax : 0
  );

  const getMeanPrice = (trade, idx) => {
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

  console.log(0.03036437 - 0.03028845);
  console.log(accumulated([0.03036437 - 0.03028845], 0, roundSum));

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

        "Preco medio": getMeanPrice(trade, idx),

        "Lucro de venda":
          trade.type === "sell"
            ? trade.value -
              allTaxesValues[idx] -
              trade.quantity * getMeanPrice(trade, idx - 1)
            : "-",

        Imposto:
          trade.type === "sell"
            ? (trade.value -
                allTaxesValues[idx] -
                trade.quantity * getMeanPrice(trade, idx - 1)) *
              0.15
            : "-",
        Tipo: trade.type === "buy" ? "Compra" : "Venda",
      };
    })
  );

  console.log(totalSelling);
};

module.exports = monthlyTrades;
