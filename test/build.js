"use strict";

const assert = require("assert");
const build = require("../src/build");
const arg = require("../src/api/api/arg");
const mix = require("../src/api/api/mix");
const In = require("../src/api/units/In");
const Out = require("../src/api/units/Out");
const SinOsc = require("../src/api/units/SinOsc");
const Pan2 = require("../src/api/units/Pan2");
const WhiteNoise = require("../src/api/units/WhiteNoise");

describe("build([name], nodes)", () => {
  it("should create synthdef json", () => {
    const node = Out.ar(0, [ SinOsc.ar(440), SinOsc.ar(880, 0.5) ]);
    const sdef = build([ node ]);

    assert.deepEqual(sdef.name, null);
    assert.deepEqual(sdef.consts, [ 0, 440, 880, 0.5 ]);
    assert.deepEqual(sdef.paramValues, null);
    assert.deepEqual(sdef.paramIndices, null);
    assert.deepEqual(sdef.units, [
      [ "SinOsc", 2, 0, [ [ -1, 1 ], [ -1, 0 ]           ], [ 2 ] ],
      [ "SinOsc", 2, 0, [ [ -1, 2 ], [ -1, 3 ]           ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  0, 0 ], [ 1, 0 ] ], [   ] ],
    ]);
  });

  it("should create named synthdef json", () => {
    const node = Out.ar(0, [ SinOsc.ar(440), SinOsc.ar(880, 0.5) ]);
    const sdef = build("temp__0", [ node ]);

    assert.deepEqual(sdef.name, "temp__0");
    assert.deepEqual(sdef.consts, [ 0, 440, 880, 0.5 ]);
    assert.deepEqual(sdef.paramValues, null);
    assert.deepEqual(sdef.paramIndices, null);
    assert.deepEqual(sdef.units, [
      [ "SinOsc", 2, 0, [ [ -1, 1 ], [ -1, 0 ]           ], [ 2 ] ],
      [ "SinOsc", 2, 0, [ [ -1, 2 ], [ -1, 3 ]           ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  0, 0 ], [ 1, 0 ] ], [   ] ],
    ]);
  });

  it("should process the nodes in reverse", () => {
    const node0 = SinOsc.ar(440, In.kr(0, 1));
    const node1 = Out.ar(0, node0);
    const node2 = Out.kr(0, node0);
    const sdef = build([ node1, node2 ]);

    assert.deepEqual(sdef.name, null);
    assert.deepEqual(sdef.consts, [ 0, 440 ]);
    assert.deepEqual(sdef.paramValues, null);
    assert.deepEqual(sdef.paramIndices, null);
    assert.deepEqual(sdef.units, [
      [ "In"    , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "SinOsc", 2, 0, [ [ -1, 1 ], [ 0, 0 ] ], [ 2 ] ],
      [ "Out"   , 1, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ],
    ]);
  });

  it("should optimize the same input nodes to one", () => {
    const node = Out.ar(0, [ SinOsc.ar(880, 0.5), SinOsc.ar(880, 0.5) ]);
    const sdef = build([ node ]);

    assert.deepEqual(sdef.consts, [ 0, 880, 0.5 ]);
    assert.deepEqual(sdef.units, [
      [ "SinOsc", 2, 0, [ [ -1, 1 ], [ -1, 2 ]           ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  0, 0 ], [ 0, 0 ] ], [   ] ],
    ]);
  });

  it("should not optimize when use noise nodes", () => {
    const node = Out.ar(0, [ WhiteNoise.ar(), WhiteNoise.ar() ]);
    const sdef = build([ node ]);

    assert.deepEqual(sdef.consts, [ 0 ]);
    assert.deepEqual(sdef.units, [
      [ "WhiteNoise", 2, 0, [                                ], [ 2 ] ],
      [ "WhiteNoise", 2, 0, [                                ], [ 2 ] ],
      [ "Out"       , 2, 0, [ [ -1, 0 ], [  0, 0 ], [ 1, 0 ] ], [   ] ],
    ]);
  });

  it("should handle the output-proxy as the multi-out node", () => {
    const node = Out.ar(0, Pan2.ar(SinOsc.ar(440), SinOsc.kr(1)));
    const sdef = build([ node ]);

    assert.deepEqual(sdef.consts, [ 0, 440, 1 ]);
    assert.deepEqual(sdef.units, [
      [ "SinOsc", 2, 0, [ [ -1, 1 ], [ -1, 0 ]            ], [ 2    ] ],
      [ "SinOsc", 1, 0, [ [ -1, 2 ], [ -1, 0 ]            ], [ 1    ] ],
      [ "Pan2"  , 2, 0, [ [  0, 0 ], [  1, 0 ], [ -1, 2 ] ], [ 2, 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  2, 0 ], [  2, 1 ] ], [      ] ],
    ]);
  });

  it("should optimize the same output-proxy to one", () => {
    const node = Out.ar(0, mix([
      Pan2.ar(SinOsc.ar(440), SinOsc.kr(1)),
      Pan2.ar(SinOsc.ar(440), SinOsc.kr(1)),
    ]));
    const sdef = build([ node ]);

    assert.deepEqual(sdef.consts, [ 0, 440, 1 ]);
    assert.deepEqual(sdef.units, [
      [ "SinOsc"      , 2, 0, [ [ -1, 1 ], [ -1, 0 ]            ], [ 2    ] ],
      [ "SinOsc"      , 1, 0, [ [ -1, 2 ], [ -1, 0 ]            ], [ 1    ] ],
      [ "Pan2"        , 2, 0, [ [  0, 0 ], [  1, 0 ], [ -1, 2 ] ], [ 2, 2 ] ],
      [ "BinaryOpUGen", 2, 0, [ [  2, 0 ], [  2, 0 ]            ], [ 2    ] ],
      [ "BinaryOpUGen", 2, 0, [ [  2, 1 ], [  2, 1 ]            ], [ 2    ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [  3, 0 ], [  4, 0 ] ], [      ] ]
    ]);
  });

  it("should create synthdef json with parameters", () => {
    const iout  = arg.ir("out"  ,   0);
    const freq  = arg.kr("freq" , 440);
    const phase = arg.kr("phase",   0);
    const node = Out.ar(iout, SinOsc.ar(freq, phase));
    const sdef = build([ node ]);

    assert.deepEqual(sdef.consts, []);
    assert.deepEqual(sdef.paramValues, [ 0, 440, 0 ]);
    assert.deepEqual(sdef.paramIndices, [
      { name: "out"  , index: 0, length: 1 },
      { name: "freq" , index: 1, length: 1 },
      { name: "phase", index: 2, length: 1 },
    ]);
    assert.deepEqual(sdef.units, [
      [ "Control", 0, 0, [                    ], [ 0    ] ],
      [ "Control", 1, 1, [                    ], [ 1, 1 ] ],
      [ "SinOsc" , 2, 0, [ [ 1, 0 ], [ 1, 1 ] ], [ 2    ] ],
      [ "Out"    , 2, 0, [ [ 0, 0 ], [ 2, 0 ] ], [      ] ],
    ]);
  });

  it("should create synthdef json with parameters", () => {
    const freq1 = arg.ar("freq1", 440);
    const freq2 = arg.ar("freq2", 442);
    const phase = arg.kr("phase",   0);
    const node = Out.ar(0, [
      SinOsc.ar(freq1, phase),
      SinOsc.ar(freq2, phase),
    ]);
    const sdef = build([ node ]);

    assert.deepEqual(sdef.consts, [ 0 ]);
    assert.deepEqual(sdef.paramValues, [ 440, 442, 0 ]);
    assert.deepEqual(sdef.paramIndices, [
      { name: "freq1", index: 0, length: 1 },
      { name: "freq2", index: 1, length: 1 },
      { name: "phase", index: 2, length: 1 },
    ]);
    assert.deepEqual(sdef.units, [
      [ "AudioControl", 2, 0, [                               ], [ 2, 2 ] ],
      [ "Control"     , 1, 2, [                               ], [ 1    ] ],
      [ "SinOsc"      , 2, 0, [ [  0, 0 ], [ 1, 0 ]           ], [ 2    ] ],
      [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ 1, 0 ]           ], [ 2    ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [      ] ],
    ]);
  });

  it("should throw TypeError when given conflicted parameters [rate]", () => {
    const freq1 = arg.ar("freq", 440);
    const freq2 = arg.kr("freq", 440);
    const node = Out.ar(0, mix([ SinOsc.ar(freq1), SinOsc.ar(freq2) ]));

    assert.throws(() => {
      build([ node ]);
    }, TypeError);
  });

  it("should throw TypeError when given conflicted parameters [value]", () => {
    const freq1 = arg.ar("freq", 440);
    const freq2 = arg.ar("freq", 442);
    const node = Out.ar(0, mix([ SinOsc.ar(freq1), SinOsc.ar(freq2) ]));

    assert.throws(() => {
      build([ node ]);
    }, TypeError);
  });

  it("should throw TypeError when given conflicted parameters [length]", () => {
    const freq1 = arg.ar("freq", 440);
    const freq2 = arg.ar("freq", [ 440, 442 ]);
    const node = Out.ar(0, mix([ SinOsc.ar(freq1), SinOsc.ar(freq2) ]));

    assert.throws(() => {
      build([ node ]);
    }, TypeError);
  });

  it("should NOT throw TypeError when given same identifier", () => {
    const freq1 = arg.kr("freq", 440);
    const freq2 = arg.kr("freq", 440);
    const node = Out.ar(0, mix([ SinOsc.ar(freq1), SinOsc.ar(freq2) ]));
    const sdef = build([ node ]);

    assert.deepEqual(sdef.consts, [ 0 ]);
    assert.deepEqual(sdef.paramValues, [ 440 ]);
    assert.deepEqual(sdef.paramIndices, [
      { name: "freq", index: 0, length: 1 },
    ]);
    assert.deepEqual(sdef.units, [
      [ "Control"     , 1, 0, [                      ], [ 1 ] ],
      [ "SinOsc"      , 2, 0, [ [  0, 0 ], [ -1, 0 ] ], [ 2 ] ],
      [ "BinaryOpUGen", 2, 0, [ [  1, 0 ], [  1, 0 ] ], [ 2 ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [  2, 0 ] ], [   ] ],
    ]);
  });

  it("should throw TypeError when given nothing", () => {
    assert.throws(() => {
      build();
    }, TypeError);
  });

  it("should throw TypeError when given invalid nodes", () => {
    const node = Out.ar(0, [ SinOsc.ar(440), SinOsc.ar(880, 0.5) ]);

    assert.throws(() => {
      build("temp__0", node);
    }, TypeError);
  });
});
