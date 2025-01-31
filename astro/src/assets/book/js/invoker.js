(() => {
    if (typeof HTMLButtonElement > "u" || "source" in ((globalThis.CommandEvent || {}).prototype || {}))
        return;
    document.addEventListener("invoke", t => {
        t.type == "invoke" && t.isTrusted && (t.stopImmediatePropagation(), t.preventDefault())
    }, !0),
    document.addEventListener("command", t => {
        t.type == "command" && t.isTrusted && (t.stopImmediatePropagation(), t.preventDefault())
    }, !0);
    function h(t, o, e=!0) {
        Object.defineProperty(t, o, {
            ...Object.getOwnPropertyDescriptor(t, o),
            enumerable: e
        })
    }
    function s(t) {
        return t && typeof t.getRootNode == "function" ? t.getRootNode() : t && t.parentNode ? s(t.parentNode) : t
    }
    const p = globalThis.ShadowRoot || function() {},
        d = new WeakMap,
        u = new WeakMap;
    class m extends Event {
        constructor(o, e={})
        {
            super(o, e);
            const {source: n, command: r} = e;
            if (n != null && !(n instanceof Element))
                throw new TypeError("source must be an element");
            d.set(this, n || null),
            u.set(this, r !== void 0 ? String(r) : "")
        }
        get [Symbol.toStringTag]()
        {
            return "CommandEvent"
        }
        get source()
        {
            if (!d.has(this))
                throw new TypeError("illegal invocation");
            const o = d.get(this);
            if (!(o instanceof Element))
                return null;
            const e = s(o);
            return e !== s(this.target || document) ? e.host : o
        }
        get command()
        {
            if (!u.has(this))
                throw new TypeError("illegal invocation");
            return u.get(this)
        }
        get action()
        {
            throw new Error("CommandEvent#action was renamed to CommandEvent#command")
        }
        get invoker()
        {
            throw new Error("CommandEvent#invoker was renamed to CommandEvent#source")
        }
    }
    h(m.prototype, "source"),
    h(m.prototype, "command");
    class v extends Event {
        constructor()
        {
            throw new Error("InvokeEvent has been deprecated, it has been renamed to `ComamndEvent`")
        }
    }
    const c = new WeakMap;
    function w(t) {
        Object.defineProperties(t.prototype, {
            commandForElement: {
                enumerable: !0,
                configurable: !0,
                set(o) {
                    if (this.hasAttribute("invokeaction"))
                        throw new TypeError("Element has deprecated `invokeaction` attribute, replace with `command`");
                    if (this.hasAttribute("invoketarget"))
                        throw new TypeError("Element has deprecated `invoketarget` attribute, replace with `commandfor`");
                    if (o === null)
                        this.removeAttribute("commandfor"),
                        c.delete(this);
                    else if (o instanceof Element) {
                        this.setAttribute("commandfor", "");
                        const e = s(o);
                        s(this) === e || e === this.ownerDocument ? c.set(this, o) : c.delete(this)
                    } else
                        throw new TypeError("commandForElement must be an element or null")
                },
                get() {
                    if (this.localName !== "button")
                        return null;
                    if (this.hasAttribute("invokeaction") || this.hasAttribute("invoketarget"))
                        return console.warn("Element has deprecated `invoketarget` or `invokeaction` attribute, use `commandfor` and `command` instead"), null;
                    if (this.disabled)
                        return null;
                    if (this.form && this.getAttribute("type") !== "button")
                        return console.warn("Element with `commandFor` is a form participant. It should explicitly set `type=button` in order for `commandFor` to work"), null;
                    const o = c.get(this);
                    if (o)
                        return o.isConnected ? o : (c.delete(this), null);
                    const e = s(this),
                        n = this.getAttribute("commandfor");
                    return (e instanceof Document || e instanceof p) && n && e.getElementById(n) || null
                }
            },
            command: {
                enumerable: !0,
                configurable: !0,
                get() {
                    const o = this.getAttribute("command") || "";
                    return o || ""
                },
                set(o) {
                    this.setAttribute("command", o)
                }
            },
            invokeAction: {
                enumerable: !1,
                configurable: !0,
                get() {
                    throw new Error("invokeAction is deprecated. It has been renamed to command")
                },
                set() {
                    throw new Error("invokeAction is deprecated. It has been renamed to command")
                }
            },
            invokeTargetElement: {
                enumerable: !1,
                configurable: !0,
                get() {
                    throw new Error("invokeTargetElement is deprecated. It has been renamed to command")
                },
                set() {
                    throw new Error("invokeTargetElement is deprecated. It has been renamed to command")
                }
            }
        })
    }
    function b(t) {
        if (t.defaultPrevented || t.type !== "click")
            return;
        t.target.closest("button[invoketarget], button[invokeaction], input[invoketarget], input[invokeaction]") && console.warn("Elements with `invoketarget` or `invokeaction` are deprecated and should be renamed to use `commandfor` and `command` respectively");
        const e = t.target.closest("button[commandfor], button[command], input[commandfor], input[command]");
        if (!e)
            return;
        if (this.form && this.getAttribute("type") !== "button")
            throw t.preventDefault(), new Error("Element with `commandFor` is a form participant. It should explicitly set `type=button` in order for `commandFor` to work. In order for it to act as a Submit button, it must not have command or commandfor attributes");
        if (e.hasAttribute("command") !== e.hasAttribute("commandfor")) {
            const i = e.hasAttribute("command") ? "command" : "commandfor",
                l = e.hasAttribute("command") ? "commandfor" : "command";
            throw new Error(`Element with ${i} attribute must also have a ${l} attribute to function.`)
        }
        if (e.command !== "show-popover" && e.command !== "hide-popover" && e.command !== "toggle-popover" && e.command !== "show-modal" && e.command !== "close" && !e.command.startsWith("--")) {
            console.warn(`"${e.command}" is not a valid command value. Custom commands must begin with --`);
            return
        }
        const n = e.commandForElement,
            r = new m("command", {
                command: e.command,
                source: e
            });
        if (n.dispatchEvent(r), r.defaultPrevented)
            return;
        const a = r.command.toLowerCase();
        if (n.popover) {
            const i = !n.matches(":popover-open");
            i && (a === "toggle-popover" || a === "show-popover") ? n.showPopover() : !i && a === "hide-popover" && n.hidePopover()
        } else if (n.localName === "dialog") {
            const i = !n.hasAttribute("open");
            i && a === "show-modal" ? n.showModal() : !i && a === "close" && n.close()
        }
    }
    function f(t) {
        t.addEventListener("click", b, !0)
    }
    function g(t, o) {
        const e = t.prototype.attachShadow;
        t.prototype.attachShadow = function(r) {
            const a = e.call(this, r);
            return o(a), a
        };
        const n = t.prototype.attachInternals;
        t.prototype.attachInternals = function() {
            const r = n.call(this);
            return r.shadowRoot && o(r.shadowRoot), r
        }
    }
    w(globalThis.HTMLButtonElement || function() {}),
    g(globalThis.HTMLElement || function() {}, t => {
        f(t)
    }),
    f(document),
    Object.defineProperty(window, "CommandEvent", {
        value: m,
        configurable: !0,
        writable: !0
    }),
    Object.defineProperty(window, "InvokeEvent", {
        value: v,
        configurable: !0,
        writable: !0
    })
})();
