"use strict";

const createNode = require("../../utils/createNode");
const createOutputNode = require("../../utils/createOutputNode");
const multiMap = require("../../utils/multiMap");

function $(rate) {
  return (bus, channels = []) => {
    return createOutputNode(flatten(multiMap([ bus ].concat(channels), (bus, ...channels) => {
      if (rate === null) {
        rate = detectRate(channels);
      }
      if (channels.length === 0) {
        throw new TypeError(`
          Out[${ rate }] require least one input.
        `.trim());
      }
      if (rate === "audio" && !channels.every(isAudioRate)) {
        throw new TypeError(`
          Out[${ rate }] cannot accept audio rate input only.
        `.trim());
      }
      return createNode("Out", rate, [ bus ].concat(channels));
    })));
  };
}

function flatten(list) {
  return Array.isArray(list) ? list.reduce(_flatten, []) : [ list ];
}

function _flatten(list, item) {
  return list.concat(flatten(item));
}

function detectRate(channels) {
  return channels.every(isAudioRate) ? "audio" : "control";
}

function isAudioRate(node) {
  return node.rate === "audio";
}

const Out = $(null);

Out.ar = $("audio");
Out.kr = $("control");

module.exports = Out;
