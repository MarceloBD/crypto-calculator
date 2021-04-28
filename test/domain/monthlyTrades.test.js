const { describe, it } = require("mocha");
const chai = require("chai");
const Trades = require("../../domain/trades");

describe("MonthlyTrades", function () {
  describe("getAllValues", function () {
    it("should an array with positive and negative trade values, according to type", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [1105.07, 969.99, 924.92, -3501.34];

      const result = new Trades(trades).getAllValues();
      chai.expect(result).to.be.deep.equal(expected);
    });
  });
  describe("getAllQuantities", function () {
    it("should an array with positive and negative trade quantities of currency, according to type", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0.011185, 0.00981781, 0.00936156, -0.03028845];

      const result = new Trades(trades).getAllQuantities();
      chai.expect(result).to.be.deep.equal(expected);
    });
  });

  describe("getAllTaxesValues", function () {
    it("should an array with trade taxes, according to type", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [2.76, 2.42, 2.31, 8.75];

      const result = new Trades(trades).getAllTaxesValues();
      chai.expect(result).to.be.deep.equal(expected);
    });
  });

  describe("getAllTaxesQuantities", function () {
    it("should an array with trade tax quantities, according to type", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0.00002796, 0.00002454, 0.0000234, "-"];

      const result = new Trades(trades).getAllTaxesQuantities();
      chai.expect(result).to.be.deep.equal(expected);
    });
  });

  describe("tradesObj", function () {
    it("should have an index", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0, 1, 2, 3];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map((trade) => trade.idx);

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have tax quantity according to sell or buy", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0.00002796, 0.00002454, 0.0000234, "-"];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map((trade) => trade.taxQuantity);

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have quantity without taxes", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0.01115704, 0.00979327, 0.00933816, -0.03028845];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.quantityWithoutTaxes
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have quantity accumulated", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0.011185, 0.02100281, 0.03036437, 0.00007592];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.quantityAccumulated
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have quantity accumulated", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0.00002796, 0.0000525, 0.0000759, 0.0000759];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.taxQuantityAccumulated
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have quantity without taxes accumulated", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [0.01115704, 0.02095031, 0.03028847, 0];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.quantityWithoutTaxesAccumulated
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have tax value", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [2.76, 2.42, 2.31, 8.75];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map((trade) => trade.taxValue);

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have value without taxes", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [1102.31, 967.57, 922.61, 3492.59];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.valueWithoutTaxes
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have value accumulated", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [1105.07, 2075.06, 2999.98, 0];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.valueAccumulated
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have tax value accumulated", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [2.76, 5.18, 7.49, 7.49];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.taxValueAccumulated
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have value without tax accumulated", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];
      const expected = [1102.31, 2069.88, 2992.49, 0];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map(
        (trade) => trade.valueWithoutTaxesAccumulated
      );

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have mean price", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];

      const expected = [99046.88, 99046.74, 99046.93, 0];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map((trade) => trade.meanPrice);

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have sell gain", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];

      const expected = ["-", "-", "-", 492.61];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map((trade) => trade.sellGain);

      chai.expect(result).to.be.deep.equal(expected);
    });

    it("should have government tax", function () {
      const trades = [
        {
          type: "buy",
          value: 1105.07,
          quantity: 0.011185,
          price: 98800.0,
          tax: 0.00002796,
        },
        {
          type: "buy",
          value: 969.99,
          quantity: 0.00981781,
          price: 98800.0,
          tax: 0.00002454,
        },
        {
          type: "buy",
          value: 924.92,
          quantity: 0.00936156,
          price: 98800.0,
          tax: 0.0000234,
        },
        {
          type: "sell",
          value: 3501.34,
          quantity: 0.03028845,
          price: 115600.0,
          tax: 8.75,
        },
      ];

      const expected = ["-", "-", "-", 73.89];

      const tradesInstance = new Trades(trades);
      tradesInstance.buildTrades();
      const result = tradesInstance.tradesObj.map((trade) => trade.governmentTax);

      chai.expect(result).to.be.deep.equal(expected);
    });
  });
});
