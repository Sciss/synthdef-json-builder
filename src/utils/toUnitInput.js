"use strict";

function toUnitInput(value) {
  if (value) {
    if (typeof value.toUnitInput === "function") {
      return value.toUnitInput();
    }
    if (typeof value.valueOf === "function") {
      return value.valueOf();
    }
  }
  return value;
}

module.exports = toUnitInput;
