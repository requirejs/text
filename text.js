(function () {
    var k = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
        n = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        o = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        i = typeof location !== "undefined" && location.href,
        p = i && location.protocol && location.protocol.replace(/\:/, ""),
        q = i && location.hostname,
        r = i && (location.port || void 0),
        j = [];
    define(function () {
        var g, h, l;
        typeof window !== "undefined" && window.navigator && window.document ? h = function (a, b) {
            var c = g.createXhr();
            c.open("GET", a, !0);
            c.onreadystatechange =
                function () {
                    c.readyState === 4 && b(c.responseText)
                };
            c.send(null)
        } : typeof process !== "undefined" && process.versions && process.versions.node ? (l = require.nodeRequire("fs"), h = function (a, b) {
            b(l.readFileSync(a, "utf8"))
        }) : typeof Packages !== "undefined" && (h = function (a, b) {
            var c = new java.io.File(a),
                e = java.lang.System.getProperty("line.separator"),
                c = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(c), "utf-8")),
                d, f, g = "";
            try {
                d = new java.lang.StringBuffer;
                (f = c.readLine()) && f.length() &&
                    f.charAt(0) === 65279 && (f = f.substring(1));
                for (d.append(f) ;
                    (f = c.readLine()) !== null;) d.append(e), d.append(f);
                g = String(d.toString())
            } finally {
                c.close()
            }
            b(g)
        });
        return g = {
            version: "0.27.0",
            strip: function (a) {
                if (a) {
                    var a = a.replace(n, ""),
                        b = a.match(o);
                    b && (a = b[1])
                } else a = "";
                return a
            },
            jsEscape: function (a) {
                return a.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r")
            },
            createXhr: function () {
                var a, b, c;
                if (!('withCredentials' in new XMLHttpRequest()) && !(typeof XDomainRequest !== "undefined")) return new XMLHttpRequest;
                else
                    for (b = 0; b < 3; b++) {
                        c = k[b];
                        try {
                           a = new ActiveXObject(c)
                        } catch (e) { }
                        if (a) {
                            k = [c];
                            break
                        }
                    }
                if (!a) throw Error("createXhr(): XMLHttpRequest not available");
                return a
            },
            get: h,
            parseName: function (a) {
                var b = !1,
                    c = a.indexOf("."),
                    e = a.substring(0, c),
                    a = a.substring(c + 1, a.length),
                    c = a.indexOf("!");
                c !== -1 && (b = a.substring(c + 1, a.length), b = b === "strip", a = a.substring(0, c));
                return {
                    moduleName: e,
                    ext: a,
                    strip: b
                }
            },
            xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
            useXhr: function (a, b, c, e) {
                var d = g.xdRegExp.exec(a),
                    f;
                if (!d) return !0;
                a = d[2];
                d = d[3];
                d = d.split(":");
                f = d[1];
                d = d[0];
                return (!a || a === b) && (!d || d === c) && (!f && !d || f === e)
            },
            finishLoad: function (a, b, c, e, d) {
                c = b ? g.strip(c) : c;
                d.isBuild && d.inlineText && (j[a] = c);
                e(c)
            },
            load: function (a, b, c, e) {
                var d = g.parseName(a),
                    f = d.moduleName + "." + d.ext,
                    m = b.toUrl(f),
                    h = e && e.text && e.text.useXhr || g.useXhr;
                !i || h(m, p, q, r) ? g.get(m, function (b) {
                    g.finishLoad(a, d.strip, b, c, e)
                }) : b([f], function (a) {
                    g.finishLoad(d.moduleName + "." + d.ext, d.strip, a, c, e)
                })
            },
            write: function (a, b, c) {
                if (b in j) {
                    var e = g.jsEscape(j[b]);
                    c.asModule(a + "!" + b, "define(function () { return '" + e + "';});\n")
                }
            },
            writeFile: function (a, b, c, e, d) {
                var b = g.parseName(b),
                    f = b.moduleName + "." + b.ext,
                    h = c.toUrl(b.moduleName + "." + b.ext) + ".js";
                g.load(f, c, function () {
                    var b = function (a) {
                        return e(h, a)
                    };
                    b.asModule = function (a, b) {
                        return e.asModule(a, h, b)
                    };
                    g.write(a, f, b, d)
                }, d)
            }
        }
    })
})();
