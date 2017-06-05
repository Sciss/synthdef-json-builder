"use strict";

const assert = require("assert");
const env = require("../../../src/api/api/env");
const isSCRef = require("../../../src/utils/isSCRef");
const toUnitInput = require("../../../src/utils/toUnitInput");

describe("api/env", () => {
  it(".triangle should create a triangle envelope", () => {
    const node = env.triangle(1, 0.5);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0, 2, -99, -99, 0.5, 0.5, 1, 0, 0, 0.5, 1, 0
    ]);
  });

  it(".sine should create a sine envelope", () => {
    const node = env.sine(1, 0.5);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0, 2, -99, -99, 0.5, 0.5, 3, 0, 0, 0.5, 3, 0
    ]);
  });

  it(".perc should create a percussive envelope", () => {
    const node = env.perc(1, 2, 0.5);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0, 2, -99, -99, 0.5, 1, 5, -4, 0, 2, 5, -4
    ]);
  });

  it(".linen should create a trapezoid envelope", () => {
    const node = env.linen(1, 2, 3, 0.5);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0, 3, -99, -99, 0.5, 1, 1, 0, 0.5, 2, 1, 0, 0, 3, 1, 0
    ]);
  });

  it(".cutoff should create a cutoff envelope", () => {
    const node = env.cutoff(1, 0.5);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0.5, 1, 0, -99, 0, 1, 1, 0
    ]);
  });

  it(".dadsr should create a delay attack decay sustain release envelope", () => {
    const node = env.dadsr(1, 2, 3, 0.5, 4, 0.8);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0, 4, 3, -99, 0, 1, 5, -4, 0.8, 2, 5, -4, 0.4, 3, 5, -4, 0, 4, 5, -4
    ]);
  });

  it(".adsr should create a attack decay sustain release envelope", () => {
    const node = env.adsr(1, 2, 0.5, 3, 0.8);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0, 3, 2, -99, 0.8, 1, 5, -4, 0.4, 2, 5, -4, 0, 3, 5, -4
    ]);
  });

  it(".asr should create a attack sustain release envelope", () => {
    const node = env.asr(1, 0.5, 2, 0.8);

    assert(isSCRef(node));
    assert.deepEqual(toUnitInput(node), [
      0, 2, 1, -99, 0.4, 1, 5, -4, 0, 2, 5, -4
    ]);
  });
});
