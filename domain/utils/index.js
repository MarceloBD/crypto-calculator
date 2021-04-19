const round = (value) => Math.round(value * 10 ** 8) / 10 ** 8;

const roundSum = (value) => Math.round(value * 10 ** 8) / 10 ** 8;

const money = (value) => Math.round(value * 10 ** 2) / 10 ** 2;

const moneySum = (value) => Math.round(value * 10 ** 2) / 10 ** 2;

const coloredLog = (value) => console.log("\x1b[36m", value, "\x1b[0m");

const accumulated = (values, index, round = (value) => value) =>
  values.filter((_, idx) => idx <= index).reduce((acc, cur) => round(acc + cur) > 0 ? round(acc + cur) : 0 , 0);

module.exports = {
  round,
  money,
  coloredLog,
  accumulated,
  roundSum,
  moneySum
};
