"use strict";

function unbind(fn) {
  return function(...args) {
    if (typeof this !== "undefined" && this !== global) {
      return fn(...[ this ].concat(args));
    }
    return fn(...args);
  };
}

module.exports = unbind;
