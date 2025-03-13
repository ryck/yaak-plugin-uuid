"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  plugin: () => plugin
});
module.exports = __toCommonJS(src_exports);

// node_modules/uuid/dist/esm/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

// node_modules/uuid/dist/esm/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/esm/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v;
  return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, v >>> 16 & 255, v >>> 8 & 255, v & 255, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 255, (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255, v / 4294967296 & 255, v >>> 24 & 255, v >>> 16 & 255, v >>> 8 & 255, v & 255);
}
var parse_default = parse;

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/v1.js
var _state = {};
function v1(options, buf, offset) {
  let bytes;
  const isV6 = options?._v6 ?? false;
  if (options) {
    const optionsKeys = Object.keys(options);
    if (optionsKeys.length === 1 && optionsKeys[0] === "_v6") {
      options = void 0;
    }
  }
  if (options) {
    bytes = v1Bytes(options.random ?? options.rng?.() ?? rng(), options.msecs, options.nsecs, options.clockseq, options.node, buf, offset);
  } else {
    const now = Date.now();
    const rnds = rng();
    updateV1State(_state, now, rnds);
    bytes = v1Bytes(rnds, _state.msecs, _state.nsecs, isV6 ? void 0 : _state.clockseq, isV6 ? void 0 : _state.node, buf, offset);
  }
  return buf ?? unsafeStringify(bytes);
}
function updateV1State(state, now, rnds) {
  state.msecs ??= -Infinity;
  state.nsecs ??= 0;
  if (now === state.msecs) {
    state.nsecs++;
    if (state.nsecs >= 1e4) {
      state.node = void 0;
      state.nsecs = 0;
    }
  } else if (now > state.msecs) {
    state.nsecs = 0;
  } else if (now < state.msecs) {
    state.node = void 0;
  }
  if (!state.node) {
    state.node = rnds.slice(10, 16);
    state.node[0] |= 1;
    state.clockseq = (rnds[8] << 8 | rnds[9]) & 16383;
  }
  state.msecs = now;
  return state;
}
function v1Bytes(rnds, msecs, nsecs, clockseq, node, buf, offset = 0) {
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  if (!buf) {
    buf = new Uint8Array(16);
    offset = 0;
  } else {
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
  }
  msecs ??= Date.now();
  nsecs ??= 0;
  clockseq ??= (rnds[8] << 8 | rnds[9]) & 16383;
  node ??= rnds.slice(10, 16);
  msecs += 122192928e5;
  const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
  buf[offset++] = tl >>> 24 & 255;
  buf[offset++] = tl >>> 16 & 255;
  buf[offset++] = tl >>> 8 & 255;
  buf[offset++] = tl & 255;
  const tmh = msecs / 4294967296 * 1e4 & 268435455;
  buf[offset++] = tmh >>> 8 & 255;
  buf[offset++] = tmh & 255;
  buf[offset++] = tmh >>> 24 & 15 | 16;
  buf[offset++] = tmh >>> 16 & 255;
  buf[offset++] = clockseq >>> 8 | 128;
  buf[offset++] = clockseq & 255;
  for (let n = 0; n < 6; ++n) {
    buf[offset++] = node[n];
  }
  return buf;
}
var v1_default = v1;

// node_modules/uuid/dist/esm/v1ToV6.js
function v1ToV6(uuid) {
  const v1Bytes2 = typeof uuid === "string" ? parse_default(uuid) : uuid;
  const v6Bytes = _v1ToV6(v1Bytes2);
  return typeof uuid === "string" ? unsafeStringify(v6Bytes) : v6Bytes;
}
function _v1ToV6(v1Bytes2) {
  return Uint8Array.of((v1Bytes2[6] & 15) << 4 | v1Bytes2[7] >> 4 & 15, (v1Bytes2[7] & 15) << 4 | (v1Bytes2[4] & 240) >> 4, (v1Bytes2[4] & 15) << 4 | (v1Bytes2[5] & 240) >> 4, (v1Bytes2[5] & 15) << 4 | (v1Bytes2[0] & 240) >> 4, (v1Bytes2[0] & 15) << 4 | (v1Bytes2[1] & 240) >> 4, (v1Bytes2[1] & 15) << 4 | (v1Bytes2[2] & 240) >> 4, 96 | v1Bytes2[2] & 15, v1Bytes2[3], v1Bytes2[8], v1Bytes2[9], v1Bytes2[10], v1Bytes2[11], v1Bytes2[12], v1Bytes2[13], v1Bytes2[14], v1Bytes2[15]);
}

// node_modules/uuid/dist/esm/native.js
var import_crypto2 = require("crypto");
var native_default = { randomUUID: import_crypto2.randomUUID };

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/uuid/dist/esm/v6.js
function v6(options, buf, offset) {
  options ??= {};
  offset ??= 0;
  let bytes = v1_default({ ...options, _v6: true }, new Uint8Array(16));
  bytes = v1ToV6(bytes);
  if (buf) {
    for (let i = 0; i < 16; i++) {
      buf[offset + i] = bytes[i];
    }
    return buf;
  }
  return unsafeStringify(bytes);
}
var v6_default = v6;

// node_modules/uuid/dist/esm/v7.js
var _state2 = {};
function v7(options, buf, offset) {
  let bytes;
  if (options) {
    bytes = v7Bytes(options.random ?? options.rng?.() ?? rng(), options.msecs, options.seq, buf, offset);
  } else {
    const now = Date.now();
    const rnds = rng();
    updateV7State(_state2, now, rnds);
    bytes = v7Bytes(rnds, _state2.msecs, _state2.seq, buf, offset);
  }
  return buf ?? unsafeStringify(bytes);
}
function updateV7State(state, now, rnds) {
  state.msecs ??= -Infinity;
  state.seq ??= 0;
  if (now > state.msecs) {
    state.seq = rnds[6] << 23 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
    state.msecs = now;
  } else {
    state.seq = state.seq + 1 | 0;
    if (state.seq === 0) {
      state.msecs++;
    }
  }
  return state;
}
function v7Bytes(rnds, msecs, seq, buf, offset = 0) {
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  if (!buf) {
    buf = new Uint8Array(16);
    offset = 0;
  } else {
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
  }
  msecs ??= Date.now();
  seq ??= rnds[6] * 127 << 24 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
  buf[offset++] = msecs / 1099511627776 & 255;
  buf[offset++] = msecs / 4294967296 & 255;
  buf[offset++] = msecs / 16777216 & 255;
  buf[offset++] = msecs / 65536 & 255;
  buf[offset++] = msecs / 256 & 255;
  buf[offset++] = msecs & 255;
  buf[offset++] = 112 | seq >>> 28 & 15;
  buf[offset++] = seq >>> 20 & 255;
  buf[offset++] = 128 | seq >>> 14 & 63;
  buf[offset++] = seq >>> 6 & 255;
  buf[offset++] = seq << 2 & 255 | rnds[10] & 3;
  buf[offset++] = rnds[11];
  buf[offset++] = rnds[12];
  buf[offset++] = rnds[13];
  buf[offset++] = rnds[14];
  buf[offset++] = rnds[15];
  return buf;
}
var v7_default = v7;

// src/index.ts
var algorithms = ["v1", "v4", "v6", "v7"];
var plugin = {
  templateFunctions: algorithms.map((algorithm) => ({
    name: `uuid.${algorithm}`,
    description: `Generates a ${algorithm} UUID`,
    args: [],
    async onRender(_ctx, args) {
      let uuid;
      switch (algorithm) {
        case "v1":
          uuid = v1_default();
          break;
        case "v4":
          uuid = v4_default();
          break;
        case "v6":
          uuid = v6_default();
          break;
        case "v7":
          uuid = v7_default();
          break;
        default:
          return null;
      }
      return uuid;
    }
  }))
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  plugin
});
