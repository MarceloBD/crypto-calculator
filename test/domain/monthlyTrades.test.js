const { describe, it } = require("mocha");
const chai = require("chai");
const {
  getAllValues,
  getAllQuantities,
  getAllTaxesValues,
  getAllTaxesQuantities
} = require("../../domain/monthlyTrades");

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

      const result = getAllValues(trades);
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

      const result = getAllQuantities(trades);
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
      const expected = [2.762448, 2.424552, 2.31192, 8.75];

      const result = getAllTaxesValues(trades);
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
      const expected = [0.00002796, 0.00002454, 0.0000234, 0];

      const result = getAllTaxesQuantities(trades);
      chai.expect(result).to.be.deep.equal(expected);
    });
  });
});
