const { round, money, accumulated, moneySum, roundSum } = require("./utils");

module.exports = class Trades {
  constructor(trades) {
    this.trades = trades;
    this.allTaxesValues = this.getAllTaxesValues(trades);
    this.allTaxesQuantities = this.getAllTaxesQuantities(trades);
    this.allQuantities = this.getAllQuantities(trades);
    this.allValues = this.getAllValues(trades);
    this.totalSold = this.getTotalSold(trades);
    this.buyTaxesValues = this.getBuyTaxesValues(trades);
  }

  buildTrades() {
    this.tradesObj = this.trades.map((trade, idx) => ({
      ...trade,
      idx,
      quantity: this.allQuantities[idx],
      value: this.allValues[idx],
      taxQuantity: this.allTaxesQuantities[idx],
      quantityWithoutTaxes:
        trade.quantity -
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
        accumulated(this.allQuantities, idx, roundSum) && accumulated(this.allValues, idx, moneySum)
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
      meanPrice: this.getMeanPrice(trade, idx),
      sellGain:
        trade.type === "sell"
          ? trade.value -
            this.allTaxesValues[idx] -
            trade.quantity * this.getMeanPrice(trade, idx - 1)
          : "-",
      governmentTax:
        trade.type === "sell"
          ? (trade.value -
              this.allTaxesValues[idx] -
              trade.quantity * this.getMeanPrice(trade, idx - 1)) *
            0.15
          : "-",
    }));
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

  getMeanPrice(trade, idx) {
    const buyTaxesQuantities = this.allTaxesQuantities.map((tax, idx) =>
      this.trades[idx].type === "buy" ? tax : 0
    );

    let index = idx;

    if (trade.type === "sell") {
      const oldBuys = this.trades.filter(
        (t, index) => idx > index && t.type === "buy"
      );

      index = this.trades.indexOf(oldBuys[oldBuys.length - 1]);
    }

    return money(
      (accumulated(this.allValues, index, moneySum) -
        accumulated(this.buyTaxesValues, index, moneySum)) /
        (accumulated(this.allQuantities, index, roundSum) -
          accumulated(buyTaxesQuantities, index, roundSum))
    );
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
