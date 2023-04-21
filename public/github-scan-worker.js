"use strict";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
          resolve(value);
        });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done
        ? resolve(result.value)
        : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
    m = s && o[s],
    i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function () {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      },
    };
  throw new TypeError(
    s ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m
    ? m.call(o)
    : ((o =
        typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
      (i = {}),
      verb("next"),
      verb("throw"),
      verb("return"),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i);
  function verb(n) {
    i[n] =
      o[n] &&
      function (v) {
        return new Promise(function (resolve, reject) {
          (v = o[n](v)), settle(resolve, reject, v.done, v.value);
        });
      };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({ value: v, done: d });
    }, reject);
  }
}

function devAssert(condition, message) {
  const booleanCondition = Boolean(condition);

  if (!booleanCondition) {
    throw new Error(message);
  }
}

/**
 * Contains a range of UTF-8 character offsets and token references that
 * identify the region of the source from which the AST derived.
 */
/**
 * The list of all possible AST node types.
 */

/**
 * @internal
 */
const QueryDocumentKeys = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet",
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name", // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet",
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields",
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives",
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields",
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"],
};
const kindValues = new Set(Object.keys(QueryDocumentKeys));
/**
 * @internal
 */

function isNode(maybeNode) {
  const maybeKind =
    maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
  return typeof maybeKind === "string" && kindValues.has(maybeKind);
}
/** Name */

var OperationTypeNode;

(function (OperationTypeNode) {
  OperationTypeNode["QUERY"] = "query";
  OperationTypeNode["MUTATION"] = "mutation";
  OperationTypeNode["SUBSCRIPTION"] = "subscription";
})(OperationTypeNode || (OperationTypeNode = {}));

/**
 * The set of allowed kind values for AST nodes.
 */
var Kind;

(function (Kind) {
  Kind["NAME"] = "Name";
  Kind["DOCUMENT"] = "Document";
  Kind["OPERATION_DEFINITION"] = "OperationDefinition";
  Kind["VARIABLE_DEFINITION"] = "VariableDefinition";
  Kind["SELECTION_SET"] = "SelectionSet";
  Kind["FIELD"] = "Field";
  Kind["ARGUMENT"] = "Argument";
  Kind["FRAGMENT_SPREAD"] = "FragmentSpread";
  Kind["INLINE_FRAGMENT"] = "InlineFragment";
  Kind["FRAGMENT_DEFINITION"] = "FragmentDefinition";
  Kind["VARIABLE"] = "Variable";
  Kind["INT"] = "IntValue";
  Kind["FLOAT"] = "FloatValue";
  Kind["STRING"] = "StringValue";
  Kind["BOOLEAN"] = "BooleanValue";
  Kind["NULL"] = "NullValue";
  Kind["ENUM"] = "EnumValue";
  Kind["LIST"] = "ListValue";
  Kind["OBJECT"] = "ObjectValue";
  Kind["OBJECT_FIELD"] = "ObjectField";
  Kind["DIRECTIVE"] = "Directive";
  Kind["NAMED_TYPE"] = "NamedType";
  Kind["LIST_TYPE"] = "ListType";
  Kind["NON_NULL_TYPE"] = "NonNullType";
  Kind["SCHEMA_DEFINITION"] = "SchemaDefinition";
  Kind["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
  Kind["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
  Kind["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
  Kind["FIELD_DEFINITION"] = "FieldDefinition";
  Kind["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
  Kind["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
  Kind["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
  Kind["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
  Kind["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
  Kind["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
  Kind["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
  Kind["SCHEMA_EXTENSION"] = "SchemaExtension";
  Kind["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
  Kind["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
  Kind["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
  Kind["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
  Kind["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
  Kind["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
})(Kind || (Kind = {}));
/**
 * The enum type representing the possible kind values of AST nodes.
 *
 * @deprecated Please use `Kind`. Will be remove in v17.
 */

/**
 * ```
 * WhiteSpace ::
 *   - "Horizontal Tab (U+0009)"
 *   - "Space (U+0020)"
 * ```
 * @internal
 */
function isWhiteSpace(code) {
  return code === 0x0009 || code === 0x0020;
}

/**
 * Print a block string in the indented block form by adding a leading and
 * trailing blank line. However, if a block string starts with whitespace and is
 * a single-line, adding a leading blank line would strip that whitespace.
 *
 * @internal
 */

function printBlockString(value, options) {
  const escapedValue = value.replace(/"""/g, '\\"""'); // Expand a block string's raw value into independent lines.

  const lines = escapedValue.split(/\r\n|[\n\r]/g);
  const isSingleLine = lines.length === 1; // If common indentation is found we can fix some of those cases by adding leading new line

  const forceLeadingNewLine =
    lines.length > 1 &&
    lines
      .slice(1)
      .every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0))); // Trailing triple quotes just looks confusing but doesn't force trailing new line

  const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""'); // Trailing quote (single or double) or slash forces trailing new line

  const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
  const hasTrailingSlash = value.endsWith("\\");
  const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
  const printAsMultipleLines =
    !(options !== null && options !== void 0 && options.minimize) && // add leading and trailing new lines only if it improves readability
    (!isSingleLine ||
      value.length > 70 ||
      forceTrailingNewline ||
      forceLeadingNewLine ||
      hasTrailingTripleQuotes);
  let result = ""; // Format a multi-line block quote to account for leading space.

  const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));

  if ((printAsMultipleLines && !skipLeadingNewLine) || forceLeadingNewLine) {
    result += "\n";
  }

  result += escapedValue;

  if (printAsMultipleLines || forceTrailingNewline) {
    result += "\n";
  }

  return '"""' + result + '"""';
}

const MAX_ARRAY_LENGTH = 10;
const MAX_RECURSIVE_DEPTH = 2;
/**
 * Used to print values in error messages.
 */

function inspect(value) {
  return formatValue(value, []);
}

function formatValue(value, seenValues) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);

    case "function":
      return value.name ? `[function ${value.name}]` : "[function]";

    case "object":
      return formatObjectValue(value, seenValues);

    default:
      return String(value);
  }
}

function formatObjectValue(value, previouslySeenValues) {
  if (value === null) {
    return "null";
  }

  if (previouslySeenValues.includes(value)) {
    return "[Circular]";
  }

  const seenValues = [...previouslySeenValues, value];

  if (isJSONable(value)) {
    const jsonValue = value.toJSON(); // check for infinite recursion

    if (jsonValue !== value) {
      return typeof jsonValue === "string"
        ? jsonValue
        : formatValue(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }

  return formatObject(value, seenValues);
}

function isJSONable(value) {
  return typeof value.toJSON === "function";
}

function formatObject(object, seenValues) {
  const entries = Object.entries(object);

  if (entries.length === 0) {
    return "{}";
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[" + getObjectTag(object) + "]";
  }

  const properties = entries.map(
    ([key, value]) => key + ": " + formatValue(value, seenValues)
  );
  return "{ " + properties.join(", ") + " }";
}

function formatArray(array, seenValues) {
  if (array.length === 0) {
    return "[]";
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[Array]";
  }

  const len = Math.min(MAX_ARRAY_LENGTH, array.length);
  const remaining = array.length - len;
  const items = [];

  for (let i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }

  if (remaining === 1) {
    items.push("... 1 more item");
  } else if (remaining > 1) {
    items.push(`... ${remaining} more items`);
  }

  return "[" + items.join(", ") + "]";
}

function getObjectTag(object) {
  const tag = Object.prototype.toString
    .call(object)
    .replace(/^\[object /, "")
    .replace(/]$/, "");

  if (tag === "Object" && typeof object.constructor === "function") {
    const name = object.constructor.name;

    if (typeof name === "string" && name !== "") {
      return name;
    }
  }

  return tag;
}

/**
 * Prints a string as a GraphQL StringValue literal. Replaces control characters
 * and excluded characters (" U+0022 and \\ U+005C) with escape sequences.
 */
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
} // eslint-disable-next-line no-control-regex

const escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;

function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
} // prettier-ignore

const escapeSequences = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "", // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "", // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "", // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "", // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "", // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F",
];

/**
 * A visitor is provided to visit, it contains the collection of
 * relevant functions to be called during the visitor's traversal.
 */

const BREAK = Object.freeze({});
/**
 * visit() will walk through an AST using a depth-first traversal, calling
 * the visitor's enter function at each node in the traversal, and calling the
 * leave function after visiting that node and all of its child nodes.
 *
 * By returning different values from the enter and leave functions, the
 * behavior of the visitor can be altered, including skipping over a sub-tree of
 * the AST (by returning false), editing the AST by returning a value or null
 * to remove the value, or to stop the whole traversal by returning BREAK.
 *
 * When using visit() to edit an AST, the original AST will not be modified, and
 * a new version of the AST with the changes applied will be returned from the
 * visit function.
 *
 * ```ts
 * const editedAST = visit(ast, {
 *   enter(node, key, parent, path, ancestors) {
 *     // @return
 *     //   undefined: no action
 *     //   false: skip visiting this node
 *     //   visitor.BREAK: stop visiting altogether
 *     //   null: delete this node
 *     //   any value: replace this node with the returned value
 *   },
 *   leave(node, key, parent, path, ancestors) {
 *     // @return
 *     //   undefined: no action
 *     //   false: no action
 *     //   visitor.BREAK: stop visiting altogether
 *     //   null: delete this node
 *     //   any value: replace this node with the returned value
 *   }
 * });
 * ```
 *
 * Alternatively to providing enter() and leave() functions, a visitor can
 * instead provide functions named the same as the kinds of AST nodes, or
 * enter/leave visitors at a named key, leading to three permutations of the
 * visitor API:
 *
 * 1) Named visitors triggered when entering a node of a specific kind.
 *
 * ```ts
 * visit(ast, {
 *   Kind(node) {
 *     // enter the "Kind" node
 *   }
 * })
 * ```
 *
 * 2) Named visitors that trigger upon entering and leaving a node of a specific kind.
 *
 * ```ts
 * visit(ast, {
 *   Kind: {
 *     enter(node) {
 *       // enter the "Kind" node
 *     }
 *     leave(node) {
 *       // leave the "Kind" node
 *     }
 *   }
 * })
 * ```
 *
 * 3) Generic visitors that trigger upon entering and leaving any node.
 *
 * ```ts
 * visit(ast, {
 *   enter(node) {
 *     // enter any node
 *   },
 *   leave(node) {
 *     // leave any node
 *   }
 * })
 * ```
 */

function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
  const enterLeaveMap = new Map();

  for (const kind of Object.values(Kind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }
  /* eslint-disable no-undef-init */

  let stack = undefined;
  let inArray = Array.isArray(root);
  let keys = [root];
  let index = -1;
  let edits = [];
  let node = root;
  let key = undefined;
  let parent = undefined;
  const path = [];
  const ancestors = [];
  /* eslint-enable no-undef-init */

  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;

    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();

      if (isEdited) {
        if (inArray) {
          node = node.slice();
          let editOffset = 0;

          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;

            if (editValue === null) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(node)
          );

          for (const [editKey, editValue] of edits) {
            node[editKey] = editValue;
          }
        }
      }

      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else if (parent) {
      key = inArray ? index : keys[index];
      node = parent[key];

      if (node === null || node === undefined) {
        continue;
      }

      path.push(key);
    }

    let result;

    if (!Array.isArray(node)) {
      var _enterLeaveMap$get, _enterLeaveMap$get2;

      isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
      const visitFn = isLeaving
        ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null ||
          _enterLeaveMap$get === void 0
          ? void 0
          : _enterLeaveMap$get.leave
        : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null ||
          _enterLeaveMap$get2 === void 0
        ? void 0
        : _enterLeaveMap$get2.enter;
      result =
        visitFn === null || visitFn === void 0
          ? void 0
          : visitFn.call(visitor, node, key, parent, path, ancestors);

      if (result === BREAK) {
        break;
      }

      if (result === false) {
        if (!isLeaving) {
          path.pop();
          continue;
        }
      } else if (result !== undefined) {
        edits.push([key, result]);

        if (!isLeaving) {
          if (isNode(result)) {
            node = result;
          } else {
            path.pop();
            continue;
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (isLeaving) {
      path.pop();
    } else {
      var _node$kind;

      stack = {
        inArray,
        index,
        keys,
        edits,
        prev: stack,
      };
      inArray = Array.isArray(node);
      keys = inArray
        ? node
        : (_node$kind = visitorKeys[node.kind]) !== null &&
          _node$kind !== void 0
        ? _node$kind
        : [];
      index = -1;
      edits = [];

      if (parent) {
        ancestors.push(parent);
      }

      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    // New root
    return edits[edits.length - 1][1];
  }

  return root;
}
/**
 * Given a visitor instance and a node kind, return EnterLeaveVisitor for that kind.
 */

function getEnterLeaveForKind(visitor, kind) {
  const kindVisitor = visitor[kind];

  if (typeof kindVisitor === "object") {
    // { Kind: { enter() {}, leave() {} } }
    return kindVisitor;
  } else if (typeof kindVisitor === "function") {
    // { Kind() {} }
    return {
      enter: kindVisitor,
      leave: undefined,
    };
  } // { enter() {}, leave() {} }

  return {
    enter: visitor.enter,
    leave: visitor.leave,
  };
}

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */

function print(ast) {
  return visit(ast, printDocASTReducer);
}
const MAX_LINE_LENGTH = 80;
const printDocASTReducer = {
  Name: {
    leave: (node) => node.value,
  },
  Variable: {
    leave: (node) => "$" + node.name,
  },
  // Document
  Document: {
    leave: (node) => join(node.definitions, "\n\n"),
  },
  OperationDefinition: {
    leave(node) {
      const varDefs = wrap$1("(", join(node.variableDefinitions, ", "), ")");
      const prefix = join(
        [
          node.operation,
          join([node.name, varDefs]),
          join(node.directives, " "),
        ],
        " "
      ); // Anonymous queries with no directives or variable definitions can use
      // the query short form.

      return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
    },
  },
  VariableDefinition: {
    leave: ({ variable, type, defaultValue, directives }) =>
      variable +
      ": " +
      type +
      wrap$1(" = ", defaultValue) +
      wrap$1(" ", join(directives, " ")),
  },
  SelectionSet: {
    leave: ({ selections }) => block(selections),
  },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap$1("", alias, ": ") + name;
      let argsLine = prefix + wrap$1("(", join(args, ", "), ")");

      if (argsLine.length > MAX_LINE_LENGTH) {
        argsLine = prefix + wrap$1("(\n", indent(join(args, "\n")), "\n)");
      }

      return join([argsLine, join(directives, " "), selectionSet], " ");
    },
  },
  Argument: {
    leave: ({ name, value }) => name + ": " + value,
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name, directives }) =>
      "..." + name + wrap$1(" ", join(directives, " ")),
  },
  InlineFragment: {
    leave: ({ typeCondition, directives, selectionSet }) =>
      join(
        [
          "...",
          wrap$1("on ", typeCondition),
          join(directives, " "),
          selectionSet,
        ],
        " "
      ),
  },
  FragmentDefinition: {
    leave: (
      { name, typeCondition, variableDefinitions, directives, selectionSet } // Note: fragment variable definitions are experimental and may be changed
    ) =>
      // or removed in the future.
      `fragment ${name}${wrap$1("(", join(variableDefinitions, ", "), ")")} ` +
      `on ${typeCondition} ${wrap$1("", join(directives, " "), " ")}` +
      selectionSet,
  },
  // Value
  IntValue: {
    leave: ({ value }) => value,
  },
  FloatValue: {
    leave: ({ value }) => value,
  },
  StringValue: {
    leave: ({ value, block: isBlockString }) =>
      isBlockString ? printBlockString(value) : printString(value),
  },
  BooleanValue: {
    leave: ({ value }) => (value ? "true" : "false"),
  },
  NullValue: {
    leave: () => "null",
  },
  EnumValue: {
    leave: ({ value }) => value,
  },
  ListValue: {
    leave: ({ values }) => "[" + join(values, ", ") + "]",
  },
  ObjectValue: {
    leave: ({ fields }) => "{" + join(fields, ", ") + "}",
  },
  ObjectField: {
    leave: ({ name, value }) => name + ": " + value,
  },
  // Directive
  Directive: {
    leave: ({ name, arguments: args }) =>
      "@" + name + wrap$1("(", join(args, ", "), ")"),
  },
  // Type
  NamedType: {
    leave: ({ name }) => name,
  },
  ListType: {
    leave: ({ type }) => "[" + type + "]",
  },
  NonNullType: {
    leave: ({ type }) => type + "!",
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description, directives, operationTypes }) =>
      wrap$1("", description, "\n") +
      join(["schema", join(directives, " "), block(operationTypes)], " "),
  },
  OperationTypeDefinition: {
    leave: ({ operation, type }) => operation + ": " + type,
  },
  ScalarTypeDefinition: {
    leave: ({ description, name, directives }) =>
      wrap$1("", description, "\n") +
      join(["scalar", name, join(directives, " ")], " "),
  },
  ObjectTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) =>
      wrap$1("", description, "\n") +
      join(
        [
          "type",
          name,
          wrap$1("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields),
        ],
        " "
      ),
  },
  FieldDefinition: {
    leave: ({ description, name, arguments: args, type, directives }) =>
      wrap$1("", description, "\n") +
      name +
      (hasMultilineItems(args)
        ? wrap$1("(\n", indent(join(args, "\n")), "\n)")
        : wrap$1("(", join(args, ", "), ")")) +
      ": " +
      type +
      wrap$1(" ", join(directives, " ")),
  },
  InputValueDefinition: {
    leave: ({ description, name, type, defaultValue, directives }) =>
      wrap$1("", description, "\n") +
      join(
        [name + ": " + type, wrap$1("= ", defaultValue), join(directives, " ")],
        " "
      ),
  },
  InterfaceTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) =>
      wrap$1("", description, "\n") +
      join(
        [
          "interface",
          name,
          wrap$1("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields),
        ],
        " "
      ),
  },
  UnionTypeDefinition: {
    leave: ({ description, name, directives, types }) =>
      wrap$1("", description, "\n") +
      join(
        [
          "union",
          name,
          join(directives, " "),
          wrap$1("= ", join(types, " | ")),
        ],
        " "
      ),
  },
  EnumTypeDefinition: {
    leave: ({ description, name, directives, values }) =>
      wrap$1("", description, "\n") +
      join(["enum", name, join(directives, " "), block(values)], " "),
  },
  EnumValueDefinition: {
    leave: ({ description, name, directives }) =>
      wrap$1("", description, "\n") + join([name, join(directives, " ")], " "),
  },
  InputObjectTypeDefinition: {
    leave: ({ description, name, directives, fields }) =>
      wrap$1("", description, "\n") +
      join(["input", name, join(directives, " "), block(fields)], " "),
  },
  DirectiveDefinition: {
    leave: ({ description, name, arguments: args, repeatable, locations }) =>
      wrap$1("", description, "\n") +
      "directive @" +
      name +
      (hasMultilineItems(args)
        ? wrap$1("(\n", indent(join(args, "\n")), "\n)")
        : wrap$1("(", join(args, ", "), ")")) +
      (repeatable ? " repeatable" : "") +
      " on " +
      join(locations, " | "),
  },
  SchemaExtension: {
    leave: ({ directives, operationTypes }) =>
      join(
        ["extend schema", join(directives, " "), block(operationTypes)],
        " "
      ),
  },
  ScalarTypeExtension: {
    leave: ({ name, directives }) =>
      join(["extend scalar", name, join(directives, " ")], " "),
  },
  ObjectTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) =>
      join(
        [
          "extend type",
          name,
          wrap$1("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields),
        ],
        " "
      ),
  },
  InterfaceTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) =>
      join(
        [
          "extend interface",
          name,
          wrap$1("implements ", join(interfaces, " & ")),
          join(directives, " "),
          block(fields),
        ],
        " "
      ),
  },
  UnionTypeExtension: {
    leave: ({ name, directives, types }) =>
      join(
        [
          "extend union",
          name,
          join(directives, " "),
          wrap$1("= ", join(types, " | ")),
        ],
        " "
      ),
  },
  EnumTypeExtension: {
    leave: ({ name, directives, values }) =>
      join(["extend enum", name, join(directives, " "), block(values)], " "),
  },
  InputObjectTypeExtension: {
    leave: ({ name, directives, fields }) =>
      join(["extend input", name, join(directives, " "), block(fields)], " "),
  },
};
/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */

function join(maybeArray, separator = "") {
  var _maybeArray$filter$jo;

  return (_maybeArray$filter$jo =
    maybeArray === null || maybeArray === void 0
      ? void 0
      : maybeArray.filter((x) => x).join(separator)) !== null &&
    _maybeArray$filter$jo !== void 0
    ? _maybeArray$filter$jo
    : "";
}
/**
 * Given array, print each item on its own line, wrapped in an indented `{ }` block.
 */

function block(array) {
  return wrap$1("{\n", indent(join(array, "\n")), "\n}");
}
/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise print an empty string.
 */

function wrap$1(start, maybeString, end = "") {
  return maybeString != null && maybeString !== ""
    ? start + maybeString + end
    : "";
}

function indent(str) {
  return wrap$1("  ", str.replace(/\n/g, "\n  "));
}

function hasMultilineItems(maybeArray) {
  var _maybeArray$some;

  // FIXME: https://github.com/graphql/graphql-js/issues/2203

  /* c8 ignore next */
  return (_maybeArray$some =
    maybeArray === null || maybeArray === void 0
      ? void 0
      : maybeArray.some((str) => str.includes("\n"))) !== null &&
    _maybeArray$some !== void 0
    ? _maybeArray$some
    : false;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal =
  typeof global == "object" && global && global.Object === Object && global;

var freeGlobal$1 = freeGlobal;

/** Detect free variable `self`. */
var freeSelf =
  typeof self == "object" && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal$1 || freeSelf || Function("return this")();

var root$1 = root;

/** Built-in value references. */
var Symbol$1 = root$1.Symbol;

var Symbol$2 = Symbol$1;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$5.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$4.call(value, symToStringTag$1),
    tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$4.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/** `Object#toString` result references. */
var nullTag = "[object Null]",
  undefinedTag = "[object Undefined]";

/** Built-in value references. */
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value)
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == "object";
}

/** `Object#toString` result references. */
var symbolTag = "[object Symbol]";

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (
    typeof value == "symbol" ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag)
  );
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length,
    result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

var isArray$2 = isArray$1;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$2 ? Symbol$2.prototype : undefined,
  symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == "string") {
    return value;
  }
  if (isArray$2(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}

/** `Object#toString` result references. */
var asyncTag = "[object AsyncFunction]",
  funcTag = "[object Function]",
  genTag = "[object GeneratorFunction]",
  proxyTag = "[object Proxy]";

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject$1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1["__core-js_shared__"];

var coreJsData$1 = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function () {
  var uid = /[^.]+$/.exec(
    (coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO) || ""
  );
  return uid ? "Symbol(src)_1." + uid : "";
})();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return func + "";
    } catch (e) {}
  }
  return "";
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
  objectProto$3 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp(
  "^" +
    funcToString
      .call(hasOwnProperty$3)
      .replace(reRegExpChar, "\\$&")
      .replace(
        /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
        "$1.*?"
      ) +
    "$"
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject$1(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var defineProperty$1 = (function () {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {}
})();

var defineProperty$2 = defineProperty$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return (
    !!length &&
    (type == "number" || (type != "symbol" && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 == 0 &&
    value < length
  );
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty$2) {
    defineProperty$2(object, key, {
      configurable: true,
      enumerable: true,
      value: value,
      writable: true,
    });
  } else {
    object[key] = value;
  }
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (
    !(hasOwnProperty$2.call(object, key) && eq(objValue, value)) ||
    (value === undefined && !(key in object))
  ) {
    baseAssignValue(object, key, value);
  }
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray$2(value)) {
    return false;
  }
  var type = typeof value;
  if (
    type == "number" ||
    type == "symbol" ||
    type == "boolean" ||
    value == null ||
    isSymbol(value)
  ) {
    return true;
  }
  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  );
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, "create");

var nativeCreate$1 = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? undefined : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate$1
    ? data[key] !== undefined
    : hasOwnProperty.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = "__lodash_hash_undefined__";

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$1 && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
    index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root$1, "Map");

var Map$2 = Map$1;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    hash: new Hash(),
    map: new (Map$2 || ListCache)(),
    string: new Hash(),
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == "string" ||
    type == "number" ||
    type == "symbol" ||
    type == "boolean"
    ? value !== "__proto__"
    : value === null;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == "string" ? "string" : "hash"]
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
    size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT = "Expected a function";

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (
    typeof func != "function" ||
    (resolver != null && typeof resolver != "function")
  ) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function () {
    var args = arguments,
      key = resolver ? resolver.apply(this, args) : args[0],
      cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function (string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push("");
  }
  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(
      quote ? subString.replace(reEscapeChar, "$1") : number || match
    );
  });
  return result;
});

var stringToPath$1 = stringToPath;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? "" : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray$2(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath$1(toString$1(value));
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
    length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject$1(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
    length = path.length,
    lastIndex = length - 1,
    nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
      newValue = value;

    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject$1(objValue)
          ? objValue
          : isIndex(path[index + 1])
          ? []
          : {};
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

// src/index.ts

// src/interface.ts
function isLimitParameter(name) {
  return name === "first" || name === "last";
}
function isCursorParameter(name) {
  return name === "after" || name === "before";
}

// src/index.ts
var DEFAULT_MAX_PER_PAGE = 100;
function applyMaxPerPageToVariables(
  variables,
  paginators,
  maxPerPage = DEFAULT_MAX_PER_PAGE
) {
  for (const paginator of paginators) {
    const limit = Number(variables[paginator.limitVarName]);
    if (!limit || limit > maxPerPage) {
      variables[paginator.limitVarName] = maxPerPage;
    }
  }
}
function getRemainingNumberOfRequests(
  paginator,
  currentData,
  maxPerPage = DEFAULT_MAX_PER_PAGE
) {
  const { totalCount, nodes } = get(currentData, paginator.path);
  const remainingNumberOfNodes = totalCount - nodes.length;
  const expectedNumberOfRequests = Math.ceil(
    remainingNumberOfNodes / maxPerPage
  );
  return expectedNumberOfRequests;
}
function getVarNamesFromArguments(argumentNodes, variableNames) {
  let limitVarName;
  let cursorVarName;
  for (const argument of argumentNodes) {
    if (
      argument.value.kind === Kind.VARIABLE &&
      variableNames.includes(argument.value.name.value)
    ) {
      if (isLimitParameter(argument.name.value)) {
        limitVarName = argument.value.name.value;
      } else if (isCursorParameter(argument.name.value)) {
        cursorVarName = argument.value.name.value;
      }
    }
  }
  return [limitVarName, cursorVarName];
}
function extractPaginatorsFromSelectionSet(
  selectionSet,
  variableNames,
  path = []
) {
  const paginators = [];
  for (const selection of selectionSet.selections) {
    if (selection.kind === Kind.FIELD && selection.arguments) {
      const [limitVarName, cursorVarName] = getVarNamesFromArguments(
        selection.arguments,
        variableNames
      );
      if (limitVarName && cursorVarName) {
        paginators.push({
          path: [...path, selection.name.value],
          limitVarName,
          cursorVarName,
          requestCount: 0,
          remainingRequests: 1,
        });
      }
      if (selection.selectionSet) {
        paginators.push(
          ...extractPaginatorsFromSelectionSet(
            selection.selectionSet,
            variableNames,
            [...path, selection.name.value]
          )
        );
      }
    }
    if (selection.kind === Kind.INLINE_FRAGMENT && selection.selectionSet) {
      paginators.push(
        ...extractPaginatorsFromSelectionSet(
          selection.selectionSet,
          variableNames,
          path
        )
      );
    }
  }
  return paginators;
}
function extractPaginators(document) {
  const queryOperation = document.definitions.find(
    (definition) =>
      definition.kind === Kind.OPERATION_DEFINITION &&
      definition.operation === "query" &&
      definition.variableDefinitions &&
      definition.variableDefinitions.length > 0
  );
  if (!queryOperation)
    throw new Error("No query operation with variables found in document");
  const variableNames = queryOperation.variableDefinitions.map(
    (variableDefinition) => variableDefinition.variable.name.value
  );
  const paginationParameters = [];
  paginationParameters.push(
    ...extractPaginatorsFromSelectionSet(
      queryOperation.selectionSet,
      variableNames
    )
  );
  return paginationParameters;
}
function getHighestLevelPaginators(query) {
  const paginators = extractPaginators(query);
  const highestLevelPaginators = [];
  for (const paginator of paginators) {
    if (
      !paginators
        .filter((p) => p !== paginator)
        .some(
          (otherPaginator) => otherPaginator.path.length < paginator.path.length
        )
    ) {
      highestLevelPaginators.push(paginator);
    }
  }
  return highestLevelPaginators;
}
function mergeData(currentData, paginators, newData) {
  if (currentData) {
    for (const paginator of paginators) {
      if (paginator.done) continue;
      const { nodes } = get(newData, paginator.path);
      const { nodes: currentNodes } = get(currentData, paginator.path);
      set(currentData, paginator.path, {
        ...get(currentData, paginator.path),
        nodes: [...currentNodes, ...nodes],
      });
      if (newData.rateLimit) {
        set(currentData, "rateLimit", newData.rateLimit);
      }
    }
  } else {
    currentData = newData;
  }
  return currentData;
}
function updatePaginators(
  paginators,
  data,
  currentData,
  variables,
  maxPerPage
) {
  for (const paginator of paginators) {
    if (paginator.done) continue;
    maxPerPage = maxPerPage || DEFAULT_MAX_PER_PAGE;
    const {
      totalCount,
      pageInfo: { hasNextPage, endCursor },
    } = get(data, paginator.path);
    const { nodes } = get(currentData, paginator.path);
    paginator.remainingRequests = getRemainingNumberOfRequests(
      paginator,
      currentData,
      maxPerPage
    );
    paginator.requestCount++;
    if (hasNextPage) {
      variables[paginator.limitVarName] = Math.min(
        totalCount - nodes.length,
        maxPerPage
      );
      variables[paginator.cursorVarName] = endCursor;
    } else {
      paginator.done = true;
    }
  }
}
async function paginateQuery(args) {
  let { client, query, variables, paginators, currentData, maxPerPage } = args;
  const newData = await client(print(query), variables);
  currentData = mergeData(currentData, paginators, newData);
  updatePaginators(paginators, newData, currentData, variables, maxPerPage);
  return currentData;
}
async function* graphqlFetchAll(args) {
  let { client, query, variables, paginators, currentData, maxPerPage } = args;
  maxPerPage = maxPerPage || DEFAULT_MAX_PER_PAGE;
  applyMaxPerPageToVariables(variables, paginators, maxPerPage);
  while (paginators.some((paginator) => !paginator.done)) {
    currentData = await paginateQuery({
      client,
      query,
      variables,
      paginators,
      currentData,
      maxPerPage,
    });
    yield { data: currentData, paginators, variables };
  }
}

/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version 3.2.3, Mon Jan 23 2023
 *
 * https://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */

const _global =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : global;

const keys = Object.keys;
const isArray = Array.isArray;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object") return obj;
  keys(extension).forEach(function (key) {
    obj[key] = extension[key];
  });
  return obj;
}
const getProto = Object.getPrototypeOf;
const _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function") extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(
    (key) => {
      setProp(proto, key, extension[key]);
    }
  );
}
const defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(
    obj,
    prop,
    extend(
      functionOrGetSet &&
        hasOwn(functionOrGetSet, "get") &&
        typeof functionOrGetSet.get === "function"
        ? {
            get: functionOrGetSet.get,
            set: functionOrGetSet.set,
            configurable: true,
          }
        : { value: functionOrGetSet, configurable: true, writable: true },
      options
    )
  );
}
function derive(Child) {
  return {
    from: function (Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype),
      };
    },
  };
}
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  const pd = getOwnPropertyDescriptor(obj, prop);
  let proto;
  return pd || ((proto = getProto(obj)) && getPropertyDescriptor(proto, prop));
}
const _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert(b) {
  if (!b) throw new Error("Assertion Failed");
}
function asap$1(fn) {
  if (_global.setImmediate) setImmediate(fn);
  else setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce((result, item, i) => {
    var nameAndValue = extractor(item, i);
    if (nameAndValue) result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (hasOwn(obj, keyPath)) return obj[keyPath];
  if (!keyPath) return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === undefined
      ? undefined
      : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return undefined;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === undefined) return;
  if ("isFrozen" in Object && Object.isFrozen(obj)) return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === undefined) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else delete obj[currentKeyPath];
        } else obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj || !hasOwn(obj, currentKeyPath))
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === undefined) {
        if (isArray(obj) && !isNaN(parseInt(keyPath))) obj.splice(keyPath, 1);
        else delete obj[keyPath];
      } else obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string") setByKeyPath(obj, keyPath, undefined);
  else if ("length" in keyPath)
    [].map.call(keyPath, function (kp) {
      setByKeyPath(obj, kp, undefined);
    });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m)) rv[m] = obj[m];
  }
  return rv;
}
const concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
const intrinsicTypeNames =
  "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey"
    .split(",")
    .concat(
      flatten(
        [8, 16, 32, 64].map((num) =>
          ["Int", "Uint", "Float"].map((t) => t + num + "Array")
        )
      )
    )
    .filter((t) => _global[t]);
const intrinsicTypes = intrinsicTypeNames.map((t) => _global[t]);
arrayToObject(intrinsicTypeNames, (x) => [x, true]);
let circularRefs = null;
function deepClone(any) {
  circularRefs = typeof WeakMap !== "undefined" && new WeakMap();
  const rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}
function innerDeepClone(any) {
  if (!any || typeof any !== "object") return any;
  let rv = circularRefs && circularRefs.get(any);
  if (rv) return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(innerDeepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    const proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}
const { toString } = {};
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
const iteratorSymbol =
  typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
const getIteratorOf =
  typeof iteratorSymbol === "symbol"
    ? function (x) {
        var i;
        return x != null && (i = x[iteratorSymbol]) && i.apply(x);
      }
    : function () {
        return null;
      };
const NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike)) return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if ((it = getIteratorOf(arrayLike))) {
      a = [];
      while (((x = it.next()), !x.done)) a.push(x.value);
      return a;
    }
    if (arrayLike == null) return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--) a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--) a[i] = arguments[i];
  return a;
}
const isAsyncFunction =
  typeof Symbol !== "undefined"
    ? (fn) => fn[Symbol.toStringTag] === "AsyncFunction"
    : () => false;

var debug =
  typeof location !== "undefined" &&
  /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug = value;
  libraryFilter = filter;
}
var libraryFilter = () => true;
const NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK)
    try {
      getErrorWithStack.arguments;
      throw new Error();
    } catch (e) {
      return e;
    }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack) return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0)
    numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack
    .split("\n")
    .slice(numIgnoredFrames)
    .filter(libraryFilter)
    .map((frame) => "\n" + frame)
    .join("");
}

var dexieErrorNames = [
  "Modify",
  "Bulk",
  "OpenFailed",
  "VersionChange",
  "Schema",
  "Upgrade",
  "InvalidTable",
  "MissingAPI",
  "NoSuchDatabase",
  "InvalidArgument",
  "SubTransaction",
  "Unsupported",
  "Internal",
  "DatabaseClosed",
  "PrematureCommit",
  "ForeignAwait",
];
var idbDomErrorNames = [
  "Unknown",
  "Constraint",
  "Data",
  "TransactionInactive",
  "ReadOnly",
  "Version",
  "NotFound",
  "InvalidState",
  "InvalidAccess",
  "Abort",
  "Timeout",
  "QuotaExceeded",
  "Syntax",
  "DataClone",
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed",
  MissingAPI:
    "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb",
};
function DexieError(name, msg) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg;
}
derive(DexieError)
  .from(Error)
  .extend({
    stack: {
      get: function () {
        return (
          this._stack ||
          (this._stack =
            this.name + ": " + this.message + prettyStack(this._e, 2))
        );
      },
    },
    toString: function () {
      return this.name + ": " + this.message;
    },
  });
function getMultiErrorMessage(msg, failures) {
  return (
    msg +
    ". Errors: " +
    Object.keys(failures)
      .map((key) => failures[key].toString())
      .filter((v, i, s) => s.indexOf(v) === i)
      .join("\n")
  );
}
function ModifyError(msg, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = Object.keys(failures).map((pos) => failures[pos]);
  this.failuresByPos = failures;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce(
  (obj, name) => ((obj[name] = name + "Error"), obj),
  {}
);
const BaseException = DexieError;
var exceptions = errorList.reduce((obj, name) => {
  var fullName = name + "Error";
  function DexieError(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = `${msgOrInner}${!inner ? "" : "\n " + inner}`;
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = `${msgOrInner.name} ${msgOrInner.message}`;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError).from(BaseException);
  obj[name] = DexieError;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (
    !domError ||
    domError instanceof DexieError ||
    domError instanceof TypeError ||
    domError instanceof SyntaxError ||
    !domError.name ||
    !exceptionMap[domError.name]
  )
    return domError;
  var rv = new exceptionMap[domError.name](
    message || domError.message,
    domError
  );
  if ("stack" in domError) {
    setProp(rv, "stack", {
      get: function () {
        return this.inner.stack;
      },
    });
  }
  return rv;
}
var fullNameExceptions = errorList.reduce((obj, name) => {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1)
    obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;

function nop() {}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror) return f2;
  return function (val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function () {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    var res = f1.apply(this, arguments);
    if (res !== undefined) arguments[0] = res;
    var onsuccess = this.onsuccess,
      onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess
        ? callBoth(onsuccess, this.onsuccess)
        : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== undefined ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess,
      onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess
        ? callBoth(onsuccess, this.onsuccess)
        : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop) return f2;
  return function (modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess,
      onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess
        ? callBoth(onsuccess, this.onsuccess)
        : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === undefined
      ? res2 === undefined
        ? undefined
        : res2
      : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    if (f2.apply(this, arguments) === false) return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this,
        i = arguments.length,
        args = new Array(i);
      while (i--) args[i] = arguments[i];
      return res.then(function () {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}

var INTERNAL = {};
const LONG_STACKS_CLIP_LIMIT = 100,
  MAX_LONG_STACKS = 20,
  ZONE_ECHO_LIMIT = 100,
  [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] =
    typeof Promise === "undefined"
      ? []
      : (() => {
          let globalP = Promise.resolve();
          if (typeof crypto === "undefined" || !crypto.subtle)
            return [globalP, getProto(globalP), globalP];
          const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
          return [nativeP, getProto(nativeP), globalP];
        })(),
  nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
const NativePromise =
  resolvedNativePromise && resolvedNativePromise.constructor;
const patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise
  ? () => {
      resolvedGlobalPromise.then(physicalTick);
    }
  : _global.setImmediate
  ? setImmediate.bind(null, physicalTick)
  : _global.MutationObserver
  ? () => {
      var hiddenDiv = document.createElement("div");
      new MutationObserver(() => {
        physicalTick();
        hiddenDiv = null;
      }).observe(hiddenDiv, { attributes: true });
      hiddenDiv.setAttribute("i", "1");
    }
  : () => {
      setTimeout(physicalTick, 0);
    };
var asap = function (callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true,
  needsNewPhysicalTick = true,
  unhandledErrors = [],
  rejectingErrors = [],
  currentFulfiller = null,
  rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function () {
    this.unhandleds.forEach((uh) => {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {}
    });
  },
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = (this._PSD = PSD);
  if (debug) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL) throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false) handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
const thenProp = {
  get: function () {
    var psd = PSD,
      microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var possibleAwait =
        !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      const cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise((resolve, reject) => {
        propagateToListener(
          this,
          new Listener(
            nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup),
            nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup),
            resolve,
            reject,
            psd
          )
        );
      });
      debug && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function (value) {
    setProp(
      this,
      "then",
      value && value.prototype === INTERNAL
        ? thenProp
        : {
            get: function () {
              return value;
            },
            set: thenProp.set,
          }
    );
  },
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function (onFulfilled, onRejected) {
    propagateToListener(
      this,
      new Listener(null, null, onFulfilled, onRejected, PSD)
    );
  },
  catch: function (onRejected) {
    if (arguments.length === 1) return this.then(null, onRejected);
    var type = arguments[0],
      handler = arguments[1];
    return typeof type === "function"
      ? this.then(null, (err) =>
          err instanceof type ? handler(err) : PromiseReject(err)
        )
      : this.then(null, (err) =>
          err && err.name === type ? handler(err) : PromiseReject(err)
        );
  },
  finally: function (onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (err) => {
        onFinally();
        return PromiseReject(err);
      }
    );
  },
  stack: {
    get: function () {
      if (this._stack) return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null) this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    },
  },
  timeout: function (ms, msg) {
    return ms < Infinity
      ? new DexiePromise((resolve, reject) => {
          var handle = setTimeout(
            () => reject(new exceptions.Timeout(msg)),
            ms
          );
          this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
        })
      : this;
  },
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag)
  setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function () {
    var values = getArrayOf
      .apply(null, arguments)
      .map(onPossibleParallellAsync);
    return new DexiePromise(function (resolve, reject) {
      if (values.length === 0) resolve([]);
      var remaining = values.length;
      values.forEach((a, i) =>
        DexiePromise.resolve(a).then((x) => {
          values[i] = x;
          if (!--remaining) resolve(values);
        }, reject)
      );
    });
  },
  resolve: (value) => {
    if (value instanceof DexiePromise) return value;
    if (value && typeof value.then === "function")
      return new DexiePromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function () {
    var values = getArrayOf
      .apply(null, arguments)
      .map(onPossibleParallellAsync);
    return new DexiePromise((resolve, reject) => {
      values.map((value) => DexiePromise.resolve(value).then(resolve, reject));
    });
  },
  PSD: {
    get: () => PSD,
    set: (value) => (PSD = value),
  },
  totalEchoes: { get: () => totalEchoes },
  newPSD: newScope,
  usePSD: usePSD,
  scheduler: {
    get: () => asap,
    set: (value) => {
      asap = value;
    },
  },
  rejectionMapper: {
    get: () => rejectionMapper,
    set: (value) => {
      rejectionMapper = value;
    },
  },
  follow: (fn, zoneProps) => {
    return new DexiePromise((resolve, reject) => {
      return newScope(
        (resolve, reject) => {
          var psd = PSD;
          psd.unhandleds = [];
          psd.onunhandled = reject;
          psd.finalize = callBoth(function () {
            run_at_end_of_this_or_next_physical_tick(() => {
              this.unhandleds.length === 0
                ? resolve()
                : reject(this.unhandleds[0]);
            });
          }, psd.finalize);
          fn();
        },
        zoneProps,
        resolve,
        reject
      );
    });
  },
});
if (NativePromise) {
  if (NativePromise.allSettled)
    setProp(DexiePromise, "allSettled", function () {
      const possiblePromises = getArrayOf
        .apply(null, arguments)
        .map(onPossibleParallellAsync);
      return new DexiePromise((resolve) => {
        if (possiblePromises.length === 0) resolve([]);
        let remaining = possiblePromises.length;
        const results = new Array(remaining);
        possiblePromises.forEach((p, i) =>
          DexiePromise.resolve(p)
            .then(
              (value) => (results[i] = { status: "fulfilled", value }),
              (reason) => (results[i] = { status: "rejected", reason })
            )
            .then(() => --remaining || resolve(results))
        );
      });
    });
  if (NativePromise.any && typeof AggregateError !== "undefined")
    setProp(DexiePromise, "any", function () {
      const possiblePromises = getArrayOf
        .apply(null, arguments)
        .map(onPossibleParallellAsync);
      return new DexiePromise((resolve, reject) => {
        if (possiblePromises.length === 0) reject(new AggregateError([]));
        let remaining = possiblePromises.length;
        const failures = new Array(remaining);
        possiblePromises.forEach((p, i) =>
          DexiePromise.resolve(p).then(
            (value) => resolve(value),
            (failure) => {
              failures[i] = failure;
              if (!--remaining) reject(new AggregateError(failures));
            }
          )
        );
      });
    });
}
function executePromiseTask(promise, fn) {
  try {
    fn((value) => {
      if (promise._state !== null) return;
      if (value === promise)
        throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, (resolve, reject) => {
          value instanceof DexiePromise
            ? value._then(resolve, reject)
            : value.then(resolve, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick) endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null) return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug &&
    reason !== null &&
    typeof reason === "object" &&
    !reason._promise &&
    tryCatch(() => {
      var origProp = getPropertyDescriptor(reason, "stack");
      reason._promise = promise;
      setProp(reason, "stack", {
        get: () =>
          stack_being_generated
            ? origProp &&
              (origProp.get ? origProp.get.apply(reason) : origProp.value)
            : promise.stack,
      });
    });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick) endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i = 0, len = listeners.length; i < len; ++i) {
    propagateToListener(promise, listeners[i]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap(() => {
      if (--numScheduledCalls === 0) finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(
      promise._value
    );
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret,
      value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length) rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1) markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0) finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit) return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value,
      errorName,
      message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1) stacks.push(stack);
    if (promise._prev) getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks, i, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks = microtickQueue;
      microtickQueue = [];
      l = callbacks.length;
      for (i = 0; i < l; ++i) {
        var item = callbacks[i];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach((p) => {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i = finalizers.length;
  while (i) finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap(() => {
    if (--numScheduledCalls === 0) finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some((p) => p._value === promise._value))
    unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i = unhandledErrors.length;
  while (i)
    if (unhandledErrors[--i]._value === promise._value) {
      unhandledErrors.splice(i, 1);
      return;
    }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
  var psd = PSD;
  return function () {
    var wasRootExec = beginMicroTickScope(),
      outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec) endMicroTickScope();
    }
  };
}
const task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props, a1, a2) {
  var parent = PSD,
    psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise
    ? {
        Promise: DexiePromise,
        PromiseProp: {
          value: DexiePromise,
          configurable: true,
          writable: true,
        },
        all: DexiePromise.all,
        race: DexiePromise.race,
        allSettled: DexiePromise.allSettled,
        any: DexiePromise.any,
        resolve: DexiePromise.resolve,
        reject: DexiePromise.reject,
        nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
        gthen: getPatchedPromiseThen(globalEnv.gthen, psd),
      }
    : {};
  if (props) extend(psd, props);
  ++parent.ref;
  psd.finalize = function () {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0) psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id) task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits) return false;
  if (--task.awaits === 0) task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (
    task.echoes &&
    possiblePromise &&
    possiblePromise.constructor === NativePromise
  ) {
    incrementExpectedAwaits();
    return possiblePromise.then(
      (x) => {
        decrementExpectedAwaits();
        return x;
      },
      (e) => {
        decrementExpectedAwaits();
        return rejection(e);
      }
    );
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (
    bEnteringZone
      ? task.echoes && (!zoneEchoes++ || targetZone !== PSD)
      : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)
  ) {
    enqueueNativeMicroTask(
      bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho
    );
  }
  if (targetZone === PSD) return;
  PSD = targetZone;
  if (currentZone === globalPSD) globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise.all = targetEnv.all;
      GlobalPromise.race = targetEnv.race;
      GlobalPromise.resolve = targetEnv.resolve;
      GlobalPromise.reject = targetEnv.reject;
      if (targetEnv.allSettled) GlobalPromise.allSettled = targetEnv.allSettled;
      if (targetEnv.any) GlobalPromise.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise
    ? {
        Promise: GlobalPromise,
        PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
        all: GlobalPromise.all,
        race: GlobalPromise.race,
        allSettled: GlobalPromise.allSettled,
        any: GlobalPromise.any,
        resolve: GlobalPromise.resolve,
        reject: GlobalPromise.reject,
        nthen: nativePromiseProto.then,
        gthen: GlobalPromise.prototype.then,
      }
    : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function"
    ? fn
    : function () {
        var outerZone = PSD;
        if (possibleAwait) incrementExpectedAwaits();
        switchToZone(zone, true);
        try {
          return fn.apply(this, arguments);
        } finally {
          switchToZone(outerZone, false);
          if (cleanup) enqueueNativeMicroTask(decrementExpectedAwaits);
        }
      };
}
function getPatchedPromiseThen(origThen, zone) {
  return function (onResolved, onRejected) {
    return origThen.call(
      this,
      nativeAwaitCompatibleWrap(onResolved, zone),
      nativeAwaitCompatibleWrap(onRejected, zone)
    );
  };
}
const UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {}
  if (rv !== false)
    try {
      var event,
        eventData = { promise: promise, reason: err };
      if (_global.document && document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(UNHANDLEDREJECTION, true, true);
        extend(event, eventData);
      } else if (_global.CustomEvent) {
        event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
        extend(event, eventData);
      }
      if (event && _global.dispatchEvent) {
        dispatchEvent(event);
        if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
          try {
            _global.onunhandledrejection(event);
          } catch (_) {}
      }
      if (debug && event && !event.defaultPrevented) {
        console.warn(`Unhandled rejection: ${err.stack || err}`);
      }
    } catch (e) {}
}
var rejection = DexiePromise.reject;

function tempTransaction(db, mode, storeNames, fn) {
  if (!db.idbdb || (!db._state.openComplete && !PSD.letThrough && !db._vip)) {
    if (db._state.openComplete) {
      return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
    }
    if (!db._state.isBeingOpened) {
      if (!db._options.autoOpen)
        return rejection(new exceptions.DatabaseClosed());
      db.open().catch(nop);
    }
    return db._state.dbReadyPromise.then(() =>
      tempTransaction(db, mode, storeNames, fn)
    );
  } else {
    var trans = db._createTransaction(mode, storeNames, db._dbSchema);
    try {
      trans.create();
      db._state.PR1398_maxLoop = 3;
    } catch (ex) {
      if (
        ex.name === errnames.InvalidState &&
        db.isOpen() &&
        --db._state.PR1398_maxLoop > 0
      ) {
        console.warn("Dexie: Need to reopen db");
        db._close();
        return db.open().then(() => tempTransaction(db, mode, storeNames, fn));
      }
      return rejection(ex);
    }
    return trans
      ._promise(mode, (resolve, reject) => {
        return newScope(() => {
          PSD.trans = trans;
          return fn(resolve, reject, trans);
        });
      })
      .then((result) => {
        return trans._completion.then(() => result);
      });
  }
}

const DEXIE_VERSION = "3.2.3";
const maxString = String.fromCharCode(65535);
const minKey = -Infinity;
const INVALID_KEY_ARGUMENT =
  "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
const STRING_EXPECTED = "String expected.";
const connections = [];
const isIEOrEdge =
  typeof navigator !== "undefined" &&
  /(MSIE|Trident|Edge)/.test(navigator.userAgent);
const hasIEDeleteObjectStoreBug = isIEOrEdge;
const hangsOnDeleteLargeKeyRange = isIEOrEdge;
const dexieStackFrameFilter = (frame) =>
  !/(dexie\.js|dexie\.min\.js)/.test(frame);
const DBNAMES_DB = "__dbnames";
const READONLY = "readonly";
const READWRITE = "readwrite";

function combine(filter1, filter2) {
  return filter1
    ? filter2
      ? function () {
          return (
            filter1.apply(this, arguments) && filter2.apply(this, arguments)
          );
        }
      : filter1
    : filter2;
}

const AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  upper: [[]],
  upperOpen: false,
};

function workaroundForUndefinedPrimKey(keyPath) {
  return typeof keyPath === "string" && !/\./.test(keyPath)
    ? (obj) => {
        if (obj[keyPath] === undefined && keyPath in obj) {
          obj = deepClone(obj);
          delete obj[keyPath];
        }
        return obj;
      }
    : (obj) => obj;
}

class Table {
  _trans(mode, fn, writeLocked) {
    const trans = this._tx || PSD.trans;
    const tableName = this.name;
    function checkTableInTransaction(resolve, reject, trans) {
      if (!trans.schema[tableName])
        throw new exceptions.NotFound(
          "Table " + tableName + " not part of transaction"
        );
      return fn(trans.idbtrans, trans);
    }
    const wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db
        ? trans === PSD.trans
          ? trans._promise(mode, checkTableInTransaction, writeLocked)
          : newScope(
              () => trans._promise(mode, checkTableInTransaction, writeLocked),
              { trans: trans, transless: PSD.transless || PSD }
            )
        : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec) endMicroTickScope();
    }
  }
  get(keyOrCrit, cb) {
    if (keyOrCrit && keyOrCrit.constructor === Object)
      return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", (trans) => {
      return this.core
        .get({ trans, key: keyOrCrit })
        .then((res) => this.hook.reading.fire(res));
    }).then(cb);
  }
  where(indexOrCrit) {
    if (typeof indexOrCrit === "string")
      return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit))
      return new this.db.WhereClause(this, `[${indexOrCrit.join("+")}]`);
    const keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1)
      return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    const compoundIndex = this.schema.indexes
      .concat(this.schema.primKey)
      .filter(
        (ix) =>
          ix.compound &&
          keyPaths.every((keyPath) => ix.keyPath.indexOf(keyPath) >= 0) &&
          ix.keyPath.every((keyPath) => keyPaths.indexOf(keyPath) >= 0)
      )[0];
    if (compoundIndex && this.db._maxKey !== maxString)
      return this.where(compoundIndex.name).equals(
        compoundIndex.keyPath.map((kp) => indexOrCrit[kp])
      );
    if (!compoundIndex && debug)
      console.warn(
        `The query ${JSON.stringify(indexOrCrit)} on ${
          this.name
        } would benefit of a ` + `compound index [${keyPaths.join("+")}]`
      );
    const { idxByName } = this.schema;
    const idb = this.db._deps.indexedDB;
    function equals(a, b) {
      try {
        return idb.cmp(a, b) === 0;
      } catch (e) {
        return false;
      }
    }
    const [idx, filterFunction] = keyPaths.reduce(
      ([prevIndex, prevFilterFn], keyPath) => {
        const index = idxByName[keyPath];
        const value = indexOrCrit[keyPath];
        return [
          prevIndex || index,
          prevIndex || !index
            ? combine(
                prevFilterFn,
                index && index.multi
                  ? (x) => {
                      const prop = getByKeyPath(x, keyPath);
                      return (
                        isArray(prop) &&
                        prop.some((item) => equals(value, item))
                      );
                    }
                  : (x) => equals(value, getByKeyPath(x, keyPath))
              )
            : prevFilterFn,
        ];
      },
      [null, null]
    );
    return idx
      ? this.where(idx.name)
          .equals(indexOrCrit[idx.keyPath])
          .filter(filterFunction)
      : compoundIndex
      ? this.filter(filterFunction)
      : this.where(keyPaths).equals("");
  }
  filter(filterFunction) {
    return this.toCollection().and(filterFunction);
  }
  count(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  }
  offset(offset) {
    return this.toCollection().offset(offset);
  }
  limit(numRows) {
    return this.toCollection().limit(numRows);
  }
  each(callback) {
    return this.toCollection().each(callback);
  }
  toArray(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  }
  toCollection() {
    return new this.db.Collection(new this.db.WhereClause(this));
  }
  orderBy(index) {
    return new this.db.Collection(
      new this.db.WhereClause(
        this,
        isArray(index) ? `[${index.join("+")}]` : index
      )
    );
  }
  reverse() {
    return this.toCollection().reverse();
  }
  mapToClass(constructor) {
    this.schema.mappedClass = constructor;
    const readHook = (obj) => {
      if (!obj) return obj;
      const res = Object.create(constructor.prototype);
      for (var m in obj)
        if (hasOwn(obj, m))
          try {
            res[m] = obj[m];
          } catch (_) {}
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  }
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  }
  add(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({
        trans,
        type: "add",
        keys: key != null ? [key] : null,
        values: [objToAdd],
      });
    })
      .then((res) =>
        res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult
      )
      .then((lastResult) => {
        if (keyPath) {
          try {
            setByKeyPath(obj, keyPath, lastResult);
          } catch (_) {}
        }
        return lastResult;
      });
  }
  update(keyOrObject, modifications) {
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === undefined)
        return rejection(
          new exceptions.InvalidArgument(
            "Given object does not contain its primary key"
          )
        );
      try {
        if (typeof modifications !== "function") {
          keys(modifications).forEach((keyPath) => {
            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
          });
        } else {
          modifications(keyOrObject, { value: keyOrObject, primKey: key });
        }
      } catch (_a) {}
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  }
  put(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) =>
      this.core.mutate({
        trans,
        type: "put",
        values: [objToAdd],
        keys: key != null ? [key] : null,
      })
    )
      .then((res) =>
        res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult
      )
      .then((lastResult) => {
        if (keyPath) {
          try {
            setByKeyPath(obj, keyPath, lastResult);
          } catch (_) {}
        }
        return lastResult;
      });
  }
  delete(key) {
    return this._trans("readwrite", (trans) =>
      this.core.mutate({ trans, type: "delete", keys: [key] })
    ).then((res) =>
      res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined
    );
  }
  clear() {
    return this._trans("readwrite", (trans) =>
      this.core.mutate({ trans, type: "deleteRange", range: AnyRange })
    ).then((res) =>
      res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined
    );
  }
  bulkGet(keys) {
    return this._trans("readonly", (trans) => {
      return this.core
        .getMany({
          keys,
          trans,
        })
        .then((result) => result.map((res) => this.hook.reading.fire(res)));
    });
  }
  bulkAdd(objects, keysOrOptions, options) {
    const keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
    options = options || (keys ? undefined : keysOrOptions);
    const wantResults = options ? options.allKeys : undefined;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys)
        throw new exceptions.InvalidArgument(
          "bulkAdd(): keys argument invalid on tables with inbound keys"
        );
      if (keys && keys.length !== objects.length)
        throw new exceptions.InvalidArgument(
          "Arguments objects and keys must have the same length"
        );
      const numObjects = objects.length;
      let objectsToAdd =
        keyPath && auto
          ? objects.map(workaroundForUndefinedPrimKey(keyPath))
          : objects;
      return this.core
        .mutate({
          trans,
          type: "add",
          keys: keys,
          values: objectsToAdd,
          wantResults,
        })
        .then(({ numFailures, results, lastResult, failures }) => {
          const result = wantResults ? results : lastResult;
          if (numFailures === 0) return result;
          throw new BulkError(
            `${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`,
            failures
          );
        });
    });
  }
  bulkPut(objects, keysOrOptions, options) {
    const keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
    options = options || (keys ? undefined : keysOrOptions);
    const wantResults = options ? options.allKeys : undefined;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys)
        throw new exceptions.InvalidArgument(
          "bulkPut(): keys argument invalid on tables with inbound keys"
        );
      if (keys && keys.length !== objects.length)
        throw new exceptions.InvalidArgument(
          "Arguments objects and keys must have the same length"
        );
      const numObjects = objects.length;
      let objectsToPut =
        keyPath && auto
          ? objects.map(workaroundForUndefinedPrimKey(keyPath))
          : objects;
      return this.core
        .mutate({
          trans,
          type: "put",
          keys: keys,
          values: objectsToPut,
          wantResults,
        })
        .then(({ numFailures, results, lastResult, failures }) => {
          const result = wantResults ? results : lastResult;
          if (numFailures === 0) return result;
          throw new BulkError(
            `${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`,
            failures
          );
        });
    });
  }
  bulkDelete(keys) {
    const numKeys = keys.length;
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({ trans, type: "delete", keys: keys });
    }).then(({ numFailures, lastResult, failures }) => {
      if (numFailures === 0) return lastResult;
      throw new BulkError(
        `${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`,
        failures
      );
    });
  }
}

function Events(ctx) {
  var evs = {};
  var rv = function (eventName, subscriber) {
    if (subscriber) {
      var i = arguments.length,
        args = new Array(i - 1);
      while (--i) args[i - 1] = arguments[i];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add;
  for (var i = 1, l = arguments.length; i < l; ++i) {
    add(arguments[i]);
  }
  return rv;
  function add(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object") return addConfiguredEvents(eventName);
    if (!chainFunction) chainFunction = reverseStoppableEventChain;
    if (!defaultFunction) defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function (cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function (cb) {
        context.subscribers = context.subscribers.filter(function (fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(
          chainFunction,
          defaultFunction
        );
      },
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function (eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add(eventName, mirror, function fire() {
          var i = arguments.length,
            args = new Array(i);
          while (i--) args[i] = arguments[i];
          context.subscribers.forEach(function (fn) {
            asap$1(function fireEvent() {
              fn.apply(null, args);
            });
          });
        });
      } else throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}

function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({ prototype });
  return constructor;
}

function createTableConstructor(db) {
  return makeClassConstructor(
    Table.prototype,
    function Table(name, tableSchema, trans) {
      this.db = db;
      this._tx = trans;
      this.name = name;
      this.schema = tableSchema;
      this.hook = db._allTables[name]
        ? db._allTables[name].hook
        : Events(null, {
            creating: [hookCreatingChain, nop],
            reading: [pureFunctionChain, mirror],
            updating: [hookUpdatingChain, nop],
            deleting: [hookDeletingChain, nop],
          });
    }
  );
}

function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return (
    !(ctx.filter || ctx.algorithm || ctx.or) &&
    (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter)
  );
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey) return coreSchema.primaryKey;
  const index = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index)
    throw new exceptions.Schema(
      "KeyPath " +
        ctx.index +
        " on object store " +
        coreSchema.name +
        " is not indexed"
    );
  return index;
}
function openCursor(ctx, coreTable, trans) {
  const index = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index,
      range: ctx.range,
    },
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  const filter = ctx.replayFilter
    ? combine(ctx.filter, ctx.replayFilter())
    : ctx.filter;
  if (!ctx.or) {
    return iterate(
      openCursor(ctx, coreTable, coreTrans),
      combine(ctx.algorithm, filter),
      fn,
      !ctx.keysOnly && ctx.valueMapper
    );
  } else {
    const set = {};
    const union = (item, cursor, advance) => {
      if (
        !filter ||
        filter(
          cursor,
          advance,
          (result) => cursor.stop(result),
          (err) => cursor.fail(err)
        )
      ) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]")
          key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set, key)) {
          set[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([
      ctx.or._iterate(union, coreTrans),
      iterate(
        openCursor(ctx, coreTable, coreTrans),
        ctx.algorithm,
        union,
        !ctx.keysOnly && ctx.valueMapper
      ),
    ]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
  var wrappedFn = wrap(mappedFn);
  return cursorPromise.then((cursor) => {
    if (cursor) {
      return cursor.start(() => {
        var c = () => cursor.continue();
        if (
          !filter ||
          filter(
            cursor,
            (advancer) => (c = advancer),
            (val) => {
              cursor.stop(val);
              c = nop;
            },
            (e) => {
              cursor.fail(e);
              c = nop;
            }
          )
        )
          wrappedFn(cursor.value, cursor, (advancer) => (c = advancer));
        c();
      });
    }
  });
}

function cmp(a, b) {
  try {
    const ta = type(a);
    const tb = type(b);
    if (ta !== tb) {
      if (ta === "Array") return 1;
      if (tb === "Array") return -1;
      if (ta === "binary") return 1;
      if (tb === "binary") return -1;
      if (ta === "string") return 1;
      if (tb === "string") return -1;
      if (ta === "Date") return 1;
      if (tb !== "Date") return NaN;
      return -1;
    }
    switch (ta) {
      case "number":
      case "Date":
      case "string":
        return a > b ? 1 : a < b ? -1 : 0;
      case "binary": {
        return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
      }
      case "Array":
        return compareArrays(a, b);
    }
  } catch (_a) {}
  return NaN;
}
function compareArrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    const res = cmp(a[i], b[i]);
    if (res !== 0) return res;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
  const t = typeof x;
  if (t !== "object") return t;
  if (ArrayBuffer.isView(x)) return "binary";
  const tsTag = toStringTag(x);
  return tsTag === "ArrayBuffer" ? "binary" : tsTag;
}
function getUint8Array(a) {
  if (a instanceof Uint8Array) return a;
  if (ArrayBuffer.isView(a))
    return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  return new Uint8Array(a);
}

let Collection$1 = class Collection {
  _read(fn, cb) {
    var ctx = this._ctx;
    return ctx.error
      ? ctx.table._trans(null, rejection.bind(null, ctx.error))
      : ctx.table._trans("readonly", fn).then(cb);
  }
  _write(fn) {
    var ctx = this._ctx;
    return ctx.error
      ? ctx.table._trans(null, rejection.bind(null, ctx.error))
      : ctx.table._trans("readwrite", fn, "locked");
  }
  _addAlgorithm(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  }
  _iterate(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  }
  clone(props) {
    var rv = Object.create(this.constructor.prototype),
      ctx = Object.create(this._ctx);
    if (props) extend(ctx, props);
    rv._ctx = ctx;
    return rv;
  }
  raw() {
    this._ctx.valueMapper = null;
    return this;
  }
  each(fn) {
    var ctx = this._ctx;
    return this._read((trans) => iter(ctx, fn, trans, ctx.table.core));
  }
  count(cb) {
    return this._read((trans) => {
      const ctx = this._ctx;
      const coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable
          .count({
            trans,
            query: {
              index: getIndexOrStore(ctx, coreTable.schema),
              range: ctx.range,
            },
          })
          .then((count) => Math.min(count, ctx.limit));
      } else {
        var count = 0;
        return iter(
          ctx,
          () => {
            ++count;
            return false;
          },
          trans,
          coreTable
        ).then(() => count);
      }
    }).then(cb);
  }
  sortBy(keyPath, cb) {
    const parts = keyPath.split(".").reverse(),
      lastPart = parts[0],
      lastIndex = parts.length - 1;
    function getval(obj, i) {
      if (i) return getval(obj[parts[i]], i - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b) {
      var aVal = getval(a, lastIndex),
        bVal = getval(b, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function (a) {
      return a.sort(sorter);
    }).then(cb);
  }
  toArray(cb) {
    return this._read((trans) => {
      var ctx = this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        const { valueMapper } = ctx;
        const index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core
          .query({
            trans,
            limit: ctx.limit,
            values: true,
            query: {
              index,
              range: ctx.range,
            },
          })
          .then(({ result }) =>
            valueMapper ? result.map(valueMapper) : result
          );
      } else {
        const a = [];
        return iter(ctx, (item) => a.push(item), trans, ctx.table.core).then(
          () => a
        );
      }
    }, cb);
  }
  offset(offset) {
    var ctx = this._ctx;
    if (offset <= 0) return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return (cursor, advance) => {
          if (offsetLeft === 0) return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(() => {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return () => --offsetLeft < 0;
      });
    }
    return this;
  }
  limit(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(
      this._ctx,
      () => {
        var rowsLeft = numRows;
        return function (cursor, advance, resolve) {
          if (--rowsLeft <= 0) advance(resolve);
          return rowsLeft >= 0;
        };
      },
      true
    );
    return this;
  }
  until(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function (cursor, advance, resolve) {
      if (filterFunction(cursor.value)) {
        advance(resolve);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  }
  first(cb) {
    return this.limit(1)
      .toArray(function (a) {
        return a[0];
      })
      .then(cb);
  }
  last(cb) {
    return this.reverse().first(cb);
  }
  filter(filterFunction) {
    addFilter(this._ctx, function (cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  }
  and(filter) {
    return this.filter(filter);
  }
  or(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  }
  reverse() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange) this._ondirectionchange(this._ctx.dir);
    return this;
  }
  desc() {
    return this.reverse();
  }
  eachKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function (val, cursor) {
      cb(cursor.key, cursor);
    });
  }
  eachUniqueKey(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  }
  eachPrimaryKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function (val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  }
  keys(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function (item, cursor) {
      a.push(cursor.key);
    })
      .then(function () {
        return a;
      })
      .then(cb);
  }
  primaryKeys(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read((trans) => {
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index,
            range: ctx.range,
          },
        });
      })
        .then(({ result }) => result)
        .then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function (item, cursor) {
      a.push(cursor.primaryKey);
    })
      .then(function () {
        return a;
      })
      .then(cb);
  }
  uniqueKeys(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  }
  firstKey(cb) {
    return this.limit(1)
      .keys(function (a) {
        return a[0];
      })
      .then(cb);
  }
  lastKey(cb) {
    return this.reverse().firstKey(cb);
  }
  distinct() {
    var ctx = this._ctx,
      idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi) return this;
    var set = {};
    addFilter(this._ctx, function (cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  }
  modify(changes) {
    var ctx = this._ctx;
    return this._write((trans) => {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function (item) {
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i],
              val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      const coreTable = ctx.table.core;
      const { outbound, extractKey } = coreTable.schema.primaryKey;
      const limit = this.db._options.modifyChunkSize || 200;
      const totalFailures = [];
      let successCount = 0;
      const failedKeys = [];
      const applyMutateResult = (expectedCount, res) => {
        const { failures, numFailures } = res;
        successCount += expectedCount - numFailures;
        for (let pos of keys(failures)) {
          totalFailures.push(failures[pos]);
        }
      };
      return this.clone()
        .primaryKeys()
        .then((keys) => {
          const nextChunk = (offset) => {
            const count = Math.min(limit, keys.length - offset);
            return coreTable
              .getMany({
                trans,
                keys: keys.slice(offset, offset + count),
                cache: "immutable",
              })
              .then((values) => {
                const addValues = [];
                const putValues = [];
                const putKeys = outbound ? [] : null;
                const deleteKeys = [];
                for (let i = 0; i < count; ++i) {
                  const origValue = values[i];
                  const ctx = {
                    value: deepClone(origValue),
                    primKey: keys[offset + i],
                  };
                  if (modifyer.call(ctx, ctx.value, ctx) !== false) {
                    if (ctx.value == null) {
                      deleteKeys.push(keys[offset + i]);
                    } else if (
                      !outbound &&
                      cmp(extractKey(origValue), extractKey(ctx.value)) !== 0
                    ) {
                      deleteKeys.push(keys[offset + i]);
                      addValues.push(ctx.value);
                    } else {
                      putValues.push(ctx.value);
                      if (outbound) putKeys.push(keys[offset + i]);
                    }
                  }
                }
                const criteria = isPlainKeyRange(ctx) &&
                  ctx.limit === Infinity &&
                  (typeof changes !== "function" ||
                    changes === deleteCallback) && {
                    index: ctx.index,
                    range: ctx.range,
                  };
                return Promise.resolve(
                  addValues.length > 0 &&
                    coreTable
                      .mutate({ trans, type: "add", values: addValues })
                      .then((res) => {
                        for (let pos in res.failures) {
                          deleteKeys.splice(parseInt(pos), 1);
                        }
                        applyMutateResult(addValues.length, res);
                      })
                )
                  .then(
                    () =>
                      (putValues.length > 0 ||
                        (criteria && typeof changes === "object")) &&
                      coreTable
                        .mutate({
                          trans,
                          type: "put",
                          keys: putKeys,
                          values: putValues,
                          criteria,
                          changeSpec: typeof changes !== "function" && changes,
                        })
                        .then((res) => applyMutateResult(putValues.length, res))
                  )
                  .then(
                    () =>
                      (deleteKeys.length > 0 ||
                        (criteria && changes === deleteCallback)) &&
                      coreTable
                        .mutate({
                          trans,
                          type: "delete",
                          keys: deleteKeys,
                          criteria,
                        })
                        .then((res) =>
                          applyMutateResult(deleteKeys.length, res)
                        )
                  )
                  .then(() => {
                    return (
                      keys.length > offset + count && nextChunk(offset + limit)
                    );
                  });
              });
          };
          return nextChunk(0).then(() => {
            if (totalFailures.length > 0)
              throw new ModifyError(
                "Error modifying one or more objects",
                totalFailures,
                successCount,
                failedKeys
              );
            return keys.length;
          });
        });
    });
  }
  delete() {
    var ctx = this._ctx,
      range = ctx.range;
    if (
      isPlainKeyRange(ctx) &&
      ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3)
    ) {
      return this._write((trans) => {
        const { primaryKey } = ctx.table.core.schema;
        const coreRange = range;
        return ctx.table.core
          .count({ trans, query: { index: primaryKey, range: coreRange } })
          .then((count) => {
            return ctx.table.core
              .mutate({ trans, type: "deleteRange", range: coreRange })
              .then(({ failures, lastResult, results, numFailures }) => {
                if (numFailures)
                  throw new ModifyError(
                    "Could not delete some values",
                    Object.keys(failures).map((pos) => failures[pos]),
                    count - numFailures
                  );
                return count - numFailures;
              });
          });
      });
    }
    return this.modify(deleteCallback);
  }
};
const deleteCallback = (value, ctx) => (ctx.value = null);

function createCollectionConstructor(db) {
  return makeClassConstructor(
    Collection$1.prototype,
    function Collection(whereClause, keyRangeGenerator) {
      this.db = db;
      let keyRange = AnyRange,
        error = null;
      if (keyRangeGenerator)
        try {
          keyRange = keyRangeGenerator();
        } catch (ex) {
          error = ex;
        }
      const whereCtx = whereClause._ctx;
      const table = whereCtx.table;
      const readingHook = table.hook.reading.fire;
      this._ctx = {
        table: table,
        index: whereCtx.index,
        isPrimKey:
          !whereCtx.index ||
          (table.schema.primKey.keyPath &&
            whereCtx.index === table.schema.primKey.name),
        range: keyRange,
        keysOnly: false,
        dir: "next",
        unique: "",
        algorithm: null,
        filter: null,
        replayFilter: null,
        justLimit: true,
        isMatch: null,
        offset: 0,
        limit: Infinity,
        error: error,
        or: whereCtx.or,
        valueMapper: readingHook !== mirror ? readingHook : null,
      };
    }
  );
}

function simpleCompare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
  return a > b ? -1 : a === b ? 0 : 1;
}

function fail(collectionOrWhereClause, err, T) {
  var collection =
    collectionOrWhereClause instanceof WhereClause
      ? new collectionOrWhereClause.Collection(collectionOrWhereClause)
      : collectionOrWhereClause;
  collection._ctx.error = T ? new T(err) : new TypeError(err);
  return collection;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? (s) => s.toUpperCase() : (s) => s.toLowerCase();
}
function lowerFactory(dir) {
  return dir === "next" ? (s) => s.toLowerCase() : (s) => s.toUpperCase();
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i = 0; i < length; ++i) {
    var lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      if (cmp(key[i], upperNeedle[i]) < 0)
        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      if (cmp(key[i], lowerNeedle[i]) < 0)
        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      if (llp >= 0)
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp(key[i], lwrKeyChar) < 0) llp = i;
  }
  if (length < lowerNeedle.length && dir === "next")
    return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev")
    return key.substr(0, upperNeedle.length);
  return llp < 0
    ? null
    : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper,
    lower,
    compare,
    upperNeedles,
    lowerNeedles,
    direction,
    nextKeySuffix,
    needlesLen = needles.length;
  if (!needles.every((s) => typeof s === "string")) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles
      .map(function (needle) {
        return { lower: lower(needle), upper: upper(needle) };
      })
      .sort(function (a, b) {
        return compare(a.lower, b.lower);
      });
    upperNeedles = needleBounds.map(function (nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function (nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, () =>
    createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix)
  );
  c._ondirectionchange = function (direction) {
    initDirection(direction);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function (cursor, advance, resolve) {
    var key = cursor.key;
    if (typeof key !== "string") return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
        var casing = nextCasing(
          key,
          lowerKey,
          upperNeedles[i],
          lowerNeedles[i],
          compare,
          direction
        );
        if (casing === null && lowestPossibleCasing === null)
          firstPossibleNeedle = i + 1;
        else if (
          lowestPossibleCasing === null ||
          compare(lowestPossibleCasing, casing) > 0
        ) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function () {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen,
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value,
  };
}

class WhereClause {
  get Collection() {
    return this._ctx.table.db.Collection;
  }
  between(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (
        this._cmp(lower, upper) > 0 ||
        (this._cmp(lower, upper) === 0 &&
          (includeLower || includeUpper) &&
          !(includeLower && includeUpper))
      )
        return emptyCollection(this);
      return new this.Collection(this, () =>
        createRange(lower, upper, !includeLower, !includeUpper)
      );
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  }
  equals(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => rangeEqual(value));
  }
  above(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, undefined, true));
  }
  aboveOrEqual(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () =>
      createRange(value, undefined, false)
    );
  }
  below(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () =>
      createRange(undefined, value, false, true)
    );
  }
  belowOrEqual(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(undefined, value));
  }
  startsWith(str) {
    if (typeof str !== "string") return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  }
  startsWithIgnoreCase(str) {
    if (str === "") return this.startsWith(str);
    return addIgnoreCaseAlgorithm(
      this,
      (x, a) => x.indexOf(a[0]) === 0,
      [str],
      maxString
    );
  }
  equalsIgnoreCase(str) {
    return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
  }
  anyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0) return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
  }
  startsWithAnyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0) return emptyCollection(this);
    return addIgnoreCaseAlgorithm(
      this,
      (x, a) => a.some((n) => x.indexOf(n) === 0),
      set,
      maxString
    );
  }
  anyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    let compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0) return emptyCollection(this);
    const c = new this.Collection(this, () =>
      createRange(set[0], set[set.length - 1])
    );
    c._ondirectionchange = (direction) => {
      compare = direction === "next" ? this._ascending : this._descending;
      set.sort(compare);
    };
    let i = 0;
    c._addAlgorithm((cursor, advance, resolve) => {
      const key = cursor.key;
      while (compare(key, set[i]) > 0) {
        ++i;
        if (i === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (compare(key, set[i]) === 0) {
        return true;
      } else {
        advance(() => {
          cursor.continue(set[i]);
        });
        return false;
      }
    });
    return c;
  }
  notEqual(value) {
    return this.inAnyRange(
      [
        [minKey, value],
        [value, this.db._maxKey],
      ],
      { includeLowers: false, includeUppers: false }
    );
  }
  noneOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0) return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    const ranges = set.reduce(
      (res, val) =>
        res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]],
      null
    );
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, {
      includeLowers: false,
      includeUppers: false,
    });
  }
  inAnyRange(ranges, options) {
    const cmp = this._cmp,
      ascending = this._ascending,
      descending = this._descending,
      min = this._min,
      max = this._max;
    if (ranges.length === 0) return emptyCollection(this);
    if (
      !ranges.every(
        (range) =>
          range[0] !== undefined &&
          range[1] !== undefined &&
          ascending(range[0], range[1]) <= 0
      )
    ) {
      return fail(
        this,
        "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",
        exceptions.InvalidArgument
      );
    }
    const includeLowers = !options || options.includeLowers !== false;
    const includeUppers = options && options.includeUppers === true;
    function addRange(ranges, newRange) {
      let i = 0,
        l = ranges.length;
      for (; i < l; ++i) {
        const range = ranges[i];
        if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i === l) ranges.push(newRange);
      return ranges;
    }
    let sortDirection = ascending;
    function rangeSorter(a, b) {
      return sortDirection(a[0], b[0]);
    }
    let set;
    try {
      set = ranges.reduce(addRange, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    let rangePos = 0;
    const keyIsBeyondCurrentEntry = includeUppers
      ? (key) => ascending(key, set[rangePos][1]) > 0
      : (key) => ascending(key, set[rangePos][1]) >= 0;
    const keyIsBeforeCurrentEntry = includeLowers
      ? (key) => descending(key, set[rangePos][0]) > 0
      : (key) => descending(key, set[rangePos][0]) >= 0;
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    let checkKey = keyIsBeyondCurrentEntry;
    const c = new this.Collection(this, () =>
      createRange(
        set[0][0],
        set[set.length - 1][1],
        !includeLowers,
        !includeUppers
      )
    );
    c._ondirectionchange = (direction) => {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm((cursor, advance, resolve) => {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (
        this._cmp(key, set[rangePos][1]) === 0 ||
        this._cmp(key, set[rangePos][0]) === 0
      ) {
        return false;
      } else {
        advance(() => {
          if (sortDirection === ascending) cursor.continue(set[rangePos][0]);
          else cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  }
  startsWithAnyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every((s) => typeof s === "string")) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0) return emptyCollection(this);
    return this.inAnyRange(set.map((str) => [str, str + maxString]));
  }
}

function createWhereClauseConstructor(db) {
  return makeClassConstructor(
    WhereClause.prototype,
    function WhereClause(table, index, orCollection) {
      this.db = db;
      this._ctx = {
        table: table,
        index: index === ":id" ? null : index,
        or: orCollection,
      };
      const indexedDB = db._deps.indexedDB;
      if (!indexedDB) throw new exceptions.MissingAPI();
      this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
      this._descending = (a, b) => indexedDB.cmp(b, a);
      this._max = (a, b) => (indexedDB.cmp(a, b) > 0 ? a : b);
      this._min = (a, b) => (indexedDB.cmp(a, b) < 0 ? a : b);
      this._IDBKeyRange = db._deps.IDBKeyRange;
    }
  );
}

function eventRejectHandler(reject) {
  return wrap(function (event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation) event.stopPropagation();
  if (event.preventDefault) event.preventDefault();
}

const DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
const STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
const globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);

class Transaction {
  _lock() {
    assert(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global) PSD.lockOwnerFor = this;
    return this;
  }
  _unlock() {
    assert(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global) PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {}
      }
    }
    return this;
  }
  _locked() {
    return this._reculock && PSD.lockOwnerFor !== this;
  }
  create(idbtrans) {
    if (!this.mode) return this;
    const idbdb = this.db.idbdb;
    const dbOpenError = this.db._state.dbOpenError;
    assert(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active) throw new exceptions.TransactionInactive();
    assert(this._completion._state === null);
    idbtrans = this.idbtrans =
      idbtrans ||
      (this.db.core
        ? this.db.core.transaction(this.storeNames, this.mode, {
            durability: this.chromeTransactionDurability,
          })
        : idbdb.transaction(this.storeNames, this.mode, {
            durability: this.chromeTransactionDurability,
          }));
    idbtrans.onerror = wrap((ev) => {
      preventDefault(ev);
      this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap((ev) => {
      preventDefault(ev);
      this.active && this._reject(new exceptions.Abort(idbtrans.error));
      this.active = false;
      this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap(() => {
      this.active = false;
      this._resolve();
      if ("mutatedParts" in idbtrans) {
        globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
      }
    });
    return this;
  }
  _promise(mode, fn, bWriteLock) {
    if (mode === "readwrite" && this.mode !== "readwrite")
      return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active) return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise((resolve, reject) => {
        this._blockedFuncs.push([
          () => {
            this._promise(mode, fn, bWriteLock).then(resolve, reject);
          },
          PSD,
        ]);
      });
    } else if (bWriteLock) {
      return newScope(() => {
        var p = new DexiePromise((resolve, reject) => {
          this._lock();
          const rv = fn(resolve, reject, this);
          if (rv && rv.then) rv.then(resolve, reject);
        });
        p.finally(() => this._unlock());
        p._lib = true;
        return p;
      });
    } else {
      var p = new DexiePromise((resolve, reject) => {
        var rv = fn(resolve, reject, this);
        if (rv && rv.then) rv.then(resolve, reject);
      });
      p._lib = true;
      return p;
    }
  }
  _root() {
    return this.parent ? this.parent._root() : this;
  }
  waitFor(promiseLike) {
    var root = this._root();
    const promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(() => promise);
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length) root._waitingQueue.shift()();
        if (root._waitingFor) store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise((resolve, reject) => {
      promise
        .then(
          (res) => root._waitingQueue.push(wrap(resolve.bind(null, res))),
          (err) => root._waitingQueue.push(wrap(reject.bind(null, err)))
        )
        .finally(() => {
          if (root._waitingFor === currentWaitPromise) {
            root._waitingFor = null;
          }
        });
    });
  }
  abort() {
    if (this.active) {
      this.active = false;
      if (this.idbtrans) this.idbtrans.abort();
      this._reject(new exceptions.Abort());
    }
  }
  table(tableName) {
    const memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName)) return memoizedTables[tableName];
    const tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound(
        "Table " + tableName + " not part of transaction"
      );
    }
    const transactionBoundTable = new this.db.Table(
      tableName,
      tableSchema,
      this
    );
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  }
}

function createTransactionConstructor(db) {
  return makeClassConstructor(
    Transaction.prototype,
    function Transaction(
      mode,
      storeNames,
      dbschema,
      chromeTransactionDurability,
      parent
    ) {
      this.db = db;
      this.mode = mode;
      this.storeNames = storeNames;
      this.schema = dbschema;
      this.chromeTransactionDurability = chromeTransactionDurability;
      this.idbtrans = null;
      this.on = Events(this, "complete", "error", "abort");
      this.parent = parent || null;
      this.active = true;
      this._reculock = 0;
      this._blockedFuncs = [];
      this._resolve = null;
      this._reject = null;
      this._waitingFor = null;
      this._waitingQueue = null;
      this._spinCount = 0;
      this._completion = new DexiePromise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
      this._completion.then(
        () => {
          this.active = false;
          this.on.complete.fire();
        },
        (e) => {
          var wasActive = this.active;
          this.active = false;
          this.on.error.fire(e);
          this.parent
            ? this.parent._reject(e)
            : wasActive && this.idbtrans && this.idbtrans.abort();
          return rejection(e);
        }
      );
    }
  );
}

function createIndexSpec(
  name,
  keyPath,
  unique,
  multi,
  auto,
  compound,
  isPrimKey
) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src:
      (unique && !isPrimKey ? "&" : "") +
      (multi ? "*" : "") +
      (auto ? "++" : "") +
      nameFromKeyPath(keyPath),
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string"
    ? keyPath
    : keyPath
    ? "[" + [].join.call(keyPath, "+") + "]"
    : "";
}

function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, (index) => [index.name, index]),
  };
}

function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
let getMaxKey = (IdbKeyRange) => {
  try {
    IdbKeyRange.only([[]]);
    getMaxKey = () => [[]];
    return [[]];
  } catch (e) {
    getMaxKey = () => maxString;
    return maxString;
  }
};

function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return () => undefined;
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}
function getSinglePathKeyExtractor(keyPath) {
  const split = keyPath.split(".");
  if (split.length === 1) {
    return (obj) => obj[keyPath];
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}

function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
let _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null
    ? ":id"
    : typeof keyPath === "string"
    ? keyPath
    : `[${keyPath.join("+")}]`;
}
function createDBCore(db, IdbKeyRange, tmpTrans) {
  function extractSchema(db, trans) {
    const tables = arrayify(db.objectStoreNames);
    return {
      schema: {
        name: db.name,
        tables: tables
          .map((table) => trans.objectStore(table))
          .map((store) => {
            const { keyPath, autoIncrement } = store;
            const compound = isArray(keyPath);
            const outbound = keyPath == null;
            const indexByKeyPath = {};
            const result = {
              name: store.name,
              primaryKey: {
                name: null,
                isPrimaryKey: true,
                outbound,
                compound,
                keyPath,
                autoIncrement,
                unique: true,
                extractKey: getKeyExtractor(keyPath),
              },
              indexes: arrayify(store.indexNames)
                .map((indexName) => store.index(indexName))
                .map((index) => {
                  const { name, unique, multiEntry, keyPath } = index;
                  const compound = isArray(keyPath);
                  const result = {
                    name,
                    compound,
                    keyPath,
                    unique,
                    multiEntry,
                    extractKey: getKeyExtractor(keyPath),
                  };
                  indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                  return result;
                }),
              getIndexByKeyPath: (keyPath) =>
                indexByKeyPath[getKeyPathAlias(keyPath)],
            };
            indexByKeyPath[":id"] = result.primaryKey;
            if (keyPath != null) {
              indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
            }
            return result;
          }),
      },
      hasGetAll:
        tables.length > 0 &&
        "getAll" in trans.objectStore(tables[0]) &&
        !(
          typeof navigator !== "undefined" &&
          /Safari/.test(navigator.userAgent) &&
          !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
          [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604
        ),
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3) return null;
    if (range.type === 4)
      throw new Error("Cannot convert never type to IDBKeyRange");
    const { lower, upper, lowerOpen, upperOpen } = range;
    const idbRange =
      lower === undefined
        ? upper === undefined
          ? null
          : IdbKeyRange.upperBound(upper, !!upperOpen)
        : upper === undefined
        ? IdbKeyRange.lowerBound(lower, !!lowerOpen)
        : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    const tableName = tableSchema.name;
    function mutate({ trans, type, keys, values, range }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const store = trans.objectStore(tableName);
        const outbound = store.keyPath == null;
        const isAddOrPut = type === "put" || type === "add";
        if (!isAddOrPut && type !== "delete" && type !== "deleteRange")
          throw new Error("Invalid operation type: " + type);
        const { length } = keys || values || { length: 1 };
        if (keys && values && keys.length !== values.length) {
          throw new Error(
            "Given keys array must have same length as given values array."
          );
        }
        if (length === 0)
          return resolve({
            numFailures: 0,
            failures: {},
            results: [],
            lastResult: undefined,
          });
        let req;
        const reqs = [];
        const failures = [];
        let numFailures = 0;
        const errorHandler = (event) => {
          ++numFailures;
          preventDefault(event);
        };
        if (type === "deleteRange") {
          if (range.type === 4)
            return resolve({
              numFailures,
              failures,
              results: [],
              lastResult: undefined,
            });
          if (range.type === 3) reqs.push((req = store.clear()));
          else reqs.push((req = store.delete(makeIDBKeyRange(range))));
        } else {
          const [args1, args2] = isAddOrPut
            ? outbound
              ? [values, keys]
              : [values, null]
            : [keys, null];
          if (isAddOrPut) {
            for (let i = 0; i < length; ++i) {
              reqs.push(
                (req =
                  args2 && args2[i] !== undefined
                    ? store[type](args1[i], args2[i])
                    : store[type](args1[i]))
              );
              req.onerror = errorHandler;
            }
          } else {
            for (let i = 0; i < length; ++i) {
              reqs.push((req = store[type](args1[i])));
              req.onerror = errorHandler;
            }
          }
        }
        const done = (event) => {
          const lastResult = event.target.result;
          reqs.forEach(
            (req, i) => req.error != null && (failures[i] = req.error)
          );
          resolve({
            numFailures,
            failures,
            results: type === "delete" ? keys : reqs.map((req) => req.result),
            lastResult,
          });
        };
        req.onerror = (event) => {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor({ trans, values, query, reverse, unique }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const { index, range } = query;
        const store = trans.objectStore(tableName);
        const source = index.isPrimaryKey ? store : store.index(index.name);
        const direction = reverse
          ? unique
            ? "prevunique"
            : "prev"
          : unique
          ? "nextunique"
          : "next";
        const req =
          values || !("openKeyCursor" in source)
            ? source.openCursor(makeIDBKeyRange(range), direction)
            : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap((ev) => {
          const cursor = req.result;
          if (!cursor) {
            resolve(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          const _cursorContinue = cursor.continue.bind(cursor);
          let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey)
            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          const _cursorAdvance = cursor.advance.bind(cursor);
          const doThrowCursorIsNotStarted = () => {
            throw new Error("Cursor not started");
          };
          const doThrowCursorIsStopped = () => {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop =
            cursor.continue =
            cursor.continuePrimaryKey =
            cursor.advance =
              doThrowCursorIsNotStarted;
          cursor.fail = wrap(reject);
          cursor.next = function () {
            let gotOne = 1;
            return this.start(() =>
              gotOne-- ? this.continue() : this.stop()
            ).then(() => this);
          };
          cursor.start = (callback) => {
            const iterationPromise = new Promise(
              (resolveIteration, rejectIteration) => {
                resolveIteration = wrap(resolveIteration);
                req.onerror = eventRejectHandler(rejectIteration);
                cursor.fail = rejectIteration;
                cursor.stop = (value) => {
                  cursor.stop =
                    cursor.continue =
                    cursor.continuePrimaryKey =
                    cursor.advance =
                      doThrowCursorIsStopped;
                  resolveIteration(value);
                };
              }
            );
            const guardedCallback = () => {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = () => {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap((ev) => {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve(cursor);
        }, reject);
      });
    }
    function query(hasGetAll) {
      return (request) => {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const { trans, values, limit, query } = request;
          const nonInfinitLimit = limit === Infinity ? undefined : limit;
          const { index, range } = query;
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0) return resolve({ result: [] });
          if (hasGetAll) {
            const req = values
              ? source.getAll(idbKeyRange, nonInfinitLimit)
              : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = (event) => resolve({ result: event.target.result });
            req.onerror = eventRejectHandler(reject);
          } else {
            let count = 0;
            const req =
              values || !("openKeyCursor" in source)
                ? source.openCursor(idbKeyRange)
                : source.openKeyCursor(idbKeyRange);
            const result = [];
            req.onsuccess = (event) => {
              const cursor = req.result;
              if (!cursor) return resolve({ result });
              result.push(values ? cursor.value : cursor.primaryKey);
              if (++count === limit) return resolve({ result });
              cursor.continue();
            };
            req.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany({ trans, keys }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const length = keys.length;
          const result = new Array(length);
          let keyCount = 0;
          let callbackCount = 0;
          let req;
          const successHandler = (event) => {
            const req = event.target;
            if ((result[req._pos] = req.result) != null);
            if (++callbackCount === keyCount) resolve(result);
          };
          const errorHandler = eventRejectHandler(reject);
          for (let i = 0; i < length; ++i) {
            const key = keys[i];
            if (key != null) {
              req = store.get(keys[i]);
              req._pos = i;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0) resolve(result);
        });
      },
      get({ trans, key }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const req = store.get(key);
          req.onsuccess = (event) => resolve(event.target.result);
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor,
      count({ query, trans }) {
        const { index, range } = query;
        return new Promise((resolve, reject) => {
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap((ev) => resolve(ev.target.result));
          req.onerror = eventRejectHandler(reject);
        });
      },
    };
  }
  const { schema, hasGetAll } = extractSchema(db, tmpTrans);
  const tables = schema.tables.map((tableSchema) =>
    createDbCoreTable(tableSchema)
  );
  const tableMap = {};
  tables.forEach((table) => (tableMap[table.name] = table));
  return {
    stack: "dbcore",
    transaction: db.transaction.bind(db),
    table(name) {
      const result = tableMap[name];
      if (!result) throw new Error(`Table '${name}' not found`);
      return tableMap[name];
    },
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema,
  };
}

function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce(
    (down, { create }) => ({ ...down, ...create(down) }),
    stackImpl
  );
}
function createMiddlewareStacks(
  middlewares,
  idbdb,
  { IDBKeyRange, indexedDB },
  tmpTrans
) {
  const dbcore = createMiddlewareStack(
    createDBCore(idbdb, IDBKeyRange, tmpTrans),
    middlewares.dbcore
  );
  return {
    dbcore,
  };
}
function generateMiddlewareStacks({ _novip: db }, tmpTrans) {
  const idbdb = tmpTrans.db;
  const stacks = createMiddlewareStacks(
    db._middlewares,
    idbdb,
    db._deps,
    tmpTrans
  );
  db.core = stacks.dbcore;
  db.tables.forEach((table) => {
    const tableName = table.name;
    if (db.core.schema.tables.some((tbl) => tbl.name === tableName)) {
      table.core = db.core.table(tableName);
      if (db[tableName] instanceof db.Table) {
        db[tableName].core = table.core;
      }
    }
  });
}

function setApiOnPlace({ _novip: db }, objs, tableNames, dbschema) {
  tableNames.forEach((tableName) => {
    const schema = dbschema[tableName];
    objs.forEach((obj) => {
      const propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || ("value" in propDesc && propDesc.value === undefined)) {
        if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
          setProp(obj, tableName, {
            get() {
              return this.table(tableName);
            },
            set(value) {
              defineProperty(this, tableName, {
                value,
                writable: true,
                configurable: true,
                enumerable: true,
              });
            },
          });
        } else {
          obj[tableName] = new db.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi({ _novip: db }, objs) {
  objs.forEach((obj) => {
    for (let key in obj) {
      if (obj[key] instanceof db.Table) delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b) {
  return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
  const globalSchema = db._dbSchema;
  const trans = db._createTransaction(
    "readwrite",
    db._storeNames,
    globalSchema
  );
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  const rejectTransaction = trans._reject.bind(trans);
  const transless = PSD.transless || PSD;
  newScope(() => {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach((tableName) => {
        createTable(
          idbUpgradeTrans,
          tableName,
          globalSchema[tableName].primKey,
          globalSchema[tableName].indexes
        );
      });
      generateMiddlewareStacks(db, idbUpgradeTrans);
      DexiePromise.follow(() => db.on.populate.fire(trans)).catch(
        rejectTransaction
      );
    } else
      updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(
        rejectTransaction
      );
  });
}
function updateTablesAndIndexes(
  { _novip: db },
  oldVersion,
  trans,
  idbUpgradeTrans
) {
  const queue = [];
  const versions = db._versions;
  let globalSchema = (db._dbSchema = buildGlobalSchema(
    db,
    db.idbdb,
    idbUpgradeTrans
  ));
  let anyContentUpgraderHasRun = false;
  const versToRun = versions.filter((v) => v._cfg.version >= oldVersion);
  versToRun.forEach((version) => {
    queue.push(() => {
      const oldSchema = globalSchema;
      const newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
      globalSchema = db._dbSchema = newSchema;
      const diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach((tuple) => {
        createTable(
          idbUpgradeTrans,
          tuple[0],
          tuple[1].primKey,
          tuple[1].indexes
        );
      });
      diff.change.forEach((change) => {
        if (change.recreate) {
          throw new exceptions.Upgrade(
            "Not yet support for changing primary key"
          );
        } else {
          const store = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach((idx) => addIndex(store, idx));
          change.change.forEach((idx) => {
            store.deleteIndex(idx.name);
            addIndex(store, idx);
          });
          change.del.forEach((idxName) => store.deleteIndex(idxName));
        }
      });
      const contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        let upgradeSchema = shallowClone(newSchema);
        diff.del.forEach((table) => {
          upgradeSchema[table] = oldSchema[table];
        });
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(
          db,
          [db.Transaction.prototype],
          keys(upgradeSchema),
          upgradeSchema
        );
        trans.schema = upgradeSchema;
        const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync) {
          incrementExpectedAwaits();
        }
        let returnValue;
        const promiseFollowed = DexiePromise.follow(() => {
          returnValue = contentUpgrade(trans);
          if (returnValue) {
            if (contentUpgradeIsAsync) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue.then(decrementor, decrementor);
            }
          }
        });
        return returnValue && typeof returnValue.then === "function"
          ? DexiePromise.resolve(returnValue)
          : promiseFollowed.then(() => returnValue);
      }
    });
    queue.push((idbtrans) => {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        const newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db, [db.Transaction.prototype]);
      setApiOnPlace(
        db,
        [db.Transaction.prototype],
        db._storeNames,
        db._dbSchema
      );
      trans.schema = db._dbSchema;
    });
  });
  function runQueue() {
    return queue.length
      ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue)
      : DexiePromise.resolve();
  }
  return runQueue().then(() => {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  const diff = {
    del: [],
    add: [],
    change: [],
  };
  let table;
  for (table in oldSchema) {
    if (!newSchema[table]) diff.del.push(table);
  }
  for (table in newSchema) {
    const oldDef = oldSchema[table],
      newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      const change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: [],
      };
      if (
        "" + (oldDef.primKey.keyPath || "") !==
          "" + (newDef.primKey.keyPath || "") ||
        (oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge)
      ) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        const oldIndexes = oldDef.idxByName;
        const newIndexes = newDef.idxByName;
        let idxName;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName]) change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          const oldIdx = oldIndexes[idxName],
            newIdx = newIndexes[idxName];
          if (!oldIdx) change.add.push(newIdx);
          else if (oldIdx.src !== newIdx.src) change.change.push(newIdx);
        }
        if (
          change.del.length > 0 ||
          change.add.length > 0 ||
          change.change.length > 0
        ) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  const store = idbtrans.db.createObjectStore(
    tableName,
    primKey.keyPath
      ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto }
      : { autoIncrement: primKey.auto }
  );
  indexes.forEach((idx) => addIndex(store, idx));
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach((tableName) => {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(
        idbtrans,
        tableName,
        newSchema[tableName].primKey,
        newSchema[tableName].indexes
      );
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  [].slice
    .call(idbtrans.db.objectStoreNames)
    .forEach(
      (storeName) =>
        newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName)
    );
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, {
    unique: idx.unique,
    multiEntry: idx.multi,
  });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
  const globalSchema = {};
  const dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach((storeName) => {
    const store = tmpTrans.objectStore(storeName);
    let keyPath = store.keyPath;
    const primKey = createIndexSpec(
      nameFromKeyPath(keyPath),
      keyPath || "",
      false,
      false,
      !!store.autoIncrement,
      keyPath && typeof keyPath !== "string",
      true
    );
    const indexes = [];
    for (let j = 0; j < store.indexNames.length; ++j) {
      const idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index = createIndexSpec(
        idbindex.name,
        keyPath,
        !!idbindex.unique,
        !!idbindex.multiEntry,
        false,
        keyPath && typeof keyPath !== "string",
        false
      );
      indexes.push(index);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema({ _novip: db }, idbdb, tmpTrans) {
  db.verno = idbdb.version / 10;
  const globalSchema = (db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans));
  db._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
  const installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
  const diff = getSchemaDiff(installedSchema, db._dbSchema);
  return !(
    diff.add.length ||
    diff.change.some((ch) => ch.add.length || ch.change.length)
  );
}
function adjustToExistingIndexNames({ _novip: db }, schema, idbtrans) {
  const storeNames = idbtrans.db.objectStoreNames;
  for (let i = 0; i < storeNames.length; ++i) {
    const storeName = storeNames[i];
    const store = idbtrans.objectStore(storeName);
    db._hasGetAll = "getAll" in store;
    for (let j = 0; j < store.indexNames.length; ++j) {
      const indexName = store.indexNames[j];
      const keyPath = store.index(indexName).keyPath;
      const dexieName =
        typeof keyPath === "string"
          ? keyPath
          : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        const indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (
    typeof navigator !== "undefined" &&
    /Safari/.test(navigator.userAgent) &&
    !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
    _global.WorkerGlobalScope &&
    _global instanceof _global.WorkerGlobalScope &&
    [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604
  ) {
    db._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map((index, indexNum) => {
    index = index.trim();
    const name = index.replace(/([&*]|\+\+)/g, "");
    const keyPath = /^\[/.test(name)
      ? name.match(/^\[(.*)\]$/)[1].split("+")
      : name;
    return createIndexSpec(
      name,
      keyPath || null,
      /\&/.test(index),
      /\*/.test(index),
      /\+\+/.test(index),
      isArray(keyPath),
      indexNum === 0
    );
  });
}

class Version {
  _parseStoresSpec(stores, outSchema) {
    keys(stores).forEach((tableName) => {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi)
          throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach((idx) => {
          if (idx.auto)
            throw new exceptions.Schema(
              "Only primary key can be marked as autoIncrement (++)"
            );
          if (!idx.keyPath)
            throw new exceptions.Schema(
              "Index must have a name and cannot be an empty string"
            );
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  }
  stores(stores) {
    const db = this.db;
    this._cfg.storesSource = this._cfg.storesSource
      ? extend(this._cfg.storesSource, stores)
      : stores;
    const versions = db._versions;
    const storesSpec = {};
    let dbschema = {};
    versions.forEach((version) => {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db._dbSchema = dbschema;
    removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
    setApiOnPlace(
      db,
      [db._allTables, db, db.Transaction.prototype, this._cfg.tables],
      keys(dbschema),
      dbschema
    );
    db._storeNames = keys(dbschema);
    return this;
  }
  upgrade(upgradeFunction) {
    this._cfg.contentUpgrade = promisableChain(
      this._cfg.contentUpgrade || nop,
      upgradeFunction
    );
    return this;
  }
}

function createVersionConstructor(db) {
  return makeClassConstructor(
    Version.prototype,
    function Version(versionNumber) {
      this.db = db;
      this._cfg = {
        version: versionNumber,
        storesSource: null,
        dbschema: {},
        tables: {},
        contentUpgrade: null,
      };
    }
  );
}

function getDbNamesTable(indexedDB, IDBKeyRange) {
  let dbNamesDB = indexedDB["_dbNamesDB"];
  if (!dbNamesDB) {
    dbNamesDB = indexedDB["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
      addons: [],
      indexedDB,
      IDBKeyRange,
    });
    dbNamesDB.version(1).stores({ dbnames: "name" });
  }
  return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB) {
  return indexedDB && typeof indexedDB.databases === "function";
}
function getDatabaseNames({ indexedDB, IDBKeyRange }) {
  return hasDatabasesNative(indexedDB)
    ? Promise.resolve(indexedDB.databases()).then((infos) =>
        infos.map((info) => info.name).filter((name) => name !== DBNAMES_DB)
      )
    : getDbNamesTable(indexedDB, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated({ indexedDB, IDBKeyRange }, name) {
  !hasDatabasesNative(indexedDB) &&
    name !== DBNAMES_DB &&
    getDbNamesTable(indexedDB, IDBKeyRange).put({ name }).catch(nop);
}
function _onDatabaseDeleted({ indexedDB, IDBKeyRange }, name) {
  !hasDatabasesNative(indexedDB) &&
    name !== DBNAMES_DB &&
    getDbNamesTable(indexedDB, IDBKeyRange).delete(name).catch(nop);
}

function vip(fn) {
  return newScope(function () {
    PSD.letThrough = true;
    return fn();
  });
}

function idbReady() {
  var isSafari =
    !navigator.userAgentData &&
    /Safari\//.test(navigator.userAgent) &&
    !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!isSafari || !indexedDB.databases) return Promise.resolve();
  var intervalId;
  return new Promise(function (resolve) {
    var tryIdb = function () {
      return indexedDB.databases().finally(resolve);
    };
    intervalId = setInterval(tryIdb, 100);
    tryIdb();
  }).finally(function () {
    return clearInterval(intervalId);
  });
}

function dexieOpen(db) {
  const state = db._state;
  const { indexedDB } = db._deps;
  if (state.isBeingOpened || db.idbdb)
    return state.dbReadyPromise.then(() =>
      state.dbOpenError ? rejection(state.dbOpenError) : db
    );
  debug && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  const openCanceller = state.openCanceller;
  function throwIfCancelled() {
    if (state.openCanceller !== openCanceller)
      throw new exceptions.DatabaseClosed("db.open() was cancelled");
  }
  let resolveDbReady = state.dbReadyResolve,
    upgradeTransaction = null,
    wasCreated = false;
  return DexiePromise.race([
    openCanceller,
    (typeof navigator === "undefined"
      ? DexiePromise.resolve()
      : idbReady()
    ).then(
      () =>
        new DexiePromise((resolve, reject) => {
          throwIfCancelled();
          if (!indexedDB) throw new exceptions.MissingAPI();
          const dbName = db.name;
          const req = state.autoSchema
            ? indexedDB.open(dbName)
            : indexedDB.open(dbName, Math.round(db.verno * 10));
          if (!req) throw new exceptions.MissingAPI();
          req.onerror = eventRejectHandler(reject);
          req.onblocked = wrap(db._fireOnBlocked);
          req.onupgradeneeded = wrap((e) => {
            upgradeTransaction = req.transaction;
            if (state.autoSchema && !db._options.allowEmptyDB) {
              req.onerror = preventDefault;
              upgradeTransaction.abort();
              req.result.close();
              const delreq = indexedDB.deleteDatabase(dbName);
              delreq.onsuccess = delreq.onerror = wrap(() => {
                reject(
                  new exceptions.NoSuchDatabase(
                    `Database ${dbName} doesnt exist`
                  )
                );
              });
            } else {
              upgradeTransaction.onerror = eventRejectHandler(reject);
              var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
              wasCreated = oldVer < 1;
              db._novip.idbdb = req.result;
              runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
            }
          }, reject);
          req.onsuccess = wrap(() => {
            upgradeTransaction = null;
            const idbdb = (db._novip.idbdb = req.result);
            const objectStoreNames = slice(idbdb.objectStoreNames);
            if (objectStoreNames.length > 0)
              try {
                const tmpTrans = idbdb.transaction(
                  safariMultiStoreFix(objectStoreNames),
                  "readonly"
                );
                if (state.autoSchema) readGlobalSchema(db, idbdb, tmpTrans);
                else {
                  adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                  if (!verifyInstalledSchema(db, tmpTrans)) {
                    console.warn(
                      `Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`
                    );
                  }
                }
                generateMiddlewareStacks(db, tmpTrans);
              } catch (e) {}
            connections.push(db);
            idbdb.onversionchange = wrap((ev) => {
              state.vcFired = true;
              db.on("versionchange").fire(ev);
            });
            idbdb.onclose = wrap((ev) => {
              db.on("close").fire(ev);
            });
            if (wasCreated) _onDatabaseCreated(db._deps, dbName);
            resolve();
          }, reject);
        })
    ),
  ])
    .then(() => {
      throwIfCancelled();
      state.onReadyBeingFired = [];
      return DexiePromise.resolve(vip(() => db.on.ready.fire(db.vip))).then(
        function fireRemainders() {
          if (state.onReadyBeingFired.length > 0) {
            let remainders = state.onReadyBeingFired.reduce(
              promisableChain,
              nop
            );
            state.onReadyBeingFired = [];
            return DexiePromise.resolve(vip(() => remainders(db.vip))).then(
              fireRemainders
            );
          }
        }
      );
    })
    .finally(() => {
      state.onReadyBeingFired = null;
      state.isBeingOpened = false;
    })
    .then(() => {
      return db;
    })
    .catch((err) => {
      state.dbOpenError = err;
      try {
        upgradeTransaction && upgradeTransaction.abort();
      } catch (_a) {}
      if (openCanceller === state.openCanceller) {
        db._close();
      }
      return rejection(err);
    })
    .finally(() => {
      state.openComplete = true;
      resolveDbReady();
    });
}

function awaitIterator(iterator) {
  var callNext = (result) => iterator.next(result),
    doThrow = (error) => iterator.throw(error),
    onSuccess = step(callNext),
    onError = step(doThrow);
  function step(getNext) {
    return (val) => {
      var next = getNext(val),
        value = next.value;
      return next.done
        ? value
        : !value || typeof value.then !== "function"
        ? isArray(value)
          ? Promise.all(value).then(onSuccess, onError)
          : onSuccess(value)
        : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}

function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i = arguments.length;
  if (i < 2) throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i - 1);
  while (--i) args[i - 1] = arguments[i];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(
  db,
  mode,
  storeNames,
  parentTransaction,
  scopeFunc
) {
  return DexiePromise.resolve().then(() => {
    const transless = PSD.transless || PSD;
    const trans = db._createTransaction(
      mode,
      storeNames,
      db._dbSchema,
      parentTransaction
    );
    const zoneProps = {
      trans: trans,
      transless: transless,
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      try {
        trans.create();
        db._state.PR1398_maxLoop = 3;
      } catch (ex) {
        if (
          ex.name === errnames.InvalidState &&
          db.isOpen() &&
          --db._state.PR1398_maxLoop > 0
        ) {
          console.warn("Dexie: Need to reopen db");
          db._close();
          return db
            .open()
            .then(() =>
              enterTransactionScope(db, mode, storeNames, null, scopeFunc)
            );
        }
        return rejection(ex);
      }
    }
    const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    let returnValue;
    const promiseFollowed = DexiePromise.follow(() => {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (
          typeof returnValue.next === "function" &&
          typeof returnValue.throw === "function"
        ) {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (
      returnValue && typeof returnValue.then === "function"
        ? DexiePromise.resolve(returnValue).then((x) =>
            trans.active
              ? x
              : rejection(
                  new exceptions.PrematureCommit(
                    "Transaction committed too early. See http://bit.ly/2kdckMn"
                  )
                )
          )
        : promiseFollowed.then(() => returnValue)
    )
      .then((x) => {
        if (parentTransaction) trans._resolve();
        return trans._completion.then(() => x);
      })
      .catch((e) => {
        trans._reject(e);
        return rejection(e);
      });
  });
}

function pad(a, value, count) {
  const result = isArray(a) ? a.slice() : [a];
  for (let i = 0; i < count; ++i) result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return {
    ...down,
    table(tableName) {
      const table = down.table(tableName);
      const { schema } = table;
      const indexLookup = {};
      const allVirtualIndexes = [];
      function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
        const keyPathAlias = getKeyPathAlias(keyPath);
        const indexList = (indexLookup[keyPathAlias] =
          indexLookup[keyPathAlias] || []);
        const keyLength =
          keyPath == null
            ? 0
            : typeof keyPath === "string"
            ? 1
            : keyPath.length;
        const isVirtual = keyTail > 0;
        const virtualIndex = {
          ...lowLevelIndex,
          isVirtual,
          keyTail,
          keyLength,
          extractKey: getKeyExtractor(keyPath),
          unique: !isVirtual && lowLevelIndex.unique,
        };
        indexList.push(virtualIndex);
        if (!virtualIndex.isPrimaryKey) {
          allVirtualIndexes.push(virtualIndex);
        }
        if (keyLength > 1) {
          const virtualKeyPath =
            keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
          addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
        }
        indexList.sort((a, b) => a.keyTail - b.keyTail);
        return virtualIndex;
      }
      const primaryKey = addVirtualIndexes(
        schema.primaryKey.keyPath,
        0,
        schema.primaryKey
      );
      indexLookup[":id"] = [primaryKey];
      for (const index of schema.indexes) {
        addVirtualIndexes(index.keyPath, 0, index);
      }
      function findBestIndex(keyPath) {
        const result = indexLookup[getKeyPathAlias(keyPath)];
        return result && result[0];
      }
      function translateRange(range, keyTail) {
        return {
          type: range.type === 1 ? 2 : range.type,
          lower: pad(
            range.lower,
            range.lowerOpen ? down.MAX_KEY : down.MIN_KEY,
            keyTail
          ),
          lowerOpen: true,
          upper: pad(
            range.upper,
            range.upperOpen ? down.MIN_KEY : down.MAX_KEY,
            keyTail
          ),
          upperOpen: true,
        };
      }
      function translateRequest(req) {
        const index = req.query.index;
        return index.isVirtual
          ? {
              ...req,
              query: {
                index,
                range: translateRange(req.query.range, index.keyTail),
              },
            }
          : req;
      }
      const result = {
        ...table,
        schema: {
          ...schema,
          primaryKey,
          indexes: allVirtualIndexes,
          getIndexByKeyPath: findBestIndex,
        },
        count(req) {
          return table.count(translateRequest(req));
        },
        query(req) {
          return table.query(translateRequest(req));
        },
        openCursor(req) {
          const { keyTail, isVirtual, keyLength } = req.query.index;
          if (!isVirtual) return table.openCursor(req);
          function createVirtualCursor(cursor) {
            function _continue(key) {
              key != null
                ? cursor.continue(
                    pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)
                  )
                : req.unique
                ? cursor.continue(
                    cursor.key
                      .slice(0, keyLength)
                      .concat(
                        req.reverse ? down.MIN_KEY : down.MAX_KEY,
                        keyTail
                      )
                  )
                : cursor.continue();
            }
            const virtualCursor = Object.create(cursor, {
              continue: { value: _continue },
              continuePrimaryKey: {
                value(key, primaryKey) {
                  cursor.continuePrimaryKey(
                    pad(key, down.MAX_KEY, keyTail),
                    primaryKey
                  );
                },
              },
              primaryKey: {
                get() {
                  return cursor.primaryKey;
                },
              },
              key: {
                get() {
                  const key = cursor.key;
                  return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                },
              },
              value: {
                get() {
                  return cursor.value;
                },
              },
            });
            return virtualCursor;
          }
          return table
            .openCursor(translateRequest(req))
            .then((cursor) => cursor && createVirtualCursor(cursor));
        },
      };
      return result;
    },
  };
}
const virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware,
};

function getObjectDiff(a, b, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach((prop) => {
    if (!hasOwn(b, prop)) {
      rv[prfx + prop] = undefined;
    } else {
      var ap = a[prop],
        bp = b[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        const apTypeName = toStringTag(ap);
        const bpTypeName = toStringTag(bp);
        if (apTypeName !== bpTypeName) {
          rv[prfx + prop] = b[prop];
        } else if (apTypeName === "Object") {
          getObjectDiff(ap, bp, rv, prfx + prop + ".");
        } else if (ap !== bp) {
          rv[prfx + prop] = b[prop];
        }
      } else if (ap !== bp) rv[prfx + prop] = b[prop];
    }
  });
  keys(b).forEach((prop) => {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b[prop];
    }
  });
  return rv;
}

function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete") return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}

const hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: (downCore) => ({
    ...downCore,
    table(tableName) {
      const downTable = downCore.table(tableName);
      const { primaryKey } = downTable.schema;
      const tableMiddleware = {
        ...downTable,
        mutate(req) {
          const dxTrans = PSD.trans;
          const { deleting, creating, updating } =
            dxTrans.table(tableName).hook;
          switch (req.type) {
            case "add":
              if (creating.fire === nop) break;
              return dxTrans._promise(
                "readwrite",
                () => addPutOrDelete(req),
                true
              );
            case "put":
              if (creating.fire === nop && updating.fire === nop) break;
              return dxTrans._promise(
                "readwrite",
                () => addPutOrDelete(req),
                true
              );
            case "delete":
              if (deleting.fire === nop) break;
              return dxTrans._promise(
                "readwrite",
                () => addPutOrDelete(req),
                true
              );
            case "deleteRange":
              if (deleting.fire === nop) break;
              return dxTrans._promise(
                "readwrite",
                () => deleteRange(req),
                true
              );
          }
          return downTable.mutate(req);
          function addPutOrDelete(req) {
            const dxTrans = PSD.trans;
            const keys = req.keys || getEffectiveKeys(primaryKey, req);
            if (!keys) throw new Error("Keys missing");
            req =
              req.type === "add" || req.type === "put"
                ? { ...req, keys }
                : { ...req };
            if (req.type !== "delete") req.values = [...req.values];
            if (req.keys) req.keys = [...req.keys];
            return getExistingValues(downTable, req, keys).then(
              (existingValues) => {
                const contexts = keys.map((key, i) => {
                  const existingValue = existingValues[i];
                  const ctx = { onerror: null, onsuccess: null };
                  if (req.type === "delete") {
                    deleting.fire.call(ctx, key, existingValue, dxTrans);
                  } else if (
                    req.type === "add" ||
                    existingValue === undefined
                  ) {
                    const generatedPrimaryKey = creating.fire.call(
                      ctx,
                      key,
                      req.values[i],
                      dxTrans
                    );
                    if (key == null && generatedPrimaryKey != null) {
                      key = generatedPrimaryKey;
                      req.keys[i] = key;
                      if (!primaryKey.outbound) {
                        setByKeyPath(req.values[i], primaryKey.keyPath, key);
                      }
                    }
                  } else {
                    const objectDiff = getObjectDiff(
                      existingValue,
                      req.values[i]
                    );
                    const additionalChanges = updating.fire.call(
                      ctx,
                      objectDiff,
                      key,
                      existingValue,
                      dxTrans
                    );
                    if (additionalChanges) {
                      const requestedValue = req.values[i];
                      Object.keys(additionalChanges).forEach((keyPath) => {
                        if (hasOwn(requestedValue, keyPath)) {
                          requestedValue[keyPath] = additionalChanges[keyPath];
                        } else {
                          setByKeyPath(
                            requestedValue,
                            keyPath,
                            additionalChanges[keyPath]
                          );
                        }
                      });
                    }
                  }
                  return ctx;
                });
                return downTable
                  .mutate(req)
                  .then(({ failures, results, numFailures, lastResult }) => {
                    for (let i = 0; i < keys.length; ++i) {
                      const primKey = results ? results[i] : keys[i];
                      const ctx = contexts[i];
                      if (primKey == null) {
                        ctx.onerror && ctx.onerror(failures[i]);
                      } else {
                        ctx.onsuccess &&
                          ctx.onsuccess(
                            req.type === "put" && existingValues[i]
                              ? req.values[i]
                              : primKey
                          );
                      }
                    }
                    return { failures, results, numFailures, lastResult };
                  })
                  .catch((error) => {
                    contexts.forEach(
                      (ctx) => ctx.onerror && ctx.onerror(error)
                    );
                    return Promise.reject(error);
                  });
              }
            );
          }
          function deleteRange(req) {
            return deleteNextChunk(req.trans, req.range, 10000);
          }
          function deleteNextChunk(trans, range, limit) {
            return downTable
              .query({
                trans,
                values: false,
                query: { index: primaryKey, range },
                limit,
              })
              .then(({ result }) => {
                return addPutOrDelete({
                  type: "delete",
                  keys: result,
                  trans,
                }).then((res) => {
                  if (res.numFailures > 0)
                    return Promise.reject(res.failures[0]);
                  if (result.length < limit) {
                    return {
                      failures: [],
                      numFailures: 0,
                      lastResult: undefined,
                    };
                  } else {
                    return deleteNextChunk(
                      trans,
                      {
                        ...range,
                        lower: result[result.length - 1],
                        lowerOpen: true,
                      },
                      limit
                    );
                  }
                });
              });
          }
        },
      };
      return tableMiddleware;
    },
  }),
};
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add"
    ? Promise.resolve([])
    : table.getMany({
        trans: req.trans,
        keys: effectiveKeys,
        cache: "immutable",
      });
}

function getFromTransactionCache(keys, cache, clone) {
  try {
    if (!cache) return null;
    if (cache.keys.length < keys.length) return null;
    const result = [];
    for (let i = 0, j = 0; i < cache.keys.length && j < keys.length; ++i) {
      if (cmp(cache.keys[i], keys[j]) !== 0) continue;
      result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
      ++j;
    }
    return result.length === keys.length ? result : null;
  } catch (_a) {
    return null;
  }
}
const cacheExistingValuesMiddleware = {
  stack: "dbcore",
  level: -1,
  create: (core) => {
    return {
      table: (tableName) => {
        const table = core.table(tableName);
        return {
          ...table,
          getMany: (req) => {
            if (!req.cache) {
              return table.getMany(req);
            }
            const cachedResult = getFromTransactionCache(
              req.keys,
              req.trans["_cache"],
              req.cache === "clone"
            );
            if (cachedResult) {
              return DexiePromise.resolve(cachedResult);
            }
            return table.getMany(req).then((res) => {
              req.trans["_cache"] = {
                keys: req.keys,
                values: req.cache === "clone" ? deepClone(res) : res,
              };
              return res;
            });
          },
          mutate: (req) => {
            if (req.type !== "add") req.trans["_cache"] = null;
            return table.mutate(req);
          },
        };
      },
    };
  },
};

function isEmptyRange(node) {
  return !("from" in node);
}
const RangeSet = function (fromOrTree, to) {
  if (this) {
    extend(
      this,
      arguments.length
        ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree }
        : { d: 0 }
    );
  } else {
    const rv = new RangeSet();
    if (fromOrTree && "d" in fromOrTree) {
      extend(rv, fromOrTree);
    }
    return rv;
  }
};
props(RangeSet.prototype, {
  add(rangeSet) {
    mergeRanges(this, rangeSet);
    return this;
  },
  addKey(key) {
    addRange(this, key, key);
    return this;
  },
  addKeys(keys) {
    keys.forEach((key) => addRange(this, key, key));
    return this;
  },
  [iteratorSymbol]() {
    return getRangeSetIterator(this);
  },
});
function addRange(target, from, to) {
  const diff = cmp(from, to);
  if (isNaN(diff)) return;
  if (diff > 0) throw RangeError();
  if (isEmptyRange(target)) return extend(target, { from, to, d: 1 });
  const left = target.l;
  const right = target.r;
  if (cmp(to, target.from) < 0) {
    left
      ? addRange(left, from, to)
      : (target.l = { from, to, d: 1, l: null, r: null });
    return rebalance(target);
  }
  if (cmp(from, target.to) > 0) {
    right
      ? addRange(right, from, to)
      : (target.r = { from, to, d: 1, l: null, r: null });
    return rebalance(target);
  }
  if (cmp(from, target.from) < 0) {
    target.from = from;
    target.l = null;
    target.d = right ? right.d + 1 : 1;
  }
  if (cmp(to, target.to) > 0) {
    target.to = to;
    target.r = null;
    target.d = target.l ? target.l.d + 1 : 1;
  }
  const rightWasCutOff = !target.r;
  if (left && !target.l) {
    mergeRanges(target, left);
  }
  if (right && rightWasCutOff) {
    mergeRanges(target, right);
  }
}
function mergeRanges(target, newSet) {
  function _addRangeSet(target, { from, to, l, r }) {
    addRange(target, from, to);
    if (l) _addRangeSet(target, l);
    if (r) _addRangeSet(target, r);
  }
  if (!isEmptyRange(newSet)) _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
  const i1 = getRangeSetIterator(rangeSet2);
  let nextResult1 = i1.next();
  if (nextResult1.done) return false;
  let a = nextResult1.value;
  const i2 = getRangeSetIterator(rangeSet1);
  let nextResult2 = i2.next(a.from);
  let b = nextResult2.value;
  while (!nextResult1.done && !nextResult2.done) {
    if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0) return true;
    cmp(a.from, b.from) < 0
      ? (a = (nextResult1 = i1.next(b.from)).value)
      : (b = (nextResult2 = i2.next(a.from)).value);
  }
  return false;
}
function getRangeSetIterator(node) {
  let state = isEmptyRange(node) ? null : { s: 0, n: node };
  return {
    next(key) {
      const keyProvided = arguments.length > 0;
      while (state) {
        switch (state.s) {
          case 0:
            state.s = 1;
            if (keyProvided) {
              while (state.n.l && cmp(key, state.n.from) < 0)
                state = { up: state, n: state.n.l, s: 1 };
            } else {
              while (state.n.l) state = { up: state, n: state.n.l, s: 1 };
            }
          case 1:
            state.s = 2;
            if (!keyProvided || cmp(key, state.n.to) <= 0)
              return { value: state.n, done: false };
          case 2:
            if (state.n.r) {
              state.s = 3;
              state = { up: state, n: state.n.r, s: 0 };
              continue;
            }
          case 3:
            state = state.up;
        }
      }
      return { done: true };
    },
  };
}
function rebalance(target) {
  var _a, _b;
  const diff =
    (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) -
    (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
  const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
  if (r) {
    const l = r === "r" ? "l" : "r";
    const rootClone = { ...target };
    const oldRootRight = target[r];
    target.from = oldRootRight.from;
    target.to = oldRootRight.to;
    target[r] = oldRootRight[r];
    rootClone[r] = oldRootRight[l];
    target[l] = rootClone;
    rootClone.d = computeDepth(rootClone);
  }
  target.d = computeDepth(target);
}
function computeDepth({ r, l }) {
  return (r ? (l ? Math.max(r.d, l.d) : r.d) : l ? l.d : 0) + 1;
}

const observabilityMiddleware = {
  stack: "dbcore",
  level: 0,
  create: (core) => {
    const dbName = core.schema.name;
    const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
    return {
      ...core,
      table: (tableName) => {
        const table = core.table(tableName);
        const { schema } = table;
        const { primaryKey } = schema;
        const { extractKey, outbound } = primaryKey;
        const tableClone = {
          ...table,
          mutate: (req) => {
            const trans = req.trans;
            const mutatedParts =
              trans.mutatedParts || (trans.mutatedParts = {});
            const getRangeSet = (indexName) => {
              const part = `idb://${dbName}/${tableName}/${indexName}`;
              return (
                mutatedParts[part] || (mutatedParts[part] = new RangeSet())
              );
            };
            const pkRangeSet = getRangeSet("");
            const delsRangeSet = getRangeSet(":dels");
            const { type } = req;
            let [keys, newObjs] =
              req.type === "deleteRange"
                ? [req.range]
                : req.type === "delete"
                ? [req.keys]
                : req.values.length < 50
                ? [[], req.values]
                : [];
            const oldCache = req.trans["_cache"];
            return table.mutate(req).then((res) => {
              if (isArray(keys)) {
                if (type !== "delete") keys = res.results;
                pkRangeSet.addKeys(keys);
                const oldObjs = getFromTransactionCache(keys, oldCache);
                if (!oldObjs && type !== "add") {
                  delsRangeSet.addKeys(keys);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys) {
                const range = { from: keys.lower, to: keys.upper };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach((idx) =>
                  getRangeSet(idx.name).add(FULL_RANGE)
                );
              }
              return res;
            });
          },
        };
        const getRange = ({ query: { index, range } }) => {
          var _a, _b;
          return [
            index,
            new RangeSet(
              (_a = range.lower) !== null && _a !== void 0 ? _a : core.MIN_KEY,
              (_b = range.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY
            ),
          ];
        };
        const readSubscribers = {
          get: (req) => [primaryKey, new RangeSet(req.key)],
          getMany: (req) => [primaryKey, new RangeSet().addKeys(req.keys)],
          count: getRange,
          query: getRange,
          openCursor: getRange,
        };
        keys(readSubscribers).forEach((method) => {
          tableClone[method] = function (req) {
            const { subscr } = PSD;
            if (subscr) {
              const getRangeSet = (indexName) => {
                const part = `idb://${dbName}/${tableName}/${indexName}`;
                return subscr[part] || (subscr[part] = new RangeSet());
              };
              const pkRangeSet = getRangeSet("");
              const delsRangeSet = getRangeSet(":dels");
              const [queriedIndex, queriedRanges] =
                readSubscribers[method](req);
              getRangeSet(queriedIndex.name || "").add(queriedRanges);
              if (!queriedIndex.isPrimaryKey) {
                if (method === "count") {
                  delsRangeSet.add(FULL_RANGE);
                } else {
                  const keysPromise =
                    method === "query" &&
                    outbound &&
                    req.values &&
                    table.query({
                      ...req,
                      values: false,
                    });
                  return table[method].apply(this, arguments).then((res) => {
                    if (method === "query") {
                      if (outbound && req.values) {
                        return keysPromise.then(({ result: resultingKeys }) => {
                          pkRangeSet.addKeys(resultingKeys);
                          return res;
                        });
                      }
                      const pKeys = req.values
                        ? res.result.map(extractKey)
                        : res.result;
                      if (req.values) {
                        pkRangeSet.addKeys(pKeys);
                      } else {
                        delsRangeSet.addKeys(pKeys);
                      }
                    } else if (method === "openCursor") {
                      const cursor = res;
                      const wantValues = req.values;
                      return (
                        cursor &&
                        Object.create(cursor, {
                          key: {
                            get() {
                              delsRangeSet.addKey(cursor.primaryKey);
                              return cursor.key;
                            },
                          },
                          primaryKey: {
                            get() {
                              const pkey = cursor.primaryKey;
                              delsRangeSet.addKey(pkey);
                              return pkey;
                            },
                          },
                          value: {
                            get() {
                              wantValues &&
                                pkRangeSet.addKey(cursor.primaryKey);
                              return cursor.value;
                            },
                          },
                        })
                      );
                    }
                    return res;
                  });
                }
              }
            }
            return table[method].apply(this, arguments);
          };
        });
        return tableClone;
      },
    };
  },
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
  function addAffectedIndex(ix) {
    const rangeSet = getRangeSet(ix.name || "");
    function extractKey(obj) {
      return obj != null ? ix.extractKey(obj) : null;
    }
    const addKeyOrKeys = (key) =>
      ix.multiEntry && isArray(key)
        ? key.forEach((key) => rangeSet.addKey(key))
        : rangeSet.addKey(key);
    (oldObjs || newObjs).forEach((_, i) => {
      const oldKey = oldObjs && extractKey(oldObjs[i]);
      const newKey = newObjs && extractKey(newObjs[i]);
      if (cmp(oldKey, newKey) !== 0) {
        if (oldKey != null) addKeyOrKeys(oldKey);
        if (newKey != null) addKeyOrKeys(newKey);
      }
    });
  }
  schema.indexes.forEach(addAffectedIndex);
}

class Dexie$1 {
  constructor(name, options) {
    this._middlewares = {};
    this.verno = 0;
    const deps = Dexie$1.dependencies;
    this._options = options = {
      addons: Dexie$1.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange,
      ...options,
    };
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange,
    };
    const { addons } = options;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    this._novip = this;
    const state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true,
      PR1398_maxLoop: 3,
    };
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", "close", {
      ready: [promisableChain, nop],
    });
    this.on.ready.subscribe = override(this.on.ready.subscribe, (subscribe) => {
      return (subscriber, bSticky) => {
        Dexie$1.vip(() => {
          const state = this._state;
          if (state.openComplete) {
            if (!state.dbOpenError) DexiePromise.resolve().then(subscriber);
            if (bSticky) subscribe(subscriber);
          } else if (state.onReadyBeingFired) {
            state.onReadyBeingFired.push(subscriber);
            if (bSticky) subscribe(subscriber);
          } else {
            subscribe(subscriber);
            const db = this;
            if (!bSticky)
              subscribe(function unsubscribe() {
                db.on.ready.unsubscribe(subscriber);
                db.on.ready.unsubscribe(unsubscribe);
              });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", (ev) => {
      if (ev.newVersion > 0)
        console.warn(
          `Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`
        );
      else
        console.warn(
          `Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`
        );
      this.close();
    });
    this.on("blocked", (ev) => {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion)
        console.warn(`Dexie.delete('${this.name}') was blocked`);
      else
        console.warn(
          `Upgrade '${this.name}' blocked by other connection holding version ${
            ev.oldVersion / 10
          }`
        );
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = (mode, storeNames, dbschema, parentTransaction) =>
      new this.Transaction(
        mode,
        storeNames,
        dbschema,
        this._options.chromeTransactionDurability,
        parentTransaction
      );
    this._fireOnBlocked = (ev) => {
      this.on("blocked").fire(ev);
      connections
        .filter((c) => c.name === this.name && c !== this && !c._state.vcFired)
        .map((c) => c.on("versionchange").fire(ev));
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    this.use(observabilityMiddleware);
    this.use(cacheExistingValuesMiddleware);
    this.vip = Object.create(this, { _vip: { value: true } });
    addons.forEach((addon) => addon(this));
  }
  version(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1)
      throw new exceptions.Type(`Given version is not a positive number`);
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened)
      throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    const versions = this._versions;
    var versionInstance = versions.filter(
      (v) => v._cfg.version === versionNumber
    )[0];
    if (versionInstance) return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  }
  _whenReady(fn) {
    return this.idbdb &&
      (this._state.openComplete || PSD.letThrough || this._vip)
      ? fn()
      : new DexiePromise((resolve, reject) => {
          if (this._state.openComplete) {
            return reject(
              new exceptions.DatabaseClosed(this._state.dbOpenError)
            );
          }
          if (!this._state.isBeingOpened) {
            if (!this._options.autoOpen) {
              reject(new exceptions.DatabaseClosed());
              return;
            }
            this.open().catch(nop);
          }
          this._state.dbReadyPromise.then(resolve, reject);
        }).then(fn);
  }
  use({ stack, create, level, name }) {
    if (name) this.unuse({ stack, name });
    const middlewares =
      this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({
      stack,
      create,
      level: level == null ? 10 : level,
      name,
    });
    middlewares.sort((a, b) => a.level - b.level);
    return this;
  }
  unuse({ stack, name, create }) {
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter((mw) =>
        create ? mw.create !== create : name ? mw.name !== name : false
      );
    }
    return this;
  }
  open() {
    return dexieOpen(this);
  }
  _close() {
    const state = this._state;
    const idx = connections.indexOf(this);
    if (idx >= 0) connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {}
      this._novip.idbdb = null;
    }
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
  }
  close() {
    this._close();
    const state = this._state;
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened) state.cancelOpen(state.dbOpenError);
  }
  delete() {
    const hasArguments = arguments.length > 0;
    const state = this._state;
    return new DexiePromise((resolve, reject) => {
      const doDelete = () => {
        this.close();
        var req = this._deps.indexedDB.deleteDatabase(this.name);
        req.onsuccess = wrap(() => {
          _onDatabaseDeleted(this._deps, this.name);
          resolve();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = this._fireOnBlocked;
      };
      if (hasArguments)
        throw new exceptions.InvalidArgument(
          "Arguments not allowed in db.delete()"
        );
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  }
  backendDB() {
    return this.idbdb;
  }
  isOpen() {
    return this.idbdb !== null;
  }
  hasBeenClosed() {
    const dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  }
  hasFailed() {
    return this._state.dbOpenError !== null;
  }
  dynamicallyOpened() {
    return this._state.autoSchema;
  }
  get tables() {
    return keys(this._allTables).map((name) => this._allTables[name]);
  }
  transaction() {
    const args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  }
  _transaction(mode, tables, scopeFunc) {
    let parentTransaction = PSD.trans;
    if (
      !parentTransaction ||
      parentTransaction.db !== this ||
      mode.indexOf("!") !== -1
    )
      parentTransaction = null;
    const onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    let idbMode, storeNames;
    try {
      storeNames = tables.map((table) => {
        var storeName = table instanceof this.Table ? table.name : table;
        if (typeof storeName !== "string")
          throw new TypeError(
            "Invalid table argument to Dexie.transaction(). Only Table or String are allowed"
          );
        return storeName;
      });
      if (mode == "r" || mode === READONLY) idbMode = READONLY;
      else if (mode == "rw" || mode == READWRITE) idbMode = READWRITE;
      else
        throw new exceptions.InvalidArgument(
          "Invalid transaction mode: " + mode
        );
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else
            throw new exceptions.SubTransaction(
              "Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY"
            );
        }
        if (parentTransaction) {
          storeNames.forEach((storeName) => {
            if (
              parentTransaction &&
              parentTransaction.storeNames.indexOf(storeName) === -1
            ) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else
                throw new exceptions.SubTransaction(
                  "Table " + storeName + " not included in parent transaction."
                );
            }
          });
        }
        if (
          onlyIfCompatible &&
          parentTransaction &&
          !parentTransaction.active
        ) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction
        ? parentTransaction._promise(null, (_, reject) => {
            reject(e);
          })
        : rejection(e);
    }
    const enterTransaction = enterTransactionScope.bind(
      null,
      this,
      idbMode,
      storeNames,
      parentTransaction,
      scopeFunc
    );
    return parentTransaction
      ? parentTransaction._promise(idbMode, enterTransaction, "lock")
      : PSD.trans
      ? usePSD(PSD.transless, () => this._whenReady(enterTransaction))
      : this._whenReady(enterTransaction);
  }
  table(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
    }
    return this._allTables[tableName];
  }
}

const symbolObservable =
  typeof Symbol !== "undefined" && "observable" in Symbol
    ? Symbol.observable
    : "@@observable";
class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(x, error, complete) {
    return this._subscribe(
      !x || typeof x === "function" ? { next: x, error, complete } : x
    );
  }
  [symbolObservable]() {
    return this;
  }
}

function extendObservabilitySet(target, newSet) {
  keys(newSet).forEach((part) => {
    const rangeSet = target[part] || (target[part] = new RangeSet());
    mergeRanges(rangeSet, newSet[part]);
  });
  return target;
}

function liveQuery(querier) {
  return new Observable((observer) => {
    const scopeFuncIsAsync = isAsyncFunction(querier);
    function execute(subscr) {
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      const exec = () => newScope(querier, { subscr, trans: null });
      const rv = PSD.trans ? usePSD(PSD.transless, exec) : exec();
      if (scopeFuncIsAsync) {
        rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
      }
      return rv;
    }
    let closed = false;
    let accumMuts = {};
    let currentObs = {};
    const subscription = {
      get closed() {
        return closed;
      },
      unsubscribe: () => {
        closed = true;
        globalEvents.storagemutated.unsubscribe(mutationListener);
      },
    };
    observer.start && observer.start(subscription);
    let querying = false,
      startedListening = false;
    function shouldNotify() {
      return keys(currentObs).some(
        (key) =>
          accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key])
      );
    }
    const mutationListener = (parts) => {
      extendObservabilitySet(accumMuts, parts);
      if (shouldNotify()) {
        doQuery();
      }
    };
    const doQuery = () => {
      if (querying || closed) return;
      accumMuts = {};
      const subscr = {};
      const ret = execute(subscr);
      if (!startedListening) {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
        startedListening = true;
      }
      querying = true;
      Promise.resolve(ret).then(
        (result) => {
          querying = false;
          if (closed) return;
          if (shouldNotify()) {
            doQuery();
          } else {
            accumMuts = {};
            currentObs = subscr;
            observer.next && observer.next(result);
          }
        },
        (err) => {
          querying = false;
          observer.error && observer.error(err);
          subscription.unsubscribe();
        }
      );
    };
    doQuery();
    return subscription;
  });
}

let domDeps;
try {
  domDeps = {
    indexedDB:
      _global.indexedDB ||
      _global.mozIndexedDB ||
      _global.webkitIndexedDB ||
      _global.msIndexedDB,
    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange,
  };
} catch (e) {
  domDeps = { indexedDB: null, IDBKeyRange: null };
}

const Dexie = Dexie$1;
props(Dexie, {
  ...fullNameExceptions,
  delete(databaseName) {
    const db = new Dexie(databaseName, { addons: [] });
    return db.delete();
  },
  exists(name) {
    return new Dexie(name, { addons: [] })
      .open()
      .then((db) => {
        db.close();
        return true;
      })
      .catch("NoSuchDatabaseError", () => false);
  },
  getDatabaseNames(cb) {
    try {
      return getDatabaseNames(Dexie.dependencies).then(cb);
    } catch (_a) {
      return rejection(new exceptions.MissingAPI());
    }
  },
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function (generatorFn) {
    return function () {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function (generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function") return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: () => PSD.trans || null,
  },
  waitFor: function (promiseOrFunction, optionalTimeout) {
    const promise = DexiePromise.resolve(
      typeof promiseOrFunction === "function"
        ? Dexie.ignoreTransaction(promiseOrFunction)
        : promiseOrFunction
    ).timeout(optionalTimeout || 60000);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: () => debug,
    set: (value) => {
      setDebug(value, value === "dexie" ? () => true : dexieStackFrameFilter);
    },
  },
  derive: derive,
  extend: extend,
  props: props,
  override: override,
  Events: Events,
  on: globalEvents,
  liveQuery,
  extendObservabilitySet,
  getByKeyPath: getByKeyPath,
  setByKeyPath: setByKeyPath,
  delByKeyPath: delByKeyPath,
  shallowClone: shallowClone,
  deepClone: deepClone,
  getObjectDiff: getObjectDiff,
  cmp,
  asap: asap$1,
  minKey: minKey,
  addons: [],
  connections: connections,
  errnames: errnames,
  dependencies: domDeps,
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".")
    .map((n) => parseInt(n))
    .reduce((p, c, i) => p + c / Math.pow(10, i * 2)),
});
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);

if (
  typeof dispatchEvent !== "undefined" &&
  typeof addEventListener !== "undefined"
) {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (updatedParts) => {
    if (!propagatingLocally) {
      let event;
      if (isIEOrEdge) {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(
          STORAGE_MUTATED_DOM_EVENT_NAME,
          true,
          true,
          updatedParts
        );
      } else {
        event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
          detail: updatedParts,
        });
      }
      propagatingLocally = true;
      dispatchEvent(event);
      propagatingLocally = false;
    }
  });
  addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({ detail }) => {
    if (!propagatingLocally) {
      propagateLocally(detail);
    }
  });
}
function propagateLocally(updateParts) {
  let wasMe = propagatingLocally;
  try {
    propagatingLocally = true;
    globalEvents.storagemutated.fire(updateParts);
  } finally {
    propagatingLocally = wasMe;
  }
}
let propagatingLocally = false;

if (typeof BroadcastChannel !== "undefined") {
  const bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
  if (typeof bc.unref === "function") {
    bc.unref();
  }
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    if (!propagatingLocally) {
      bc.postMessage(changedParts);
    }
  });
  bc.onmessage = (ev) => {
    if (ev.data) propagateLocally(ev.data);
  };
} else if (typeof self !== "undefined" && typeof navigator !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    try {
      if (!propagatingLocally) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(
            STORAGE_MUTATED_DOM_EVENT_NAME,
            JSON.stringify({
              trig: Math.random(),
              changedParts,
            })
          );
        }
        if (typeof self["clients"] === "object") {
          [...self["clients"].matchAll({ includeUncontrolled: true })].forEach(
            (client) =>
              client.postMessage({
                type: STORAGE_MUTATED_DOM_EVENT_NAME,
                changedParts,
              })
          );
        }
      }
    } catch (_a) {}
  });
  if (typeof addEventListener !== "undefined") {
    addEventListener("storage", (ev) => {
      if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
        const data = JSON.parse(ev.newValue);
        if (data) propagateLocally(data.changedParts);
      }
    });
  }
  const swContainer = self.document && navigator.serviceWorker;
  if (swContainer) {
    swContainer.addEventListener("message", propagateMessageLocally);
  }
}
function propagateMessageLocally({ data }) {
  if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
    propagateLocally(data.changedParts);
  }
}

DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

var name = "@mktcodelib/github-scanner";
var version = "0.1.1";
var description = "Utilities to fetch larger amounts of data from GitHub.";
var main = "dist/index.js";
var module$1 = "dist/index.mjs";
var types = "dist/index.d.ts";
var scripts = {
  test: "jest",
  build:
    "tsup src/index.ts --format esm,cjs --dts && rollup -c rollup.config.mjs",
  lint: "eslint .",
};
var keywords = [];
var author = "mktcode";
var license = "UNLICENSE";
var repository = {
  type: "git",
  url: "https://github.com/mktcode/lib.git",
};
var homepage =
  "https://github.com/mktcode/lib/tree/master/packages/github-scanner#readme";
var dependencies = {
  "@mktcodelib/graphql-fetch-all": "workspace:^0.7.0",
  "@octokit-next/core": "^2.7.0",
  "@types/lodash": "^4.14.191",
  dexie: "^3.2.3",
  graphql: "^16.6.0",
  "graphql-tag": "^2.12.6",
  lodash: "^4.17.21",
  "rollup-plugin-node-polyfills": "^0.2.1",
};
var devDependencies = {
  "@rollup/plugin-json": "^6.0.0",
  "@rollup/plugin-node-resolve": "^15.0.1",
  "@rollup/plugin-typescript": "^11.0.0",
  rollup: "^3.20.2",
};
var pkg = {
  name: name,
  version: version,
  description: description,
  main: main,
  module: module$1,
  types: types,
  scripts: scripts,
  keywords: keywords,
  author: author,
  license: license,
  repository: repository,
  homepage: homepage,
  dependencies: dependencies,
  devDependencies: devDependencies,
};

class Db extends Dexie$1 {
  constructor() {
    super(`${pkg.name}-${pkg.version}`);
    this.version(1).stores({
      scans: "++id, hash, done",
    });
  }
}
const db = new Db();

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function isPlainObject$1(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  );
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);

  Object.keys(options).forEach((key) => {
    if (isPlainObject$1(options[key])) {
      if (!(key in defaults)) Object.assign(result, { [key]: options[key] });
      else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });

  return result;
}

function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }

  // lowercase header names before merging with defaults to avoid duplicates
  options.headers = lowercaseKeys(options.headers);

  // remove properties with undefined values before merging
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);

  const mergedOptions = mergeDeep(defaults || {}, options);

  // mediaType.previews arrays are merged, instead of overwritten
  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews
      .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
      .concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(
    (preview) => preview.replace(/-preview/, "")
  );

  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  const query = names
    .map((name) => {
      if (name === "q") {
        return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
      }

      return `${name}=${encodeURIComponent(parameters[name])}`;
    })
    .join("&");

  return url + separator + query;
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object)
    .filter((option) => !keysToOmit.includes(option))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:

//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* c8 ignore start */

function encodeReserved(str) {
  return str
    .split(/(%[0-9A-Fa-f]{2})/g)
    .map(function (part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
      }
      return part;
    })
    .join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value =
    operator === "+" || operator === "#"
      ? encodeReserved(value)
      : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
    result = [];

  if (isDefined(value) && value !== "") {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : "")
      );
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(
              encodeValue(operator, value, isKeyOperator(operator) ? key : "")
            );
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template),
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];

  return template.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function (_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];

        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }

        expression.split(/,/g).forEach(function (variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });

        if (operator && operator !== "+") {
          var separator = ",";

          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    }
  );
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase();

  // replace :varname with {varname} to make it RFC 6570 compatible
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType",
  ]);

  // extract variable names from URL to calculate remaining variables later
  const urlVariableNames = extractUrlVariableNames(url);

  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options)
    .filter((option) => urlVariableNames.includes(option))
    .concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);

  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept
        .split(/,/)
        .map((preview) =>
          preview.replace(
            /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
            `application/vnd$1$2.${options.mediaType.format}`
          )
        )
        .join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader =
        headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader
        .concat(options.mediaType.previews)
        .map((preview) => {
          const format = options.mediaType.format
            ? `.${options.mediaType.format}`
            : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        })
        .join(",");
    }
  }

  // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }

  // default content-type for JSON if body is set
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }

  // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }

  // Only return body/request keys if present
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults$2(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);

  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults$2.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse,
  });
}

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${
      process.arch
    })`;
  }

  return "<environment undetectable>";
}

const VERSION$3 = "2.7.0";

const userAgent = `octokit-next-endpoint.js/${VERSION$3} ${getUserAgent()}`;

// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent,
  },
  mediaType: {
    format: "",
    previews: [],
  },
};

const endpoint = withDefaults$2(null, DEFAULTS);

const VERSION$2 = "2.7.0";

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}

function isPlainObject(o) {
  var ctor, prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

/**
 * Error with extra properties to help with debugging
 */
class RequestError extends Error {
  name;

  /**
   * http status code
   */
  status;

  /**
   * Request options that lead to the error.
   */
  request;

  /**
   * Response object if a response was received
   */
  response;

  constructor(message, statusCode, options) {
    super(message);

    // Maintains proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;

    if ("response" in options) {
      this.response = options.response;
    }

    // redact request credentials without mutating original request options
    const requestCopy = { ...options.request };
    if (options.request.headers.authorization) {
      requestCopy.headers = {
        ...options.request.headers,
        authorization: options.request.headers.authorization.replace(
          / .*$/,
          " [REDACTED]"
        ),
      };
    }

    requestCopy.url = requestCopy.url
      // client_id & client_secret can be passed as URL query parameters to increase rate limit
      // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
      .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
      // OAuth tokens can be passed as URL query parameters, although it is not recommended
      // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
      .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");

    this.request = requestCopy;
  }
}

/* c8 ignore next 4 */
// TODO: figure out how to test buffers
function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  const log = requestOptions.request?.log || console;

  if (
    isPlainObject(requestOptions.body) ||
    Array.isArray(requestOptions.body)
  ) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let responseHeaders = {};
  let status;
  let url;

  const { redirect, fetch, ...remainingRequestOptions } =
    requestOptions.request || {};

  const fetchOptions = {
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect,
    ...remainingRequestOptions,
  };

  const requestOrGlobalFetch = fetch || globalThis.fetch;

  return requestOrGlobalFetch(requestOptions.url, fetchOptions)
    .then(async (response) => {
      url = response.url;
      status = response.status;

      for (const keyAndValue of response.headers) {
        responseHeaders[keyAndValue[0]] = keyAndValue[1];
      }

      if ("deprecation" in responseHeaders) {
        const matches =
          responseHeaders.link &&
          responseHeaders.link.match(/<([^>]+)>; rel="deprecation"/);
        const deprecationLink = matches && matches.pop();
        log.warn(
          `[@octokit/request] "${requestOptions.method} ${
            requestOptions.url
          }" is deprecated. It is scheduled to be removed on ${
            responseHeaders.sunset
          }${deprecationLink ? `. See ${deprecationLink}` : ""}`
        );
      }

      if (status === 204 || status === 205) {
        return;
      }

      // GitHub API returns 200 for HEAD requests
      if (requestOptions.method === "HEAD") {
        if (status < 400) {
          return;
        }
        throw new RequestError(response.statusText, status, {
          response: {
            url,
            status,
            headers: responseHeaders,
            data: undefined,
          },
          request: requestOptions,
        });
      }

      if (status === 304) {
        throw new RequestError("Not modified", status, {
          response: {
            url,
            status,
            headers: responseHeaders,
            data: await getResponseData(response),
          },
          request: requestOptions,
        });
      }

      if (status >= 400) {
        const data = await getResponseData(response);
        const error = new RequestError(toErrorMessage(data), status, {
          response: {
            url,
            status,
            headers: responseHeaders,
            data,
          },
          request: requestOptions,
        });
        throw error;
      }

      return getResponseData(response);
    })

    .then((data) => {
      return {
        status,
        url,
        headers: responseHeaders,
        data,
      };
    })

    .catch((error) => {
      if (error instanceof RequestError) throw error;

      if (error.name === "AbortError") throw error;

      throw new RequestError(error.message, 500, {
        request: requestOptions,
      });
    });
}

async function getResponseData(response) {
  const contentType = response.headers.get("content-type");

  if (/application\/json/.test(contentType)) {
    return response.json();
  }

  if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    return response.text();
  }
  /* c8 ignore next 2 */
  // TODO: figure out how to test buffers
  return getBufferResponse(response);
}

function toErrorMessage(data) {
  if (typeof data === "string") return data;

  if ("message" in data) {
    if (Array.isArray(data.errors)) {
      return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}`;
    }
    return data.message;
  }
  /* c8 ignore next 2 */
  // shouldn't happen, but just in case
  return `Unknown error: ${JSON.stringify(data)}`;
}

function withDefaults$1(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);
  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults$1.bind(null, endpoint),
    });

    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults$1.bind(null, endpoint),
  });
}

const request = withDefaults$1(endpoint, {
  headers: {
    "user-agent": `octokit-next-request.js/${VERSION$2} ${getUserAgent()}`,
  },
});

// @ts-check

const REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
const REGEX_IS_INSTALLATION = /^ghs_/;
const REGEX_IS_USER_TO_SERVER = /^ghu_/;

async function auth(token) {
  const isApp = token.split(/\./).length === 3;
  const isInstallation =
    REGEX_IS_INSTALLATION_LEGACY.test(token) ||
    REGEX_IS_INSTALLATION.test(token);
  const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);

  const tokenType = isApp
    ? "app"
    : isInstallation
    ? "installation"
    : isUserToServer
    ? "user-to-server"
    : "oauth";

  return {
    type: "token",
    token: token,
    tokenType,
  };
}

// @ts-check

/**
 * Prefix token for usage in the Authorization header
 *
 * @param {string} token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

// @ts-check

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);

  endpoint.headers.authorization = withAuthorizationPrefix(token);

  return request(endpoint);
}

// @ts-check

function createTokenAuth(options) {
  if (!options?.token) {
    throw new Error(
      "[@octokit/auth-token] options.token not set for createTokenAuth(options)"
    );
  }

  if (typeof options?.token !== "string") {
    throw new Error(
      "[@octokit/auth-token] options.token is not a string for createTokenAuth(options)"
    );
  }

  const token = options.token.replace(/^(token|bearer) +/i, "");

  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token),
  });
}

const VERSION$1 = "2.7.0";

function _buildMessageForResponseErrors(data) {
  return (
    `Request failed due to following response errors:\n` +
    data.errors.map((e) => ` - ${e.message}`).join("\n")
  );
}

class GraphqlResponseError extends Error {
  constructor(request, headers, response) {
    super(_buildMessageForResponseErrors(response));

    this.request = request;
    this.headers = headers;
    this.response = response;
    this.name = "GraphqlResponseError";
    // Expose the errors and response data in their shorthand properties.
    this.errors = response.errors;
    this.data = response.data;

    // Maintains proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
];

const FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];

const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;

function graphql(request, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }

    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;

      return Promise.reject(
        new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`)
      );
    }
  }

  const parsedOptions =
    typeof query === "string" ? Object.assign({ query }, options) : query;

  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = parsedOptions[key];
    return result;
  }, {});

  // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
  // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451
  const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }

  return request(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlResponseError(requestOptions, headers, response.data);
    }

    return response.data.data;
  });
}

function withDefaults(oldRequest, newDefaults) {
  const newRequest = oldRequest.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: newRequest.endpoint,
  });
}

withDefaults(request, {
  headers: {
    "user-agent": `octokit-next-graphql.js/${VERSION$1} ${getUserAgent()}`,
  },
  method: "POST",
  url: "/graphql",
});

function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql",
  });
}

// @ts-check

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce((callback, name) => {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(() => {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce((method, registered) => {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}

// @ts-check

function addHook(state, kind, name, hook) {
  const orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = (method, options) => {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = (method, options) => {
      let result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then((result_) => {
          result = result_;
          return orig(result, options);
        })
        .then(() => {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = (method, options) => {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch((error) => {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}

// @ts-check

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  const index = state.registry[name]
    .map((registered) => {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}

// @ts-check

// bind with array of arguments: https://stackoverflow.com/a/21792913
const bind = Function.bind;
const bindable = bind.bind(bind);

function bindApi(hook, state, name) {
  const removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach((kind) => {
    const args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
  });
}

function Singular() {
  const singularHookName = Symbol("Singular");
  const singularHookState = {
    registry: {},
  };
  const singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}

function Collection() {
  const state = {
    registry: {},
  };

  const hook = register.bind(null, state);
  bindApi(hook, state);

  return hook;
}

var Hook = { Singular, Collection };

const VERSION = "2.7.0";

class Octokit {
  static VERSION = VERSION;
  static DEFAULTS = {
    baseUrl: endpoint.DEFAULTS.baseUrl,
    userAgent: `octokit-next-core.js/${VERSION} ${getUserAgent()}`,
  };

  static withPlugins(newPlugins) {
    const currentPlugins = this.PLUGINS;
    return class extends this {
      static PLUGINS = currentPlugins.concat(
        newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
      );
    };
  }

  static withDefaults(defaults) {
    const newDefaultUserAgent = [defaults?.userAgent, this.DEFAULTS.userAgent]
      .filter(Boolean)
      .join(" ");

    const newDefaults = {
      ...this.DEFAULTS,
      ...defaults,
      userAgent: newDefaultUserAgent,
      request: {
        ...this.DEFAULTS.request,
        ...defaults?.request,
      },
    };

    return class extends this {
      constructor(options) {
        if (typeof defaults === "function") {
          super(defaults(options, newDefaults));
          return;
        }

        super(options);
      }

      static DEFAULTS = newDefaults;
    };
  }

  static PLUGINS = [];

  constructor(options = {}) {
    this.options = {
      ...this.constructor.DEFAULTS,
      ...options,
      request: {
        ...this.constructor.DEFAULTS.request,
        ...options?.request,
      },
    };

    const hook = new Hook.Collection();

    const requestDefaults = {
      baseUrl: this.options.baseUrl,
      headers: {},
      request: {
        ...this.options.request,
        hook: hook.bind(null, "request"),
      },
      mediaType: {
        previews: [],
        format: "",
      },
    };

    // prepend default user agent with `options.userAgent` if set
    const userAgent = [options?.userAgent, this.constructor.DEFAULTS.userAgent]
      .filter(Boolean)
      .join(" ");

    requestDefaults.headers["user-agent"] = userAgent;

    if (this.options.previews) {
      requestDefaults.mediaType.previews = this.options.previews;
    }

    if (this.options.timeZone) {
      requestDefaults.headers["time-zone"] = this.options.timeZone;
    }

    // Apply plugins
    this.constructor.PLUGINS.forEach((plugin) => {
      Object.assign(this, plugin(this, this.options));
    });

    // API
    this.request = request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign(
      {
        debug: () => {},
        info: () => {},
        warn: console.warn.bind(console),
        error: console.error.bind(console),
      },
      this.options.log
    );
    this.hook = hook;

    // Auth
    // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    if (!this.options.authStrategy) {
      if (!this.options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated",
        });
      } else {
        // (2)
        const auth = createTokenAuth({ token: this.options.auth });
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      // (3)
      const { authStrategy, ...otherOptions } = this.options;
      const auth = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions,
          },
          this.options.auth
        )
      );
      hook.wrap("request", auth.hook);
      this.auth = auth;
    }
  }
}

function getClient(accessToken, sourceUrl) {
  const client = new Octokit({ auth: accessToken, baseUrl: sourceUrl });
  return client;
}
function hashQuery(query, variables) {
  return __awaiter(this, void 0, void 0, function* () {
    const hashAsArrayBuffer = yield crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify({ query, variables }))
    );
    const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer);
    const hashAsString = Array.from(uint8ViewOfHash)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashAsString;
  });
}

onmessage = (event) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    let {
      query,
      variables,
      maxPerPage,
      currentData,
      paginators,
      accessToken,
      sourceUrl,
    } = event.data;
    const client = getClient(accessToken, sourceUrl);
    const hash = yield hashQuery(query, variables);
    paginators = paginators || getHighestLevelPaginators(query);
    const scanId = yield db.scans.add({
      hash,
      query,
      variables,
      paginators,
      maxPerPage,
      done: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const fetcher = graphqlFetchAll({
      client: client.graphql,
      query,
      variables,
      paginators,
      currentData,
      maxPerPage,
    });
    let finalData;
    let finalPaginators;
    let finalVariables;
    try {
      for (
        var _d = true, fetcher_1 = __asyncValues(fetcher), fetcher_1_1;
        (fetcher_1_1 = yield fetcher_1.next()), (_a = fetcher_1_1.done), !_a;

      ) {
        _c = fetcher_1_1.value;
        _d = false;
        try {
          const { data, paginators, variables } = _c;
          yield db.scans.update(scanId, {
            data,
            variables,
            paginators,
            done: paginators.every((paginator) => paginator.done) ? 1 : 0,
            updatedAt: new Date().toISOString(),
          });
          finalData = data;
          finalPaginators = paginators;
          finalVariables = variables;
          postMessage({
            type: "update",
            payload: {
              scanId,
              data,
              paginators,
              variables,
            },
          });
        } finally {
          _d = true;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (!_d && !_a && (_b = fetcher_1.return)) yield _b.call(fetcher_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    postMessage({
      type: "done",
      payload: {
        scanId,
        data: finalData,
        paginators: finalPaginators,
        variables: finalVariables,
      },
    });
  });
//# sourceMappingURL=github-scan-worker.js.map
