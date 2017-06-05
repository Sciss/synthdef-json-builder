"use strict";

function getSameRate(n, allowed) {
  return (type, rate, props) => {
    if (props[n] && allowed.includes(props[n].rate)) {
      return props[n].rate;
    }
    throw new TypeError(`
      invalid input
    `.trim());
  };
}

module.exports = getSameRate;
