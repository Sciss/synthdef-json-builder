"use strict";

const createNode = require("./createNode");
const createRef = require("./createRef");
const isSCNode = require("./isSCNode");
const isSCRef = require("./isSCRef");
const sortByRate = require("./sortByRate");
const unbind = require("./unbind");
const isNumber = require("./isNumber");
const toUnitInput = require("./toUnitInput");
const wrapAt = require("./wrapAt");

function declareOpFunc(type, fn, disableCreateNode) {
  function wrapper(...args) {
    if (args.length < fn.length) {
      throw new TypeError(`
        op[${ type }] required ${ fn.length } arguments, but got ${ args.length }.
      `.trim());
    }
    args = args.slice(0, fn.length);

    const length = args.reduce((length, item) => {
      return Array.isArray(item) ? Math.max(length, item.length) : length;
    }, 0);

    if (length !== 0) {
      return Array.from({ length }, (_, index) => {
        return wrapper(...args.map(item => wrapAt(item, index)));
      });
    }

    if (args.some(isSCRef)) {
      return createRef(() => wrapper(...args.map(toUnitInput)));
    }

    if (!disableCreateNode) {
      if (args.some(isSCNode)) {
        return createNode(type, sortByRate(args.slice())[0].rate, args);
      }

      if (!args.every(isNumber)) {
        throw new TypeError(`
          op[${ type }] required ${ fn.length } numbers, but got NaN.
        `.trim());
      }
    }

    return fn(...args);
  }

  return unbind(wrapper);
}

module.exports = declareOpFunc;
