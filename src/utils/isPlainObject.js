"use strict";

function isPlainObject(value) {
  return !!(value && Object.getPrototypeOf(value) === Object.prototype);
}

module.exports = isPlainObject;
