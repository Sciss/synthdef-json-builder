"use strict";

const getSpecialIndex = require("./utils/getSpecialIndex");

function build(name, nodes) {
  if (nodes == null && Array.isArray(name)) {
    nodes = name;
    name  = null;
  }

  if (!Array.isArray(nodes)) {
    throw new TypeError(`
      nodes should be array, but got else.
    `.trim());
  }

  const walker = createWalker();

  nodes.slice().reverse().forEach((node) => {
    walk(walker, node);
  });

  const { paramValues, paramIndices } = buildParams(walker);

  const sdef = {};

  sdef.name = name;
  sdef.consts = walker.consts;

  if (paramValues.length !== 0) {
    sdef.paramValues = paramValues;
    sdef.paramIndices = paramIndices;
  }

  sdef.units = walker.units;

  return sdef;
}

function createWalker() {
  return {
    consts: [],
    units: [],
    controls: {
      ir: { type: "Control"     , unit: null, index: -1, values: [], indices: {} },
      kr: { type: "Control"     , unit: null, index: -1, values: [], indices: {} },
      ar: { type: "AudioControl", unit: null, index: -1, values: [], indices: {} },
      tr: { type: "TrigControl" , unit: null, index: -1, values: [], indices: {} },
    },
    nodeToKeyMap: new Map(),
    keyToNodeMap: new Map(),
    nodeToInputMap: new Map(),
    nameToCtrlMap: new Map(),
  };
}

function buildParams(walker) {
  const paramValues = [];
  const paramIndicesMap = {};

  Object.keys(walker.controls).map((selector) => {
    return walker.controls[selector];
  }).filter((control) => {
    return control.index !== -1;
  }).sort((ctrl1, ctrl2) => {
    return ctrl1.index - ctrl2.index;
  }).forEach((control) => {
    const offset = paramValues.length;
    const length = control.values.length;

    paramValues.push(...control.values);

    Object.keys(control.indices).forEach((key) => {
      paramIndicesMap[key] = {
        index : control.indices[key].index + offset,
        length: control.indices[key].length,
      };
    });

    control.unit[2] = offset;
    control.unit[4] = Array.from({ length }, () => control.unit[1]);
  });

  const paramIndices = Object.keys(paramIndicesMap).map((name) => {
    return { name, index: paramIndicesMap[name].index, length: paramIndicesMap[name].length };
  }).sort((a, b) => {
    return a.index - b.index;
  });

  return { paramValues, paramIndices };
}

function walk(walker, node) {
  // skip if node is already checked
  if (walker.nodeToInputMap.has(node)) {
    return;
  }

  if (typeof node === "number") {
    return walkNumber(walker, node);
  }

  if (node.type[0] === "#" || node.type[0] === "!") {
    return walkControl(walker, node);
  }

  if (node.type === "OutputProxy") {
    return walkOutputProxy(walker, node);
  }

  if (node.type === 0) {
    return walkOutput(walker, node);
  }

  return walkBasicNode(walker, node);
}

function walkNumber(walker, node) {
  const { nodeToKeyMap, keyToNodeMap } = walker;
  const key = createKeyFromNode(walker, node);

  nodeToKeyMap.set(node, key);
  keyToNodeMap.set(key, node);

  procNumber(walker, node);
}

function walkControl(walker, node) {
  const { nodeToKeyMap, keyToNodeMap } = walker;
  const key = createKeyFromNode(walker, node);

  nodeToKeyMap.set(node, key);

  if (keyToNodeMap.has(key)) {
    procExistNode(walker, node, key);
  } else {
    keyToNodeMap.set(key,node);
    procControl(walker, node);
  }
}

function walkOutputProxy(walker, node) {
  const { nodeToKeyMap, keyToNodeMap } = walker;
  const [ source, , length ] = node.props;

  if (!nodeToKeyMap.has(source)) {
    walkBasicNode(walker, source, length);
  }

  const key = createKeyFromNode(walker, node);

  nodeToKeyMap.set(node, key);

  if (keyToNodeMap.has(key)) {
    procExistNode(walker, node, key);
  } else {
    keyToNodeMap.set(key, node);
    procOutputProxy(walker, node);
  }
}

function walkOutput(walker, node) {
  node.props.forEach((node) => {
    walkBasicNode(walker, node, 0);
  });
}

function walkBasicNode(walker, node, length = 1) {
  const { nodeToKeyMap, keyToNodeMap } = walker;

  node.props.forEach((node) => {
    walk(walker, node);
  });

  const key = createKeyFromNode(walker, node);

  nodeToKeyMap.set(node, key);

  if (keyToNodeMap.has(key)) {
    procExistNode(walker, node, key);
  } else {
    keyToNodeMap.set(key, node);
    procBasicNode(walker, node, length);
  }
}

function procExistNode(walker, node, key) {
  const { keyToNodeMap, nodeToInputMap } = walker;
  const node0 = keyToNodeMap.get(key);
  const input = nodeToInputMap.get(node0);

  nodeToInputMap.set(node, input);
}

function procNumber(walker, node) {
  const { consts, nodeToInputMap } = walker;
  const input = [ -1, consts.length ];

  nodeToInputMap.set(node, input);
  consts.push(node);
}

function procControl(walker, node) {
  const { units, controls, nodeToInputMap, nameToCtrlMap } = walker;
  const selector = node.type[0] === "#" ? _s(node) : "tr";
  const controlName = node.type.slice(1);
  const [ value, ctrlIndex, length ] = node.props;
  const control = controls[selector];
  const { values, indices } = control;

  if (nameToCtrlMap.has(controlName)) {
    const registered = nameToCtrlMap.get(controlName);

    if (selector !== registered.selector) {
      throw new TypeError(`
        Invalid control '${ controlName }' rate: ${ selector }? ${ registered.selector }?
      `.trim());
    }
    if (length !== registered.length) {
      throw new TypeError(`
        Invalid control '${ controlName }' length: ${ length }? ${ registered.length }?
      `.trim());
    }
  } else {
    nameToCtrlMap.set(controlName, { selector, length });
    indices[controlName] = { index: values.length, length };

    if (control.unit === null) {
      control.unit = [ control.type, _r(node), 0, [], [] ];
      control.index = units.length;
      units.push(control.unit);
    }
  }

  const offset = indices[controlName].index;
  const valueIndex = ctrlIndex + offset;

  if (typeof values[valueIndex] === "number") {
    throw new TypeError(`
      Invalid control '${ controlName }' value: ${ value }? ${ values[valueIndex] }?
    `.trim());
  }

  values.length = Math.max(values.length, length);
  values[valueIndex] = value;

  const input = [ control.index, valueIndex ];

  nodeToInputMap.set(node, input);
}

function procOutputProxy(walker, node) {
  const { nodeToInputMap } = walker;
  const [ source, index ] = node.props;
  const input = [ nodeToInputMap.get(source)[0], index ];

  nodeToInputMap.set(node, input);
}

function procBasicNode(walker, node, length) {
  const { units, nodeToInputMap } = walker;
  const { type, specialIndex } = getSpecialIndex(node.type);
  const rate = _r(node);
  const input = [ units.length, 0 ];

  nodeToInputMap.set(node, input);

  units.push([
    deuniq(type), rate, specialIndex,
    node.props.map(node => nodeToInputMap.get(node)),
    Array.from({ length }, () => rate),
  ]);
}

function createKeyFromNode(walker, node) {
  if (typeof node === "number") {
    return "" + node;
  }

  if (walker.nodeToInputMap.has(node)) {
    return JSON.stringify(walker.nodeToInputMap.get(node));
  }

  if (node.type === "OutputProxy") {
    return _n(node) + " " + [
      createKeyFromNode(walker, node.props[0]),
      node.props[1],
    ].join(" ");
  }

  return _n(node) + " " + node.props.map((node) => {
    return createKeyFromNode(walker, node);
  }).join(" ");
}

function deuniq(id) {
  return id.replace(/~\d+$/, "");
}

function _n(node) {
  return node.type + "." + _s(node);
}

function _s(node) {
  return {
    audio: "ar", control: "kr", scalar: "ir"
  }[node.rate];
}

function _r(node) {
  return {
    audio: 2, control: 1, scalar: 0
  }[node.rate];
}

module.exports = build;
