"use strict";

function checkSameRate(n, next) {
  return (type, rate, props) => {
    if (typeof rate === "function") {
      rate = rate(type, null, props);
    }
    if (props[n] && rate === props[n].rate) {
      /* istanbul ignore else */
      if (typeof next === "function") {
        return next(type, rate, props);
      }
    }
    throw new TypeError(`
      input[${ n }] is not ${ rate } rate.
    `.trim());
  };
}

module.exports = checkSameRate;
