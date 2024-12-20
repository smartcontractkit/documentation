/* eslint-disable */
"use strict"
var Xr = Object.defineProperty
var Hr = (a, s, l) => (s in a ? Xr(a, s, { enumerable: !0, configurable: !0, writable: !0, value: l }) : (a[s] = l))
var te = (a, s, l) => Hr(a, typeof s != "symbol" ? s + "" : s, l)
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
const k = require("react"),
  Gr = require("react-dom")
var ge = { exports: {} },
  ie = {}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var nr
function Kr() {
  if (nr) return ie
  nr = 1
  var a = k,
    s = Symbol.for("react.element"),
    l = Symbol.for("react.fragment"),
    d = Object.prototype.hasOwnProperty,
    y = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    p = { key: !0, ref: !0, __self: !0, __source: !0 }
  function h(e, r, n) {
    var c,
      i = {},
      u = null,
      m = null
    n !== void 0 && (u = "" + n), r.key !== void 0 && (u = "" + r.key), r.ref !== void 0 && (m = r.ref)
    for (c in r) d.call(r, c) && !p.hasOwnProperty(c) && (i[c] = r[c])
    if (e && e.defaultProps) for (c in ((r = e.defaultProps), r)) i[c] === void 0 && (i[c] = r[c])
    return { $$typeof: s, type: e, key: u, ref: m, props: i, _owner: y.current }
  }
  return (ie.Fragment = l), (ie.jsx = h), (ie.jsxs = h), ie
}
var ce = {}
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var sr
function Yr() {
  return (
    sr ||
      ((sr = 1),
      process.env.NODE_ENV !== "production" &&
        (function () {
          var a = k,
            s = Symbol.for("react.element"),
            l = Symbol.for("react.portal"),
            d = Symbol.for("react.fragment"),
            y = Symbol.for("react.strict_mode"),
            p = Symbol.for("react.profiler"),
            h = Symbol.for("react.provider"),
            e = Symbol.for("react.context"),
            r = Symbol.for("react.forward_ref"),
            n = Symbol.for("react.suspense"),
            c = Symbol.for("react.suspense_list"),
            i = Symbol.for("react.memo"),
            u = Symbol.for("react.lazy"),
            m = Symbol.for("react.offscreen"),
            g = Symbol.iterator,
            q = "@@iterator"
          function A(t) {
            if (t === null || typeof t != "object") return null
            var f = (g && t[g]) || t[q]
            return typeof f == "function" ? f : null
          }
          var C = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
          function P(t) {
            {
              for (var f = arguments.length, w = new Array(f > 1 ? f - 1 : 0), v = 1; v < f; v++)
                w[v - 1] = arguments[v]
              E("error", t, w)
            }
          }
          function E(t, f, w) {
            {
              var v = C.ReactDebugCurrentFrame,
                S = v.getStackAddendum()
              S !== "" && ((f += "%s"), (w = w.concat([S])))
              var j = w.map(function (b) {
                return String(b)
              })
              j.unshift("Warning: " + f), Function.prototype.apply.call(console[t], console, j)
            }
          }
          var I = !1,
            K = !1,
            de = !1,
            ve = !1,
            he = !1,
            O
          O = Symbol.for("react.module.reference")
          function ae(t) {
            return !!(
              typeof t == "string" ||
              typeof t == "function" ||
              t === d ||
              t === p ||
              he ||
              t === y ||
              t === n ||
              t === c ||
              ve ||
              t === m ||
              I ||
              K ||
              de ||
              (typeof t == "object" &&
                t !== null &&
                (t.$$typeof === u ||
                  t.$$typeof === i ||
                  t.$$typeof === h ||
                  t.$$typeof === e ||
                  t.$$typeof === r ||
                  t.$$typeof === O ||
                  t.getModuleId !== void 0))
            )
          }
          function Y(t, f, w) {
            var v = t.displayName
            if (v) return v
            var S = f.displayName || f.name || ""
            return S !== "" ? w + "(" + S + ")" : w
          }
          function z(t) {
            return t.displayName || "Context"
          }
          function U(t) {
            if (t == null) return null
            if (
              (typeof t.tag == "number" &&
                P(
                  "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
                ),
              typeof t == "function")
            )
              return t.displayName || t.name || null
            if (typeof t == "string") return t
            switch (t) {
              case d:
                return "Fragment"
              case l:
                return "Portal"
              case p:
                return "Profiler"
              case y:
                return "StrictMode"
              case n:
                return "Suspense"
              case c:
                return "SuspenseList"
            }
            if (typeof t == "object")
              switch (t.$$typeof) {
                case e:
                  var f = t
                  return z(f) + ".Consumer"
                case h:
                  var w = t
                  return z(w._context) + ".Provider"
                case r:
                  return Y(t, t.render, "ForwardRef")
                case i:
                  var v = t.displayName || null
                  return v !== null ? v : U(t.type) || "Memo"
                case u: {
                  var S = t,
                    j = S._payload,
                    b = S._init
                  try {
                    return U(b(j))
                  } catch {
                    return null
                  }
                }
              }
            return null
          }
          var V = Object.assign,
            B = 0,
            $,
            ne,
            Ue,
            Me,
            We,
            Fe,
            Ve
          function Xe() {}
          Xe.__reactDisabledLog = !0
          function pr() {
            {
              if (B === 0) {
                ;($ = console.log),
                  (ne = console.info),
                  (Ue = console.warn),
                  (Me = console.error),
                  (We = console.group),
                  (Fe = console.groupCollapsed),
                  (Ve = console.groupEnd)
                var t = { configurable: !0, enumerable: !0, value: Xe, writable: !0 }
                Object.defineProperties(console, {
                  info: t,
                  log: t,
                  warn: t,
                  error: t,
                  group: t,
                  groupCollapsed: t,
                  groupEnd: t,
                })
              }
              B++
            }
          }
          function gr() {
            {
              if ((B--, B === 0)) {
                var t = { configurable: !0, enumerable: !0, writable: !0 }
                Object.defineProperties(console, {
                  log: V({}, t, { value: $ }),
                  info: V({}, t, { value: ne }),
                  warn: V({}, t, { value: Ue }),
                  error: V({}, t, { value: Me }),
                  group: V({}, t, { value: We }),
                  groupCollapsed: V({}, t, { value: Fe }),
                  groupEnd: V({}, t, { value: Ve }),
                })
              }
              B < 0 && P("disabledDepth fell below zero. This is a bug in React. Please file an issue.")
            }
          }
          var qe = C.ReactCurrentDispatcher,
            xe
          function me(t, f, w) {
            {
              if (xe === void 0)
                try {
                  throw Error()
                } catch (S) {
                  var v = S.stack.trim().match(/\n( *(at )?)/)
                  xe = (v && v[1]) || ""
                }
              return (
                `
` +
                xe +
                t
              )
            }
          }
          var be = !1,
            fe
          {
            var wr = typeof WeakMap == "function" ? WeakMap : Map
            fe = new wr()
          }
          function He(t, f) {
            if (!t || be) return ""
            {
              var w = fe.get(t)
              if (w !== void 0) return w
            }
            var v
            be = !0
            var S = Error.prepareStackTrace
            Error.prepareStackTrace = void 0
            var j
            ;(j = qe.current), (qe.current = null), pr()
            try {
              if (f) {
                var b = function () {
                  throw Error()
                }
                if (
                  (Object.defineProperty(b.prototype, "props", {
                    set: function () {
                      throw Error()
                    },
                  }),
                  typeof Reflect == "object" && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(b, [])
                  } catch (D) {
                    v = D
                  }
                  Reflect.construct(t, [], b)
                } else {
                  try {
                    b.call()
                  } catch (D) {
                    v = D
                  }
                  t.call(b.prototype)
                }
              } else {
                try {
                  throw Error()
                } catch (D) {
                  v = D
                }
                t()
              }
            } catch (D) {
              if (D && v && typeof D.stack == "string") {
                for (
                  var x = D.stack.split(`
`),
                    N = v.stack.split(`
`),
                    T = x.length - 1,
                    R = N.length - 1;
                  T >= 1 && R >= 0 && x[T] !== N[R];

                )
                  R--
                for (; T >= 1 && R >= 0; T--, R--)
                  if (x[T] !== N[R]) {
                    if (T !== 1 || R !== 1)
                      do
                        if ((T--, R--, R < 0 || x[T] !== N[R])) {
                          var M =
                            `
` + x[T].replace(" at new ", " at ")
                          return (
                            t.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", t.displayName)),
                            typeof t == "function" && fe.set(t, M),
                            M
                          )
                        }
                      while (T >= 1 && R >= 0)
                    break
                  }
              }
            } finally {
              ;(be = !1), (qe.current = j), gr(), (Error.prepareStackTrace = S)
            }
            var re = t ? t.displayName || t.name : "",
              _ = re ? me(re) : ""
            return typeof t == "function" && fe.set(t, _), _
          }
          function Cr(t, f, w) {
            return He(t, !1)
          }
          function Pr(t) {
            var f = t.prototype
            return !!(f && f.isReactComponent)
          }
          function ye(t, f, w) {
            if (t == null) return ""
            if (typeof t == "function") return He(t, Pr(t))
            if (typeof t == "string") return me(t)
            switch (t) {
              case n:
                return me("Suspense")
              case c:
                return me("SuspenseList")
            }
            if (typeof t == "object")
              switch (t.$$typeof) {
                case r:
                  return Cr(t.render)
                case i:
                  return ye(t.type, f, w)
                case u: {
                  var v = t,
                    S = v._payload,
                    j = v._init
                  try {
                    return ye(j(S), f, w)
                  } catch {}
                }
              }
            return ""
          }
          var se = Object.prototype.hasOwnProperty,
            Ge = {},
            Ke = C.ReactDebugCurrentFrame
          function pe(t) {
            if (t) {
              var f = t._owner,
                w = ye(t.type, t._source, f ? f.type : null)
              Ke.setExtraStackFrame(w)
            } else Ke.setExtraStackFrame(null)
          }
          function vr(t, f, w, v, S) {
            {
              var j = Function.call.bind(se)
              for (var b in t)
                if (j(t, b)) {
                  var x = void 0
                  try {
                    if (typeof t[b] != "function") {
                      var N = Error(
                        (v || "React class") +
                          ": " +
                          w +
                          " type `" +
                          b +
                          "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                          typeof t[b] +
                          "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                      )
                      throw ((N.name = "Invariant Violation"), N)
                    }
                    x = t[b](f, b, v, w, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED")
                  } catch (T) {
                    x = T
                  }
                  x &&
                    !(x instanceof Error) &&
                    (pe(S),
                    P(
                      "%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",
                      v || "React class",
                      w,
                      b,
                      typeof x
                    ),
                    pe(null)),
                    x instanceof Error &&
                      !(x.message in Ge) &&
                      ((Ge[x.message] = !0), pe(S), P("Failed %s type: %s", w, x.message), pe(null))
                }
            }
          }
          var qr = Array.isArray
          function Ee(t) {
            return qr(t)
          }
          function xr(t) {
            {
              var f = typeof Symbol == "function" && Symbol.toStringTag,
                w = (f && t[Symbol.toStringTag]) || t.constructor.name || "Object"
              return w
            }
          }
          function br(t) {
            try {
              return Ye(t), !1
            } catch {
              return !0
            }
          }
          function Ye(t) {
            return "" + t
          }
          function _e(t) {
            if (br(t))
              return (
                P(
                  "The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.",
                  xr(t)
                ),
                Ye(t)
              )
          }
          var oe = C.ReactCurrentOwner,
            Er = { key: !0, ref: !0, __self: !0, __source: !0 },
            Ze,
            Je,
            Se
          Se = {}
          function Sr(t) {
            if (se.call(t, "ref")) {
              var f = Object.getOwnPropertyDescriptor(t, "ref").get
              if (f && f.isReactWarning) return !1
            }
            return t.ref !== void 0
          }
          function jr(t) {
            if (se.call(t, "key")) {
              var f = Object.getOwnPropertyDescriptor(t, "key").get
              if (f && f.isReactWarning) return !1
            }
            return t.key !== void 0
          }
          function kr(t, f) {
            if (typeof t.ref == "string" && oe.current && f && oe.current.stateNode !== f) {
              var w = U(oe.current.type)
              Se[w] ||
                (P(
                  'Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',
                  U(oe.current.type),
                  t.ref
                ),
                (Se[w] = !0))
            }
          }
          function Ar(t, f) {
            {
              var w = function () {
                Ze ||
                  ((Ze = !0),
                  P(
                    "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    f
                  ))
              }
              ;(w.isReactWarning = !0), Object.defineProperty(t, "key", { get: w, configurable: !0 })
            }
          }
          function Ir(t, f) {
            {
              var w = function () {
                Je ||
                  ((Je = !0),
                  P(
                    "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    f
                  ))
              }
              ;(w.isReactWarning = !0), Object.defineProperty(t, "ref", { get: w, configurable: !0 })
            }
          }
          var Tr = function (t, f, w, v, S, j, b) {
            var x = { $$typeof: s, type: t, key: f, ref: w, props: b, _owner: j }
            return (
              (x._store = {}),
              Object.defineProperty(x._store, "validated", {
                configurable: !1,
                enumerable: !1,
                writable: !0,
                value: !1,
              }),
              Object.defineProperty(x, "_self", { configurable: !1, enumerable: !1, writable: !1, value: v }),
              Object.defineProperty(x, "_source", { configurable: !1, enumerable: !1, writable: !1, value: S }),
              Object.freeze && (Object.freeze(x.props), Object.freeze(x)),
              x
            )
          }
          function Rr(t, f, w, v, S) {
            {
              var j,
                b = {},
                x = null,
                N = null
              w !== void 0 && (_e(w), (x = "" + w)),
                jr(f) && (_e(f.key), (x = "" + f.key)),
                Sr(f) && ((N = f.ref), kr(f, S))
              for (j in f) se.call(f, j) && !Er.hasOwnProperty(j) && (b[j] = f[j])
              if (t && t.defaultProps) {
                var T = t.defaultProps
                for (j in T) b[j] === void 0 && (b[j] = T[j])
              }
              if (x || N) {
                var R = typeof t == "function" ? t.displayName || t.name || "Unknown" : t
                x && Ar(b, R), N && Ir(b, R)
              }
              return Tr(t, x, N, S, v, oe.current, b)
            }
          }
          var je = C.ReactCurrentOwner,
            Qe = C.ReactDebugCurrentFrame
          function ee(t) {
            if (t) {
              var f = t._owner,
                w = ye(t.type, t._source, f ? f.type : null)
              Qe.setExtraStackFrame(w)
            } else Qe.setExtraStackFrame(null)
          }
          var ke
          ke = !1
          function Ae(t) {
            return typeof t == "object" && t !== null && t.$$typeof === s
          }
          function ze() {
            {
              if (je.current) {
                var t = U(je.current.type)
                if (t)
                  return (
                    `

Check the render method of \`` +
                    t +
                    "`."
                  )
              }
              return ""
            }
          }
          function Or(t) {
            return ""
          }
          var $e = {}
          function Lr(t) {
            {
              var f = ze()
              if (!f) {
                var w = typeof t == "string" ? t : t.displayName || t.name
                w &&
                  (f =
                    `

Check the top-level render call using <` +
                    w +
                    ">.")
              }
              return f
            }
          }
          function er(t, f) {
            {
              if (!t._store || t._store.validated || t.key != null) return
              t._store.validated = !0
              var w = Lr(f)
              if ($e[w]) return
              $e[w] = !0
              var v = ""
              t && t._owner && t._owner !== je.current && (v = " It was passed a child from " + U(t._owner.type) + "."),
                ee(t),
                P(
                  'Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',
                  w,
                  v
                ),
                ee(null)
            }
          }
          function rr(t, f) {
            {
              if (typeof t != "object") return
              if (Ee(t))
                for (var w = 0; w < t.length; w++) {
                  var v = t[w]
                  Ae(v) && er(v, f)
                }
              else if (Ae(t)) t._store && (t._store.validated = !0)
              else if (t) {
                var S = A(t)
                if (typeof S == "function" && S !== t.entries)
                  for (var j = S.call(t), b; !(b = j.next()).done; ) Ae(b.value) && er(b.value, f)
              }
            }
          }
          function Nr(t) {
            {
              var f = t.type
              if (f == null || typeof f == "string") return
              var w
              if (typeof f == "function") w = f.propTypes
              else if (typeof f == "object" && (f.$$typeof === r || f.$$typeof === i)) w = f.propTypes
              else return
              if (w) {
                var v = U(f)
                vr(w, t.props, "prop", v, t)
              } else if (f.PropTypes !== void 0 && !ke) {
                ke = !0
                var S = U(f)
                P(
                  "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
                  S || "Unknown"
                )
              }
              typeof f.getDefaultProps == "function" &&
                !f.getDefaultProps.isReactClassApproved &&
                P(
                  "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead."
                )
            }
          }
          function Br(t) {
            {
              for (var f = Object.keys(t.props), w = 0; w < f.length; w++) {
                var v = f[w]
                if (v !== "children" && v !== "key") {
                  ee(t),
                    P(
                      "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",
                      v
                    ),
                    ee(null)
                  break
                }
              }
              t.ref !== null && (ee(t), P("Invalid attribute `ref` supplied to `React.Fragment`."), ee(null))
            }
          }
          var tr = {}
          function ar(t, f, w, v, S, j) {
            {
              var b = ae(t)
              if (!b) {
                var x = ""
                ;(t === void 0 || (typeof t == "object" && t !== null && Object.keys(t).length === 0)) &&
                  (x +=
                    " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.")
                var N = Or()
                N ? (x += N) : (x += ze())
                var T
                t === null
                  ? (T = "null")
                  : Ee(t)
                  ? (T = "array")
                  : t !== void 0 && t.$$typeof === s
                  ? ((T = "<" + (U(t.type) || "Unknown") + " />"),
                    (x = " Did you accidentally export a JSX literal instead of a component?"))
                  : (T = typeof t),
                  P(
                    "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
                    T,
                    x
                  )
              }
              var R = Rr(t, f, w, S, j)
              if (R == null) return R
              if (b) {
                var M = f.children
                if (M !== void 0)
                  if (v)
                    if (Ee(M)) {
                      for (var re = 0; re < M.length; re++) rr(M[re], t)
                      Object.freeze && Object.freeze(M)
                    } else
                      P(
                        "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
                      )
                  else rr(M, t)
              }
              if (se.call(f, "key")) {
                var _ = U(t),
                  D = Object.keys(f).filter(function (Vr) {
                    return Vr !== "key"
                  }),
                  Ie = D.length > 0 ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}"
                if (!tr[_ + Ie]) {
                  var Fr = D.length > 0 ? "{" + D.join(": ..., ") + ": ...}" : "{}"
                  P(
                    `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
                    Ie,
                    _,
                    Fr,
                    _
                  ),
                    (tr[_ + Ie] = !0)
                }
              }
              return t === d ? Br(R) : Nr(R), R
            }
          }
          function Dr(t, f, w) {
            return ar(t, f, w, !0)
          }
          function Ur(t, f, w) {
            return ar(t, f, w, !1)
          }
          var Mr = Ur,
            Wr = Dr
          ;(ce.Fragment = d), (ce.jsx = Mr), (ce.jsxs = Wr)
        })()),
    ce
  )
}
var or
function _r() {
  return or || ((or = 1), process.env.NODE_ENV === "production" ? (ge.exports = Kr()) : (ge.exports = Yr())), ge.exports
}
var o = _r()
const H = { MAC: "Mac", WINDOWS: "Windows", LINUX: "Linux", OTHER: "Other" },
  Zr = () => {
    var a, s, l, d, y
    if (!navigator || typeof navigator != "object") return H.OTHER
    if ("userAgentData" in navigator) {
      const p =
        ((l = (s = (a = navigator.userAgentData) == null ? void 0 : a.platform) == null ? void 0 : s.toLowerCase) ==
        null
          ? void 0
          : l.call(s)) || ""
      if (p.includes("mac")) return H.MAC
      if (p.includes("win")) return H.WINDOWS
      if (p.includes("linux")) return H.LINUX
    }
    if ("userAgent" in navigator) {
      const p = ((y = (d = navigator.userAgent) == null ? void 0 : d.toLowerCase) == null ? void 0 : y.call(d)) || ""
      if (p.includes("mac")) return H.MAC
      if (p.includes("win")) return H.WINDOWS
      if (p.includes("linux")) return H.LINUX
    }
    return H.OTHER
  }
function Jr() {
  function a(s) {
    return new Promise((l) => {
      let d = new XMLHttpRequest()
      d.open(s.method, s.url, !0), Object.keys(s.headers).forEach((e) => d.setRequestHeader(e, s.headers[e]))
      let y = (e, r) =>
          setTimeout(() => {
            d.abort(), l({ status: 0, content: r, isTimedOut: !0 })
          }, e),
        p = y(s.connectTimeout, "Connection timeout"),
        h
      ;(d.onreadystatechange = () => {
        d.readyState > d.OPENED && h === void 0 && (clearTimeout(p), (h = y(s.responseTimeout, "Socket timeout")))
      }),
        (d.onerror = () => {
          d.status === 0 &&
            (clearTimeout(p),
            clearTimeout(h),
            l({ content: d.responseText || "Network request failed", status: d.status, isTimedOut: !1 }))
        }),
        (d.onload = () => {
          clearTimeout(p), clearTimeout(h), l({ content: d.responseText, status: d.status, isTimedOut: !1 })
        }),
        d.send(s.data)
    })
  }
  return { send: a }
}
function Qr(a) {
  let s
  const l = `algolia-client-js-${a.key}`
  function d() {
    return s === void 0 && (s = a.localStorage || window.localStorage), s
  }
  function y() {
    return JSON.parse(d().getItem(l) || "{}")
  }
  function p(e) {
    d().setItem(l, JSON.stringify(e))
  }
  function h() {
    const e = a.timeToLive ? a.timeToLive * 1e3 : null,
      r = y(),
      n = Object.fromEntries(Object.entries(r).filter(([, i]) => i.timestamp !== void 0))
    if ((p(n), !e)) return
    const c = Object.fromEntries(
      Object.entries(n).filter(([, i]) => {
        const u = new Date().getTime()
        return !(i.timestamp + e < u)
      })
    )
    p(c)
  }
  return {
    get(e, r, n = { miss: () => Promise.resolve() }) {
      return Promise.resolve()
        .then(() => (h(), y()[JSON.stringify(e)]))
        .then((c) => Promise.all([c ? c.value : r(), c !== void 0]))
        .then(([c, i]) => Promise.all([c, i || n.miss(c)]))
        .then(([c]) => c)
    },
    set(e, r) {
      return Promise.resolve().then(() => {
        const n = y()
        return (
          (n[JSON.stringify(e)] = { timestamp: new Date().getTime(), value: r }), d().setItem(l, JSON.stringify(n)), r
        )
      })
    },
    delete(e) {
      return Promise.resolve().then(() => {
        const r = y()
        delete r[JSON.stringify(e)], d().setItem(l, JSON.stringify(r))
      })
    },
    clear() {
      return Promise.resolve().then(() => {
        d().removeItem(l)
      })
    },
  }
}
function zr() {
  return {
    get(a, s, l = { miss: () => Promise.resolve() }) {
      return s()
        .then((y) => Promise.all([y, l.miss(y)]))
        .then(([y]) => y)
    },
    set(a, s) {
      return Promise.resolve(s)
    },
    delete(a) {
      return Promise.resolve()
    },
    clear() {
      return Promise.resolve()
    },
  }
}
function ue(a) {
  const s = [...a.caches],
    l = s.shift()
  return l === void 0
    ? zr()
    : {
        get(d, y, p = { miss: () => Promise.resolve() }) {
          return l.get(d, y, p).catch(() => ue({ caches: s }).get(d, y, p))
        },
        set(d, y) {
          return l.set(d, y).catch(() => ue({ caches: s }).set(d, y))
        },
        delete(d) {
          return l.delete(d).catch(() => ue({ caches: s }).delete(d))
        },
        clear() {
          return l.clear().catch(() => ue({ caches: s }).clear())
        },
      }
}
function Te(a = { serializable: !0 }) {
  let s = {}
  return {
    get(l, d, y = { miss: () => Promise.resolve() }) {
      const p = JSON.stringify(l)
      if (p in s) return Promise.resolve(a.serializable ? JSON.parse(s[p]) : s[p])
      const h = d()
      return h.then((e) => y.miss(e)).then(() => h)
    },
    set(l, d) {
      return (s[JSON.stringify(l)] = a.serializable ? JSON.stringify(d) : d), Promise.resolve(d)
    },
    delete(l) {
      return delete s[JSON.stringify(l)], Promise.resolve()
    },
    clear() {
      return (s = {}), Promise.resolve()
    },
  }
}
function $r(a) {
  const s = {
    value: `Algolia for JavaScript (${a})`,
    add(l) {
      const d = `; ${l.segment}${l.version !== void 0 ? ` (${l.version})` : ""}`
      return s.value.indexOf(d) === -1 && (s.value = `${s.value}${d}`), s
    },
  }
  return s
}
function et(a, s, l = "WithinHeaders") {
  const d = { "x-algolia-api-key": s, "x-algolia-application-id": a }
  return {
    headers() {
      return l === "WithinHeaders" ? d : {}
    },
    queryParameters() {
      return l === "WithinQueryParameters" ? d : {}
    },
  }
}
function Z({ func: a, validate: s, aggregator: l, error: d, timeout: y = () => 0 }) {
  const p = (h) =>
    new Promise((e, r) => {
      a(h)
        .then(
          async (n) => (
            l && (await l(n)),
            (await s(n))
              ? e(n)
              : d && (await d.validate(n))
              ? r(new Error(await d.message(n)))
              : setTimeout(() => {
                  p(n).then(e).catch(r)
                }, await y())
          )
        )
        .catch((n) => {
          r(n)
        })
    })
  return p()
}
function rt({ algoliaAgents: a, client: s, version: l }) {
  const d = $r(l).add({ segment: s, version: l })
  return a.forEach((y) => d.add(y)), d
}
function tt() {
  return {
    debug(a, s) {
      return Promise.resolve()
    },
    info(a, s) {
      return Promise.resolve()
    },
    error(a, s) {
      return Promise.resolve()
    },
  }
}
var ir = 2 * 60 * 1e3
function cr(a, s = "up") {
  const l = Date.now()
  function d() {
    return s === "up" || Date.now() - l > ir
  }
  function y() {
    return s === "timed out" && Date.now() - l <= ir
  }
  return { ...a, status: s, lastUpdate: l, isUp: d, isTimedOut: y }
}
var hr = class extends Error {
    constructor(s, l) {
      super(s)
      te(this, "name", "AlgoliaError")
      l && (this.name = l)
    }
  },
  mr = class extends hr {
    constructor(s, l, d) {
      super(s, d)
      te(this, "stackTrace")
      this.stackTrace = l
    }
  },
  at = class extends mr {
    constructor(a) {
      super(
        "Unreachable hosts - your application id may be incorrect. If the error persists, please reach out to the Algolia Support team: https://alg.li/support.",
        a,
        "RetryError"
      )
    }
  },
  Pe = class extends mr {
    constructor(s, l, d, y = "ApiError") {
      super(s, d, y)
      te(this, "status")
      this.status = l
    }
  },
  nt = class extends hr {
    constructor(s, l) {
      super(s, "DeserializationError")
      te(this, "response")
      this.response = l
    }
  },
  st = class extends Pe {
    constructor(s, l, d, y) {
      super(s, l, y, "DetailedApiError")
      te(this, "error")
      this.error = d
    }
  }
function ot(a) {
  const s = a
  for (let l = a.length - 1; l > 0; l--) {
    const d = Math.floor(Math.random() * (l + 1)),
      y = a[l]
    ;(s[l] = a[d]), (s[d] = y)
  }
  return s
}
function it(a, s, l) {
  const d = ct(l)
  let y = `${a.protocol}://${a.url}${a.port ? `:${a.port}` : ""}/${s.charAt(0) === "/" ? s.substring(1) : s}`
  return d.length && (y += `?${d}`), y
}
function ct(a) {
  return Object.keys(a)
    .filter((s) => a[s] !== void 0)
    .sort()
    .map(
      (s) =>
        `${s}=${encodeURIComponent(
          Object.prototype.toString.call(a[s]) === "[object Array]" ? a[s].join(",") : a[s]
        ).replace(/\+/g, "%20")}`
    )
    .join("&")
}
function ut(a, s) {
  if (a.method === "GET" || (a.data === void 0 && s.data === void 0)) return
  const l = Array.isArray(a.data) ? a.data : { ...a.data, ...s.data }
  return JSON.stringify(l)
}
function lt(a, s, l) {
  const d = { Accept: "application/json", ...a, ...s, ...l },
    y = {}
  return (
    Object.keys(d).forEach((p) => {
      const h = d[p]
      y[p.toLowerCase()] = h
    }),
    y
  )
}
function dt(a) {
  try {
    return JSON.parse(a.content)
  } catch (s) {
    throw new nt(s.message, a)
  }
}
function ht({ content: a, status: s }, l) {
  try {
    const d = JSON.parse(a)
    return "error" in d ? new st(d.message, s, d.error, l) : new Pe(d.message, s, l)
  } catch {}
  return new Pe(a, s, l)
}
function mt({ isTimedOut: a, status: s }) {
  return !a && ~~s === 0
}
function ft({ isTimedOut: a, status: s }) {
  return a || mt({ isTimedOut: a, status: s }) || (~~(s / 100) !== 2 && ~~(s / 100) !== 4)
}
function yt({ status: a }) {
  return ~~(a / 100) === 2
}
function pt(a) {
  return a.map((s) => fr(s))
}
function fr(a) {
  const s = a.request.headers["x-algolia-api-key"] ? { "x-algolia-api-key": "*****" } : {}
  return { ...a, request: { ...a.request, headers: { ...a.request.headers, ...s } } }
}
function gt({
  hosts: a,
  hostsCache: s,
  baseHeaders: l,
  logger: d,
  baseQueryParameters: y,
  algoliaAgent: p,
  timeouts: h,
  requester: e,
  requestsCache: r,
  responsesCache: n,
}) {
  async function c(m) {
    const g = await Promise.all(m.map((E) => s.get(E, () => Promise.resolve(cr(E))))),
      q = g.filter((E) => E.isUp()),
      A = g.filter((E) => E.isTimedOut()),
      C = [...q, ...A]
    return {
      hosts: C.length > 0 ? C : m,
      getTimeout(E, I) {
        return (A.length === 0 && E === 0 ? 1 : A.length + 3 + E) * I
      },
    }
  }
  async function i(m, g, q = !0) {
    const A = [],
      C = ut(m, g),
      P = lt(l, m.headers, g.headers),
      E = m.method === "GET" ? { ...m.data, ...g.data } : {},
      I = { ...y, ...m.queryParameters, ...E }
    if ((p.value && (I["x-algolia-agent"] = p.value), g && g.queryParameters))
      for (const O of Object.keys(g.queryParameters))
        !g.queryParameters[O] || Object.prototype.toString.call(g.queryParameters[O]) === "[object Object]"
          ? (I[O] = g.queryParameters[O])
          : (I[O] = g.queryParameters[O].toString())
    let K = 0
    const de = async (O, ae) => {
        const Y = O.pop()
        if (Y === void 0) throw new at(pt(A))
        const z = { ...h, ...g.timeouts },
          U = {
            data: C,
            headers: P,
            method: m.method,
            url: it(Y, m.path, I),
            connectTimeout: ae(K, z.connect),
            responseTimeout: ae(K, q ? z.read : z.write),
          },
          V = ($) => {
            const ne = { request: U, response: $, host: Y, triesLeft: O.length }
            return A.push(ne), ne
          },
          B = await e.send(U)
        if (ft(B)) {
          const $ = V(B)
          return (
            B.isTimedOut && K++,
            d.info("Retryable failure", fr($)),
            await s.set(Y, cr(Y, B.isTimedOut ? "timed out" : "down")),
            de(O, ae)
          )
        }
        if (yt(B)) return dt(B)
        throw (V(B), ht(B, A))
      },
      ve = a.filter((O) => O.accept === "readWrite" || (q ? O.accept === "read" : O.accept === "write")),
      he = await c(ve)
    return de([...he.hosts].reverse(), he.getTimeout)
  }
  function u(m, g = {}) {
    const q = m.useReadTransporter || m.method === "GET"
    if (!q) return i(m, g, q)
    const A = () => i(m, g)
    if ((g.cacheable || m.cacheable) !== !0) return A()
    const P = { request: m, requestOptions: g, transporter: { queryParameters: y, headers: l } }
    return n.get(
      P,
      () =>
        r.get(P, () =>
          r
            .set(P, A())
            .then(
              (E) => Promise.all([r.delete(P), E]),
              (E) => Promise.all([r.delete(P), Promise.reject(E)])
            )
            .then(([E, I]) => I)
        ),
      { miss: (E) => n.set(P, E) }
    )
  }
  return {
    hostsCache: s,
    requester: e,
    timeouts: h,
    logger: d,
    algoliaAgent: p,
    baseHeaders: l,
    baseQueryParameters: y,
    hosts: a,
    request: u,
    requestsCache: r,
    responsesCache: n,
  }
}
var yr = "5.17.1"
function wt(a) {
  return [
    { url: `${a}-dsn.algolia.net`, accept: "read", protocol: "https" },
    { url: `${a}.algolia.net`, accept: "write", protocol: "https" },
  ].concat(
    ot([
      { url: `${a}-1.algolianet.com`, accept: "readWrite", protocol: "https" },
      { url: `${a}-2.algolianet.com`, accept: "readWrite", protocol: "https" },
      { url: `${a}-3.algolianet.com`, accept: "readWrite", protocol: "https" },
    ])
  )
}
function Ct({ appId: a, apiKey: s, authMode: l, algoliaAgents: d, ...y }) {
  const p = et(a, s, l),
    h = gt({
      hosts: wt(a),
      ...y,
      algoliaAgent: rt({ algoliaAgents: d, client: "Search", version: yr }),
      baseHeaders: { "content-type": "text/plain", ...p.headers(), ...y.baseHeaders },
      baseQueryParameters: { ...p.queryParameters(), ...y.baseQueryParameters },
    })
  return {
    transporter: h,
    appId: a,
    clearCache() {
      return Promise.all([h.requestsCache.clear(), h.responsesCache.clear()]).then(() => {})
    },
    get _ua() {
      return h.algoliaAgent.value
    },
    addAlgoliaAgent(e, r) {
      h.algoliaAgent.add({ segment: e, version: r })
    },
    setClientApiKey({ apiKey: e }) {
      !l || l === "WithinHeaders"
        ? (h.baseHeaders["x-algolia-api-key"] = e)
        : (h.baseQueryParameters["x-algolia-api-key"] = e)
    },
    waitForTask({ indexName: e, taskID: r, maxRetries: n = 50, timeout: c = (u) => Math.min(u * 200, 5e3) }, i) {
      let u = 0
      return Z({
        func: () => this.getTask({ indexName: e, taskID: r }, i),
        validate: (m) => m.status === "published",
        aggregator: () => (u += 1),
        error: { validate: () => u >= n, message: () => `The maximum number of retries exceeded. (${u}/${n})` },
        timeout: () => c(u),
      })
    },
    waitForAppTask({ taskID: e, maxRetries: r = 50, timeout: n = (i) => Math.min(i * 200, 5e3) }, c) {
      let i = 0
      return Z({
        func: () => this.getAppTask({ taskID: e }, c),
        validate: (u) => u.status === "published",
        aggregator: () => (i += 1),
        error: { validate: () => i >= r, message: () => `The maximum number of retries exceeded. (${i}/${r})` },
        timeout: () => n(i),
      })
    },
    waitForApiKey(
      { operation: e, key: r, apiKey: n, maxRetries: c = 50, timeout: i = (m) => Math.min(m * 200, 5e3) },
      u
    ) {
      let m = 0
      const g = {
        aggregator: () => (m += 1),
        error: { validate: () => m >= c, message: () => `The maximum number of retries exceeded. (${m}/${c})` },
        timeout: () => i(m),
      }
      if (e === "update") {
        if (!n) throw new Error("`apiKey` is required when waiting for an `update` operation.")
        return Z({
          ...g,
          func: () => this.getApiKey({ key: r }, u),
          validate: (q) => {
            for (const A of Object.keys(n)) {
              const C = n[A],
                P = q[A]
              if (Array.isArray(C) && Array.isArray(P)) {
                if (C.length !== P.length || C.some((E, I) => E !== P[I])) return !1
              } else if (C !== P) return !1
            }
            return !0
          },
        })
      }
      return Z({
        ...g,
        func: () =>
          this.getApiKey({ key: r }, u).catch((q) => {
            if (q.status !== 404) throw q
          }),
        validate: (q) => (e === "add" ? q !== void 0 : q === void 0),
      })
    },
    browseObjects({ indexName: e, browseParams: r, ...n }, c) {
      return Z({
        func: (i) =>
          this.browse({ indexName: e, browseParams: { cursor: i ? i.cursor : void 0, hitsPerPage: 1e3, ...r } }, c),
        validate: (i) => i.cursor === void 0,
        ...n,
      })
    },
    browseRules({ indexName: e, searchRulesParams: r, ...n }, c) {
      const i = { hitsPerPage: 1e3, ...r }
      return Z({
        func: (u) =>
          this.searchRules({ indexName: e, searchRulesParams: { ...i, page: u ? u.page + 1 : i.page || 0 } }, c),
        validate: (u) => u.hits.length < i.hitsPerPage,
        ...n,
      })
    },
    browseSynonyms({ indexName: e, searchSynonymsParams: r, ...n }, c) {
      const i = { page: 0, ...r, hitsPerPage: 1e3 }
      return Z({
        func: (u) => {
          const m = this.searchSynonyms({ indexName: e, searchSynonymsParams: { ...i, page: i.page } }, c)
          return (i.page += 1), m
        },
        validate: (u) => u.hits.length < i.hitsPerPage,
        ...n,
      })
    },
    async chunkedBatch({ indexName: e, objects: r, action: n = "addObject", waitForTasks: c, batchSize: i = 1e3 }, u) {
      let m = []
      const g = [],
        q = r.entries()
      for (const [A, C] of q)
        m.push({ action: n, body: C }),
          (m.length === i || A === r.length - 1) &&
            (g.push(await this.batch({ indexName: e, batchWriteParams: { requests: m } }, u)), (m = []))
      if (c) for (const A of g) await this.waitForTask({ indexName: e, taskID: A.taskID })
      return g
    },
    async saveObjects({ indexName: e, objects: r, waitForTasks: n, batchSize: c }, i) {
      return await this.chunkedBatch(
        { indexName: e, objects: r, action: "addObject", waitForTasks: n, batchSize: c },
        i
      )
    },
    async deleteObjects({ indexName: e, objectIDs: r, waitForTasks: n, batchSize: c }, i) {
      return await this.chunkedBatch(
        {
          indexName: e,
          objects: r.map((u) => ({ objectID: u })),
          action: "deleteObject",
          waitForTasks: n,
          batchSize: c,
        },
        i
      )
    },
    async partialUpdateObjects({ indexName: e, objects: r, createIfNotExists: n, waitForTasks: c, batchSize: i }, u) {
      return await this.chunkedBatch(
        {
          indexName: e,
          objects: r,
          action: n ? "partialUpdateObject" : "partialUpdateObjectNoCreate",
          batchSize: i,
          waitForTasks: c,
        },
        u
      )
    },
    async replaceAllObjects({ indexName: e, objects: r, batchSize: n }, c) {
      const i = Math.floor(Math.random() * 1e6) + 1e5,
        u = `${e}_tmp_${i}`
      let m = await this.operationIndex(
        {
          indexName: e,
          operationIndexParams: { operation: "copy", destination: u, scope: ["settings", "rules", "synonyms"] },
        },
        c
      )
      const g = await this.chunkedBatch({ indexName: u, objects: r, waitForTasks: !0, batchSize: n }, c)
      await this.waitForTask({ indexName: u, taskID: m.taskID }),
        (m = await this.operationIndex(
          {
            indexName: e,
            operationIndexParams: { operation: "copy", destination: u, scope: ["settings", "rules", "synonyms"] },
          },
          c
        )),
        await this.waitForTask({ indexName: u, taskID: m.taskID })
      const q = await this.operationIndex(
        { indexName: u, operationIndexParams: { operation: "move", destination: e } },
        c
      )
      return (
        await this.waitForTask({ indexName: u, taskID: q.taskID }),
        { copyOperationResponse: m, batchResponses: g, moveOperationResponse: q }
      )
    },
    async indexExists({ indexName: e }) {
      try {
        await this.getSettings({ indexName: e })
      } catch (r) {
        if (r instanceof Pe && r.status === 404) return !1
        throw r
      }
      return !0
    },
    searchForHits(e, r) {
      return this.search(e, r)
    },
    searchForFacets(e, r) {
      return this.search(e, r)
    },
    addApiKey(e, r) {
      if (!e) throw new Error("Parameter `apiKey` is required when calling `addApiKey`.")
      if (!e.acl) throw new Error("Parameter `apiKey.acl` is required when calling `addApiKey`.")
      const u = { method: "POST", path: "/1/keys", queryParameters: {}, headers: {}, data: e }
      return h.request(u, r)
    },
    addOrUpdateObject({ indexName: e, objectID: r, body: n }, c) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `addOrUpdateObject`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `addOrUpdateObject`.")
      if (!n) throw new Error("Parameter `body` is required when calling `addOrUpdateObject`.")
      const g = {
        method: "PUT",
        path: "/1/indexes/{indexName}/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        queryParameters: {},
        headers: {},
        data: n,
      }
      return h.request(g, c)
    },
    appendSource(e, r) {
      if (!e) throw new Error("Parameter `source` is required when calling `appendSource`.")
      if (!e.source) throw new Error("Parameter `source.source` is required when calling `appendSource`.")
      const u = { method: "POST", path: "/1/security/sources/append", queryParameters: {}, headers: {}, data: e }
      return h.request(u, r)
    },
    assignUserId({ xAlgoliaUserID: e, assignUserIdParams: r }, n) {
      if (!e) throw new Error("Parameter `xAlgoliaUserID` is required when calling `assignUserId`.")
      if (!r) throw new Error("Parameter `assignUserIdParams` is required when calling `assignUserId`.")
      if (!r.cluster) throw new Error("Parameter `assignUserIdParams.cluster` is required when calling `assignUserId`.")
      const c = "/1/clusters/mapping",
        i = {},
        u = {}
      e !== void 0 && (i["X-Algolia-User-ID"] = e.toString())
      const m = { method: "POST", path: c, queryParameters: u, headers: i, data: r }
      return h.request(m, n)
    },
    batch({ indexName: e, batchWriteParams: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `batch`.")
      if (!r) throw new Error("Parameter `batchWriteParams` is required when calling `batch`.")
      if (!r.requests) throw new Error("Parameter `batchWriteParams.requests` is required when calling `batch`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}/batch".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r,
      }
      return h.request(m, n)
    },
    batchAssignUserIds({ xAlgoliaUserID: e, batchAssignUserIdsParams: r }, n) {
      if (!e) throw new Error("Parameter `xAlgoliaUserID` is required when calling `batchAssignUserIds`.")
      if (!r) throw new Error("Parameter `batchAssignUserIdsParams` is required when calling `batchAssignUserIds`.")
      if (!r.cluster)
        throw new Error("Parameter `batchAssignUserIdsParams.cluster` is required when calling `batchAssignUserIds`.")
      if (!r.users)
        throw new Error("Parameter `batchAssignUserIdsParams.users` is required when calling `batchAssignUserIds`.")
      const c = "/1/clusters/mapping/batch",
        i = {},
        u = {}
      e !== void 0 && (i["X-Algolia-User-ID"] = e.toString())
      const m = { method: "POST", path: c, queryParameters: u, headers: i, data: r }
      return h.request(m, n)
    },
    batchDictionaryEntries({ dictionaryName: e, batchDictionaryEntriesParams: r }, n) {
      if (!e) throw new Error("Parameter `dictionaryName` is required when calling `batchDictionaryEntries`.")
      if (!r)
        throw new Error("Parameter `batchDictionaryEntriesParams` is required when calling `batchDictionaryEntries`.")
      if (!r.requests)
        throw new Error(
          "Parameter `batchDictionaryEntriesParams.requests` is required when calling `batchDictionaryEntries`."
        )
      const m = {
        method: "POST",
        path: "/1/dictionaries/{dictionaryName}/batch".replace("{dictionaryName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r,
      }
      return h.request(m, n)
    },
    browse({ indexName: e, browseParams: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `browse`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}/browse".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r || {},
        useReadTransporter: !0,
      }
      return h.request(m, n)
    },
    clearObjects({ indexName: e }, r) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `clearObjects`.")
      const u = {
        method: "POST",
        path: "/1/indexes/{indexName}/clear".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    clearRules({ indexName: e, forwardToReplicas: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `clearRules`.")
      const c = "/1/indexes/{indexName}/rules/clear".replace("{indexName}", encodeURIComponent(e)),
        i = {},
        u = {}
      r !== void 0 && (u.forwardToReplicas = r.toString())
      const m = { method: "POST", path: c, queryParameters: u, headers: i }
      return h.request(m, n)
    },
    clearSynonyms({ indexName: e, forwardToReplicas: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `clearSynonyms`.")
      const c = "/1/indexes/{indexName}/synonyms/clear".replace("{indexName}", encodeURIComponent(e)),
        i = {},
        u = {}
      r !== void 0 && (u.forwardToReplicas = r.toString())
      const m = { method: "POST", path: c, queryParameters: u, headers: i }
      return h.request(m, n)
    },
    customDelete({ path: e, parameters: r }, n) {
      if (!e) throw new Error("Parameter `path` is required when calling `customDelete`.")
      const m = { method: "DELETE", path: "/{path}".replace("{path}", e), queryParameters: r || {}, headers: {} }
      return h.request(m, n)
    },
    customGet({ path: e, parameters: r }, n) {
      if (!e) throw new Error("Parameter `path` is required when calling `customGet`.")
      const m = { method: "GET", path: "/{path}".replace("{path}", e), queryParameters: r || {}, headers: {} }
      return h.request(m, n)
    },
    customPost({ path: e, parameters: r, body: n }, c) {
      if (!e) throw new Error("Parameter `path` is required when calling `customPost`.")
      const g = {
        method: "POST",
        path: "/{path}".replace("{path}", e),
        queryParameters: r || {},
        headers: {},
        data: n || {},
      }
      return h.request(g, c)
    },
    customPut({ path: e, parameters: r, body: n }, c) {
      if (!e) throw new Error("Parameter `path` is required when calling `customPut`.")
      const g = {
        method: "PUT",
        path: "/{path}".replace("{path}", e),
        queryParameters: r || {},
        headers: {},
        data: n || {},
      }
      return h.request(g, c)
    },
    deleteApiKey({ key: e }, r) {
      if (!e) throw new Error("Parameter `key` is required when calling `deleteApiKey`.")
      const u = {
        method: "DELETE",
        path: "/1/keys/{key}".replace("{key}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    deleteBy({ indexName: e, deleteByParams: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `deleteBy`.")
      if (!r) throw new Error("Parameter `deleteByParams` is required when calling `deleteBy`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}/deleteByQuery".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r,
      }
      return h.request(m, n)
    },
    deleteIndex({ indexName: e }, r) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `deleteIndex`.")
      const u = {
        method: "DELETE",
        path: "/1/indexes/{indexName}".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    deleteObject({ indexName: e, objectID: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `deleteObject`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `deleteObject`.")
      const m = {
        method: "DELETE",
        path: "/1/indexes/{indexName}/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        queryParameters: {},
        headers: {},
      }
      return h.request(m, n)
    },
    deleteRule({ indexName: e, objectID: r, forwardToReplicas: n }, c) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `deleteRule`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `deleteRule`.")
      const i = "/1/indexes/{indexName}/rules/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        u = {},
        m = {}
      n !== void 0 && (m.forwardToReplicas = n.toString())
      const g = { method: "DELETE", path: i, queryParameters: m, headers: u }
      return h.request(g, c)
    },
    deleteSource({ source: e }, r) {
      if (!e) throw new Error("Parameter `source` is required when calling `deleteSource`.")
      const u = {
        method: "DELETE",
        path: "/1/security/sources/{source}".replace("{source}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    deleteSynonym({ indexName: e, objectID: r, forwardToReplicas: n }, c) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `deleteSynonym`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `deleteSynonym`.")
      const i = "/1/indexes/{indexName}/synonyms/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        u = {},
        m = {}
      n !== void 0 && (m.forwardToReplicas = n.toString())
      const g = { method: "DELETE", path: i, queryParameters: m, headers: u }
      return h.request(g, c)
    },
    getApiKey({ key: e }, r) {
      if (!e) throw new Error("Parameter `key` is required when calling `getApiKey`.")
      const u = {
        method: "GET",
        path: "/1/keys/{key}".replace("{key}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    getAppTask({ taskID: e }, r) {
      if (!e) throw new Error("Parameter `taskID` is required when calling `getAppTask`.")
      const u = {
        method: "GET",
        path: "/1/task/{taskID}".replace("{taskID}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    getDictionaryLanguages(e) {
      const i = { method: "GET", path: "/1/dictionaries/*/languages", queryParameters: {}, headers: {} }
      return h.request(i, e)
    },
    getDictionarySettings(e) {
      const i = { method: "GET", path: "/1/dictionaries/*/settings", queryParameters: {}, headers: {} }
      return h.request(i, e)
    },
    getLogs({ offset: e, length: r, indexName: n, type: c } = {}, i = void 0) {
      const u = "/1/logs",
        m = {},
        g = {}
      e !== void 0 && (g.offset = e.toString()),
        r !== void 0 && (g.length = r.toString()),
        n !== void 0 && (g.indexName = n.toString()),
        c !== void 0 && (g.type = c.toString())
      const q = { method: "GET", path: u, queryParameters: g, headers: m }
      return h.request(q, i)
    },
    getObject({ indexName: e, objectID: r, attributesToRetrieve: n }, c) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `getObject`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `getObject`.")
      const i = "/1/indexes/{indexName}/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        u = {},
        m = {}
      n !== void 0 && (m.attributesToRetrieve = n.toString())
      const g = { method: "GET", path: i, queryParameters: m, headers: u }
      return h.request(g, c)
    },
    getObjects(e, r) {
      if (!e) throw new Error("Parameter `getObjectsParams` is required when calling `getObjects`.")
      if (!e.requests) throw new Error("Parameter `getObjectsParams.requests` is required when calling `getObjects`.")
      const u = {
        method: "POST",
        path: "/1/indexes/*/objects",
        queryParameters: {},
        headers: {},
        data: e,
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(u, r)
    },
    getRule({ indexName: e, objectID: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `getRule`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `getRule`.")
      const m = {
        method: "GET",
        path: "/1/indexes/{indexName}/rules/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        queryParameters: {},
        headers: {},
      }
      return h.request(m, n)
    },
    getSettings({ indexName: e }, r) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `getSettings`.")
      const u = {
        method: "GET",
        path: "/1/indexes/{indexName}/settings".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    getSources(e) {
      const i = { method: "GET", path: "/1/security/sources", queryParameters: {}, headers: {} }
      return h.request(i, e)
    },
    getSynonym({ indexName: e, objectID: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `getSynonym`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `getSynonym`.")
      const m = {
        method: "GET",
        path: "/1/indexes/{indexName}/synonyms/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        queryParameters: {},
        headers: {},
      }
      return h.request(m, n)
    },
    getTask({ indexName: e, taskID: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `getTask`.")
      if (!r) throw new Error("Parameter `taskID` is required when calling `getTask`.")
      const m = {
        method: "GET",
        path: "/1/indexes/{indexName}/task/{taskID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{taskID}", encodeURIComponent(r)),
        queryParameters: {},
        headers: {},
      }
      return h.request(m, n)
    },
    getTopUserIds(e) {
      const i = { method: "GET", path: "/1/clusters/mapping/top", queryParameters: {}, headers: {} }
      return h.request(i, e)
    },
    getUserId({ userID: e }, r) {
      if (!e) throw new Error("Parameter `userID` is required when calling `getUserId`.")
      const u = {
        method: "GET",
        path: "/1/clusters/mapping/{userID}".replace("{userID}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    hasPendingMappings({ getClusters: e } = {}, r = void 0) {
      const n = "/1/clusters/mapping/pending",
        c = {},
        i = {}
      e !== void 0 && (i.getClusters = e.toString())
      const u = { method: "GET", path: n, queryParameters: i, headers: c }
      return h.request(u, r)
    },
    listApiKeys(e) {
      const i = { method: "GET", path: "/1/keys", queryParameters: {}, headers: {} }
      return h.request(i, e)
    },
    listClusters(e) {
      const i = { method: "GET", path: "/1/clusters", queryParameters: {}, headers: {} }
      return h.request(i, e)
    },
    listIndices({ page: e, hitsPerPage: r } = {}, n = void 0) {
      const c = "/1/indexes",
        i = {},
        u = {}
      e !== void 0 && (u.page = e.toString()), r !== void 0 && (u.hitsPerPage = r.toString())
      const m = { method: "GET", path: c, queryParameters: u, headers: i }
      return h.request(m, n)
    },
    listUserIds({ page: e, hitsPerPage: r } = {}, n = void 0) {
      const c = "/1/clusters/mapping",
        i = {},
        u = {}
      e !== void 0 && (u.page = e.toString()), r !== void 0 && (u.hitsPerPage = r.toString())
      const m = { method: "GET", path: c, queryParameters: u, headers: i }
      return h.request(m, n)
    },
    multipleBatch(e, r) {
      if (!e) throw new Error("Parameter `batchParams` is required when calling `multipleBatch`.")
      if (!e.requests) throw new Error("Parameter `batchParams.requests` is required when calling `multipleBatch`.")
      const u = { method: "POST", path: "/1/indexes/*/batch", queryParameters: {}, headers: {}, data: e }
      return h.request(u, r)
    },
    operationIndex({ indexName: e, operationIndexParams: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `operationIndex`.")
      if (!r) throw new Error("Parameter `operationIndexParams` is required when calling `operationIndex`.")
      if (!r.operation)
        throw new Error("Parameter `operationIndexParams.operation` is required when calling `operationIndex`.")
      if (!r.destination)
        throw new Error("Parameter `operationIndexParams.destination` is required when calling `operationIndex`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}/operation".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r,
      }
      return h.request(m, n)
    },
    partialUpdateObject({ indexName: e, objectID: r, attributesToUpdate: n, createIfNotExists: c }, i) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `partialUpdateObject`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `partialUpdateObject`.")
      if (!n) throw new Error("Parameter `attributesToUpdate` is required when calling `partialUpdateObject`.")
      const u = "/1/indexes/{indexName}/{objectID}/partial"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        m = {},
        g = {}
      c !== void 0 && (g.createIfNotExists = c.toString())
      const q = { method: "POST", path: u, queryParameters: g, headers: m, data: n }
      return h.request(q, i)
    },
    removeUserId({ userID: e }, r) {
      if (!e) throw new Error("Parameter `userID` is required when calling `removeUserId`.")
      const u = {
        method: "DELETE",
        path: "/1/clusters/mapping/{userID}".replace("{userID}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    replaceSources({ source: e }, r) {
      if (!e) throw new Error("Parameter `source` is required when calling `replaceSources`.")
      const u = { method: "PUT", path: "/1/security/sources", queryParameters: {}, headers: {}, data: e }
      return h.request(u, r)
    },
    restoreApiKey({ key: e }, r) {
      if (!e) throw new Error("Parameter `key` is required when calling `restoreApiKey`.")
      const u = {
        method: "POST",
        path: "/1/keys/{key}/restore".replace("{key}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
      }
      return h.request(u, r)
    },
    saveObject({ indexName: e, body: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `saveObject`.")
      if (!r) throw new Error("Parameter `body` is required when calling `saveObject`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r,
      }
      return h.request(m, n)
    },
    saveRule({ indexName: e, objectID: r, rule: n, forwardToReplicas: c }, i) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `saveRule`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `saveRule`.")
      if (!n) throw new Error("Parameter `rule` is required when calling `saveRule`.")
      if (!n.objectID) throw new Error("Parameter `rule.objectID` is required when calling `saveRule`.")
      if (!n.consequence) throw new Error("Parameter `rule.consequence` is required when calling `saveRule`.")
      const u = "/1/indexes/{indexName}/rules/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        m = {},
        g = {}
      c !== void 0 && (g.forwardToReplicas = c.toString())
      const q = { method: "PUT", path: u, queryParameters: g, headers: m, data: n }
      return h.request(q, i)
    },
    saveRules({ indexName: e, rules: r, forwardToReplicas: n, clearExistingRules: c }, i) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `saveRules`.")
      if (!r) throw new Error("Parameter `rules` is required when calling `saveRules`.")
      const u = "/1/indexes/{indexName}/rules/batch".replace("{indexName}", encodeURIComponent(e)),
        m = {},
        g = {}
      n !== void 0 && (g.forwardToReplicas = n.toString()), c !== void 0 && (g.clearExistingRules = c.toString())
      const q = { method: "POST", path: u, queryParameters: g, headers: m, data: r }
      return h.request(q, i)
    },
    saveSynonym({ indexName: e, objectID: r, synonymHit: n, forwardToReplicas: c }, i) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `saveSynonym`.")
      if (!r) throw new Error("Parameter `objectID` is required when calling `saveSynonym`.")
      if (!n) throw new Error("Parameter `synonymHit` is required when calling `saveSynonym`.")
      if (!n.objectID) throw new Error("Parameter `synonymHit.objectID` is required when calling `saveSynonym`.")
      if (!n.type) throw new Error("Parameter `synonymHit.type` is required when calling `saveSynonym`.")
      const u = "/1/indexes/{indexName}/synonyms/{objectID}"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{objectID}", encodeURIComponent(r)),
        m = {},
        g = {}
      c !== void 0 && (g.forwardToReplicas = c.toString())
      const q = { method: "PUT", path: u, queryParameters: g, headers: m, data: n }
      return h.request(q, i)
    },
    saveSynonyms({ indexName: e, synonymHit: r, forwardToReplicas: n, replaceExistingSynonyms: c }, i) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `saveSynonyms`.")
      if (!r) throw new Error("Parameter `synonymHit` is required when calling `saveSynonyms`.")
      const u = "/1/indexes/{indexName}/synonyms/batch".replace("{indexName}", encodeURIComponent(e)),
        m = {},
        g = {}
      n !== void 0 && (g.forwardToReplicas = n.toString()), c !== void 0 && (g.replaceExistingSynonyms = c.toString())
      const q = { method: "POST", path: u, queryParameters: g, headers: m, data: r }
      return h.request(q, i)
    },
    search(e, r) {
      if (
        (e &&
          Array.isArray(e) &&
          (e = {
            requests: e.map(({ params: g, ...q }) =>
              q.type === "facet"
                ? { ...q, ...g, type: "facet" }
                : { ...q, ...g, facet: void 0, maxFacetHits: void 0, facetQuery: void 0 }
            ),
          }),
        !e)
      )
        throw new Error("Parameter `searchMethodParams` is required when calling `search`.")
      if (!e.requests) throw new Error("Parameter `searchMethodParams.requests` is required when calling `search`.")
      const u = {
        method: "POST",
        path: "/1/indexes/*/queries",
        queryParameters: {},
        headers: {},
        data: e,
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(u, r)
    },
    searchDictionaryEntries({ dictionaryName: e, searchDictionaryEntriesParams: r }, n) {
      if (!e) throw new Error("Parameter `dictionaryName` is required when calling `searchDictionaryEntries`.")
      if (!r)
        throw new Error("Parameter `searchDictionaryEntriesParams` is required when calling `searchDictionaryEntries`.")
      if (!r.query)
        throw new Error(
          "Parameter `searchDictionaryEntriesParams.query` is required when calling `searchDictionaryEntries`."
        )
      const m = {
        method: "POST",
        path: "/1/dictionaries/{dictionaryName}/search".replace("{dictionaryName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r,
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(m, n)
    },
    searchForFacetValues({ indexName: e, facetName: r, searchForFacetValuesRequest: n }, c) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `searchForFacetValues`.")
      if (!r) throw new Error("Parameter `facetName` is required when calling `searchForFacetValues`.")
      const g = {
        method: "POST",
        path: "/1/indexes/{indexName}/facets/{facetName}/query"
          .replace("{indexName}", encodeURIComponent(e))
          .replace("{facetName}", encodeURIComponent(r)),
        queryParameters: {},
        headers: {},
        data: n || {},
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(g, c)
    },
    searchRules({ indexName: e, searchRulesParams: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `searchRules`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}/rules/search".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r || {},
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(m, n)
    },
    searchSingleIndex({ indexName: e, searchParams: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `searchSingleIndex`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}/query".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r || {},
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(m, n)
    },
    searchSynonyms({ indexName: e, searchSynonymsParams: r }, n) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `searchSynonyms`.")
      const m = {
        method: "POST",
        path: "/1/indexes/{indexName}/synonyms/search".replace("{indexName}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r || {},
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(m, n)
    },
    searchUserIds(e, r) {
      if (!e) throw new Error("Parameter `searchUserIdsParams` is required when calling `searchUserIds`.")
      if (!e.query) throw new Error("Parameter `searchUserIdsParams.query` is required when calling `searchUserIds`.")
      const u = {
        method: "POST",
        path: "/1/clusters/mapping/search",
        queryParameters: {},
        headers: {},
        data: e,
        useReadTransporter: !0,
        cacheable: !0,
      }
      return h.request(u, r)
    },
    setDictionarySettings(e, r) {
      if (!e) throw new Error("Parameter `dictionarySettingsParams` is required when calling `setDictionarySettings`.")
      if (!e.disableStandardEntries)
        throw new Error(
          "Parameter `dictionarySettingsParams.disableStandardEntries` is required when calling `setDictionarySettings`."
        )
      const u = { method: "PUT", path: "/1/dictionaries/*/settings", queryParameters: {}, headers: {}, data: e }
      return h.request(u, r)
    },
    setSettings({ indexName: e, indexSettings: r, forwardToReplicas: n }, c) {
      if (!e) throw new Error("Parameter `indexName` is required when calling `setSettings`.")
      if (!r) throw new Error("Parameter `indexSettings` is required when calling `setSettings`.")
      const i = "/1/indexes/{indexName}/settings".replace("{indexName}", encodeURIComponent(e)),
        u = {},
        m = {}
      n !== void 0 && (m.forwardToReplicas = n.toString())
      const g = { method: "PUT", path: i, queryParameters: m, headers: u, data: r }
      return h.request(g, c)
    },
    updateApiKey({ key: e, apiKey: r }, n) {
      if (!e) throw new Error("Parameter `key` is required when calling `updateApiKey`.")
      if (!r) throw new Error("Parameter `apiKey` is required when calling `updateApiKey`.")
      if (!r.acl) throw new Error("Parameter `apiKey.acl` is required when calling `updateApiKey`.")
      const m = {
        method: "PUT",
        path: "/1/keys/{key}".replace("{key}", encodeURIComponent(e)),
        queryParameters: {},
        headers: {},
        data: r,
      }
      return h.request(m, n)
    },
  }
}
function Pt(a, s, l) {
  if (!a || typeof a != "string") throw new Error("`appId` is missing.")
  if (!s || typeof s != "string") throw new Error("`apiKey` is missing.")
  return Ct({
    appId: a,
    apiKey: s,
    timeouts: { connect: 1e3, read: 2e3, write: 3e4 },
    logger: tt(),
    requester: Jr(),
    algoliaAgents: [{ segment: "Browser" }],
    authMode: "WithinQueryParameters",
    responsesCache: Te(),
    requestsCache: Te({ serializable: !1 }),
    hostsCache: ue({ caches: [Qr({ key: `${yr}-${a}` }), Te()] }),
    ...l,
  })
}
const we = {
    BLOG: "Blog",
    BOOTCAMP: "Bootcamp",
    CASE_STUDY: "Case Study",
    CHANGELOG: "Changelog",
    DOCUMENTATION: "Documentation",
    GUIDE: "Guide",
    QUICKSTART: "Quickstart",
    TECH_TALK: "Tech Talk",
    TUTORIAL: "Tutorial",
    VIDEO: "Video",
  },
  vt = Object.values(we),
  qt = (a = "") => vt.map((s) => ({ indexName: s, query: a })),
  xt = (a) =>
    a
      .map((s) =>
        s.index === we.DOCUMENTATION
          ? (console.log("Documentation results", s),
            s.hits.map((l) => {
              const d = Object.values(l.hierarchy ?? {})
                  .slice(1)
                  .filter(Boolean)
                  .join(" > "),
                y = l.url ?? "",
                p = we.DOCUMENTATION
              return { name: d, link: y, index: p }
            }))
          : s.hits.map((l) => {
              const d = l.name ?? "",
                y = s.index === we.CHANGELOG ? "https://dev.chain.link/changelog" : l.link ?? "",
                p = s.index ?? ""
              return { name: d, link: y, index: p }
            })
      )
      .filter((s) => !!s.length),
  bt = (a, s = 5) => {
    const l = Math.max(...a.map((p) => p.length))
    let d = 0
    const y = []
    for (
      let p = 0;
      p < l &&
      (a.forEach((h) => {
        h[p] && (y.push({ ...h[p], index: "Suggestions" }), d++)
      }),
      !(d >= s));
      p++
    );
    return y.slice(0, 5).sort((p, h) => (p.index < h.index ? -1 : 0))
  },
  Et = (a, s) => {
    const l = [...a]
    for (let d = s.length - 1; d >= 0; d--) {
      const y = l.indexOf(s[d])
      if (y !== -1) {
        const [p] = l.splice(y, 1)
        l.unshift(p)
      }
    }
    return l
  },
  St =
    "data:image/png;base64,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",
  jt =
    "data:image/png;base64,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",
  kt = "_body_837gc_1",
  At = "_bodyS_837gc_16",
  It = "_bodySemiS_837gc_27",
  Tt = "_bodyXS_837gc_38",
  Rt = "_bodySemiXS_837gc_49",
  De = { body: kt, bodyS: At, bodySemiS: It, bodyXS: Tt, bodySemiXS: Rt },
  L = ({ variant: a = "default", className: s = "", children: l }) => {
    const d = a === "default" ? De.body : De[a]
    return o.jsx("span", { className: `${d} ${s}`, children: l })
  },
  Ot = "_miniCard_qi33g_1",
  Lt = "_miniCardImage_qi33g_14",
  Nt = "_miniCardLabelContainer_qi33g_19",
  Re = { miniCard: Ot, miniCardImage: Lt, miniCardLabelContainer: Nt },
  ur = ({ link: a, label: s, imageSrc: l }) =>
    o.jsxs("a", {
      href: a,
      className: Re.miniCard,
      children: [
        o.jsx("img", { src: l, alt: s, className: Re.miniCardImage }),
        o.jsx("div", { className: Re.miniCardLabelContainer, children: o.jsx(L, { variant: "bodyS", children: s }) }),
      ],
    }),
  F = ({ children: a, className: s, fill: l = "currentColor", ...d }) =>
    o.jsx("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      ...d,
      fill: l,
      className: s,
      children: a,
    }),
  Bt = ({ ...a }) =>
    o.jsxs(F, {
      ...a,
      width: "1rem",
      height: "1rem",
      viewBox: "0 0 17 17",
      fill: "none",
      children: [
        o.jsx("title", { children: "Search" }),
        o.jsx("path", {
          d: "M13 13L16.3334 16.3333M1.66669 8.33329C1.66669 10.1014 2.36907 11.7971 3.61931 13.0474C4.86955 14.2976 6.56525 15 8.33335 15C10.1015 15 11.7972 14.2976 13.0474 13.0474C14.2976 11.7971 15 10.1014 15 8.33329C15 6.56519 14.2976 4.86949 13.0474 3.61925C11.7972 2.36901 10.1015 1.66663 8.33335 1.66663C6.56525 1.66663 4.86955 2.36901 3.61931 3.61925C2.36907 4.86949 1.66669 6.56519 1.66669 8.33329Z",
          stroke: "#141921",
          strokeWidth: "1.5",
        }),
      ],
    }),
  Dt = ({ ...a }) =>
    o.jsxs(F, {
      ...a,
      width: 16,
      height: 18,
      viewBox: "0 0 16 18",
      fill: "none",
      children: [
        o.jsx("title", { children: "Navigate" }),
        o.jsx("path", {
          d: "M12 2.0332V17.0332M12 2.0332L8.66663 5.36654M12 2.0332L15.3333 5.36654M3.99994 16.0332L3.99997 1.0332M3.99994 16.0332L0.666626 12.6999M3.99994 16.0332L7.33329 12.6999",
          stroke: "#6C7585",
          strokeWidth: "1.5",
        }),
      ],
    }),
  Ut = ({ ...a }) =>
    o.jsxs(F, {
      ...a,
      width: 16,
      height: 17,
      viewBox: "0 0 16 17",
      fill: "none",
      children: [
        o.jsx("title", { children: "Enter Key" }),
        o.jsx("path", {
          d: "M4.66671 14.0332L1.33337 10.6999M1.33337 10.6999L4.66671 7.36656M1.33337 10.6999L14.6667 10.6999V2.69989H5.00004",
          stroke: "#6C7585",
          strokeWidth: "1.5",
        }),
      ],
    }),
  Mt = ({ ...a }) =>
    o.jsxs(F, {
      ...a,
      width: 20,
      height: 21,
      viewBox: "0 0 20 21",
      fill: "none",
      children: [
        o.jsx("title", { children: "Esc Key" }),
        o.jsx("path", {
          d: "M17.054 13.692C16.36 13.692 15.7624 13.5348 15.2614 13.2205C14.7634 12.903 14.3806 12.4658 14.113 11.9087C13.8453 11.3516 13.7115 10.7136 13.7115 9.99468C13.7115 9.26643 13.8484 8.62376 14.1223 8.06667C14.3962 7.50648 14.7821 7.06922 15.28 6.75488C15.778 6.44055 16.3646 6.28339 17.04 6.28339C17.5846 6.28339 18.0701 6.38453 18.4965 6.58683C18.9229 6.78601 19.2668 7.0661 19.5282 7.42712C19.7927 7.78813 19.9499 8.20984 19.9997 8.69223H18.6412C18.5665 8.35611 18.3953 8.06667 18.1277 7.82392C17.8632 7.58117 17.5084 7.4598 17.0633 7.4598C16.6743 7.4598 16.3335 7.5625 16.041 7.7679C15.7515 7.9702 15.5259 8.25963 15.3641 8.63621C15.2022 9.00967 15.1213 9.4516 15.1213 9.962C15.1213 10.4849 15.2007 10.9361 15.3594 11.3158C15.5181 11.6955 15.7422 11.9896 16.0316 12.1981C16.3242 12.4066 16.6681 12.5109 17.0633 12.5109C17.3279 12.5109 17.5675 12.4627 17.7822 12.3662C18.0001 12.2666 18.1822 12.125 18.3284 11.9414C18.4778 11.7577 18.5821 11.5368 18.6412 11.2785H19.9997C19.9499 11.7422 19.7989 12.1561 19.5469 12.5202C19.2948 12.8844 18.9571 13.1707 18.5338 13.3792C18.1137 13.5877 17.6204 13.692 17.054 13.692Z",
          fill: "#6C7585",
        }),
        o.jsx("path", {
          d: "M12.8854 8.12736L11.6202 8.35144C11.5673 8.18961 11.4833 8.03555 11.3682 7.88928C11.2561 7.74301 11.1036 7.62319 10.9107 7.52982C10.7177 7.43645 10.4765 7.38977 10.1871 7.38977C9.79183 7.38977 9.46194 7.47847 9.1974 7.65586C8.93286 7.83015 8.8006 8.05578 8.8006 8.33277C8.8006 8.57241 8.88929 8.76536 9.06669 8.91164C9.24408 9.05791 9.53041 9.17773 9.92565 9.27109L11.0647 9.53252C11.7245 9.68502 12.2162 9.91999 12.5399 10.2374C12.8636 10.5549 13.0254 10.9672 13.0254 11.4745C13.0254 11.904 12.9009 12.2868 12.6519 12.6229C12.4061 12.9559 12.0622 13.2174 11.6202 13.4072C11.1814 13.597 10.6726 13.692 10.0937 13.692C9.29077 13.692 8.63565 13.5208 8.12836 13.1785C7.62107 12.833 7.30985 12.3428 7.1947 11.7079L8.54384 11.5025C8.62787 11.8542 8.8006 12.1203 9.06202 12.3008C9.32344 12.4782 9.66423 12.5669 10.0844 12.5669C10.5419 12.5669 10.9076 12.472 11.1814 12.2821C11.4553 12.0892 11.5922 11.8542 11.5922 11.5772C11.5922 11.3532 11.5082 11.1649 11.3401 11.0124C11.1752 10.8599 10.9216 10.7447 10.5792 10.6669L9.36546 10.4008C8.69634 10.2483 8.2015 10.0056 7.88094 9.67257C7.5635 9.33956 7.40478 8.91786 7.40478 8.40746C7.40478 7.9842 7.52304 7.61385 7.75957 7.29641C7.99609 6.97896 8.32287 6.73154 8.73991 6.55415C9.15694 6.37364 9.63466 6.28339 10.1731 6.28339C10.948 6.28339 11.558 6.45144 12.003 6.78756C12.4481 7.12057 12.7422 7.56717 12.8854 8.12736Z",
          fill: "#6C7585",
        }),
        o.jsx("path", {
          d: "M3.41277 13.6919C2.7063 13.6919 2.09786 13.541 1.58746 13.2391C1.08018 12.9341 0.68804 12.5062 0.411054 11.9553C0.137181 11.4013 0.000244141 10.7524 0.000244141 10.0086C0.000244141 9.27415 0.137181 8.62681 0.411054 8.06661C0.68804 7.50642 1.07395 7.06915 1.56879 6.75482C2.06674 6.44049 2.64872 6.28333 3.31473 6.28333C3.71932 6.28333 4.11146 6.35024 4.49115 6.48406C4.87083 6.61789 5.21162 6.82796 5.5135 7.11428C5.81538 7.4006 6.05347 7.77251 6.22775 8.23C6.40203 8.68438 6.48918 9.2368 6.48918 9.88725V10.3821H0.789186V9.33639H5.12137C5.12137 8.96915 5.04667 8.64393 4.89729 8.36072C4.7479 8.07439 4.53783 7.84876 4.26707 7.68381C3.99942 7.51887 3.68509 7.43639 3.32407 7.43639C2.93193 7.43639 2.58959 7.53287 2.29705 7.72583C2.00761 7.91567 1.78353 8.16465 1.62481 8.47276C1.4692 8.77775 1.3914 9.1092 1.3914 9.4671V10.2841C1.3914 10.7633 1.47543 11.171 1.64348 11.5071C1.81465 11.8433 2.05274 12.1 2.35773 12.2774C2.66273 12.4517 3.01908 12.5388 3.42677 12.5388C3.69131 12.5388 3.93251 12.5015 4.15036 12.4268C4.36821 12.349 4.5565 12.2338 4.71522 12.0813C4.87395 11.9288 4.99532 11.7406 5.07935 11.5165L6.40048 11.7546C6.29466 12.1436 6.10482 12.4844 5.83095 12.7769C5.56018 13.0664 5.2194 13.292 4.80859 13.4538C4.40089 13.6125 3.93562 13.6919 3.41277 13.6919Z",
          fill: "#6C7585",
        }),
      ],
    }),
  Wt = ({ ...a }) =>
    o.jsx(F, {
      ...a,
      width: "18",
      height: "18",
      viewBox: "0 0 18 18",
      fill: "none",
      children: o.jsx("path", {
        d: "M6.60111 7.60134V7.26793C6.60111 5.97897 7.64602 4.93407 8.93497 4.93407C10.2239 4.93407 11.2688 5.97897 11.2688 7.26793V7.60134L8.93497 9.60179V11.2688M8.93498 12.2691V13.6027M2.46291 12.3868C1.90143 11.3339 1.59998 10.15 1.59998 8.93498C1.59998 6.98961 2.37277 5.12393 3.74835 3.74835C5.12393 2.37277 6.98961 1.59998 8.93498 1.59998C10.8804 1.59998 12.746 2.37277 14.1216 3.74835C15.4972 5.12393 16.27 6.98961 16.27 8.93498C16.27 10.8804 15.4972 12.746 14.1216 14.1216C12.746 15.4972 10.8804 16.27 8.93498 16.27C7.72963 16.27 6.55482 15.9733 5.50826 15.4203L1.93338 15.9366L2.46291 12.3868Z",
        stroke: "#6C7585",
        strokeWidth: "1.5",
      }),
    }),
  Ft = ({ ...a }) =>
    o.jsx(F, {
      ...a,
      width: "1rem",
      height: "1rem",
      viewBox: "0 0 17 16",
      fill: "none",
      children: o.jsx("path", {
        d: "M0 7.99996H15M15 7.99996L9.66667 13.3333M15 7.99996L9.66667 2.66663",
        stroke: "#9FA7B2",
        strokeWidth: "1.5",
      }),
    }),
  Oe = ({ ...a }) =>
    o.jsx(F, {
      ...a,
      width: "1rem",
      height: "1rem",
      viewBox: "0 0 16 18",
      fill: "none",
      children: o.jsx("path", {
        d: "M6.66667 6.66663L4.33333 8.99996L6.66667 11.3333M9.33333 6.66663L11.6667 8.99996L9.33333 11.3333M10.6667 1.66663H2V16.3333H14V4.99996L10.6667 1.66663Z",
        stroke: "#6C7585",
        strokeWidth: "1.5",
      }),
    }),
  Vt = ({ ...a }) =>
    o.jsxs(F, {
      ...a,
      width: "1.25rem",
      height: "1.25rem",
      viewBox: "0 0 20 16",
      fill: "none",
      children: [
        o.jsx("path", {
          opacity: "0.3",
          d: "M16.0547 1.00195H17.6172C17.6172 1.00195 18.7891 1.00195 18.7891 2.17383V13.8926C18.7891 13.8926 18.7891 15.0645 17.6172 15.0645H16.0547C16.0547 15.0645 14.8828 15.0645 14.8828 13.8926V2.17383C14.8828 2.17383 14.8828 1.00195 16.0547 1.00195Z",
          fill: "#3CC274",
          stroke: "#3CC274",
          strokeWidth: "1.57895",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        o.jsx("path", {
          opacity: "0.3",
          d: "M9.21875 5.68945H10.7813C10.7813 5.68945 11.9531 5.68945 11.9531 6.86133V13.8926C11.9531 13.8926 11.9531 15.0645 10.7813 15.0645H9.21875C9.21875 15.0645 8.04688 15.0645 8.04688 13.8926V6.86133C8.04688 6.86133 8.04688 5.68945 9.21875 5.68945Z",
          fill: "#3CC274",
          stroke: "#3CC274",
          strokeWidth: "1.57895",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        o.jsx("path", {
          d: "M2.38281 10.377H3.94531C3.94531 10.377 5.11719 10.377 5.11719 11.5488V13.8926C5.11719 13.8926 5.11719 15.0645 3.94531 15.0645H2.38281C2.38281 15.0645 1.21094 15.0645 1.21094 13.8926V11.5488C1.21094 11.5488 1.21094 10.377 2.38281 10.377Z",
          fill: "#3CC274",
          stroke: "#3CC274",
          strokeWidth: "1.57895",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
      ],
    }),
  Xt = ({ ...a }) =>
    o.jsxs(F, {
      ...a,
      width: "1.83138rem",
      height: "1.83138rem",
      viewBox: "0 0 31 30",
      fill: "none",
      children: [
        o.jsx("circle", {
          cx: "15.6512",
          cy: "15.0332",
          r: "14.6512",
          fill: "#F7B808",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("ellipse", {
          cx: "15.57",
          cy: "14.9518",
          rx: "10.1744",
          ry: "10.1744",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M9.72656 15.1781L13.8718 19.3233L20.9779 10.4407",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M20.6911 4.01632C20.845 4.01632 20.9697 3.89181 20.9697 3.73823C20.9697 3.58465 20.845 3.46014 20.6911 3.46014C20.5373 3.46014 20.4126 3.58465 20.4126 3.73823C20.4126 3.89181 20.5373 4.01632 20.6911 4.01632Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M15.6043 2.98922C15.7582 2.98922 15.8829 2.86471 15.8829 2.71113C15.8829 2.55755 15.7582 2.43304 15.6043 2.43304C15.4505 2.43304 15.3258 2.55755 15.3258 2.71113C15.3258 2.86471 15.4505 2.98922 15.6043 2.98922Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M10.5395 4.11776C10.6933 4.11776 10.8181 3.99325 10.8181 3.83967C10.8181 3.68609 10.6933 3.56158 10.5395 3.56158C10.3857 3.56158 10.261 3.68609 10.261 3.83967C10.261 3.99325 10.3857 4.11776 10.5395 4.11776Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M6.37082 7.20455C6.52465 7.20455 6.64935 7.08005 6.64935 6.92646C6.64935 6.77288 6.52465 6.64838 6.37082 6.64838C6.21699 6.64838 6.09229 6.77288 6.09229 6.92646C6.09229 7.08005 6.21699 7.20455 6.37082 7.20455Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M3.8193 11.7177C3.97313 11.7177 4.09784 11.5932 4.09784 11.4396C4.09784 11.2861 3.97313 11.1616 3.8193 11.1616C3.66547 11.1616 3.54077 11.2861 3.54077 11.4396C3.54077 11.5932 3.66547 11.7177 3.8193 11.7177Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M3.32956 16.8747C3.48339 16.8747 3.60809 16.7502 3.60809 16.5966C3.60809 16.443 3.48339 16.3185 3.32956 16.3185C3.17573 16.3185 3.05103 16.443 3.05103 16.5966C3.05103 16.7502 3.17573 16.8747 3.32956 16.8747Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M4.98581 21.7894C5.13964 21.7894 5.26434 21.6649 5.26434 21.5113C5.26434 21.3577 5.13964 21.2332 4.98581 21.2332C4.83198 21.2332 4.70728 21.3577 4.70728 21.5113C4.70728 21.6649 4.83198 21.7894 4.98581 21.7894Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M8.49411 25.6052C8.64794 25.6052 8.77264 25.4807 8.77264 25.3271C8.77264 25.1735 8.64794 25.049 8.49411 25.049C8.34028 25.049 8.21558 25.1735 8.21558 25.3271C8.21558 25.4807 8.34028 25.6052 8.49411 25.6052Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M13.2557 27.6651C13.4095 27.6651 13.5342 27.5406 13.5342 27.387C13.5342 27.2334 13.4095 27.1089 13.2557 27.1089C13.1019 27.1089 12.9772 27.2334 12.9772 27.387C12.9772 27.5406 13.1019 27.6651 13.2557 27.6651Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M18.4466 27.6129C18.6004 27.6129 18.7251 27.4884 18.7251 27.3348C18.7251 27.1813 18.6004 27.0568 18.4466 27.0568C18.2927 27.0568 18.168 27.1813 18.168 27.3348C18.168 27.4884 18.2927 27.6129 18.4466 27.6129Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M23.1647 25.4587C23.3185 25.4587 23.4432 25.3342 23.4432 25.1806C23.4432 25.027 23.3185 24.9025 23.1647 24.9025C23.0109 24.9025 22.8862 25.027 22.8862 25.1806C22.8862 25.3342 23.0109 25.4587 23.1647 25.4587Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M26.6018 21.5717C26.7556 21.5717 26.8803 21.4472 26.8803 21.2937C26.8803 21.1401 26.7556 21.0156 26.6018 21.0156C26.4479 21.0156 26.3232 21.1401 26.3232 21.2937C26.3232 21.4472 26.4479 21.5717 26.6018 21.5717Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M28.1564 16.6269C28.3102 16.6269 28.4349 16.5023 28.4349 16.3488C28.4349 16.1952 28.3102 16.0707 28.1564 16.0707C28.0026 16.0707 27.8779 16.1952 27.8779 16.3488C27.8779 16.5023 28.0026 16.6269 28.1564 16.6269Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M27.5626 11.4807C27.7164 11.4807 27.8411 11.3562 27.8411 11.2026C27.8411 11.049 27.7164 10.9245 27.5626 10.9245C27.4088 10.9245 27.2841 11.049 27.2841 11.2026C27.2841 11.3562 27.4088 11.4807 27.5626 11.4807Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("path", {
          d: "M24.9196 7.0176C25.0734 7.0176 25.1981 6.8931 25.1981 6.73951C25.1981 6.58593 25.0734 6.46143 24.9196 6.46143C24.7658 6.46143 24.6411 6.58593 24.6411 6.73951C24.6411 6.8931 24.7658 7.0176 24.9196 7.0176Z",
          fill: "#0B101C",
          stroke: "#0B101C",
          strokeWidth: "0.450805",
        }),
        o.jsx("rect", {
          x: "14.1542",
          y: "2.18549",
          width: "16.6798",
          height: "7.21288",
          rx: "3.60644",
          fill: "#0847F7",
        }),
        o.jsx("path", {
          d: "M17.7641 7.23958C17.5207 7.23958 17.3073 7.17346 17.124 7.04123C16.9437 6.90899 16.8039 6.72116 16.7047 6.47772C16.6056 6.23128 16.556 5.94126 16.556 5.60767C16.556 5.27107 16.6056 4.98105 16.7047 4.73761C16.8039 4.49418 16.9437 4.30634 17.124 4.17411C17.3073 4.04187 17.5207 3.97575 17.7641 3.97575C18.0106 3.97575 18.224 4.04187 18.4043 4.17411C18.5846 4.30634 18.7243 4.49418 18.8235 4.73761C18.9227 4.98105 18.9723 5.27107 18.9723 5.60767C18.9723 5.94126 18.9227 6.23128 18.8235 6.47772C18.7243 6.72116 18.5846 6.90899 18.4043 7.04123C18.224 7.17346 18.0106 7.23958 17.7641 7.23958ZM17.0428 5.60767C17.0428 5.77597 17.0579 5.92924 17.0879 6.06749C17.118 6.20574 17.1601 6.32595 17.2142 6.42813L18.0031 4.47615C17.9279 4.44008 17.8483 4.42205 17.7641 4.42205C17.5538 4.42205 17.381 4.52874 17.2457 4.74212C17.1105 4.9525 17.0428 5.24101 17.0428 5.60767ZM17.7641 6.79779C17.9054 6.79779 18.0301 6.74971 18.1383 6.65354C18.2465 6.55736 18.3306 6.42062 18.3908 6.2433C18.4539 6.06298 18.4854 5.8511 18.4854 5.60767C18.4854 5.43937 18.4704 5.28609 18.4403 5.14785C18.4103 5.0096 18.3682 4.89089 18.3141 4.79171L17.5252 6.7437C17.6003 6.77976 17.68 6.79779 17.7641 6.79779ZM19.8631 7.18549V6.75722H20.643V4.59336L19.8992 4.7286V4.34091L20.8278 4.02985H21.1209V6.75722H21.9594V7.18549H19.8631ZM24.0719 7.23958C23.8284 7.23958 23.6151 7.17346 23.4317 7.04123C23.2514 6.90899 23.1117 6.72116 23.0125 6.47772C22.9133 6.23128 22.8637 5.94126 22.8637 5.60767C22.8637 5.27107 22.9133 4.98105 23.0125 4.73761C23.1117 4.49418 23.2514 4.30634 23.4317 4.17411C23.6151 4.04187 23.8284 3.97575 24.0719 3.97575C24.3183 3.97575 24.5317 4.04187 24.712 4.17411C24.8923 4.30634 25.0321 4.49418 25.1313 4.73761C25.2305 4.98105 25.28 5.27107 25.28 5.60767C25.28 5.94126 25.2305 6.23128 25.1313 6.47772C25.0321 6.72116 24.8923 6.90899 24.712 7.04123C24.5317 7.17346 24.3183 7.23958 24.0719 7.23958ZM23.3506 5.60767C23.3506 5.77597 23.3656 5.92924 23.3957 6.06749C23.4257 6.20574 23.4678 6.32595 23.5219 6.42813L24.3108 4.47615C24.2357 4.44008 24.156 4.42205 24.0719 4.42205C23.8615 4.42205 23.6887 4.52874 23.5535 4.74212C23.4182 4.9525 23.3506 5.24101 23.3506 5.60767ZM24.0719 6.79779C24.2131 6.79779 24.3379 6.74971 24.4461 6.65354C24.5542 6.55736 24.6384 6.42062 24.6985 6.2433C24.7616 6.06298 24.7932 5.8511 24.7932 5.60767C24.7932 5.43937 24.7781 5.28609 24.7481 5.14785C24.718 5.0096 24.676 4.89089 24.6219 4.79171L23.833 6.7437C23.9081 6.77976 23.9877 6.79779 24.0719 6.79779ZM26.1709 7.18549V6.75722H26.9508V4.59336L26.2069 4.7286V4.34091L27.1356 4.02985H27.4286V6.75722H28.2671V7.18549H26.1709Z",
          fill: "white",
        }),
      ],
    }),
  Ht = ({ ...a }) =>
    o.jsx(F, {
      ...a,
      width: "0.75rem",
      height: "0.75rem",
      viewBox: "0 0 13 13",
      fill: "none",
      children: o.jsx("path", {
        d: "M12 12H3.5M3.75 10L1.5 7.75L7.5 1.75L11.5 5.75L7.25 10H3.75Z",
        stroke: "#6C7585",
        strokeWidth: "1.5",
      }),
    }),
  Gt = ({ ...a }) =>
    o.jsx(F, {
      ...a,
      width: "0.75rem",
      height: "0.75rem",
      viewBox: "0 0 12 12",
      fill: "none",
      children: o.jsx("path", { d: "M9 4.5L6 7.5L3 4.5", stroke: "#6C7585", strokeWidth: "1.5" }),
    }),
  Kt = ({ ...a }) =>
    o.jsx(F, {
      ...a,
      width: "1rem",
      height: "1rem",
      viewBox: "0 0 16 16",
      fill: "none",
      children: o.jsx("path", { d: "M11.6665 1L4.6665 8L11.6665 15", stroke: "#141921", "stroke-width": "1.5" }),
    }),
  Yt = "_boxVertical_ttylk_1",
  _t = "_boxHorizontal_ttylk_9",
  lr = { boxVertical: Yt, boxHorizontal: _t },
  le = ({ variant: a = "vertical", title: s = "", ariaLabel: l = "", header: d, children: y }) => {
    const p = d || (!!s && o.jsx("div", { children: o.jsx(L, { variant: "bodySemiXS", children: s }) }))
    return o.jsxs("div", {
      role: "region",
      "aria-label": l || s,
      className: lr.boxVertical,
      children: [p, a === "vertical" ? y : o.jsx("div", { className: lr.boxHorizontal, children: y })],
    })
  },
  Zt = "_searchResultList_ic9rv_1",
  Jt = "_searchResultListItem_ic9rv_8",
  Qt = "_itemActive_ic9rv_12",
  zt = "_itemIcon_ic9rv_15",
  $t = "_itemRightArrow_ic9rv_19",
  ea = "_itemLink_ic9rv_25",
  ra = "_itemLabel_ic9rv_58",
  J = {
    searchResultList: Zt,
    searchResultListItem: Jt,
    itemActive: Qt,
    itemIcon: zt,
    itemRightArrow: $t,
    itemLink: ea,
    itemLabel: ra,
  },
  Ce = ({ className: a = "", children: s, ...l }) =>
    o.jsx("ul", { ...l, className: `${J.searchResultList} ${a}`, children: s }),
  Q = ({ icon: a, itemLabel: s, itemLink: l, className: d = "", itemActive: y = !1 }) => {
    const p = k.useRef(null)
    return (
      k.useEffect(() => {
        var h
        y && ((h = p.current) == null || h.scrollIntoView({ behavior: "smooth", block: "nearest" }))
      }, [y]),
      o.jsx("li", {
        ref: p,
        className: `${J.searchResultListItem} ${y ? J.itemActive : ""} ${d}`,
        children: o.jsxs("a", {
          href: l,
          className: J.itemLink,
          children: [
            a && o.jsx("span", { className: J.itemIcon, children: a }),
            o.jsx(L, { variant: "bodySemiS", className: J.itemLabel, children: s }),
            o.jsx(Ft, { className: J.itemRightArrow }),
          ],
        }),
      })
    )
  },
  ta = "_defaultModalBodyContainer_h1y68_1",
  aa = "_defaultModalBodyLeft_h1y68_7",
  na = "_defaultModalBodyRight_h1y68_14",
  Le = { defaultModalBodyContainer: ta, defaultModalBodyLeft: aa, defaultModalBodyRight: na },
  sa = "_certificationCard_vrzug_1",
  oa = "_certificationCardHeader_vrzug_14",
  ia = "_certificationCardBody_vrzug_34",
  Ne = { certificationCard: sa, certificationCardHeader: oa, certificationCardBody: ia },
  ca = ({ link: a, title: s, label: l, imageOrIcon: d, level: y = "beginner" }) => {
    let p
    return (
      y === "beginner" && (p = o.jsx(Vt, {})),
      o.jsxs("a", {
        href: a,
        className: Ne.certificationCard,
        children: [
          o.jsxs("div", {
            className: Ne.certificationCardHeader,
            children: [d, o.jsx(L, { variant: "bodyS", children: s })],
          }),
          o.jsxs("div", {
            className: Ne.certificationCardBody,
            children: [p, o.jsx(L, { variant: "bodyXS", children: l })],
          }),
        ],
      })
    )
  },
  ua = () =>
    o.jsxs("div", {
      className: Le.defaultModalBodyContainer,
      children: [
        o.jsx("div", {
          className: Le.defaultModalBodyLeft,
          children: o.jsx(le, {
            title: "Popular links",
            children: o.jsxs(Ce, {
              children: [
                o.jsx(Q, { icon: o.jsx(Oe, {}), itemLabel: "Example link", itemLink: "https://example.com" }),
                o.jsx(Q, { icon: o.jsx(Oe, {}), itemLabel: "Example link", itemLink: "https://example.com" }),
                o.jsx(Q, { icon: o.jsx(Oe, {}), itemLabel: "Example link", itemLink: "https://example.com" }),
                o.jsx(Q, {
                  icon: o.jsx(Wt, {}),
                  itemLabel: "Talk to an expert",
                  itemLink: "https://chain.link/contact",
                }),
              ],
            }),
          }),
        }),
        o.jsxs("div", {
          className: Le.defaultModalBodyRight,
          children: [
            o.jsxs(le, {
              variant: "horizontal",
              title: "Expand your knowledge",
              children: [
                o.jsx(ur, { imageSrc: jt, label: "Doc", link: "https://docs.chain.link/" }),
                o.jsx(ur, { imageSrc: St, label: "Blog", link: "https://blog.chain.link/" }),
              ],
            }),
            o.jsx(le, {
              title: "Get certified for free",
              children: o.jsx(ca, {
                link: "https://example.com",
                title: "Blockchain and Tokenization Fundamental Course",
                imageOrIcon: o.jsx(Xt, {}),
                label: "Beginner | 12 hours",
                level: "beginner",
              }),
            }),
          ],
        }),
      ],
    }),
  la = "_modalBodyContainer_3bx9m_1",
  da = "_hideItem_3bx9m_11",
  ha = "_modalBodyCategoryList_3bx9m_16",
  ma = "_modalBodyResultFiltered_3bx9m_26",
  fa = "_backToAllResultsButton_3bx9m_35",
  ya = "_backToAllResultsButtonText_3bx9m_49",
  pa = "_searchGroupHeader_3bx9m_54",
  ga = "_totalCount_3bx9m_61",
  wa = "_showAllButton_3bx9m_66",
  X = {
    modalBodyContainer: la,
    hideItem: da,
    modalBodyCategoryList: ha,
    modalBodyResultFiltered: ma,
    backToAllResultsButton: fa,
    backToAllResultsButtonText: ya,
    searchGroupHeader: pa,
    totalCount: ga,
    showAllButton: wa,
  },
  Ca = "_categoryButton_11i1q_1",
  Pa = "_categoryButtonActive_11i1q_19",
  va = "_categoryText_11i1q_24",
  qa = "_categoryListContainer_11i1q_31",
  xa = "_categoryMenuContainer_11i1q_36",
  ba = "_categoryMenuItem_11i1q_53",
  Ea = "_categoryMenuItemText_11i1q_68",
  G = {
    categoryButton: Ca,
    categoryButtonActive: Pa,
    categoryText: va,
    categoryListContainer: qa,
    categoryMenuContainer: xa,
    categoryMenuItem: ba,
    categoryMenuItemText: Ea,
  },
  Sa = ({ category: a, isActive: s = !1, onClick: l }) =>
    o.jsx("button", {
      onClick: l,
      className: `${G.categoryButton} ${s ? G.categoryButtonActive : ""}`,
      children: o.jsx(L, { variant: "bodyS", className: G.categoryText, children: a }),
    }),
  ja = ({ categories: a, onCategoryClicked: s }) => {
    const [l, d] = k.useState(!1),
      y = `${a.length} more`
    return o.jsxs("div", {
      className: G.categoryListContainer,
      children: [
        o.jsxs("button", {
          onClick: () => d((p) => !p),
          className: G.categoryButton,
          children: [o.jsx(L, { variant: "bodyS", className: G.categoryText, children: y }), o.jsx(Gt, {})],
        }),
        l &&
          o.jsx("div", {
            className: G.categoryMenuContainer,
            children: a.map((p) =>
              o.jsx(
                "button",
                {
                  onClick: () => s(p),
                  className: G.categoryMenuItem,
                  children: o.jsx(L, { variant: "bodyS", className: G.categoryMenuItemText, children: p }),
                },
                p
              )
            ),
          }),
      ],
    })
  },
  dr = ({ categories: a, activeCategory: s, onCategoryClicked: l }) => {
    const [d, y] = k.useState(!1),
      p = k.useRef(null)
    k.useEffect(() => {
      p.current && y(p.current.scrollWidth > p.current.clientWidth)
    }, [a])
    const h = d ? a.slice(0, 6) : a,
      e = a.slice(6)
    return o.jsxs("div", {
      ref: p,
      className: X.modalBodyCategoryList,
      children: [
        h.map((r) => o.jsx(Sa, { category: r, isActive: r === s, onClick: () => l(r) }, r)),
        d && o.jsx(ja, { categories: e, onCategoryClicked: l }),
      ],
    })
  },
  Be = 3,
  ka = ({ items: a, categoryOrder: s }) => {
    var A
    const [l, d] = k.useState([]),
      [y, p] = k.useState("All"),
      [h, e] = k.useState({ Suggestions: !0 }),
      [r, n] = k.useState(-1),
      c = bt(a)
    let i = [[...c], ...a].flatMap((C) => (h != null && h[C == null ? void 0 : C[0].index] ? C : C.slice(0, Be)))
    const u = k.useCallback(
      (C) => {
        var P
        C.key === "ArrowDown"
          ? (C.preventDefault(), n((E) => (E + 1 < i.length ? E + 1 : E)))
          : C.key === "ArrowUp"
          ? (C.preventDefault(), n((E) => (E - 1 < 0 ? 0 : E - 1)))
          : C.key === "Enter" && r >= 0 && (window.location.href = ((P = i[r]) == null ? void 0 : P.link) ?? "#")
      },
      [r, i]
    )
    k.useEffect(() => (window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u)), [u]),
      k.useEffect(() => {
        const C = a.map((P) => P[0].index)
        d(["All", ...Et(C, s ?? [])]), p("All"), e({ Suggestions: !0 }), n(-1)
      }, [a, s])
    const m = (C) => {
        C && (e({ ...h, [C]: !(h != null && h[C]) }), n(-1))
      },
      g = (C) => {
        p(C), n(-1)
      },
      q = (C) => {
        const P = i[r]
        return P && P.index === C.index && P.name === C.name && P.link === C.link
      }
    if (!a.length) return o.jsx(o.Fragment, { children: "No record found." })
    if (y !== "All") {
      const C = ((A = a.filter((P) => (P == null ? void 0 : P[0].index) === y)) == null ? void 0 : A.flat()) || []
      return (
        (i = [...C]),
        o.jsxs("div", {
          className: X.modalBodyContainer,
          children: [
            o.jsx(dr, { categories: l, activeCategory: y, onCategoryClicked: g }),
            o.jsxs("div", {
              className: X.modalBodyResultFiltered,
              children: [
                o.jsxs("button", {
                  className: X.backToAllResultsButton,
                  onClick: () => g("All"),
                  children: [
                    o.jsx(Kt, {}),
                    o.jsx(L, { variant: "bodyS", className: X.backToAllResultsButtonText, children: "All results" }),
                  ],
                }),
                o.jsx(Ce, {
                  children: C.map((P) =>
                    o.jsx(Q, { itemLabel: P.name, itemLink: P.link ?? "", itemActive: q(P) }, `${P.index}-${P.name}`)
                  ),
                }),
              ],
            }),
          ],
        })
      )
    }
    return o.jsxs("div", {
      className: X.modalBodyContainer,
      children: [
        o.jsx(dr, { categories: l, activeCategory: y, onCategoryClicked: g }),
        !!c.length &&
          o.jsx(le, {
            title: "Suggestions",
            children: o.jsx(Ce, {
              children: c.map((C) =>
                o.jsx(Q, { itemLabel: C.name, itemLink: C.link ?? "", itemActive: q(C) }, `${C.index}-${C.name}`)
              ),
            }),
          }),
        a.map((C, P) => {
          let E = ""
          return (
            C.length > Be && (E += `(${C.length})`),
            o.jsx(
              le,
              {
                header: o.jsx(Aa, {
                  category: C == null ? void 0 : C[0].index,
                  totalCount: E,
                  isExpanded: !!(h != null && h[C == null ? void 0 : C[0].index]),
                  onShowAllClicked: () => {
                    var I
                    return m((I = C == null ? void 0 : C[0]) == null ? void 0 : I.index)
                  },
                }),
                children: o.jsx(Ce, {
                  children: C.map((I, K) =>
                    o.jsx(
                      Q,
                      {
                        itemLabel: I.name,
                        itemLink: I.link ?? "",
                        itemActive: q(I),
                        className: K >= Be && !(h != null && h[I.index]) ? X.hideItem : "",
                      },
                      `${I.index}-${I.name}`
                    )
                  ),
                }),
              },
              `result-box-${P}`
            )
          )
        }),
      ],
    })
  },
  Aa = ({ category: a, totalCount: s, isExpanded: l, onShowAllClicked: d }) =>
    o.jsxs("div", {
      className: X.searchGroupHeader,
      children: [
        o.jsx(L, { variant: "bodySemiXS", children: a }),
        s &&
          o.jsxs(o.Fragment, {
            children: [
              o.jsx(L, { variant: "bodyXS", className: X.totalCount, children: s }),
              o.jsx("button", {
                className: X.showAllButton,
                onClick: d,
                children: o.jsx(L, { variant: "bodyXS", children: l ? "Hide" : "Show all" }),
              }),
            ],
          }),
      ],
    }),
  Ia = "_modalOverlay_beeny_1",
  Ta = "_modalInner_beeny_12",
  Ra = "_modalContainer_beeny_21",
  Oa = "_modalHeader_beeny_32",
  La = "_searchInput_beeny_43",
  Na = "_clearButton_beeny_67",
  Ba = "_modalBody_beeny_82",
  Da = "_modalFooter_beeny_88",
  Ua = "_modalFooterShortcuts_beeny_98",
  Ma = "_modalFooterShortcut_beeny_98",
  W = {
    modalOverlay: Ia,
    modalInner: Ta,
    modalContainer: Ra,
    modalHeader: Oa,
    searchInput: La,
    clearButton: Na,
    modalBody: Ba,
    modalFooter: Da,
    modalFooterShortcuts: Ua,
    modalFooterShortcut: Ma,
  },
  Wa = () =>
    o.jsxs("div", {
      className: W.modalFooter,
      children: [
        o.jsxs(L, {
          variant: "bodyXS",
          children: [
            "Subject to the Chainlink Foundation's",
            " ",
            o.jsx("a", { href: "https://chain.link/terms", children: "Terms of Service" }),
            ".",
          ],
        }),
        o.jsxs("div", {
          className: W.modalFooterShortcuts,
          children: [
            o.jsxs("div", {
              className: W.modalFooterShortcut,
              children: [o.jsx(Dt, {}), o.jsx(L, { variant: "bodyXS", children: "Navigate" })],
            }),
            o.jsxs("div", {
              className: W.modalFooterShortcut,
              children: [o.jsx(Ut, {}), o.jsx(L, { variant: "bodyXS", children: "Select" })],
            }),
            o.jsxs("div", {
              className: W.modalFooterShortcut,
              children: [o.jsx(Mt, {}), o.jsx(L, { variant: "bodyXS", children: "Exit" })],
            }),
          ],
        }),
      ],
    }),
  Fa = (a, s) => {
    let l
    return (...d) => {
      clearTimeout(l), (l = setTimeout(() => a(...d), s))
    }
  },
  Va = ({ onSearchInputChange: a, debounceDelay: s = 300 }) => {
    const [l, d] = k.useState(""),
      y = k.useRef(null),
      p = k.useCallback(
        Fa((r) => {
          a(r)
        }, s),
        [a, s]
      ),
      h = (r) => {
        d(r.target.value), p(r.target.value)
      },
      e = () => {
        var r
        d(""), a(""), (r = y.current) == null || r.focus()
      }
    return o.jsxs("div", {
      className: W.modalHeader,
      children: [
        o.jsx(Bt, {}),
        o.jsx("input", {
          ref: y,
          type: "text",
          value: l,
          placeholder: "Search across Chainlink resources",
          autoFocus: !0,
          onChange: h,
          className: `${De.body} ${W.searchInput}`,
        }),
        !!l &&
          o.jsxs("button", {
            onClick: e,
            className: W.clearButton,
            children: [o.jsx(Ht, {}), o.jsx(L, { variant: "bodySemiXS", children: "Clear" })],
          }),
      ],
    })
  },
  Xa = ({ onClose: a, algoliaAppId: s, algoliaPublicApiKey: l, categoryOrder: d }) => {
    const [y, p] = k.useState(!0),
      [h, e] = k.useState([]),
      r = k.useMemo(() => Pt(s, l), [s, l])
    k.useEffect(() => {
      const c = (i) => {
        i.key === "Escape" && (i.preventDefault(), a())
      }
      return (
        window.addEventListener("keydown", c),
        () => {
          window.removeEventListener("keydown", c)
        }
      )
    }, [a])
    const n = async (c) => {
      if (!c || c.length <= 1) {
        p(!0)
        return
      }
      const i = await r.search({ requests: qt(c) }),
        u = xt((i == null ? void 0 : i.results) ?? [])
      e(u), p(!1)
    }
    return Gr.createPortal(
      o.jsx("div", {
        className: W.modalOverlay,
        children: o.jsx("div", {
          className: W.modalInner,
          children: o.jsxs("div", {
            className: W.modalContainer,
            children: [
              o.jsx(Va, { onSearchInputChange: n }),
              o.jsx("div", {
                className: W.modalBody,
                children: y ? o.jsx(ua, {}) : o.jsx(ka, { items: h, categoryOrder: d }),
              }),
              o.jsx(Wa, {}),
            ],
          }),
        }),
      }),
      document.body
    )
  },
  Ha = "_searchButton_kihn0_1",
  Ga = { searchButton: Ha },
  Ka = "⌘",
  Ya = ({ algoliaAppId: a, algoliaPublicApiKey: s, categoryOrder: l }) => {
    const [d, y] = k.useState(!1),
      [p, h] = k.useState(!1)
    return (
      k.useEffect(() => {
        const e = Zr() === H.MAC
        h(e)
        const r = (n) => {
          ;((e && n.metaKey) || (!e && n.ctrlKey)) && n.key === "k" && (n.preventDefault(), y(!0))
        }
        return (
          window.addEventListener("keydown", r),
          () => {
            window.removeEventListener("keydown", r)
          }
        )
      }, []),
      o.jsxs(k.Suspense, {
        children: [
          o.jsxs("button", {
            onClick: () => y(!0),
            className: Ga.searchButton,
            children: [
              o.jsx("img", {
                src: "https://cdn.prod.website-files.com/64cc2c23d8dbd707cdb556d8/650045e119dad0f3be8fbbf6_ic-search.svg",
                loading: "lazy",
                alt: "Search",
              }),
              p ? Ka : "Ctrl +",
              " k",
            ],
          }),
          d && o.jsx(Xa, { algoliaAppId: a, algoliaPublicApiKey: s, categoryOrder: l, onClose: () => y(!1) }),
        ],
      })
    )
  }
exports.SearchButton = Ya
