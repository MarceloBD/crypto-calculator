const { accumulated, moneySum, roundSum } = require("./utils");

module.exports = class Trades {
  constructor(trades) {
    this.trades = trades;
    this.allTaxesValues = this.getAllTaxesValues(trades);
    this.allTaxesQuantities = this.getAllTaxesQuantities(trades);
    this.allQuantities = this.getAllQuantities(trades);
    this.totalSold = this.getTotalSold(trades);
    this.buyTaxesValues = this.getBuyTaxesValues(trades);
    this.getAllMeanPrices(trades);
  }

  buildTrades() {
    this.tradesObj = this.trades.map((trade, idx) => ({
      ...trade,
      idx,
      quantity: this.allQuantities[idx],
      taxQuantity: this.allTaxesQuantities[idx],
      quantityWithoutTaxes:
        this.allQuantities[idx] -
        (this.allTaxesQuantities[idx] !== "-"
          ? this.allTaxesQuantities[idx]
          : 0),
      quantityAccumulated: accumulated(this.allQuantities, idx, roundSum),
      taxQuantityAccumulated: accumulated(
        this.allTaxesQuantities,
        idx,
        roundSum
      ),
      quantityWithoutTaxesAccumulated: roundSum(
        accumulated(this.allQuantities, idx, roundSum) &&
          accumulated(this.allValues, idx, moneySum)
          ? accumulated(this.allQuantities, idx, roundSum) -
              accumulated(this.allTaxesQuantities, idx, roundSum)
          : 0
      ),
      taxValue: moneySum(this.allTaxesValues[idx]),
      valueWithoutTaxes: trade.value - moneySum(this.allTaxesValues[idx]),
      valueAccumulated: accumulated(this.allValues, idx, moneySum),
      taxValueAccumulated: accumulated(this.buyTaxesValues, idx, moneySum),
      valueWithoutTaxesAccumulated:
        accumulated(this.allValues, idx, moneySum) -
          accumulated(this.buyTaxesValues, idx, moneySum) >
        0
          ? moneySum(
              accumulated(this.allValues, idx, moneySum) -
                accumulated(this.buyTaxesValues, idx, moneySum)
            )
          : 0,
      meanPrice: this.allMeanPrices[idx],
      buyValue:  moneySum(trade.quantity * this.allMeanPrices[idx - 1]), 
      sellGain: trade.type === "sell" ? this.getSellGain(trade, idx) : "-",
      governmentTax:
        trade.type === "sell" ? this.getGovernmentTax(trade, idx) : "-",
    }));
  }

  getSellGain(trade, idx) {
    return moneySum(
      trade.value -
        this.allTaxesValues[idx] -
        trade.quantity * this.allMeanPrices[idx - 1]
    );
  }

  getGovernmentTax(trade, idx) {
    return this.getSellGain(trade, idx) > 0
      ? moneySum(this.getSellGain(trade, idx) * 0.15)
      : 0;
  }

  getAllValues() {
    return this.trades.map((trade) => {
      return trade.type === "buy" ? trade.value : -trade.value;
    });
  }

  getAllQuantities() {
    return this.trades.map((trade) => {
      return trade.type === "buy" ? trade.quantity : -trade.quantity;
    });
  }

  getAllTaxesValues() {
    return this.trades.map((trade) => {
      return trade.type === "buy"
        ? moneySum(trade.price * trade.tax)
        : moneySum(trade.tax);
    });
  }

  getAllTaxesQuantities() {
    return this.trades.map((trade) => {
      return trade.type === "buy" ? trade.tax : "-";
    });
  }

  getAllMeanPrices(trades) {
    const buyTaxesQuantities = this.allTaxesQuantities.map((tax, idx) =>
      this.trades[idx].type === "buy" ? tax : 0
    );
    this.allValues = [];
    this.allMeanPrices = [];

    trades.forEach((trade, idx) => {
      this.allValues.push(
        trade.type === "buy"
          ? trade.value
          : moneySum(-trade.quantity * this.allMeanPrices[idx - 1])
      );
      this.allMeanPrices.push(
        moneySum(
          accumulated(this.allValues, idx) /
            (accumulated(this.allQuantities, idx, roundSum) -
              accumulated(buyTaxesQuantities, idx, roundSum))
        )
      );
    });
  }

  getTotalSold() {
    return this.trades.reduce(
      (acc, cur) => (cur.type === "sell" ? acc + cur.value : acc),
      0
    );
  }

  getBuyTaxesValues() {
    return this.getAllTaxesValues(this.trades).map((tax, idx) =>
      this.trades[idx].type === "buy" ? tax : 0
    );
  }
};
