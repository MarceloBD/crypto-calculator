const fs = require("fs");
const { createCanvas } = require("canvas");
const jsdom = require("jsdom");
const { Chart } = require("chart.js");
const { JSDOM } = jsdom;

const meanPrice = (trades) => {
  const outputLocation = "./meanPrice.svg";

  const canvas = createCanvas(400, 400, "svg");
  const labels = trades.map((trade) => trade.idx);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Preço médio",
        data: trades.map((trade) => trade.meanPrice),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
  };

  new Chart(canvas, config);

  fs.writeFileSync(outputLocation, canvas.toBuffer());
};

const sells = (trades) => {
  const outputLocation = "./valueAccumulated.svg";
  console.log(trades.map((t) => t.value));
  const canvas = createCanvas(400, 400, "svg");
  const labels = trades.map((trade) => trade.idx);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Venda",
        data: trades.map((trade) => (trade.value < 0 ? -trade.value : 0)),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Lucro na venda",
        data: trades.map((trade) =>
          trade.sellGain !== "-" ? trade.sellGain : 0
        ),
        fill: false,
        borderColor: "rgb(240,128,128)",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
  };

  new Chart(canvas, config);

  fs.writeFileSync(outputLocation, canvas.toBuffer());
};

const chart = (trades) => {
  const fakeDom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  global.window = fakeDom.window;

  meanPrice(trades);
  sells(trades);
};

module.exports = chart;
