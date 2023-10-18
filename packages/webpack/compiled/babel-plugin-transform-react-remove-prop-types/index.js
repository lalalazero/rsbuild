(() => {
  'use strict';
  var e = {
    13: (e, r) => {
      Object.defineProperty(r, '__esModule', { value: true });
      r['default'] = isAnnotatedForRemoval;
      function isAnnotatedForRemoval(e) {
        var r = e.trailingComments || [];
        return Boolean(
          r.find(function (e) {
            var r = e.value;
            return r.trim() === 'remove-proptypes';
          }),
        );
      }
    },
    551: (e, r) => {
      Object.defineProperty(r, '__esModule', { value: true });
      r['default'] = isStatelessComponent;
      var t = Symbol('traversed');
      function isJSXElementOrReactCreateElement(e) {
        var r = false;
        e.traverse({
          CallExpression: function CallExpression(e) {
            var t = e.get('callee');
            if (
              t.matchesPattern('React.createElement') ||
              t.matchesPattern('React.cloneElement') ||
              t.node.name === 'cloneElement'
            ) {
              r = true;
            }
          },
          JSXElement: function JSXElement() {
            r = true;
          },
        });
        return r;
      }
      function isReturningJSXElement(e) {
        var r =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        if (
          e.node.init &&
          e.node.init.body &&
          isJSXElementOrReactCreateElement(e)
        ) {
          return true;
        }
        if (r > 20) {
          throw new Error(
            'transform-react-remove-prop-type: infinite loop detected.',
          );
        }
        var a = false;
        e.traverse({
          ReturnStatement: function ReturnStatement(n) {
            if (a) {
              return;
            }
            var i = n.get('argument');
            if (!i.node) {
              return;
            }
            if (isJSXElementOrReactCreateElement(n)) {
              a = true;
              return;
            }
            if (i.node.type === 'CallExpression') {
              var o = i.get('callee').node.name;
              var s = e.scope.getBinding(o);
              if (!s) {
                return;
              }
              if (s.path[t]) {
                return;
              }
              s.path[t] = true;
              if (isReturningJSXElement(s.path, r + 1)) {
                a = true;
              }
            }
          },
        });
        return a;
      }
      var a = ['VariableDeclarator', 'FunctionDeclaration'];
      function isStatelessComponent(e) {
        if (a.indexOf(e.node.type) === -1) {
          return false;
        }
        if (isReturningJSXElement(e)) {
          return true;
        }
        return false;
      }
    },
    442: (e, r) => {
      Object.defineProperty(r, '__esModule', { value: true });
      r['default'] = remove;
      function isInside(e, r) {
        if (!e.hub.file.opts) {
          return true;
        }
        var t = e.hub.file.opts.filename;
        if (!t) {
          return true;
        }
        if (!r) {
          return false;
        }
        return r.test(t);
      }
      function remove(e, r, t) {
        var a = r.visitedKey,
          n = r.unsafeWrapTemplate,
          i = r.wrapTemplate,
          o = r.mode,
          s = r.ignoreFilenames,
          u = r.types;
        if (s && isInside(e.scope, s)) {
          return;
        }
        if (e.node[a]) {
          return;
        }
        e.node[a] = true;
        if (o === 'remove') {
          if (e.parentPath.type === 'ConditionalExpression') {
            e.replaceWith(u.unaryExpression('void', u.numericLiteral(0)));
          } else {
            e.remove();
          }
          return;
        }
        if (o === 'wrap' || o === 'unsafe-wrap') {
          switch (t.type) {
            case 'createClass':
              break;
            case 'class static': {
              var l;
              var p = t.pathClassDeclaration;
              if (!p.isClassExpression() && p.node.id) {
                l = p.node.id;
              } else {
                return;
              }
              var f = u.expressionStatement(
                u.assignmentExpression(
                  '=',
                  u.memberExpression(l, e.node.key),
                  e.node.value,
                ),
              );
              if (p.parentPath.isExportDeclaration()) {
                p = p.parentPath;
              }
              p.insertAfter(f);
              e.remove();
              break;
            }
            case 'assign':
              if (o === 'unsafe-wrap') {
                e.replaceWith(n({ NODE: e.node }));
              } else {
                e.replaceWith(i({ LEFT: e.node.left, RIGHT: e.node.right }));
              }
              e.node[a] = true;
              break;
            case 'declarator':
              e.replaceWith(
                i(
                  { LEFT: e.node.id, RIGHT: e.node.init },
                  { as: 'variableDeclarator' },
                ),
              );
              e.node[a] = true;
              break;
            default:
              break;
          }
          return;
        }
        throw new Error(
          'transform-react-remove-prop-type: unsupported mode '.concat(o, '.'),
        );
      }
    },
  };
  var r = {};
  function __nccwpck_require__(t) {
    var a = r[t];
    if (a !== undefined) {
      return a.exports;
    }
    var n = (r[t] = { exports: {} });
    var i = true;
    try {
      e[t](n, n.exports, __nccwpck_require__);
      i = false;
    } finally {
      if (i) delete r[t];
    }
    return n.exports;
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/';
  var t = {};
  (() => {
    var e = t;
    Object.defineProperty(e, '__esModule', { value: true });
    e['default'] = _default;
    var r = _interopRequireDefault(__nccwpck_require__(13));
    var a = _interopRequireDefault(__nccwpck_require__(551));
    var n = _interopRequireDefault(__nccwpck_require__(442));
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = arguments[r] != null ? arguments[r] : {};
        var a = Object.keys(t);
        if (typeof Object.getOwnPropertySymbols === 'function') {
          a = a.concat(
            Object.getOwnPropertySymbols(t).filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            }),
          );
        }
        a.forEach(function (r) {
          _defineProperty(e, r, t[r]);
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      if (r in e) {
        Object.defineProperty(e, r, {
          value: t,
          enumerable: true,
          configurable: true,
          writable: true,
        });
      } else {
        e[r] = t;
      }
      return e;
    }
    function isPathReactClass(e, r) {
      var t = e.node;
      var a = r.classNameMatchers;
      if (
        e.matchesPattern('React.Component') ||
        e.matchesPattern('React.PureComponent')
      ) {
        return true;
      }
      if (t && (t.name === 'Component' || t.name === 'PureComponent')) {
        return true;
      }
      if (t && a && a.test(t.name)) {
        return true;
      }
      return false;
    }
    function isReactClass(e, r, t) {
      if (!e.node) {
        return false;
      }
      var a = false;
      if (isPathReactClass(e, t)) {
        a = true;
      } else if (e.node.name) {
        var n = e.node.name;
        var i = r.getBinding(n);
        if (!i) {
          a = false;
        } else {
          var o = i.path.get('superClass');
          if (isPathReactClass(o, t)) {
            a = true;
          }
        }
      }
      return a;
    }
    function areSetsEqual(e, r) {
      if (e === r) {
        return true;
      }
      if (e.size !== r.size) {
        return false;
      }
      return !Array.from(e).some(function (e) {
        return !r.has(e);
      });
    }
    function memberExpressionRootIdentifier(e) {
      var r = e.findParent(function (e) {
        return !e.isMemberExpression();
      });
      var t = r.node.type;
      var a;
      if (t === 'ObjectProperty') {
        a = r.get('value');
      }
      if (!a || a.type !== 'MemberExpression') {
        return null;
      }
      while (a.node.object.type === 'MemberExpression') {
        a = a.get('object');
      }
      return a.get('object');
    }
    function _default(e) {
      var t = e.template,
        i = e.types,
        o = e.traverse;
      var s = new Set();
      var u = new WeakSet();
      var l = {
        Identifier: function Identifier(e) {
          if (e.parent.type === 'MemberExpression') {
            var r = memberExpressionRootIdentifier(e);
            if (r) {
              s.add(r.node.name);
            }
            return;
          }
          if (
            e.parent.type === 'ObjectProperty' &&
            (e.parent.key === e.node || e.parent.shorthand)
          ) {
            return;
          }
          s.add(e.node.name);
        },
      };
      return {
        visitor: {
          Program: function Program(p, f) {
            var c;
            var d;
            if (f.opts.ignoreFilenames) {
              c = new RegExp(f.opts.ignoreFilenames.join('|'), 'i');
            } else {
              c = undefined;
            }
            if (f.opts.classNameMatchers) {
              d = new RegExp(f.opts.classNameMatchers.join('|'));
            } else {
              d = undefined;
            }
            var m = {
              visitedKey: 'transform-react-remove-prop-types'.concat(
                Date.now(),
              ),
              unsafeWrapTemplate: t(
                '\n              if (process.env.NODE_ENV !== "production") {\n                NODE;\n              }\n            ',
                { placeholderPattern: /^NODE$/ },
              ),
              wrapTemplate: function wrapTemplate(e) {
                var r = e.LEFT,
                  a = e.RIGHT;
                var n =
                  arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : {};
                var o = n.as,
                  s = o === void 0 ? 'assignmentExpression' : o;
                var u = t.expression(
                  '\n                process.env.NODE_ENV !== "production" ? RIGHT : {}\n              ',
                  { placeholderPattern: /^(LEFT|RIGHT)$/ },
                )({ RIGHT: a });
                switch (s) {
                  case 'variableDeclarator':
                    return i.variableDeclarator(r, u);
                  case 'assignmentExpression':
                    return i.assignmentExpression('=', r, u);
                  default:
                    throw new Error('unrecognized template type '.concat(s));
                }
              },
              mode: f.opts.mode || 'remove',
              ignoreFilenames: c,
              types: i,
              removeImport: f.opts.removeImport || false,
              libraries: (f.opts.additionalLibraries || []).concat(
                'prop-types',
              ),
              classNameMatchers: d,
              createReactClassName:
                f.opts.createReactClassName || 'createReactClass',
            };
            if (f.opts.plugins) {
              var v = f;
              var y = f.opts.plugins.map(function (r) {
                var t = typeof r === 'string' ? r : r[0];
                if (typeof r !== 'string') {
                  v.opts = _objectSpread({}, v.opts, r[1]);
                }
                var a = require(t);
                if (typeof a !== 'function') {
                  a = a.default;
                }
                return a(e).visitor;
              });
              o(p.parent, o.visitors.merge(y), p.scope, v, p.parentPath);
            }
            p.traverse({
              ObjectProperty: {
                exit: function exit(e) {
                  var r = e.node;
                  if (r.computed || r.key.name !== 'propTypes') {
                    return;
                  }
                  var t = e.findParent(function (e) {
                    if (e.type !== 'CallExpression') {
                      return false;
                    }
                    return (
                      e.get('callee').node.name === m.createReactClassName ||
                      (e.get('callee').node.property &&
                        e.get('callee').node.property.name === 'createClass')
                    );
                  });
                  if (t) {
                    e.traverse(l);
                    u.add(e);
                    (0, n.default)(e, m, { type: 'createClass' });
                  }
                },
              },
              ClassProperty: function ClassProperty(e) {
                var r = e.node,
                  t = e.scope;
                if (r.key.name === 'propTypes') {
                  var a = t.path;
                  if (isReactClass(a.get('superClass'), t, m)) {
                    e.traverse(l);
                    u.add(e);
                    (0, n.default)(e, m, {
                      type: 'class static',
                      pathClassDeclaration: a,
                    });
                  }
                }
              },
              AssignmentExpression: function AssignmentExpression(e) {
                var t = e.node,
                  i = e.scope;
                if (
                  t.left.computed ||
                  !t.left.property ||
                  t.left.property.name !== 'propTypes'
                ) {
                  return;
                }
                var o = (0, r.default)(e.node.left);
                if (o) {
                  e.traverse(l);
                  u.add(e);
                  (0, n.default)(e, m, { type: 'assign' });
                  return;
                }
                var s = t.left.object.name;
                var p = i.getBinding(s);
                if (!p) {
                  return;
                }
                if (p.path.isClassDeclaration()) {
                  var f = p.path.get('superClass');
                  if (isReactClass(f, i, m)) {
                    e.traverse(l);
                    u.add(e);
                    (0, n.default)(e, m, { type: 'assign' });
                  }
                } else if ((0, a.default)(p.path)) {
                  e.traverse(l);
                  u.add(e);
                  (0, n.default)(e, m, { type: 'assign' });
                }
              },
            });
            var g = 0;
            var b = {
              VariableDeclarator: function VariableDeclarator(e) {
                if (e.scope.block.type !== 'Program') {
                  return;
                }
                if (
                  ['ObjectPattern', 'ArrayPattern'].includes(e.node.id.type)
                ) {
                  return;
                }
                var r = e.node.id.name;
                if (!s.has(r)) {
                  return;
                }
                var t = e.scope.getBinding(r),
                  a = t.referencePaths;
                var i = a.some(function (e) {
                  var r = e.find(function (e) {
                    return u.has(e);
                  });
                  return !r;
                });
                if (i) {
                  g += 1;
                  return;
                }
                u.add(e);
                s.delete(r);
                e.get('init').traverse(l);
                (0, n.default)(e, m, { type: 'declarator' });
              },
            };
            var _ = new Set();
            while (!areSetsEqual(s, _) && s.size > 0 && g < s.size) {
              _ = new Set(s);
              g = 0;
              p.scope.crawl();
              p.traverse(b);
            }
            if (m.removeImport) {
              if (m.mode === 'remove') {
                p.scope.crawl();
                p.traverse({
                  ImportDeclaration: function ImportDeclaration(e) {
                    var r = e.node,
                      t = r.source,
                      a = r.specifiers;
                    var n = m.libraries.some(function (e) {
                      if (e instanceof RegExp) {
                        return e.test(t.value);
                      }
                      return t.value === e;
                    });
                    if (!n) {
                      return;
                    }
                    var i = a.some(function (r) {
                      var t = r.local.name;
                      var a = e.scope.getBinding(t),
                        n = a.referencePaths;
                      return n.length > 0;
                    });
                    if (!i) {
                      e.remove();
                    }
                  },
                });
              } else {
                throw new Error(
                  'transform-react-remove-prop-type: removeImport = true and mode != "remove" can not be used at the same time.',
                );
              }
            }
          },
        },
      };
    }
  })();
  module.exports = t;
})();