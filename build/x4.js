var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

// src/core/core_i18n.ts
var sym_lang = Symbol("i18n");
var languages = {};
function createLanguage(name, base) {
  languages[name] = {
    name,
    base,
    src_translations: {},
    translations: {}
  };
}
__name(createLanguage, "createLanguage");
function isLanguage(name) {
  return languages[name] !== void 0;
}
__name(isLanguage, "isLanguage");
function addTranslation(name, ...parts) {
  if (!isLanguage(name)) {
    return;
  }
  const lang = languages[name];
  parts.forEach((p) => {
    _patch(lang.src_translations, p);
  });
  lang.translations = _proxyfy(lang.src_translations, lang.base, true);
}
__name(addTranslation, "addTranslation");
function _patch(obj, by) {
  for (let n in by) {
    const src = by[n];
    if (typeof src === "string") {
      obj[n] = src;
    } else {
      if (Array.isArray(src) && (!obj[n] || !Array.isArray(obj[n]))) {
        obj[n] = [...src];
      } else if (!obj[n] || typeof obj[n] !== "object") {
        obj[n] = { ...src };
      } else {
        _patch(obj[n], by[n]);
      }
    }
  }
}
__name(_patch, "_patch");
function _proxyfy(obj, base, root) {
  const result = {};
  for (const n in obj) {
    if (typeof obj[n] !== "string" && !Array.isArray(obj[n])) {
      result[n] = _proxyfy(obj[n], base, false);
    } else {
      result[n] = obj[n];
    }
  }
  return _mk_proxy(result, base, root);
}
__name(_proxyfy, "_proxyfy");
function _mk_proxy(obj, base, root) {
  return new Proxy(obj, {
    get: /* @__PURE__ */ __name((target, prop) => {
      if (root) {
        req_path = [prop];
      } else {
        req_path.push(prop);
      }
      let value = target[prop];
      if (value === void 0) {
        if (base) {
          value = _findBaseTrans(base);
        }
        if (value === void 0) {
          console.error("I18N error: unable to find", "_tr." + req_path.join("."));
        }
      }
      return value;
    }, "get")
  });
}
__name(_mk_proxy, "_mk_proxy");
var req_path;
function _findBaseTrans(base) {
  while (base) {
    const lang = languages[base];
    let trans = lang.translations;
    let value;
    for (const p of req_path) {
      value = trans[p];
      if (value === void 0) {
        break;
      }
      trans = value;
    }
    if (value !== void 0) {
      return trans;
    }
    base = lang.base;
  }
  return void 0;
}
__name(_findBaseTrans, "_findBaseTrans");
var _tr = {};
function selectLanguage(name) {
  if (!isLanguage(name)) {
    return;
  }
  _tr = languages[name].translations;
  _tr[sym_lang] = name;
  return _tr;
}
__name(selectLanguage, "selectLanguage");
function getCurrentLanguage() {
  return _tr[sym_lang];
}
__name(getCurrentLanguage, "getCurrentLanguage");
function getAvailableLanguages() {
  return Object.keys(languages);
}
__name(getAvailableLanguages, "getAvailableLanguages");
var fr = {
  global: {
    ok: "OK",
    cancel: "Annuler",
    ignore: "Ignorer",
    yes: "Oui",
    no: "Non",
    abort: "Abandonner",
    retry: "Réessayer",
    error: "Erreur",
    today: "Aujourd'hui",
    open: "Ouvrir",
    new: "Nouveau",
    delete: "Supprimer",
    close: "Fermer",
    save: "Enregistrer",
    search: "Rechercher",
    search_tip: "Saisissez le texte à rechercher. <b>Enter</b> pour lancer la recherche. <b>Esc</b> pour annuler.",
    required_field: "information requise",
    invalid_format: "format invalide",
    invalid_email: "adresse mail invalide",
    invalid_number: "valeur numérique invalide",
    diff_date_seconds: "{0} secondes",
    diff_date_minutes: "{0} minutes",
    diff_date_hours: "{0} heures",
    invalid_date: "Date non reconnue ({0})",
    empty_list: "Liste vide",
    date_input_formats: "d/m/y|d.m.y|d m y|d-m-y|dmy",
    date_format: "D/M/Y",
    day_short: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    day_long: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    month_short: ["jan", "fév", "mar", "avr", "mai", "jun", "jui", "aoû", "sep", "oct", "nov", "déc"],
    month_long: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    property: "Propriété",
    value: "Valeur",
    err_403: `Vous n'avez pas les droits suffisants pour effectuer cette action`,
    copy: "Copier",
    cut: "Couper",
    paste: "Coller"
  }
};
var en = {
  global: {
    ok: "OK",
    cancel: "Cancel",
    ignore: "Ignore",
    yes: "Yes",
    no: "No",
    abort: "Abort",
    retry: "Retry",
    error: "Error",
    today: "Today",
    open: "Open",
    new: "New",
    delete: "Delete",
    close: "Close",
    save: "Save",
    search: "Search",
    search_tip: "Type in the text to search. <b>Enter</b> to start the search. <b>Esc</b> to cancel.",
    required_field: "missing information",
    invalid_format: "invalid format",
    invalid_email: "invalid email address",
    invalid_number: "bad numeric value",
    diff_date_seconds: "{0} seconds",
    diff_date_minutes: "{0} minutes",
    diff_date_hours: "{0} hours",
    invalid_date: "Unrecognized date({0})",
    empty_list: "Empty list",
    date_input_formats: "m/d/y|m.d.y|m d y|m-d-y|mdy",
    date_format: "M/D/Y",
    day_short: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    day_long: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    month_short: ["jan", "feb", "mar", "apr", "may", "jun", "jui", "aug", "sep", "oct", "nov", "dec"],
    month_long: ["january", "february", "march", "april", "mau", "june", "jully", "august", "september", "october", "november", "december"],
    property: "Property",
    value: "Value",
    err_403: `You do not have sufficient rights to do that action`,
    copy: "Copy",
    cut: "Cut",
    paste: "Paste"
  }
};
createLanguage("fr", null);
addTranslation("fr", fr);
createLanguage("en", "fr");
addTranslation("en", en);
selectLanguage("fr");

// src/core/core_tools.ts
function isString(val) {
  return typeof val === "string";
}
__name(isString, "isString");
function isNumber(v) {
  return typeof v === "number" && isFinite(v);
}
__name(isNumber, "isNumber");
function isArray(val) {
  return val instanceof Array;
}
__name(isArray, "isArray");
function isFunction(val) {
  return val instanceof Function;
}
__name(isFunction, "isFunction");
var _UnsafeHtml = class _UnsafeHtml extends String {
  constructor(value) {
    super(value);
  }
};
__name(_UnsafeHtml, "UnsafeHtml");
var UnsafeHtml = _UnsafeHtml;
function unsafeHtml(x) {
  return new UnsafeHtml(x);
}
__name(unsafeHtml, "unsafeHtml");
function clamp(v, min, max) {
  if (v < min) {
    return min;
  }
  if (v > max) {
    return max;
  }
  return v;
}
__name(clamp, "clamp");
var _Rect = class _Rect {
  constructor(l, t, w, h) {
    if (l !== void 0) {
      if (isNumber(l)) {
        this.left = l;
        this.top = t;
        this.width = w;
        this.height = h;
      } else {
        Object.assign(this, l);
      }
    }
  }
  get right() {
    return this.left + this.width;
  }
  get bottom() {
    return this.top + this.height;
  }
};
__name(_Rect, "Rect");
var Rect = _Rect;
function isFeatureAvailable(name) {
  switch (name) {
    case "eyedropper":
      return "EyeDropper" in window;
  }
  return false;
}
__name(isFeatureAvailable, "isFeatureAvailable");
var _Timer = class _Timer {
  /**
   * 
   */
  setTimeout(name, time, callback) {
    if (!this._timers) {
      this._timers = /* @__PURE__ */ new Map();
    } else {
      this.clearTimeout(name);
    }
    const tm = setTimeout(callback, time);
    this._timers.set(name, tm);
    return tm;
  }
  clearTimeout(name) {
    if (this._timers && this._timers.has(name)) {
      clearTimeout(this._timers.get(name));
      this._timers.delete(name);
    }
  }
  /**
   * 
   */
  setInterval(name, time, callback) {
    if (!this._timers) {
      this._timers = /* @__PURE__ */ new Map();
    } else {
      this.clearInterval(name);
    }
    const tm = setInterval(callback, time);
    this._timers.set(name, tm);
    return tm;
  }
  clearInterval(name) {
    if (this._timers && this._timers.has(name)) {
      clearInterval(this._timers.get(name));
      this._timers.delete(name);
    }
  }
  clearAllTimeouts() {
    var _a;
    (_a = this._timers) == null ? void 0 : _a.forEach((t) => {
      clearTimeout(t);
    });
    this._timers = null;
  }
};
__name(_Timer, "Timer");
var Timer = _Timer;
function asap(callback) {
  return requestAnimationFrame(callback);
}
__name(asap, "asap");
function pad(what, size, ch = "0") {
  let value;
  if (!isString(what)) {
    value = "" + what;
  } else {
    value = what;
  }
  if (size > 0) {
    return value.padEnd(size, ch);
  } else {
    return value.padStart(-size, ch);
  }
}
__name(pad, "pad");
function sprintf(format, ...args) {
  return format.replace(/{(\d+)}/g, function(match, index) {
    return typeof args[index] != "undefined" ? args[index] : match;
  });
}
__name(sprintf, "sprintf");
function pascalCase(string) {
  let result = string;
  result = result.replace(/([a-z])([A-Z])/g, "$1 $2");
  result = result.toLowerCase();
  result = result.replace(/[^- a-z0-9]+/g, " ");
  if (result.indexOf(" ") < 0) {
    return result;
  }
  result = result.trim();
  return result.replace(/ /g, "-");
}
__name(pascalCase, "pascalCase");
function camelCase(text) {
  let result = text.toLowerCase();
  result = result.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => {
    return chr.toUpperCase();
  });
  return result;
}
__name(camelCase, "camelCase");
var cur_locale = "fr-FR";
function _date_set_locale(locale) {
  cur_locale = locale;
}
__name(_date_set_locale, "_date_set_locale");
function date_format(date, options) {
  return formatIntlDate(date);
}
__name(date_format, "date_format");
function date_diff(date1, date2, options) {
  var dt = (date1.getTime() - date2.getTime()) / 1e3;
  let sec = dt;
  if (sec < 60) {
    return sprintf(_tr.global.diff_date_seconds, Math.round(sec));
  }
  let min = Math.floor(sec / 60);
  if (min < 60) {
    return sprintf(_tr.global.diff_date_minutes, Math.round(min));
  }
  let hrs = Math.floor(min / 60);
  return sprintf(_tr.global.diff_date_hours, hrs, min % 60);
}
__name(date_diff, "date_diff");
function date_to_sql(date, withHours) {
  if (withHours) {
    return formatIntlDate(date, "Y-M-D H:I:S");
  } else {
    return formatIntlDate(date, "Y-M-D");
  }
}
__name(date_to_sql, "date_to_sql");
function date_sql_utc(date) {
  let result = /* @__PURE__ */ new Date(date + " GMT");
  return result;
}
__name(date_sql_utc, "date_sql_utc");
function date_hash(date) {
  return date.getFullYear() << 16 | date.getMonth() << 8 | date.getDate();
}
__name(date_hash, "date_hash");
function date_clone(date) {
  return new Date(date.getTime());
}
__name(date_clone, "date_clone");
function date_calc_weeknum(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 864e5;
  return Math.floor((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
__name(date_calc_weeknum, "date_calc_weeknum");
function parseIntlDate(value, fmts = _tr.global.date_input_formats) {
  var _a, _b, _c, _d, _e, _f;
  let formats = fmts.split("|");
  for (let fmatch of formats) {
    let smatch = "";
    for (let c of fmatch) {
      if (c == "d" || c == "D") {
        smatch += "(?<day>\\d{1,2})";
      } else if (c == "m" || c == "M") {
        smatch += "(?<month>\\d{1,2})";
      } else if (c == "y" || c == "Y") {
        smatch += "(?<year>\\d{1,4})";
      } else if (c == "h" || c == "H") {
        smatch += "(?<hour>\\d{1,2})";
      } else if (c == "i" || c == "I") {
        smatch += "(?<min>\\d{1,2})";
      } else if (c == "s" || c == "S") {
        smatch += "(?<sec>\\d{1,2})";
      } else if (c == " ") {
        smatch += "\\s+";
      } else {
        smatch += "\\s*\\" + c + "\\s*";
      }
    }
    let rematch = new RegExp("^" + smatch + "$", "m");
    let match = rematch.exec(value);
    if (match) {
      const now = /* @__PURE__ */ new Date();
      let d = parseInt((_a = match.groups.day) != null ? _a : "1");
      let m = parseInt((_b = match.groups.month) != null ? _b : "1");
      let y = parseInt((_c = match.groups.year) != null ? _c : now.getFullYear() + "");
      let h = parseInt((_d = match.groups.hour) != null ? _d : "0");
      let i = parseInt((_e = match.groups.min) != null ? _e : "0");
      let s = parseInt((_f = match.groups.sec) != null ? _f : "0");
      if (y > 0 && y < 100) {
        y += 2e3;
      }
      let result = new Date(y, m - 1, d, h, i, s, 0);
      let ty = result.getFullYear(), tm = result.getMonth() + 1, td = result.getDate();
      if (ty != y || tm != m || td != d) {
        return null;
      }
      return result;
    }
  }
  return null;
}
__name(parseIntlDate, "parseIntlDate");
function formatIntlDate(date, fmt = _tr.global.date_format) {
  if (!date) {
    return "";
  }
  let now = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    wday: date.getDay(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milli: date.getMilliseconds()
  };
  let result = "";
  let esc = 0;
  for (let c of fmt) {
    if (c == "{") {
      if (++esc == 1) {
        continue;
      }
    } else if (c == "}") {
      if (--esc == 0) {
        continue;
      }
    }
    if (esc) {
      result += c;
      continue;
    }
    if (c == "d") {
      result += now.day;
    } else if (c == "D") {
      result += pad(now.day, -2);
    } else if (c == "j") {
      result += _tr.global.day_short[now.wday];
    } else if (c == "J") {
      result += _tr.global.day_long[now.wday];
    } else if (c == "w") {
      result += date_calc_weeknum(date);
    } else if (c == "W") {
      result += pad(date_calc_weeknum(date), -2);
    } else if (c == "m") {
      result += now.month;
    } else if (c == "M") {
      result += pad(now.month, -2);
    } else if (c == "o") {
      result += _tr.global.month_short[now.month - 1];
    } else if (c == "O") {
      result += _tr.global.month_long[now.month - 1];
    } else if (c == "y" || c == "Y") {
      result += pad(now.year, -4);
    } else if (c == "a" || c == "A") {
      result += now.hours < 12 ? "am" : "pm";
    } else if (c == "h") {
      result += now.hours;
    } else if (c == "H") {
      result += pad(now.hours, -2);
    } else if (c == "i") {
      result += now.minutes;
    } else if (c == "I") {
      result += pad(now.minutes, -2);
    } else if (c == "s") {
      result += now.seconds;
    } else if (c == "S") {
      result += pad(now.seconds, -2);
    } else if (c == "l") {
      result += now.milli;
    } else if (c == "L") {
      result += pad(now.milli, -3);
    } else {
      result += c;
    }
  }
  return result;
}
__name(formatIntlDate, "formatIntlDate");
function calcAge(birth, ref) {
  if (ref === void 0) {
    ref = /* @__PURE__ */ new Date();
  }
  if (!birth) {
    return 0;
  }
  let age = ref.getFullYear() - birth.getFullYear();
  if (ref.getMonth() < birth.getMonth() || ref.getMonth() == birth.getMonth() && ref.getDate() < birth.getDate()) {
    age--;
  }
  return age;
}
__name(calcAge, "calcAge");
function beep() {
  const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  snd.play();
}
__name(beep, "beep");

// src/core/core_events.ts
var stopPropagation = /* @__PURE__ */ __name(function() {
  this.propagationStopped = true;
}, "stopPropagation");
var preventDefault = /* @__PURE__ */ __name(function() {
  this.defaultPrevented = true;
}, "preventDefault");
var _EventSource = class _EventSource {
  constructor(source = null) {
    this._source = source != null ? source : this;
  }
  addListener(name, callback, capturing = false) {
    if (!this._registry) {
      this._registry = /* @__PURE__ */ new Map();
    }
    let listeners = this._registry.get(name);
    if (!listeners) {
      listeners = [];
      this._registry.set(name, listeners);
    }
    const cb = callback;
    if (listeners.indexOf(cb) == -1) {
      if (capturing) {
        listeners.unshift(cb);
      } else {
        listeners.push(cb);
      }
    }
  }
  fire(name, evx) {
    var _a;
    let listeners = (_a = this._registry) == null ? void 0 : _a.get(name);
    if (listeners && listeners.length) {
      let ev = evx;
      if (!ev) {
        ev = {};
      }
      if (!ev.source) {
        ev.source = this._source;
      }
      if (!ev.type) {
        ev.type = name;
      }
      if (!ev.preventDefault) {
        ev.preventDefault = preventDefault;
      }
      if (!ev.stopPropagation) {
        ev.stopPropagation = stopPropagation;
      }
      if (listeners.length == 1) {
        listeners[0](ev);
      } else {
        const temp = listeners.slice();
        for (let i = 0, n = temp.length; i < n; i++) {
          temp[i](ev);
          if (ev.propagationStopped) {
            break;
          }
        }
      }
    }
  }
};
__name(_EventSource, "EventSource");
var EventSource = _EventSource;

// src/core/core_element.ts
var _events, _timers;
var _CoreElement = class _CoreElement {
  constructor() {
    __privateAdd(this, _events);
    __privateAdd(this, _timers);
  }
  __startTimer(name, ms, repeat, callback) {
    if (!__privateGet(this, _timers)) {
      __privateSet(this, _timers, /* @__PURE__ */ new Map());
    } else {
      this.__stopTimer(name);
    }
    const id = (repeat ? setInterval : setTimeout)(callback, ms);
    __privateGet(this, _timers).set(name, () => {
      (repeat ? clearInterval : clearTimeout)(id);
      __privateGet(this, _timers).delete(name);
    });
  }
  __stopTimer(name) {
    const clear = __privateGet(this, _timers).get(name);
    if (clear) {
      clear();
    }
  }
  setTimeout(name, ms, callback) {
    this.__startTimer(name, ms, false, callback);
  }
  clearTimeout(name) {
    this.__stopTimer(name);
  }
  setInterval(name, ms, callback) {
    this.__startTimer(name, ms, true, callback);
  }
  clearInterval(name) {
    this.__stopTimer(name);
  }
  clearTimeouts() {
    for (const [id, val] of __privateGet(this, _timers)) {
      val();
    }
    __privateGet(this, _timers).clear();
  }
  // :: EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * attach to an event
   */
  on(name, listener) {
    console.assert(listener !== void 0 && listener !== null);
    if (!__privateGet(this, _events)) {
      __privateSet(this, _events, new EventSource(this));
    }
    __privateGet(this, _events).addListener(name, listener);
  }
  /**
   * 
   */
  fire(name, ev) {
    if (__privateGet(this, _events)) {
      __privateGet(this, _events).fire(name, ev);
    }
  }
};
_events = new WeakMap();
_timers = new WeakMap();
__name(_CoreElement, "CoreElement");
var CoreElement = _CoreElement;

// src/core/core_styles.ts
var unitless = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
function isUnitLess(name) {
  return unitless[name] ? true : false;
}
__name(isUnitLess, "isUnitLess");
var _Stylesheet = class _Stylesheet {
  constructor() {
    this.m_rules = /* @__PURE__ */ new Map();
    function getStyleSheet(name) {
      for (let i = 0; i < document.styleSheets.length; i++) {
        let sheet = document.styleSheets[i];
        if (sheet.title === name) {
          return sheet;
        }
      }
    }
    __name(getStyleSheet, "getStyleSheet");
    this.m_sheet = getStyleSheet("x4-dynamic-css");
    if (!this.m_sheet) {
      const dom = document.createElement("style");
      dom.setAttribute("id", "x4-dynamic-css");
      document.head.appendChild(dom);
      this.m_sheet = dom.sheet;
    }
  }
  /**
   * add a new rule to the style sheet
   * @param {string} name - internal rule name 
   * @param {string} definition - css definition of the rule 
   * @example
   * setRule('xbody', "body { background-color: #ff0000; }" );
   */
  setRule(name, definition) {
    if (isString(definition)) {
      let index = this.m_rules.get(name);
      if (index !== void 0) {
        this.m_sheet.deleteRule(index);
      } else {
        index = this.m_sheet.cssRules.length;
      }
      this.m_rules.set(name, this.m_sheet.insertRule(definition, index));
    } else {
      let idx = 1;
      for (let r in definition) {
        let rule = r + " { ", css = definition[r];
        for (let i in css) {
          let values = css[i];
          for (let j = 0; j < values.length; j++) {
            rule += i + ": " + values[j] + "; ";
          }
        }
        rule += "}";
        this.setRule(name + "--" + idx, rule);
        idx++;
      }
    }
  }
  /**
   * return the style variable value
   * @param name - variable name 
   * @example
   * ```
   * let color = Component.getCss( ).getVar( 'button-color' );
   * ```
   */
  static getVar(name) {
    if (!_Stylesheet.doc_style) {
      _Stylesheet.doc_style = getComputedStyle(document.documentElement);
    }
    if (!name.startsWith("--")) {
      name = "--" + name;
    }
    return _Stylesheet.doc_style.getPropertyValue(name);
  }
};
__name(_Stylesheet, "Stylesheet");
_Stylesheet.guid = 1;
var Stylesheet = _Stylesheet;
var _ComputedStyle = class _ComputedStyle {
  constructor(style) {
    this.m_style = style;
  }
  /**
   * return the raw value
   */
  value(name) {
    return this.m_style[name];
  }
  /**
   * return the interpreted value
   */
  parse(name) {
    return parseInt(this.m_style[name]);
  }
  /**
   * 
   */
  get style() {
    return this.m_style;
  }
};
__name(_ComputedStyle, "ComputedStyle");
var ComputedStyle = _ComputedStyle;

// src/core/core_dom.ts
var unbubbleEvents = {
  mouseleave: 1,
  mouseenter: 1,
  load: 1,
  unload: 1,
  scroll: 1,
  focus: 1,
  blur: 1,
  rowexit: 1,
  beforeunload: 1,
  stop: 1,
  dragdrop: 1,
  dragenter: 1,
  dragexit: 1,
  draggesture: 1,
  dragover: 1,
  contextmenu: 1,
  created: 2,
  removed: 2,
  sizechange: 2
};
var event_handlers = /* @__PURE__ */ new WeakMap();
var mutObserver = null;
var observeMutation = /* @__PURE__ */ __name((mutations, observer) => {
  const sendEvent = /* @__PURE__ */ __name((node, code) => {
    const store = event_handlers.get(node);
    if (store && store[code]) {
      node.dispatchEvent(new Event(code, {}));
    }
  }, "sendEvent");
  const notify = /* @__PURE__ */ __name((node, create) => {
    if (create) {
      sendEvent(node, "created");
    }
    for (let c = node.firstChild; c; c = c.nextSibling) {
      notify(c, create);
    }
    if (!create) {
      sendEvent(node, "removed");
    }
  }, "notify");
  for (const mutation of mutations) {
    if (mutation.type == "childList") {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          notify(node, true);
        });
      }
      if (mutation.removedNodes) {
        mutation.removedNodes.forEach((node) => {
          notify(node, false);
        });
      }
    }
  }
}, "observeMutation");
var sizeObserver = null;
function observeSize(entries) {
  entries.forEach((entry) => {
    let dom = entry.target;
    if (dom.offsetParent !== null) {
      dom.dispatchEvent(new Event("resized"));
    }
  });
}
__name(observeSize, "observeSize");
function dispatchEvent(ev) {
  let target = ev.target, noup = unbubbleEvents[ev.type] === 2;
  while (target) {
    const store = event_handlers.get(target);
    if (store) {
      const callback = store[ev.type];
      if (callback) {
        if (Array.isArray(callback)) {
          callback.some((c) => c(ev));
        } else {
          callback(ev);
        }
        if (ev.stopPropagation || ev.defaultPrevented || noup) {
          break;
        }
      }
    }
    target = target.parentNode;
    if (target == document) {
      break;
    }
  }
}
__name(dispatchEvent, "dispatchEvent");
function addEvent(node, name, handler, prepend = false) {
  if (name == "removed" || name == "created") {
    if (!mutObserver) {
      mutObserver = new MutationObserver(observeMutation);
      mutObserver.observe(document.body, { childList: true, subtree: true });
    }
  } else if (name == "resized") {
    if (!sizeObserver) {
      sizeObserver = new ResizeObserver(observeSize);
    }
    sizeObserver.observe(node);
  }
  let store = event_handlers.get(node);
  if (!store) {
    store = {};
    event_handlers.set(node, store);
  }
  if (!store[name]) {
    store[name] = handler;
    node.addEventListener(name, dispatchEvent);
  } else {
    const entry = store[name];
    if (Array.isArray(entry)) {
      entry.push(handler);
    } else {
      store[name] = [entry, handler];
    }
  }
}
__name(addEvent, "addEvent");

// src/core/component.ts
var FRAGMENT = Symbol("fragment");
var COMPONENT = Symbol("component");
var RE_NUMBER = /^-?\d+(\.\d*)?$/;
function genClassNames(x) {
  let classes = [];
  let self = Object.getPrototypeOf(x);
  while (self && self.constructor !== Component) {
    let clsname = self.constructor.name;
    classes.push("x4" + clsname.toLowerCase());
    self = Object.getPrototypeOf(self);
  }
  return classes;
}
__name(genClassNames, "genClassNames");
var gen_id = 1e3;
var makeUniqueComponentId = /* @__PURE__ */ __name(() => {
  return `x4-${gen_id++}`;
}, "makeUniqueComponentId");
var _Component = class _Component extends CoreElement {
  constructor(props) {
    var _a, _b;
    super();
    this.props = props;
    if (props.existingDOM) {
      this.dom = props.existingDOM;
    } else {
      if (props.ns) {
        this.dom = document.createElementNS(props.ns, (_a = props.tag) != null ? _a : "div");
      } else {
        this.dom = document.createElement((_b = props.tag) != null ? _b : "div");
      }
      if (props.attrs) {
        this.setAttributes(props.attrs);
      }
      if (props.cls) {
        this.addClass(props.cls);
      }
      if (props.hidden) {
        this.show(false);
      }
      if (props.id !== void 0) {
        this.setAttribute("id", props.id);
      }
      if (props.width !== void 0) {
        this.setStyleValue("width", props.width);
      }
      if (props.height !== void 0) {
        this.setStyleValue("height", props.height);
      }
      if (props.tooltip) {
        this.setAttribute("tooltip", props.tooltip);
      }
      if (props.style) {
        this.setStyle(props.style);
      }
      if (props.content) {
        this.setContent(props.content);
      }
      if (props.dom_events) {
        this.setDOMEvents(props.dom_events);
      }
      const classes = genClassNames(this);
      this.dom.classList.add(...classes);
      if (props.disabled) {
        this.addDOMEvent("created", () => {
          this.enable(false);
        });
      }
    }
    this.dom[COMPONENT] = this;
  }
  // :: CLASSES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  hasClass(cls) {
    return this.dom.classList.contains(cls);
  }
  /**
   * 
   */
  addClass(cls) {
    if (!cls) return;
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      this.dom.classList.add(...ccs);
    } else {
      this.dom.classList.add(cls);
    }
  }
  /**
   * 
   */
  removeClass(cls) {
    if (!cls) return;
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      this.dom.classList.remove(...ccs);
    } else {
      this.dom.classList.remove(cls);
    }
  }
  /**
   * 
   */
  removeClassEx(re) {
    const all = Array.from(this.dom.classList);
    all.forEach((x) => {
      if (x.match(re)) {
        this.dom.classList.remove(x);
      }
    });
  }
  /**
   * 
   */
  toggleClass(cls) {
    if (!cls) return;
    const toggle = /* @__PURE__ */ __name((x) => {
      this.dom.classList.toggle(x);
    }, "toggle");
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      ccs.forEach(toggle);
    } else {
      toggle(cls);
    }
  }
  /**
   * 
   */
  setClass(cls, set = true) {
    if (set) this.addClass(cls);
    else this.removeClass(cls);
  }
  // :: ATTRIBUTES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * attributes
   */
  setAttributes(attrs) {
    for (const name in attrs) {
      const value = attrs[name];
      this.setAttribute(name, value);
    }
  }
  /**
   * 
   */
  setAttribute(name, value) {
    if (value === null || value === void 0) {
      this.dom.removeAttribute(name);
    } else {
      this.dom.setAttribute(name, "" + value);
    }
  }
  /**
   * 
   */
  getAttribute(name) {
    return this.dom.getAttribute(name);
  }
  /**
   * 
   */
  getData(name) {
    return this.getAttribute("data-" + name);
  }
  /**
   * 
   */
  setData(name, value) {
    return this.setAttribute("data-" + name, value);
  }
  /**
   * idem as setData but onot on dom, you can store anything 
   */
  setInternalData(name, value) {
    if (!this.store) {
      this.store = /* @__PURE__ */ new Map();
    }
    this.store.set(name, value);
    return this;
  }
  getInternalData(name) {
    var _a;
    return (_a = this.store) == null ? void 0 : _a.get(name);
  }
  // :: DOM EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  addDOMEvent(name, listener, prepend = false) {
    addEvent(this.dom, name, listener, prepend);
  }
  /**
   * 
   */
  setDOMEvents(events) {
    for (const name in events) {
      this.addDOMEvent(name, events[name]);
    }
  }
  // :: HILEVEL EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * tool to move named events to internal event map
   * @internal
   */
  mapPropEvents(props, ...elements) {
    const p = props;
    elements.forEach((n) => {
      if (p.hasOwnProperty(n)) {
        this.on(n, p[n]);
      }
    });
  }
  // :: CONTENT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * remove all content from component
   */
  clearContent() {
    const d = this.dom;
    while (d.firstChild) {
      d.removeChild(d.firstChild);
    }
  }
  /**
   * change the whole content of the component
   * clear the content before
   * @param content new content
   */
  setContent(content) {
    this.clearContent();
    this.appendContent(content);
  }
  /**
   * cf. appendContent
   * @param content content to append
   */
  appendContent(content) {
    const set = /* @__PURE__ */ __name((d, c) => {
      if (c instanceof _Component) {
        d.appendChild(c.dom);
      } else if (c instanceof UnsafeHtml) {
        d.insertAdjacentHTML("beforeend", c.toString());
      } else if (typeof c === "string" || typeof c === "number") {
        const tnode = document.createTextNode(c.toString());
        d.appendChild(tnode);
      } else if (c) {
        console.warn("Unknown type to append: ", c);
      }
    }, "set");
    if (!isArray(content)) {
      set(this.dom, content);
    } else if (content.length <= 8) {
      for (const c of content) {
        set(this.dom, c);
      }
    } else {
      const fragment = document.createDocumentFragment();
      for (const child of content) {
        set(fragment, child);
      }
      this.dom.appendChild(fragment);
    }
  }
  /**
   * cf. appendContent
   * @param content content to append
   */
  prependContent(content) {
    const d = this.dom;
    const set = /* @__PURE__ */ __name((c) => {
      if (c instanceof _Component) {
        d.insertBefore(d.firstChild, c.dom);
      } else if (c instanceof UnsafeHtml) {
        d.insertAdjacentHTML("beforebegin", c.toString());
      } else if (typeof c === "string" || typeof c === "number") {
        const tnode = document.createTextNode(c.toString());
        d.insertBefore(d.firstChild, tnode);
      } else {
        console.warn("Unknown type to append: ", c);
      }
    }, "set");
    if (!isArray(content)) {
      set(content);
    } else {
      const fragment = document.createDocumentFragment();
      for (const child of content) {
        set(child);
      }
      d.insertBefore(d.firstChild, fragment);
    }
  }
  /**
   * remove a single child
   * @see clearContent
   */
  removeChild(child) {
    this.dom.removeChild(child.dom);
  }
  /**
   * query all elements by selector
   */
  queryAll(selector) {
    const all = this.dom.querySelectorAll(selector);
    const rc = new Array(all.length);
    all.forEach((x, i) => rc[i] = componentFromDOM(x));
    return rc;
  }
  /**
   * 
   */
  query(selector) {
    const r = this.dom.querySelector(selector);
    return componentFromDOM(r);
  }
  // :: STYLES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  setAria(name, value) {
    this.setAttribute(name, value);
    return this;
  }
  /**
   * 
   */
  setStyle(style) {
    const _style = this.dom.style;
    for (const name in style) {
      let value = style[name];
      if (!unitless[name] && (isNumber(value) || RE_NUMBER.test(value))) {
        value += "px";
      }
      _style[name] = value;
    }
    return this;
  }
  /**
   * 
   */
  setStyleValue(name, value) {
    const _style = this.dom.style;
    if (isNumber(value)) {
      let v = value + "";
      if (!unitless[name]) {
        v += "px";
      }
      _style[name] = v;
    } else {
      _style[name] = value;
    }
    return this;
  }
  /**
   * 
   * @param name 
   * @returns 
   */
  getStyleValue(name) {
    const _style = this.dom.style;
    return _style[name];
  }
  setWidth(w) {
    this.setStyleValue("width", isNumber(w) ? w + "px" : w);
  }
  setHeight(h) {
    this.setStyleValue("height", isNumber(h) ? h + "px" : h);
  }
  /**
   * 
   */
  setStyleVariable(name, value) {
    this.dom.style.setProperty(name, value);
  }
  /**
   * 
   */
  getStyleVariable(name) {
    const style = this.getComputedStyle();
    return style.getPropertyValue(name);
  }
  /**
   * 
   * @returns 
   */
  getComputedStyle() {
    return getComputedStyle(this.dom);
  }
  /**
   * 
   */
  setCapture(pointerId) {
    this.dom.setPointerCapture(pointerId);
  }
  /**
   * 
   */
  releaseCapture(pointerId) {
    this.dom.releasePointerCapture(pointerId);
  }
  /**
   * 
   */
  getBoundingRect() {
    const rc = this.dom.getBoundingClientRect();
    return new Rect(rc.x, rc.y, rc.width, rc.height);
  }
  // :: MISC ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  focus() {
    this.dom.focus();
  }
  /**
   * 
   */
  scrollIntoView(arg) {
    this.dom.scrollIntoView(arg);
  }
  /**
   * 
   */
  isVisible() {
    return this.dom.offsetParent !== null;
  }
  /**
   * 
   */
  show(vis = true) {
    this.setClass("x4hidden", !vis);
  }
  /**
   * 
   */
  hide() {
    this.show(false);
  }
  /**
   * enable or disable a component (all sub HTMLElement will be also disabled)
   */
  enable(ena = true) {
    this.setAttribute("disabled", !ena);
    const nodes = this.enumChildNodes(true);
    nodes.forEach((x) => {
      if (x instanceof HTMLInputElement) {
        x.disabled = !ena;
      }
    });
  }
  /**
   * 
   */
  disable() {
    this.enable(false);
  }
  /**
   * check if element is marked disabled
   */
  isDisabled() {
    return this.getAttribute("disabled");
  }
  /**
   * 
   */
  nextElement() {
    const nxt = this.dom.nextElementSibling;
    return componentFromDOM(nxt);
  }
  /**
   * 
   * @returns 
   */
  prevElement() {
    const nxt = this.dom.previousElementSibling;
    return componentFromDOM(nxt);
  }
  /**
   * search for parent that match the given contructor 
   */
  parentElement(cls) {
    let p = this.dom;
    while (p.parentElement) {
      const cp = componentFromDOM(p.parentElement);
      if (!cls) {
        return cp;
      }
      if (cp && cp instanceof cls) {
        return cp;
      }
      p = p.parentElement;
    }
    return null;
  }
  /**
   * 
   * @returns 
   */
  firstChild() {
    const nxt = this.dom.firstElementChild;
    return componentFromDOM(nxt);
  }
  /**
   * 
   * @returns 
   */
  lastChild() {
    const nxt = this.dom.lastElementChild;
    return componentFromDOM(nxt);
  }
  /**
   * renvoie la liste des Composants enfants
   */
  enumChildComponents(recursive) {
    let children = [];
    const nodes = this.enumChildNodes(recursive);
    nodes.forEach((c) => {
      const cc = componentFromDOM(c);
      if (cc) {
        children.push(cc);
      }
    });
    return children;
  }
  /**
   * return children list of node (not all should be components)
   */
  enumChildNodes(recursive) {
    let children = Array.from(recursive ? this.dom.querySelectorAll("*") : this.dom.children);
    return children;
  }
  /**
   * 
   */
  animate(keyframes, duration) {
    this.dom.animate(keyframes, duration);
  }
  // :: TSX/REACT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * called by the compiler when a jsx element is seen
   */
  static createElement(clsOrTag, attrs, ...children) {
    let comp;
    if (clsOrTag == this.createFragment || clsOrTag === FRAGMENT) {
      return children;
    }
    if (clsOrTag instanceof Function) {
      attrs = attrs != null ? attrs : {};
      if (!attrs.children && children && children.length) {
        attrs.content = children;
      }
      comp = new clsOrTag(attrs != null ? attrs : {});
    } else {
      comp = new _Component({
        tag: clsOrTag,
        content: children,
        ...attrs
      });
    }
    if (children && children.length) {
    }
    return comp;
  }
  /**
   * 
   */
  static createFragment() {
    return this.createElement(FRAGMENT, null);
  }
  // :: SPECIALS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  queryInterface(name) {
    return null;
  }
};
__name(_Component, "Component");
var Component = _Component;
function componentFromDOM(node) {
  return node ? node[COMPONENT] : null;
}
__name(componentFromDOM, "componentFromDOM");
function wrapDOM(el) {
  const com = componentFromDOM(el);
  if (com) {
    return com;
  }
  return new Component({ existingDOM: el });
}
__name(wrapDOM, "wrapDOM");
var _Flex = class _Flex extends Component {
  constructor() {
    super({});
  }
};
__name(_Flex, "Flex");
var Flex = _Flex;

// src/core/core_colors.ts
function hx(v) {
  const hex = v.toString(16);
  return hex.padStart(2, "0");
}
__name(hx, "hx");
function round(v) {
  return Math.round(v);
}
__name(round, "round");
var _Color = class _Color {
  constructor(...args) {
    this.rgb = [0, 0, 0, 1];
    this.invalid = false;
    if (isString(args[0])) {
      this.setValue(args[0]);
    } else {
      this.setRgb(args[0], args[1], args[2], args[3]);
    }
  }
  /**
   * accepts:
   * 	#aaa
   *  #ababab
   *  #ababab55
   *  rgb(a,b,c)
   *  rgba(a,b,c,d)
   *  var( --color-5 )
   */
  setValue(value) {
    this.invalid = false;
    if (value.length == 4 && /#[0-9a-fA-F]{3}/.test(value)) {
      const r1 = parseInt(value[1], 16);
      const g1 = parseInt(value[2], 16);
      const b1 = parseInt(value[3], 16);
      return this.setRgb(r1 << 4 | r1, g1 << 4 | g1, b1 << 4 | b1, 1);
    }
    if (value.length == 7 && /#[0-9a-fA-F]{6}/.test(value)) {
      const r1 = parseInt(value[1], 16);
      const r2 = parseInt(value[2], 16);
      const g1 = parseInt(value[3], 16);
      const g2 = parseInt(value[4], 16);
      const b1 = parseInt(value[5], 16);
      const b2 = parseInt(value[6], 16);
      return this.setRgb(r1 << 4 | r2, g1 << 4 | g2, b1 << 4 | b2, 1);
    }
    if (value.length == 9 && /#[0-9a-fA-F]{8}/.test(value)) {
      const r1 = parseInt(value[1], 16);
      const r2 = parseInt(value[2], 16);
      const g1 = parseInt(value[3], 16);
      const g2 = parseInt(value[4], 16);
      const b1 = parseInt(value[5], 16);
      const b2 = parseInt(value[6], 16);
      const a1 = parseInt(value[7], 16);
      const a2 = parseInt(value[8], 16);
      return this.setRgb(r1 << 4 | r2, g1 << 4 | g2, b1 << 4 | b2, (a1 << 4 | a2) / 255);
    }
    if (value.startsWith("rgba")) {
      const re = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*((\d+)|(\d*\.\d+)|(\.\d+))\s*\)/;
      const m = re.exec(value);
      if (m) {
        return this.setRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4]));
      }
    } else if (value.startsWith("rgb")) {
      const re = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
      const m = re.exec(value);
      if (m) {
        return this.setRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), 1);
      }
    } else if (value.startsWith("var")) {
      const re = /var\s*\(([^)]*)\)/;
      const m = re.exec(value);
      if (m) {
        const expr = m[1].trim();
        const style = getComputedStyle(document.documentElement);
        const value2 = style.getPropertyValue(expr);
        return this.setValue(value2);
      }
    }
    this.invalid = true;
    return this.setRgb(255, 0, 0, 1);
  }
  setHsv(h, s, v, a = 1) {
    let i = Math.min(5, Math.floor(h * 6)), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    let R, G, B;
    switch (i) {
      case 0:
        R = v;
        G = t;
        B = p;
        break;
      case 1:
        R = q;
        G = v;
        B = p;
        break;
      case 2:
        R = p;
        G = v;
        B = t;
        break;
      case 3:
        R = p;
        G = q;
        B = v;
        break;
      case 4:
        R = t;
        G = p;
        B = v;
        break;
      case 5:
        R = v;
        G = p;
        B = q;
        break;
    }
    return this.setRgb(R * 255, G * 255, B * 255, a);
  }
  setRgb(r, g, b, a) {
    this.rgb = [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255), clamp(a, 0, 1)];
    return this;
  }
  toRgbString(withAlpha) {
    const _ = this.rgb;
    return withAlpha === false || _[3] == 1 ? `rgb(${round(_[0])},${round(_[1])},${round(_[2])})` : `rgba(${round(_[0])},${round(_[1])},${round(_[2])},${_[3].toFixed(3)})`;
  }
  toHexString() {
    const _ = this.rgb;
    return _[3] == 1 ? `#(${hx(_[0])},${hx(_[1])},${hx(_[2])})` : `rgba(${hx(_[0])},${hx(_[1])},${hx(_[2])},${hx(_[3] * 255)})`;
  }
  toRgb() {
    const _ = this.rgb;
    return { red: _[0], green: _[1], blue: _[2], alpha: _[3] };
  }
  toHsv() {
    let el = this.toRgb();
    el.red /= 255;
    el.green /= 255;
    el.blue /= 255;
    const max = Math.max(el.red, el.green, el.blue);
    const min = Math.min(el.red, el.green, el.blue);
    const delta = max - min;
    const saturation = max === 0 ? 0 : delta / max;
    const value = max;
    let hue;
    if (delta === 0) {
      hue = 0;
    } else {
      switch (max) {
        case el.red:
          hue = (el.green - el.blue) / delta / 6 + (el.green < el.blue ? 1 : 0);
          break;
        case el.green:
          hue = (el.blue - el.red) / delta / 6 + 1 / 3;
          break;
        case el.blue:
          hue = (el.red - el.green) / delta / 6 + 2 / 3;
          break;
      }
    }
    return { hue, saturation, value, alpha: el.alpha };
  }
  getAlpha() {
    return this.rgb[3];
  }
  setAlpha(a) {
    this.rgb[3] = clamp(a, 0, 1);
    return this;
  }
  isInvalid() {
    return this.invalid;
  }
};
__name(_Color, "Color");
var Color = _Color;

// src/core/core_dragdrop.ts
var x_drag_cb = Symbol("x-drag-cb");
var _DragManager = class _DragManager {
  // pb with name of settimeout return
  /**
   * 
   */
  registerDraggableElement(el) {
    el.addDOMEvent("dragstart", (ev) => {
      this.dragSource = el;
      this.dragGhost = el.dom.cloneNode(true);
      this.dragGhost.classList.add("dragged");
      document.body.appendChild(this.dragGhost);
      el.addClass("dragging");
      ev.dataTransfer.setData("text/string", "1");
      ev.dataTransfer.setDragImage(new Image(), 0, 0);
      ev.stopPropagation();
    });
    el.addDOMEvent("drag", (ev) => {
      this.dragGhost.style.left = ev.pageX + "px";
      this.dragGhost.style.top = ev.pageY + "px";
    });
    el.addDOMEvent("dragend", (ev) => {
      el.removeClass("dragging");
      this.dragGhost.remove();
    });
    el.setAttribute("draggable", "true");
  }
  /**
   * 
   */
  registerDropTarget(el, cb, filterCB) {
    const dragEnter = /* @__PURE__ */ __name((ev) => {
      if (filterCB && !filterCB(this.dragSource)) {
        console.log("reject ", el);
        ev.dataTransfer.dropEffect = "none";
        return;
      }
      console.log("accepted ", el);
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
    }, "dragEnter");
    const dragOver = /* @__PURE__ */ __name((ev) => {
      if (filterCB && !filterCB(this.dragSource)) {
        console.log("reject ", el);
        ev.dataTransfer.dropEffect = "none";
        return;
      }
      ev.preventDefault();
      if (this.dropTarget != el) {
        this.dropTarget = el;
        this._startCheck();
      }
      if (this.dropTarget) {
        const infos = {
          pt: { x: ev.pageX, y: ev.pageY },
          data: ev.dataTransfer
        };
        cb("drag", this.dragSource, infos);
      }
      ev.dataTransfer.dropEffect = "copy";
    }, "dragOver");
    const dragLeave = /* @__PURE__ */ __name((ev) => {
      this.dropTarget = null;
      ev.preventDefault();
    }, "dragLeave");
    const drop = /* @__PURE__ */ __name((ev) => {
      const infos = {
        pt: { x: ev.pageX, y: ev.pageY },
        data: ev.dataTransfer
      };
      cb("drop", this.dragSource, infos);
      this.dropTarget = null;
      el.removeClass("drop-over");
      ev.preventDefault();
    }, "drop");
    el.addDOMEvent("dragenter", dragEnter);
    el.addDOMEvent("dragover", dragOver);
    el.addDOMEvent("dragleave", dragLeave);
    el.addDOMEvent("drop", drop);
    el.setInternalData(x_drag_cb, cb);
  }
  _startCheck() {
    if (this.timer) {
      clearInterval(this.timer);
      this._check();
    }
    this.timer = setInterval(() => this._check(), 300);
  }
  _check() {
    const leaving = /* @__PURE__ */ __name((x) => {
      x.removeClass("drop-over");
      const cb = x.getInternalData(x_drag_cb);
      cb("leave", this.dragSource);
    }, "leaving");
    const entering = /* @__PURE__ */ __name((x) => {
      x.addClass("drop-over");
      const cb = x.getInternalData(x_drag_cb);
      cb("enter", this.dragSource);
    }, "entering");
    if (this.dropTarget) {
      if (!this.notified || this.notified != this.dropTarget) {
        if (this.notified) {
          leaving(this.notified);
        }
        this.notified = this.dropTarget;
        entering(this.notified);
      }
    } else {
      if (this.notified) {
        leaving(this.notified);
        this.notified = null;
        clearInterval(this.timer);
      }
    }
  }
};
__name(_DragManager, "DragManager");
var DragManager = _DragManager;
var dragManager = new DragManager();

// src/core/core_router.ts
function parseRoute(str, loose = false) {
  if (str instanceof RegExp) {
    return {
      keys: null,
      pattern: str
    };
  }
  const arr = str.split("/");
  let keys = [];
  let pattern = "";
  if (arr[0] == "") {
    arr.shift();
  }
  for (const tmp of arr) {
    const c = tmp[0];
    if (c === "*") {
      keys.push("wild");
      pattern += "/(.*)";
    } else if (c === ":") {
      const o = tmp.indexOf("?", 1);
      const ext = tmp.indexOf(".", 1);
      keys.push(tmp.substring(1, o >= 0 ? o : ext >= 0 ? ext : tmp.length));
      pattern += o >= 0 && ext < 0 ? "(?:/([^/]+?))?" : "/([^/]+?)";
      if (ext >= 0) {
        pattern += (o >= 0 ? "?" : "") + "\\" + tmp.substring(ext);
      }
    } else {
      pattern += "/" + tmp;
    }
  }
  return {
    keys,
    pattern: new RegExp(`^${pattern}${loose ? "(?=$|/)" : "/?$"}`, "i")
  };
}
__name(parseRoute, "parseRoute");
var _Router = class _Router extends EventSource {
  constructor(useHash = true) {
    super();
    this.m_routes = [];
    this.m_useHash = useHash;
    window.addEventListener("popstate", (event) => {
      const url = this._getLocation();
      const found = this._find(url);
      found.handlers.forEach((h) => {
        h(found.params, url);
      });
    });
  }
  get(uri, handler) {
    let { keys, pattern } = parseRoute(uri);
    this.m_routes.push({ keys, pattern, handler });
  }
  init() {
    this.navigate(this._getLocation());
  }
  _getLocation() {
    return this.m_useHash ? "/" + document.location.hash.substring(1) : document.location.pathname;
  }
  navigate(uri, notify = true, replace = false) {
    if (!uri.startsWith("/")) {
      uri = "/" + uri;
    }
    const found = this._find(uri);
    if (!found || found.handlers.length == 0) {
      console.log("route not found: " + uri);
      this.fire("error", { code: 404, message: "route not found" });
      return;
    }
    if (this.m_useHash) {
      while (uri.at(0) == "/") {
        uri = uri.substring(1);
      }
      uri = "#" + uri;
    }
    if (replace) {
      window.history.replaceState({}, "", uri);
    } else {
      window.history.pushState({}, "", uri);
    }
    if (notify) {
      found.handlers.forEach((h) => {
        h(found.params, uri);
      });
    }
  }
  _find(url) {
    let matches = [];
    let params = {};
    let handlers = [];
    for (const tmp of this.m_routes) {
      if (!tmp.keys) {
        matches = tmp.pattern.exec(url);
        if (!matches) {
          continue;
        }
        if (matches["groups"]) {
          for (const k in matches["groups"]) {
            params[k] = matches["groups"][k];
          }
        }
        handlers = [...handlers, tmp.handler];
      } else if (tmp.keys.length > 0) {
        matches = tmp.pattern.exec(url);
        if (matches === null) {
          continue;
        }
        for (let j = 0; j < tmp.keys.length; ) {
          params[tmp.keys[j]] = matches[++j];
        }
        handlers = [...handlers, tmp.handler];
      } else if (tmp.pattern.test(url)) {
        handlers = [...handlers, tmp.handler];
      }
    }
    return { params, handlers };
  }
};
__name(_Router, "Router");
var Router = _Router;

// src/core/core_svg.ts
var SVG_NS = "http://www.w3.org/2000/svg";
function d2r(d) {
  return d * Math.PI / 180;
}
__name(d2r, "d2r");
function p2c(x, y, r, deg) {
  const rad = d2r(deg);
  return {
    x: x + r * Math.cos(rad),
    y: y + r * Math.sin(rad)
  };
}
__name(p2c, "p2c");
function num(x) {
  return Math.round(x * 1e3) / 1e3;
}
__name(num, "num");
function clean(a, ...b) {
  b = b.map((v) => {
    if (typeof v === "number" && isFinite(v)) {
      return num(v);
    }
    return v;
  });
  return String.raw(a, ...b);
}
__name(clean, "clean");
var _SvgItem = class _SvgItem {
  constructor(tag) {
    this._dom = document.createElementNS("http://www.w3.org/2000/svg", tag);
  }
  getDom() {
    return this._dom;
  }
  /**
   * change the stroke color
   * @param color 
   */
  stroke(color, width) {
    this.setAttr("stroke", color);
    if (width !== void 0) {
      this.setAttr("stroke-width", width + "px");
    }
    return this;
  }
  /**
   * change the stroke width
   * @param width 
   */
  strokeWidth(width) {
    this.setAttr("stroke-width", width + "px");
    return this;
  }
  strokeCap(cap) {
    return this.setAttr("stroke-linecap", cap);
  }
  strokeOpacity(opacity) {
    return this.setAttr("stroke-opacity", opacity + "");
  }
  /**
   * 
   */
  antiAlias(set) {
    return this.setAttr("shape-rendering", set ? "auto" : "crispEdges");
  }
  /**
   * change the fill color
   * @param color 
   */
  fill(color) {
    this.setAttr("fill", color);
    return this;
  }
  no_fill() {
    this.setAttr("fill", "transparent");
    return this;
  }
  /**
   * define a new attribute
   * @param name attibute name
   * @param value attribute value
   * @returns this
   */
  setAttr(name, value) {
    this._dom.setAttribute(name, value);
    return this;
  }
  /**
   * 
   */
  setStyle(name, value) {
    const _style = this._dom.style;
    if (isNumber(value)) {
      let v = value + "";
      if (!isUnitLess(name)) {
        v += "px";
      }
      _style[name] = v;
    } else {
      _style[name] = value;
    }
    return this;
  }
  /**
   * add a class
   * @param name class name to add 
   */
  addClass(cls) {
    if (!cls) return;
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      this._dom.classList.add(...ccs);
    } else {
      this._dom.classList.add(cls);
    }
  }
  /**
   * 
   */
  clip(id) {
    this.setAttr("clip-path", `url(#${id})`);
    return this;
  }
  /**
   * 
   */
  transform(tr) {
    this.setAttr("transform", tr);
    return this;
  }
  /**
   * 
   */
  rotate(deg, cx, cy) {
    this.transform(`rotate( ${deg} ${cx} ${cy} )`);
    return this;
  }
  translate(dx, dy) {
    this.transform(`translate( ${dx} ${dy} )`);
    return this;
  }
  scale(x) {
    this.transform(`scale( ${x} )`);
    return this;
  }
  /**
   * 
   */
  addDOMEvent(name, listener, prepend = false) {
    addEvent(this._dom, name, listener, prepend);
    return this;
  }
};
__name(_SvgItem, "SvgItem");
var SvgItem = _SvgItem;
var _SvgPath = class _SvgPath extends SvgItem {
  constructor() {
    super("path");
    this._path = "";
  }
  _update() {
    this.setAttr("d", this._path);
    return this;
  }
  /**
   * move the current pos
   * @param x new pos x
   * @param y new pos y
   * @returns this
   */
  moveTo(x, y) {
    this._path += clean`M${x},${y}`;
    return this._update();
  }
  /**
   * draw aline to the given point
   * @param x end x
   * @param y end y
   * @returns this
   */
  lineTo(x, y) {
    this._path += clean`L${x},${y}`;
    return this._update();
  }
  /**
   * close the currentPath
   */
  closePath() {
    this._path += "Z";
    return this._update();
  }
  /**
   * draw an arc
   * @param x center x
   * @param y center y
   * @param r radius
   * @param start angle start in degrees
   * @param end angle end in degrees
   * @returns this
   */
  arc(x, y, r, start, end) {
    const st = p2c(x, y, r, start - 90);
    const en2 = p2c(x, y, r, end - 90);
    const flag = end - start <= 180 ? "0" : "1";
    this._path += clean`M${st.x},${st.y}A${r},${r} 0 ${flag} 1 ${en2.x},${en2.y}`;
    return this._update();
  }
};
__name(_SvgPath, "SvgPath");
var SvgPath = _SvgPath;
var _SvgText = class _SvgText extends SvgItem {
  constructor(x, y, txt) {
    super("text");
    this.setAttr("x", num(x) + "");
    this.setAttr("y", num(y) + "");
    this._dom.innerHTML = txt;
  }
  font(font) {
    return this.setAttr("font-family", font);
  }
  fontSize(size) {
    return this.setAttr("font-size", size + "");
  }
  fontWeight(weight) {
    return this.setAttr("font-weight", weight);
  }
  textAlign(align) {
    let al;
    switch (align) {
      case "left":
        al = "start";
        break;
      case "center":
        al = "middle";
        break;
      case "right":
        al = "end";
        break;
      default:
        return this;
    }
    return this.setAttr("text-anchor", al);
  }
  verticalAlign(align) {
    let al;
    switch (align) {
      case "top":
        al = "hanging";
        break;
      case "center":
        al = "middle";
        break;
      case "bottom":
        al = "baseline";
        break;
      case "baseline":
        al = "mathematical";
        break;
      default:
        return;
    }
    return this.setAttr("alignment-baseline", al);
  }
};
__name(_SvgText, "SvgText");
var SvgText = _SvgText;
var _SvgShape = class _SvgShape extends SvgItem {
  constructor(tag) {
    super(tag);
  }
};
__name(_SvgShape, "SvgShape");
var SvgShape = _SvgShape;
var _SvgGradient = class _SvgGradient extends SvgItem {
  constructor(x1, y1, x2, y2) {
    super("linearGradient");
    this._id = "gx-" + _SvgGradient.g_id;
    _SvgGradient.g_id++;
    this.setAttr("id", this._id);
    this.setAttr("x1", isString(x1) ? x1 : num(x1) + "");
    this.setAttr("x2", isString(x2) ? x2 : num(x2) + "");
    this.setAttr("y1", isString(y1) ? y1 : num(y1) + "");
    this.setAttr("y2", isString(y2) ? y2 : num(y2) + "");
    this._stops = [];
  }
  get id() {
    return "url(#" + this._id + ")";
  }
  addStop(offset, color) {
    this._dom.insertAdjacentHTML("beforeend", `<stop offset="${offset}%" stop-color="${color}"></stop>`);
    return this;
  }
};
__name(_SvgGradient, "SvgGradient");
_SvgGradient.g_id = 1;
var SvgGradient = _SvgGradient;
var _SvgGroup = class _SvgGroup extends SvgItem {
  constructor(tag = "g") {
    super(tag);
  }
  /**
   * 
   */
  append(item) {
    this._dom.appendChild(item.getDom());
    return item;
  }
  /**
   * 
   */
  path() {
    const path = new SvgPath();
    return this.append(path);
  }
  text(x, y, txt) {
    const text = new SvgText(x, y, txt);
    return this.append(text);
  }
  ellipse(x, y, r1, r2 = r1) {
    const shape = new SvgShape("ellipse");
    shape.setAttr("cx", num(x) + "");
    shape.setAttr("cy", num(y) + "");
    shape.setAttr("rx", num(r1) + "");
    shape.setAttr("ry", num(r2) + "");
    return this.append(shape);
  }
  rect(x, y, w, h) {
    if (h < 0) {
      y = y + h;
      h = -h;
    }
    const shape = new SvgShape("rect");
    shape.setAttr("x", num(x) + "");
    shape.setAttr("y", num(y) + "");
    shape.setAttr("width", num(w) + "");
    shape.setAttr("height", num(h) + "");
    return this.append(shape);
  }
  group() {
    const group = new _SvgGroup();
    return this.append(group);
  }
  /**
   * 
   * example
   * ```ts
   * const g = c.linear_gradient( '0%', '0%', '0%', '100%' )
   * 				.addStop( 0, 'red' )
   * 				.addStop( 100, 'green' );
   * 
   * p.rect( 0, 0, 100, 100 )
   * 		.stroke( g.id );
   * 
   * ```
   */
  linear_gradient(x1, y1, x2, y2) {
    const grad = new SvgGradient(x1, y1, x2, y2);
    return this.append(grad);
  }
  /**
   * clear 
   */
  clear() {
    const dom = this._dom;
    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
  }
};
__name(_SvgGroup, "SvgGroup");
var SvgGroup = _SvgGroup;
var _SvgBuilder = class _SvgBuilder extends SvgGroup {
  constructor() {
    super();
  }
  addClip(x, y, w, h) {
    const id = "c-" + _SvgBuilder.g_clip_id++;
    const clip = new SvgGroup("clipPath");
    clip.setAttr("id", id);
    clip.rect(x, y, w, h);
    this.append(clip);
    return id;
  }
};
__name(_SvgBuilder, "SvgBuilder");
_SvgBuilder.g_clip_id = 1;
var SvgBuilder = _SvgBuilder;
var _SvgComponent = class _SvgComponent extends Component {
  constructor(props) {
    super({ ...props, tag: "svg", ns: SVG_NS });
    this.setAttribute("xmlns", SVG_NS);
    if (props.viewbox) {
      this.setAttribute("viewbox", props.viewbox);
    }
    if (props.svg) {
      this.dom.appendChild(props.svg.getDom());
    }
  }
};
__name(_SvgComponent, "SvgComponent");
var SvgComponent = _SvgComponent;

// src/components/boxes/boxes.ts
var _Box = class _Box extends Component {
};
__name(_Box, "Box");
var Box = _Box;
var _HBox = class _HBox extends Box {
};
__name(_HBox, "HBox");
var HBox = _HBox;
var _VBox = class _VBox extends Box {
  constructor(p) {
    super(p);
  }
};
__name(_VBox, "VBox");
var VBox = _VBox;
var _StackBox = class _StackBox extends Box {
  constructor(props) {
    var _a;
    super(props);
    this._items = (_a = props.items) == null ? void 0 : _a.map((itm) => {
      return { ...itm, page: null };
    });
    if (props.default) {
      this.select(props.default);
    } else if (this._items.length) {
      this.select(this._items[0].name);
    }
  }
  select(name) {
    let sel = this.query(`.selected`);
    if (sel) {
      sel.setClass("selected", false);
    }
    const pg = this._items.find((x) => x.name == name);
    if (pg) {
      if (!pg.page) {
        pg.page = this._createPage(pg);
        this.appendContent(pg.page);
      }
      sel = pg.page;
      if (sel) {
        sel.setClass("selected", true);
      }
    }
  }
  /**
   * 
   */
  _createPage(page) {
    let content;
    content = page.content;
    content == null ? void 0 : content.setData("stackname", page.name);
    return content;
  }
};
__name(_StackBox, "StackBox");
var StackBox = _StackBox;

// src/components/icon/icon.ts
var _SvgLoader = class _SvgLoader {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.waiters = /* @__PURE__ */ new Map();
  }
  async load(file) {
    if (this.cache.has(file)) {
      return Promise.resolve(this.cache.get(file));
    }
    return new Promise((resolve, reject) => {
      if (this.waiters.has(file)) {
        this.waiters.get(file).push(resolve);
      } else {
        this.waiters.set(file, [resolve]);
        this._load(file).then((data) => {
          console.timeEnd(file);
          this.cache.set(file, data);
          const ww = this.waiters.get(file);
          ww.forEach((cb) => cb(data));
        });
      }
    });
  }
  async _load(file) {
    console.time(file);
    const res = await fetch(file);
    if (res.ok) {
      return res.text();
    }
  }
};
__name(_SvgLoader, "SvgLoader");
var SvgLoader = _SvgLoader;
var svgLoader = new SvgLoader();
var _Icon = class _Icon extends Component {
  constructor(props) {
    super(props);
    this.setIcon(props.iconId);
  }
  /**
   * change the icon content
   * @param iconId if name is starting with var: then we use css variable name a path
   * @example
   * 
   * setIcon( "var:home" )
   * 
   * import myicon from "./myicon.svg"
   * setIcon( myicon );
   * 
   */
  setIcon(iconId) {
    if (iconId) {
      if (iconId.startsWith("var:")) {
        do {
          const path = iconId.substring(4);
          iconId = document.documentElement.style.getPropertyValue(path);
        } while (iconId.startsWith("var:"));
      }
      if (iconId.startsWith("data:image/svg+xml,<svg")) {
        this.dom.insertAdjacentHTML("beforeend", iconId.substring(19));
      } else if (iconId.endsWith(".svg")) {
        svgLoader.load(iconId).then((svg) => {
          this.clearContent();
          this.dom.insertAdjacentHTML("beforeend", svg);
        });
      } else {
        this.setContent(new Component({ tag: "img", attrs: { src: iconId } }));
      }
    } else {
      this.clearContent();
      this.addClass("empty");
    }
  }
};
__name(_Icon, "Icon");
var Icon = _Icon;

// src/components/button/button.ts
var _Button = class _Button extends Component {
  /**
      * Creates an instance of Button.
      * 
      * @param props - The properties for the button component, including label and icon.
      * @example
      * const button = new Button({ label: 'Submit', icon: 'check-icon' });
      */
  constructor(props) {
    super({ ...props, tag: "button", content: null });
    this.mapPropEvents(props, "click");
    this.addDOMEvent("click", (e) => this._on_click(e));
    this.setContent([
      new Icon({ id: "icon", iconId: this.props.icon }),
      new Component({ id: "label", content: this.props.label })
    ]);
  }
  /**
   * called by the system on click event
   */
  _on_click(ev) {
    this.fire("click", {});
    ev.preventDefault();
    ev.stopPropagation();
  }
  /**
      * Sets the text content of the button's label.
      * 
      * @param text - The new text or HTML content for the label.
      * @example
      * button.setText('Click Me');
      * button.setText(new UnsafeHtml('<b>Bold Text</b>'));
      */
  setText(text) {
    this.query("#label").setContent(text);
  }
  /**
      * Sets the icon of the button.
      * 
      * @param icon - The new icon ID to set on the button.
      * @example
      * button.setIcon('new-icon-id');
      */
  setIcon(icon) {
    this.query("#icon").setIcon(icon);
  }
};
__name(_Button, "Button");
var Button = _Button;

// src/components/btngroup/btngroup.ts
var _BtnGroup = class _BtnGroup extends Box {
  constructor(props) {
    super(props);
    if (props.align) {
      this.addClass("align-" + props.align);
    }
    this.addClass(props.vertical ? "x4vbox" : "x4hbox");
    if (props.items) {
      this.setButtons(props.items);
    }
    this.mapPropEvents(props, "btnclick");
  }
  /**
   * 
   * @param btns 
   */
  setButtons(btns) {
    this.clearContent();
    const childs = [];
    btns == null ? void 0 : btns.forEach((b) => {
      if (b === "-") {
        b = new Flex();
      } else if (isString(b)) {
        let title;
        const nm = b;
        switch (b) {
          case "ok":
            title = _tr.global.ok;
            break;
          case "cancel":
            title = _tr.global.cancel;
            break;
          case "abort":
            title = _tr.global.abort;
            break;
          case "no":
            title = _tr.global.no;
            break;
          case "yes":
            title = _tr.global.yes;
            break;
          case "retry":
            title = _tr.global.retry;
            break;
        }
        b = new Button({ label: title, click: /* @__PURE__ */ __name(() => {
          this.fire("btnclick", { button: nm });
        }, "click") });
      }
      childs.push(b);
    });
    super.setContent(childs);
  }
};
__name(_BtnGroup, "BtnGroup");
var BtnGroup = _BtnGroup;

// src/components/label/label.ts
var _text;
var _Label = class _Label extends Component {
  constructor(p) {
    super({ ...p, content: null });
    __privateAdd(this, _text);
    this.setContent([
      new Icon({ id: "icon", iconId: this.props.icon }),
      __privateSet(this, _text, new Component({ tag: "span", id: "text" }))
    ]);
    const text = this.props.text;
    this.setText(text);
    if (p.labelFor) {
      this.setAttribute("for", p.labelFor);
    }
  }
  setText(text) {
    __privateGet(this, _text).setContent(text);
    __privateGet(this, _text).setClass("empty", !text);
  }
  setIcon(icon) {
    this.query("#icon").setIcon(icon);
  }
};
_text = new WeakMap();
__name(_Label, "Label");
var Label = _Label;

// src/components/sizers/sizer.ts
var _CSizer = class _CSizer extends Component {
  constructor(type, target) {
    super({});
    this._type = type;
    this.addClass(type);
    this.addDOMEvent("pointerdown", (e) => {
      this.setCapture(e.pointerId);
      this._ref = target != null ? target : componentFromDOM(this.dom.parentElement);
      this._delta = { x: 0, y: 0 };
      const rc = this._ref.getBoundingRect();
      if (this._type.includes("left")) {
        this._delta.x = e.pageX - rc.left;
      } else {
        this._delta.x = e.pageX - (rc.left + rc.width);
      }
      if (this._type.includes("top")) {
        this._delta.y = e.pageY - rc.top;
      } else {
        this._delta.y = e.pageY - (rc.top + rc.height);
      }
    });
    this.addDOMEvent("pointerup", (e) => {
      this.releaseCapture(e.pointerId);
      this._ref = null;
    });
    this.addDOMEvent("pointermove", (e) => {
      this._onMouseMove(e);
    });
  }
  _onMouseMove(e) {
    if (!this._ref) {
      return;
    }
    const pt = { x: e.pageX - this._delta.x, y: e.pageY - this._delta.y };
    const rc = this._ref.getBoundingRect();
    let nr = {};
    let horz = true;
    if (this._type.includes("top")) {
      nr.top = pt.y, nr.height = rc.top + rc.height - pt.y;
      horz = false;
    }
    if (this._type.includes("bottom")) {
      nr.height = pt.y - rc.top;
      horz = false;
    }
    if (this._type.includes("left")) {
      nr.left = pt.x;
      nr.width = rc.left + rc.width - pt.x;
    }
    if (this._type.includes("right")) {
      nr.width = pt.x - rc.left;
    }
    this._ref.setStyle(nr);
    const nrc = this._ref.getBoundingRect();
    this.fire("resize", { size: horz ? nrc.width : nrc.height });
    e.preventDefault();
    e.stopPropagation();
  }
};
__name(_CSizer, "CSizer");
var CSizer = _CSizer;

// src/components/popup/popup.ts
var modal_mask;
var modal_count = 0;
var modal_stack = [];
var autoclose_list = [];
var popup_list = [];
var _Popup = class _Popup extends Component {
  constructor(props) {
    super(props);
    this._isopen = false;
    this._isshown = false;
    /**
     * binded
     */
    this._dismiss = /* @__PURE__ */ __name((e) => {
      const onac = autoclose_list.some((x) => x.dom.contains(e.target));
      if (onac) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.dismiss();
    }, "_dismiss");
    if (this.props.sizable) {
      this._createSizers();
    }
  }
  displayNear(rc, dst = "top left", src = "top left", offset = { x: 0, y: 0 }) {
    this.setStyle({ left: "0px", top: "0px" });
    this._show();
    let rm = this.getBoundingRect();
    let xref = rc.left;
    let yref = rc.top;
    if (src.indexOf("right") >= 0) {
      xref = rc.left + rc.width;
    } else if (src.indexOf("center") >= 0) {
      xref = rc.left + rc.width / 2;
    }
    if (src.indexOf("bottom") >= 0) {
      yref = rc.bottom;
    } else if (src.indexOf("middle") >= 0) {
      yref = rc.top + rc.height / 2;
    }
    let halign = "l";
    if (dst.indexOf("right") >= 0) {
      xref -= rm.width;
    } else if (dst.indexOf("center") >= 0) {
      xref -= rm.width / 2;
    }
    let valign = "t";
    if (dst.indexOf("bottom") >= 0) {
      yref -= rm.height;
    } else if (dst.indexOf("middle") >= 0) {
      yref -= rm.height / 2;
    }
    if (offset) {
      xref += offset.x;
      yref += offset.y;
    }
    xref += document.scrollingElement.scrollLeft;
    yref += document.scrollingElement.scrollTop;
    this.displayAt(xref, yref);
  }
  /**
   * 
   */
  displayCenter() {
    this.displayNear(new Rect(window.innerWidth / 2, window.innerHeight / 2, 0, 0), "center middle");
  }
  /**
   * 
   */
  displayAt(x, y) {
    this.setStyle({
      left: x + "px",
      top: y + "px"
    });
    this._show();
    const rc = this.getBoundingRect();
    const width = window.innerWidth - 16;
    const height = window.innerHeight - 16;
    if (rc.right > width) {
      this.setStyleValue("left", width - rc.width);
    }
    if (rc.bottom > height) {
      this.setStyleValue("top", height - rc.height);
    }
    if (this.props.movable) {
      const movers = this.queryAll(".caption-element");
      movers.forEach((m) => new CMover(m, this));
      if (this.hasClass("popup-caption")) {
        new CMover(this, this);
      }
    }
    this.fire("opened", {});
  }
  _show() {
    if (this.props.modal && !this._isshown) {
      this._showModalMask();
      modal_stack.push(this);
      modal_count++;
    }
    this._isshown = true;
    if (this.props.autoClose) {
      if (autoclose_list.length == 0) {
        document.addEventListener("pointerdown", this._dismiss);
      }
      autoclose_list.push(this);
      this.setData("close", this.props.autoClose === true ? makeUniqueComponentId() : this.props.autoClose);
    }
    popup_list.push(this);
    document.body.appendChild(this.dom);
    this.show();
  }
  show(show = true) {
    this._isopen = show;
    super.show(show);
  }
  isOpen() {
    return this._isopen;
  }
  /**
   * 
   */
  close() {
    document.body.removeChild(this.dom);
    const idx = popup_list.indexOf(this);
    console.assert(idx >= 0);
    popup_list.splice(idx, 1);
    if (this.props.autoClose) {
      const idx2 = autoclose_list.indexOf(this);
      if (idx2 >= 0) {
        autoclose_list.splice(idx2, 1);
        if (autoclose_list.length == 0) {
          document.removeEventListener("pointerdown", this._dismiss);
        }
      }
    }
    if (this.props.modal) {
      const top = modal_stack.pop();
      console.assert(top == this);
      this._updateModalMask();
    }
    this._isshown = false;
    this.fire("closed", {});
  }
  /**
   * dismiss all popup belonging to the same group as 'this'
   */
  dismiss(after = false) {
    if (autoclose_list.length == 0) {
      return;
    }
    const cgroup = this.getData("close");
    const inc_group = [];
    const excl_group = [];
    let aidx = -1;
    if (after) {
      aidx = autoclose_list.indexOf(this);
    }
    autoclose_list.forEach((x, idx) => {
      const group = x.getData("close");
      if (group == cgroup && idx > aidx) {
        inc_group.push(x);
      } else {
        excl_group.push(x);
      }
    });
    const list = inc_group.reverse();
    autoclose_list = excl_group;
    if (autoclose_list.length == 0) {
      document.removeEventListener("pointerdown", this._dismiss);
    }
    list.forEach((x) => x.close());
  }
  /**
   * 
   */
  _showModalMask() {
    if (!modal_mask) {
      modal_mask = new Component({
        cls: "x4modal-mask",
        domEvents: {
          click: this._dismiss
        }
      });
    }
    modal_mask.show(true);
    document.body.insertAdjacentElement("beforeend", modal_mask.dom);
  }
  /**
   * 
   */
  _updateModalMask() {
    if (--modal_count == 0) {
      modal_mask.show(false);
    } else {
      this.dom.insertAdjacentElement("beforebegin", modal_mask.dom);
    }
  }
  /**
   * 
   */
  _createSizers() {
    this.appendContent([
      new CSizer("top"),
      new CSizer("bottom"),
      new CSizer("left"),
      new CSizer("right"),
      new CSizer("top-left"),
      new CSizer("bottom-left"),
      new CSizer("top-right"),
      new CSizer("bottom-right")
    ]);
  }
};
__name(_Popup, "Popup");
var Popup = _Popup;
var _CMover = class _CMover {
  constructor(x, ref) {
    this.self = ref ? true : false;
    x.addDOMEvent("pointerdown", (e) => {
      if (this.self && e.target != x.dom) {
        return;
      }
      x.setCapture(e.pointerId);
      this.ref = ref != null ? ref : componentFromDOM(x.dom.parentElement);
      this.delta = { x: 0, y: 0 };
      const rc = this.ref.getBoundingRect();
      this.delta.x = e.pageX - rc.left;
      this.delta.y = e.pageY - rc.top;
    });
    x.addDOMEvent("pointerup", (e) => {
      x.releaseCapture(e.pointerId);
      this.ref = null;
    });
    x.addDOMEvent("pointermove", (e) => {
      this._onMouseMove(e);
    });
  }
  _onMouseMove(e) {
    if (!this.ref) {
      return;
    }
    const pt = { x: e.pageX - this.delta.x, y: e.pageY - this.delta.y };
    const rc = this.ref.getBoundingRect();
    let nr = {};
    this.ref.setStyle({
      top: pt.y + "",
      left: pt.x + ""
    });
    e.preventDefault();
    e.stopPropagation();
  }
};
__name(_CMover, "CMover");
var CMover = _CMover;

// src/components/menu/menu.ts
var OPEN_DELAY = 400;
var _CMenuSep = class _CMenuSep extends Component {
  constructor() {
    super({});
  }
};
__name(_CMenuSep, "CMenuSep");
var CMenuSep = _CMenuSep;
var openTimer = new Timer();
var _CMenuItem = class _CMenuItem extends Component {
  constructor(itm) {
    super({ disabled: itm.disabled, cls: itm.cls });
    if (itm.menu) {
      this.addClass("popup");
    }
    this.setContent([
      new Icon({ id: "icon", iconId: itm.icon }),
      new Component({ id: "text", content: itm.text })
    ]);
    if (itm.menu) {
      this.menu = itm.menu;
      this.addDOMEvent("mouseenter", () => this.openSub(true));
      this.addDOMEvent("click", () => this.openSub(false));
      this.addDOMEvent("mouseleave", () => this.closeSub());
      this.menu.on("opened", () => this.addClass("opened"));
      this.menu.on("closed", () => this.removeClass("opened"));
    } else {
      this.addDOMEvent("mouseenter", () => {
        openTimer.setTimeout("open", OPEN_DELAY, () => {
          this.dismiss(true);
        });
      });
      this.addDOMEvent("click", () => {
        this.dismiss(false);
        if (itm.click) {
          itm.click(new Event("click"));
        }
      });
    }
  }
  /**
   * 
   */
  dismiss(after) {
    const menu = this.parentElement(Menu);
    if (menu) {
      menu.dismiss(after);
    }
  }
  /**
   * 
   */
  openSub(delayed) {
    const open = /* @__PURE__ */ __name(() => {
      this.dismiss(true);
      const rc = this.getBoundingRect();
      this.menu.displayAt(rc.right - 4, rc.top);
    }, "open");
    if (delayed) {
      openTimer.setTimeout("open", OPEN_DELAY, open);
    } else {
      openTimer.clearTimeout("open");
      open();
    }
  }
  closeSub() {
    openTimer.clearTimeout("open");
  }
};
__name(_CMenuItem, "CMenuItem");
var CMenuItem = _CMenuItem;
var _Menu = class _Menu extends Popup {
  constructor(props) {
    var _a;
    super({ ...props, autoClose: "menu", modal: false });
    this.addClass("x4vbox");
    const children = (_a = props.items) == null ? void 0 : _a.map((itm) => {
      if (itm === "-") {
        return new CMenuSep();
      } else if (isString(itm)) {
        return new CMenuItem({ text: itm, click: null, cls: "title" });
      } else if (itm instanceof Component) {
        return itm;
      } else {
        return new CMenuItem(itm);
      }
    });
    this.setContent(children);
  }
};
__name(_Menu, "Menu");
var Menu = _Menu;

// src/components/calendar/chevron-left-sharp-light.svg
var chevron_left_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M9.4 256l11.3-11.3 192-192L224 41.4 246.6 64 235.3 75.3 54.6 256 235.3 436.7 246.6 448 224 470.6l-11.3-11.3-192-192L9.4 256z"/></svg>';

// src/components/calendar/calendar-check-sharp-light.svg
var calendar_check_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M128 16l0-16L96 0l0 16 0 48L32 64 0 64 0 96l0 64 0 32L0 480l0 32 32 0 384 0 32 0 0-32 0-288 0-32 0-64 0-32-32 0-64 0 0-48 0-16L320 0l0 16 0 48L128 64l0-48zM32 192l384 0 0 288L32 480l0-288zm0-96l384 0 0 64L32 160l0-64zM331.3 283.3L342.6 272 320 249.4l-11.3 11.3L208 361.4l-52.7-52.7L144 297.4 121.4 320l11.3 11.3 64 64L208 406.6l11.3-11.3 112-112z"/></svg>';

// src/components/calendar/chevron-right-sharp-light.svg
var chevron_right_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M310.6 256l-11.3 11.3-192 192L96 470.6 73.4 448l11.3-11.3L265.4 256 84.7 75.3 73.4 64 96 41.4l11.3 11.3 192 192L310.6 256z"/></svg>';

// src/components/calendar/calendar.ts
var _Calendar = class _Calendar extends VBox {
  constructor(props) {
    super(props);
    this.mapPropEvents(props, "change");
    this.m_date = props.date ? date_clone(props.date) : /* @__PURE__ */ new Date();
    this._update();
  }
  /** @ignore */
  _update() {
    let month_start = date_clone(this.m_date);
    month_start.setDate(1);
    let day = month_start.getDay();
    if (day == 0) {
      day = 7;
    }
    month_start.setDate(-day + 1 + 1);
    let dte = date_clone(month_start);
    let selection = date_hash(this.m_date);
    let today = date_hash(/* @__PURE__ */ new Date());
    let month_end = date_clone(this.m_date);
    month_end.setDate(1);
    month_end.setMonth(month_end.getMonth() + 1);
    month_end.setDate(0);
    let end_of_month = date_hash(month_end);
    let rows = [];
    let header = new HBox({
      cls: "month-sel",
      content: [
        new Label({
          cls: "month",
          text: formatIntlDate(this.m_date, "O"),
          dom_events: {
            click: /* @__PURE__ */ __name(() => this._choose("month"), "click")
          }
        }),
        new Label({
          cls: "year",
          text: formatIntlDate(this.m_date, "Y"),
          dom_events: {
            click: /* @__PURE__ */ __name(() => this._choose("year"), "click")
          }
        }),
        new Flex(),
        new Button({ icon: chevron_left_sharp_light_default, click: /* @__PURE__ */ __name(() => this._next(false), "click") }),
        new Button({ icon: calendar_check_sharp_light_default, click: /* @__PURE__ */ __name(() => this.setDate(/* @__PURE__ */ new Date()), "click"), tooltip: _tr.global.today }),
        new Button({ icon: chevron_right_sharp_light_default, click: /* @__PURE__ */ __name(() => this._next(true), "click") })
      ]
    });
    rows.push(header);
    let day_names = [];
    day_names.push(new HBox({
      cls: "weeknum cell"
    }));
    for (let d = 0; d < 7; d++) {
      day_names.push(new Label({
        cls: "cell",
        text: _tr.global.day_short[(d + 1) % 7]
      }));
    }
    rows.push(new HBox({
      cls: "week header",
      content: day_names
    }));
    let cmonth = this.m_date.getMonth();
    let first = true;
    while (date_hash(dte) <= end_of_month) {
      let days = [
        new HBox({ cls: "weeknum cell", content: new Component({ tag: "span", content: formatIntlDate(dte, "w") }) })
      ];
      for (let d = 0; d < 7; d++) {
        let cls = "cell day";
        if (date_hash(dte) == selection) {
          cls += " selection";
        }
        if (date_hash(dte) == today) {
          cls += " today";
        }
        if (dte.getMonth() != cmonth) {
          cls += " out";
        }
        const mkItem = /* @__PURE__ */ __name((dte2) => {
          return new HBox({
            cls,
            flex: 1,
            content: new Component({
              cls: "text",
              content: unsafeHtml(`<span>${formatIntlDate(dte2, "d")}</span>`)
            }),
            dom_events: {
              click: /* @__PURE__ */ __name(() => this.select(dte2), "click")
            }
          });
        }, "mkItem");
        days.push(mkItem(date_clone(dte)));
        dte.setDate(dte.getDate() + 1);
        first = false;
      }
      rows.push(new HBox({
        cls: "week",
        flex: 1,
        content: days
      }));
    }
    this.setContent(rows);
  }
  /**
   * select the given date
   * @param date 
   */
  select(date) {
    this.m_date = date;
    this.fire("change", { value: date });
    this._update();
  }
  /**
   * 
   */
  _next(n) {
    this.m_date.setMonth(this.m_date.getMonth() + (n ? 1 : -1));
    this._update();
  }
  /**
   * 
   */
  _choose(type) {
    var _a, _b, _c, _d;
    let items = [];
    if (type == "month") {
      for (let m = 0; m < 12; m++) {
        items.push({
          text: _tr.global.month_long[m],
          click: /* @__PURE__ */ __name(() => {
            this.m_date.setMonth(m);
            this._update();
          }, "click")
        });
      }
    } else if (type == "year") {
      let min = (_b = (_a = this.props.minDate) == null ? void 0 : _a.getFullYear()) != null ? _b : 1900;
      let max = (_d = (_c = this.props.maxDate) == null ? void 0 : _c.getFullYear()) != null ? _d : 2037;
      for (let m = max; m >= min; m--) {
        items.push({
          text: "" + m,
          click: /* @__PURE__ */ __name(() => {
            this.m_date.setFullYear(m);
            this._update();
          }, "click")
        });
      }
    }
    let menu = new Menu({
      items
    });
    let rc = this.getBoundingRect();
    menu.displayAt(rc.left, rc.top);
  }
  getDate() {
    return this.m_date;
  }
  setDate(date) {
    this.m_date = date;
    this._update();
  }
};
__name(_Calendar, "Calendar");
var Calendar = _Calendar;

// src/components/input/input.ts
var _Input = class _Input extends Component {
  constructor(props) {
    var _a;
    super({ tag: "input", ...props });
    this.setAttribute("type", (_a = props.type) != null ? _a : "text");
    this.setAttribute("name", props.name);
    switch (props.type) {
      case "checkbox":
      case "radio": {
        const ck = this.dom;
        ck.checked = props.checked;
        ck.value = props.value + "";
        break;
      }
      case "range": {
        this.setAttribute("min", props.min);
        this.setAttribute("max", props.max);
        this.setAttribute("step", props.step);
        this.setAttribute("value", props.value);
        break;
      }
      case "number": {
        this.setAttribute("required", props.required);
        this.setAttribute("readonly", props.readonly);
        this.setAttribute("min", props.min);
        this.setAttribute("max", props.max);
        this.setAttribute("step", props.step);
        this.setAttribute("value", props.value + "");
        break;
      }
      case "date": {
        this.setAttribute("required", props.required);
        let v = props.value;
        if (v instanceof Date) {
        } else {
          this.setAttribute("value", v);
        }
        break;
      }
      case "file": {
        let v;
        if (Array.isArray(props.accept)) {
          v = props.accept.join(",");
        } else {
          v = props.accept;
        }
        this.setAttribute("accept", v);
        break;
      }
      default: {
        this.setAttribute("required", props.required);
        this.setAttribute("readonly", props.readonly);
        if (props.value !== null && props.value !== void 0) {
          this.setAttribute("value", props.value);
        }
        if (props.pattern !== null && props.pattern !== void 0) {
          this.setAttribute("pattern", props.pattern);
        }
        if (props.placeholder !== null && props.placeholder !== void 0) {
          this.setAttribute("placeholder", props.placeholder);
        }
        if (props.spellcheck === false) {
          this.setAttribute("spellcheck", false);
        }
        break;
      }
    }
  }
  /**
   * @returns 
   */
  getValue() {
    return this.dom.value;
  }
  /**
   * 
   * @param value 
   */
  setValue(value) {
    this.dom.value = value + "";
  }
  /**
   * 
   * @returns 
   */
  getNumValue() {
    return parseFloat(this.getValue());
  }
  /**
   * 
   * @param value 
   */
  setNumValue(value) {
    this.setValue(value + "");
  }
  /**
   * 
   */
  setReadOnly(ro) {
    const d = this.dom;
    d.readOnly = ro;
  }
  /**
   * select all the text
   */
  selectAll() {
    const d = this.dom;
    d.select();
  }
  /**
   * select a part of the text
   * @param start 
   * @param length 
   */
  select(start, length = 9999) {
    const d = this.dom;
    d.setSelectionRange(start, start + length);
  }
  /**
   * get the selection as { start, length }
   */
  getSelection() {
    const d = this.dom;
    return {
      start: d.selectionStart,
      length: d.selectionEnd - d.selectionStart
    };
  }
  /**
   * 
   */
  queryInterface(name) {
    if (name == "form-element") {
      const i = {
        getRawValue: /* @__PURE__ */ __name(() => {
          return this.getValue();
        }, "getRawValue"),
        setRawValue: /* @__PURE__ */ __name((v) => {
          this.setValue(v);
        }, "setRawValue")
      };
      return i;
    }
    return super.queryInterface(name);
  }
};
__name(_Input, "Input");
var Input = _Input;

// src/components/checkbox/check.svg
var check_default = 'data:image/svg+xml,<svg viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">%0D%0A%09<path d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">%0D%0A%09</path>%0D%0A</svg>';

// src/components/checkbox/checkbox.ts
var _Checkbox = class _Checkbox extends Component {
  /**
      * Creates an instance of the Checkbox component.
      * 
      * @param {CheckboxProps} props - The properties for the checkbox component, including label, checked state, and value.
      * @example
      * const checkbox = new Checkbox({ label: 'Accept Terms', checked: true });
      */
  constructor(props) {
    super(props);
    const inputId = makeUniqueComponentId();
    this.mapPropEvents(props, "change");
    this.setContent([
      new Component({
        cls: "inner",
        content: [
          this._input = new Input({
            type: "checkbox",
            id: inputId,
            checked: props.checked,
            dom_events: {
              change: /* @__PURE__ */ __name(() => this._on_change(), "change")
            }
          })
        ]
      }),
      new Label({
        tag: "label",
        text: props.label,
        labelFor: inputId,
        id: void 0
      })
    ]);
    svgLoader.load(check_default).then((svg) => {
      this.query(".inner").dom.insertAdjacentHTML("beforeend", svg);
    });
  }
  /**
   * check state changed
   */
  _on_change() {
    this.fire("change", { value: this.getCheck() });
  }
  /**
   * @return the checked value
   */
  getCheck() {
    const d = this._input.dom;
    return d.checked;
  }
  /**
   * change the checked value
   * @param {boolean} ck new checked value	
   */
  setCheck(ck) {
    const d = this._input.dom;
    d.checked = ck;
  }
  /**
   * change the checkbox label
   * @param text 
   */
  setLabel(text) {
    this.query("label").setText(text);
  }
  /**
   * toggle the checkbox
   */
  toggle() {
    this.setCheck(!this.getCheck());
  }
};
__name(_Checkbox, "Checkbox");
var Checkbox = _Checkbox;

// src/components/colorinput/crosshairs-simple-sharp-light.svg
var crosshairs_simple_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M479.4 240L384 240l-16 0 0 32 16 0 95.4 0C471.6 383 383 471.6 272 479.4l0-95.4 0-16-32 0 0 16 0 95.4C129 471.6 40.4 383 32.6 272l95.4 0 16 0 0-32-16 0-95.4 0C40.4 129 129 40.4 240 32.6l0 95.4 0 16 32 0 0-16 0-95.4C383 40.4 471.6 129 479.4 240zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/></svg>';

// src/components/colorinput/colorinput.ts
var _ColorInput = class _ColorInput extends HBox {
  constructor(props) {
    super(props);
    let swatch;
    let edit;
    this.setContent([
      swatch = new Component({ cls: "swatch" }),
      edit = new Input({ type: "text", value: "", spellcheck: false }),
      isFeatureAvailable("eyedropper") ? new Button({ icon: crosshairs_simple_sharp_light_default, click: /* @__PURE__ */ __name(() => {
        const eyeDropper = new window.EyeDropper();
        eyeDropper.open().then((result) => {
          color = new Color(result.sRGBHex);
          updateColor(color);
        });
      }, "click") }) : null
    ]);
    edit.addDOMEvent("input", () => {
      const txt = edit.getValue();
      const clr = new Color(txt);
      if (!clr.isInvalid()) {
        color = clr;
        updateColor(color);
      }
    });
    const updateColor = /* @__PURE__ */ __name((clr) => {
      swatch.setStyleValue("backgroundColor", clr.toRgbString(false));
      edit.setValue(clr.toRgbString(false));
    }, "updateColor");
    let color;
    if (props.color instanceof Color) {
      color = props.color;
    } else {
      color = new Color(props.color);
    }
    updateColor(color);
  }
};
__name(_ColorInput, "ColorInput");
var ColorInput = _ColorInput;

// src/components/colorpicker/colorpicker.ts
var _Saturation = class _Saturation extends Box {
  constructor(props, init) {
    super(props);
    this.mdown = false;
    this.hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };
    this.setContent([
      this.color = new Component({ cls: "overlay" }),
      new Component({ cls: "overlay", style: { backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255), transparent)" } }),
      new Component({ cls: "overlay", style: { backgroundImage: "linear-gradient(0deg, rgb(0, 0, 0), transparent)" } }),
      this.thumb = new Component({ cls: "thumb" })
    ]);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((e) => this.mousedown(e), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((e) => this.mousemove(e), "pointermove"),
      pointerup: /* @__PURE__ */ __name((e) => this.mouseup(e), "pointerup"),
      created: /* @__PURE__ */ __name(() => this.updateThumbMarker(), "created")
    });
    this.updateBaseColor(init);
  }
  mousedown(ev) {
    this.mdown = true;
    this.irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  mousemove(ev) {
    if (this.mdown) {
      const ir = this.irect;
      let hpos = clamp(ev.clientX - ir.left, 0, ir.width);
      let hperc = hpos / ir.width;
      let vpos = clamp(ev.clientY - ir.top, 0, ir.height);
      let vperc = vpos / ir.height;
      this.hsv.saturation = hperc;
      this.hsv.value = 1 - vperc;
      this.updateThumbMarker();
      this.fire("sat_change", { saturation: this.hsv.saturation, value: this.hsv.value });
    }
  }
  mouseup(ev) {
    if (this.mdown) {
      this.releaseCapture(ev.pointerId);
      this.mdown = false;
    }
  }
  updateThumbMarker() {
    const rc = this.color.getBoundingRect();
    this.thumb.setStyle({
      left: this.hsv.saturation * rc.width + "px",
      bottom: this.hsv.value * rc.height + "px"
    });
  }
  updateBaseColor(hsv) {
    const base = new Color(0, 0, 0);
    base.setHsv(hsv.hue, 1, 1, 1);
    this.color.setStyleValue("backgroundColor", base.toRgbString(false));
  }
  move(sens, delta) {
    switch (sens) {
      case "saturation": {
        this.hsv.saturation += delta;
        if (this.hsv.saturation < 0) {
          this.hsv.saturation = 0;
        } else if (this.hsv.saturation > 1) {
          this.hsv.saturation = 1;
        }
        this.fire("sat_change", { saturation: this.hsv.saturation, value: this.hsv.value });
        this.updateThumbMarker();
        break;
      }
      case "value": {
        this.hsv.value += delta;
        if (this.hsv.value < 0) {
          this.hsv.value = 0;
        } else if (this.hsv.value > 1) {
          this.hsv.value = 1;
        }
        this.fire("sat_change", { saturation: this.hsv.saturation, value: this.hsv.value });
        this.updateThumbMarker();
        break;
      }
    }
  }
};
__name(_Saturation, "Saturation");
var Saturation = _Saturation;
var _HueSlider = class _HueSlider extends Box {
  constructor(props, init) {
    super(props);
    this.hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };
    this.mdown = false;
    this.setContent([
      this.thumb = new Component({ cls: "thumb", left: "50%" })
    ]);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((e) => this.mousedown(e), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((e) => this.mousemove(e), "pointermove"),
      pointerup: /* @__PURE__ */ __name((e) => this.mouseup(e), "pointerup")
    });
    this.updateHue(init);
  }
  mousedown(ev) {
    this.mdown = true;
    this.irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  mousemove(ev) {
    if (this.mdown) {
      const ir = this.irect;
      let hpos = clamp(ev.clientX - ir.left, 0, ir.width);
      let hperc = hpos / ir.width;
      this.hsv.hue = hperc;
      this.updateHue(this.hsv);
      this.fire("hue_change", { hue: this.hsv.hue });
    }
  }
  mouseup(ev) {
    if (this.mdown) {
      this.releaseCapture(ev.pointerId);
      this.mdown = false;
    }
  }
  updateHue(hsv) {
    this.hsv.hue = hsv.hue;
    this.thumb.setStyleValue("left", hsv.hue * 100 + "%");
  }
  move(delta) {
    this.hsv.hue += delta;
    if (this.hsv.hue < 0) {
      this.hsv.hue = 0;
    } else if (this.hsv.hue > 1) {
      this.hsv.hue = 1;
    }
    this.fire("hue_change", { hue: this.hsv.hue });
    this.updateHue(this.hsv);
  }
};
__name(_HueSlider, "HueSlider");
var HueSlider = _HueSlider;
var _AlphaSlider = class _AlphaSlider extends Box {
  constructor(props, init) {
    super(props);
    this.hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };
    this.mdown = false;
    this.setContent([
      new Component({ cls: "overlay checkers" }),
      this.color = new Component({ cls: "overlay color" }),
      this.thumb = new Component({ cls: "thumb", left: "50%" })
    ]);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((e) => this._on_mousedown(e), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((e) => this._on_mousemove(e), "pointermove"),
      pointerup: /* @__PURE__ */ __name((e) => this._on_mouseup(e), "pointerup")
    });
    this.updateAlpha();
    this.updateBaseColor(init);
  }
  _on_mousedown(ev) {
    this.mdown = true;
    this.irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  _on_mousemove(ev) {
    if (this.mdown) {
      const ir = this.irect;
      let hpos = clamp(ev.clientX - ir.left, 0, ir.width);
      let hperc = hpos / ir.width;
      this.hsv.alpha = hperc;
      this.updateAlpha();
      this.fire("alpha_change", { alpha: this.hsv.alpha });
    }
  }
  _on_mouseup(ev) {
    if (this.mdown) {
      this.releaseCapture(ev.pointerId);
      this.mdown = false;
    }
  }
  updateAlpha() {
    this.thumb.setStyleValue("left", this.hsv.alpha * 100 + "%");
  }
  updateBaseColor(hsv) {
    const base = new Color(0, 0, 0);
    base.setHsv(hsv.hue, hsv.saturation, hsv.value, 1);
    this.color.setStyleValue("backgroundImage", `linear-gradient(90deg, transparent, ${base.toRgbString(false)})`);
  }
  setColor(hsv) {
    this.hsv = hsv;
    this.updateBaseColor(hsv);
    this.updateAlpha();
  }
  move(delta) {
    this.hsv.alpha += delta;
    if (this.hsv.alpha < 0) {
      this.hsv.alpha = 0;
    } else if (this.hsv.alpha > 1) {
      this.hsv.alpha = 1;
    }
    this.fire("alpha_change", { alpha: this.hsv.alpha });
    this.updateAlpha();
  }
};
__name(_AlphaSlider, "AlphaSlider");
var AlphaSlider = _AlphaSlider;
var _ColorPicker = class _ColorPicker extends VBox {
  constructor(props) {
    super(props);
    if (props.color instanceof Color) {
      this._base = props.color;
    } else {
      this._base = new Color(props.color);
    }
    let hsv = this._base.toHsv();
    this.setAttribute("tabindex", 0);
    this.setContent([
      this._sat = new Saturation({}, hsv),
      new HBox({
        cls: "body",
        content: [
          new VBox({ cls: "x4flex", content: [
            this._hue = new HueSlider({}, hsv),
            this._alpha = new AlphaSlider({}, hsv)
          ] }),
          new Box({ cls: "swatch", content: [
            new Component({ cls: "overlay checkers" }),
            this._swatch = new Component({ cls: "overlay" })
          ] })
        ]
      })
    ]);
    this._sat.on("sat_change", (ev) => {
      hsv.saturation = ev.saturation;
      hsv.value = ev.value;
      updateColor();
      this._alpha.updateBaseColor(hsv);
    });
    this._hue.on("hue_change", (ev) => {
      hsv.hue = ev.hue;
      this._sat.updateBaseColor(hsv);
      this._alpha.updateBaseColor(hsv);
      updateColor();
    });
    this._alpha.on("alpha_change", (ev) => {
      hsv.alpha = ev.alpha;
      updateColor();
    });
    const updateColor = /* @__PURE__ */ __name(() => {
      this._base.setHsv(hsv.hue, hsv.saturation, hsv.value, hsv.alpha);
      this._swatch.setStyleValue("backgroundColor", this._base.toRgbString());
      this._swatch.setAttribute("tooltip", this._base.toRgbString());
      this.fire("change", { color: this._base });
    }, "updateColor");
    if (isFeatureAvailable("eyedropper")) {
      this._swatch.addDOMEvent("click", (e) => {
        const eyeDropper = new window.EyeDropper();
        eyeDropper.open().then((result) => {
          const color = new Color(result.sRGBHex);
          hsv = color.toHsv();
          this._alpha.setColor(hsv);
          this._sat.updateBaseColor(hsv);
          this._hue.updateHue(hsv);
          updateColor();
        });
      });
    }
    this.addDOMEvent("keydown", (ev) => this._onkey(ev));
    updateColor();
  }
  _onkey(ev) {
    switch (ev.key) {
      case "ArrowLeft": {
        if (ev.ctrlKey) {
          this._hue.move(-0.01);
        } else {
          this._sat.move("saturation", -0.01);
        }
        break;
      }
      case "ArrowRight": {
        if (ev.ctrlKey) {
          this._hue.move(0.01);
        } else {
          this._sat.move("saturation", 0.01);
        }
        break;
      }
      case "ArrowUp": {
        if (ev.ctrlKey) {
          this._alpha.move(0.01);
        } else {
          this._sat.move("value", 0.01);
        }
        break;
      }
      case "ArrowDown": {
        if (ev.ctrlKey) {
          this._alpha.move(-0.01);
        } else {
          this._sat.move("value", -0.01);
        }
        break;
      }
    }
  }
};
__name(_ColorPicker, "ColorPicker");
var ColorPicker = _ColorPicker;

// src/components/viewport/viewport.ts
var _Viewport = class _Viewport extends Component {
  constructor(props) {
    super(props);
  }
};
__name(_Viewport, "Viewport");
var Viewport = _Viewport;
var _ScrollView = class _ScrollView extends Component {
  constructor(props) {
    super(props);
    this.setContent(new Viewport({}));
  }
  getViewport() {
    return this.firstChild();
  }
};
__name(_ScrollView, "ScrollView");
var ScrollView = _ScrollView;

// src/components/listbox/listbox.ts
var kbNav = /* @__PURE__ */ ((kbNav2) => {
  kbNav2[kbNav2["first"] = 0] = "first";
  kbNav2[kbNav2["prev"] = 1] = "prev";
  kbNav2[kbNav2["next"] = 2] = "next";
  kbNav2[kbNav2["last"] = 3] = "last";
  return kbNav2;
})(kbNav || {});
var _Listbox = class _Listbox extends Component {
  constructor(props) {
    super({ ...props });
    this.preventFocus = false;
    this.setAttribute("tabindex", 0);
    const scroller = new ScrollView({ cls: "body" });
    this._view = scroller.getViewport();
    this.setContent([
      //props.header ? props.header : null,
      scroller
    ]);
    this.setDOMEvents({
      click: /* @__PURE__ */ __name((ev) => this._on_click(ev), "click"),
      keydown: /* @__PURE__ */ __name((ev) => this._on_key(ev), "keydown"),
      dblclick: /* @__PURE__ */ __name((e) => this._on_click(e), "dblclick"),
      contextmenu: /* @__PURE__ */ __name((e) => this._on_ctx_menu(e), "contextmenu")
    });
    if (props.items) {
      this.setItems(props.items);
    }
  }
  /**
   * 
   */
  _on_key(ev) {
    if (this.isDisabled()) {
      return;
    }
    switch (ev.key) {
      case "ArrowDown": {
        this.navigate(2 /* next */);
        break;
      }
      case "ArrowUp": {
        this.navigate(1 /* prev */);
        break;
      }
      case "Home": {
        this.navigate(0 /* first */);
        break;
      }
      case "End": {
        this.navigate(3 /* last */);
        break;
      }
      default:
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  /**
   * 
   */
  navigate(sens) {
    if (!this._selitem) {
      if (sens == 2 /* next */) sens = 0 /* first */;
      else sens = 3 /* last */;
    }
    const next_visible = /* @__PURE__ */ __name((el, down) => {
      while (el && !el.isVisible()) {
        el = down ? el.nextElement() : el.prevElement();
      }
      return el;
    }, "next_visible");
    if (sens == 0 /* first */ || sens == 3 /* last */) {
      let fel = sens == 0 /* first */ ? this._view.firstChild() : this._view.lastChild();
      fel = next_visible(fel, sens == 0 /* first */);
      if (fel) {
        const id = fel.getData("id");
        this._selectItem(id, fel);
        return true;
      }
    } else {
      let nel = sens == 2 /* next */ ? this._selitem.nextElement() : this._selitem.prevElement();
      nel = next_visible(nel, sens == 2 /* next */);
      if (nel) {
        const id = nel.getData("id");
        this._selectItem(id, nel);
        return true;
      }
    }
    return false;
  }
  /**
   * 
   */
  _on_click(ev) {
    ev.stopImmediatePropagation();
    ev.preventDefault();
    let target = ev.target;
    while (target && target != this.dom) {
      const c = componentFromDOM(target);
      if (c && c.hasClass("x4item")) {
        const id = c.getData("id");
        const fev = { context: id };
        if (ev.type == "click") {
          this.fire("click", fev);
        } else {
          this.fire("dblClick", fev);
        }
        if (!fev.defaultPrevented) {
          this._selectItem(id, c);
        }
        return;
      }
      target = target.parentElement;
    }
    this.clearSelection();
  }
  /**
   * 
   */
  _on_ctx_menu(ev) {
    ev.preventDefault();
    let target = ev.target;
    while (target && target != this.dom) {
      const c = componentFromDOM(target);
      if (c && c.hasClass("x4item")) {
        const id = c.getData("id");
        this._selectItem(id, c);
        this.fire("contextMenu", { uievent: ev, context: id });
        return;
      }
      target = target.parentElement;
    }
    this.fire("contextMenu", { uievent: ev, context: null });
  }
  /**
   * 
   */
  _selectItem(id, item) {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selitem = item;
    this._selection = id;
    if (item) {
      item.addClass("selected");
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
    const itm = this._findItem(id);
    this.fire("selectionChange", { selection: itm });
  }
  /**
   * 
   */
  _findItem(id) {
    return this._items.find((x) => x.id == id);
  }
  /**
   * 
   */
  _findItemIndex(id) {
    return this._items.findIndex((x) => x.id == id);
  }
  /**
   * 
   */
  clearSelection() {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selection = void 0;
    this.fire("selectionChange", { selection: void 0 });
  }
  /**
   * 
   */
  setItems(items) {
    this.clearSelection();
    this._view.clearContent();
    this._items = items;
    if (items) {
      const content = items.map((x) => this.renderItem(x));
      this._view.setContent(content);
    }
  }
  /**
   * 
   */
  renderItem(item) {
    var _a;
    const renderer = (_a = this.props.renderer) != null ? _a : this.defaultRenderer;
    const line = renderer(item);
    line.addClass("x4item");
    line.setData("id", item.id + "");
    return line;
  }
  /**
   * 
   */
  defaultRenderer(item) {
    return new HBox({
      cls: item.cls,
      content: new Label({ icon: item.iconId, text: item.text })
    });
  }
  /**
   * 
   */
  filter(filter) {
    const childs = this._view.enumChildComponents(false);
    if (!filter) {
      childs.forEach((x) => x.show(true));
    } else {
      const filtred = this._items.filter((x) => x.text.includes(filter)).map((x) => x.id + "");
      childs.forEach((x) => {
        x.show(filtred.includes(x.getData("id")));
      });
    }
  }
  /**
   * append or prepend a new item
   * @param item 
   * @param prepend 
   * @param select 
   */
  appendItem(item, prepend = false, select = true) {
    if (select) {
      this.clearSelection();
    }
    let el = this.renderItem(item);
    if (prepend) {
      this._items.unshift(item);
      this._view.prependContent(el);
    } else {
      this._items.push(item);
      this._view.appendContent(el);
    }
    if (select) {
      this._selectItem(item.id, el);
    }
  }
  /**
   * update an item
   */
  updateItem(id, item) {
    var _a;
    const idx = this._findItemIndex(id);
    if (idx < 0) {
      return;
    }
    let was_sel = false;
    if (this._selection && this._selection === id) {
      was_sel = true;
    }
    this._items[idx] = item;
    const oldDOM = (_a = this.query(`[data-id="${item.id}"]`)) == null ? void 0 : _a.dom;
    if (oldDOM) {
      const _new = this.renderItem(item);
      this._view.dom.replaceChild(_new.dom, oldDOM);
      if (was_sel) {
        this._selectItem(item.id, _new);
      }
    }
  }
};
__name(_Listbox, "Listbox");
var Listbox = _Listbox;

// src/components/combobox/updown.svg
var updown_default = 'data:image/svg+xml,<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">%0D%0A%09<path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">%0D%0A%09</path>%0D%0A</svg>';

// src/components/combobox/combobox.ts
var _Dropdown = class _Dropdown extends Popup {
  constructor(props, content) {
    super(props);
    this._list = new Listbox({ items: props.items });
    this.setContent(this._list);
    this.addDOMEvent("mousedown", (ev) => {
      console.log("trap");
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault();
    }, true);
    this._list.on("selectionChange", (ev) => {
      this.fire("selectionChange", ev);
    });
  }
  getList() {
    return this._list;
  }
};
__name(_Dropdown, "Dropdown");
var Dropdown = _Dropdown;
var _Combobox = class _Combobox extends Component {
  constructor(props) {
    super(props);
    this._prevent_close = false;
    const id = makeUniqueComponentId();
    this.setContent([
      new HBox({ id: "label", content: new Label({ tag: "label", text: props.label, labelFor: id, width: props.labelWidth }) }),
      this._edit = new HBox({ id: "edit", content: [
        this._input = new Input({ type: "text", value: "", readonly: props.readonly }),
        this._button = new Button({ icon: updown_default })
      ] })
    ]);
    this._dropdown = new Dropdown({ items: props.items });
    this._dropdown.on("selectionChange", (ev) => {
      const sel = ev.selection;
      this._input.setValue(sel ? sel.text : "");
      if (!this._prevent_close) {
        this._dropdown.show(false);
      }
    });
    this._button.addDOMEvent("click", () => this._on_click());
    this._input.addDOMEvent("input", () => this._on_input());
    this._input.addDOMEvent("keydown", (ev) => this._on_key(ev));
    this.setDOMEvents({
      focusout: /* @__PURE__ */ __name(() => this._on_focusout(), "focusout"),
      click: /* @__PURE__ */ __name(() => this._on_click(), "click")
    });
  }
  _on_key(ev) {
    switch (ev.key) {
      case "Enter":
      case "Escape": {
        this._dropdown.show(false);
        break;
      }
      case "ArrowUp":
        this._prevent_close = true;
        if (!this._dropdown.isOpen()) {
          this.showDropDown();
        } else {
          this._dropdown.getList().navigate(1 /* prev */);
        }
        this._prevent_close = false;
        break;
      case "ArrowDown":
        this._prevent_close = true;
        if (!this._dropdown.isOpen()) {
          this.showDropDown();
        } else {
          this._dropdown.getList().navigate(2 /* next */);
        }
        this._prevent_close = false;
        break;
      default: {
        return;
      }
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  _on_input() {
    if (!this._dropdown.isOpen()) {
      this.showDropDown();
    }
    this._dropdown.getList().filter(this._input.getValue());
  }
  _on_focusout() {
    this._dropdown.show(false);
  }
  _on_click() {
    this.showDropDown();
  }
  showDropDown() {
    if (this.isDisabled()) {
      return;
    }
    const rc = this._edit.getBoundingRect();
    this._dropdown.setStyleValue("width", rc.width + "px");
    this._dropdown.displayNear(rc, "top left", "bottom left", { x: 0, y: 6 });
  }
};
__name(_Combobox, "Combobox");
var Combobox = _Combobox;

// src/components/dialog/xmark-sharp-light.svg
var xmark_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M192 233.4L59.5 100.9 36.9 123.5 169.4 256 36.9 388.5l22.6 22.6L192 278.6 324.5 411.1l22.6-22.6L214.6 256 347.1 123.5l-22.6-22.6L192 233.4z"/></svg>';

// src/components/dialog/dialog.ts
var _Dialog = class _Dialog extends Popup {
  constructor(props) {
    super(props);
    this.appendContent([
      new HBox({
        cls: "caption",
        content: [
          new Label({
            id: "title",
            cls: "caption-element",
            icon: props.icon,
            text: props.title
          }),
          props.closable ? new Button({
            id: "closebox",
            icon: xmark_sharp_light_default,
            click: /* @__PURE__ */ __name(() => {
              this.close();
            }, "click")
          }) : null
        ]
      }),
      props.form,
      new BtnGroup({
        id: "btnbar",
        reverse: true,
        items: props.buttons,
        btnclick: /* @__PURE__ */ __name((ev) => {
          this.fire("btnclick", ev);
        }, "btnclick")
      })
    ]);
  }
  display() {
    super.displayCenter();
  }
  close() {
    this.fire("close", {});
    super.close();
  }
};
__name(_Dialog, "Dialog");
var Dialog = _Dialog;

// src/components/form/form.ts
var _Form = class _Form extends Box {
  setValues(values) {
    const items = this.queryAll("input[name]");
    console.log(items);
  }
  getValues() {
    const result = {};
    return result;
  }
};
__name(_Form, "Form");
var Form = _Form;

// src/components/header/header.ts
var _Header = class _Header extends HBox {
  constructor(props) {
    var _a;
    super(props);
    this._els = (_a = props.items) == null ? void 0 : _a.map((x) => {
      const cell = new Label({ cls: "cell", text: x.title, icon: x.iconId });
      const sizer = new CSizer("right");
      if (x.width > 0) {
        cell.setStyleValue("width", x.width + "px");
        cell.setInternalData("width", x.width);
      } else if (x.width < 0) {
        cell.setInternalData("flex", -x.width);
      } else {
        cell.setInternalData("width", 0);
      }
      sizer.addDOMEvent("dblclick", (e) => {
        cell.setInternalData("flex", 1);
        this._calc_sizes();
      });
      sizer.on("resize", (ev) => {
        cell.setInternalData("flex", 0);
        cell.setInternalData("width", ev.size);
        this._calc_sizes();
      });
      cell.appendContent(sizer);
      cell.setInternalData("data", x);
      return cell;
    });
    this.addDOMEvent("resized", () => this._on_resize());
    this.addDOMEvent("created", () => this._calc_sizes());
    this._vwp = new HBox({ content: this._els });
    this.setContent(this._vwp);
  }
  _calc_sizes() {
    let count = 0;
    let filled = 0;
    this._els.forEach((c) => {
      const flex = c.getInternalData("flex");
      if (flex) {
        count += flex;
      } else {
        let width = c.getInternalData("width");
        if (width == 0) {
          const rc2 = c.getBoundingRect();
          width = Math.ceil(rc2.width) + 2;
          c.setInternalData("width", width);
        }
        filled += width;
      }
    });
    const rc = this.getBoundingRect();
    let rest = rc.width - filled;
    const unit = Math.ceil(rest / count);
    console.log("filled", filled);
    console.log("count", count);
    console.log("rest", rest);
    console.log("unit", unit);
    let fullw = 0;
    this._els.forEach((c) => {
      let width = 0;
      const flex = c.getInternalData("flex");
      if (flex) {
        width = Math.min(unit * flex, rest);
        rest -= width;
      } else {
        width = c.getInternalData("width");
      }
      c.setWidth(width);
      fullw += width;
    });
    this._vwp.setWidth(fullw);
  }
  _on_resize() {
    this._calc_sizes();
  }
};
__name(_Header, "Header");
var Header = _Header;

// src/components/image/image.ts
var _Image = class _Image extends Component {
  constructor(props) {
    var _a;
    super(props);
    this._img = new Component({
      tag: "img",
      attrs: {
        loading: props.lazy,
        alt: props.alt,
        draggable: (_a = props.draggable) != null ? _a : false
      },
      style: {
        width: "100%",
        height: "100%",
        objectFit: props.fit,
        objectPosition: props.position
      }
    });
    this.setContent(this._img);
    this.setImage(props.src);
  }
  /**
   * 
   */
  setImage(src) {
    this._img.setAttribute("src", src);
  }
};
__name(_Image, "Image");
var Image2 = _Image;

// src/components/messages/circle-exclamation.svg
var circle_exclamation_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';

// src/components/messages/messages.ts
var _MessageBox = class _MessageBox extends Dialog {
  constructor(props) {
    super(props);
  }
  setText(txt) {
    this.m_label.setText(txt);
  }
  /**
   * display a messagebox
   */
  static show(msg) {
    const box = new _MessageBox({
      modal: true,
      title: _tr.global.error,
      movable: true,
      form: new Form({
        content: [
          new HBox({
            content: [
              new Icon({ iconId: circle_exclamation_default }),
              new Label({ text: msg })
            ]
          })
        ]
      }),
      buttons: ["ok", "cancel"]
    });
    box.on("btnclick", (ev) => {
      asap(() => box.close());
    });
    box.display();
    return box;
  }
};
__name(_MessageBox, "MessageBox");
var MessageBox = _MessageBox;

// src/components/notification/circle-check-solid.svg
var circle_check_solid_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';

// src/components/notification/circle-exclamation-solid.svg
var circle_exclamation_solid_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';

// src/components/notification/circle-notch-light.svg
var circle_notch_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M207.4 20.4c2.4 8.5-2.6 17.3-11.2 19.7C101.5 66.2 32 153 32 256c0 123.7 100.3 224 224 224s224-100.3 224-224c0-103-69.5-189.8-164.3-215.9c-8.5-2.4-13.5-11.2-11.2-19.7s11.2-13.5 19.7-11.2C432.5 39.1 512 138.2 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 138.2 79.5 39.1 187.7 9.2c8.5-2.4 17.3 2.6 19.7 11.2z"/></svg>';

// src/components/notification/xmark-sharp-light.svg
var xmark_sharp_light_default2 = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M192 233.4L59.5 100.9 36.9 123.5 169.4 256 36.9 388.5l22.6 22.6L192 278.6 324.5 411.1l22.6-22.6L214.6 256 347.1 123.5l-22.6-22.6L192 233.4z"/></svg>';

// src/components/notification/notification.ts
var _Notification = class _Notification extends Popup {
  constructor(props) {
    super({});
    let icon = props.iconId;
    if (!icon) {
      if (props.loading) {
        icon = circle_notch_light_default;
        this.addClass("");
      } else if (props.mode == "danger") {
        icon = circle_exclamation_solid_default;
      } else {
        icon = circle_check_solid_default;
      }
    }
    this.addClass(props.mode);
    const _icon = new Icon({ iconId: icon });
    if (props.loading) {
      _icon.addClass("rotate");
      this.props.modal = true;
    }
    this.setContent(new HBox({
      content: [
        _icon,
        new VBox({ cls: "body", content: [
          new Label({ cls: "title", text: props.title }),
          new Label({ cls: "text", text: props.text })
        ] }),
        new Button({ cls: "outline", icon: xmark_sharp_light_default2, click: /* @__PURE__ */ __name(() => {
          this.close();
        }, "click") })
      ]
    }));
  }
  close() {
    this.clearTimeout("close");
    super.close();
  }
  display(time_in_s = 0) {
    const r = new Rect(0, 0, window.innerWidth, window.innerHeight);
    this.displayNear(r, "bottom right", "bottom right", { x: -20, y: -10 });
    if (time_in_s) {
      this.setTimeout("close", time_in_s * 1e3, () => {
        this.close();
      });
    }
  }
};
__name(_Notification, "Notification");
var Notification = _Notification;

// src/components/panel/panel.ts
var _Panel = class _Panel extends VBox {
  constructor(props) {
    var _a;
    super({ ...props, content: void 0 });
    const model = (_a = props.bodyModel) != null ? _a : VBox;
    super.setContent([
      this._title = new Label({ tag: "legend", text: props.title, icon: props.icon }),
      this._body = new model({ cls: "body", content: props.content })
    ]);
  }
  setContent(content) {
    this._body.setContent(content);
  }
  setTitle(title) {
    this._title.setContent(title);
  }
};
__name(_Panel, "Panel");
var Panel = _Panel;

// src/components/progress/progress.ts
var _Progress = class _Progress extends Component {
  constructor(props) {
    super(props);
    this.setContent(this._bar = new Component({ cls: "bar" }));
    this.setValue(props.value);
  }
  setValue(value) {
    const perc = value / (this.props.max - this.props.min) * 100;
    this._bar.setStyleValue("width", perc + "%");
  }
};
__name(_Progress, "Progress");
var Progress = _Progress;

// src/components/rating/star-sharp-solid.svg
var star_sharp_solid_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg>';

// src/components/rating/rating.ts
var _Rating = class _Rating extends HBox {
  constructor(props) {
    var _a;
    super(props);
    props.steps = (_a = props.steps) != null ? _a : 5;
    this._update();
  }
  _update() {
    var _a, _b;
    const props = this.props;
    let shape = (_a = props.icon) != null ? _a : star_sharp_solid_default;
    let value = (_b = props.value) != null ? _b : 0;
    this.m_input = new Input({
      type: "text",
      hidden: true,
      name: props.name,
      value: "" + value
    });
    this.addDOMEvent("click", (e) => this._on_click(e));
    this.m_els = [];
    for (let i = 0; i < props.steps; i++) {
      let cls = "item";
      if (i + 1 <= value) {
        cls += " checked";
      }
      let c = new Icon({
        cls,
        iconId: shape
      });
      c.setInternalData("value", i);
      this.m_els.push(c);
    }
    this.m_els.push(this.m_input);
    this.setContent(this.m_els);
  }
  getValue() {
    var _a;
    return (_a = this.props.value) != null ? _a : 0;
  }
  setValue(v) {
    this.props.value = v;
    for (let c = 0; c < this.props.steps; c++) {
      this.m_els[c].setClass("checked", this.m_els[c].getInternalData("value") <= v);
    }
    this.m_input.setValue("" + this.props.value);
  }
  setSteps(n) {
    this.props.steps = n;
    this._update();
  }
  setShape(icon) {
    this.removeClass(this.props.icon);
    this.props.icon = icon;
  }
  _on_click(ev) {
    let item = componentFromDOM(ev.target);
    item = item.parentElement(Icon);
    if (item) {
      this.setValue(item.getInternalData("value"));
    }
    this.fire("change", { value: this.props.value });
  }
};
__name(_Rating, "Rating");
var Rating = _Rating;

// src/components/slider/slider.ts
var _Slider = class _Slider extends Component {
  constructor(props) {
    super(props);
    this._mdown = false;
    this._irect = null;
    this._thumb = null;
    this._bar = null;
    this._range = null;
    this.setContent([
      new HBox({ cls: "track", content: [
        this._bar = new Component({ cls: "bar" }),
        this._thumb = new Component({ cls: "thumb" })
      ] }),
      this._range = new Input({ type: "range", hidden: true, value: props.value, min: props.min, max: props.max, step: props.step })
    ]);
    this.setAttribute("tabindex", 0);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((ev) => this._on_mousedown(ev), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((ev) => this._on_mousemove(ev), "pointermove"),
      pointerup: /* @__PURE__ */ __name((ev) => this._on_mouseup(ev), "pointerup"),
      keydown: /* @__PURE__ */ __name((ev) => this._on_key(ev), "keydown")
    });
    this._range.addDOMEvent("change", (ev) => {
    });
  }
  _on_mousedown(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.focus();
    this._mdown = true;
    this._irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  _on_mousemove(ev) {
    if (this._mdown) {
      let pos = ev.pageX - this._irect.left;
      if (pos < 0) {
        pos = 0;
      } else if (pos > this._irect.width) {
        pos = this._irect.width;
      }
      let perc = pos / this._irect.width * 100;
      this._range.setNumValue(perc);
      this._update();
    }
  }
  _update() {
    const value = this._range.getNumValue();
    const perc = value / (this.props.max - this.props.min) * 100;
    this._thumb.setStyleValue("left", perc + "%");
    this._bar.setStyleValue("width", perc + "%");
    this.fire("change", { value });
  }
  _on_mouseup(ev) {
    if (this._mdown) {
      this.releaseCapture(ev.pointerId);
      this._mdown = false;
    }
  }
  _on_key(ev) {
    var _a;
    console.log(ev.key);
    let stp = (_a = this.props.step) != null ? _a : 1;
    let inc = 0;
    switch (ev.key) {
      case "ArrowRight":
      case "ArrowUp":
        inc = stp;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        inc = -stp;
        break;
    }
    if (inc) {
      if (ev.ctrlKey) {
        inc *= 10;
      }
      this._range.setNumValue(this._range.getNumValue() + inc);
      this._update();
    }
  }
};
__name(_Slider, "Slider");
var Slider = _Slider;

// src/components/switch/switch.ts
var _Switch = class _Switch extends HBox {
  constructor(props) {
    super(props);
    const inputId = makeUniqueComponentId();
    this.setContent([
      new Component({
        cls: "switch",
        content: [
          new Input({ type: "checkbox", id: inputId, checked: props.checked }),
          new Component({ cls: "track" }),
          new Component({ cls: "thumb" })
        ]
      }),
      new Label({
        tag: "label",
        text: props.label,
        labelFor: inputId
      })
    ]);
  }
};
__name(_Switch, "Switch");
var Switch = _Switch;

// src/components/tabs/tabs.ts
var _CTab = class _CTab extends Button {
  constructor(props, item) {
    super(props);
    this.addClass("outline");
    this.setIcon(item.icon);
    this.setText(item.title);
    this.setData("tabname", item.name);
  }
};
__name(_CTab, "CTab");
var CTab = _CTab;
var _CTabList = class _CTabList extends HBox {
  constructor(props, content) {
    super(props);
    const tabs = content.map((tab) => {
      return new CTab({
        click: /* @__PURE__ */ __name((ev) => this._on_click(ev), "click")
      }, tab);
    });
    this.mapPropEvents(props, "click");
    this.setContent(tabs);
  }
  _on_click(ev) {
    const name = ev.source.getData("tabname");
    this.fire("click", { name });
  }
  select(name) {
    const tab = this.query(`[data-tabname="${name}"]`);
    if (this._selitem) {
      this._selitem.setClass("selected", false);
    }
    this._selitem = tab;
    this._selection = name;
    if (this._selitem) {
      this._selitem.setClass("selected", true);
    }
  }
};
__name(_CTabList, "CTabList");
var CTabList = _CTabList;
var _Tabs = class _Tabs extends VBox {
  constructor(props) {
    var _a;
    super(props);
    const pages = (_a = props.items) == null ? void 0 : _a.map((x) => {
      return {
        name: x.name,
        content: x.tab
      };
    });
    this.setContent([
      this._list = new CTabList(
        {
          click: /* @__PURE__ */ __name((ev) => this._onclick(ev), "click")
        },
        props.items
      ),
      this._stack = new StackBox({
        cls: "body x4flex",
        default: props.default,
        items: pages
      })
    ]);
    if (props.default) {
      this.selectTab(props.default);
    }
  }
  selectTab(name) {
    this._list.select(name);
    this._stack.select(name);
  }
  _onclick(ev) {
    this.selectTab(ev.name);
  }
};
__name(_Tabs, "Tabs");
var Tabs = _Tabs;

// src/components/textarea/textarea.ts
var _TextArea = class _TextArea extends VBox {
  constructor(props) {
    super(props);
    this.setContent([
      new Label({ text: props.label }),
      this._input = new Component({ tag: "textarea" })
    ]);
    this._input.setAttribute("name", props.name);
    this._input.setAttribute("value", props.value + "");
    if (!props.resize) {
      this._input.setAttribute("resize", false);
    }
  }
};
__name(_TextArea, "TextArea");
var TextArea = _TextArea;

// src/components/textedit/textedit.ts
var _TextEdit = class _TextEdit extends HBox {
  constructor(props) {
    var _a, _b;
    super(props);
    if (!props.inputId) {
      props.inputId = makeUniqueComponentId();
    }
    if (props.required) {
      this.setAttribute("required", true);
    }
    const gadgets = (_a = props.inputGadgets) != null ? _a : [];
    this.setContent([
      new HBox({ id: "label", width: props.labelWidth, content: [
        new Label({ tag: "label", text: props.label, labelFor: props.inputId })
      ] }),
      new HBox({ id: "edit", content: [
        new Input({
          type: (_b = props.type) != null ? _b : "text",
          readonly: props.readonly,
          value: props.value,
          id: props.inputId,
          required: props.required,
          disabled: props.disabled,
          placeholder: props.placeholder
        }),
        ...gadgets
      ] })
    ]);
  }
};
__name(_TextEdit, "TextEdit");
var TextEdit = _TextEdit;

// src/components/tooltips/circle-info-sharp-light.svg
var circle_info_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"  fill="currentColor"> <!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM192 352v32h16 96 16V352H304 272V240 224H256 216 200v32h16 24v96H208 192zm88-168V136H232v48h48z"/></svg>';

// src/components/tooltips/tooltips.ts
var last_hit = null;
var tooltip = null;
var timer = new Timer();
function initTooltips() {
  document.addEventListener("mouseenter", (ev) => {
    if (ev.target === document) {
      return;
    }
    const c = wrapDOM(ev.target);
    const tt = c.getAttribute("tooltip");
    if (tt) {
      last_hit = ev.target;
      const rc = c.getBoundingRect();
      showTT(tt, rc, { x: ev.pageX, y: ev.pageY });
    }
  }, true);
  document.addEventListener("mouseleave", (ev) => {
    if (last_hit && ev.target == last_hit) {
      last_hit = null;
      closeTT();
    }
  }, true);
}
__name(initTooltips, "initTooltips");
function showTT(text, rc, pt) {
  if (!tooltip) {
    tooltip = new Tooltip({});
  }
  timer.setTimeout(null, 300, () => {
    tooltip.setText(unsafeHtml(text));
    tooltip.displayAt(pt.x, pt.y);
  });
}
__name(showTT, "showTT");
function closeTT() {
  tooltip.show(false);
  timer.clearTimeout(null);
}
__name(closeTT, "closeTT");
var _Tooltip = class _Tooltip extends Popup {
  constructor(props) {
    super(props);
    this.setContent(
      new HBox({ content: [
        new Icon({ iconId: circle_info_sharp_light_default }),
        new Component({ id: "text" })
      ] })
    );
  }
  /**
   * 
   */
  setText(text) {
    this.query("#text").setContent(text);
  }
};
__name(_Tooltip, "Tooltip");
var Tooltip = _Tooltip;

// src/components/treeview/chevron-down-light.svg
var chevron_down_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M267.3 395.3c-6.2 6.2-16.4 6.2-22.6 0l-192-192c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L256 361.4 436.7 180.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-192 192z"/></svg>';

// src/components/treeview/treeview.ts
var kbTreeNav = /* @__PURE__ */ ((kbTreeNav2) => {
  kbTreeNav2[kbTreeNav2["first"] = 0] = "first";
  kbTreeNav2[kbTreeNav2["prev"] = 1] = "prev";
  kbTreeNav2[kbTreeNav2["next"] = 2] = "next";
  kbTreeNav2[kbTreeNav2["last"] = 3] = "last";
  kbTreeNav2[kbTreeNav2["parent"] = 4] = "parent";
  kbTreeNav2[kbTreeNav2["child"] = 5] = "child";
  kbTreeNav2[kbTreeNav2["expand"] = 6] = "expand";
  kbTreeNav2[kbTreeNav2["collapse"] = 7] = "collapse";
  kbTreeNav2[kbTreeNav2["toggle"] = 8] = "toggle";
  return kbTreeNav2;
})(kbTreeNav || {});
var _CTreeViewItem = class _CTreeViewItem extends Box {
  constructor(props, item) {
    super({ ...props });
    this._item = item;
    if (item) {
      this._label = new HBox({ cls: "label item", content: [
        this._icon = new Icon({ iconId: item.children ? chevron_down_light_default : item.iconId }),
        new Label({ tag: "span", cls: "", text: item.text })
      ] });
      this._label.setData("id", item.id + "");
      if (item.children) {
        this._childs = new VBox({ cls: "body" });
        if (item.open === void 0) {
          item.open = false;
        }
        this.addClass("folder");
        this.setClass("open", item.open);
        this.setItems(item.children);
        this._icon.addDOMEvent("click", (ev) => this.toggle(ev));
      }
    } else {
      this._childs = new VBox({ cls: "body" });
    }
    this.setContent([
      this._label,
      this._childs
    ]);
  }
  toggle(ev) {
    const isOpen = this.hasClass("open");
    this.open(!isOpen);
    if (ev) {
      ev.stopPropagation();
    }
  }
  open(open = true) {
    this.setClass("open", open);
    this._item.open = open;
  }
  setItems(items) {
    if (items) {
      const childs = items.map((itm) => {
        return new _CTreeViewItem({}, itm);
      });
      this._childs.setContent(childs);
    } else {
      this._childs.clearContent();
    }
  }
};
__name(_CTreeViewItem, "CTreeViewItem");
var CTreeViewItem = _CTreeViewItem;
var _Treeview = class _Treeview extends Component {
  constructor(props) {
    super(props);
    if (props.items) {
      this.setItems(props.items);
    }
    this.setAttribute("tabindex", 0);
    this.setDOMEvents({
      click: /* @__PURE__ */ __name((ev) => this._onclick(ev), "click"),
      keydown: /* @__PURE__ */ __name((ev) => this._onkey(ev), "keydown")
    });
  }
  /**
   * 
   */
  setItems(items) {
    this._items = items;
    const root = new CTreeViewItem({ cls: "root" }, null);
    root.setItems(items);
    this.setContent(root);
  }
  _onclick(ev) {
    let target = ev.target;
    while (target && target != this.dom) {
      const c = componentFromDOM(target);
      if (c && c.hasClass("item")) {
        const id = c.getData("id");
        this._selectItem(id, c);
        return;
      }
      target = target.parentElement;
    }
    this.clearSelection();
  }
  _onkey(ev) {
    switch (ev.key) {
      case "ArrowDown": {
        this.navigate(2 /* next */);
        break;
      }
      case "ArrowUp": {
        this.navigate(1 /* prev */);
        break;
      }
      case "Home": {
        this.navigate(0 /* first */);
        break;
      }
      case "End": {
        this.navigate(3 /* last */);
        break;
      }
      case "ArrowRight": {
        this.navigate(5 /* child */);
        break;
      }
      case "+": {
        this.navigate(6 /* expand */);
        break;
      }
      case "ArrowLeft": {
        this.navigate(4 /* parent */);
        break;
      }
      case "-": {
        this.navigate(7 /* collapse */);
        break;
      }
      case " ": {
        this.navigate(8 /* toggle */);
        break;
      }
      default:
        console.log(ev.key);
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  /**
   * 
   */
  navigate(sens) {
    var _a;
    if (!this._items || this._items.length == 0) {
      return;
    }
    if (!this._selitem) {
      if (sens == 2 /* next */ || sens == 4 /* parent */) sens = 0 /* first */;
      else if (sens == 1 /* prev */) sens = 3 /* last */;
      else return;
    }
    const p = (_a = this._selitem) == null ? void 0 : _a.parentElement();
    const isFolder = p == null ? void 0 : p.hasClass("folder");
    if (p && sens == 4 /* parent */ && isFolder && p.hasClass("open")) {
      sens = 7 /* collapse */;
    } else if (sens == 5 /* child */) {
      if (isFolder) {
        if (!p.hasClass("open")) {
          sens = 6 /* expand */;
        } else {
          sens = 2 /* next */;
        }
      } else {
        sens = 2 /* next */;
      }
    }
    if (sens == 6 /* expand */ || sens == 7 /* collapse */ || sens == 8 /* toggle */) {
      if (isFolder) {
        if (sens == 8 /* toggle */) {
          p.toggle();
          return true;
        } else {
          p.open(sens == 6 /* expand */);
          return true;
        }
      }
    } else {
      const all = this._flattenOpenItems();
      let cur = all.findIndex((x) => this._selection == x.id);
      let newSel;
      if (sens == 0 /* first */) {
        newSel = all[0].id;
      } else if (sens == 3 /* last */) {
        newSel = all[all.length - 1].id;
      } else if (cur >= 0) {
        if (sens == 1 /* prev */) {
          if (cur > 0) {
            newSel = all[cur - 1].id;
          }
        } else if (sens == 2 /* next */) {
          if (cur < all.length - 1) {
            newSel = all[cur + 1].id;
          }
        } else if (sens == 4 /* parent */) {
          const clevel = all[cur].level;
          while (cur > 0) {
            cur--;
            if (all[cur].level < clevel) {
              newSel = all[cur].id;
              break;
            }
          }
        }
      }
      if (newSel) {
        const nsel = this.query(`[data-id="${newSel}"]`);
        this._selectItem(newSel, nsel);
        return true;
      }
    }
    return false;
  }
  _flattenOpenItems() {
    let all = [];
    const build = /* @__PURE__ */ __name((x, level) => {
      all.push({ id: x.id + "", level });
      if (x.children && x.open) {
        x.children.forEach((y) => build(y, level + 1));
      }
    }, "build");
    this._items.forEach((y) => build(y, 0));
    return all;
  }
  _flattenItems() {
    let all = [];
    const build = /* @__PURE__ */ __name((x) => {
      all.push(x);
      if (x.children) {
        x.children.forEach((y) => build(y));
      }
    }, "build");
    this._items.forEach((y) => build(y));
    return all;
  }
  _selectItem(id, item) {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selitem = item;
    this._selection = id;
    if (item) {
      item.addClass("selected");
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
    const itm = this._findItem(id);
    this.fire("change", { selection: itm });
  }
  _findItem(id) {
    const all = this._flattenItems();
    return all.find((x) => x.id == id);
  }
  /**
   * 
   */
  clearSelection() {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selection = void 0;
    this.fire("change", { selection: void 0 });
  }
};
__name(_Treeview, "Treeview");
var Treeview = _Treeview;
export {
  Box,
  BtnGroup,
  Button,
  CSizer,
  Calendar,
  Checkbox,
  Color,
  ColorInput,
  ColorPicker,
  Combobox,
  Component,
  ComputedStyle,
  CoreElement,
  Dialog,
  EventSource,
  Flex,
  Form,
  HBox,
  Header,
  Icon,
  Image2 as Image,
  Input,
  Label,
  Listbox,
  Menu,
  MessageBox,
  Notification,
  Panel,
  Popup,
  Progress,
  Rating,
  Rect,
  Router,
  Saturation,
  ScrollView,
  Slider,
  StackBox,
  Stylesheet,
  SvgBuilder,
  SvgComponent,
  SvgGradient,
  SvgGroup,
  SvgPath,
  SvgShape,
  SvgText,
  Switch,
  Tabs,
  TextArea,
  TextEdit,
  Timer,
  Treeview,
  UnsafeHtml,
  VBox,
  Viewport,
  _date_set_locale,
  _tr,
  addEvent,
  addTranslation,
  asap,
  beep,
  calcAge,
  camelCase,
  clamp,
  componentFromDOM,
  createLanguage,
  date_calc_weeknum,
  date_clone,
  date_diff,
  date_format,
  date_hash,
  date_sql_utc,
  date_to_sql,
  dispatchEvent,
  dragManager,
  formatIntlDate,
  getAvailableLanguages,
  getCurrentLanguage,
  initTooltips,
  isArray,
  isFeatureAvailable,
  isFunction,
  isLanguage,
  isNumber,
  isString,
  isUnitLess,
  kbNav,
  kbTreeNav,
  makeUniqueComponentId,
  pad,
  parseIntlDate,
  pascalCase,
  selectLanguage,
  sprintf,
  svgLoader,
  unbubbleEvents,
  unitless,
  unsafeHtml,
  wrapDOM
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NvcmUvY29yZV9pMThuLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfdG9vbHMudHMiLCAiLi4vc3JjL2NvcmUvY29yZV9ldmVudHMudHMiLCAiLi4vc3JjL2NvcmUvY29yZV9lbGVtZW50LnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfc3R5bGVzLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfZG9tLnRzIiwgIi4uL3NyYy9jb3JlL2NvbXBvbmVudC50cyIsICIuLi9zcmMvY29yZS9jb3JlX2NvbG9ycy50cyIsICIuLi9zcmMvY29yZS9jb3JlX2RyYWdkcm9wLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfcm91dGVyLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfc3ZnLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2JveGVzL2JveGVzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2ljb24vaWNvbi50cyIsICIuLi9zcmMvY29tcG9uZW50cy9idXR0b24vYnV0dG9uLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2J0bmdyb3VwL2J0bmdyb3VwLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2xhYmVsL2xhYmVsLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3NpemVycy9zaXplci50cyIsICIuLi9zcmMvY29tcG9uZW50cy9wb3B1cC9wb3B1cC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9tZW51L21lbnUudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvY2FsZW5kYXIvY2FsZW5kYXIudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvaW5wdXQudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvY2hlY2tib3gvY2hlY2tib3gudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvY29sb3JpbnB1dC9jb2xvcmlucHV0LnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2NvbG9ycGlja2VyL2NvbG9ycGlja2VyLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3ZpZXdwb3J0L3ZpZXdwb3J0LnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2xpc3Rib3gvbGlzdGJveC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9jb21ib2JveC9jb21ib2JveC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9kaWFsb2cvZGlhbG9nLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2Zvcm0vZm9ybS50cyIsICIuLi9zcmMvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2ltYWdlL2ltYWdlLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL21lc3NhZ2VzL21lc3NhZ2VzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24udHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvcGFuZWwvcGFuZWwudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvcHJvZ3Jlc3MvcHJvZ3Jlc3MudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvcmF0aW5nL3JhdGluZy50cyIsICIuLi9zcmMvY29tcG9uZW50cy9zbGlkZXIvc2xpZGVyLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3N3aXRjaC9zd2l0Y2gudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdGFicy90YWJzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RleHRhcmVhL3RleHRhcmVhLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RleHRlZGl0L3RleHRlZGl0LnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3Rvb2x0aXBzL3Rvb2x0aXBzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RyZWV2aWV3L3RyZWV2aWV3LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBjb3JlX2kxOG4udHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuXHJcbi8qKlxyXG4gKiBsYW5ndWFnZSBkZWZpbml0aW9uXHJcbiAqL1xyXG5cclxuIGludGVyZmFjZSBMYW5ndWFnZSB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBiYXNlOiBzdHJpbmc7XHJcblx0c3JjX3RyYW5zbGF0aW9uczogYW55O1xyXG4gICAgdHJhbnNsYXRpb25zOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IHN5bV9sYW5nID0gU3ltYm9sKCBcImkxOG5cIiApO1xyXG5cclxubGV0IGxhbmd1YWdlczogUmVjb3JkPHN0cmluZyxMYW5ndWFnZT4gPSB7XHJcbn07XHJcblxyXG4vKipcclxuICogY3JlYXRlIGEgbmV3IGxhbmd1YWdlXHJcbiAqIEBwYXJhbSBuYW1lIGxhbmd1YWdlIG5hbWUgKGNvZGUpXHJcbiAqIEBwYXJhbSBiYXNlIGJhc2UgbGFuZ3VhZ2UgKGNvZGUpXHJcbiAqIEBleGFtcGxlOlxyXG4gKiBgYGBqc1xyXG4gKiBjcmVhdGVMYW5ndWFnZSggJ2VuJywgJ2ZyJyApO1xyXG4gKiBgYGBcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGFuZ3VhZ2UoIG5hbWU6IHN0cmluZywgYmFzZTogc3RyaW5nICkge1xyXG4gICAgbGFuZ3VhZ2VzW25hbWVdID0geyBcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGJhc2UsXHJcblx0XHRzcmNfdHJhbnNsYXRpb25zOiB7fSxcclxuICAgICAgICB0cmFuc2xhdGlvbnM6IHt9XHJcbiAgICB9O1xyXG59XHJcblxyXG4vKipcclxuICogY2hlY2sgaWYgdGhlIGdpdmVuIGxhbmd1YWdlIGlzIGtub3duXHJcbiAqIEBwYXJhbSBuYW1lIGxhbmd1YWdlIG5hbWUgKGNvZGUpXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTGFuZ3VhZ2UoIG5hbWU6IHN0cmluZyApOiBib29sZWFuIHtcclxuICAgIHJldHVybiBsYW5ndWFnZXNbbmFtZV0hPT11bmRlZmluZWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBidWlsZCB0aGUgbGFuZ3VhZ2Ugd2l0aCBnaXZlbiBmcmFnbWVudHNcclxuICogQHBhcmFtIG5hbWUgbGFuZ3VhZ2UgbmFtZSAoY29kZSlcclxuICogQHBhcmFtIHBhcnRzIG1pc2MgZWxlbWVudHMgdGhhdCBtYWtlIHRoZSBsYW5ndWFnZVxyXG4gKiBAZXhhbXBsZTpcclxuICogYGBganNcclxuICogY3JlYXRlTGFuZ3VhZ2UoICdlbicsICdmcicgKTtcclxuICogY29uc3QgYXBwID0ge1xyXG4gKiBcdGNsaWVudHM6IHtcclxuICogXHRcdHRyYW5zbGF0aW9uMTogXCJoZWxsb1wiLFxyXG4gKiAgfVxyXG4gKiB9XHJcbiAqIGFkZFRyYW5zbGF0aW9uKCAnZW4nLCBhcHAgKTtcclxuICogYGBgXHJcbiAgKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUcmFuc2xhdGlvbiggbmFtZTogc3RyaW5nLCAuLi5wYXJ0czogYW55W10gKSB7XHJcblx0XHJcblx0aWYoICFpc0xhbmd1YWdlKG5hbWUpICkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgbGFuZyA9IGxhbmd1YWdlc1tuYW1lXTtcclxuICAgIFxyXG5cdHBhcnRzLmZvckVhY2goIHAgPT4ge1xyXG5cdFx0X3BhdGNoKCBsYW5nLnNyY190cmFuc2xhdGlvbnMsIHAgKTtcclxuXHR9ICk7XHJcblxyXG5cdGxhbmcudHJhbnNsYXRpb25zID0gX3Byb3h5ZnkoIGxhbmcuc3JjX3RyYW5zbGF0aW9ucywgbGFuZy5iYXNlLCB0cnVlICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBwYXRjaCB0aGUgYmFzZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0XHJcbiAqIChyZWFsIHBhdGNoKVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIF9wYXRjaCggb2JqOiBhbnksIGJ5OiBhbnkgKSB7XHJcblxyXG5cdGZvciggbGV0IG4gaW4gYnkgKSB7XHJcblx0XHRjb25zdCBzcmMgPSBieVtuXTtcclxuXHRcdGlmKCB0eXBlb2Ygc3JjID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRvYmpbbl0gPSBzcmM7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYoIEFycmF5LmlzQXJyYXkoc3JjKSAmJiAoIW9ialtuXSB8fCAhQXJyYXkuaXNBcnJheShvYmpbbl0pKSApIHtcclxuXHRcdFx0XHRvYmpbbl0gPSBbLi4uc3JjXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKCAhb2JqW25dIHx8ICh0eXBlb2Ygb2JqW25dICE9PSBcIm9iamVjdFwiKSApIHtcclxuXHRcdFx0XHRvYmpbbl0gPSB7IC4uLnNyYyB9O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdF9wYXRjaCggb2JqW25dLCBieVtuXSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogY3JlYXRlIGEgcHJveHkgZm9yIGFsbCBzdWIgb2JqZWN0c1xyXG4gKiAoZGVlcCB0cmF2ZXJzZSlcclxuICovXHJcblxyXG5mdW5jdGlvbiBfcHJveHlmeSggb2JqOiBhbnksIGJhc2U6IGFueSwgcm9vdDogYW55ICkge1xyXG5cclxuXHRjb25zdCByZXN1bHQ6IGFueSA9IHt9XHJcblxyXG5cdGZvciggY29uc3QgbiBpbiBvYmogKSB7XHJcblx0XHRpZiggdHlwZW9mIG9ialtuXSE9PVwic3RyaW5nXCIgJiYgIUFycmF5LmlzQXJyYXkob2JqW25dKSkge1xyXG5cdFx0XHRyZXN1bHRbbl0gPSBfcHJveHlmeSggb2JqW25dLCBiYXNlLCBmYWxzZSApO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJlc3VsdFtuXSA9IG9ialtuXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBfbWtfcHJveHkoIHJlc3VsdCwgYmFzZSwgcm9vdCApO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIGNyZWF0ZSBhIHByb3h5IGZvciB0aGUgZ2l2ZW4gb2JqZWN0XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gX21rX3Byb3h5KCBvYmo6IGFueSwgYmFzZTogc3RyaW5nLCByb290OiBib29sZWFuICkgOiBhbnkge1xyXG5cdHJldHVybiBuZXcgUHJveHkoIG9iaiwge1xyXG5cdFx0Z2V0OiAodGFyZ2V0LCBwcm9wKSA9PiB7XHJcblx0XHRcdGlmKCByb290ICkge1xyXG5cdFx0XHRcdHJlcV9wYXRoID0gW3Byb3BdO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHJlcV9wYXRoLnB1c2goIHByb3AgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHZhbHVlID0gdGFyZ2V0W3Byb3BdO1xyXG5cdFx0XHRpZiggdmFsdWU9PT11bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0aWYoIGJhc2UgKSB7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IF9maW5kQmFzZVRyYW5zKCBiYXNlICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiggdmFsdWU9PT11bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCBcIkkxOE4gZXJyb3I6IHVuYWJsZSB0byBmaW5kXCIsICdfdHIuJytyZXFfcGF0aC5qb2luKCcuJykgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiB3aGVuIHdlIGFzayBmb3IgX3RyLnh4eFxyXG4gKiByZXFwYXRoIGlzIHNldCB0byBbeHh4XVxyXG4gKiBcclxuICogdGhlbiB3aGVuIHdlIHRyeSB0byBnZXQgX3RyLnh4eC55eXlcclxuICogcmVxcGF0aCBpcyBbeHh4LHl5eV1cclxuICogaWYgeXl5IGlzIG5vdCBmb3VuZCwgd2UgdHJ5IHdpdGggYmFzZSBsYW5nYWdlIGZvciB0aGUgZnVsbCByZXFwYXRoIFxyXG4gKiB1bnRpbCBubyBiYXNlIGZvdW5kXHJcbiAqL1xyXG5cclxubGV0IHJlcV9wYXRoOiAoc3RyaW5nIHwgc3ltYm9sKVtdO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIF9maW5kQmFzZVRyYW5zKCBiYXNlOiBhbnkgKSB7XHJcblxyXG5cdHdoaWxlKCBiYXNlICkge1xyXG5cdFx0Y29uc3QgbGFuZyA9IGxhbmd1YWdlc1tiYXNlXTtcclxuXHRcdGxldCB0cmFucyA9IGxhbmcudHJhbnNsYXRpb25zO1xyXG5cdFx0bGV0IHZhbHVlO1xyXG5cclxuXHRcdGZvciggY29uc3QgcCBvZiByZXFfcGF0aCApIHtcclxuXHRcdFx0dmFsdWUgPSB0cmFuc1twXTtcclxuXHRcdFx0aWYoIHZhbHVlPT09dW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0cmFucyA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCB2YWx1ZSE9PXVuZGVmaW5lZCApIHtcclxuXHRcdFx0cmV0dXJuIHRyYW5zO1xyXG5cdFx0fVxyXG5cclxuXHRcdGJhc2UgPSBsYW5nLmJhc2U7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgbGV0IF90cjogUGFydGlhbDx0eXBlb2YgZnI+ID0ge307XHJcblxyXG4vKipcclxuICogc2VsZWN0IHRoZSBnaXZlbiBsYW5ndWFnZSBhcyBjdXJyZW50XHJcbiAqIEBwYXJhbSBuYW1lIGxhZ3VhZ2UgbmFtZSAoY29kZSlcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0TGFuZ3VhZ2UoIG5hbWU6IHN0cmluZyApIHtcclxuXHJcblx0aWYoICFpc0xhbmd1YWdlKG5hbWUpICkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0X3RyID0gbGFuZ3VhZ2VzW25hbWVdLnRyYW5zbGF0aW9ucztcclxuXHQoX3RyIGFzIGFueSlbc3ltX2xhbmddID0gbmFtZTtcclxuXHRyZXR1cm4gX3RyO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRMYW5ndWFnZSggKTogc3RyaW5nIHtcclxuXHRyZXR1cm4gKF90ciBhcyBhbnkpW3N5bV9sYW5nXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmFpbGFibGVMYW5ndWFnZXMoICk6IHN0cmluZ1tdIHtcclxuXHRyZXR1cm4gT2JqZWN0LmtleXMoIGxhbmd1YWdlcyApO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKipcclxuICogbGFuZ3VhZ2UgZGVmaW5pdGlvblxyXG4gKiB4NCBzcGVjaWZpYyBzdHJpbmdzXHJcbiAqL1xyXG5cclxubGV0IGZyID0ge1xyXG5cdGdsb2JhbDoge1xyXG5cdFx0b2s6ICdPSycsXHJcblx0XHRjYW5jZWw6ICdBbm51bGVyJyxcclxuXHRcdGlnbm9yZTogJ0lnbm9yZXInLFxyXG5cdFx0eWVzOiAnT3VpJyxcclxuXHRcdG5vOiAnTm9uJyxcclxuXHRcdGFib3J0OiBcIkFiYW5kb25uZXJcIixcclxuXHRcdHJldHJ5OiBcIlLDqWVzc2F5ZXJcIixcclxuXHJcblx0XHRlcnJvcjogXCJFcnJldXJcIixcclxuXHRcdHRvZGF5OiBcIkF1am91cmQnaHVpXCIsXHJcblxyXG5cdFx0b3BlbjogJ091dnJpcicsXHJcblx0XHRuZXc6ICdOb3V2ZWF1JyxcclxuXHRcdGRlbGV0ZTogJ1N1cHByaW1lcicsXHJcblx0XHRjbG9zZTogJ0Zlcm1lcicsXHJcblx0XHRzYXZlOiAnRW5yZWdpc3RyZXInLFxyXG5cclxuXHRcdHNlYXJjaDogJ1JlY2hlcmNoZXInLFxyXG5cdFx0c2VhcmNoX3RpcDogJ1NhaXNpc3NleiBsZSB0ZXh0ZSDDoCByZWNoZXJjaGVyLiA8Yj5FbnRlcjwvYj4gcG91ciBsYW5jZXIgbGEgcmVjaGVyY2hlLiA8Yj5Fc2M8L2I+IHBvdXIgYW5udWxlci4nLFxyXG5cclxuXHRcdHJlcXVpcmVkX2ZpZWxkOiBcImluZm9ybWF0aW9uIHJlcXVpc2VcIixcclxuXHRcdGludmFsaWRfZm9ybWF0OiBcImZvcm1hdCBpbnZhbGlkZVwiLFxyXG5cdFx0aW52YWxpZF9lbWFpbDogJ2FkcmVzc2UgbWFpbCBpbnZhbGlkZScsXHJcblx0XHRpbnZhbGlkX251bWJlcjogJ3ZhbGV1ciBudW3DqXJpcXVlIGludmFsaWRlJyxcclxuXHJcblx0XHRkaWZmX2RhdGVfc2Vjb25kczogJ3swfSBzZWNvbmRlcycsXHJcblx0XHRkaWZmX2RhdGVfbWludXRlczogJ3swfSBtaW51dGVzJyxcclxuXHRcdGRpZmZfZGF0ZV9ob3VyczogJ3swfSBoZXVyZXMnLFxyXG5cclxuXHRcdGludmFsaWRfZGF0ZTogJ0RhdGUgbm9uIHJlY29ubnVlICh7MH0pJyxcclxuXHRcdGVtcHR5X2xpc3Q6ICdMaXN0ZSB2aWRlJyxcclxuXHJcblx0XHRkYXRlX2lucHV0X2Zvcm1hdHM6ICdkL20veXxkLm0ueXxkIG0geXxkLW0teXxkbXknLFxyXG5cdFx0ZGF0ZV9mb3JtYXQ6ICdEL00vWScsXHJcblxyXG5cdFx0ZGF5X3Nob3J0OiBbICdkaW0nLCAnbHVuJywgJ21hcicsICdtZXInLCAnamV1JywgJ3ZlbicsICdzYW0nIF0sXHJcblx0XHRkYXlfbG9uZzogWyAnZGltYW5jaGUnLCAnbHVuZGknLCAnbWFyZGknLCAnbWVyY3JlZGknLCAnamV1ZGknLCAndmVuZHJlZGknLCAnc2FtZWRpJyBdLFxyXG5cclxuXHRcdG1vbnRoX3Nob3J0OiBbICdqYW4nLCAnZsOpdicsICdtYXInLCAnYXZyJywgJ21haScsICdqdW4nLCAnanVpJywgJ2Fvw7snLCAnc2VwJywgJ29jdCcsICdub3YnLCAnZMOpYycgXSxcclxuXHRcdG1vbnRoX2xvbmc6IFsgJ2phbnZpZXInLCAnZsOpdnJpZXInLCAnbWFycycsICdhdnJpbCcsICdtYWknLCAnanVpbicsICdqdWlsbGV0JywgJ2Fvw7t0JywgJ3NlcHRlbWJyZScsICdvY3RvYnJlJywgJ25vdmVtYnJlJywgJ2TDqWNlbWJyZScgXSxcclxuXHJcblx0XHRwcm9wZXJ0eTogJ1Byb3ByacOpdMOpJyxcclxuXHRcdHZhbHVlOiAnVmFsZXVyJyxcclxuXHJcblx0XHRlcnJfNDAzOiBgVm91cyBuJ2F2ZXogcGFzIGxlcyBkcm9pdHMgc3VmZmlzYW50cyBwb3VyIGVmZmVjdHVlciBjZXR0ZSBhY3Rpb25gLFxyXG5cclxuXHRcdGNvcHk6ICdDb3BpZXInLFxyXG5cdFx0Y3V0OiAnQ291cGVyJyxcclxuXHRcdHBhc3RlOiAnQ29sbGVyJ1xyXG5cdH1cclxufTtcclxuXHJcbi8qKiBAaWdub3JlICovXHJcblxyXG5sZXQgZW4gPSB7XHJcblx0Z2xvYmFsOiB7XHJcblx0XHRvazogJ09LJyxcclxuXHRcdGNhbmNlbDogJ0NhbmNlbCcsXHJcblx0XHRpZ25vcmU6ICdJZ25vcmUnLFxyXG5cdFx0eWVzOiAnWWVzJyxcclxuXHRcdG5vOiAnTm8nLFxyXG5cdFx0YWJvcnQ6IFwiQWJvcnRcIixcclxuXHRcdHJldHJ5OiBcIlJldHJ5XCIsXHJcblxyXG5cdFx0ZXJyb3I6IFwiRXJyb3JcIixcclxuXHRcdHRvZGF5OiBcIlRvZGF5XCIsXHJcblxyXG5cdFx0b3BlbjogJ09wZW4nLFxyXG5cdFx0bmV3OiAnTmV3JyxcclxuXHRcdGRlbGV0ZTogJ0RlbGV0ZScsXHJcblx0XHRjbG9zZTogJ0Nsb3NlJyxcclxuXHRcdHNhdmU6ICdTYXZlJyxcclxuXHJcblx0XHRzZWFyY2g6ICdTZWFyY2gnLFxyXG5cdFx0c2VhcmNoX3RpcDogJ1R5cGUgaW4gdGhlIHRleHQgdG8gc2VhcmNoLiA8Yj5FbnRlcjwvYj4gdG8gc3RhcnQgdGhlIHNlYXJjaC4gPGI+RXNjPC9iPiB0byBjYW5jZWwuJyxcclxuXHJcblx0XHRyZXF1aXJlZF9maWVsZDogXCJtaXNzaW5nIGluZm9ybWF0aW9uXCIsXHJcblx0XHRpbnZhbGlkX2Zvcm1hdDogXCJpbnZhbGlkIGZvcm1hdFwiLFxyXG5cdFx0aW52YWxpZF9lbWFpbDogJ2ludmFsaWQgZW1haWwgYWRkcmVzcycsXHJcblx0XHRpbnZhbGlkX251bWJlcjogJ2JhZCBudW1lcmljIHZhbHVlJyxcclxuXHJcblx0XHRkaWZmX2RhdGVfc2Vjb25kczogJ3swfSBzZWNvbmRzJyxcclxuXHRcdGRpZmZfZGF0ZV9taW51dGVzOiAnezB9IG1pbnV0ZXMnLFxyXG5cdFx0ZGlmZl9kYXRlX2hvdXJzOiAnezB9IGhvdXJzJyxcclxuXHJcblx0XHRpbnZhbGlkX2RhdGU6ICdVbnJlY29nbml6ZWQgZGF0ZSh7MH0pJyxcclxuXHRcdGVtcHR5X2xpc3Q6ICdFbXB0eSBsaXN0JyxcclxuXHJcblx0XHRkYXRlX2lucHV0X2Zvcm1hdHM6ICdtL2QveXxtLmQueXxtIGQgeXxtLWQteXxtZHknLFxyXG5cdFx0ZGF0ZV9mb3JtYXQ6ICdNL0QvWScsXHJcblxyXG5cdFx0ZGF5X3Nob3J0OiBbICdzdW4nLCAnbW9uJywgJ3R1ZScsICd3ZWQnLCAndGh1JywgJ2ZyaScsICdzYXQnIF0sXHJcblx0XHRkYXlfbG9uZzogWyAnc3VuZGF5JywgJ21vbmRheScsICd0dWVzZGF5JywgJ3dlZG5lc2RheScsICd0aHVyc2RheScsICdmcmlkYXknLCAnc2F0dXJkYXknIF0sXHJcblxyXG5cdFx0bW9udGhfc2hvcnQ6IFsgJ2phbicsICdmZWInLCAnbWFyJywgJ2FwcicsICdtYXknLCAnanVuJywgJ2p1aScsICdhdWcnLCAnc2VwJywgJ29jdCcsICdub3YnLCAnZGVjJyBdLFxyXG5cdFx0bW9udGhfbG9uZzogWyAnamFudWFyeScsICdmZWJydWFyeScsICdtYXJjaCcsICdhcHJpbCcsICdtYXUnLCAnanVuZScsICdqdWxseScsICdhdWd1c3QnLCAnc2VwdGVtYmVyJywgJ29jdG9iZXInLCAnbm92ZW1iZXInLCAnZGVjZW1iZXInIF0sXHJcblxyXG5cdFx0cHJvcGVydHk6ICdQcm9wZXJ0eScsXHJcblx0XHR2YWx1ZTogJ1ZhbHVlJyxcclxuXHJcblx0XHRlcnJfNDAzOiBgWW91IGRvIG5vdCBoYXZlIHN1ZmZpY2llbnQgcmlnaHRzIHRvIGRvIHRoYXQgYWN0aW9uYCxcclxuXHJcblx0XHRjb3B5OiAnQ29weScsXHJcblx0XHRjdXQ6ICdDdXQnLFxyXG5cdFx0cGFzdGU6ICdQYXN0ZSdcclxuXHR9XHJcbn07XHJcblxyXG5jcmVhdGVMYW5ndWFnZSggJ2ZyJywgbnVsbCApO1xyXG5hZGRUcmFuc2xhdGlvbiggJ2ZyJywgZnIgKTtcclxuXHJcbmNyZWF0ZUxhbmd1YWdlKCAnZW4nLCAnZnInICk7XHJcbmFkZFRyYW5zbGF0aW9uKCAnZW4nLCBlbiApO1xyXG5cclxuc2VsZWN0TGFuZ3VhZ2UoICdmcicgKTtcdC8vIGJ5IGRlZmF1bHRcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgY29yZV90b29scy50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBfdHIgfSBmcm9tIFwiLi9jb3JlX2kxOG4uanNcIjtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBhIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbDogYW55KTogdmFsIGlzIHN0cmluZyB7XHJcblx0cmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xyXG59XHJcblxyXG4vKipcclxuICogQHJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSBudW1iZXJcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIoIHY6IGFueSApOiB2IGlzIG51bWJlciB7XHJcblx0cmV0dXJuIHR5cGVvZiB2ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGFuIGFycmF5XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSh2YWw6IGFueSk6IHZhbCBpcyBhbnlbXSB7XHJcblx0cmV0dXJuIHZhbCBpbnN0YW5jZW9mIEFycmF5O1xyXG59XHJcblxyXG4vKipcclxuICogQHJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSBmdW5jdGlvblxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbDogYW55KTogdmFsIGlzIEZ1bmN0aW9uIHtcclxuXHRyZXR1cm4gdmFsIGluc3RhbmNlb2YgRnVuY3Rpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBnZW5lcmljIGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5cclxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8UD4gPSB7XHJcblx0bmV3KC4uLnBhcmFtczogYW55W10pOiBQO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBhIHdheSB0byBleHBsYWluIHRoYXQgdGhlIGdpdmVuIHN0cmluZyBtYXkgYmUgdW5zYWZlIGJ1dCBtdXN0IGJlIHRyZWF0ZWQgYSBzc3RyaW5nXHJcbiAqIEBleGFtcGxlXHJcbiAqIGxhYmVsLnNldFRleHQoIHVuc2FmZWh0bWxgPGI+Qm9sZDwvYj4gdGV4dGAgKTtcclxuICogbGFiZWwuc2V0VGV4dCggbmV3IFVuc2FmZUh0bWwoXCI8Yj5Cb2xkPC9iPiB0ZXh0YFwiICkgKTtcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgVW5zYWZlSHRtbCBleHRlbmRzIFN0cmluZyB7XHJcblx0Y29uc3RydWN0b3IoIHZhbHVlOiBzdHJpbmcgKSB7XHJcblx0XHRzdXBlciggdmFsdWUgKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVIdG1sKCB4OiBzdHJpbmcgKTogVW5zYWZlSHRtbCB7XHJcblx0cmV0dXJuIG5ldyBVbnNhZmVIdG1sKCB4ICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXA8VD4oIHY6IFQsIG1pbjogVCwgbWF4OiBUICkgOiBUIHtcclxuXHRpZiggdjxtaW4gKSB7IHJldHVybiBtaW47IH1cclxuXHRpZiggdj5tYXggKSB7IHJldHVybiBtYXg7IH1cclxuXHRyZXR1cm4gdjtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBnZW5lcmljIFJlY3RhbmdsZSBcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElSZWN0IHtcclxuXHRsZWZ0OiBudW1iZXI7XHJcbiAgICB0b3A6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWN0IGltcGxlbWVudHMgSVJlY3Qge1xyXG5cdGxlZnQ6IG51bWJlcjtcclxuXHR0b3A6IG51bWJlcjtcclxuXHRoZWlnaHQ6IG51bWJlcjtcclxuXHR3aWR0aDogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3RvciggKTtcclxuXHRjb25zdHJ1Y3RvciggbDogbnVtYmVyLCB0OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyICk7XHJcblx0Y29uc3RydWN0b3IoIGw6IFJlY3QgKTtcclxuXHRjb25zdHJ1Y3RvciggbD86IG51bWJlciB8IElSZWN0LCB0PzogbnVtYmVyLCB3PzogbnVtYmVyLCBoPzogbnVtYmVyICkge1xyXG5cdFx0aWYoIGwhPT11bmRlZmluZWQgKSB7XHJcblx0XHRcdGlmKCBpc051bWJlciggbCApICkge1xyXG5cdFx0XHRcdHRoaXMubGVmdCA9IGw7XHJcblx0XHRcdFx0dGhpcy50b3AgPSB0O1xyXG5cdFx0XHRcdHRoaXMud2lkdGggPSB3O1xyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0ID0gaDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLCBsICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Z2V0IHJpZ2h0KCApIHtcclxuXHRcdHJldHVybiB0aGlzLmxlZnQrdGhpcy53aWR0aDsgXHJcblx0fVxyXG5cclxuXHRnZXQgYm90dG9tKCApIHtcclxuXHRcdHJldHVybiB0aGlzLnRvcCt0aGlzLmhlaWdodDtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogZ2VuZXJpYyBQb2ludFxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUG9pbnQge1xyXG5cdHg6IG51bWJlcjtcclxuXHR5OiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDb21wb25lbnRJbnRlcmZhY2Uge1xyXG59XHJcblxyXG4vLyBmb3JtLWVsZW1lbnRcclxuZXhwb3J0IGludGVyZmFjZSBJRm9ybUVsZW1lbnQgZXh0ZW5kcyBJQ29tcG9uZW50SW50ZXJmYWNlIHtcclxuXHRnZXRSYXdWYWx1ZSggKTogYW55O1xyXG5cdHNldFJhd1ZhbHVlKCB2OiBhbnkgKTogdm9pZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmludGVyZmFjZSBGZWF0dXJlcyB7XHJcblx0ZXllZHJvcHBlcjogMSxcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRmVhdHVyZUF2YWlsYWJsZSggbmFtZToga2V5b2YgRmVhdHVyZXMgKTogYm9vbGVhbiB7XHJcblx0c3dpdGNoKCBuYW1lICkge1xyXG5cdFx0Y2FzZSBcImV5ZWRyb3BwZXJcIjogcmV0dXJuIFwiRXllRHJvcHBlclwiIGluIHdpbmRvdztcclxuXHR9XHJcblxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRpbWVyIHtcclxuXHRcclxuXHRwcm90ZWN0ZWQgX3RpbWVyczogTWFwPHN0cmluZyxhbnk+O1xyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRzZXRUaW1lb3V0KCBuYW1lOiBzdHJpbmcsIHRpbWU6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uICkge1xyXG5cdFx0aWYoICF0aGlzLl90aW1lcnMgKSB7XHJcblx0XHRcdHRoaXMuX3RpbWVycyA9IG5ldyBNYXAoICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5jbGVhclRpbWVvdXQoIG5hbWUgKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0bSA9IHNldFRpbWVvdXQoIGNhbGxiYWNrLCB0aW1lICk7XHJcblx0XHR0aGlzLl90aW1lcnMuc2V0KCBuYW1lLCB0bSApO1xyXG5cclxuXHRcdHJldHVybiB0bTtcclxuXHR9XHJcblxyXG5cdGNsZWFyVGltZW91dCggbmFtZTogc3RyaW5nICkge1xyXG5cdFx0aWYoIHRoaXMuX3RpbWVycyAmJiB0aGlzLl90aW1lcnMuaGFzKG5hbWUpICkge1xyXG5cdFx0XHRjbGVhclRpbWVvdXQoIHRoaXMuX3RpbWVycy5nZXQobmFtZSkgKTtcclxuXHRcdFx0dGhpcy5fdGltZXJzLmRlbGV0ZSggbmFtZSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHNldEludGVydmFsKCBuYW1lOiBzdHJpbmcsIHRpbWU6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uICkge1xyXG5cdFx0aWYoICF0aGlzLl90aW1lcnMgKSB7XHJcblx0XHRcdHRoaXMuX3RpbWVycyA9IG5ldyBNYXAoICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5jbGVhckludGVydmFsKCBuYW1lICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdG0gPSBzZXRJbnRlcnZhbCggY2FsbGJhY2ssIHRpbWUgKTtcclxuXHRcdHRoaXMuX3RpbWVycy5zZXQoIG5hbWUsIHRtICk7XHJcblxyXG5cdFx0cmV0dXJuIHRtO1xyXG5cdH1cclxuXHJcblx0Y2xlYXJJbnRlcnZhbCggbmFtZTogc3RyaW5nICkge1xyXG5cdFx0aWYoIHRoaXMuX3RpbWVycyAmJiB0aGlzLl90aW1lcnMuaGFzKG5hbWUpICkge1xyXG5cdFx0XHRjbGVhckludGVydmFsKCB0aGlzLl90aW1lcnMuZ2V0KG5hbWUpICk7XHJcblx0XHRcdHRoaXMuX3RpbWVycy5kZWxldGUoIG5hbWUgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsZWFyQWxsVGltZW91dHMoICkge1xyXG5cdFx0dGhpcy5fdGltZXJzPy5mb3JFYWNoKCB0ID0+IHtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KCB0ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0dGhpcy5fdGltZXJzID0gbnVsbDtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNhcCggY2FsbGJhY2s6ICggKSA9PiB2b2lkICkge1xyXG5cdHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGNhbGxiYWNrICk7XHJcbn1cclxuXHJcblxyXG4vLyA6OiBTVFJJTkcgVVRJTFMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcclxuXHJcblxyXG4vKipcclxuICogcHJlcGVuZCAwIHRvIGEgdmFsdWUgdG8gYSBnaXZlbiBsZW5ndGhcclxuICogQHBhcmFtIHZhbHVlIFxyXG4gKiBAcGFyYW0gbGVuZ3RoIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWQod2hhdDogYW55LCBzaXplOiBudW1iZXIsIGNoOiBzdHJpbmcgPSAnMCcpIHtcclxuXHJcblx0bGV0IHZhbHVlOiBzdHJpbmc7XHJcblxyXG5cdGlmICghaXNTdHJpbmcod2hhdCkpIHtcclxuXHRcdHZhbHVlID0gJycgKyB3aGF0O1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHZhbHVlID0gd2hhdDtcclxuXHR9XHJcblxyXG5cdGlmIChzaXplID4gMCkge1xyXG5cdFx0cmV0dXJuIHZhbHVlLnBhZEVuZChzaXplLCBjaCk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0cmV0dXJuIHZhbHVlLnBhZFN0YXJ0KC1zaXplLCBjaCk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogcmVwbGFjZSB7MC4uOX0gYnkgZ2l2ZW4gYXJndW1lbnRzXHJcbiAqIEBwYXJhbSBmb3JtYXQgc3RyaW5nXHJcbiAqIEBwYXJhbSBhcmdzIFxyXG4gKiBcclxuICogQGV4YW1wbGUgYGBgdHNcclxuICogXHJcbiAqIGNvbnNvbGUubG9nKCBzcHJpbnRmKCAnaGVyZSBpcyBhcmcgMSB7MX0gYW5kIGFyZyAwIHswfScsICdhcmd1bWVudCAwJywgJ2FyZ3VtZW50IDEnICkgKVxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzcHJpbnRmKCBmb3JtYXQ6IHN0cmluZywgLi4uYXJnczphbnlbXSApIHtcclxuXHRyZXR1cm4gZm9ybWF0LnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgaW5kZXgpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgYXJnc1tpbmRleF0gIT0gJ3VuZGVmaW5lZCcgPyBhcmdzW2luZGV4XSA6IG1hdGNoO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vKipcclxuICogaW52ZXJzZSBvZiBjYW1lbCBjYXNlXHJcbiAqIHRoZVRoaW5nVG9DYXNlIC0+IHRoZS10aGluZy10by1jYXNlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhc2NhbENhc2Uoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cclxuXHRsZXQgcmVzdWx0ID0gc3RyaW5nO1xyXG5cclxuXHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMSAkMlwiKTtcclxuXHRyZXN1bHQgPSByZXN1bHQudG9Mb3dlckNhc2UoKTtcclxuXHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvW14tIGEtejAtOV0rL2csICcgJyk7XHJcblxyXG5cdGlmIChyZXN1bHQuaW5kZXhPZignICcpIDwgMCkge1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdHJlc3VsdCA9IHJlc3VsdC50cmltKCk7XHJcblx0cmV0dXJuIHJlc3VsdC5yZXBsYWNlKC8gL2csICctJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjYW1lbENhc2UoIHRleHQ6IHN0cmluZyApIHtcclxuXHRsZXQgcmVzdWx0ID0gdGV4dC50b0xvd2VyQ2FzZSggKTtcclxuXHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZSggL1teYS16QS1aMC05XSsoLikvZywgKG0sY2hyKSA9PiB7XHJcblx0XHRyZXR1cm4gY2hyLnRvVXBwZXJDYXNlKCk7XHJcblx0fSApO1xyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8vIDo6IERBVEVTIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcblxyXG5sZXQgY3VyX2xvY2FsZTogc3RyaW5nID0gJ2ZyLUZSJztcclxuXHJcbi8qKlxyXG4gKiBjaGFuZ2UgdGhlIGN1cnJlbnQgbG9jYWxlIGZvciBtaXNjIHRyYW5zbGF0aW9ucyAoZGF0ZS4uLilcclxuICogQHBhcmFtIGxvY2FsZSBcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX2RhdGVfc2V0X2xvY2FsZShsb2NhbGU6IHN0cmluZykge1xyXG5cdGN1cl9sb2NhbGUgPSBsb2NhbGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIGRhdGUgXHJcbiAqIEBwYXJhbSBvcHRpb25zIFxyXG4gKiBAZXhhbXBsZVxyXG4gKiBsZXQgZGF0ZSA9IG5ldyBEYXRlKCApO1xyXG4gKiBsZXQgb3B0aW9ucyA9IHsgZGF5OiAnbnVtZXJpYycsIG1vbnRoOiAnbnVtZXJpYycsIHllYXI6ICdudW1lcmljJywgaG91cjogJ251bWVyaWMnLCBtaW51dGU6ICdudW1lcmljJyB9O1xyXG4gKiBsZXQgdGV4dCA9IGRhdGVfZm9ybWF0KCBkYXRlLCBvcHRpb25zICk7XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVfZm9ybWF0KGRhdGU6IERhdGUsIG9wdGlvbnM/OiBhbnkpOiBzdHJpbmcge1xyXG5cdC8vcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGN1cl9sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdCggZGF0ZSApO1xyXG5cdHJldHVybiBmb3JtYXRJbnRsRGF0ZShkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0gZGF0ZSBcclxuICogQHBhcmFtIG9wdGlvbnMgXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVfZGlmZihkYXRlMTogRGF0ZSwgZGF0ZTI6IERhdGUsIG9wdGlvbnM/OiBhbnkpOiBzdHJpbmcge1xyXG5cclxuXHR2YXIgZHQgPSAoZGF0ZTEuZ2V0VGltZSgpIC0gZGF0ZTIuZ2V0VGltZSgpKSAvIDEwMDA7XHJcblxyXG5cdC8vIHNlY29uZHNcclxuXHRsZXQgc2VjID0gZHQ7XHJcblx0aWYgKHNlYyA8IDYwKSB7XHJcblx0XHRyZXR1cm4gc3ByaW50ZihfdHIuZ2xvYmFsLmRpZmZfZGF0ZV9zZWNvbmRzLCBNYXRoLnJvdW5kKHNlYykpO1xyXG5cdH1cclxuXHJcblx0Ly8gbWludXRlc1xyXG5cdGxldCBtaW4gPSBNYXRoLmZsb29yKHNlYyAvIDYwKTtcclxuXHRpZiAobWluIDwgNjApIHtcclxuXHRcdHJldHVybiBzcHJpbnRmKF90ci5nbG9iYWwuZGlmZl9kYXRlX21pbnV0ZXMsIE1hdGgucm91bmQobWluKSk7XHJcblx0fVxyXG5cclxuXHQvLyBob3Vyc1xyXG5cdGxldCBocnMgPSBNYXRoLmZsb29yKG1pbiAvIDYwKTtcclxuXHRyZXR1cm4gc3ByaW50ZihfdHIuZ2xvYmFsLmRpZmZfZGF0ZV9ob3VycywgaHJzLCBtaW4gJSA2MCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlX3RvX3NxbChkYXRlOiBEYXRlLCB3aXRoSG91cnM6IGJvb2xlYW4pIHtcclxuXHJcblx0aWYgKHdpdGhIb3Vycykge1xyXG5cdFx0cmV0dXJuIGZvcm1hdEludGxEYXRlKGRhdGUsICdZLU0tRCBIOkk6UycpO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHJldHVybiBmb3JtYXRJbnRsRGF0ZShkYXRlLCAnWS1NLUQnKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBjb25zdHJ1Y3QgYSBkYXRlIGZyb20gYW4gdXRjIGRhdGUgdGltZSAoc3FsIGZvcm1hdClcclxuICogWVlZWS1NTS1ERCBISDpNTTpTU1xyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlX3NxbF91dGMoZGF0ZTogc3RyaW5nKTogRGF0ZSB7XHJcblx0bGV0IHJlc3VsdCA9IG5ldyBEYXRlKGRhdGUgKyAnIEdNVCcpO1xyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIHJldHVybiBhIG51bWJlciB0aGF0IGlzIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRhdGVcclxuICogdGhpcyBudW1iZXIgY2FuIGJlIGNvbXBhcmVkIHdpdGggYW5vdGhlciBoYXNoXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVfaGFzaChkYXRlOiBEYXRlKTogbnVtYmVyIHtcclxuXHRyZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpIDw8IDE2IHwgZGF0ZS5nZXRNb250aCgpIDw8IDggfCBkYXRlLmdldERhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHJldHVybiBhIGNvcHkgb2YgYSBkYXRlXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVfY2xvbmUoZGF0ZTogRGF0ZSk6IERhdGUge1xyXG5cdHJldHVybiBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiByZXR1cm4gdGhlIHdlZWsgbnVtYmVyIG9mIGEgZGF0ZVxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlX2NhbGNfd2Vla251bShkYXRlOiBEYXRlKTogbnVtYmVyIHtcclxuXHRjb25zdCBmaXJzdERheU9mWWVhciA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcblx0Y29uc3QgcGFzdERheXNPZlllYXIgPSAoZGF0ZS52YWx1ZU9mKCkgLSBmaXJzdERheU9mWWVhci52YWx1ZU9mKCkpIC8gODY0MDAwMDA7XHJcblx0cmV0dXJuIE1hdGguZmxvb3IoKHBhc3REYXlzT2ZZZWFyICsgZmlyc3REYXlPZlllYXIuZ2V0RGF5KCkgKyAxKSAvIDcpO1xyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBwYXJzZSBhIGRhdGUgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBmb3JtYXQgXHJcbiAqIEBwYXJhbSB2YWx1ZSAtIHN0cmluZyBkYXRlIHRvIHBhcnNlXHJcbiAqIEBwYXJhbSBmbXRzIC0gZm9ybWF0IGxpc3QgLSBpMTggdHJhbmxhdGlvbiBieSBkZWZhdWx0XHJcbiAqIGFsbG93ZWQgZm9ybWF0IHNwZWNpZmllcnM6XHJcbiAqIGQgb3IgRDogZGF0ZSAoMSBvciAyIGRpZ2l0cylcclxuICogbSBvciBNOiBtb250aCAoMSBvciAyIGRpZ2l0cylcclxuICogeSBvciBZOiB5ZWFyICgyIG9yIDQgZGlnaXRzKVxyXG4gKiBoIG9yIEg6IGhvdXJzICgxIG9yIDIgZGlnaXRzKVxyXG4gKiBpIG9yIEk6IG1pbnV0ZXMgKDEgb3IgMiBkaWdpdHMpXHJcbiAqIHMgb3IgUzogc2Vjb25kcyAoMSBvciAyIGRpZ2l0cylcclxuICogPHNwYWNlPjogMSBvciBtb3JlIHNwYWNlc1xyXG4gKiBhbnkgb3RoZXIgY2hhcjogPDAgb3IgbW9yZSBzcGFjZXM+PHRoZSBjaGFyPjwwIG9yIG1vcmUgc3BhY2VzPlxyXG4gKiBlYWNoIHNwZWNpZmllcnMgaXMgc2VwYXJhdGVkIGZyb20gb3RoZXIgYnkgYSBwaXBlICh8KVxyXG4gKiBtb3JlIHNwZWNpZmljIGF0IGZpcnN0XHJcbiAqIEBleGFtcGxlXHJcbiAqICdkL20veXxkIG0gWXxkbXl8eS1tLWQgaDppOnN8eS1tLWQnXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSW50bERhdGUodmFsdWU6IHN0cmluZywgZm10czogc3RyaW5nID0gX3RyLmdsb2JhbC5kYXRlX2lucHV0X2Zvcm1hdHMpOiBEYXRlIHtcclxuXHJcblx0bGV0IGZvcm1hdHMgPSBmbXRzLnNwbGl0KCd8Jyk7XHJcblx0Zm9yIChsZXQgZm1hdGNoIG9mIGZvcm1hdHMpIHtcclxuXHJcblx0XHQvL3JldmlldzogY291bGQgZG8gdGhhdCBvbmx5IG9uY2UgJiBrZWVwIHJlc3VsdFxyXG5cdFx0Ly9yZXZpZXc6IGFkZCBob3VycywgbWludXRlcywgc2Vjb25kc1xyXG5cclxuXHRcdGxldCBzbWF0Y2ggPSAnJztcclxuXHRcdGZvciAobGV0IGMgb2YgZm1hdGNoKSB7XHJcblxyXG5cdFx0XHRpZiAoYyA9PSAnZCcgfHwgYyA9PSAnRCcpIHtcclxuXHRcdFx0XHRzbWF0Y2ggKz0gJyg/PGRheT5cXFxcZHsxLDJ9KSc7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoYyA9PSAnbScgfHwgYyA9PSAnTScpIHtcclxuXHRcdFx0XHRzbWF0Y2ggKz0gJyg/PG1vbnRoPlxcXFxkezEsMn0pJztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjID09ICd5JyB8fCBjID09ICdZJykge1xyXG5cdFx0XHRcdHNtYXRjaCArPSAnKD88eWVhcj5cXFxcZHsxLDR9KSc7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoYyA9PSAnaCcgfHwgYyA9PSAnSCcpIHtcclxuXHRcdFx0XHRzbWF0Y2ggKz0gJyg/PGhvdXI+XFxcXGR7MSwyfSknO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGMgPT0gJ2knIHx8IGMgPT0gJ0knKSB7XHJcblx0XHRcdFx0c21hdGNoICs9ICcoPzxtaW4+XFxcXGR7MSwyfSknO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGMgPT0gJ3MnIHx8IGMgPT0gJ1MnKSB7XHJcblx0XHRcdFx0c21hdGNoICs9ICcoPzxzZWM+XFxcXGR7MSwyfSknO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGMgPT0gJyAnKSB7XHJcblx0XHRcdFx0c21hdGNoICs9ICdcXFxccysnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHNtYXRjaCArPSAnXFxcXHMqXFxcXCcgKyBjICsgJ1xcXFxzKic7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcmVtYXRjaCA9IG5ldyBSZWdFeHAoJ14nICsgc21hdGNoICsgJyQnLCAnbScpO1xyXG5cclxuXHRcdGxldCBtYXRjaCA9IHJlbWF0Y2guZXhlYyh2YWx1ZSk7XHJcblxyXG5cdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdGNvbnN0IG5vdyA9IG5ldyBEYXRlKCApO1xyXG5cclxuXHRcdFx0bGV0IGQgPSBwYXJzZUludChtYXRjaC5ncm91cHMuZGF5ID8/ICcxJyk7XHJcblx0XHRcdGxldCBtID0gcGFyc2VJbnQobWF0Y2guZ3JvdXBzLm1vbnRoID8/ICcxJyk7XHJcblx0XHRcdGxldCB5ID0gcGFyc2VJbnQobWF0Y2guZ3JvdXBzLnllYXIgPz8gbm93LmdldEZ1bGxZZWFyKCkrJycpO1xyXG5cdFx0XHRsZXQgaCA9IHBhcnNlSW50KG1hdGNoLmdyb3Vwcy5ob3VyID8/ICcwJyk7XHJcblx0XHRcdGxldCBpID0gcGFyc2VJbnQobWF0Y2guZ3JvdXBzLm1pbiA/PyAnMCcpO1xyXG5cdFx0XHRsZXQgcyA9IHBhcnNlSW50KG1hdGNoLmdyb3Vwcy5zZWMgPz8gJzAnKTtcclxuXHJcblx0XHRcdGlmICh5ID4gMCAmJiB5IDwgMTAwKSB7XHJcblx0XHRcdFx0eSArPSAyMDAwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgcmVzdWx0ID0gbmV3IERhdGUoeSwgbSAtIDEsIGQsIGgsIGksIHMsIDApO1xyXG5cclxuXHRcdFx0Ly8gd2UgdGVzdCB0aGUgdmRhdGUgdmFsaWRpdHkgKHdpdGhvdXQgYWRqdXN0bWVudHMpXHJcblx0XHRcdC8vIHdpdGhvdXQgdGhpcyB0ZXN0LCBkYXRlICggMCwgMCwgMCkgaXMgYWNjZXB0ZWQgYW5kIHRyYW5zZm9ybWVkIHRvIDE5NjkvMTEvMzEgKG5vdCBmdW4pXHJcblx0XHRcdGxldCB0eSA9IHJlc3VsdC5nZXRGdWxsWWVhcigpLFxyXG5cdFx0XHRcdHRtID0gcmVzdWx0LmdldE1vbnRoKCkgKyAxLFxyXG5cdFx0XHRcdHRkID0gcmVzdWx0LmdldERhdGUoKTtcclxuXHJcblx0XHRcdGlmICh0eSAhPSB5IHx8IHRtICE9IG0gfHwgdGQgIT0gZCkge1xyXG5cdFx0XHRcdC8vZGVidWdnZXI7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIGZvcm1hdCBhIGRhdGUgYXMgc3RyaW5nIFxyXG4gKiBAcGFyYW0gZGF0ZSAtIGRhdGUgdG8gZm9ybWF0XHJcbiAqIEBwYXJhbSBmbXQgLSBmb3JtYXQgXHJcbiAqIGZvcm1hdCBzcGVjaWZpZXJzOlxyXG4gKiBkOiBkYXRlIChubyBwYWQpXHJcbiAqIEQ6IDIgZGlnaXRzIGRhdGUgcGFkZGVkIHdpdGggMFxyXG4gKiBqOiBkYXkgb2Ygd2VlayBzaG9ydCBtb2RlICdtb24nXHJcbiAqIEo6IGRheSBvZiB3ZWVrIGxvbmcgbW9kZSAnbW9uZGF5J1xyXG4gKiB3OiB3ZWVrIG51bWJlclxyXG4gKiBtOiBtb250aCAobm8gcGFkKVxyXG4gKiBNOiAyIGRpZ2l0cyBtb250aCBwYWRkZWQgd2l0aCAwXHJcbiAqIG86IG1vbnRoIHNob3J0IG1vZGUgJ2phbidcclxuICogTzogbW9udGggbG9uZyBtb2RlICdqYW51YXJ5J1xyXG4gKiB5IG9yIFk6IHllYXJcclxuICogaDogaG91ciAoMjQgZm9ybWF0KVxyXG4gKiBIOiAyIGRpZ2l0cyBob3VyICgyNCBmb3JtYXQpIHBhZGRlZCB3aXRoIDBcclxuICogaTogbWludXRlc1xyXG4gKiBJOiAyIGRpZ2l0cyBtaW51dGVzIHBhZGRlZCB3aXRoIDBcclxuICogczogc2Vjb25kc1xyXG4gKiBTOiAyIGRpZ2l0cyBzZWNvbmRzIHBhZGRlZCB3aXRoIDBcclxuICogYTogYW0gb3IgcG1cclxuICogYW55dGhpbmcgZWxzZSBpcyBpbnNlcnRlZFxyXG4gKiBpZiB5b3UgbmVlZCB0byBpbnNlcnQgc29tZSB0ZXh0LCBwdXQgaXQgYmV0d2VlbiB7fVxyXG4gKiBcclxuICogQGV4YW1wbGVcclxuICogXHJcbiAqIDAxLzAxLzE5NzAgMTE6MjU6MDAgd2l0aCAne3RoaXMgaXMgbXkgZGVtbyBkYXRlIGZvcm1hdHRlcjogfUgtaSpNJ1xyXG4gKiBcInRoaXMgaXMgbXkgZGVtbyBkYXRlIGZvcm1hdHRlcjogMTEtMjUqamFudWFyeVwiXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEludGxEYXRlKGRhdGU6IERhdGUsIGZtdDogc3RyaW5nID0gX3RyLmdsb2JhbC5kYXRlX2Zvcm1hdCkge1xyXG5cclxuXHRpZiAoIWRhdGUpIHtcclxuXHRcdHJldHVybiAnJztcclxuXHR9XHJcblxyXG5cdGxldCBub3cgPSB7XHJcblx0XHR5ZWFyOiBkYXRlLmdldEZ1bGxZZWFyKCksXHJcblx0XHRtb250aDogZGF0ZS5nZXRNb250aCgpICsgMSxcclxuXHRcdGRheTogZGF0ZS5nZXREYXRlKCksXHJcblx0XHR3ZGF5OiBkYXRlLmdldERheSgpLFxyXG5cdFx0aG91cnM6IGRhdGUuZ2V0SG91cnMoKSxcclxuXHRcdG1pbnV0ZXM6IGRhdGUuZ2V0TWludXRlcygpLFxyXG5cdFx0c2Vjb25kczogZGF0ZS5nZXRTZWNvbmRzKCksXHJcblx0XHRtaWxsaTogZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxyXG5cdH07XHJcblxyXG5cclxuXHRsZXQgcmVzdWx0ID0gJyc7XHJcblx0bGV0IGVzYyA9IDA7XHJcblxyXG5cdGZvciAobGV0IGMgb2YgZm10KSB7XHJcblxyXG5cdFx0aWYgKGMgPT0gJ3snKSB7XHJcblx0XHRcdGlmICgrK2VzYyA9PSAxKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ30nKSB7XHJcblx0XHRcdGlmICgtLWVzYyA9PSAwKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXNjKSB7XHJcblx0XHRcdHJlc3VsdCArPSBjO1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoYyA9PSAnZCcpIHtcclxuXHRcdFx0cmVzdWx0ICs9IG5vdy5kYXk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChjID09ICdEJykge1xyXG5cdFx0XHRyZXN1bHQgKz0gcGFkKG5vdy5kYXksIC0yKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ2onKSB7IC8vIGRheSBzaG9ydFxyXG5cdFx0XHRyZXN1bHQgKz0gX3RyLmdsb2JhbC5kYXlfc2hvcnRbbm93LndkYXldO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoYyA9PSAnSicpIHsgLy8gZGF5IGxvbmdcclxuXHRcdFx0cmVzdWx0ICs9IF90ci5nbG9iYWwuZGF5X2xvbmdbbm93LndkYXldO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoYyA9PSAndycpIHtcdC8vIHdlZWtcclxuXHRcdFx0cmVzdWx0ICs9IGRhdGVfY2FsY193ZWVrbnVtKGRhdGUpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoYyA9PSAnVycpIHtcdC8vIHdlZWtcclxuXHRcdFx0cmVzdWx0ICs9IHBhZChkYXRlX2NhbGNfd2Vla251bShkYXRlKSwgLTIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoYyA9PSAnbScpIHtcclxuXHRcdFx0cmVzdWx0ICs9IG5vdy5tb250aDtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ00nKSB7XHJcblx0XHRcdHJlc3VsdCArPSBwYWQobm93Lm1vbnRoLCAtMik7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChjID09ICdvJykge1x0Ly8gbW9udGggc2hvcnRcclxuXHRcdFx0cmVzdWx0ICs9IF90ci5nbG9iYWwubW9udGhfc2hvcnRbbm93Lm1vbnRoIC0gMV07XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChjID09ICdPJykge1x0Ly8gbW9udGggbG9uZ1xyXG5cdFx0XHRyZXN1bHQgKz0gX3RyLmdsb2JhbC5tb250aF9sb25nW25vdy5tb250aCAtIDFdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoYyA9PSAneScgfHwgYyA9PSAnWScpIHtcclxuXHRcdFx0cmVzdWx0ICs9IHBhZChub3cueWVhciwgLTQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoYyA9PSAnYScgfHwgYyA9PSAnQScpIHtcclxuXHRcdFx0cmVzdWx0ICs9IG5vdy5ob3VycyA8IDEyID8gJ2FtJyA6ICdwbSc7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChjID09ICdoJykge1xyXG5cdFx0XHRyZXN1bHQgKz0gbm93LmhvdXJzO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoYyA9PSAnSCcpIHtcclxuXHRcdFx0cmVzdWx0ICs9IHBhZChub3cuaG91cnMsIC0yKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ2knKSB7XHJcblx0XHRcdHJlc3VsdCArPSBub3cubWludXRlcztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ0knKSB7XHJcblx0XHRcdHJlc3VsdCArPSBwYWQobm93Lm1pbnV0ZXMsIC0yKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ3MnKSB7XHJcblx0XHRcdHJlc3VsdCArPSBub3cuc2Vjb25kcztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ1MnKSB7XHJcblx0XHRcdHJlc3VsdCArPSBwYWQobm93LnNlY29uZHMsIC0yKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGMgPT0gJ2wnKSB7XHJcblx0XHRcdHJlc3VsdCArPSBub3cubWlsbGk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChjID09ICdMJykge1xyXG5cdFx0XHRyZXN1bHQgKz0gcGFkKG5vdy5taWxsaSwgLTMpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJlc3VsdCArPSBjO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNBZ2UoYmlydGg6IERhdGUsIHJlZj86IERhdGUpIHtcclxuXHRpZiAocmVmID09PSB1bmRlZmluZWQpIHtcclxuXHRcdHJlZiA9IG5ldyBEYXRlKCk7XHJcblx0fVxyXG5cclxuXHRpZiAoIWJpcnRoKSB7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcblxyXG5cdGxldCBhZ2UgPSByZWYuZ2V0RnVsbFllYXIoKSAtIGJpcnRoLmdldEZ1bGxZZWFyKCk7XHJcblx0aWYgKHJlZi5nZXRNb250aCgpIDwgYmlydGguZ2V0TW9udGgoKSB8fCAocmVmLmdldE1vbnRoKCkgPT0gYmlydGguZ2V0TW9udGgoKSAmJiByZWYuZ2V0RGF0ZSgpIDwgYmlydGguZ2V0RGF0ZSgpKSkge1xyXG5cdFx0YWdlLS07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gYWdlO1xyXG59XHJcblxyXG5cclxuLy8gOjogTUlTQyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJlZXAoICkge1xyXG4gXHRjb25zdCBzbmQgPSBuZXcgQXVkaW8oXCJkYXRhOmF1ZGlvL3dhdjtiYXNlNjQsLy91UVJBQUFBV01TTHdVSVlBQXNZa1hnb1F3QUVhWUxXZmtXZ0FJMHdXcy9JdEFBQUdEZ1l0QWdBeU4rUVdhQUFpaHdNV200RzhRUVJEaU1jQ0JjSDNDYytDRHYvN3hBNFR2aDlSei95OFFBREJ3TVdnUUFaRy9JTE5BQVJRNEdMVGNEZUlJSWh4R09CQXVEN2hPZkJCMy85NGdjSjN3K281LzVlSUFJQUFBVndXZ1FBVlEyT1JhSVF3RU1BSmlEZzk1RzRuUUw3bVFWV0k2R3dSY2ZzWkFjc0trSnZ4Z3hFanpGVWdmSG9TUTlRcTdLTndxSHd1QjEzTUE0YTFxL0RtQnJIZ1BjbWppR29oLy9Fd0M1bkdQRW1TNFJjZmtWS09oSmYrV09nb3hKY2xGejNrZ24vL2RCQSt5YTFHaHVyTm44emIvLzlOTnV0TnVoejMxZi8vLy85dnQvLy96K0lkQUVBQUFLNExRSUFLb2JISXRFSVlDR0FFeEJ3ZThqY1RvRjl6SUtyRWREWUl1UDJNZ09XRlNFMzR3WWlSNWlxUVBqMEpJZW9WZGxHNFZENFhBNjdtQWNOYTFmaHpBMWp3SHVUUnhEVVEvL2lZQmN6akhpVEpjSXVQeUtsSFFrdi9MSFFVWWt1U2k1N3lRVC8vdWdnZlpOYWpRM1ZteitadC8vK21tM1dtM1E1NzZ2Ly8vLyszMi8vLzUvRU9nQUFBRFZnaFFBQUFBQS8vdVFaQVVBQjFXSTBQWnVnQUFBQUFvUXdBQUFFazNuUmQycUFBQUFBQ2lEZ0FBQUFBQUFCQ3FFRVFSTENnd3BCR01sSmtJejhqS2hHdmo0azZqelJucWFzTktJZW9oNWdJN0JKYUMxQTFBb05CakpnYnlBcFZTNElEbFpnRFU1V1VBeEVLRE5tbUFMSHpacDBGa3oxRk1UbUdGbDFGTUV5b2RJYXZjQ0FVSERXcktBSUE0YWEyb0NnSUxFQnVwWmdIdkFoRUJjWjZqb1FCeFM3NkFnY2NyRmxjekJ2S0xDMFFJMmNCb0NGdmZUREFvN2VvT1FJbnFEUEJ0dnJERVpCTllONXh3Tnd4UVJmdzhaUTV3UVZMdk84T1lVK21IdkZMbERoMDVNZGc3QlQ2WXJSUHBDQnpuTUIyci8veEtKanl5T2grY0ltcjIvNGRvc2N3RDZuZVpqdVpSNEFnQUFCWUFBQUFCeTF4Y2RRdHhZQllZWmRpZmtVRGd6elhhWG45OFowb2k5SUxVNW1CakZBTm1Sd2xWSjMvNmpZREFteGFpREczLzZ4alFRQ0NLa1JiLzZrZy93VytrU0o1Ly9yTG9ia0xTaUttcVAvMGlrSnVEYVNhU2YvNkppTFlMRVluVy8ra1hnMVdSVkpMLzlFbVExWVpJc3YvNlF6d3k1cWs3Lyt0RVUwbmtsczMveklVTVBLTlgvNnlaTGYra0ZnQWZnR3lMRkFVd1kvL3VRWkFVQUJjZDVVaU5QVlhBQUFBcEFBQUFBRTBWWlFLdzlJU0FBQUNnQUFBQUFWUUl5Z0lFbFZyRmtCUytKaGkrRUF1dStsS0FrWVVFSXNtRUFFb01lRG1DRVRNdmZTSFRHa0Y1UldIN2t6L0VTSFdQQXEva2NDUmhxQnRNZG9rUGRNN3ZpbDdSRzk4QTJzYzd6TzZadlRkTTdwbU9VQVpUbkpXK05YeHFtZDQxZHFKNm1MVFh4clBwblY4YXZhSWY1U3ZMN3BuZFB2UHBuZEpSOUt1dThmZVB2dWl1aG9yZ1dqcDdNZi9QUmp4Y0ZDUERrVzMxc3Jpb0NFeGl2djlsY3dLRWFIc2YvN293MkZsMVQvOVJrWGdFaFlFbEFvQ0xGdE1Bcnh3aXZESkorYlIxSFRLSmRsRW9URUxDSXFnRXdWR1NRK2hJbTBOYks4V1hjVEVJMFVQb2EyTmJHNHkySzAwSkVXYlphdkpYa1lhcW85Q1JIUzU1RmNaVGpLRWszTktvQ1lVblNRMHJXeHJaYkZLYktJaE9LUFplMWNKS3paU2FRckl5VUxIRFptVjVLNHh5U3NEUktXT3J1YW5HdGpMSlhGRW13YUliRExYMGhJUEJVUVBWRlZrUWtEb1VOZlNvRGdRR0tQZWtveGVHekE0RFV2bm40Ynh6Y1pydEp5aXBLZlBOeTV3Kzlsblh3Z3FzaXlITmVTVnBlbXc0YldiOXBzWWVxLy91UVpCb0FCUXQ0eU1WeFlBSUFBQWtRb0FBQUh2WXBMNW02QUFnQUFDWERBQUFBRDU5amJsVGlyUWU5dXBGc21aYnBNdWR5N0x6MVgxRFlzeE9PU1dwZlBxTlgyV3FrdEswRE12dUd3bGJOajQ0VGxlTFBRK0dzZmIrR09XT0tKb0lyV2IzY0lNZWVPTjZsejJ1bVRxTVhWOE1qMzB5V1Bwam9TYTl1aks4U3llSlA1eTVtT1cxRDZodkxlcGV2ZUVBRURvMG1nQ1JDbE9FZ0FOdjNCOWE2ZmlrZ1VTdS9EbUFNQVRyR3g3bm5nNXA1aWltUE5ac2ZRTFlCMnNETElrelJLWk9IR0FhVXlEY3BGQlNMRzlNQ1FBTGdBSWdRczJZdW5Pc3pMU0F5UVlQVkMyWWRHR2VIRDJkVGRKazFwQUhHQVdEam5rY0xLRnltUzNSUVpUSW56eVNvQndNRzBRdWVDM2dNc0NFWXhVcWxyY3hLNmsxTFFRY3NteVllUVBkQzJZZnVHUEFTQ0JrY1ZNUVFxcFZKc2h1aTF0a1hRSlFWME9YR0FaTVhTT0VFQlJpclhiVlJRVzd1Z3E3SU03clBXU1p5RGxNM0l1TkVreHpDT0owbnkyVGhOa3lSYWkxYjZldi8vM2R6Tkd6TmIvLzR1QXZIVDVzVVJjWkNGY3VLTGhPRnM4bUxBQUVBdDRVV0FBSUFCQUFBQUFCNHFiSG8wdElqVmtVVS8vdVFaQXdBQmZTRnozWnFRQUFBQUFuZ3dBQUFFMUhqTXAycUFBQUFBQ1pEZ0FBQUQ1VWtURTFVZ1pFVUV4cVl5bk4xcVp2cUlPUkVFRm1CY0pRa3dkeGlGdHcwcUVPa0dZZlJEaWZCdWk5TVFnNFFBSEFxV3RBV0hvQ3h1MVlmNFZmV0xQSU0ybUhERnNiUUVWR3d5cVFvUWN3bmZIZUlrTnQ5WW5raWFTMW9penljcUpyeDRLT1FqYWhaeFdiY1pnenRqMmM0OW5LbWtJZDQ0UzcxajBjOGVWOXlESzZ1UFJ6eDVYMThlRHZqdlE2eUtvOVpTUzZsLy84ZWxlUEsvTGYvL0lJbnJPRi9GdkRvQURZQUdCTUdiN0Z0RXJtNU1YTWxtUEFKUVZnV3RhN1p4MmdvKzh4SjBVaUNiOExISGRmdFd5TEpFMFFJQUlzSStVYlh1NjdkWk1qbWdER0NHbDFIK3ZwRjROU0Rja1NJa2s3VmQrc3hFaEJRTVJVOGovMTJVSVJoelNhVWRRK3JRVTVrR2VGeG0raGIxb2g2cFdXbXYzdXZtUmVEbDBVbnZ0YXBWYUl6bzFqWmJmL3BENkVsTHFTWCtyVW1PUU5wSkZhL3Irc2E0ZS9wQmxBQUJvQUFBQUEzQ1VnU2hMZEdJeHNZN0FVQUJQUnJnQ0FCZER1UTVHQzdEcVBRQ2diYkpVQW9SU1VqK05JRWlnMFlmeVdVaG8xVkJCQkEvL3VRWkI0QUJaeDV6Zk1ha2VBQUFBbXdBQUFBRjVGM1AwdzlHdEFBQUNmQUFBQUF3TGhNRG1BWVdNZ1ZFRzFVMEZJR0NCZ1hCWEF0Zk1IMTAwMDBFRUVFRUVDVUJZbG4wM1RUVGROQkRab3BvcFl2clRUZE5hMzI1bUltTmczVFRQVjlxM3BtWTB4b082YnYzcjAweStJREdpZC85YWFhWlRHTXVqOW1wdTlNcGlvMWRYcnI1SEVSVFpTbXFVMzZBM0N1bXpOLzlSb2J2L1h4NHY5aWprU1JTTkxRaEFXdW1hcDgyV1JTQlVxWFN0Vi9ZY1MrWFZMblNTK1dMRHJvcUFyRmtNRXNBUytlV21yVXpyTzBvRW1FNDBSbE1aNStPRElrQXlLQUdVd1ozbVZLbWNhbWNKbk1XMjZNUlBnVXc2aitMa2h5SEdWR1lqU1VVS05wdUpVUW9PSUF5RHZFeUc4UzV5Zks2ZGhaYzBUeDFLSS9ndmlLTDZxdnZGczErYld0YXo1OHVVTm5yeXE2a3Q1UnpPQ2tQV2xWcVZYMmEvRUVCVWRVMUtyWExmNDBHb2lpRlhLLy8vcXBvaURYck9ncURSMzhKQjBidzdTb0wrWkI5bzFSQ2tRalEyQ0JZWktkLytWSnhaUlJabHFTa0tpd3MwV0Z4VXlDd3NLaU15N2hVVkZoSWFDck5Rc0trVElzTGl2d0tLaWdzajhYWWx3dC9XS2kyTjRkLy91UVJDU0FBalVSTklIcE1aQkdZaWFRUFNZeUFBQUJMQUFBQUFBQUFDV0FBQUFBcFVGL01nKzBhb2hTSVJvYkJBc01sTy8vS2s0c29vc3kxSlNGUllXYUxDNHFaQllXRlJHWmR3cUtpd2tOQlZtb1dGU0prV0Z4WDRGRlJRV1IrTHNTNFcvckZSYi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1ZFRkhBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBVTI5MWJtUmliM2t1WkdVQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFNakF3TkdoMGRIQTZMeTkzZDNjdWMyOTFibVJpYjNrdVpHVUFBQUFBQUFBQUFDVT1cIik7ICBcclxuICAgIHNuZC5wbGF5KCk7XHJcbn1cclxuXHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBjb3JlX2V2ZW50cy50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb3JlRWxlbWVudCB9IGZyb20gJy4vY29yZV9lbGVtZW50JztcclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvcmVFdmVudCB7XHJcblx0cmVhZG9ubHkgdHlwZT86IHN0cmluZztcdFx0XHQvLyB0eXBlIG9mIHRoZSBldmVudCAnY2xpY2snLCAnY2hhbmdlJywgLi4uXHJcblx0cmVhZG9ubHkgc291cmNlPzogQ29yZUVsZW1lbnQ7XHQvLyBvYmplY3QgdGhhdCBmaXJlcyB0aGUgZXZlbnRcclxuXHRyZWFkb25seSBjb250ZXh0PzogYW55O1x0XHRcdC8vIGNvbnRleHR1YWwgZGF0YSwgbGVmdCB0byB0aGUgdXNlclxyXG5cclxuXHRwcm9wYWdhdGlvblN0b3BwZWQ/OiBib29sZWFuO1x0Ly8gaWYgdHJ1ZSwgZG8gbm90IHByb3BhZ2F0ZSB0aGUgZXZlbnRcclxuXHRkZWZhdWx0UHJldmVudGVkPzogYm9vbGVhbjtcdFx0Ly8gaWYgdHJ1ZSwgZG8gbm90IGNhbGwgZGVmYXVsdCBoYW5kbGVyIChpZiBhbnkpXHJcblxyXG5cdHN0b3BQcm9wYWdhdGlvbj8oKTogdm9pZDtcdFx0Ly8gc3RvcCB0aGUgcHJvcGFnYXRpb25cclxuXHRwcmV2ZW50RGVmYXVsdD8oKTogdm9pZDtcdFx0Ly8gcHJldmVudCB0aGUgZGVmYXVsdCBoYW5kbGVyXHJcbn1cclxuXHJcbi8vIGRlZmF1bHQgc3RvcFByb3BhZ2F0aW9uIGltcGxlbWVudGF0aW9uIGZvciBFdmVudHNcclxuY29uc3Qgc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCB0aGlzOiBDb3JlRXZlbnQgKSB7XHJcblx0dGhpcy5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG59XHJcblxyXG4vLyBkZWZhdWx0IHByZXZlbnREZWZhdWx0IGltcGxlbWVudGF0aW9uIGZvciBFdmVudHNcclxuY29uc3QgcHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiAoIHRoaXM6IENvcmVFdmVudCApIHtcclxuXHR0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRNYXAge1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IHR5cGUgRXZlbnRDYWxsYmFjazxUIGV4dGVuZHMgQ29yZUV2ZW50ID0gQ29yZUV2ZW50PiA9IChldmVudDogVCkgPT4gYW55O1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudFNvdXJjZTxFIGV4dGVuZHMgRXZlbnRNYXAgPSBFdmVudE1hcCA+IHtcclxuXHJcblx0cHJpdmF0ZSBfc291cmNlOiB1bmtub3duO1xyXG5cdHByaXZhdGUgX3JlZ2lzdHJ5OiBNYXA8c3RyaW5nLEV2ZW50Q2FsbGJhY2tbXT47XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogdW5rbm93biA9IG51bGwpIHtcclxuXHRcdHRoaXMuX3NvdXJjZSA9IHNvdXJjZSA/PyB0aGlzO1xyXG5cdH1cclxuXHJcblx0YWRkTGlzdGVuZXI8SyBleHRlbmRzIGtleW9mIEU+KCBuYW1lOiBLLCBjYWxsYmFjazogKCBldjogRVtLXSApID0+IHZvaWQsIGNhcHR1cmluZyA9IGZhbHNlICkge1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuX3JlZ2lzdHJ5KSB7XHJcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9yZWdpc3RyeS5nZXQobmFtZSBhcyBzdHJpbmcpO1xyXG5cdFx0aWYgKCFsaXN0ZW5lcnMpIHtcclxuXHRcdFx0bGlzdGVuZXJzID0gW107XHJcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5LnNldChuYW1lIGFzIHN0cmluZywgbGlzdGVuZXJzKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjYiA9IGNhbGxiYWNrIGFzIEV2ZW50Q2FsbGJhY2s7XHJcblxyXG5cdFx0aWYgKGxpc3RlbmVycy5pbmRleE9mKGNiKSA9PSAtMSkge1xyXG5cdFx0XHRpZiAoY2FwdHVyaW5nKSB7XHJcblx0XHRcdFx0bGlzdGVuZXJzLnVuc2hpZnQoY2IpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGxpc3RlbmVycy5wdXNoKGNiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZmlyZTxLIGV4dGVuZHMga2V5b2YgRT4obmFtZTogSywgZXZ4OiBFW0tdKSB7XHJcblx0XHRcclxuXHRcdGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9yZWdpc3RyeT8uZ2V0KG5hbWUgYXMgc3RyaW5nKTtcclxuXHRcdC8vY29uc3QgZGVmYXVsdEhhbmRsZXIgPSB0aGlzLm1fZGVmYXVsdEhhbmRsZXJzPy5nZXQoZXZlbnROYW1lKTtcclxuXHJcblx0XHRpZiAobGlzdGVuZXJzICYmIGxpc3RlbmVycy5sZW5ndGgpIHtcclxuXHRcdFx0bGV0IGV2ID0gZXZ4IGFzIENvcmVFdmVudDtcclxuXHRcdFx0aWYgKCFldikge1xyXG5cdFx0XHRcdGV2ID0ge307XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghZXYuc291cmNlKSB7XHJcblx0XHRcdFx0Ly8gcmVhZG9ubHlcclxuXHRcdFx0XHQoZXYgYXMgYW55KS5zb3VyY2UgPSB0aGlzLl9zb3VyY2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghZXYudHlwZSkge1xyXG5cdFx0XHRcdC8vIHJlYWRvbmx5XHJcblx0XHRcdFx0KGV2IGFzIGFueSkudHlwZSA9IG5hbWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIWV2LnByZXZlbnREZWZhdWx0KSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQgPSBwcmV2ZW50RGVmYXVsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCFldi5zdG9wUHJvcGFnYXRpb24pIHtcclxuXHRcdFx0XHRldi5zdG9wUHJvcGFnYXRpb24gPSBzdG9wUHJvcGFnYXRpb247XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHNtYWxsIG9wdGltaXNhdGlvblxyXG5cdFx0XHRpZiAobGlzdGVuZXJzLmxlbmd0aCA9PSAxKSB7XHJcblx0XHRcdFx0bGlzdGVuZXJzWzBdKGV2KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRjb25zdCB0ZW1wID0gbGlzdGVuZXJzLnNsaWNlKCk7XHJcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIG4gPSB0ZW1wLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdFx0dGVtcFtpXShldik7XHJcblx0XHRcdFx0XHRpZiAoZXYucHJvcGFnYXRpb25TdG9wcGVkKSB7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vaWYgKGRlZmF1bHRIYW5kbGVyICYmIGRlZmF1bHRIYW5kbGVyLmxlbmd0aCAmJiAhZS5kZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHQvL1x0cmV0dXJuIGRlZmF1bHRIYW5kbGVyWzBdKGUpO1xyXG5cdFx0Ly99XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgY29yZV9lbGVtZW50LnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IEV2ZW50TWFwLCBFdmVudFNvdXJjZSB9IGZyb20gJy4vY29yZV9ldmVudHMuanMnO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JlRWxlbWVudDxFIGV4dGVuZHMgRXZlbnRNYXAgPSBFdmVudE1hcD4ge1xyXG5cclxuXHQjZXZlbnRzOiBFdmVudFNvdXJjZTxFPjtcclxuXHQjdGltZXJzOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj47XHJcblxyXG5cdHByaXZhdGUgX19zdGFydFRpbWVyKCBuYW1lOiBzdHJpbmcsIG1zOiBudW1iZXIsIHJlcGVhdDogYm9vbGVhbiwgY2FsbGJhY2s6ICggKSA9PiB2b2lkICkge1xyXG5cdFx0aWYgKCF0aGlzLiN0aW1lcnMpIHtcclxuXHRcdFx0dGhpcy4jdGltZXJzID0gbmV3IE1hcCgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuX19zdG9wVGltZXIobmFtZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaWQgPSAocmVwZWF0ID8gc2V0SW50ZXJ2YWwgOiBzZXRUaW1lb3V0KSggY2FsbGJhY2ssIG1zICk7XHJcblxyXG5cdFx0dGhpcy4jdGltZXJzLnNldChuYW1lLCAoKSA9PiB7IFxyXG5cdFx0XHQocmVwZWF0ID8gY2xlYXJJbnRlcnZhbCA6IGNsZWFyVGltZW91dCkoaWQpOyBcclxuXHRcdFx0dGhpcy4jdGltZXJzLmRlbGV0ZShuYW1lKSBcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfX3N0b3BUaW1lciggbmFtZTogc3RyaW5nICkge1xyXG5cdFx0Y29uc3QgY2xlYXIgPSB0aGlzLiN0aW1lcnMuZ2V0KG5hbWUpO1xyXG5cdFx0aWYgKGNsZWFyKSB7IGNsZWFyKCk7IH1cclxuXHR9XHJcblxyXG5cdHNldFRpbWVvdXQoIG5hbWU6IHN0cmluZywgbXM6IG51bWJlciwgY2FsbGJhY2s6ICgpID0+IHZvaWQgKSB7XHJcblx0XHR0aGlzLl9fc3RhcnRUaW1lciggbmFtZSwgbXMsIGZhbHNlLCBjYWxsYmFjayApO1xyXG5cdH1cclxuXHJcblx0Y2xlYXJUaW1lb3V0KCBuYW1lOiBzdHJpbmcgKSB7XHJcblx0XHR0aGlzLl9fc3RvcFRpbWVyKCBuYW1lICk7XHJcblx0fVxyXG5cclxuXHRzZXRJbnRlcnZhbCggbmFtZTogc3RyaW5nLCBtczogbnVtYmVyLCBjYWxsYmFjazogKCApID0+IHZvaWQgKSB7XHJcblx0XHR0aGlzLl9fc3RhcnRUaW1lciggbmFtZSwgbXMsIHRydWUsIGNhbGxiYWNrICk7XHJcblx0fVxyXG5cclxuXHRjbGVhckludGVydmFsKCBuYW1lOiBzdHJpbmcgKSB7XHJcblx0XHR0aGlzLl9fc3RvcFRpbWVyKCBuYW1lICk7XHJcblx0fVxyXG5cclxuXHRjbGVhclRpbWVvdXRzKCApIHtcclxuXHRcdGZvciggY29uc3QgW2lkLHZhbF0gb2YgdGhpcy4jdGltZXJzICkge1xyXG5cdFx0XHR2YWwoICk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuI3RpbWVycy5jbGVhciggKTtcclxuXHR9XHJcblxyXG5cdC8vIDo6IEVWRU5UUyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG5cclxuXHQvKipcclxuXHQgKiBhdHRhY2ggdG8gYW4gZXZlbnRcclxuXHQgKi9cclxuXHJcblx0b248SyBleHRlbmRzIGtleW9mIEU+KCBuYW1lOiBLLCBsaXN0ZW5lcjogKCBldjogRVtLXSApID0+IHZvaWQgKSB7XHJcblx0XHRjb25zb2xlLmFzc2VydCggbGlzdGVuZXIhPT11bmRlZmluZWQgJiYgbGlzdGVuZXIhPT1udWxsICk7XHJcblxyXG5cdFx0aWYoICF0aGlzLiNldmVudHMgKSB7XHJcblx0XHRcdHRoaXMuI2V2ZW50cyA9IG5ldyBFdmVudFNvdXJjZSggdGhpcyApO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLiNldmVudHMuYWRkTGlzdGVuZXIoIG5hbWUsIGxpc3RlbmVyICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0ZmlyZTxLIGV4dGVuZHMga2V5b2YgRT4oIG5hbWU6IEssIGV2OiBFW0tdICkge1xyXG5cdFx0aWYoIHRoaXMuI2V2ZW50cyApIHtcclxuXHRcdFx0dGhpcy4jZXZlbnRzLmZpcmUoIG5hbWUsIGV2ICk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIGNvcmVfc3R5bGVzLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IHBhc2NhbENhc2UsIGlzU3RyaW5nIH0gZnJvbSAnLi9jb3JlX3Rvb2xzLmpzJztcclxuXHJcbmV4cG9ydCBjb25zdCB1bml0bGVzczogUmVjb3JkPHN0cmluZywxPiA9IHtcclxuXHRhbmltYXRpb25JdGVyYXRpb25Db3VudDogMSxcclxuXHRhc3BlY3RSYXRpbzogMSxcclxuXHRib3JkZXJJbWFnZU91dHNldDogMSxcclxuXHRib3JkZXJJbWFnZVNsaWNlOiAxLFxyXG5cdGJvcmRlckltYWdlV2lkdGg6IDEsXHJcblx0Ym94RmxleDogMSxcclxuXHRib3hGbGV4R3JvdXA6IDEsXHJcblx0Ym94T3JkaW5hbEdyb3VwOiAxLFxyXG5cdGNvbHVtbkNvdW50OiAxLFxyXG5cdGNvbHVtbnM6IDEsXHJcblx0ZmxleDogMSxcclxuXHRmbGV4R3JvdzogMSxcclxuXHRmbGV4UG9zaXRpdmU6IDEsXHJcblx0ZmxleFNocmluazogMSxcclxuXHRmbGV4TmVnYXRpdmU6IDEsXHJcblx0ZmxleE9yZGVyOiAxLFxyXG5cdGdyaWRSb3c6IDEsXHJcblx0Z3JpZFJvd0VuZDogMSxcclxuXHRncmlkUm93U3BhbjogMSxcclxuXHRncmlkUm93U3RhcnQ6IDEsXHJcblx0Z3JpZENvbHVtbjogMSxcclxuXHRncmlkQ29sdW1uRW5kOiAxLFxyXG5cdGdyaWRDb2x1bW5TcGFuOiAxLFxyXG5cdGdyaWRDb2x1bW5TdGFydDogMSxcclxuXHRtc0dyaWRSb3c6IDEsXHJcblx0bXNHcmlkUm93U3BhbjogMSxcclxuXHRtc0dyaWRDb2x1bW46IDEsXHJcblx0bXNHcmlkQ29sdW1uU3BhbjogMSxcclxuXHRmb250V2VpZ2h0OiAxLFxyXG5cdGxpbmVIZWlnaHQ6IDEsXHJcblx0b3BhY2l0eTogMSxcclxuXHRvcmRlcjogMSxcclxuXHRvcnBoYW5zOiAxLFxyXG5cdHRhYlNpemU6IDEsXHJcblx0d2lkb3dzOiAxLFxyXG5cdHpJbmRleDogMSxcclxuXHR6b29tOiAxLFxyXG5cdFdlYmtpdExpbmVDbGFtcDogMSxcclxuICBcclxuXHQvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXHJcblx0ZmlsbE9wYWNpdHk6IDEsXHJcblx0Zmxvb2RPcGFjaXR5OiAxLFxyXG5cdHN0b3BPcGFjaXR5OiAxLFxyXG5cdHN0cm9rZURhc2hhcnJheTogMSxcclxuXHRzdHJva2VEYXNob2Zmc2V0OiAxLFxyXG5cdHN0cm9rZU1pdGVybGltaXQ6IDEsXHJcblx0c3Ryb2tlT3BhY2l0eTogMSxcclxuXHRzdHJva2VXaWR0aDogMVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBhcmlhVmFsdWVzID0ge1xyXG5cdFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCI6IDEsXHJcblx0XCJyb2xlXCI6IDEsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1VuaXRMZXNzKCBuYW1lOiBzdHJpbmcgKSB7XHJcblx0cmV0dXJuIHVuaXRsZXNzW25hbWVdID8gdHJ1ZSA6IGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0eWxlc2hlZXQge1xyXG5cclxuXHRwcml2YXRlIG1fc2hlZXQ6IENTU1N0eWxlU2hlZXQ7XHJcblx0cHJpdmF0ZSBtX3J1bGVzOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCggKTtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRcclxuXHRcdGZ1bmN0aW9uIGdldFN0eWxlU2hlZXQoIG5hbWU6IHN0cmluZyApIDogQ1NTU3R5bGVTaGVldCB7XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdCAgXHRsZXQgc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcclxuXHRcdFx0ICBcdGlmKHNoZWV0LnRpdGxlID09PSBuYW1lICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIDxDU1NTdHlsZVNoZWV0PnNoZWV0O1xyXG5cdFx0XHQgIFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5tX3NoZWV0ID0gZ2V0U3R5bGVTaGVldCggJ3g0LWR5bmFtaWMtY3NzJyApO1xyXG5cdFx0aWYoICF0aGlzLm1fc2hlZXQgKSB7XHJcblx0XHRcdGNvbnN0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzdHlsZScgKTtcclxuXHRcdFx0ZG9tLnNldEF0dHJpYnV0ZSgnaWQnLCAneDQtZHluYW1pYy1jc3MnICk7XHJcblx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZG9tKTtcclxuXHRcdFx0dGhpcy5tX3NoZWV0ID0gPENTU1N0eWxlU2hlZXQ+ZG9tLnNoZWV0XHJcblx0XHR9XHJcblx0fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGEgbmV3IHJ1bGUgdG8gdGhlIHN0eWxlIHNoZWV0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIGludGVybmFsIHJ1bGUgbmFtZSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkZWZpbml0aW9uIC0gY3NzIGRlZmluaXRpb24gb2YgdGhlIHJ1bGUgXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogc2V0UnVsZSgneGJvZHknLCBcImJvZHkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwOyB9XCIgKTtcclxuICAgICAqL1xyXG5cclxuXHRwdWJsaWMgc2V0UnVsZShuYW1lOiBzdHJpbmcsIGRlZmluaXRpb246IGFueSApIHtcclxuXHJcblx0XHRpZiggaXNTdHJpbmcoZGVmaW5pdGlvbikgKSB7XHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMubV9ydWxlcy5nZXQoIG5hbWUgKTtcclxuXHRcdFx0aWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHR0aGlzLm1fc2hlZXQuZGVsZXRlUnVsZShpbmRleCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aW5kZXggPSB0aGlzLm1fc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm1fcnVsZXMuc2V0KCBuYW1lLCB0aGlzLm1fc2hlZXQuaW5zZXJ0UnVsZSggZGVmaW5pdGlvbiwgaW5kZXgpICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bGV0IGlkeCA9IDE7XHJcblx0XHRcdGZvciggbGV0IHIgaW4gZGVmaW5pdGlvbiApIHtcclxuXHJcblx0XHRcdFx0bGV0IHJ1bGUgPSByICsgXCIgeyBcIixcclxuXHRcdFx0XHRcdGNzcyA9IGRlZmluaXRpb25bcl07XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IGkgaW4gY3NzKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGxldCB2YWx1ZXMgPSBjc3NbaV07XHQvLyB0aGlzIGlzIGFuIGFycmF5ICFcclxuXHRcdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdmFsdWVzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdHJ1bGUgKz0gaSArIFwiOiBcIiArIHZhbHVlc1tqXSArIFwiOyBcIlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cnVsZSArPSAnfSc7XHJcblxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coIHJ1bGUgKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLnNldFJ1bGUoIG5hbWUrJy0tJytpZHgsIHJ1bGUgKTtcclxuXHRcdFx0XHRpZHgrKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogcmV0dXJuIHRoZSBzdHlsZSB2YXJpYWJsZSB2YWx1ZVxyXG5cdCAqIEBwYXJhbSBuYW1lIC0gdmFyaWFibGUgbmFtZSBcclxuXHQgKiBAZXhhbXBsZVxyXG5cdCAqIGBgYFxyXG5cdCAqIGxldCBjb2xvciA9IENvbXBvbmVudC5nZXRDc3MoICkuZ2V0VmFyKCAnYnV0dG9uLWNvbG9yJyApO1xyXG5cdCAqIGBgYFxyXG5cdCAqL1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIGdldFZhciggbmFtZTogc3RyaW5nICkgOiBhbnkge1xyXG5cdFx0aWYoICFTdHlsZXNoZWV0LmRvY19zdHlsZSApIHtcclxuXHRcdFx0U3R5bGVzaGVldC5kb2Nfc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggIW5hbWUuc3RhcnRzV2l0aCgnLS0nKSApIHtcclxuXHRcdFx0bmFtZSA9ICctLScrbmFtZTtcclxuXHRcdH1cclxuXHJcbiAgICBcdHJldHVybiBTdHlsZXNoZWV0LmRvY19zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCBuYW1lICk7IC8vICM5OTk5OTlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBndWlkOiBudW1iZXIgPSAxO1xyXG5cdHN0YXRpYyBkb2Nfc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcHV0ZWRTdHlsZSB7XHJcblx0bV9zdHlsZTpDU1NTdHlsZURlY2xhcmF0aW9uO1xyXG5cclxuXHRjb25zdHJ1Y3Rvciggc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gKSB7XHJcblx0XHR0aGlzLm1fc3R5bGUgPSBzdHlsZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIHJldHVybiB0aGUgcmF3IHZhbHVlXHJcblx0ICovXHJcblxyXG5cdHZhbHVlKCBuYW1lOiBrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uICkgOiBhbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMubV9zdHlsZVtuYW1lXTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIHJldHVybiB0aGUgaW50ZXJwcmV0ZWQgdmFsdWVcclxuXHQgKi9cclxuXHRcclxuXHRwYXJzZSggbmFtZToga2V5b2YgQ1NTU3R5bGVEZWNsYXJhdGlvbiApIDogbnVtYmVyIHtcclxuXHRcdHJldHVybiBwYXJzZUludCggdGhpcy5tX3N0eWxlW25hbWVdIGFzIGFueSAgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRnZXQgc3R5bGUoICkge1xyXG5cdFx0cmV0dXJuIHRoaXMubV9zdHlsZTtcclxuXHR9XHJcbn1cclxuXHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBjb3JlX2RvbS50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG4vKiogQGlnbm9yZSB0aGlzIGV2ZW50cyBtdXN0IGJlIGRlZmluZWQgb24gZG9tTm9kZSAoZG8gbm90IGJ1YmJsZSkgKi9cclxuZXhwb3J0IGNvbnN0IHVuYnViYmxlRXZlbnRzID0ge1xyXG5cdG1vdXNlbGVhdmU6IDEsIG1vdXNlZW50ZXI6IDEsIGxvYWQ6IDEsIHVubG9hZDogMSwgc2Nyb2xsOiAxLCBmb2N1czogMSwgYmx1cjogMSwgcm93ZXhpdDogMSwgYmVmb3JldW5sb2FkOiAxLCBzdG9wOiAxLFxyXG5cdGRyYWdkcm9wOiAxLCBkcmFnZW50ZXI6IDEsIGRyYWdleGl0OiAxLCBkcmFnZ2VzdHVyZTogMSwgZHJhZ292ZXI6IDEsIGNvbnRleHRtZW51OiAxLCBjcmVhdGVkOiAyLCByZW1vdmVkOiAyLCBzaXplY2hhbmdlOiAyXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBET01FdmVudEhhbmRsZXIgPSAoIGV2OiBFdmVudCApID0+IHZvaWQ7XHJcbnR5cGUgRXZlbnRFbnRyeSA9IFJlY29yZDxzdHJpbmcsRE9NRXZlbnRIYW5kbGVyIHwgRE9NRXZlbnRIYW5kbGVyW10+O1xyXG5cclxuY29uc3QgZXZlbnRfaGFuZGxlcnMgPSBuZXcgV2Vha01hcDxOb2RlLEV2ZW50RW50cnk+KCApO1xyXG5cclxuLyoqXHJcbiAqIGhhbmRsZSBkb20gbXV0YXRpb25zXHJcbiAqL1xyXG5cclxubGV0IG11dE9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyID0gbnVsbDtcclxuXHJcbmNvbnN0IG9ic2VydmVNdXRhdGlvbiA9IChtdXRhdGlvbnM6IE11dGF0aW9uUmVjb3JkW10sIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyKTogdm9pZCA9PiB7XHJcblxyXG5cdGNvbnN0IHNlbmRFdmVudCA9ICggbm9kZTogTm9kZSwgY29kZTogXCJjcmVhdGVkXCIgfCBcInJlbW92ZWRcIiApID0+IHtcclxuLy9cdFx0Y29uc29sZS5sb2coIFwibm90aWZ5XCIsIG5vZGUsIGNvZGUgKTtcclxuXHRcdFx0XHJcblx0XHRjb25zdCBzdG9yZSA9IGV2ZW50X2hhbmRsZXJzLmdldCggbm9kZSApO1xyXG5cdFx0aWYgKCBzdG9yZSAmJiBzdG9yZVtjb2RlXSApIHtcclxuXHRcdFx0bm9kZS5kaXNwYXRjaEV2ZW50KCBuZXcgRXZlbnQoIGNvZGUsIHt9ICkgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0IG5vdGlmeSA9ICggbm9kZTogTm9kZSwgY3JlYXRlOiBib29sZWFuICkgPT4ge1xyXG5cclxuXHRcdGlmKCBjcmVhdGUgKSB7XHJcblx0XHRcdHNlbmRFdmVudCggbm9kZSwgXCJjcmVhdGVkXCIgKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IoIGxldCBjPW5vZGUuZmlyc3RDaGlsZDsgYzsgYz1jLm5leHRTaWJsaW5nICkge1xyXG5cdFx0XHRub3RpZnkoIGMsIGNyZWF0ZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCAhY3JlYXRlICkge1xyXG5cdFx0XHRzZW5kRXZlbnQoIG5vZGUsIFwicmVtb3ZlZFwiICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRcclxuXHRmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykgIHtcclxuXHRcdGlmKCBtdXRhdGlvbi50eXBlPT1cImNoaWxkTGlzdFwiICkge1xyXG5cdFx0XHRpZiggbXV0YXRpb24uYWRkZWROb2RlcyApIHtcclxuXHRcdFx0XHRtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goIG5vZGUgPT4ge1xyXG5cdFx0XHRcdFx0bm90aWZ5KCBub2RlLCB0cnVlICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiggbXV0YXRpb24ucmVtb3ZlZE5vZGVzICkge1xyXG5cdFx0XHRcdG11dGF0aW9uLnJlbW92ZWROb2Rlcy5mb3JFYWNoKCBub2RlID0+IHtcclxuXHRcdFx0XHRcdG5vdGlmeSggbm9kZSwgZmFsc2UgKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmxldCBzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIG9ic2VydmVTaXplKGVudHJpZXM6IFJlc2l6ZU9ic2VydmVyRW50cnlbXSkge1xyXG5cdGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcclxuXHRcdGxldCBkb20gPSBlbnRyeS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRpZiAoZG9tLm9mZnNldFBhcmVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRkb20uZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCdyZXNpemVkJykgKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KGV2OiBFdmVudCkge1xyXG5cclxuXHRsZXQgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIE5vZGUsXHJcblx0XHRub3VwID0gKHVuYnViYmxlRXZlbnRzIGFzIGFueSlbZXYudHlwZV0gPT09IDI7XHJcblxyXG5cdHdoaWxlICh0YXJnZXQpIHtcclxuXHRcdGNvbnN0IHN0b3JlID0gZXZlbnRfaGFuZGxlcnMuZ2V0KCB0YXJnZXQgKTtcclxuXHRcdGlmICggc3RvcmUgKSB7XHJcblx0XHRcdGNvbnN0IGNhbGxiYWNrID0gc3RvcmVbZXYudHlwZV07XHJcblx0XHRcdGlmKCBjYWxsYmFjayApIHtcclxuXHRcdFx0XHRpZiggQXJyYXkuaXNBcnJheShjYWxsYmFjaykgKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjay5zb21lKCBjID0+IGMoIGV2ICkgKTtcclxuXHRcdFx0XHR9XHRcclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKCBldiApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGV2LnN0b3BQcm9wYWdhdGlvbiB8fCBldi5kZWZhdWx0UHJldmVudGVkIHx8IG5vdXApIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG5cclxuXHRcdC8vIG5vIG5lZWQgdG8gZ28gYWJvdmVcclxuXHRcdGlmICh0YXJnZXQgPT0gZG9jdW1lbnQpIHtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50KCBub2RlOiBOb2RlLCBuYW1lOiBzdHJpbmcsIGhhbmRsZXI6IERPTUV2ZW50SGFuZGxlciwgcHJlcGVuZCA9IGZhbHNlICkge1xyXG5cclxuXHRpZiggbmFtZT09XCJyZW1vdmVkXCIgfHwgbmFtZT09XCJjcmVhdGVkXCIgKSB7XHJcblx0XHRpZiggIW11dE9ic2VydmVyICkge1xyXG5cdFx0XHRtdXRPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCBvYnNlcnZlTXV0YXRpb24gKVxyXG5cdFx0XHRtdXRPYnNlcnZlci5vYnNlcnZlKCBkb2N1bWVudC5ib2R5LCB7Y2hpbGRMaXN0OiB0cnVlLHN1YnRyZWU6IHRydWV9ICk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGVsc2UgaWYoIG5hbWU9PVwicmVzaXplZFwiICkge1xyXG5cdFx0aWYgKCFzaXplT2JzZXJ2ZXIpIHtcclxuXHRcdFx0c2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCBvYnNlcnZlU2l6ZSApO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzaXplT2JzZXJ2ZXIub2JzZXJ2ZSggbm9kZSBhcyBFbGVtZW50ICk7XHJcblx0fVxyXG5cclxuXHJcblx0bGV0IHN0b3JlID0gZXZlbnRfaGFuZGxlcnMuZ2V0KCBub2RlICk7XHJcblx0aWYoICFzdG9yZSApIHtcclxuXHRcdHN0b3JlID0ge31cclxuXHRcdGV2ZW50X2hhbmRsZXJzLnNldCggbm9kZSwgc3RvcmUgKTtcclxuXHR9XHJcblxyXG5cdGlmKCAhc3RvcmVbbmFtZV0gKSB7XHJcblx0XHRzdG9yZVtuYW1lXSA9IGhhbmRsZXI7XHJcblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoIG5hbWUsIGRpc3BhdGNoRXZlbnQgKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRjb25zdCBlbnRyeSA9IHN0b3JlW25hbWVdO1xyXG5cdFx0aWYoIEFycmF5LmlzQXJyYXkoZW50cnkpICkge1xyXG5cdFx0XHRlbnRyeS5wdXNoKCBoYW5kbGVyICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3RvcmVbbmFtZV0gPSBbZW50cnksaGFuZGxlcl07XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxET01FdmVudHMge1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSB1c2VyIGFib3J0cyB0aGUgZG93bmxvYWQuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHJcblx0YWJvcnQ/OiAoZXY6IFVJRXZlbnQpID0+IGFueTtcclxuXHRhbmltYXRpb25jYW5jZWw/OiAoZXY6IEFuaW1hdGlvbkV2ZW50KSA9PiBhbnk7XHJcblx0YW5pbWF0aW9uZW5kPzogKGV2OiBBbmltYXRpb25FdmVudCkgPT4gYW55O1xyXG5cdGFuaW1hdGlvbml0ZXJhdGlvbj86IChldjogQW5pbWF0aW9uRXZlbnQpID0+IGFueTtcclxuXHRhbmltYXRpb25zdGFydD86IChldjogQW5pbWF0aW9uRXZlbnQpID0+IGFueTtcclxuXHRhdXhjbGljaz86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBvYmplY3QgbG9zZXMgdGhlIGlucHV0IGZvY3VzLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZm9jdXMgZXZlbnQuXHJcblx0ICovXHJcblx0Ymx1cj86IChldjogRm9jdXNFdmVudCkgPT4gYW55O1xyXG5cdGNhbmNlbD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHJcblx0LyoqXHJcblx0ICogT2NjdXJzIHdoZW4gcGxheWJhY2sgaXMgcG9zc2libGUsIGJ1dCB3b3VsZCByZXF1aXJlIGZ1cnRoZXIgYnVmZmVyaW5nLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0Y2FucGxheT86IChldjogRXZlbnQpID0+IGFueTtcclxuXHRjYW5wbGF5dGhyb3VnaD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjb250ZW50cyBvZiB0aGUgb2JqZWN0IG9yIHNlbGVjdGlvbiBoYXZlIGNoYW5nZWQuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRjaGFuZ2U/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIGxlZnQgbW91c2UgYnV0dG9uIG9uIHRoZSBvYmplY3RcclxuXHQgKiBAcGFyYW0gZXYgVGhlIG1vdXNlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdGNsaWNrPzogKGV2OiBNb3VzZUV2ZW50KSA9PiBhbnk7XHJcblx0Y2xvc2U/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIHJpZ2h0IG1vdXNlIGJ1dHRvbiBpbiB0aGUgY2xpZW50IGFyZWEsIG9wZW5pbmcgdGhlIGNvbnRleHQgbWVudS5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIG1vdXNlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdGNvbnRleHRtZW51PzogKGV2OiBNb3VzZUV2ZW50KSA9PiBhbnk7XHJcblx0Y3VlY2hhbmdlPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgZG91YmxlLWNsaWNrcyB0aGUgb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgbW91c2UgZXZlbnQuXHJcblx0ICovXHJcblx0ZGJsY2xpY2s/OiAoZXY6IE1vdXNlRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyBvbiB0aGUgc291cmNlIG9iamVjdCBjb250aW51b3VzbHkgZHVyaW5nIGEgZHJhZyBvcGVyYXRpb24uXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRkcmFnPzogKGV2OiBEcmFnRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyBvbiB0aGUgc291cmNlIG9iamVjdCB3aGVuIHRoZSB1c2VyIHJlbGVhc2VzIHRoZSBtb3VzZSBhdCB0aGUgY2xvc2Ugb2YgYSBkcmFnIG9wZXJhdGlvbi5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdGRyYWdlbmQ/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIG9uIHRoZSB0YXJnZXQgZWxlbWVudCB3aGVuIHRoZSB1c2VyIGRyYWdzIHRoZSBvYmplY3QgdG8gYSB2YWxpZCBkcm9wIHRhcmdldC5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGRyYWcgZXZlbnQuXHJcblx0ICovXHJcblx0ZHJhZ2VudGVyPzogKGV2OiBEcmFnRXZlbnQpID0+IGFueTtcclxuXHRkcmFnZXhpdD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyBvbiB0aGUgdGFyZ2V0IG9iamVjdCB3aGVuIHRoZSB1c2VyIG1vdmVzIHRoZSBtb3VzZSBvdXQgb2YgYSB2YWxpZCBkcm9wIHRhcmdldCBkdXJpbmcgYSBkcmFnIG9wZXJhdGlvbi5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGRyYWcgZXZlbnQuXHJcblx0ICovXHJcblx0ZHJhZ2xlYXZlPzogKGV2OiBEcmFnRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQgY29udGludW91c2x5IHdoaWxlIHRoZSB1c2VyIGRyYWdzIHRoZSBvYmplY3Qgb3ZlciBhIHZhbGlkIGRyb3AgdGFyZ2V0LlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0ZHJhZ292ZXI/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIG9uIHRoZSBzb3VyY2Ugb2JqZWN0IHdoZW4gdGhlIHVzZXIgc3RhcnRzIHRvIGRyYWcgYSB0ZXh0IHNlbGVjdGlvbiBvciBzZWxlY3RlZCBvYmplY3QuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRkcmFnc3RhcnQ/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xyXG5cdGRyb3A/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBkdXJhdGlvbiBhdHRyaWJ1dGUgaXMgdXBkYXRlZC5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdGR1cmF0aW9uY2hhbmdlPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBtZWRpYSBlbGVtZW50IGlzIHJlc2V0IHRvIGl0cyBpbml0aWFsIHN0YXRlLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0ZW1wdGllZD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBPY2N1cnMgd2hlbiB0aGUgZW5kIG9mIHBsYXliYWNrIGlzIHJlYWNoZWQuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudFxyXG5cdCAqL1xyXG5cdGVuZGVkPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gYW4gZXJyb3Igb2NjdXJzIGR1cmluZyBvYmplY3QgbG9hZGluZy5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdGVycm9yPzogT25FcnJvckV2ZW50SGFuZGxlcjtcclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBvYmplY3QgcmVjZWl2ZXMgZm9jdXMuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRmb2N1c2luPzogKGV2OiBGb2N1c0V2ZW50KSA9PiBhbnk7XHJcblx0Zm9jdXNvdXQ/OiAoZXY6IEZvY3VzRXZlbnQpID0+IGFueTtcclxuXHRmb2N1cz86IChldjogRm9jdXNFdmVudCkgPT4gYW55O1xyXG5cdGdvdHBvaW50ZXJjYXB0dXJlPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcclxuXHRpbnB1dD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHRpbnZhbGlkPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgcHJlc3NlcyBhIGtleS5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGtleWJvYXJkIGV2ZW50XHJcblx0ICovXHJcblx0a2V5ZG93bj86IChldjogS2V5Ym9hcmRFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgcHJlc3NlcyBhbiBhbHBoYW51bWVyaWMga2V5LlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0a2V5cHJlc3M/OiAoZXY6IEtleWJvYXJkRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSB1c2VyIHJlbGVhc2VzIGEga2V5LlxyXG5cdCAqIEBwYXJhbSBldiBUaGUga2V5Ym9hcmQgZXZlbnRcclxuXHQgKi9cclxuXHRrZXl1cD86IChldjogS2V5Ym9hcmRFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBicm93c2VyIGxvYWRzIHRoZSBvYmplY3QuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRsb2FkPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIG1lZGlhIGRhdGEgaXMgbG9hZGVkIGF0IHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0bG9hZGVkZGF0YT86IChldjogRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBPY2N1cnMgd2hlbiB0aGUgZHVyYXRpb24gYW5kIGRpbWVuc2lvbnMgb2YgdGhlIG1lZGlhIGhhdmUgYmVlbiBkZXRlcm1pbmVkLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0bG9hZGVkbWV0YWRhdGE/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogT2NjdXJzIHdoZW4gSW50ZXJuZXQgRXhwbG9yZXIgYmVnaW5zIGxvb2tpbmcgZm9yIG1lZGlhIGRhdGEuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRsb2Fkc3RhcnQ/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0bG9zdHBvaW50ZXJjYXB0dXJlPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgb2JqZWN0IHdpdGggZWl0aGVyIG1vdXNlIGJ1dHRvbi5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIG1vdXNlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdG1vdXNlZG93bj86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xyXG5cdG1vdXNlZW50ZXI/OiAoZXY6IE1vdXNlRXZlbnQpID0+IGFueTtcclxuXHRtb3VzZWxlYXZlPzogKGV2OiBNb3VzZUV2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBtb3ZlcyB0aGUgbW91c2Ugb3ZlciB0aGUgb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgbW91c2UgZXZlbnQuXHJcblx0ICovXHJcblx0bW91c2Vtb3ZlPzogKGV2OiBNb3VzZUV2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBtb3ZlcyB0aGUgbW91c2UgcG9pbnRlciBvdXRzaWRlIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBvYmplY3QuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBtb3VzZSBldmVudC5cclxuXHQgKi9cclxuXHRtb3VzZW91dD86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlIG1vdXNlIHBvaW50ZXIgaW50byB0aGUgb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgbW91c2UgZXZlbnQuXHJcblx0ICovXHJcblx0bW91c2VvdmVyPzogKGV2OiBNb3VzZUV2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciByZWxlYXNlcyBhIG1vdXNlIGJ1dHRvbiB3aGlsZSB0aGUgbW91c2UgaXMgb3ZlciB0aGUgb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgbW91c2UgZXZlbnQuXHJcblx0ICovXHJcblx0bW91c2V1cD86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIHBsYXliYWNrIGlzIHBhdXNlZC5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHBhdXNlPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBwbGF5IG1ldGhvZCBpcyByZXF1ZXN0ZWQuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRwbGF5PzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBhdWRpbyBvciB2aWRlbyBoYXMgc3RhcnRlZCBwbGF5aW5nLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0cGxheWluZz86IChldjogRXZlbnQpID0+IGFueTtcclxuXHRwb2ludGVyY2FuY2VsPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcclxuXHRwb2ludGVyZG93bj86IChldjogUG9pbnRlckV2ZW50KSA9PiBhbnk7XHJcblx0cG9pbnRlcmVudGVyPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcclxuXHRwb2ludGVybGVhdmU/OiAoZXY6IFBvaW50ZXJFdmVudCkgPT4gYW55O1xyXG5cdHBvaW50ZXJtb3ZlPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcclxuXHRwb2ludGVyb3V0PzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcclxuXHRwb2ludGVyb3Zlcj86IChldjogUG9pbnRlckV2ZW50KSA9PiBhbnk7XHJcblx0cG9pbnRlcnVwPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBPY2N1cnMgdG8gaW5kaWNhdGUgcHJvZ3Jlc3Mgd2hpbGUgZG93bmxvYWRpbmcgbWVkaWEgZGF0YS5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHByb2dyZXNzPzogKGV2OiBQcm9ncmVzc0V2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogT2NjdXJzIHdoZW4gdGhlIHBsYXliYWNrIHJhdGUgaXMgaW5jcmVhc2VkIG9yIGRlY3JlYXNlZC5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHJhdGVjaGFuZ2U/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciByZXNldHMgYSBmb3JtLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0cmVzZXQ/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0Ly9yZXNpemU/OiAoZXY6IFVJRXZlbnQpID0+IGFueTtcdHJlbW92ZSB0byBhdm9pZCBlcnJvcnMgd2l0aCBzaXplY2hhbmdlIGV2ZW50XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgcmVwb3NpdGlvbnMgdGhlIHNjcm9sbCBib3ggaW4gdGhlIHNjcm9sbCBiYXIgb24gdGhlIG9iamVjdC5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHNjcm9sbD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHRzZWN1cml0eXBvbGljeXZpb2xhdGlvbj86IChldjogU2VjdXJpdHlQb2xpY3lWaW9sYXRpb25FdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBzZWVrIG9wZXJhdGlvbiBlbmRzLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0c2Vla2VkPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uIGlzIG1vdmVkLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0c2Vla2luZz86IChldjogRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBjaGFuZ2VzLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0c2VsZWN0PzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdHNlbGVjdGlvbmNoYW5nZT86IChldjogRXZlbnQpID0+IGFueTtcclxuXHRzZWxlY3RzdGFydD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHQvKipcclxuXHQgKiBPY2N1cnMgd2hlbiB0aGUgZG93bmxvYWQgaGFzIHN0b3BwZWQuXHJcblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cclxuXHQgKi9cclxuXHRzdGFsbGVkPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdHN1Ym1pdD86IChldjogRXZlbnQpID0+IGFueTtcclxuXHJcblx0LyoqXHJcblx0ICogT2NjdXJzIGlmIHRoZSBsb2FkIG9wZXJhdGlvbiBoYXMgYmVlbiBpbnRlbnRpb25hbGx5IGhhbHRlZC5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHN1c3BlbmQ/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIE9jY3VycyB0byBpbmRpY2F0ZSB0aGUgY3VycmVudCBwbGF5YmFjayBwb3NpdGlvbi5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHRpbWV1cGRhdGU/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0dG9nZ2xlPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cdHRvdWNoY2FuY2VsPzogKGV2OiBUb3VjaEV2ZW50KSA9PiBhbnk7XHJcblx0dG91Y2hlbmQ/OiAoZXY6IFRvdWNoRXZlbnQpID0+IGFueTtcclxuXHR0b3VjaG1vdmU/OiAoZXY6IFRvdWNoRXZlbnQpID0+IGFueTtcclxuXHR0b3VjaHN0YXJ0PzogKGV2OiBUb3VjaEV2ZW50KSA9PiBhbnk7XHJcblx0dHJhbnNpdGlvbmNhbmNlbD86IChldjogVHJhbnNpdGlvbkV2ZW50KSA9PiBhbnk7XHJcblx0dHJhbnNpdGlvbmVuZD86IChldjogVHJhbnNpdGlvbkV2ZW50KSA9PiBhbnk7XHJcblx0dHJhbnNpdGlvbnJ1bj86IChldjogVHJhbnNpdGlvbkV2ZW50KSA9PiBhbnk7XHJcblx0dHJhbnNpdGlvbnN0YXJ0PzogKGV2OiBUcmFuc2l0aW9uRXZlbnQpID0+IGFueTtcclxuXHJcblx0LyoqXHJcblx0ICogT2NjdXJzIHdoZW4gdGhlIHZvbHVtZSBpcyBjaGFuZ2VkLCBvciBwbGF5YmFjayBpcyBtdXRlZCBvciB1bm11dGVkLlxyXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXHJcblx0ICovXHJcblx0dm9sdW1lY2hhbmdlPzogKGV2OiBFdmVudCkgPT4gYW55O1xyXG5cclxuXHQvKipcclxuXHQgKiBPY2N1cnMgd2hlbiBwbGF5YmFjayBzdG9wcyBiZWNhdXNlIHRoZSBuZXh0IGZyYW1lIG9mIGEgdmlkZW8gcmVzb3VyY2UgaXMgbm90IGF2YWlsYWJsZS5cclxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHdhaXRpbmc/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XHJcblx0d2hlZWw/OiAoZXY6IFdoZWVsRXZlbnQpID0+IGFueTtcclxuXHJcblx0LyoqXHJcblx0ICogY3VzdG9tIHg0IGV2ZW50c1xyXG5cdCAqL1xyXG5cclxuXHRyZXNpemVkPzogKGV2OiBFdmVudCkgPT4gdm9pZDtcdFx0XHQvLyBvY2N1cnMgd2hlbiBzaXplIGNoYW5nZWRcclxuXHRjcmVhdGVkPzogKCBldjogRXZlbnQgKSA9PiB2b2lkO1x0XHQvLyBvY2N1cnMgd2hlbiBpbnNlcnRlZCBpbiB0aGUgZG9tXHJcblx0cmVtb3ZlZD86ICggZXY6IEV2ZW50ICkgPT4gdm9pZDtcdFx0Ly8gb2NjdXJzIHdoZW4gcmVtb3ZlZCBmcm9tIGRvbVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBjb21wb25lbnQudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgaXNBcnJheSwgVW5zYWZlSHRtbCwgaXNOdW1iZXIsIFJlY3QsIENvbnN0cnVjdG9yIH0gZnJvbSAnLi9jb3JlX3Rvb2xzJztcclxuaW1wb3J0IHsgQ29yZUVsZW1lbnQgfSBmcm9tICcuL2NvcmVfZWxlbWVudCc7XHJcbmltcG9ydCB7IGFyaWFWYWx1ZXMsIHVuaXRsZXNzIH0gZnJvbSAnLi9jb3JlX3N0eWxlcyc7XHJcbmltcG9ydCB7IENvcmVFdmVudCwgRXZlbnRNYXAgfSBmcm9tICcuL2NvcmVfZXZlbnRzJztcclxuaW1wb3J0IHsgYWRkRXZlbnQsIERPTUV2ZW50SGFuZGxlciwgR2xvYmFsRE9NRXZlbnRzIH0gZnJvbSAnLi9jb3JlX2RvbSc7XHJcblxyXG5pbnRlcmZhY2UgUmVmVHlwZTxUIGV4dGVuZHMgQ29tcG9uZW50PiB7XHJcblx0ZG9tOiBUO1xyXG59XHJcblxyXG50eXBlIENvbXBvbmVudEF0dHJpYnV0ZXMgPSBSZWNvcmQ8c3RyaW5nLHN0cmluZ3xudW1iZXJ8Ym9vbGVhbj47XHJcblxyXG5jb25zdCBGUkFHTUVOVCA9IFN5bWJvbCggXCJmcmFnbWVudFwiICk7XHJcbmNvbnN0IENPTVBPTkVOVCA9IFN5bWJvbCggXCJjb21wb25lbnRcIiApO1xyXG5cclxuY29uc3QgUkVfTlVNQkVSID0gL14tP1xcZCsoXFwuXFxkKik/JC87XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2VuQ2xhc3NOYW1lcyggeDogYW55ICkge1xyXG5cdFxyXG5cdGxldCBjbGFzc2VzID0gW107XHJcblx0bGV0IHNlbGYgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoeCk7XHJcblxyXG5cdHdoaWxlIChzZWxmICYmIHNlbGYuY29uc3RydWN0b3IgIT09IENvbXBvbmVudCApIHtcclxuXHRcdGxldCBjbHNuYW1lOnN0cmluZyA9IHNlbGYuY29uc3RydWN0b3IubmFtZTtcclxuXHRcdGNsYXNzZXMucHVzaCggJ3g0JytjbHNuYW1lLnRvTG93ZXJDYXNlKCkgKTtcclxuXHRcdHNlbGYgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc2VsZik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gY2xhc3NlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCB0eXBlIENvbXBvbmVudENvbnRlbnQgPSBDb21wb25lbnQgfCBzdHJpbmcgfCBVbnNhZmVIdG1sIHwgbnVtYmVyIHwgYm9vbGVhbiB8IENvbXBvbmVudFtdO1xyXG5cclxubGV0IGdlbl9pZCA9IDEwMDA7XHJcblxyXG5leHBvcnQgY29uc3QgbWFrZVVuaXF1ZUNvbXBvbmVudElkID0gKCApID0+IHtcclxuXHRyZXR1cm4gYHg0LSR7Z2VuX2lkKyt9YDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UHJvcHMge1xyXG5cdHRhZz86IHN0cmluZztcclxuXHRucz86IHN0cmluZztcclxuXHJcblx0c3R5bGU/OiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+O1xyXG5cdGF0dHJzPzogUmVjb3JkPHN0cmluZyxzdHJpbmd8bnVtYmVyfGJvb2xlYW4+O1xyXG5cdGNvbnRlbnQ/OiBDb21wb25lbnRDb250ZW50O1xyXG5cdGRvbV9ldmVudHM/OiBHbG9iYWxET01FdmVudHM7XHJcblx0Y2xzPzogc3RyaW5nO1xyXG5cdGlkPzogc3RyaW5nO1xyXG5cdHJlZj86IFJlZlR5cGU8YW55PjtcclxuXHJcblx0Ly8gc2hvcnRjdXRzXHJcblx0d2lkdGg/OiBzdHJpbmcgfCBudW1iZXI7XHJcblx0aGVpZ2h0Pzogc3RyaW5nIHwgbnVtYmVyO1xyXG5cdGRpc2FibGVkPzogdHJ1ZSxcclxuXHRoaWRkZW4/OiB0cnVlLFxyXG5cclxuXHR0b29sdGlwPzogc3RyaW5nO1xyXG5cclxuICAgIC8vIHdyYXBwZXJcclxuXHRleGlzdGluZ0RPTT86IEhUTUxFbGVtZW50O1xyXG5cclxuXHQvLyAgaW5kZXggc2lnbmF0dXJlIFxyXG5cdC8vXHR0byBhdm9pZCBlcnJvcnM6IFR5cGUgJ1gnIGhhcyBubyBwcm9wZXJ0aWVzIGluIGNvbW1vbiB3aXRoIHR5cGUgJ1knIFxyXG5cdC8vXHRiZWNhdXNlIGFsbCBtZW1lYmVycyBoZXJlIGFyZSBvcHRpb25hbC5cclxuXHQvL1x0dGhpcyBhbGxvdyBUUyB0byByZWNvbmduaXplIGRlcml2ZWQgcHJvcHMgYXMgQ29tcG9uZW50UHJvcHNcclxuXHQvL1trZXk6IHN0cmluZ106IGFueTsgXHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50RXZlbnQgZXh0ZW5kcyBDb3JlRXZlbnQge1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRFdmVudHMgZXh0ZW5kcyBFdmVudE1hcCB7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PFAgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyA9IENvbXBvbmVudFByb3BzLCBFIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzID0gQ29tcG9uZW50RXZlbnRzPiBcclxuXHRcdGV4dGVuZHMgQ29yZUVsZW1lbnQ8RT4ge1xyXG5cclxuXHRyZWFkb25seSBkb206IEVsZW1lbnQ7XHJcblx0cmVhZG9ubHkgcHJvcHM6IFA7XHJcblx0cHJpdmF0ZSBzdG9yZTogTWFwPHN0cmluZ3xTeW1ib2wsYW55PjtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBQICkge1xyXG5cdFx0c3VwZXIoICk7XHJcblxyXG5cdFx0dGhpcy5wcm9wcyA9IHByb3BzO1x0Ly8gY29weSA/XHJcblxyXG5cdFx0aWYoIHByb3BzLmV4aXN0aW5nRE9NICkge1xyXG5cdFx0XHR0aGlzLmRvbSA9IHByb3BzLmV4aXN0aW5nRE9NO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmKCBwcm9wcy5ucyApIHtcclxuXHRcdFx0XHR0aGlzLmRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyggcHJvcHMubnMsIHByb3BzLnRhZyA/PyBcImRpdlwiICk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBwcm9wcy50YWcgPz8gXCJkaXZcIiApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocHJvcHMuYXR0cnMpIHtcclxuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZXMoIHByb3BzLmF0dHJzICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCBwcm9wcy5jbHMgKSB7XHJcblx0XHRcdFx0dGhpcy5hZGRDbGFzcyggcHJvcHMuY2xzICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCBwcm9wcy5oaWRkZW4gKSB7XHJcblx0XHRcdFx0dGhpcy5zaG93KCBmYWxzZSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiggcHJvcHMuaWQhPT11bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgcHJvcHMuaWQgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gc21hbGwgc2hvcnRjdXRcclxuXHRcdFx0aWYoIHByb3BzLndpZHRoIT09dW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdHRoaXMuc2V0U3R5bGVWYWx1ZSggXCJ3aWR0aFwiLCBwcm9wcy53aWR0aCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiggcHJvcHMuaGVpZ2h0IT09dW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdHRoaXMuc2V0U3R5bGVWYWx1ZSggXCJoZWlnaHRcIiwgcHJvcHMuaGVpZ2h0ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCBwcm9wcy50b29sdGlwICkge1xyXG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInRvb2x0aXBcIiwgcHJvcHMudG9vbHRpcCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiggcHJvcHMuc3R5bGUgKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRTdHlsZSggcHJvcHMuc3R5bGUgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoIHByb3BzLmNvbnRlbnQgKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRDb250ZW50KCBwcm9wcy5jb250ZW50ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCBwcm9wcy5kb21fZXZlbnRzICkge1xyXG5cdFx0XHRcdHRoaXMuc2V0RE9NRXZlbnRzKCBwcm9wcy5kb21fZXZlbnRzICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGNsYXNzZXMgPSBnZW5DbGFzc05hbWVzKCB0aGlzICk7XHJcblx0XHRcdHRoaXMuZG9tLmNsYXNzTGlzdC5hZGQoIC4uLmNsYXNzZXMgKTtcclxuXHJcblx0XHRcdC8vIG5lZWQgdG8gaGF2ZSBjaGlsZHJlbiBmb3IgbmV4dCBzdGF0ZW1lbnRzXHJcblx0XHRcdC8vIGFuZCBjaGlsZHJlbiB3YXkgYmUgY3JlYXRlZCBpbiBjYWxsZXJcclxuXHRcdFx0aWYoIHByb3BzLmRpc2FibGVkICkge1xyXG5cdFx0XHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwiY3JlYXRlZFwiLCAoICkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5lbmFibGUoIGZhbHNlICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0KHRoaXMuZG9tIGFzIGFueSlbQ09NUE9ORU5UXSA9IHRoaXM7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gOjogQ0xBU1NFUyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0aGFzQ2xhc3MoIGNsczogc3RyaW5nICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZG9tLmNsYXNzTGlzdC5jb250YWlucyggY2xzICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0YWRkQ2xhc3MoIGNsczogc3RyaW5nICkge1xyXG5cdFx0aWYoICFjbHMgKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmKCBjbHMuaW5kZXhPZignICcpPj0wICkge1xyXG5cdFx0XHRjb25zdCBjY3MgPSBjbHMuc3BsaXQoIFwiIFwiICk7XHJcblx0XHRcdHRoaXMuZG9tLmNsYXNzTGlzdC5hZGQoLi4uY2NzKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLmRvbS5jbGFzc0xpc3QuYWRkKGNscyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cmVtb3ZlQ2xhc3MoIGNsczogc3RyaW5nICkge1xyXG5cdFx0aWYoICFjbHMgKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGlmKCBjbHMuaW5kZXhPZignICcpPj0wICkge1xyXG5cdFx0XHRjb25zdCBjY3MgPSBjbHMuc3BsaXQoIFwiIFwiICk7XHJcblx0XHRcdHRoaXMuZG9tLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2NzKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLmRvbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHRcclxuXHRyZW1vdmVDbGFzc0V4KCByZTogUmVnRXhwICkge1xyXG5cdFx0Y29uc3QgYWxsID0gQXJyYXkuZnJvbSggdGhpcy5kb20uY2xhc3NMaXN0ICk7XHJcblx0XHRhbGwuZm9yRWFjaCggeCA9PiB7XHJcblx0XHRcdGlmKCB4Lm1hdGNoKHJlKSApIHtcclxuXHRcdFx0XHR0aGlzLmRvbS5jbGFzc0xpc3QucmVtb3ZlKCB4ICk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHRvZ2dsZUNsYXNzKCBjbHM6IHN0cmluZyApIHtcclxuXHRcdGlmKCAhY2xzICkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRjb25zdCB0b2dnbGUgPSAoIHg6IHN0cmluZyApID0+IHtcclxuXHRcdFx0dGhpcy5kb20uY2xhc3NMaXN0LnRvZ2dsZSh4KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggY2xzLmluZGV4T2YoJyAnKT49MCApIHtcclxuXHRcdFx0Y29uc3QgY2NzID0gY2xzLnNwbGl0KCBcIiBcIiApO1xyXG5cdFx0XHRjY3MuZm9yRWFjaCggdG9nZ2xlICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dG9nZ2xlKCBjbHMgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRzZXRDbGFzcyggY2xzOiBzdHJpbmcsIHNldDogYm9vbGVhbiA9IHRydWUgKSB7XHJcblx0XHRpZiggc2V0ICkgdGhpcy5hZGRDbGFzcyhjbHMpO1xyXG5cdFx0ZWxzZSB0aGlzLnJlbW92ZUNsYXNzKCBjbHMgKTtcclxuXHR9XHJcblxyXG5cdC8vIDo6IEFUVFJJQlVURVMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcclxuXHJcblx0LyoqXHJcblx0ICogYXR0cmlidXRlc1xyXG5cdCAqL1xyXG5cclxuXHRzZXRBdHRyaWJ1dGVzKCBhdHRyczogQ29tcG9uZW50QXR0cmlidXRlcyApIHtcclxuXHRcdFxyXG5cdFx0Zm9yKCBjb25zdCBuYW1lIGluIGF0dHJzICkge1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggbmFtZSwgdmFsdWUgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cdFxyXG5cdHNldEF0dHJpYnV0ZSggbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiApIHtcclxuXHRcdGlmKCB2YWx1ZT09PW51bGwgfHwgdmFsdWU9PT11bmRlZmluZWQgKSB7XHJcblx0XHRcdHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZSggbmFtZSApO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuZG9tLnNldEF0dHJpYnV0ZSggbmFtZSwgXCJcIit2YWx1ZSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGdldEF0dHJpYnV0ZSggbmFtZTogc3RyaW5nICk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gdGhpcy5kb20uZ2V0QXR0cmlidXRlKCBuYW1lICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0Z2V0RGF0YSggbmFtZTogc3RyaW5nICkgOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCBcImRhdGEtXCIrbmFtZSApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHNldERhdGEoIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyApIHtcclxuXHRcdHJldHVybiB0aGlzLnNldEF0dHJpYnV0ZSggXCJkYXRhLVwiK25hbWUsIHZhbHVlICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBpZGVtIGFzIHNldERhdGEgYnV0IG9ub3Qgb24gZG9tLCB5b3UgY2FuIHN0b3JlIGFueXRoaW5nIFxyXG5cdCAqL1xyXG5cclxuXHRzZXRJbnRlcm5hbERhdGEoIG5hbWU6IHN0cmluZ3xTeW1ib2wsIHZhbHVlOiBhbnkgKTogdGhpcyB7XHJcblx0XHRpZiggIXRoaXMuc3RvcmUgKSB7XHJcblx0XHRcdHRoaXMuc3RvcmUgPSBuZXcgTWFwKCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc3RvcmUuc2V0KCBuYW1lLCB2YWx1ZSApO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnZXRJbnRlcm5hbERhdGEoIG5hbWU6IHN0cmluZ3xTeW1ib2wgKTogYW55IHtcclxuXHRcdHJldHVybiB0aGlzLnN0b3JlPy5nZXQobmFtZSk7XHJcblx0fVxyXG5cclxuXHRcclxuXHQvLyA6OiBET00gRVZFTlRTIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRhZGRET01FdmVudDxLIGV4dGVuZHMga2V5b2YgR2xvYmFsRE9NRXZlbnRzPiggbmFtZTogSywgbGlzdGVuZXI6IEdsb2JhbERPTUV2ZW50c1tLXSwgcHJlcGVuZCA9IGZhbHNlICkge1xyXG5cdFx0YWRkRXZlbnQoIHRoaXMuZG9tLCBuYW1lLCBsaXN0ZW5lciBhcyBET01FdmVudEhhbmRsZXIsIHByZXBlbmQgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRzZXRET01FdmVudHMoIGV2ZW50czogR2xvYmFsRE9NRXZlbnRzICkge1xyXG5cdFx0Zm9yKCBjb25zdCBuYW1lIGluIGV2ZW50cyApIHtcclxuXHRcdFx0dGhpcy5hZGRET01FdmVudCggbmFtZSBhcyBhbnksIChldmVudHMgYXMgYW55KVtuYW1lXSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gOjogSElMRVZFTCBFVkVOVFMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcclxuXHJcblx0LyoqXHJcblx0ICogdG9vbCB0byBtb3ZlIG5hbWVkIGV2ZW50cyB0byBpbnRlcm5hbCBldmVudCBtYXBcclxuXHQgKiBAaW50ZXJuYWxcclxuXHQgKi9cclxuXHRcclxuXHRwcm90ZWN0ZWQgbWFwUHJvcEV2ZW50czxOIGV4dGVuZHMga2V5b2YgRT4ocHJvcHM6IFAsIC4uLmVsZW1lbnRzOiBOW10gKSB7XHJcblx0XHRjb25zdCBwID0gcHJvcHMgYXMgYW55O1xyXG5cdFx0ZWxlbWVudHMuZm9yRWFjaCggbiA9PiB7XHJcblx0XHRcdGlmIChwLmhhc093blByb3BlcnR5KG4pICkge1xyXG5cdFx0XHRcdHRoaXMub24oIG4sIHBbbl0gKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyA6OiBDT05URU5UIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcblxyXG5cdC8qKlxyXG5cdCAqIHJlbW92ZSBhbGwgY29udGVudCBmcm9tIGNvbXBvbmVudFxyXG5cdCAqL1xyXG5cclxuXHRjbGVhckNvbnRlbnQoICkge1xyXG5cdFx0Y29uc3QgZCA9IHRoaXMuZG9tO1xyXG5cdFx0d2hpbGUoIGQuZmlyc3RDaGlsZCApIHtcclxuXHRcdFx0ZC5yZW1vdmVDaGlsZCggZC5maXJzdENoaWxkICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBjaGFuZ2UgdGhlIHdob2xlIGNvbnRlbnQgb2YgdGhlIGNvbXBvbmVudFxyXG5cdCAqIGNsZWFyIHRoZSBjb250ZW50IGJlZm9yZVxyXG5cdCAqIEBwYXJhbSBjb250ZW50IG5ldyBjb250ZW50XHJcblx0ICovXHJcblxyXG5cdHNldENvbnRlbnQoIGNvbnRlbnQ6IENvbXBvbmVudENvbnRlbnQgKSB7XHJcblx0XHR0aGlzLmNsZWFyQ29udGVudCggKTtcclxuXHRcdHRoaXMuYXBwZW5kQ29udGVudCggY29udGVudCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogY2YuIGFwcGVuZENvbnRlbnRcclxuXHQgKiBAcGFyYW0gY29udGVudCBjb250ZW50IHRvIGFwcGVuZFxyXG5cdCAqL1xyXG5cclxuXHRhcHBlbmRDb250ZW50KCBjb250ZW50OiBDb21wb25lbnRDb250ZW50ICkge1xyXG5cdFx0Y29uc3Qgc2V0ID0gKCBkOiBhbnksIGM6IENvbXBvbmVudCB8IHN0cmluZyB8IFVuc2FmZUh0bWwgfCBudW1iZXIgfCBib29sZWFuICkgPT4ge1xyXG5cdFxyXG5cdFx0XHRpZiAoYyBpbnN0YW5jZW9mIENvbXBvbmVudCApIHtcclxuXHRcdFx0XHRkLmFwcGVuZENoaWxkKCBjLmRvbSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYoIGMgaW5zdGFuY2VvZiBVbnNhZmVIdG1sKSB7XHJcblx0XHRcdFx0ZC5pbnNlcnRBZGphY2VudEhUTUwoICdiZWZvcmVlbmQnICwgYy50b1N0cmluZygpICk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGMgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGMgPT09IFwibnVtYmVyXCIpIHtcclxuXHRcdFx0XHRjb25zdCB0bm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGMudG9TdHJpbmcoKSk7XHJcblx0XHRcdFx0ZC5hcHBlbmRDaGlsZCggdG5vZGUgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKCBjICkge1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlVua25vd24gdHlwZSB0byBhcHBlbmQ6IFwiLCBjKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCAhaXNBcnJheShjb250ZW50KSApIHtcclxuXHRcdFx0c2V0KCB0aGlzLmRvbSwgY29udGVudCApO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiggY29udGVudC5sZW5ndGg8PTggKSB7XHJcblx0XHRcdGZvciggY29uc3QgYyBvZiBjb250ZW50ICkge1xyXG5cdFx0XHRcdHNldCggdGhpcy5kb20sIGMgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCggKTtcclxuXHRcdFx0Zm9yIChjb25zdCBjaGlsZCBvZiBjb250ZW50ICkge1xyXG5cdFx0XHRcdHNldCggZnJhZ21lbnQsIGNoaWxkICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZG9tLmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xyXG5cdFx0fVxyXG5cdH1cdFx0XHJcblxyXG5cdC8qKlxyXG5cdCAqIGNmLiBhcHBlbmRDb250ZW50XHJcblx0ICogQHBhcmFtIGNvbnRlbnQgY29udGVudCB0byBhcHBlbmRcclxuXHQgKi9cclxuXHJcblx0cHJlcGVuZENvbnRlbnQoIGNvbnRlbnQ6IENvbXBvbmVudENvbnRlbnQgKSB7XHJcblx0XHRjb25zdCBkID0gdGhpcy5kb207XHJcblxyXG5cdFx0Y29uc3Qgc2V0ID0gKCBjOiBDb21wb25lbnQgfCBzdHJpbmcgfCBVbnNhZmVIdG1sIHwgbnVtYmVyIHwgYm9vbGVhbiApID0+IHtcclxuXHRcdFx0aWYgKGMgaW5zdGFuY2VvZiBDb21wb25lbnQgKSB7XHJcblx0XHRcdFx0ZC5pbnNlcnRCZWZvcmUoIGQuZmlyc3RDaGlsZCwgYy5kb20gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKCBjIGluc3RhbmNlb2YgVW5zYWZlSHRtbCkge1xyXG5cdFx0XHRcdGQuaW5zZXJ0QWRqYWNlbnRIVE1MKCAnYmVmb3JlYmVnaW4nLCBjLnRvU3RyaW5nKCkgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgYyA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgYyA9PT0gXCJudW1iZXJcIikge1xyXG5cdFx0XHRcdGNvbnN0IHRub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYy50b1N0cmluZygpKTtcclxuXHRcdFx0XHRkLmluc2VydEJlZm9yZSggZC5maXJzdENoaWxkLCB0bm9kZSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlVua25vd24gdHlwZSB0byBhcHBlbmQ6IFwiLCBjKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCAhaXNBcnJheShjb250ZW50KSApIHtcclxuXHRcdFx0c2V0KCBjb250ZW50ICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCApO1xyXG5cdFx0XHRmb3IgKGNvbnN0IGNoaWxkIG9mIGNvbnRlbnQgKSB7XHJcblx0XHRcdFx0c2V0KCBjaGlsZCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRkLmluc2VydEJlZm9yZSggZC5maXJzdENoaWxkLCBmcmFnbWVudCApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogcmVtb3ZlIGEgc2luZ2xlIGNoaWxkXHJcblx0ICogQHNlZSBjbGVhckNvbnRlbnRcclxuXHQgKi9cclxuXHJcblx0cmVtb3ZlQ2hpbGQoIGNoaWxkOiBDb21wb25lbnQgKSB7XHJcblx0XHR0aGlzLmRvbS5yZW1vdmVDaGlsZCggY2hpbGQuZG9tICk7XHJcblx0fVxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBxdWVyeSBhbGwgZWxlbWVudHMgYnkgc2VsZWN0b3JcclxuXHQgKi9cclxuXHJcblx0cXVlcnlBbGwoIHNlbGVjdG9yOiBzdHJpbmcgKTogQ29tcG9uZW50W10ge1xyXG5cdFx0Y29uc3QgYWxsID0gdGhpcy5kb20ucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKTtcclxuXHRcdGNvbnN0IHJjID0gbmV3IEFycmF5KCBhbGwubGVuZ3RoICk7XHJcblx0XHRhbGwuZm9yRWFjaCggKHgsaSkgPT4gcmNbaV09Y29tcG9uZW50RnJvbURPTSh4KSApO1xyXG5cdFx0cmV0dXJuIHJjO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblx0XHJcblx0cXVlcnk8VCBleHRlbmRzIENvbXBvbmVudCA9IENvbXBvbmVudD4oIHNlbGVjdG9yOiBzdHJpbmcgKTogVCB7XHJcblx0XHRjb25zdCByID0gdGhpcy5kb20ucXVlcnlTZWxlY3Rvciggc2VsZWN0b3IgKTtcclxuXHRcdHJldHVybiBjb21wb25lbnRGcm9tRE9NPFQ+KHIpO1xyXG5cdH1cclxuXHJcblx0Ly8gOjogU1RZTEVTIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcblxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cdFxyXG5cdHNldEFyaWEoIG5hbWU6IGtleW9mIGFyaWFWYWx1ZXMsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuICk6IHRoaXMge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIG5hbWUsIHZhbHVlICk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0c2V0U3R5bGUoIHN0eWxlOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+ICk6IHRoaXMge1xyXG5cdFx0Y29uc3QgX3N0eWxlID0gKHRoaXMuZG9tIGFzIEhUTUxFbGVtZW50KS5zdHlsZTtcclxuXHJcblx0XHRmb3IoIGNvbnN0IG5hbWUgaW4gc3R5bGUgKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgdmFsdWUgPSBzdHlsZVtuYW1lXTtcclxuXHRcdFx0aWYoICF1bml0bGVzc1tuYW1lXSAmJiAoaXNOdW1iZXIodmFsdWUpIHx8IFJFX05VTUJFUi50ZXN0KHZhbHVlKSkgKSB7XHJcblx0XHRcdFx0dmFsdWUgKz0gXCJweFwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfc3R5bGVbbmFtZV0gPSB2YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRzZXRTdHlsZVZhbHVlPEsgZXh0ZW5kcyBrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uPiggbmFtZTogSywgdmFsdWU6IENTU1N0eWxlRGVjbGFyYXRpb25bS10gfCBudW1iZXIgKTogdGhpcyB7XHJcblx0XHRcclxuXHRcdGNvbnN0IF9zdHlsZSA9ICh0aGlzLmRvbSBhcyBIVE1MRWxlbWVudCkuc3R5bGU7XHJcblxyXG5cdFx0aWYoIGlzTnVtYmVyKHZhbHVlKSApIHtcclxuXHRcdFx0bGV0IHYgPSB2YWx1ZStcIlwiO1xyXG5cdFx0XHRpZiggIXVuaXRsZXNzW25hbWUgYXMgc3RyaW5nXSApIHtcclxuXHRcdFx0XHR2ICs9IFwicHhcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0KF9zdHlsZSBhcyBhbnkpW25hbWVdID0gdjtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRfc3R5bGVbbmFtZV0gPSB2YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqIEBwYXJhbSBuYW1lIFxyXG5cdCAqIEByZXR1cm5zIFxyXG5cdCAqL1xyXG5cclxuXHRnZXRTdHlsZVZhbHVlPEsgZXh0ZW5kcyBrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uPiggbmFtZTogSyApIHtcclxuXHRcdGNvbnN0IF9zdHlsZSA9ICh0aGlzLmRvbSBhcyBIVE1MRWxlbWVudCkuc3R5bGU7XHJcblx0XHRyZXR1cm4gX3N0eWxlW25hbWVdO1xyXG5cdH1cclxuXHJcblx0c2V0V2lkdGgoIHc6IG51bWJlciB8IHN0cmluZyApIHtcclxuXHRcdHRoaXMuc2V0U3R5bGVWYWx1ZSggXCJ3aWR0aFwiLCBpc051bWJlcih3KSA/IHcrXCJweFwiIDogdyApO1xyXG5cdH1cclxuXHJcblx0c2V0SGVpZ2h0KCBoOiBudW1iZXIgfCBzdHJpbmcgKSB7XHJcblx0XHR0aGlzLnNldFN0eWxlVmFsdWUoIFwiaGVpZ2h0XCIsIGlzTnVtYmVyKGgpID8gaCtcInB4XCIgOiBoICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0c2V0U3R5bGVWYXJpYWJsZSggbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nICkge1xyXG5cdFx0KHRoaXMuZG9tIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5zZXRQcm9wZXJ0eSggbmFtZSwgdmFsdWUgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRnZXRTdHlsZVZhcmlhYmxlKCBuYW1lOiBzdHJpbmcgKSB7XHJcblx0XHRjb25zdCBzdHlsZSA9IHRoaXMuZ2V0Q29tcHV0ZWRTdHlsZSggKTtcclxuXHRcdHJldHVybiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCBuYW1lICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKiBAcmV0dXJucyBcclxuXHQgKi9cclxuXHJcblx0Z2V0Q29tcHV0ZWRTdHlsZSggKSB7XHJcblx0XHRyZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZSggdGhpcy5kb20gKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRzZXRDYXB0dXJlKCBwb2ludGVySWQ6IG51bWJlciApIHtcclxuXHRcdHRoaXMuZG9tLnNldFBvaW50ZXJDYXB0dXJlKCBwb2ludGVySWQgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRyZWxlYXNlQ2FwdHVyZSggcG9pbnRlcklkOiBudW1iZXIgKSB7XHJcblx0XHR0aGlzLmRvbS5yZWxlYXNlUG9pbnRlckNhcHR1cmUoIHBvaW50ZXJJZCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGdldEJvdW5kaW5nUmVjdCggKTogUmVjdCB7XHJcblx0XHRjb25zdCByYyA9IHRoaXMuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCggKTtcclxuXHRcdHJldHVybiBuZXcgUmVjdCggcmMueCwgcmMueSwgcmMud2lkdGgsIHJjLmhlaWdodCApO1xyXG5cdH1cclxuXHJcblx0Ly8gOjogTUlTQyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0Zm9jdXMoICkge1xyXG5cdFx0KHRoaXMuZG9tIGFzIEhUTUxFbGVtZW50KS5mb2N1cyggKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRzY3JvbGxJbnRvVmlldyhhcmc/OiBib29sZWFuIHwgU2Nyb2xsSW50b1ZpZXdPcHRpb25zKSB7XHJcblx0XHR0aGlzLmRvbS5zY3JvbGxJbnRvVmlldyhhcmcpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGlzVmlzaWJsZSggKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuZG9tIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRQYXJlbnQgIT09IG51bGw7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0c2hvdyggdmlzID0gdHJ1ZSApIHtcclxuXHRcdHRoaXMuc2V0Q2xhc3MoICd4NGhpZGRlbicsICF2aXMgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRoaWRlKCApIHtcclxuXHRcdHRoaXMuc2hvdyggZmFsc2UgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIGVuYWJsZSBvciBkaXNhYmxlIGEgY29tcG9uZW50IChhbGwgc3ViIEhUTUxFbGVtZW50IHdpbGwgYmUgYWxzbyBkaXNhYmxlZClcclxuXHQgKi9cclxuXHJcblx0ZW5hYmxlKCBlbmEgPSB0cnVlICkge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiwgIWVuYSApO1xyXG5cclxuXHRcdC8vIHByb3BhZ2F0ZSBkaWFibGUgc3RhdGUgdG8gYWxsIGlucHV0IGNoaWxkcmVuXHJcblx0XHRjb25zdCBub2RlcyA9IHRoaXMuZW51bUNoaWxkTm9kZXMoIHRydWUgKTtcclxuXHRcdG5vZGVzLmZvckVhY2goIHggPT4ge1xyXG5cdFx0XHRpZiggeCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgKSB7XHJcblx0XHRcdFx0eC5kaXNhYmxlZCA9ICFlbmE7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGRpc2FibGUoICkge1xyXG5cdFx0dGhpcy5lbmFibGUoIGZhbHNlICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBjaGVjayBpZiBlbGVtZW50IGlzIG1hcmtlZCBkaXNhYmxlZFxyXG5cdCAqL1xyXG5cclxuXHRpc0Rpc2FibGVkKCApIHtcclxuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRuZXh0RWxlbWVudDxUIGV4dGVuZHMgQ29tcG9uZW50ID0gQ29tcG9uZW50PiggKTogVCB7XHJcblx0XHRjb25zdCBueHQgPSB0aGlzLmRvbS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblx0XHRyZXR1cm4gY29tcG9uZW50RnJvbURPTTxUPiggbnh0ICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKiBAcmV0dXJucyBcclxuXHQgKi9cclxuXHJcblx0cHJldkVsZW1lbnQ8VCBleHRlbmRzIENvbXBvbmVudCA9IENvbXBvbmVudD4oICk6IFQge1xyXG5cdFx0Y29uc3Qgbnh0ID0gdGhpcy5kb20ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHRcdHJldHVybiBjb21wb25lbnRGcm9tRE9NPFQ+KCBueHQgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIHNlYXJjaCBmb3IgcGFyZW50IHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGNvbnRydWN0b3IgXHJcblx0ICovXHJcblxyXG5cdHBhcmVudEVsZW1lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4oIGNscz86IENvbnN0cnVjdG9yPFQ+ICk6IFQge1xyXG5cdFx0bGV0IHAgPSB0aGlzLmRvbTtcclxuXHJcblx0XHR3aGlsZSggcC5wYXJlbnRFbGVtZW50ICkge1xyXG5cdFx0XHRjb25zdCBjcCA9IGNvbXBvbmVudEZyb21ET00oIHAucGFyZW50RWxlbWVudCApO1xyXG5cdFx0XHRpZiggIWNscyApIHtcclxuXHRcdFx0XHRyZXR1cm4gY3AgYXMgVDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoIGNwICYmIGNwIGluc3RhbmNlb2YgY2xzICkge1xyXG5cdFx0XHRcdHJldHVybiBjcDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cCA9IHAucGFyZW50RWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqIEByZXR1cm5zIFxyXG5cdCAqL1xyXG5cclxuXHRmaXJzdENoaWxkPFQgZXh0ZW5kcyBDb21wb25lbnQgPSBDb21wb25lbnQ+KCApIDogVCB7XHJcblx0XHRjb25zdCBueHQgPSB0aGlzLmRvbS5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHRcdHJldHVybiBjb21wb25lbnRGcm9tRE9NPFQ+KCBueHQgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqIEByZXR1cm5zIFxyXG5cdCAqL1xyXG5cclxuXHRsYXN0Q2hpbGQ8VCBleHRlbmRzIENvbXBvbmVudCA9IENvbXBvbmVudD4oICkgOiBUIHtcclxuXHRcdGNvbnN0IG54dCA9IHRoaXMuZG9tLmxhc3RFbGVtZW50Q2hpbGQ7XHJcblx0XHRyZXR1cm4gY29tcG9uZW50RnJvbURPTSggbnh0ICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiByZW52b2llIGxhIGxpc3RlIGRlcyBDb21wb3NhbnRzIGVuZmFudHNcclxuXHQgKi9cclxuXHJcblx0ZW51bUNoaWxkQ29tcG9uZW50cyggcmVjdXJzaXZlOiBib29sZWFuICkge1xyXG5cclxuXHRcdGxldCBjaGlsZHJlbjogQ29tcG9uZW50W10gPSBbXTtcclxuXHRcdFxyXG5cdFx0Y29uc3Qgbm9kZXMgPSB0aGlzLmVudW1DaGlsZE5vZGVzKCByZWN1cnNpdmUgKTtcclxuXHRcdG5vZGVzLmZvckVhY2goICggYzogTm9kZSApID0+IHtcclxuXHRcdFx0Y29uc3QgY2MgPSBjb21wb25lbnRGcm9tRE9NKCBjIGFzIEhUTUxFbGVtZW50ICk7XHJcblx0XHRcdGlmKCBjYyApIHtcclxuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNjKTtcclxuXHRcdFx0fVxyXG5cdFx0fSApO1xyXG5cclxuXHRcdHJldHVybiBjaGlsZHJlbjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIHJldHVybiBjaGlsZHJlbiBsaXN0IG9mIG5vZGUgKG5vdCBhbGwgc2hvdWxkIGJlIGNvbXBvbmVudHMpXHJcblx0ICovXHJcblxyXG5cdGVudW1DaGlsZE5vZGVzKCByZWN1cnNpdmU6IGJvb2xlYW4gKSB7XHJcblx0XHRsZXQgY2hpbGRyZW46IE5vZGVbXSA9IEFycmF5LmZyb20oIHJlY3Vyc2l2ZSA/IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoICcqJyApIDogdGhpcy5kb20uY2hpbGRyZW4gKTtcclxuXHRcdHJldHVybiBjaGlsZHJlbjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRhbmltYXRlKCBrZXlmcmFtZXM6IEtleWZyYW1lW10sIGR1cmF0aW9uOiBudW1iZXIgKSB7XHJcblx0XHR0aGlzLmRvbS5hbmltYXRlKGtleWZyYW1lcyxkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gOjogVFNYL1JFQUNUIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcblxyXG5cdC8qKlxyXG5cdCAqIGNhbGxlZCBieSB0aGUgY29tcGlsZXIgd2hlbiBhIGpzeCBlbGVtZW50IGlzIHNlZW5cclxuXHQgKi9cclxuXHJcblx0c3RhdGljIGNyZWF0ZUVsZW1lbnQoIGNsc09yVGFnOiBzdHJpbmcgfCBDb21wb25lbnRDb25zdHJ1Y3RvciB8IFN5bWJvbCB8IEZ1bmN0aW9uLCBhdHRyczogYW55LCAuLi5jaGlsZHJlbjogQ29tcG9uZW50W10gKTogQ29tcG9uZW50IHwgQ29tcG9uZW50W10ge1xyXG5cclxuXHRcdGxldCBjb21wOiBDb21wb25lbnQ7XHJcblxyXG5cdFx0Ly8gZnJhZ21lbnRcclxuXHRcdGlmKCBjbHNPclRhZz09dGhpcy5jcmVhdGVGcmFnbWVudCB8fCBjbHNPclRhZz09PUZSQUdNRU5UICkge1xyXG5cdFx0XHRyZXR1cm4gY2hpbGRyZW47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2xhc3MgY29uc3RydWN0b3IsIHllcyA6IGRpcnR5XHJcblx0XHRpZiggY2xzT3JUYWcgaW5zdGFuY2VvZiBGdW5jdGlvbiApIHtcclxuXHRcdFx0YXR0cnMgPSBhdHRycyA/PyB7fTtcclxuXHRcdFx0aWYoICFhdHRycy5jaGlsZHJlbiAmJiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGggKSB7XHJcblx0XHRcdFx0YXR0cnMuY29udGVudCA9IGNoaWxkcmVuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb21wID0gbmV3IChjbHNPclRhZyBhcyBhbnkpKCBhdHRycyA/PyB7fSApO1xyXG5cdFx0fVxyXG5cdFx0Ly8gYmFzaWMgdGFnXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29tcCA9IG5ldyBDb21wb25lbnQoIHtcclxuXHRcdFx0XHR0YWc6IGNsc09yVGFnLFxyXG5cdFx0XHRcdGNvbnRlbnQ6IGNoaWxkcmVuLFxyXG5cdFx0XHRcdC4uLmF0dHJzLFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoICkge1xyXG5cdFx0XHQvL2NvbXAuc2V0Q29udGVudCggY2hpbGRyZW4gKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY29tcDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRzdGF0aWMgY3JlYXRlRnJhZ21lbnQoICk6IENvbXBvbmVudFtdIHtcclxuXHRcdHJldHVybiB0aGlzLmNyZWF0ZUVsZW1lbnQoIEZSQUdNRU5ULCBudWxsICkgYXMgQ29tcG9uZW50W107XHJcblx0fVxyXG5cclxuXHQvLyA6OiBTUEVDSUFMUyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cXVlcnlJbnRlcmZhY2U8VD4oIG5hbWU6IHN0cmluZyApOiBUIHtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufSAgXHJcblxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbnR5cGUgQ29tcG9uZW50Q29uc3RydWN0b3IgPSB7XHJcblx0bmV3KC4uLnBhcmFtczogYW55W10pOiBDb21wb25lbnQ7XHJcbn07XHJcblxyXG4vKipcclxuICogZ2V0IGEgY29tcG9uZW50IGVsZW1lbnQgZnJvbSBpdCdzIERPTSBjb3VudGVycGFydFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21wb25lbnRGcm9tRE9NPFQgZXh0ZW5kcyBDb21wb25lbnQgPSBDb21wb25lbnQ+KCBub2RlOiBFbGVtZW50ICkge1xyXG5cdHJldHVybiBub2RlID8gKG5vZGUgYXMgYW55KVtDT01QT05FTlRdIGFzIFQgOiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogY3JlYXRlIGEgY29tcG9uZW50IGZyb20gYW4gZXhpc3RpbmcgRE9NXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBET00oIGVsOiBIVE1MRWxlbWVudCApOiBDb21wb25lbnQge1xyXG5cdGNvbnN0IGNvbSA9IGNvbXBvbmVudEZyb21ET00oZWwpO1xyXG5cdGlmKCBjb20gKSB7XHJcblx0XHRyZXR1cm4gY29tO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIG5ldyBDb21wb25lbnQoIHsgZXhpc3RpbmdET006IGVsIH0gKTtcclxufVxyXG5cclxuXHJcbi8vIDo6IFNwZWNpYWwgY29tcG9uZW50cyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG5cclxuLy8ganVzdCBhIGZsZXhpYmxlIGVsZW1lbnQgdGhhdCBwdXNoIG90aGVyXHJcbmV4cG9ydCBjbGFzcyBGbGV4IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3RvciggKSB7XHJcblx0XHRzdXBlcih7fSlcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vLyA6OiBISUdIIExFVkVMIEJBU0lDIEVWRU5UUyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG5cclxuXHJcblxyXG4vKipcclxuICogQ2xpY2sgRXZlbnRcclxuICogY2xpY2sgZXZlbnQgZG8gbm90IGhhdmUgYW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZDbGljayBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoYW5nZSBFdmVudFxyXG4gKiB2YWx1ZSBpcyB0aGUgdGhlIGVsZW1lbnQgdmFsdWVcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2Q2hhbmdlIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xyXG5cdHJlYWRvbmx5IHZhbHVlOiBhbnk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZWxlY3Rpb24gRXZlbnRcclxuICogdmFsdWUgaXMgdGhlIG5ldyBzZWxlY3Rpb24gb3IgbnVsbFxyXG4gKi9cclxuXHJcbmludGVyZmFjZSBJU2VsZWN0aW9uIHtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdlNlbGVjdGlvbkNoYW5nZSBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcclxuXHRyZWFkb25seSBzZWxlY3Rpb246IElTZWxlY3Rpb247XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQ29udGV4dE1lbnUgRXZlbnRcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2Q29udGV4dE1lbnUgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XHJcblx0dWlldmVudDogVUlFdmVudDtcdC8vIFVJIGV2ZW50IHRoYXQgZmlyZSB0aGlzIGV2ZW50XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaW1wbGUgbWVzc2FnZVxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZNZXNzYWdlIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xyXG5cdHJlYWRvbmx5IG1zZzogc3RyaW5nO1xyXG5cdHJlYWRvbmx5IHBhcmFtcz86IGFueTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERyYWcvRHJvcCBldmVudFxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZEcmFnIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xyXG5cdGVsZW1lbnQ6IHVua25vd247XHJcblx0ZGF0YTogYW55O1xyXG59XHJcblxyXG4vKipcclxuICogRXJyb3JzXHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdkVycm9yIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xyXG5cdGNvZGU6IG51bWJlcjtcclxuXHRtZXNzYWdlOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEYmxDbGljayBFdmVudFxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZEYmxDbGljayBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcclxufVxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIGNvcmVfY29sb3JzLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IGNsYW1wLCBpc1N0cmluZyB9IGZyb20gJy4vY29yZV90b29scyc7XHJcblxyXG5cclxuZnVuY3Rpb24gaHgoIHY6IG51bWJlciApIHtcclxuXHRjb25zdCBoZXggPSB2LnRvU3RyaW5nKCAxNiApO1xyXG5cdHJldHVybiBoZXgucGFkU3RhcnQoIDIsICcwJyApO1xyXG59XHJcblxyXG5mdW5jdGlvbiByb3VuZCggdjogbnVtYmVyICkge1xyXG5cdHJldHVybiBNYXRoLnJvdW5kKHYpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZ2Ige1xyXG5cdHJlZDogbnVtYmVyO1xyXG5cdGdyZWVuOiBudW1iZXI7XHJcblx0Ymx1ZTogbnVtYmVyO1xyXG5cdGFscGhhOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSHN2IHtcclxuXHRodWU6IG51bWJlcjtcclxuXHRzYXR1cmF0aW9uOiBudW1iZXI7XHJcblx0dmFsdWU6IG51bWJlcjtcclxuXHRhbHBoYTogbnVtYmVyO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuXHJcblx0cHJpdmF0ZSByZ2I6IFtyZWQ6bnVtYmVyLGdyZWVuOm51bWJlcixibHVlOm51bWJlcixhbHBoYTpudW1iZXJdID0gWzAsMCwwLDFdO1xyXG5cdHByaXZhdGUgaW52YWxpZCA9IGZhbHNlO1xyXG5cclxuXHRjb25zdHJ1Y3RvciggdmFsdWU6IHN0cmluZyApO1xyXG5cdGNvbnN0cnVjdG9yKCByOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhPzogbnVtYmVyICk7XHJcblx0Y29uc3RydWN0b3IoIC4uLmFyZ3M6IGFueVtdICkge1xyXG5cdFx0aWYoIGlzU3RyaW5nKGFyZ3NbMF0gKSApIHtcclxuXHRcdFx0dGhpcy5zZXRWYWx1ZSggIGFyZ3NbMF0gKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLnNldFJnYiggYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogYWNjZXB0czpcclxuXHQgKiBcdCNhYWFcclxuXHQgKiAgI2FiYWJhYlxyXG5cdCAqICAjYWJhYmFiNTVcclxuXHQgKiAgcmdiKGEsYixjKVxyXG5cdCAqICByZ2JhKGEsYixjLGQpXHJcblx0ICogIHZhciggLS1jb2xvci01IClcclxuXHQgKi9cclxuXHRcclxuXHRzZXRWYWx1ZSggdmFsdWU6IHN0cmluZyApOiB0aGlzIHtcclxuXHJcblx0XHR0aGlzLmludmFsaWQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiggdmFsdWUubGVuZ3RoPT00ICYmIC8jWzAtOWEtZkEtRl17M30vLnRlc3QodmFsdWUpICkge1xyXG5cdFx0XHRjb25zdCByMSA9IHBhcnNlSW50KCB2YWx1ZVsxXSwgMTYgKTtcclxuXHRcdFx0Y29uc3QgZzEgPSBwYXJzZUludCggdmFsdWVbMl0sIDE2ICk7XHJcblx0XHRcdGNvbnN0IGIxID0gcGFyc2VJbnQoIHZhbHVlWzNdLCAxNiApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRSZ2IoIHIxPDw0fHIxLCBnMTw8NHxnMSwgYjE8PDR8YjEsIDEuMCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCB2YWx1ZS5sZW5ndGg9PTcgJiYgLyNbMC05YS1mQS1GXXs2fS8udGVzdCh2YWx1ZSkgKSB7XHJcblx0XHRcdGNvbnN0IHIxID0gcGFyc2VJbnQoIHZhbHVlWzFdLCAxNiApO1xyXG5cdFx0XHRjb25zdCByMiA9IHBhcnNlSW50KCB2YWx1ZVsyXSwgMTYgKTtcclxuXHRcdFx0Y29uc3QgZzEgPSBwYXJzZUludCggdmFsdWVbM10sIDE2ICk7XHJcblx0XHRcdGNvbnN0IGcyID0gcGFyc2VJbnQoIHZhbHVlWzRdLCAxNiApO1xyXG5cdFx0XHRjb25zdCBiMSA9IHBhcnNlSW50KCB2YWx1ZVs1XSwgMTYgKTtcclxuXHRcdFx0Y29uc3QgYjIgPSBwYXJzZUludCggdmFsdWVbNl0sIDE2ICk7XHJcblx0XHRcdHJldHVybiB0aGlzLnNldFJnYiggcjE8PDR8cjIsIGcxPDw0fGcyLCBiMTw8NHxiMiwgMS4wICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIHZhbHVlLmxlbmd0aD09OSAmJiAvI1swLTlhLWZBLUZdezh9Ly50ZXN0KHZhbHVlKSApIHtcclxuXHRcdFx0Y29uc3QgcjEgPSBwYXJzZUludCggdmFsdWVbMV0sIDE2ICk7XHJcblx0XHRcdGNvbnN0IHIyID0gcGFyc2VJbnQoIHZhbHVlWzJdLCAxNiApO1xyXG5cdFx0XHRjb25zdCBnMSA9IHBhcnNlSW50KCB2YWx1ZVszXSwgMTYgKTtcclxuXHRcdFx0Y29uc3QgZzIgPSBwYXJzZUludCggdmFsdWVbNF0sIDE2ICk7XHJcblx0XHRcdGNvbnN0IGIxID0gcGFyc2VJbnQoIHZhbHVlWzVdLCAxNiApO1xyXG5cdFx0XHRjb25zdCBiMiA9IHBhcnNlSW50KCB2YWx1ZVs2XSwgMTYgKTtcclxuXHRcdFx0Y29uc3QgYTEgPSBwYXJzZUludCggdmFsdWVbN10sIDE2ICk7XHJcblx0XHRcdGNvbnN0IGEyID0gcGFyc2VJbnQoIHZhbHVlWzhdLCAxNiApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRSZ2IoIHIxPDw0fHIyLCBnMTw8NHxnMiwgYjE8PDR8YjIsIChhMTw8NHxhMikgLyAyNTUuMCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCB2YWx1ZS5zdGFydHNXaXRoKCdyZ2JhJykgKSB7XHJcblx0XHRcdGNvbnN0IHJlID0gL3JnYmFcXHMqXFwoXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKigoXFxkKyl8KFxcZCpcXC5cXGQrKXwoXFwuXFxkKykpXFxzKlxcKS87XHJcblx0XHRcdGNvbnN0IG0gPSByZS5leGVjKCB2YWx1ZSApO1xyXG5cdFx0XHRpZiggbSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRSZ2IoIHBhcnNlSW50KG1bMV0pLCBwYXJzZUludChtWzJdKSwgcGFyc2VJbnQobVszXSksIHBhcnNlRmxvYXQobVs0XSkgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiggdmFsdWUuc3RhcnRzV2l0aCgncmdiJykgKSB7XHJcblx0XHRcdGNvbnN0IHJlID0gL3JnYlxccypcXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKlxcKS87XHJcblx0XHRcdGNvbnN0IG0gPSByZS5leGVjKCB2YWx1ZSApO1xyXG5cdFx0XHRpZiggbSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRSZ2IoIHBhcnNlSW50KG1bMV0pLCBwYXJzZUludChtWzJdKSwgcGFyc2VJbnQobVszXSksIDEuMCApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCB2YWx1ZS5zdGFydHNXaXRoKFwidmFyXCIpICkge1xyXG5cdFx0XHRjb25zdCByZSA9IC92YXJcXHMqXFwoKFteKV0qKVxcKS87XHJcblx0XHRcdGNvbnN0IG0gPSByZS5leGVjKCB2YWx1ZSApO1xyXG5cdFx0XHRpZiggbSApIHtcclxuXHRcdFx0XHRjb25zdCBleHByID0gbVsxXS50cmltKCApO1xyXG5cdFx0XHRcdGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICk7XHJcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCBleHByICk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0VmFsdWUoIHZhbHVlICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmludmFsaWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHRoaXMuc2V0UmdiKDI1NSwwLDAsMSk7XHJcblx0fVxyXG5cclxuXHRzZXRIc3YoIGg6IG51bWJlciwgczogbnVtYmVyLCB2OiBudW1iZXIsIGEgPSAxLjAgKTogdGhpcyB7XHJcblx0XHRcclxuXHRcdGxldCBpID0gTWF0aC5taW4oNSwgTWF0aC5mbG9vcihoICogNikpLFxyXG5cdFx0XHRmID0gaCAqIDYgLSBpLFxyXG5cdFx0XHRwID0gdiAqICgxIC0gcyksXHJcblx0XHRcdHEgPSB2ICogKDEgLSBmICogcyksXHJcblx0XHRcdHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyk7XHJcblxyXG5cdFx0bGV0IFIsIEcsIEI7XHJcblxyXG5cdFx0c3dpdGNoIChpKSB7XHJcblx0XHRjYXNlIDA6XHJcblx0XHRcdFIgPSB2O1xyXG5cdFx0XHRHID0gdDtcclxuXHRcdFx0QiA9IHA7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAxOlxyXG5cdFx0XHRSID0gcTtcclxuXHRcdFx0RyA9IHY7XHJcblx0XHRcdEIgPSBwO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgMjpcclxuXHRcdFx0UiA9IHA7XHJcblx0XHRcdEcgPSB2O1xyXG5cdFx0XHRCID0gdDtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRcdFIgPSBwO1xyXG5cdFx0XHRHID0gcTtcclxuXHRcdFx0QiA9IHY7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0XHRSID0gdDtcclxuXHRcdFx0RyA9IHA7XHJcblx0XHRcdEIgPSB2O1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgNTpcclxuXHRcdFx0UiA9IHY7XHJcblx0XHRcdEcgPSBwO1xyXG5cdFx0XHRCID0gcTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuc2V0UmdiKCBSKjI1NSwgRyoyNTUsIEIqMjU1LCBhICk7XHJcblx0fVxyXG5cclxuXHJcblx0c2V0UmdiKCByOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIgKTogdGhpcyB7XHJcblx0XHR0aGlzLnJnYiA9IFtjbGFtcChyLDAsMjU1KSxjbGFtcChnLDAsMjU1KSxjbGFtcChiLDAsMjU1KSxjbGFtcChhLDAsMSldO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHR0b1JnYlN0cmluZyggd2l0aEFscGhhPzogYm9vbGVhbiApOiBzdHJpbmcge1xyXG5cdFx0Y29uc3QgXyA9IHRoaXMucmdiO1xyXG5cdFx0cmV0dXJuIHdpdGhBbHBoYT09PWZhbHNlIHx8IF9bM109PTEgPyBgcmdiKCR7cm91bmQoX1swXSl9LCR7cm91bmQoX1sxXSl9LCR7cm91bmQoX1syXSl9KWAgOiBgcmdiYSgke3JvdW5kKF9bMF0pfSwke3JvdW5kKF9bMV0pfSwke3JvdW5kKF9bMl0pfSwke19bM10udG9GaXhlZCgzKX0pYFxyXG5cdH1cclxuXHJcblx0dG9IZXhTdHJpbmcoICk6IHN0cmluZyB7XHJcblx0XHRjb25zdCBfID0gdGhpcy5yZ2I7XHJcblx0XHRyZXR1cm4gX1szXT09MSA/IGAjKCR7aHgoX1swXSl9LCR7aHgoX1sxXSl9LCR7aHgoX1syXSl9KWAgOiBgcmdiYSgke2h4KF9bMF0pfSwke2h4KF9bMV0pfSwke2h4KF9bMl0pfSwke2h4KF9bM10qMjU1KX0pYFxyXG5cdH1cclxuXHJcblx0dG9SZ2IoICk6IFJnYiB7XHJcblx0XHRjb25zdCBfID0gdGhpcy5yZ2I7XHJcblx0XHRyZXR1cm4geyByZWQ6IF9bMF0sIGdyZWVuOiBfWzFdLCBibHVlOiBfWzJdLCBhbHBoYTogX1szXSB9O1xyXG5cdH1cclxuXHJcblx0dG9Ic3YoICk6IEhzdiB7XHJcblx0XHRcclxuXHRcdGxldCBlbCA9IHRoaXMudG9SZ2IoICk7XHJcblxyXG5cdFx0ZWwucmVkIC89IDI1NS4wO1xyXG5cdFx0ZWwuZ3JlZW4gLz0gMjU1LjA7XHJcblx0XHRlbC5ibHVlIC89IDI1NS4wO1xyXG5cdFx0XHJcblx0XHRjb25zdCBtYXggPSBNYXRoLm1heChlbC5yZWQsIGVsLmdyZWVuLCBlbC5ibHVlKTtcclxuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKGVsLnJlZCwgZWwuZ3JlZW4sIGVsLmJsdWUpO1xyXG5cdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XHJcblx0XHRjb25zdCBzYXR1cmF0aW9uID0gKG1heCA9PT0gMCkgPyAwIDogKGRlbHRhIC8gbWF4KTtcclxuXHRcdGNvbnN0IHZhbHVlID0gbWF4O1xyXG5cclxuXHRcdGxldCBodWU7XHJcblxyXG5cdFx0aWYgKGRlbHRhID09PSAwKSB7XHJcblx0XHRcdGh1ZSA9IDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0c3dpdGNoIChtYXgpIHtcclxuXHRcdFx0Y2FzZSBlbC5yZWQ6XHJcblx0XHRcdFx0aHVlID0gKGVsLmdyZWVuIC0gZWwuYmx1ZSkgLyBkZWx0YSAvIDYgKyAoZWwuZ3JlZW4gPCBlbC5ibHVlID8gMSA6IDApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBlbC5ncmVlbjpcclxuXHRcdFx0XHRodWUgPSAoZWwuYmx1ZSAtIGVsLnJlZCkgLyBkZWx0YSAvIDYgKyAxIC8gMztcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgZWwuYmx1ZTpcclxuXHRcdFx0XHRodWUgPSAoZWwucmVkIC0gZWwuZ3JlZW4pIC8gZGVsdGEgLyA2ICsgMiAvIDM7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4geyBodWUsIHNhdHVyYXRpb24sIHZhbHVlLCBhbHBoYTogZWwuYWxwaGEgfTtcclxuXHR9XHJcblxyXG5cdGdldEFscGhhKCApIHtcclxuXHRcdHJldHVybiB0aGlzLnJnYlszXTtcclxuXHR9XHJcblxyXG5cdHNldEFscGhhKCBhOiBudW1iZXIgKTogdGhpcyB7XHJcblx0XHR0aGlzLnJnYlszXSA9IGNsYW1wKCBhLCAwLCAxICk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGlzSW52YWxpZCggKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbnZhbGlkO1xyXG5cdH1cclxufSIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBjb3JlX2RyYWdkcm9wLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL2NvcmVfdG9vbHMnO1xyXG5cclxuY29uc3QgeF9kcmFnX2NiID0gU3ltYm9sKCAneC1kcmFnLWNiJyApO1xyXG5cclxuaW50ZXJmYWNlIERyb3BJbmZvIHtcclxuXHRwdDogUG9pbnQ7XHJcblx0ZGF0YTogRGF0YVRyYW5zZmVyO1xyXG59XHJcblxyXG50eXBlIERyb3BDYWxsYmFjayA9ICggY29tbWFuZDogJ2VudGVyJyB8ICdsZWF2ZScgfCAnZHJhZycgfCAnZHJvcCcsIGVsOiBDb21wb25lbnQsIGluZm9zOiBEcm9wSW5mbyApID0+IHZvaWQ7XHJcbnR5cGUgRmlsdGVyQ2FsbGJhY2sgPSAoIGVsOiBDb21wb25lbnQgKSA9PiBib29sZWFuO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcblxyXG5jbGFzcyBEcmFnTWFuYWdlciB7XHJcblxyXG5cdGRyYWdTb3VyY2U6IENvbXBvbmVudDtcclxuXHRkcmFnR2hvc3Q6IEhUTUxFbGVtZW50O1xyXG5cdGRyb3BUYXJnZXQ6IENvbXBvbmVudDtcclxuXHRcclxuXHRub3RpZmllZDogQ29tcG9uZW50O1xyXG5cdFxyXG5cdHRpbWVyOiBhbnk7IC8vIHBiIHdpdGggbmFtZSBvZiBzZXR0aW1lb3V0IHJldHVyblxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cmVnaXN0ZXJEcmFnZ2FibGVFbGVtZW50KGVsOiBDb21wb25lbnQpIHtcclxuXHJcblx0XHRlbC5hZGRET01FdmVudCgnZHJhZ3N0YXJ0JywgKGV2OiBEcmFnRXZlbnQpID0+IHtcclxuXHJcblx0XHRcdHRoaXMuZHJhZ1NvdXJjZSA9IGVsO1xyXG5cdFx0XHR0aGlzLmRyYWdHaG9zdCA9IGVsLmRvbS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmRyYWdHaG9zdC5jbGFzc0xpc3QuYWRkKCdkcmFnZ2VkJyk7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kcmFnR2hvc3QpO1xyXG5cclxuXHRcdFx0ZWwuYWRkQ2xhc3MoICdkcmFnZ2luZycgKTtcclxuXHJcblx0XHRcdGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3N0cmluZycsICcxJyk7XHJcblx0XHRcdGV2LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV3IEltYWdlKCksIDAsIDApO1xyXG5cclxuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZWwuYWRkRE9NRXZlbnQoJ2RyYWcnLCAoZXY6IERyYWdFdmVudCkgPT4ge1xyXG5cdFx0XHR0aGlzLmRyYWdHaG9zdC5zdHlsZS5sZWZ0ID0gZXYucGFnZVggKyBcInB4XCI7XHJcblx0XHRcdHRoaXMuZHJhZ0dob3N0LnN0eWxlLnRvcCA9IGV2LnBhZ2VZICsgXCJweFwiO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZWwuYWRkRE9NRXZlbnQoJ2RyYWdlbmQnLCAoZXY6IERyYWdFdmVudCkgPT4ge1xyXG5cdFx0XHRlbC5yZW1vdmVDbGFzcyggJ2RyYWdnaW5nJyApO1xyXG5cdFx0XHR0aGlzLmRyYWdHaG9zdC5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGVsLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgXCJ0cnVlXCIpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHJlZ2lzdGVyRHJvcFRhcmdldChlbDogQ29tcG9uZW50LCBjYjogRHJvcENhbGxiYWNrLCBmaWx0ZXJDQj86IEZpbHRlckNhbGxiYWNrICkge1xyXG5cclxuXHRcdGNvbnN0IGRyYWdFbnRlciA9IChldjogRHJhZ0V2ZW50KSA9PiB7XHJcblx0XHRcdGlmKCBmaWx0ZXJDQiAmJiAhZmlsdGVyQ0IodGhpcy5kcmFnU291cmNlKSApIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3JlamVjdCAnLCBlbCApO1xyXG5cdFx0XHRcdGV2LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ25vbmUnO1x0XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZyggJ2FjY2VwdGVkICcsIGVsICk7XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGV2LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCBkcmFnT3ZlciA9IChldjogRHJhZ0V2ZW50KSA9PiB7XHJcblx0XHRcdC8vY29uc29sZS5sb2coIFwiZHJhZ292ZXJcIiwgZXYudGFyZ2V0ICk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiggZmlsdGVyQ0IgJiYgIWZpbHRlckNCKHRoaXMuZHJhZ1NvdXJjZSkgKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coICdyZWplY3QgJywgZWwgKTtcclxuXHRcdFx0XHRldi5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdub25lJztcdFxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmRyb3BUYXJnZXQgIT0gZWwpIHtcclxuXHRcdFx0XHR0aGlzLmRyb3BUYXJnZXQgPSBlbDtcclxuXHRcdFx0XHR0aGlzLl9zdGFydENoZWNrKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCB0aGlzLmRyb3BUYXJnZXQgKSB7XHJcblx0XHRcdFx0Y29uc3QgaW5mb3MgPSB7XHJcblx0XHRcdFx0XHRwdDogeyB4OiBldi5wYWdlWCwgeTogZXYucGFnZVkgfSxcclxuXHRcdFx0XHRcdGRhdGE6IGV2LmRhdGFUcmFuc2ZlcixcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNiKCAnZHJhZycsIHRoaXMuZHJhZ1NvdXJjZSwgaW5mb3MgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXYuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weSc7XHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0IGRyYWdMZWF2ZSA9IChldjogRHJhZ0V2ZW50KSA9PiB7XHJcblx0XHRcdC8vY29uc29sZS5sb2coIFwiZHJhZ2xlYXZlXCIsIGV2LnRhcmdldCApO1xyXG5cdFx0XHR0aGlzLmRyb3BUYXJnZXQgPSBudWxsO1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCBkcm9wID0gKGV2OiBEcmFnRXZlbnQpID0+IHtcclxuXHRcdFx0Y29uc3QgaW5mb3MgPSB7XHJcblx0XHRcdFx0cHQ6IHsgeDogZXYucGFnZVgsIHk6IGV2LnBhZ2VZIH0sXHJcblx0XHRcdFx0ZGF0YTogZXYuZGF0YVRyYW5zZmVyLFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYignZHJvcCcsIHRoaXMuZHJhZ1NvdXJjZSwgaW5mb3MgKTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuZHJvcFRhcmdldCA9IG51bGw7XHJcblx0XHRcdGVsLnJlbW92ZUNsYXNzKCdkcm9wLW92ZXInKTtcclxuXHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWwuYWRkRE9NRXZlbnQoJ2RyYWdlbnRlcicsIGRyYWdFbnRlcik7XHJcblx0XHRlbC5hZGRET01FdmVudCgnZHJhZ292ZXInLCBkcmFnT3Zlcik7XHJcblx0XHRlbC5hZGRET01FdmVudCgnZHJhZ2xlYXZlJywgZHJhZ0xlYXZlKTtcclxuXHRcdGVsLmFkZERPTUV2ZW50KCdkcm9wJywgZHJvcCk7XHJcblxyXG5cdFx0ZWwuc2V0SW50ZXJuYWxEYXRhKCB4X2RyYWdfY2IsIGNiICk7XHJcblx0fVxyXG5cclxuXHRfc3RhcnRDaGVjaygpIHtcclxuXHJcblx0XHRpZiAodGhpcy50aW1lcikge1xyXG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xyXG5cdFx0XHR0aGlzLl9jaGVjayggKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoICgpID0+IHRoaXMuX2NoZWNrKCksIDMwMCApO1xyXG5cdH1cclxuXHJcblx0X2NoZWNrKCApIHtcclxuXHJcblx0XHRjb25zdCBsZWF2aW5nID0gKCB4OiBDb21wb25lbnQgKSA9PiB7XHJcblx0XHRcdHgucmVtb3ZlQ2xhc3MoJ2Ryb3Atb3ZlcicpO1xyXG5cclxuXHRcdFx0Y29uc3QgY2IgPSB4LmdldEludGVybmFsRGF0YSggeF9kcmFnX2NiICk7XHJcblx0XHRcdGNiKCAnbGVhdmUnLCB0aGlzLmRyYWdTb3VyY2UgKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBlbnRlcmluZyA9ICggeDogQ29tcG9uZW50ICkgPT4ge1xyXG5cdFx0XHR4LmFkZENsYXNzKCdkcm9wLW92ZXInKTtcclxuXHRcdFx0Y29uc3QgY2IgPSB4LmdldEludGVybmFsRGF0YSggeF9kcmFnX2NiICk7XHJcblx0XHRcdGNiKCAnZW50ZXInLCB0aGlzLmRyYWdTb3VyY2UgKTtcclxuXHRcdH1cclxuXHRcclxuXHRcdGlmICh0aGlzLmRyb3BUYXJnZXQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLm5vdGlmaWVkIHx8IHRoaXMubm90aWZpZWQgIT0gdGhpcy5kcm9wVGFyZ2V0KSB7XHJcblxyXG5cdFx0XHRcdGlmKCB0aGlzLm5vdGlmaWVkICkge1xyXG5cdFx0XHRcdFx0bGVhdmluZyggdGhpcy5ub3RpZmllZCApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRcdHRoaXMubm90aWZpZWQgPSB0aGlzLmRyb3BUYXJnZXQ7XHJcblx0XHRcdFx0ZW50ZXJpbmcoIHRoaXMubm90aWZpZWQgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLm5vdGlmaWVkKSB7XHJcblx0XHRcdFx0bGVhdmluZyggdGhpcy5ub3RpZmllZCApO1xyXG5cdFx0XHRcdHRoaXMubm90aWZpZWQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZHJhZ01hbmFnZXIgPSBuZXcgRHJhZ01hbmFnZXIoKTsiLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgY29yZV9yb3V0ZXIudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgRXZFcnJvciB9IGZyb20gJy4vY29tcG9uZW50LmpzJztcclxuaW1wb3J0IHsgRXZlbnRNYXAsIEV2ZW50U291cmNlIH0gZnJvbSAnLi9jb3JlX2V2ZW50cy5qcyc7XHJcblxyXG50eXBlIFJvdXRlSGFuZGxlciA9ICggcGFyYW1zOiBhbnksIHBhdGg6IHN0cmluZyApID0+IHZvaWQ7XHJcblxyXG5pbnRlcmZhY2UgU2VnbWVudCB7XHJcblx0a2V5czogc3RyaW5nW10sXHJcblx0cGF0dGVybjogUmVnRXhwO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUm91dGUge1xyXG5cdGtleXM6IHN0cmluZ1tdLFxyXG5cdHBhdHRlcm46IFJlZ0V4cDtcclxuXHRoYW5kbGVyOiBSb3V0ZUhhbmRsZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlUm91dGUoc3RyOiBzdHJpbmcgfCBSZWdFeHAsIGxvb3NlID0gZmFsc2UpOiBTZWdtZW50IHtcclxuXHJcblx0aWYgKHN0ciBpbnN0YW5jZW9mIFJlZ0V4cCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0a2V5czogbnVsbCxcclxuXHRcdFx0cGF0dGVybjogc3RyXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y29uc3QgYXJyID0gc3RyLnNwbGl0KCcvJyk7XHJcblxyXG5cdGxldCBrZXlzID0gW107XHJcblx0bGV0IHBhdHRlcm4gPSAnJztcclxuXHJcblx0aWYoIGFyclswXT09JycgKSB7XHJcblx0XHRhcnIuc2hpZnQoKTtcclxuXHR9XHJcblxyXG5cdGZvciAoY29uc3QgdG1wIG9mIGFycikge1xyXG5cdFx0Y29uc3QgYyA9IHRtcFswXTtcclxuXHJcblx0XHRpZiAoYyA9PT0gJyonKSB7XHJcblx0XHRcdGtleXMucHVzaCgnd2lsZCcpO1xyXG5cdFx0XHRwYXR0ZXJuICs9ICcvKC4qKSc7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChjID09PSAnOicpIHtcclxuXHRcdFx0Y29uc3QgbyA9IHRtcC5pbmRleE9mKCc/JywgMSk7XHJcblx0XHRcdGNvbnN0IGV4dCA9IHRtcC5pbmRleE9mKCcuJywgMSk7XHJcblxyXG5cdFx0XHRrZXlzLnB1c2godG1wLnN1YnN0cmluZygxLCBvID49IDAgPyBvIDogZXh0ID49IDAgPyBleHQgOiB0bXAubGVuZ3RoKSk7XHJcblx0XHRcdHBhdHRlcm4gKz0gbyA+PSAwICYmIGV4dCA8IDAgPyAnKD86LyhbXlxcL10rPykpPycgOiAnLyhbXlxcL10rPyknO1xyXG5cdFx0XHRpZiAoZXh0ID49IDApIHtcclxuXHRcdFx0XHRwYXR0ZXJuICs9IChvID49IDAgPyAnPycgOiAnJykgKyAnXFxcXCcgKyB0bXAuc3Vic3RyaW5nKGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRwYXR0ZXJuICs9ICcvJyArIHRtcDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRrZXlzLFxyXG5cdFx0cGF0dGVybjogbmV3IFJlZ0V4cCggYF4ke3BhdHRlcm59JHtsb29zZSA/ICcoPz0kfFxcLyknIDogJ1xcLz8kJ31gLCAnaScgKVxyXG5cdH07XHJcbn1cclxuXHJcbmludGVyZmFjZSBSb3V0ZXJFdmVudHMgZXh0ZW5kcyBFdmVudE1hcCB7XHJcblx0ZXJyb3I6IEV2RXJyb3I7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogbWljcm8gcm91dGVyXHJcbiAqIFxyXG4gKiBgYGBcclxuICogY29uc3Qgcm91dGVyID0gbmV3IFJvdXRlciggKTtcclxuICogXHJcbiAqIHJvdXRlci5nZXQoIFwiL2RldGFpbC86aWRcIiwgKCBwYXJhbXM6IGFueSApID0+IHtcclxuICogXHR0aGlzLl9zaG93RGV0YWlsKCBkZXRhaWwgKTtcclxuICogfSApO1xyXG4gKiBcclxuICogcm91dGVyLmdldCggXCIvOmlkXCIsICggcGFyYW1zOiBhbnkgKSA9PiB7XHJcbiAqICAgaWYoIHBhcmFtcy5pZD09MCApXHJcbiAqIFx0XHRyb3V0ZXIubmF2aWdhdGUoICcvaG9tZScgKTtcclxuICpcdCB9XHJcbiAqIH0pO1xyXG4gKiBcclxuICogcm91dGVyLm9uKCBcImVycm9yXCIsICggKSA9PiB7XHJcbiAqIFx0cm91dGVyLm5hdmlnYXRlKCAnL2hvbWUnICk7XHJcbiAqIH0pXHJcbiAqIFxyXG4gKiByb3V0ZXIuaW5pdCggKTtcclxuICogYGBgXHJcbiAqL1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBFdmVudFNvdXJjZTwgUm91dGVyRXZlbnRzID4ge1xyXG5cclxuXHRwcml2YXRlIG1fcm91dGVzOiBSb3V0ZVtdO1xyXG5cdHByaXZhdGUgbV91c2VIYXNoOiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3RvciggdXNlSGFzaCA9IHRydWUgKSB7XHJcblx0XHRzdXBlciggKTtcclxuXHJcblx0XHR0aGlzLm1fcm91dGVzID0gW107XHJcblx0XHR0aGlzLm1fdXNlSGFzaCA9IHVzZUhhc2g7XHJcblxyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdGNvbnN0IHVybCA9IHRoaXMuX2dldExvY2F0aW9uKCApO1xyXG5cdFx0XHRjb25zdCBmb3VuZCA9IHRoaXMuX2ZpbmQodXJsKTtcclxuXHRcdFxyXG5cdFx0XHRmb3VuZC5oYW5kbGVycy5mb3JFYWNoKGggPT4ge1xyXG5cdFx0XHRcdGgoZm91bmQucGFyYW1zLHVybCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRnZXQodXJpOiBzdHJpbmcgfCBSZWdFeHAsIGhhbmRsZXI6IFJvdXRlSGFuZGxlciApIHtcclxuXHRcdGxldCB7IGtleXMsIHBhdHRlcm4gfSA9IHBhcnNlUm91dGUodXJpKTtcclxuXHRcdHRoaXMubV9yb3V0ZXMucHVzaCh7IGtleXMsIHBhdHRlcm4sIGhhbmRsZXIgfSk7XHJcblx0fVxyXG5cclxuXHRpbml0KCkge1xyXG5cdFx0dGhpcy5uYXZpZ2F0ZSggdGhpcy5fZ2V0TG9jYXRpb24oKSApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TG9jYXRpb24oICkge1xyXG5cdFx0cmV0dXJuIHRoaXMubV91c2VIYXNoID8gJy8nK2RvY3VtZW50LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpIDogZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWU7XHJcblx0fVxyXG5cclxuXHRuYXZpZ2F0ZSggdXJpOiBzdHJpbmcsIG5vdGlmeSA9IHRydWUsIHJlcGxhY2UgPSBmYWxzZSApIHtcclxuXHJcblx0XHRpZiggIXVyaS5zdGFydHNXaXRoKCcvJykgKSB7XHJcblx0XHRcdHVyaSA9ICcvJyt1cmk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZm91bmQgPSB0aGlzLl9maW5kKCB1cmkgKTtcclxuXHJcblx0XHRpZiggIWZvdW5kIHx8IGZvdW5kLmhhbmRsZXJzLmxlbmd0aD09MCApIHtcclxuXHRcdFx0Ly93aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCAnZXJyb3InKVxyXG5cdFx0XHRjb25zb2xlLmxvZyggJ3JvdXRlIG5vdCBmb3VuZDogJyt1cmkgKTtcclxuXHRcdFx0dGhpcy5maXJlKCBcImVycm9yXCIsIHtjb2RlOiA0MDQsIG1lc3NhZ2U6IFwicm91dGUgbm90IGZvdW5kXCIgfSApO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIHRoaXMubV91c2VIYXNoICkge1xyXG5cdFx0XHR3aGlsZSggdXJpLmF0KDApPT0nLycgKSB7XHJcblx0XHRcdFx0dXJpID0gdXJpLnN1YnN0cmluZyggMSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR1cmkgPSAnIycrdXJpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiggcmVwbGFjZSApIHtcclxuXHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCAnJywgdXJpICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgdXJpICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIG5vdGlmeSApIHtcclxuXHRcdFx0Zm91bmQuaGFuZGxlcnMuZm9yRWFjaCggaCA9PiB7XHJcblx0XHRcdFx0aCggZm91bmQucGFyYW1zLCB1cmkgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZmluZCggdXJsOiBzdHJpbmcgKTogeyBwYXJhbXM6IFJlY29yZDxzdHJpbmcsYW55PiwgaGFuZGxlcnM6IFJvdXRlSGFuZGxlcltdIH0ge1xyXG5cdFx0XHJcblx0XHRsZXQgbWF0Y2hlcyA9IFtdO1xyXG5cdFx0bGV0IHBhcmFtczogUmVjb3JkPHN0cmluZyxhbnk+ID0ge307XHJcblx0XHRsZXQgaGFuZGxlcnM6IFJvdXRlSGFuZGxlcltdID0gW107XHJcblxyXG5cdFx0Zm9yIChjb25zdCB0bXAgb2YgdGhpcy5tX3JvdXRlcyApIHtcclxuXHRcdFx0aWYgKCF0bXAua2V5cyApIHtcclxuXHRcdFx0XHRtYXRjaGVzID0gdG1wLnBhdHRlcm4uZXhlYyh1cmwpO1xyXG5cdFx0XHRcdGlmICghbWF0Y2hlcykge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2hlc1snZ3JvdXBzJ10pIHtcclxuXHRcdFx0XHRcdGZvciAoY29uc3QgayBpbiBtYXRjaGVzWydncm91cHMnXSkge1xyXG5cdFx0XHRcdFx0XHRwYXJhbXNba10gPSBtYXRjaGVzWydncm91cHMnXVtrXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGhhbmRsZXJzID0gWy4uLmhhbmRsZXJzLCB0bXAuaGFuZGxlcl07XHJcblx0XHRcdH0gXHJcblx0XHRcdGVsc2UgaWYgKHRtcC5rZXlzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRtYXRjaGVzID0gdG1wLnBhdHRlcm4uZXhlYyh1cmwpO1xyXG5cdFx0XHRcdGlmIChtYXRjaGVzID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvciAoIGxldCBqID0gMDsgaiA8IHRtcC5rZXlzLmxlbmd0aDspIHtcclxuXHRcdFx0XHRcdHBhcmFtc1t0bXAua2V5c1tqXV0gPSBtYXRjaGVzWysral07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRoYW5kbGVycyA9IFsuLi5oYW5kbGVycywgdG1wLmhhbmRsZXJdO1xyXG5cdFx0XHR9IFxyXG5cdFx0XHRlbHNlIGlmICh0bXAucGF0dGVybi50ZXN0KHVybCkpIHtcclxuXHRcdFx0XHRoYW5kbGVycyA9IFsuLi5oYW5kbGVycywgdG1wLmhhbmRsZXJdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHsgcGFyYW1zLCBoYW5kbGVycyB9O1xyXG5cdH1cclxufVxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIGNvcmVfc3ZnLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50UHJvcHMgfSBmcm9tICcuL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IGlzVW5pdExlc3MgfSBmcm9tIFwiLi9jb3JlX3N0eWxlc1wiO1xyXG5pbXBvcnQgeyBET01FdmVudEhhbmRsZXIsIEdsb2JhbERPTUV2ZW50cywgYWRkRXZlbnQgfSBmcm9tICcuL2NvcmVfZG9tJztcclxuaW1wb3J0IHsgaXNOdW1iZXIsIGlzU3RyaW5nIH0gZnJvbSAnLi9jb3JlX3Rvb2xzJztcclxuXHJcbmNvbnN0IFNWR19OUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjsgXHJcblxyXG4vLyBkZWdyZWVzIHRvIHJhZGlhblxyXG5mdW5jdGlvbiBkMnIoIGQ6IG51bWJlciApOiBudW1iZXIge1xyXG5cdHJldHVybiBkICogTWF0aC5QSSAvIDE4MC4wO1xyXG59XHJcblxyXG4vLyBwb2xhciB0byBjYXJ0ZXNpYW5cclxuZnVuY3Rpb24gcDJjKCB4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyLCBkZWc6IG51bWJlciApOiB7eDogbnVtYmVyLHk6IG51bWJlcn0ge1xyXG5cdGNvbnN0IHJhZCA9IGQyciggZGVnICk7XHJcblx0cmV0dXJuIHtcclxuXHRcdHg6IHggKyByICogTWF0aC5jb3MoIHJhZCApLFxyXG5cdFx0eTogeSArIHIgKiBNYXRoLnNpbiggcmFkIClcclxuXHR9O1xyXG59XHJcblxyXG4vLyBmaXggcHJlYyBmb3IgbnVtYmVyc1xyXG5mdW5jdGlvbiBudW0oIHg6IG51bWJlciApOiBudW1iZXIge1xyXG5cdHJldHVybiBNYXRoLnJvdW5kKCB4ICogMTAwMCApIC8gMTAwMDtcclxufVxyXG5cclxuLy8gY2xlYW4gdmFsdWVzXHJcbmZ1bmN0aW9uIGNsZWFuKCBhOiBhbnksIC4uLmI6IGFueSApIHtcclxuXHQvLyBqdXN0IHJvdW5kIG51bWJlciB2YWx1ZXMgdG8gMyBkaWdpdHNcclxuXHRiID0gYi5tYXAoICggdjogYW55ICkgPT4ge1xyXG5cdFx0aWYoIHR5cGVvZiB2ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2KSApIHtcclxuXHRcdFx0cmV0dXJuIG51bSh2KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdjtcclxuXHR9KTtcclxuXHJcblx0cmV0dXJuIFN0cmluZy5yYXcoIGEsIC4uLmIgKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5jbGFzcyBTdmdJdGVtIHtcclxuXHRwcm90ZWN0ZWQgX2RvbSA6IFNWR0VsZW1lbnQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCB0YWc6IHN0cmluZyApIHtcclxuXHRcdHRoaXMuX2RvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIHRhZyApOyBcclxuXHR9XHJcblxyXG5cdGdldERvbSggKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZG9tO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogY2hhbmdlIHRoZSBzdHJva2UgY29sb3JcclxuXHQgKiBAcGFyYW0gY29sb3IgXHJcblx0ICovXHJcblxyXG5cdHN0cm9rZSggY29sb3I6IHN0cmluZywgd2lkdGg/OiBudW1iZXIgKTogdGhpcyB7XHJcblx0XHR0aGlzLnNldEF0dHIoICdzdHJva2UnLCBjb2xvciApO1xyXG5cdFx0aWYoIHdpZHRoIT09dW5kZWZpbmVkICkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHIoICdzdHJva2Utd2lkdGgnLCB3aWR0aCsncHgnICk7XHRcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogY2hhbmdlIHRoZSBzdHJva2Ugd2lkdGhcclxuXHQgKiBAcGFyYW0gd2lkdGggXHJcblx0ICovXHJcblx0c3Ryb2tlV2lkdGgoIHdpZHRoOiBudW1iZXIgKTogdGhpcyB7XHJcblx0XHR0aGlzLnNldEF0dHIoICdzdHJva2Utd2lkdGgnLCB3aWR0aCsncHgnICk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0cm9rZUNhcCggY2FwOiBcImJ1dHRcIiB8IFwicm91bmRcIiB8IFwic3FhdXJlXCIgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZXRBdHRyKCBcInN0cm9rZS1saW5lY2FwXCIsIGNhcCApO1xyXG5cdH1cclxuXHJcblx0c3Ryb2tlT3BhY2l0eSggb3BhY2l0eTogbnVtYmVyICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuc2V0QXR0ciggXCJzdHJva2Utb3BhY2l0eVwiLCBvcGFjaXR5K1wiXCIgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRhbnRpQWxpYXMoIHNldDogYm9vbGVhbiApIHtcclxuXHRcdHJldHVybiB0aGlzLnNldEF0dHIoIFwic2hhcGUtcmVuZGVyaW5nXCIsIHNldCA/IFwiYXV0b1wiIDogXCJjcmlzcEVkZ2VzXCIgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIGNoYW5nZSB0aGUgZmlsbCBjb2xvclxyXG5cdCAqIEBwYXJhbSBjb2xvciBcclxuXHQgKi9cclxuXHJcblx0ZmlsbCggY29sb3I6IHN0cmluZyApOiB0aGlzIHtcclxuXHRcdHRoaXMuc2V0QXR0ciggJ2ZpbGwnLCBjb2xvciApO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRub19maWxsKCApOiB0aGlzIHtcclxuXHRcdHRoaXMuc2V0QXR0ciggJ2ZpbGwnLCBcInRyYW5zcGFyZW50XCIgKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogZGVmaW5lIGEgbmV3IGF0dHJpYnV0ZVxyXG5cdCAqIEBwYXJhbSBuYW1lIGF0dGlidXRlIG5hbWVcclxuXHQgKiBAcGFyYW0gdmFsdWUgYXR0cmlidXRlIHZhbHVlXHJcblx0ICogQHJldHVybnMgdGhpc1xyXG5cdCAqL1xyXG5cclxuXHRzZXRBdHRyKCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgKSA6IHRoaXMge1xyXG5cdFx0dGhpcy5fZG9tLnNldEF0dHJpYnV0ZSggbmFtZSwgdmFsdWUgKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHNldFN0eWxlPEsgZXh0ZW5kcyBrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uPiggbmFtZTogSywgdmFsdWU6IHN0cmluZyB8IG51bWJlciApIDogdGhpcyB7XHJcblx0XHRjb25zdCBfc3R5bGUgPSB0aGlzLl9kb20uc3R5bGU7XHJcblxyXG5cdFx0aWYoIGlzTnVtYmVyKHZhbHVlKSApIHtcclxuXHRcdFx0bGV0IHYgPSB2YWx1ZStcIlwiO1xyXG5cdFx0XHRpZiggIWlzVW5pdExlc3MobmFtZSBhcyBzdHJpbmcpICkge1xyXG5cdFx0XHRcdHYgKz0gXCJweFwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQoX3N0eWxlIGFzIGFueSlbbmFtZV0gPSB2O1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdChfc3R5bGUgYXMgYW55KVtuYW1lXSA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogYWRkIGEgY2xhc3NcclxuXHQgKiBAcGFyYW0gbmFtZSBjbGFzcyBuYW1lIHRvIGFkZCBcclxuXHQgKi9cclxuXHRcclxuXHRhZGRDbGFzcyggY2xzOiBzdHJpbmcgKSB7XHJcblx0XHRpZiggIWNscyApIHJldHVybjtcclxuXHRcdFxyXG5cdFx0aWYoIGNscy5pbmRleE9mKCcgJyk+PTAgKSB7XHJcblx0XHRcdGNvbnN0IGNjcyA9IGNscy5zcGxpdCggXCIgXCIgKTtcclxuXHRcdFx0dGhpcy5fZG9tLmNsYXNzTGlzdC5hZGQoLi4uY2NzKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9kb20uY2xhc3NMaXN0LmFkZChjbHMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGNsaXAoIGlkOiBzdHJpbmcgKTogdGhpcyB7XHJcblx0XHR0aGlzLnNldEF0dHIoIFwiY2xpcC1wYXRoXCIsIGB1cmwoIyR7aWR9KWAgKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHRyYW5zZm9ybSggdHI6IHN0cmluZyApOiB0aGlzIHtcclxuXHRcdHRoaXMuc2V0QXR0ciggXCJ0cmFuc2Zvcm1cIiwgdHIgKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHJvdGF0ZSggZGVnOiBudW1iZXIsIGN4OiBudW1iZXIsIGN5OiBudW1iZXIgKTogdGhpcyB7XHJcblx0XHR0aGlzLnRyYW5zZm9ybSggYHJvdGF0ZSggJHtkZWd9ICR7Y3h9ICR7Y3l9IClgICk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHRyYW5zbGF0ZSggZHg6IG51bWJlciwgZHk6IG51bWJlciApOiB0aGlzIHtcclxuXHRcdHRoaXMudHJhbnNmb3JtKCBgdHJhbnNsYXRlKCAke2R4fSAke2R5fSApYCApO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzY2FsZSggeDogbnVtYmVyICk6IHRoaXMge1xyXG5cdFx0dGhpcy50cmFuc2Zvcm0oIGBzY2FsZSggJHt4fSApYCApO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0YWRkRE9NRXZlbnQ8SyBleHRlbmRzIGtleW9mIEdsb2JhbERPTUV2ZW50cz4oIG5hbWU6IEssIGxpc3RlbmVyOiBHbG9iYWxET01FdmVudHNbS10sIHByZXBlbmQgPSBmYWxzZSApIHtcclxuXHRcdGFkZEV2ZW50KCB0aGlzLl9kb20sIG5hbWUsIGxpc3RlbmVyIGFzIERPTUV2ZW50SGFuZGxlciwgcHJlcGVuZCApO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgU3ZnUGF0aCBleHRlbmRzIFN2Z0l0ZW0ge1xyXG5cdHByaXZhdGUgX3BhdGg6IHN0cmluZztcclxuXHJcblx0Y29uc3RydWN0b3IoICkge1xyXG5cdFx0c3VwZXIoICdwYXRoJyApO1xyXG5cdFx0dGhpcy5fcGF0aCA9ICcnO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfdXBkYXRlKCApOiB0aGlzIHtcclxuXHRcdHRoaXMuc2V0QXR0ciggJ2QnLCB0aGlzLl9wYXRoICk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIG1vdmUgdGhlIGN1cnJlbnQgcG9zXHJcblx0ICogQHBhcmFtIHggbmV3IHBvcyB4XHJcblx0ICogQHBhcmFtIHkgbmV3IHBvcyB5XHJcblx0ICogQHJldHVybnMgdGhpc1xyXG5cdCAqL1xyXG5cclxuXHRtb3ZlVG8oIHg6IG51bWJlciwgeTogbnVtYmVyICkgOiB0aGlzIHtcclxuXHRcdHRoaXMuX3BhdGggKz0gY2xlYW5gTSR7eH0sJHt5fWA7XHJcblx0XHRyZXR1cm4gdGhpcy5fdXBkYXRlKCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogZHJhdyBhbGluZSB0byB0aGUgZ2l2ZW4gcG9pbnRcclxuXHQgKiBAcGFyYW0geCBlbmQgeFxyXG5cdCAqIEBwYXJhbSB5IGVuZCB5XHJcblx0ICogQHJldHVybnMgdGhpc1xyXG5cdCAqL1xyXG5cclxuXHRsaW5lVG8oIHg6IG51bWJlciwgeTogbnVtYmVyICk6IHRoaXMge1xyXG5cdFx0dGhpcy5fcGF0aCArPSBjbGVhbmBMJHt4fSwke3l9YDtcclxuXHRcdHJldHVybiB0aGlzLl91cGRhdGUoICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBjbG9zZSB0aGUgY3VycmVudFBhdGhcclxuXHQgKi9cclxuXHJcblx0Y2xvc2VQYXRoKCApOiB0aGlzIHtcclxuXHRcdHRoaXMuX3BhdGggKz0gJ1onO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3VwZGF0ZSggKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIGRyYXcgYW4gYXJjXHJcblx0ICogQHBhcmFtIHggY2VudGVyIHhcclxuXHQgKiBAcGFyYW0geSBjZW50ZXIgeVxyXG5cdCAqIEBwYXJhbSByIHJhZGl1c1xyXG5cdCAqIEBwYXJhbSBzdGFydCBhbmdsZSBzdGFydCBpbiBkZWdyZWVzXHJcblx0ICogQHBhcmFtIGVuZCBhbmdsZSBlbmQgaW4gZGVncmVlc1xyXG5cdCAqIEByZXR1cm5zIHRoaXNcclxuXHQgKi9cclxuXHJcblx0YXJjKCB4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciApOiB0aGlzIHtcclxuXHJcblx0XHRjb25zdCBzdCA9IHAyYyggeCwgeSwgciwgc3RhcnQtOTAgKTtcclxuXHRcdGNvbnN0IGVuID0gcDJjKCB4LCB5LCByLCBlbmQtOTAgKTtcclxuXHJcblx0XHRjb25zdCBmbGFnID0gZW5kIC0gc3RhcnQgPD0gMTgwID8gXCIwXCIgOiBcIjFcIjtcclxuXHRcdHRoaXMuX3BhdGggKz0gY2xlYW5gTSR7c3QueH0sJHtzdC55fUEke3J9LCR7cn0gMCAke2ZsYWd9IDEgJHtlbi54fSwke2VuLnl9YDtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuX3VwZGF0ZSggKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgU3ZnVGV4dCBleHRlbmRzIFN2Z0l0ZW0ge1xyXG5cclxuXHRjb25zdHJ1Y3RvciggeDogbnVtYmVyLCB5OiBudW1iZXIsIHR4dDogc3RyaW5nICkge1xyXG5cdFx0c3VwZXIoICd0ZXh0JyApO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNldEF0dHIoICd4JywgbnVtKHgpKycnICk7XHJcblx0XHR0aGlzLnNldEF0dHIoICd5JywgbnVtKHkpKycnICk7XHJcblxyXG5cdFx0dGhpcy5fZG9tLmlubmVySFRNTCA9IHR4dDtcclxuXHR9XHJcblxyXG5cdGZvbnQoIGZvbnQ6IHN0cmluZyApOiB0aGlzIHtcclxuXHRcdHJldHVybiB0aGlzLnNldEF0dHIoICdmb250LWZhbWlseScsIGZvbnQgKTtcclxuXHR9XHJcblxyXG5cdGZvbnRTaXplKCBzaXplOiBudW1iZXIgfCBzdHJpbmcgKTogdGhpcyB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZXRBdHRyKCAnZm9udC1zaXplJywgc2l6ZSsnJyApO1xyXG5cdH1cclxuXHJcblx0Zm9udFdlaWdodCggd2VpZ2h0OiAnbGlnaHQnIHwgJ25vcm1hbCcgfCAnYm9sZCcgKTogdGhpcyB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZXRBdHRyKCAnZm9udC13ZWlnaHQnLCB3ZWlnaHQgKTtcclxuXHR9XHJcblxyXG5cdHRleHRBbGlnbiggYWxpZ246ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JyApOiB0aGlzIHtcclxuXHJcblx0XHRsZXQgYWw7XHJcblx0XHRzd2l0Y2goIGFsaWduICkge1xyXG5cdFx0XHRjYXNlICdsZWZ0JzogYWwgPSAnc3RhcnQnOyBicmVhaztcclxuXHRcdFx0Y2FzZSAnY2VudGVyJzogYWwgPSAnbWlkZGxlJzsgYnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzogYWwgPSAnZW5kJzsgYnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6IHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLnNldEF0dHIoICd0ZXh0LWFuY2hvcicsIGFsICk7XHJcblx0fVxyXG5cclxuXHR2ZXJ0aWNhbEFsaWduKCBhbGlnbjogJ3RvcCcgfCAnY2VudGVyJyB8ICdib3R0b20nIHwgJ2Jhc2VsaW5lJyApOiB0aGlzIHtcclxuXHJcblx0XHRsZXQgYWw7XHJcblx0XHRzd2l0Y2goIGFsaWduICkge1xyXG5cdFx0XHRjYXNlICd0b3AnOiBhbCA9ICdoYW5naW5nJzsgYnJlYWs7XHJcblx0XHRcdGNhc2UgJ2NlbnRlcic6IGFsID0gJ21pZGRsZSc7IGJyZWFrO1xyXG5cdFx0XHRjYXNlICdib3R0b20nOiBhbCA9ICdiYXNlbGluZSc7IGJyZWFrO1xyXG5cdFx0XHRjYXNlICdiYXNlbGluZSc6IGFsID0gJ21hdGhlbWF0aWNhbCc7IGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OiByZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuc2V0QXR0ciggJ2FsaWdubWVudC1iYXNlbGluZScsIGFsICk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFN2Z1NoYXBlIGV4dGVuZHMgU3ZnSXRlbSB7XHJcblx0Y29uc3RydWN0b3IoIHRhZzogc3RyaW5nICkge1xyXG5cdFx0c3VwZXIoIHRhZyApO1xyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbnR5cGUgbnVtYmVyX29yX3BlcmMgPSBudW1iZXIgfCBgJHtzdHJpbmd9JWBcclxuXHJcbmV4cG9ydCBjbGFzcyBTdmdHcmFkaWVudCBleHRlbmRzIFN2Z0l0ZW0ge1xyXG5cclxuXHRwcml2YXRlIHN0YXRpYyBnX2lkID0gMTtcclxuXHJcblx0cHJpdmF0ZSBfaWQ6IHN0cmluZztcclxuXHRwcml2YXRlIF9zdG9wczogeyBvZmZzZXQ6IG51bWJlcl9vcl9wZXJjLCBjb2xvcjogc3RyaW5nIH0gW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKCB4MTogbnVtYmVyX29yX3BlcmMsIHkxOiBudW1iZXJfb3JfcGVyYywgeDI6IG51bWJlcl9vcl9wZXJjLCB5MjogbnVtYmVyX29yX3BlcmMgKSB7XHJcblx0XHRzdXBlciggJ2xpbmVhckdyYWRpZW50JylcclxuXHRcdFxyXG5cdFx0dGhpcy5faWQgPSAnZ3gtJytTdmdHcmFkaWVudC5nX2lkO1xyXG5cdFx0U3ZnR3JhZGllbnQuZ19pZCsrO1xyXG5cclxuXHRcdHRoaXMuc2V0QXR0ciggJ2lkJywgdGhpcy5faWQgKTtcclxuXHRcdHRoaXMuc2V0QXR0ciggJ3gxJywgaXNTdHJpbmcoeDEpID8geDEgOiBudW0oeDEpKycnICk7XHJcblx0XHR0aGlzLnNldEF0dHIoICd4MicsIGlzU3RyaW5nKHgyKSA/IHgyIDogbnVtKHgyKSsnJyApO1xyXG5cdFx0dGhpcy5zZXRBdHRyKCAneTEnLCBpc1N0cmluZyh5MSkgPyB5MSA6IG51bSh5MSkrJycgKTtcclxuXHRcdHRoaXMuc2V0QXR0ciggJ3kyJywgaXNTdHJpbmcoeTIpID8geTIgOiBudW0oeTIpKycnICk7XHJcblxyXG5cdFx0dGhpcy5fc3RvcHMgPSBbXTtcclxuXHR9XHJcblxyXG5cdGdldCBpZCggKSB7XHJcblx0XHRyZXR1cm4gJ3VybCgjJyt0aGlzLl9pZCsnKSc7XHJcblx0fVxyXG5cclxuXHRhZGRTdG9wKCBvZmZzZXQ6IG51bWJlcl9vcl9wZXJjLCBjb2xvcjogc3RyaW5nICk6IHRoaXMge1xyXG5cdFx0dGhpcy5fZG9tLmluc2VydEFkamFjZW50SFRNTCggXCJiZWZvcmVlbmRcIiwgYDxzdG9wIG9mZnNldD1cIiR7b2Zmc2V0fSVcIiBzdG9wLWNvbG9yPVwiJHtjb2xvcn1cIj48L3N0b3A+YCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgU3ZnR3JvdXAgZXh0ZW5kcyBTdmdJdGVtIHtcclxuXHRcclxuXHRjb25zdHJ1Y3RvciggdGFnID0gXCJnXCIgKSB7XHJcblx0XHRzdXBlciggdGFnIClcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRhcHBlbmQ8SyBleHRlbmRzIFN2Z0l0ZW0+KCBpdGVtOiBLICk6IEsgIHtcclxuXHRcdHRoaXMuX2RvbS5hcHBlbmRDaGlsZCggaXRlbS5nZXREb20oKSApO1xyXG5cdFx0cmV0dXJuIGl0ZW07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cGF0aCggKTogU3ZnUGF0aCB7XHJcblx0XHRjb25zdCBwYXRoID0gbmV3IFN2Z1BhdGgoICk7XHJcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoIHBhdGggKTtcclxuXHR9XHJcblxyXG5cdHRleHQoIHg6IG51bWJlciwgeTogbnVtYmVyLCB0eHQ6IHN0cmluZyApIHtcclxuXHRcdGNvbnN0IHRleHQgPSBuZXcgU3ZnVGV4dCggeCwgeSwgdHh0ICk7XHJcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoIHRleHQgKTtcclxuXHR9XHJcblxyXG5cdGVsbGlwc2UoIHg6IG51bWJlciwgeTogbnVtYmVyLCByMTogbnVtYmVyLCByMiA9IHIxICk6IFN2Z1NoYXBlIHtcclxuXHRcdGNvbnN0IHNoYXBlID0gbmV3IFN2Z1NoYXBlKCAnZWxsaXBzZScgKTtcclxuXHRcdHNoYXBlLnNldEF0dHIoICdjeCcsIG51bSh4KSsnJyApO1xyXG5cdFx0c2hhcGUuc2V0QXR0ciggJ2N5JywgbnVtKHkpKycnICk7XHJcblx0XHRzaGFwZS5zZXRBdHRyKCAncngnLCBudW0ocjEpKycnICk7XHJcblx0XHRzaGFwZS5zZXRBdHRyKCAncnknLCBudW0ocjIpKycnICk7XHJcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoIHNoYXBlICk7XHJcblx0fVxyXG5cclxuXHRyZWN0KCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIgKTogU3ZnU2hhcGUge1xyXG5cclxuXHRcdGlmKCBoPDAgKSB7XHJcblx0XHRcdHkgPSB5K2g7XHJcblx0XHRcdGggPSAtaDtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzaGFwZSA9IG5ldyBTdmdTaGFwZSggJ3JlY3QnICk7XHJcblx0XHRzaGFwZS5zZXRBdHRyKCAneCcsIG51bSh4KSsnJyApO1xyXG5cdFx0c2hhcGUuc2V0QXR0ciggJ3knLCBudW0oeSkrJycgKTtcclxuXHRcdHNoYXBlLnNldEF0dHIoICd3aWR0aCcsIG51bSh3KSsnJyApO1xyXG5cdFx0c2hhcGUuc2V0QXR0ciggJ2hlaWdodCcsIG51bShoKSsnJyApO1xyXG5cdFx0cmV0dXJuIHRoaXMuYXBwZW5kKCBzaGFwZSApO1xyXG5cdH1cclxuXHJcblx0Z3JvdXAoICkge1xyXG5cdFx0Y29uc3QgZ3JvdXAgPSBuZXcgU3ZnR3JvdXAoICk7XHJcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoIGdyb3VwICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKiBleGFtcGxlXHJcblx0ICogYGBgdHNcclxuXHQgKiBjb25zdCBnID0gYy5saW5lYXJfZ3JhZGllbnQoICcwJScsICcwJScsICcwJScsICcxMDAlJyApXHJcblx0ICogXHRcdFx0XHQuYWRkU3RvcCggMCwgJ3JlZCcgKVxyXG5cdCAqIFx0XHRcdFx0LmFkZFN0b3AoIDEwMCwgJ2dyZWVuJyApO1xyXG5cdCAqIFxyXG5cdCAqIHAucmVjdCggMCwgMCwgMTAwLCAxMDAgKVxyXG5cdCAqIFx0XHQuc3Ryb2tlKCBnLmlkICk7XHJcblx0ICogXHJcblx0ICogYGBgXHJcblx0ICovXHJcblxyXG5cdGxpbmVhcl9ncmFkaWVudCggeDE6IG51bWJlcl9vcl9wZXJjLCB5MTogbnVtYmVyX29yX3BlcmMsIHgyOiBudW1iZXJfb3JfcGVyYywgeTI6IG51bWJlcl9vcl9wZXJjICkge1xyXG5cdFx0Y29uc3QgZ3JhZCA9IG5ldyBTdmdHcmFkaWVudCggeDEsIHkxLCB4MiwgeTIgKTtcclxuXHRcdHJldHVybiB0aGlzLmFwcGVuZCggZ3JhZCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogY2xlYXIgXHJcblx0ICovXHJcblxyXG5cdGNsZWFyKCApIHtcclxuXHRcdGNvbnN0IGRvbSA9IHRoaXMuX2RvbTtcclxuXHRcdHdoaWxlKCBkb20uZmlyc3RDaGlsZCApIHtcclxuXHRcdFx0ZG9tLnJlbW92ZUNoaWxkKCBkb20uZmlyc3RDaGlsZCApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTdmdCdWlsZGVyIGV4dGVuZHMgU3ZnR3JvdXAge1xyXG5cdHByaXZhdGUgc3RhdGljIGdfY2xpcF9pZCA9IDE7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoICkge1xyXG5cdFx0c3VwZXIoICApO1xyXG5cdH1cclxuXHJcblx0YWRkQ2xpcCggeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyICkge1xyXG4gICAgICAgIFxyXG5cdFx0Y29uc3QgaWQgPSAnYy0nK1N2Z0J1aWxkZXIuZ19jbGlwX2lkKys7XHJcblx0XHRjb25zdCBjbGlwID0gbmV3IFN2Z0dyb3VwKCAnY2xpcFBhdGgnICk7XHJcblx0XHRjbGlwLnNldEF0dHIoJ2lkJywgaWQgKTtcclxuXHRcdGNsaXAucmVjdCggeCwgeSwgdywgaCApO1xyXG5cclxuXHRcdHRoaXMuYXBwZW5kKGNsaXApO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIFN2Z1Byb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xyXG5cdHZpZXdib3g/OiBzdHJpbmc7XHJcblx0c3ZnPzogU3ZnQnVpbGRlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBTdmdDb21wb25lbnQ8UCBleHRlbmRzIFN2Z1Byb3BzID0gU3ZnUHJvcHM+IGV4dGVuZHMgQ29tcG9uZW50PFA+IHtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBQICkge1xyXG5cdFx0c3VwZXIoIHsgLi4ucHJvcHMsIHRhZzogXCJzdmdcIiwgbnM6IFNWR19OUyB9ICk7XHJcblxyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICd4bWxucycsIFNWR19OUyApO1xyXG5cclxuXHRcdGlmKCBwcm9wcy52aWV3Ym94ICkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJ2aWV3Ym94XCIsIHByb3BzLnZpZXdib3ggKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggcHJvcHMuc3ZnICkge1xyXG5cdFx0XHR0aGlzLmRvbS5hcHBlbmRDaGlsZCggcHJvcHMuc3ZnLmdldERvbSgpICk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBib3hlcy50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMgfSBmcm9tIFwiLi4vLi4vY29yZS9jb21wb25lbnRcIlxyXG5cclxuaW1wb3J0IFwiLi9ib3hlcy5tb2R1bGUuc2Nzc1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCb3hQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBCb3g8UCBleHRlbmRzIEJveFByb3BzPUJveFByb3BzLEUgZXh0ZW5kcyBDb21wb25lbnRFdmVudHM9Q29tcG9uZW50RXZlbnRzPiBleHRlbmRzIENvbXBvbmVudDxQLEU+IHtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgSEJveDxQIGV4dGVuZHMgQm94UHJvcHM9Qm94UHJvcHMsRSBleHRlbmRzIENvbXBvbmVudEV2ZW50cz1Db21wb25lbnRFdmVudHM+IGV4dGVuZHMgQm94PFAsRT4ge1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFZCb3g8UCBleHRlbmRzIEJveFByb3BzPUJveFByb3BzLEUgZXh0ZW5kcyBDb21wb25lbnRFdmVudHM9Q29tcG9uZW50RXZlbnRzPiBleHRlbmRzIEJveDxQLEU+IHtcclxuXHRjb25zdHJ1Y3RvciggcDogUCApIHtcclxuXHRcdHN1cGVyKCBwICk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIHN0YWNrIG9mIHdpZGdldHMgd2hlcmUgb25seSBvbmUgd2lkZ2V0IGlzIHZpc2libGUgYXQgYSB0aW1lXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIFN0YWNrSXRlbSB7XHJcblx0bmFtZTogc3RyaW5nO1xyXG5cdGNvbnRlbnQ6IENvbXBvbmVudDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFN0YWNrZWRMYXlvdXRQcm9wcyBleHRlbmRzIE9taXQ8Q29tcG9uZW50UHJvcHMsXCJjb250ZW50XCI+IHtcclxuXHRkZWZhdWx0OiBzdHJpbmc7XHJcblx0aXRlbXM6IFN0YWNrSXRlbVtdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgX1N0YWNrSXRlbSBleHRlbmRzIFN0YWNrSXRlbSB7XHJcblx0cGFnZTogQ29tcG9uZW50O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhY2tCb3ggZXh0ZW5kcyBCb3g8U3RhY2tlZExheW91dFByb3BzPiB7XHJcblxyXG5cdHByaXZhdGUgX2l0ZW1zOiBfU3RhY2tJdGVtW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogU3RhY2tlZExheW91dFByb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0dGhpcy5faXRlbXMgPSBwcm9wcy5pdGVtcz8ubWFwKCBpdG0gPT4ge1xyXG5cdFx0XHRyZXR1cm4geyAuLi5pdG0sIHBhZ2U6IG51bGwgfTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmKCBwcm9wcy5kZWZhdWx0ICkge1xyXG5cdFx0XHR0aGlzLnNlbGVjdCggcHJvcHMuZGVmYXVsdCApO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiggdGhpcy5faXRlbXMubGVuZ3RoICkge1xyXG5cdFx0XHR0aGlzLnNlbGVjdCggdGhpcy5faXRlbXNbMF0ubmFtZSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2VsZWN0KCBuYW1lOiBzdHJpbmcgKSB7XHJcblx0XHRsZXQgc2VsID0gdGhpcy5xdWVyeSggYC5zZWxlY3RlZGAgKTtcclxuXHRcdGlmKCBzZWwgKSB7XHJcblx0XHRcdHNlbC5zZXRDbGFzcyggXCJzZWxlY3RlZFwiLCBmYWxzZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBnID0gdGhpcy5faXRlbXMuZmluZCggeCA9PiB4Lm5hbWU9PW5hbWUgKTtcclxuXHRcdGlmKCBwZyApIHtcclxuXHRcdFx0aWYoICFwZy5wYWdlICkge1xyXG5cdFx0XHRcdHBnLnBhZ2UgPSB0aGlzLl9jcmVhdGVQYWdlKCBwZyApO1xyXG5cdFx0XHRcdHRoaXMuYXBwZW5kQ29udGVudCggcGcucGFnZSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWwgPSBwZy5wYWdlO1xyXG5cdFx0XHRpZiggc2VsICkge1xyXG5cdFx0XHRcdHNlbC5zZXRDbGFzcyggXCJzZWxlY3RlZFwiLCB0cnVlICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRwcml2YXRlIF9jcmVhdGVQYWdlKCBwYWdlOiBfU3RhY2tJdGVtICkge1xyXG5cdFx0XHJcblx0XHRsZXQgY29udGVudDogQ29tcG9uZW50O1xyXG5cdFx0Ly9pZiggcGFnZS5jb250ZW50IGluc3RhbmNlb2YgQ29tcG9uZW50QnVpbGRlciApIHtcclxuXHRcdC8vXHRjb250ZW50ID0gcGFnZS5jb250ZW50LmNyZWF0ZSggKTtcclxuXHRcdC8vfVxyXG5cdFx0Ly9lbHNlIHtcclxuXHRcdFx0Y29udGVudCA9IHBhZ2UuY29udGVudDtcclxuXHRcdC8vfVxyXG5cdFx0XHJcblx0XHRjb250ZW50Py5zZXREYXRhKCBcInN0YWNrbmFtZVwiLCBwYWdlLm5hbWUgKTtcclxuXHRcdHJldHVybiBjb250ZW50O1xyXG5cdH1cclxufVxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIGljb24udHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcclxuXHJcbmltcG9ydCBcIi4vaWNvbi5tb2R1bGUuc2Nzc1wiXHJcblxyXG50eXBlIHNvbHZlQ2FsbGJhY2sgPSAoZGF0YTpzdHJpbmcpPT52b2lkO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmNsYXNzIFN2Z0xvYWRlciB7XHJcblx0cHJpdmF0ZSBjYWNoZTogTWFwPHN0cmluZyxzdHJpbmc+O1xyXG5cdHByaXZhdGUgd2FpdGVyczogTWFwPHN0cmluZyxzb2x2ZUNhbGxiYWNrW10+O1xyXG5cclxuXHRjb25zdHJ1Y3RvciggKSB7XHJcblx0XHR0aGlzLmNhY2hlID0gbmV3IE1hcCggKTtcclxuXHRcdHRoaXMud2FpdGVycyA9IG5ldyBNYXAoICk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkKCBmaWxlOiBzdHJpbmcgKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcblx0XHRpZiggdGhpcy5jYWNoZS5oYXMoZmlsZSkgKSB7XHJcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoIHRoaXMuY2FjaGUuZ2V0KGZpbGUpICk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcclxuXHRcdFx0aWYoIHRoaXMud2FpdGVycy5oYXMoZmlsZSkgKSB7XHJcblx0XHRcdFx0dGhpcy53YWl0ZXJzLmdldChmaWxlKS5wdXNoKCByZXNvbHZlICk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy53YWl0ZXJzLnNldCggZmlsZSwgW3Jlc29sdmVdICk7XHJcblx0XHRcdFx0dGhpcy5fbG9hZCggZmlsZSApXHJcblx0XHRcdFx0XHQudGhlbiggKCBkYXRhOiBzdHJpbmcgKSA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUudGltZUVuZCggZmlsZSApO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNhY2hlLnNldCggZmlsZSwgZGF0YSApO1xyXG5cdFx0XHRcdFx0XHRjb25zdCB3dyA9IHRoaXMud2FpdGVycy5nZXQoIGZpbGUgKTtcclxuXHRcdFx0XHRcdFx0d3cuZm9yRWFjaCggY2IgPT4gY2IoZGF0YSApICk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgYXN5bmMgX2xvYWQoIGZpbGU6IHN0cmluZyApOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cdFx0Y29uc29sZS50aW1lKCBmaWxlICk7XHJcblx0XHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaCggZmlsZSApO1xyXG5cdFx0aWYoIHJlcy5vayApIHtcclxuXHRcdFx0cmV0dXJuIHJlcy50ZXh0KCApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzdmdMb2FkZXIgPSBuZXcgU3ZnTG9hZGVyKCApO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSWNvblByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xyXG5cdGljb25JZD86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBJY29uIGV4dGVuZHMgQ29tcG9uZW50PEljb25Qcm9wcz4ge1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEljb25Qcm9wcyApIHtcclxuXHRcdHN1cGVyKCBwcm9wcyApO1xyXG5cclxuXHRcdHRoaXMuc2V0SWNvbiggcHJvcHMuaWNvbklkICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBjaGFuZ2UgdGhlIGljb24gY29udGVudFxyXG5cdCAqIEBwYXJhbSBpY29uSWQgaWYgbmFtZSBpcyBzdGFydGluZyB3aXRoIHZhcjogdGhlbiB3ZSB1c2UgY3NzIHZhcmlhYmxlIG5hbWUgYSBwYXRoXHJcblx0ICogQGV4YW1wbGVcclxuXHQgKiBcclxuXHQgKiBzZXRJY29uKCBcInZhcjpob21lXCIgKVxyXG5cdCAqIFxyXG5cdCAqIGltcG9ydCBteWljb24gZnJvbSBcIi4vbXlpY29uLnN2Z1wiXHJcblx0ICogc2V0SWNvbiggbXlpY29uICk7XHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHNldEljb24oIGljb25JZDogc3RyaW5nICkge1xyXG5cdFx0aWYoIGljb25JZCApIHtcclxuXHRcdFx0aWYoIGljb25JZC5zdGFydHNXaXRoKCd2YXI6JykgKSB7XHJcblx0XHRcdFx0ZG8ge1xyXG5cdFx0XHRcdFx0Y29uc3QgcGF0aCA9IGljb25JZC5zdWJzdHJpbmcoIDQgKTtcclxuXHRcdFx0XHRcdGljb25JZCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCBwYXRoICk7XHJcblx0XHRcdFx0fSB3aGlsZSggaWNvbklkLnN0YXJ0c1dpdGgoJ3ZhcjonKSApO1xyXG5cdFx0XHR9IFxyXG5cclxuXHRcdFx0aWYoIGljb25JZC5zdGFydHNXaXRoKFwiZGF0YTppbWFnZS9zdmcreG1sLDxzdmdcIikgKSB7XHJcblx0XHRcdFx0dGhpcy5kb20uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBpY29uSWQuc3Vic3RyaW5nKDE5KSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYoIGljb25JZC5lbmRzV2l0aChcIi5zdmdcIikgKSB7XHJcblx0XHRcdFx0c3ZnTG9hZGVyLmxvYWQoIGljb25JZCApLnRoZW4oIHN2ZyA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmNsZWFyQ29udGVudCggKTtcclxuXHRcdFx0XHRcdHRoaXMuZG9tLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgc3ZnICk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5zZXRDb250ZW50KCBuZXcgQ29tcG9uZW50KCB7IHRhZzogXCJpbWdcIiwgYXR0cnM6IHsgc3JjOiBpY29uSWQgfSB9ICkgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuY2xlYXJDb250ZW50KCApO1xyXG5cdFx0XHR0aGlzLmFkZENsYXNzKCBcImVtcHR5XCIgKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBidXR0b24udHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzLCBFdkNsaWNrIH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50XCJcclxuaW1wb3J0IHsgRXZlbnRDYWxsYmFjayB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV9ldmVudHMuanMnO1xyXG5pbXBvcnQgeyBVbnNhZmVIdG1sIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcclxuXHJcbmltcG9ydCB7IEljb24gfSBmcm9tIFwiLi4vaWNvbi9pY29uXCJcclxuXHJcbmltcG9ydCBcIi4vYnV0dG9uLm1vZHVsZS5zY3NzXCI7XHJcblxyXG5cclxuLyoqXHJcbiAqIEJ1dHRvbiBldmVudHNcclxuICovXHJcblxyXG5pbnRlcmZhY2UgQnV0dG9uRXZlbnRzIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcclxuXHRjbGljazogRXZDbGljaztcclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1dHRvbiBwcm9wZXJ0aWVzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQnV0dG9uUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0bGFiZWw/OiBzdHJpbmc7XHJcblx0aWNvbj86IHN0cmluZztcclxuXHRjbGljaz86IEV2ZW50Q2FsbGJhY2s8RXZDbGljaz47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCdXR0b24gY29tcG9uZW50LlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBDb21wb25lbnQ8QnV0dG9uUHJvcHMsQnV0dG9uRXZlbnRzPiB7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBCdXR0b24uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwcm9wcyAtIFRoZSBwcm9wZXJ0aWVzIGZvciB0aGUgYnV0dG9uIGNvbXBvbmVudCwgaW5jbHVkaW5nIGxhYmVsIGFuZCBpY29uLlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGNvbnN0IGJ1dHRvbiA9IG5ldyBCdXR0b24oeyBsYWJlbDogJ1N1Ym1pdCcsIGljb246ICdjaGVjay1pY29uJyB9KTtcclxuICAgICAqL1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEJ1dHRvblByb3BzICkge1xyXG5cdFx0c3VwZXIoIHsgLi4ucHJvcHMsIHRhZzogJ2J1dHRvbicsIGNvbnRlbnQ6IG51bGwgfSApO1xyXG5cclxuXHRcdHRoaXMubWFwUHJvcEV2ZW50cyggcHJvcHMsICdjbGljaycgKTtcclxuXHRcdHRoaXMuYWRkRE9NRXZlbnQoJ2NsaWNrJywgKGUpID0+IHRoaXMuX29uX2NsaWNrKGUpKTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0bmV3IEljb24oIHsgaWQ6IFwiaWNvblwiLCBpY29uSWQ6IHRoaXMucHJvcHMuaWNvbiB9ICksXHJcblx0XHRcdG5ldyBDb21wb25lbnQoIHsgaWQ6IFwibGFiZWxcIiwgY29udGVudDogdGhpcy5wcm9wcy5sYWJlbCB9ICksXHJcblx0XHRdICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBjYWxsZWQgYnkgdGhlIHN5c3RlbSBvbiBjbGljayBldmVudFxyXG5cdCAqL1xyXG5cclxuXHRwcm90ZWN0ZWQgX29uX2NsaWNrKCBldjogTW91c2VFdmVudCApIHtcclxuXHJcblx0XHQvL2lmICh0aGlzLm1fcHJvcHMubWVudSkge1xyXG5cdFx0Ly9cdGxldCBtZW51ID0gbmV3IE1lbnUoe1xyXG5cdFx0Ly9cdFx0aXRlbXM6IGlzRnVuY3Rpb24odGhpcy5tX3Byb3BzLm1lbnUpID8gdGhpcy5tX3Byb3BzLm1lbnUoKSA6IHRoaXMubV9wcm9wcy5tZW51XHJcblx0XHQvL1x0fSk7XHJcblx0XHQvL1xyXG5cdFx0Ly9cdGxldCByYyA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCk7XHJcblx0XHQvL1x0bWVudS5kaXNwbGF5QXQocmMubGVmdCwgcmMuYm90dG9tLCAndGwnKTtcclxuXHRcdC8vfVxyXG5cdFx0Ly9lbHNlIHtcclxuXHRcdFx0dGhpcy5maXJlKCdjbGljaycsIHt9ICk7XHJcblx0XHQvL31cclxuXHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIFNldHMgdGhlIHRleHQgY29udGVudCBvZiB0aGUgYnV0dG9uJ3MgbGFiZWwuXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB0ZXh0IC0gVGhlIG5ldyB0ZXh0IG9yIEhUTUwgY29udGVudCBmb3IgdGhlIGxhYmVsLlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGJ1dHRvbi5zZXRUZXh0KCdDbGljayBNZScpO1xyXG4gICAgICogYnV0dG9uLnNldFRleHQobmV3IFVuc2FmZUh0bWwoJzxiPkJvbGQgVGV4dDwvYj4nKSk7XHJcbiAgICAgKi9cclxuXHJcblx0cHVibGljIHNldFRleHQoIHRleHQ6IHN0cmluZyB8IFVuc2FmZUh0bWwgKSB7XHJcblx0XHR0aGlzLnF1ZXJ5KCBcIiNsYWJlbFwiICkuc2V0Q29udGVudCggdGV4dCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBTZXRzIHRoZSBpY29uIG9mIHRoZSBidXR0b24uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpY29uIC0gVGhlIG5ldyBpY29uIElEIHRvIHNldCBvbiB0aGUgYnV0dG9uLlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGJ1dHRvbi5zZXRJY29uKCduZXctaWNvbi1pZCcpO1xyXG4gICAgICovXHJcblxyXG5cdHB1YmxpYyBzZXRJY29uKCBpY29uOiBzdHJpbmcgKSB7XHJcblx0XHR0aGlzLnF1ZXJ5PEljb24+KCBcIiNpY29uXCIgKS5zZXRJY29uKCBpY29uICk7XHJcblx0fVxyXG59XHJcblxyXG4iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgYnRuZ3JvdXAudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudCwgQ29tcG9uZW50RXZlbnRzLCBDb21wb25lbnRQcm9wcywgRmxleCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcclxuaW1wb3J0IHsgRXZlbnRDYWxsYmFjayB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV9ldmVudHMnO1xyXG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scyc7XHJcbmltcG9ydCB7IF90ciB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV9pMThuJ1xyXG5cclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vYnV0dG9uL2J1dHRvbic7XHJcbmltcG9ydCB7IEJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzLmpzJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbC9sYWJlbC5qcyc7XHJcbmltcG9ydCB7IEV2QnRuQ2xpY2sgfSBmcm9tICcuLi9kaWFsb2cvZGlhbG9nLmpzJztcclxuXHJcbmltcG9ydCBcIi4vYnRuZ3JvdXAubW9kdWxlLnNjc3NcIlxyXG5cclxuXHJcbnR5cGUgcHJlZGVmaW5lZCA9IFwib2tcIiB8IFwiY2FuY2VsXCIgfCBcInllc1wiIHwgXCJub1wiIHwgXCJyZXRyeVwiIHwgXCJhYm9ydFwiIHwgXCItXCI7XHQvLyAtID0gZmxleFxyXG5leHBvcnQgdHlwZSBCdG5Hcm91cEl0ZW0gPSBwcmVkZWZpbmVkIHwgQnV0dG9uIHwgTGFiZWw7XHJcblxyXG5pbnRlcmZhY2UgQnRuR3JvdXBFdmVudHMgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xyXG5cdGJ0bmNsaWNrOiBFdkJ0bkNsaWNrO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQnRuR3JvdXBQcm9wcyBleHRlbmRzIE9taXQ8Q29tcG9uZW50UHJvcHMsXCJjb250ZW50XCI+IHtcclxuXHRhbGlnbj86IFwibGVmdFwiIHwgXCJjZW50ZXJcIiB8IFwicmlnaHRcIjtcdC8vIGxlZnQgZGVmYXVsdFxyXG5cdHZlcnRpY2FsPzogYm9vbGVhbjtcdFx0XHRcdFx0XHJcblx0aXRlbXM6IEJ0bkdyb3VwSXRlbVtdO1xyXG5cdHJldmVyc2U/OiBib29sZWFuLFxyXG5cdGJ0bmNsaWNrPzogRXZlbnRDYWxsYmFjazxFdkJ0bkNsaWNrPjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ0bkdyb3VwIGV4dGVuZHMgQm94PEJ0bkdyb3VwUHJvcHMsQnRuR3JvdXBFdmVudHM+IHtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBCdG5Hcm91cFByb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0aWYoIHByb3BzLmFsaWduICkge1xyXG5cdFx0XHR0aGlzLmFkZENsYXNzKCBcImFsaWduLVwiK3Byb3BzLmFsaWduICk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5hZGRDbGFzcyggcHJvcHMudmVydGljYWwgPyBcIng0dmJveFwiIDogXCJ4NGhib3hcIiApO1xyXG5cclxuXHRcdGlmKCBwcm9wcy5pdGVtcyApIHtcclxuXHRcdFx0dGhpcy5zZXRCdXR0b25zKCBwcm9wcy5pdGVtcyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubWFwUHJvcEV2ZW50cyggcHJvcHMsIFwiYnRuY2xpY2tcIiApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICogQHBhcmFtIGJ0bnMgXHJcblx0ICovXHJcblxyXG5cdHNldEJ1dHRvbnMoIGJ0bnM6IEJ0bkdyb3VwSXRlbVtdICkge1xyXG5cclxuXHRcdHRoaXMuY2xlYXJDb250ZW50KCApO1xyXG5cclxuXHRcdGNvbnN0IGNoaWxkczogQ29tcG9uZW50W10gPSBbXTtcclxuXHJcblx0XHRidG5zPy5mb3JFYWNoKCAoYjogc3RyaW5nIHwgQ29tcG9uZW50KSA9PiB7XHJcblxyXG5cdFx0XHRpZiggYj09PVwiLVwiICkge1xyXG5cdFx0XHRcdGIgPSBuZXcgRmxleCggKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKCBpc1N0cmluZyhiKSApIHtcclxuXHRcdFx0XHRsZXQgdGl0bGU6IHN0cmluZztcclxuXHRcdFx0XHRjb25zdCBubSA9IGIgYXMgcHJlZGVmaW5lZDtcclxuXHJcblx0XHRcdFx0c3dpdGNoKCBiIGFzIHByZWRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHRjYXNlIFwib2tcIjogXHRcdHRpdGxlID0gX3RyLmdsb2JhbC5vazsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwiY2FuY2VsXCI6IFx0dGl0bGUgPSBfdHIuZ2xvYmFsLmNhbmNlbDsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwiYWJvcnRcIjpcdHRpdGxlID0gX3RyLmdsb2JhbC5hYm9ydDsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwibm9cIjpcdFx0dGl0bGUgPSBfdHIuZ2xvYmFsLm5vOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJ5ZXNcIjpcdFx0dGl0bGUgPSBfdHIuZ2xvYmFsLnllczsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwicmV0cnlcIjpcdHRpdGxlID0gX3RyLmdsb2JhbC5yZXRyeTsgYnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRiID0gbmV3IEJ1dHRvbiggeyBsYWJlbDogdGl0bGUsIGNsaWNrOiAoICkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5maXJlKCBcImJ0bmNsaWNrXCIsIHtidXR0b246bm0gYXMgc3RyaW5nfSApXHJcblx0XHRcdFx0fSB9ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNoaWxkcy5wdXNoKCBiICk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzdXBlci5zZXRDb250ZW50KCBjaGlsZHMgKTtcclxuXHR9XHJcbn0iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgbGFiZWwudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gXCIuLi8uLi9jb3JlL2NvbXBvbmVudFwiXHJcbmltcG9ydCB7IEljb24gfSBmcm9tIFwiLi4vaWNvbi9pY29uXCJcclxuXHJcbmltcG9ydCBcIi4vbGFiZWwubW9kdWxlLnNjc3NcIjtcclxuaW1wb3J0IHsgVW5zYWZlSHRtbCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scy5qcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExhYmVsUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0dGV4dD86IHN0cmluZyB8IFVuc2FmZUh0bWw7XHJcblx0aWNvbj86IHN0cmluZztcclxuXHRsYWJlbEZvcj86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExhYmVsIGV4dGVuZHMgQ29tcG9uZW50PExhYmVsUHJvcHM+IHtcclxuXHQjdGV4dDogQ29tcG9uZW50O1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCBwOiBMYWJlbFByb3BzICkge1xyXG5cdFx0c3VwZXIoIHsgLi4ucCwgY29udGVudDogbnVsbCB9ICk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXHJcblx0XHRcdG5ldyBJY29uKCB7IGlkOlwiaWNvblwiLCBpY29uSWQ6IHRoaXMucHJvcHMuaWNvbiB9ICksXHJcblx0XHRcdHRoaXMuI3RleHQgPSBuZXcgQ29tcG9uZW50KCB7IHRhZzogJ3NwYW4nLCBpZDogJ3RleHQnIH0gKVxyXG5cdFx0XSApO1xyXG5cclxuXHRcdC8vIHNtYWxsIGhhY2sgZm9yIHJlYWN0OlxyXG5cdFx0Ly9cdHAuY29udGVudCBtYXkgYmUgdGhlIHRleHRcclxuXHRcdGNvbnN0IHRleHQgPSB0aGlzLnByb3BzLnRleHQ7XHJcblx0XHR0aGlzLnNldFRleHQoIHRleHQgKTtcclxuXHRcclxuXHRcdGlmKCBwLmxhYmVsRm9yICkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJmb3JcIiwgcC5sYWJlbEZvciApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0VGV4dCggdGV4dDogc3RyaW5nIHwgVW5zYWZlSHRtbCApIHtcclxuXHRcdHRoaXMuI3RleHQuc2V0Q29udGVudCggdGV4dCApO1xyXG5cdFx0dGhpcy4jdGV4dC5zZXRDbGFzcyggXCJlbXB0eVwiLCAhdGV4dCApO1xyXG5cdH1cclxuXHJcblx0c2V0SWNvbiggaWNvbjogc3RyaW5nICkge1xyXG5cdFx0dGhpcy5xdWVyeTxJY29uPiggXCIjaWNvblwiICkuc2V0SWNvbiggaWNvbiApO1xyXG5cdH1cclxufVxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIHNpemVyLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50RXZlbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIGNvbXBvbmVudEZyb21ET00gfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcclxuXHJcbmltcG9ydCBcIi4vc2l6ZXIubW9kdWxlLnNjc3NcIlxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmludGVyZmFjZSBFdlNpemVDaGFuZ2UgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XHJcblx0c2l6ZTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ1NpemVyRXZlbnQgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xyXG5cdHJlc2l6ZTogRXZTaXplQ2hhbmdlO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENTaXplciBleHRlbmRzIENvbXBvbmVudDxDb21wb25lbnRQcm9wcyxDU2l6ZXJFdmVudD4ge1xyXG5cclxuXHRwcml2YXRlIF90eXBlOiBzdHJpbmc7XHJcblx0cHJpdmF0ZSBfcmVmOiBDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfZGVsdGE6IFBvaW50O1xyXG5cclxuXHRjb25zdHJ1Y3RvciggdHlwZTogc3RyaW5nLCB0YXJnZXQ/OiBDb21wb25lbnQgKSB7XHJcblx0XHRzdXBlcigge30gKTtcclxuXHJcblx0XHR0aGlzLl90eXBlID0gdHlwZTtcclxuXHRcdHRoaXMuYWRkQ2xhc3MoIHR5cGUgKTtcclxuXHJcblx0XHR0aGlzLmFkZERPTUV2ZW50KCBcInBvaW50ZXJkb3duXCIsICggZTogUG9pbnRlckV2ZW50ICkgPT4ge1xyXG5cdFx0XHR0aGlzLnNldENhcHR1cmUoIGUucG9pbnRlcklkICk7XHJcblx0XHRcdHRoaXMuX3JlZiA9IHRhcmdldCA/PyBjb21wb25lbnRGcm9tRE9NKCB0aGlzLmRvbS5wYXJlbnRFbGVtZW50ICk7XHJcblxyXG5cdFx0XHR0aGlzLl9kZWx0YSA9IHt4OjAseTowfTtcclxuXHRcdFx0Y29uc3QgcmMgPSB0aGlzLl9yZWYuZ2V0Qm91bmRpbmdSZWN0KCk7XHJcblxyXG5cdFx0XHRpZiggdGhpcy5fdHlwZS5pbmNsdWRlcyhcImxlZnRcIikgKSB7XHJcblx0XHRcdFx0dGhpcy5fZGVsdGEueCA9IGUucGFnZVgtcmMubGVmdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLl9kZWx0YS54ID0gZS5wYWdlWC0ocmMubGVmdCtyYy53aWR0aCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCB0aGlzLl90eXBlLmluY2x1ZGVzKFwidG9wXCIpICkge1xyXG5cdFx0XHRcdHRoaXMuX2RlbHRhLnkgPSBlLnBhZ2VZLXJjLnRvcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLl9kZWx0YS55ID0gZS5wYWdlWS0ocmMudG9wK3JjLmhlaWdodCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwicG9pbnRlcnVwXCIsICggZTogUG9pbnRlckV2ZW50ICkgPT4ge1xyXG5cdFx0XHR0aGlzLnJlbGVhc2VDYXB0dXJlKCBlLnBvaW50ZXJJZCApO1xyXG5cdFx0XHR0aGlzLl9yZWYgPSBudWxsO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRET01FdmVudCggXCJwb2ludGVybW92ZVwiLCAoIGU6IFBvaW50ZXJFdmVudCApID0+IHtcclxuXHRcdFx0dGhpcy5fb25Nb3VzZU1vdmUoIGUgKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25Nb3VzZU1vdmUoIGU6IFBvaW50ZXJFdmVudCApIHtcclxuXHRcdGlmKCAhdGhpcy5fcmVmICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcHQgPSB7IHg6IGUucGFnZVgtdGhpcy5fZGVsdGEueCwgeTogZS5wYWdlWS10aGlzLl9kZWx0YS55IH07XHJcblx0XHRjb25zdCByYyA9IHRoaXMuX3JlZi5nZXRCb3VuZGluZ1JlY3QoICk7XHJcblxyXG5cdFx0bGV0IG5yOiBhbnkgPSB7fTtcclxuXHRcdGxldCBob3J6ID0gdHJ1ZTtcclxuXHJcblx0XHRpZiggdGhpcy5fdHlwZS5pbmNsdWRlcyhcInRvcFwiKSApIHtcclxuXHRcdFx0bnIudG9wID0gcHQueSxcclxuXHRcdFx0bnIuaGVpZ2h0ID0gKHJjLnRvcCtyYy5oZWlnaHQpLXB0Lnk7XHJcblx0XHRcdGhvcnogPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggdGhpcy5fdHlwZS5pbmNsdWRlcyhcImJvdHRvbVwiKSApIHtcclxuXHRcdFx0Ly9uci50b3AgPSByYy50b3A7XHJcblx0XHRcdG5yLmhlaWdodCA9IChwdC55LXJjLnRvcCk7XHJcblx0XHRcdGhvcnogPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggdGhpcy5fdHlwZS5pbmNsdWRlcyhcImxlZnRcIikgKSB7XHJcblx0XHRcdG5yLmxlZnQgPSBwdC54O1xyXG5cdFx0XHRuci53aWR0aCA9ICgocmMubGVmdCtyYy53aWR0aCktcHQueCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIHRoaXMuX3R5cGUuaW5jbHVkZXMoXCJyaWdodFwiKSApIHtcclxuXHRcdFx0Ly9uci5sZWZ0ID0gcmMubGVmdDtcclxuXHRcdFx0bnIud2lkdGggPSAocHQueC1yYy5sZWZ0KTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9yZWYuc2V0U3R5bGUoIG5yICk7XHJcblxyXG5cdFx0Y29uc3QgbnJjID0gdGhpcy5fcmVmLmdldEJvdW5kaW5nUmVjdCggKTtcclxuXHRcdHRoaXMuZmlyZSggXCJyZXNpemVcIiwgeyBzaXplOiBob3J6ID8gbnJjLndpZHRoIDogbnJjLmhlaWdodCB9KVxyXG5cclxuXHRcdGUucHJldmVudERlZmF1bHQoICk7XHJcblx0XHRlLnN0b3BQcm9wYWdhdGlvbiggKTtcclxuXHR9XHJcbn0iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgcG9wdXAudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudCwgQ29tcG9uZW50RXZlbnRzLCBDb21wb25lbnRQcm9wcywgY29tcG9uZW50RnJvbURPTSwgbWFrZVVuaXF1ZUNvbXBvbmVudElkIH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50XCJcclxuaW1wb3J0IHsgQ1NpemVyIH0gZnJvbSAnLi4vc2l6ZXJzL3NpemVyJztcclxuaW1wb3J0IHsgUmVjdCwgUG9pbnQgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfdG9vbHMuanMnO1xyXG5cclxuaW1wb3J0IFwiLi9wb3B1cC5tb2R1bGUuc2Nzc1wiXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQb3B1cEV2ZW50cyBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XHJcblx0Y2xvc2VkOiBDb21wb25lbnRFdmVudDtcclxuXHRvcGVuZWQ6IENvbXBvbmVudEV2ZW50O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBvcHVwUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0bW9kYWw/OiBib29sZWFuO1xyXG5cdGF1dG9DbG9zZT86IGJvb2xlYW4gfCBzdHJpbmc7XHJcblx0c2l6YWJsZT86IGJvb2xlYW47XHJcblx0bW92YWJsZT86IGJvb2xlYW47XHJcbn1cclxuXHJcblxyXG5sZXQgbW9kYWxfbWFzazogQ29tcG9uZW50O1xyXG5sZXQgbW9kYWxfY291bnQgPSAwO1xyXG5cclxubGV0IG1vZGFsX3N0YWNrOiBQb3B1cFtdID0gW107XHJcbmxldCBhdXRvY2xvc2VfbGlzdDogUG9wdXBbXSA9IFtdO1xyXG5sZXQgcG9wdXBfbGlzdDogIFBvcHVwW10gPSBbXTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3B1cDxQIGV4dGVuZHMgUG9wdXBQcm9wcyA9IFBvcHVwUHJvcHMsIEUgZXh0ZW5kcyBQb3B1cEV2ZW50cyA9IFBvcHVwRXZlbnRzPiBleHRlbmRzIENvbXBvbmVudDxQLEU+IHtcclxuXHJcblx0cHJpdmF0ZSBfaXNvcGVuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfaXNzaG93biA9IGZhbHNlO1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFAgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHRpZiggdGhpcy5wcm9wcy5zaXphYmxlICkge1xyXG5cdFx0XHR0aGlzLl9jcmVhdGVTaXplcnMoICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkaXNwbGF5TmVhciggcmM6IFJlY3QsIGRzdCA9IFwidG9wIGxlZnRcIiwgc3JjID0gXCJ0b3AgbGVmdFwiLCBvZmZzZXQgPSB7eDowLHk6MH0gKSB7XHJcblxyXG5cdFx0dGhpcy5zZXRTdHlsZSggeyBsZWZ0OiBcIjBweFwiLCB0b3A6IFwiMHB4XCIgfSApO1x0Ly8gYXZvaWQgc2Nyb2xsYmFyXHJcblx0XHR0aGlzLl9zaG93KCApO1x0XHRcdFx0XHRcdFx0XHRcdC8vIHRvIGNvbXB1dGUgc2l6ZVxyXG5cdFx0XHJcblx0XHRsZXQgcm0gPSB0aGlzLmdldEJvdW5kaW5nUmVjdCgpO1xyXG5cclxuXHRcdGxldCB4cmVmID0gcmMubGVmdDtcclxuXHRcdGxldCB5cmVmID0gcmMudG9wO1xyXG5cclxuXHRcdGlmKCBzcmMuaW5kZXhPZigncmlnaHQnKT49MCApIHtcclxuXHRcdFx0eHJlZiA9IChyYy5sZWZ0K3JjLndpZHRoKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIHNyYy5pbmRleE9mKCdjZW50ZXInKT49MCApIHtcclxuXHRcdFx0eHJlZiA9IHJjLmxlZnQgKyByYy53aWR0aC8yO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCBzcmMuaW5kZXhPZignYm90dG9tJyk+PTAgKSB7XHJcblx0XHRcdHlyZWYgPSByYy5ib3R0b207XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCBzcmMuaW5kZXhPZignbWlkZGxlJyk+PTAgKSB7XHJcblx0XHRcdHlyZWYgPSByYy50b3AgKyByYy5oZWlnaHQvMjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaGFsaWduID0gJ2wnO1xyXG5cdFx0aWYgKGRzdC5pbmRleE9mKCdyaWdodCcpID49IDApIHtcclxuXHRcdFx0eHJlZiAtPSBybS53aWR0aDtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIGRzdC5pbmRleE9mKCdjZW50ZXInKT49MCApIHtcclxuXHRcdFx0eHJlZiAtPSBybS53aWR0aC8yO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB2YWxpZ24gPSAndCc7XHJcblx0XHRpZiAoZHN0LmluZGV4T2YoJ2JvdHRvbScpID49IDApIHtcclxuXHRcdFx0eXJlZiAtPSBybS5oZWlnaHQ7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCBkc3QuaW5kZXhPZignbWlkZGxlJyk+PTAgKSB7XHJcblx0XHRcdHlyZWYgLT0gcm0uaGVpZ2h0LzI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChvZmZzZXQpIHtcclxuXHRcdFx0eHJlZiArPSBvZmZzZXQueDtcclxuXHRcdFx0eXJlZiArPSBvZmZzZXQueTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdXIgcGFyZW50IGlzIGJvZHksIHNvIHRha2UgY2FyZSBvZiB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcblx0XHR4cmVmICs9IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQuc2Nyb2xsTGVmdDtcclxuXHRcdHlyZWYgKz0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxUb3A7XHJcblxyXG5cdFx0dGhpcy5kaXNwbGF5QXQoIHhyZWYsIHlyZWYgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRkaXNwbGF5Q2VudGVyKCApIHtcclxuXHRcdHRoaXMuZGlzcGxheU5lYXIoIG5ldyBSZWN0KCB3aW5kb3cuaW5uZXJXaWR0aC8yLCB3aW5kb3cuaW5uZXJIZWlnaHQvMiwgMCwgMCApLCBcImNlbnRlciBtaWRkbGVcIiApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGRpc3BsYXlBdCggeDogbnVtYmVyLCB5OiBudW1iZXIgKSB7XHJcblx0XHQvL1RPRE86IGNoZWNrIGlzIGFscmVhZHkgdmlzaWJsZVxyXG5cdFx0dGhpcy5zZXRTdHlsZSgge1xyXG5cdFx0XHRsZWZ0OiB4K1wicHhcIixcclxuXHRcdFx0dG9wOiB5K1wicHhcIixcclxuXHRcdH0pXHJcblxyXG5cdFx0dGhpcy5fc2hvdyggKTtcclxuXHJcblx0XHRjb25zdCByYyA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCApO1xyXG5cdFx0Y29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDE2O1xyXG5cdFx0Y29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTY7XHJcblx0XHRcclxuXHRcdGlmKCByYy5yaWdodD53aWR0aCApIHtcclxuXHRcdFx0dGhpcy5zZXRTdHlsZVZhbHVlKCBcImxlZnRcIiwgd2lkdGgtcmMud2lkdGggKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggcmMuYm90dG9tPmhlaWdodCApIHtcclxuXHRcdFx0dGhpcy5zZXRTdHlsZVZhbHVlKCBcInRvcFwiLCBoZWlnaHQtcmMuaGVpZ2h0ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIHRoaXMucHJvcHMubW92YWJsZSApIHtcclxuXHRcdFx0Y29uc3QgbW92ZXJzID0gdGhpcy5xdWVyeUFsbCggXCIuY2FwdGlvbi1lbGVtZW50XCIgKTtcclxuXHRcdFx0bW92ZXJzLmZvckVhY2goIG0gPT4gbmV3IENNb3ZlcihtLHRoaXMpICk7XHJcblxyXG5cdFx0XHRpZiggdGhpcy5oYXNDbGFzcyhcInBvcHVwLWNhcHRpb25cIikgKSB7XHJcblx0XHRcdFx0bmV3IENNb3Zlcih0aGlzLHRoaXMpO1xyXG5cdFx0XHR9XHRcdFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZmlyZSggXCJvcGVuZWRcIiwge30gKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3Nob3coICkge1xyXG5cdFx0XHJcblx0XHRpZiggdGhpcy5wcm9wcy5tb2RhbCAmJiAhdGhpcy5faXNzaG93biApIHtcclxuXHRcdFx0dGhpcy5fc2hvd01vZGFsTWFzayggKTtcclxuXHRcdFx0bW9kYWxfc3RhY2sucHVzaCggdGhpcyApO1xyXG5cdFx0XHRtb2RhbF9jb3VudCsrO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2lzc2hvd24gPSB0cnVlO1xyXG5cdFx0XHJcblx0XHRpZiggdGhpcy5wcm9wcy5hdXRvQ2xvc2UgKSB7XHJcblx0XHRcdGlmKCBhdXRvY2xvc2VfbGlzdC5sZW5ndGg9PTAgKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJwb2ludGVyZG93blwiLCB0aGlzLl9kaXNtaXNzICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGF1dG9jbG9zZV9saXN0LnB1c2goIHRoaXMgKTtcclxuXHRcdFx0dGhpcy5zZXREYXRhKCBcImNsb3NlXCIsIHRoaXMucHJvcHMuYXV0b0Nsb3NlPT09dHJ1ZSA/IG1ha2VVbmlxdWVDb21wb25lbnRJZCgpIDogdGhpcy5wcm9wcy5hdXRvQ2xvc2UgKTtcclxuXHRcdH1cclxuXHJcblx0XHRwb3B1cF9saXN0LnB1c2goIHRoaXMgKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHRoaXMuZG9tICk7XHJcblxyXG5cdFx0dGhpcy5zaG93KCApO1xyXG5cdH1cclxuXHJcblx0b3ZlcnJpZGUgc2hvdyggc2hvdyA9IHRydWUgKSB7XHJcblx0XHR0aGlzLl9pc29wZW4gPSBzaG93O1xyXG5cdFx0c3VwZXIuc2hvdyggc2hvdyApO1xyXG5cdH1cclxuXHJcblx0aXNPcGVuKCApIHtcclxuXHRcdHJldHVybiB0aGlzLl9pc29wZW47XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0Y2xvc2UoICkge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggdGhpcy5kb20gKTtcclxuXHJcblx0XHQvLyByZW1vdmUgZnJvbSBwb3B1cCBsaXN0XHJcblx0XHRjb25zdCBpZHggPSBwb3B1cF9saXN0LmluZGV4T2YoIHRoaXMgKTtcclxuXHRcdGNvbnNvbGUuYXNzZXJ0KCBpZHg+PTAgKTtcclxuXHRcdHBvcHVwX2xpc3Quc3BsaWNlKCBpZHgsIDEgKTtcclxuXHJcblx0XHQvLyByZW1vdmUgZnJvbSBhdXRvIGNsb3NlIGxpc3RcclxuXHRcdGlmKCB0aGlzLnByb3BzLmF1dG9DbG9zZSApIHtcclxuXHRcdFx0Y29uc3QgaWR4ID0gYXV0b2Nsb3NlX2xpc3QuaW5kZXhPZiggdGhpcyApO1xyXG5cdFx0XHRpZiggaWR4Pj0wICkge1xyXG5cdFx0XHRcdGF1dG9jbG9zZV9saXN0LnNwbGljZSggaWR4LCAxICk7XHJcblx0XHRcdFx0aWYoIGF1dG9jbG9zZV9saXN0Lmxlbmd0aD09MCApIHtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwicG9pbnRlcmRvd25cIiwgdGhpcy5fZGlzbWlzcyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHVwZGF0ZSBtYXNrXHJcblx0XHRpZiggdGhpcy5wcm9wcy5tb2RhbCApIHtcclxuXHRcdFx0Y29uc3QgdG9wID0gbW9kYWxfc3RhY2sucG9wKCApO1xyXG5cdFx0XHRjb25zb2xlLmFzc2VydCggdG9wPT10aGlzICk7XHJcblx0XHRcdHRoaXMuX3VwZGF0ZU1vZGFsTWFzayggKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9pc3Nob3duID0gZmFsc2U7XHJcblx0XHR0aGlzLmZpcmUoIFwiY2xvc2VkXCIsIHt9ICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBiaW5kZWRcclxuXHQgKi9cclxuXHJcblx0cHJpdmF0ZSBfZGlzbWlzcyA9ICggZTogVUlFdmVudCApID0+IHtcclxuXHRcdGNvbnN0IG9uYWMgPSBhdXRvY2xvc2VfbGlzdC5zb21lKCB4PT4geC5kb20uY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkgKVxyXG5cdFx0aWYoIG9uYWMgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCApO1xyXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oICk7XHJcblxyXG5cdFx0dGhpcy5kaXNtaXNzKCApO1xyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBkaXNtaXNzIGFsbCBwb3B1cCBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgZ3JvdXAgYXMgJ3RoaXMnXHJcblx0ICovXHJcblxyXG5cdGRpc21pc3MoIGFmdGVyID0gZmFsc2UgKSB7XHJcblxyXG5cdFx0aWYoIGF1dG9jbG9zZV9saXN0Lmxlbmd0aD09MCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGNncm91cCA9IHRoaXMuZ2V0RGF0YSggXCJjbG9zZVwiICk7XHJcblx0XHRjb25zdCBpbmNfZ3JvdXA6IFBvcHVwW10gPSBbXTtcclxuXHRcdGNvbnN0IGV4Y2xfZ3JvdXA6IFBvcHVwW10gPSBbXTtcclxuXHRcdFxyXG5cdFx0bGV0IGFpZHggPSAtMTtcclxuXHRcdGlmKCBhZnRlciApIHtcclxuXHRcdFx0YWlkeCA9IGF1dG9jbG9zZV9saXN0LmluZGV4T2YoIHRoaXMgKTtcclxuXHRcdH1cclxuXHJcblx0XHRhdXRvY2xvc2VfbGlzdC5mb3JFYWNoKCAoeCxpZHgpID0+IHtcclxuXHRcdFx0Y29uc3QgZ3JvdXAgPSB4LmdldERhdGEoIFwiY2xvc2VcIiApO1xyXG5cdFx0XHRpZiggZ3JvdXA9PWNncm91cCAmJiBpZHg+YWlkeCkge1xyXG5cdFx0XHRcdGluY19ncm91cC5wdXNoKCB4ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZXhjbF9ncm91cC5wdXNoKCB4ICk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblxyXG5cdFx0Y29uc3QgbGlzdCA9IGluY19ncm91cC5yZXZlcnNlKCApO1xyXG5cdFx0YXV0b2Nsb3NlX2xpc3QgPSBleGNsX2dyb3VwO1xyXG5cdFx0aWYoIGF1dG9jbG9zZV9saXN0Lmxlbmd0aD09MCApIHtcclxuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggXCJwb2ludGVyZG93blwiLCB0aGlzLl9kaXNtaXNzICk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGxpc3QuZm9yRWFjaCggeCA9PiB4LmNsb3NlKCkgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRwcml2YXRlIF9zaG93TW9kYWxNYXNrKCApIHtcclxuXHRcdFxyXG5cdFx0aWYoICFtb2RhbF9tYXNrICkge1xyXG5cdFx0XHRtb2RhbF9tYXNrID0gbmV3IENvbXBvbmVudCgge1xyXG5cdFx0XHRcdGNsczogXCJ4NG1vZGFsLW1hc2tcIixcclxuXHRcdFx0XHRkb21FdmVudHM6IHtcclxuXHRcdFx0XHRcdGNsaWNrOiB0aGlzLl9kaXNtaXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRtb2RhbF9tYXNrLnNob3coIHRydWUgKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCBcImJlZm9yZWVuZFwiLCBtb2RhbF9tYXNrLmRvbSApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHByaXZhdGUgX3VwZGF0ZU1vZGFsTWFzayggKSB7XHJcblx0XHRpZiggLS1tb2RhbF9jb3VudCA9PSAwICkge1xyXG5cdFx0XHRtb2RhbF9tYXNrLnNob3coIGZhbHNlICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5kb20uaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCBcImJlZm9yZWJlZ2luXCIsIG1vZGFsX21hc2suZG9tICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cHJpdmF0ZSBfY3JlYXRlU2l6ZXJzKCApIHtcclxuXHRcdHRoaXMuYXBwZW5kQ29udGVudCggW1xyXG5cdFx0XHRuZXcgQ1NpemVyKCBcInRvcFwiICksXHJcblx0XHRcdG5ldyBDU2l6ZXIoIFwiYm90dG9tXCIgKSxcclxuXHRcdFx0bmV3IENTaXplciggXCJsZWZ0XCIgKSxcclxuXHRcdFx0bmV3IENTaXplciggXCJyaWdodFwiICksXHJcblx0XHRcdG5ldyBDU2l6ZXIoIFwidG9wLWxlZnRcIiApLFxyXG5cdFx0XHRuZXcgQ1NpemVyKCBcImJvdHRvbS1sZWZ0XCIgKSxcclxuXHRcdFx0bmV3IENTaXplciggXCJ0b3AtcmlnaHRcIiApLFxyXG5cdFx0XHRuZXcgQ1NpemVyKCBcImJvdHRvbS1yaWdodFwiICksXHJcblx0XHRdKVxyXG5cdH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5jbGFzcyBDTW92ZXIge1xyXG5cdHByaXZhdGUgcmVmOiBDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBkZWx0YTogUG9pbnQ7XHJcblx0cHJpdmF0ZSBzZWxmOiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3RvciggeDogQ29tcG9uZW50LCByZWY/OiBDb21wb25lbnQgKSB7XHJcblxyXG5cdFx0dGhpcy5zZWxmID0gcmVmID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuXHRcdHguYWRkRE9NRXZlbnQoIFwicG9pbnRlcmRvd25cIiwgKCBlOiBQb2ludGVyRXZlbnQgKSA9PiB7XHJcblx0XHRcdGlmKCB0aGlzLnNlbGYgJiYgZS50YXJnZXQhPXguZG9tICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0eC5zZXRDYXB0dXJlKCBlLnBvaW50ZXJJZCApO1xyXG5cclxuXHRcdFx0dGhpcy5yZWYgPSByZWYgPz8gY29tcG9uZW50RnJvbURPTSggeC5kb20ucGFyZW50RWxlbWVudCApO1xyXG5cclxuXHRcdFx0dGhpcy5kZWx0YSA9IHt4OjAseTowfTtcclxuXHRcdFx0Y29uc3QgcmMgPSB0aGlzLnJlZi5nZXRCb3VuZGluZ1JlY3QoKTtcclxuXHJcblx0XHRcdHRoaXMuZGVsdGEueCA9IGUucGFnZVgtcmMubGVmdDtcclxuXHRcdFx0dGhpcy5kZWx0YS55ID0gZS5wYWdlWS1yYy50b3A7XHJcblx0XHR9KTtcclxuXHJcblx0XHR4LmFkZERPTUV2ZW50KCBcInBvaW50ZXJ1cFwiLCAoIGU6IFBvaW50ZXJFdmVudCApID0+IHtcclxuXHRcdFx0eC5yZWxlYXNlQ2FwdHVyZSggZS5wb2ludGVySWQgKTtcclxuXHRcdFx0dGhpcy5yZWYgPSBudWxsO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0eC5hZGRET01FdmVudCggXCJwb2ludGVybW92ZVwiLCAoIGU6IFBvaW50ZXJFdmVudCApID0+IHtcclxuXHRcdFx0dGhpcy5fb25Nb3VzZU1vdmUoIGUgKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25Nb3VzZU1vdmUoIGU6IFBvaW50ZXJFdmVudCApIHtcclxuXHRcdGlmKCAhdGhpcy5yZWYgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwdCA9IHsgeDogZS5wYWdlWC10aGlzLmRlbHRhLngsIHk6IGUucGFnZVktdGhpcy5kZWx0YS55IH07XHJcblx0XHRjb25zdCByYyA9IHRoaXMucmVmLmdldEJvdW5kaW5nUmVjdCggKTtcclxuXHJcblx0XHRsZXQgbnI6IGFueSA9IHtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5yZWYuc2V0U3R5bGUoIHtcclxuXHRcdFx0dG9wOiBwdC55K1wiXCIsXHJcblx0XHRcdGxlZnQ6IHB0LngrXCJcIixcclxuXHRcdH0gKTtcclxuXHRcdFxyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCggKTtcclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCApO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIG1lbnUudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50XCJcclxuaW1wb3J0IHsgRE9NRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX2RvbSc7XHJcbmltcG9ydCB7IFRpbWVyLCBVbnNhZmVIdG1sLCBpc1N0cmluZyB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scyc7XHJcblxyXG5pbXBvcnQgeyBQb3B1cCwgUG9wdXBQcm9wcyB9IGZyb20gJy4uL3BvcHVwL3BvcHVwJztcclxuaW1wb3J0IHsgSWNvbiB9IGZyb20gJy4uL2ljb24vaWNvbic7XHJcblxyXG5pbXBvcnQgXCIuL21lbnUubW9kdWxlLnNjc3NcIlxyXG5cclxuY29uc3QgT1BFTl9ERUxBWSA9IDQwMDtcclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuXHRjbHM/OiBzdHJpbmc7XHJcblx0aWNvbj86IHN0cmluZztcclxuXHR0ZXh0OiBzdHJpbmcgfCBVbnNhZmVIdG1sO1xyXG5cdG1lbnU/OiBNZW51O1xyXG5cdGRpc2FibGVkPzogdHJ1ZTtcclxuXHRjbGljaz86IERPTUV2ZW50SGFuZGxlcjtcclxufVxyXG5cclxudHlwZSBNZW51RWxlbWVudCA9IE1lbnVJdGVtIHwgQ29tcG9uZW50IHwgc3RyaW5nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNZW51UHJvcHMgZXh0ZW5kcyBPbWl0PFBvcHVwUHJvcHMsXCJjb250ZW50XCI+IHtcclxuXHRpdGVtczogTWVudUVsZW1lbnRbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmNsYXNzIENNZW51U2VwIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3RvciggKSB7XHJcblx0XHRzdXBlciggeyB9ICk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuY29uc3Qgb3BlblRpbWVyID0gbmV3IFRpbWVyKCApO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmNsYXNzIENNZW51SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG5cdHByaXZhdGUgbWVudTogTWVudTtcclxuXHRcclxuXHRjb25zdHJ1Y3RvciggaXRtOiBNZW51SXRlbSApIHtcclxuXHRcdHN1cGVyKCB7IGRpc2FibGVkOiBpdG0uZGlzYWJsZWQsIGNsczogaXRtLmNscyB9ICk7XHJcblxyXG5cdFx0aWYoIGl0bS5tZW51ICkge1xyXG5cdFx0XHR0aGlzLmFkZENsYXNzKCBcInBvcHVwXCIgKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0bmV3IEljb24oeyBpZDpcImljb25cIixpY29uSWQ6aXRtLmljb259KSwgXHJcblx0XHRcdG5ldyBDb21wb25lbnQoIHsgaWQ6IFwidGV4dFwiLCBjb250ZW50OiBpdG0udGV4dCB9IClcclxuXHRcdF0pO1xyXG5cclxuXHRcdGlmKCBpdG0ubWVudSApIHtcclxuXHRcdFx0dGhpcy5tZW51ID0gaXRtLm1lbnU7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmFkZERPTUV2ZW50KCBcIm1vdXNlZW50ZXJcIiwgKCApID0+IHRoaXMub3BlblN1YiggdHJ1ZSApICk7XHJcblx0XHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwiY2xpY2tcIiwgKCApID0+IHRoaXMub3BlblN1YiggZmFsc2UgKSApO1xyXG5cdFx0XHR0aGlzLmFkZERPTUV2ZW50KCBcIm1vdXNlbGVhdmVcIiwgKCApID0+IHRoaXMuY2xvc2VTdWIoKSApO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5tZW51Lm9uKCBcIm9wZW5lZFwiLCAoICkgPT4gdGhpcy5hZGRDbGFzcyggXCJvcGVuZWRcIiApICk7XHJcblx0XHRcdHRoaXMubWVudS5vbiggXCJjbG9zZWRcIiwgKCApID0+IHRoaXMucmVtb3ZlQ2xhc3MoIFwib3BlbmVkXCIgKSApO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwibW91c2VlbnRlclwiLCAoICkgPT4geyBvcGVuVGltZXIuc2V0VGltZW91dCggXCJvcGVuXCIsIE9QRU5fREVMQVksICggKSA9PiB7dGhpcy5kaXNtaXNzKHRydWUpfSk7IH0gKTtcclxuXHRcdFx0dGhpcy5hZGRET01FdmVudCggXCJjbGlja1wiLCAoICkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZGlzbWlzcyggZmFsc2UgKTtcclxuXHRcdFx0XHRpZiggaXRtLmNsaWNrICkge1xyXG5cdFx0XHRcdFx0aXRtLmNsaWNrKCBuZXcgRXZlbnQoXCJjbGlja1wiKSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGRpc21pc3MoIGFmdGVyOiBib29sZWFuICkge1xyXG5cdFx0Y29uc3QgbWVudSA9IHRoaXMucGFyZW50RWxlbWVudCggTWVudSApO1xyXG5cdFx0aWYoIG1lbnUgKSB7XHJcblx0XHRcdG1lbnUuZGlzbWlzcyggYWZ0ZXIgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0b3BlblN1YiggZGVsYXllZDogYm9vbGVhbiApIHtcclxuXHRcdGNvbnN0IG9wZW4gPSAoICkgPT4ge1xyXG5cdFx0XHR0aGlzLmRpc21pc3MoIHRydWUgKTtcclxuXHRcdFxyXG5cdFx0XHRjb25zdCByYyA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCApO1xyXG5cdFx0XHR0aGlzLm1lbnUuZGlzcGxheUF0KCByYy5yaWdodC00LCByYy50b3AgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggZGVsYXllZCApIHtcclxuXHRcdFx0b3BlblRpbWVyLnNldFRpbWVvdXQoIFwib3BlblwiLCBPUEVOX0RFTEFZLCBvcGVuICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0b3BlblRpbWVyLmNsZWFyVGltZW91dCggXCJvcGVuXCIgKTtcclxuXHRcdFx0b3BlbiggKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsb3NlU3ViKCApIHtcclxuXHRcdG9wZW5UaW1lci5jbGVhclRpbWVvdXQoIFwib3BlblwiICk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lbnUgZXh0ZW5kcyBQb3B1cCB7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBNZW51UHJvcHMgKSB7XHJcblx0XHRzdXBlciggeyAuLi5wcm9wcywgYXV0b0Nsb3NlOiBcIm1lbnVcIiwgbW9kYWw6IGZhbHNlIH0gKTtcclxuXHJcblx0XHR0aGlzLmFkZENsYXNzKCBcIng0dmJveFwiICk7XHJcblxyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSBwcm9wcy5pdGVtcz8ubWFwKCBpdG0gPT4ge1xyXG5cdFx0XHRpZiggaXRtPT09XCItXCIgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBDTWVudVNlcCggKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKCBpc1N0cmluZyhpdG0pICkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgQ01lbnVJdGVtKCB7IHRleHQ6IGl0bSwgY2xpY2s6IG51bGwsIGNsczogJ3RpdGxlJyB9ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiggaXRtIGluc3RhbmNlb2YgQ29tcG9uZW50ICkge1xyXG5cdFx0XHRcdHJldHVybiBpdG07XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBDTWVudUl0ZW0oIGl0bSApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIGNoaWxkcmVuICk7XHJcblx0fVxyXG59XHJcblxyXG4iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgY2FsZW5kYXIudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzLCBFdkNoYW5nZSwgRmxleCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50J1xyXG5pbXBvcnQgeyBkYXRlX2Nsb25lLCBkYXRlX2hhc2gsIGZvcm1hdEludGxEYXRlLCBQb2ludCwgdW5zYWZlSHRtbCB9IGZyb20gXCIuLi8uLi9jb3JlL2NvcmVfdG9vbHNcIlxyXG5pbXBvcnQgeyBfdHIgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfaTE4bic7XHJcbmltcG9ydCB7IEV2ZW50Q2FsbGJhY2sgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfZXZlbnRzLmpzJztcclxuXHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2J1dHRvbi9idXR0b24nO1xyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsJztcclxuaW1wb3J0IHsgSEJveCwgVkJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJ1xyXG5pbXBvcnQgeyBNZW51LCBNZW51SXRlbSB9IGZyb20gJy4uL21lbnUvbWVudSc7XHJcblxyXG5pbXBvcnQgXCIuL2NhbGVuZGFyLm1vZHVsZS5zY3NzXCJcclxuXHJcbmltcG9ydCBpY29uX3ByZXYgZnJvbSBcIi4vY2hldnJvbi1sZWZ0LXNoYXJwLWxpZ2h0LnN2Z1wiO1xyXG5pbXBvcnQgaWNvbl90b2RheSBmcm9tIFwiLi9jYWxlbmRhci1jaGVjay1zaGFycC1saWdodC5zdmdcIjtcclxuaW1wb3J0IGljb25fbmV4dCBmcm9tIFwiLi9jaGV2cm9uLXJpZ2h0LXNoYXJwLWxpZ2h0LnN2Z1wiO1xyXG5cclxuaW50ZXJmYWNlIENhbGVuZGFyRXZlbnRNYXAgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xyXG5cdGNoYW5nZT86IEV2Q2hhbmdlO1xyXG59XHJcblxyXG5cclxuaW50ZXJmYWNlIENhbGVuZGFyUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0ZGF0ZT86IERhdGU7XHQvLyBpbml0aWFsIGRhdGUgdG8gZGlzcGxheVxyXG5cdG1pbkRhdGU/OiBEYXRlO1x0Ly8gbWluaW1hbCBkYXRlIGJlZm9yZSB0aGUgdXNlciBjYW5ub3QgZ29cclxuXHRtYXhEYXRlPzogRGF0ZTtcdC8vIG1heGltYWwgZGF0ZSBhZnRlciB0aGUgdXNlciBjYW5ub3QgZ29cclxuXHJcblx0Y2hhbmdlPzogRXZlbnRDYWxsYmFjazxFdkNoYW5nZT47IC8vIHNob3J0Y3V0IHRvIGV2ZW50czogeyBjaGFuZ2U6IC4uLiB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogZGVmYXVsdCBjYWxlbmRhciBjb250cm9sXHJcbiAqIFxyXG4gKiBmaXJlczpcclxuICogXHRFdmVudENoYW5nZSAoIHZhbHVlID0gRGF0ZSApXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbGVuZGFyIGV4dGVuZHMgVkJveDxDYWxlbmRhclByb3BzLCBDYWxlbmRhckV2ZW50TWFwPlxyXG57XHJcblx0cHJpdmF0ZSBtX2RhdGU6IERhdGU7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByb3BzOiBDYWxlbmRhclByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy5tYXBQcm9wRXZlbnRzKCBwcm9wcywgJ2NoYW5nZScgKTtcclxuXHRcdHRoaXMubV9kYXRlID0gcHJvcHMuZGF0ZSA/IGRhdGVfY2xvbmUoIHByb3BzLmRhdGUgKSA6IG5ldyBEYXRlKCk7XHJcblxyXG5cdFx0dGhpcy5fdXBkYXRlKCApO1xyXG5cdH1cclxuXHJcblx0LyoqIEBpZ25vcmUgKi9cclxuXHJcblx0cHJpdmF0ZSBfdXBkYXRlKCApIHtcclxuXHJcblx0XHRsZXQgbW9udGhfc3RhcnQgPSBkYXRlX2Nsb25lKHRoaXMubV9kYXRlKTtcclxuXHRcdG1vbnRoX3N0YXJ0LnNldERhdGUoMSk7XHJcblxyXG5cdFx0bGV0IGRheSA9IG1vbnRoX3N0YXJ0LmdldERheSgpO1xyXG5cdFx0aWYgKGRheSA9PSAwKSB7XHJcblx0XHRcdGRheSA9IDc7XHJcblx0XHR9XHJcblxyXG5cdFx0bW9udGhfc3RhcnQuc2V0RGF0ZSgtZGF5ICsgMSArIDEpO1xyXG5cdFx0bGV0IGR0ZSA9IGRhdGVfY2xvbmUobW9udGhfc3RhcnQpO1xyXG5cclxuXHRcdGxldCBzZWxlY3Rpb24gPSBkYXRlX2hhc2goIHRoaXMubV9kYXRlICk7XHJcblx0XHRsZXQgdG9kYXkgPSBkYXRlX2hhc2goIG5ldyBEYXRlKCkgKTtcclxuXHJcblx0XHRsZXQgbW9udGhfZW5kID0gZGF0ZV9jbG9uZSh0aGlzLm1fZGF0ZSk7XHJcblx0XHRtb250aF9lbmQuc2V0RGF0ZSgxKTtcclxuXHRcdG1vbnRoX2VuZC5zZXRNb250aChtb250aF9lbmQuZ2V0TW9udGgoKSArIDEpO1xyXG5cdFx0bW9udGhfZW5kLnNldERhdGUoMCk7XHJcblxyXG5cdFx0bGV0IGVuZF9vZl9tb250aCA9IGRhdGVfaGFzaChtb250aF9lbmQpO1xyXG5cclxuXHRcdGxldCByb3dzOiBIQm94W10gPSBbXTtcclxuXHJcblx0XHQvLyBtb250aCBzZWxlY3RvclxyXG5cdFx0bGV0IGhlYWRlciA9IG5ldyBIQm94KHtcclxuXHRcdFx0Y2xzOiAnbW9udGgtc2VsJyxcclxuXHRcdFx0Y29udGVudDogW1xyXG5cdFx0XHRcdG5ldyBMYWJlbCh7XHJcblx0XHRcdFx0XHRjbHM6ICdtb250aCcsXHJcblx0XHRcdFx0XHR0ZXh0OiBmb3JtYXRJbnRsRGF0ZSh0aGlzLm1fZGF0ZSwgJ08nKSxcclxuXHRcdFx0XHRcdGRvbV9ldmVudHM6IHtcclxuXHRcdFx0XHRcdFx0Y2xpY2s6ICgpID0+IHRoaXMuX2Nob29zZSgnbW9udGgnKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLFxyXG5cdFx0XHRcdG5ldyBMYWJlbCh7XHJcblx0XHRcdFx0XHRjbHM6ICd5ZWFyJyxcclxuXHRcdFx0XHRcdHRleHQ6IGZvcm1hdEludGxEYXRlKHRoaXMubV9kYXRlLCAnWScpLFxyXG5cdFx0XHRcdFx0ZG9tX2V2ZW50czoge1xyXG5cdFx0XHRcdFx0XHRjbGljazogKCkgPT4gdGhpcy5fY2hvb3NlKCd5ZWFyJylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KSxcclxuXHRcdFx0XHRuZXcgRmxleCggKSxcclxuXHRcdFx0XHRuZXcgQnV0dG9uKHsgaWNvbjogaWNvbl9wcmV2LCBjbGljazogKCkgPT4gdGhpcy5fbmV4dChmYWxzZSkgfSApLFxyXG5cdFx0XHRcdG5ldyBCdXR0b24oeyBpY29uOiBpY29uX3RvZGF5LCBjbGljazogKCkgPT4gdGhpcy5zZXREYXRlKG5ldyBEYXRlKCkpLCB0b29sdGlwOiBfdHIuZ2xvYmFsLnRvZGF5IH0gKSxcclxuXHRcdFx0XHRuZXcgQnV0dG9uKHsgaWNvbjogaWNvbl9uZXh0LCBjbGljazogKCkgPT4gdGhpcy5fbmV4dCh0cnVlKSB9IClcclxuXHRcdFx0XVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cm93cy5wdXNoKGhlYWRlcik7XHJcblxyXG5cdFx0Ly8gY2FsZW5kYXIgcGFydFxyXG5cdFx0bGV0IGRheV9uYW1lcyA9IFtdO1xyXG5cclxuXHRcdC8vIGRheSBuYW1lc1xyXG5cdFx0Ly8gZW1wdHkgd2VlayBudW1cclxuXHRcdGRheV9uYW1lcy5wdXNoKG5ldyBIQm94KHtcclxuXHRcdFx0Y2xzOiAnd2Vla251bSBjZWxsJyxcclxuXHRcdH0pKTtcclxuXHJcblx0XHRmb3IgKGxldCBkID0gMDsgZCA8IDc7IGQrKykge1xyXG5cdFx0XHRkYXlfbmFtZXMucHVzaChuZXcgTGFiZWwoe1xyXG5cdFx0XHRcdGNsczogJ2NlbGwnLFxyXG5cdFx0XHRcdHRleHQ6IF90ci5nbG9iYWwuZGF5X3Nob3J0WyhkICsgMSkgJSA3XVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93cy5wdXNoKG5ldyBIQm94KHtcclxuXHRcdFx0Y2xzOiAnd2VlayBoZWFkZXInLFxyXG5cdFx0XHRjb250ZW50OiBkYXlfbmFtZXNcclxuXHRcdH0pKTtcclxuXHJcblx0XHRsZXQgY21vbnRoID0gdGhpcy5tX2RhdGUuZ2V0TW9udGgoKTtcclxuXHJcblx0XHQvLyB3ZWVrc1xyXG5cdFx0bGV0IGZpcnN0ID0gdHJ1ZTtcclxuXHRcdHdoaWxlIChkYXRlX2hhc2goZHRlKSA8PSBlbmRfb2ZfbW9udGgpIHtcclxuXHJcblx0XHRcdGxldCBkYXlzOiBDb21wb25lbnRbXSA9IFtcclxuXHRcdFx0XHRuZXcgSEJveCh7IGNsczogJ3dlZWtudW0gY2VsbCcsIGNvbnRlbnQ6IG5ldyBDb21wb25lbnQoeyB0YWc6ICdzcGFuJywgY29udGVudDogZm9ybWF0SW50bERhdGUoZHRlLCAndycpIH0pIH0pXHJcblx0XHRcdF07XHJcblxyXG5cdFx0XHQvLyBkYXlzXHJcblx0XHRcdGZvciAobGV0IGQgPSAwOyBkIDwgNzsgZCsrKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjbHMgPSAnY2VsbCBkYXknO1xyXG5cdFx0XHRcdGlmIChkYXRlX2hhc2goZHRlKSA9PSBzZWxlY3Rpb24pIHtcclxuXHRcdFx0XHRcdGNscyArPSAnIHNlbGVjdGlvbic7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoZGF0ZV9oYXNoKGR0ZSkgPT0gdG9kYXkpIHtcclxuXHRcdFx0XHRcdGNscyArPSAnIHRvZGF5JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChkdGUuZ2V0TW9udGgoKSAhPSBjbW9udGgpIHtcclxuXHRcdFx0XHRcdGNscyArPSAnIG91dCc7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBta0l0ZW0gPSAoIGR0ZTogRGF0ZSApID0+IHtcclxuXHRcdFx0XHRcdHJldHVybiBuZXcgSEJveCh7XHJcblx0XHRcdFx0XHRcdGNscyxcclxuXHRcdFx0XHRcdFx0ZmxleDogMSxcclxuXHRcdFx0XHRcdFx0Y29udGVudDogbmV3IENvbXBvbmVudCh7XHJcblx0XHRcdFx0XHRcdFx0Y2xzOiBcInRleHRcIixcclxuXHRcdFx0XHRcdFx0XHRjb250ZW50OiB1bnNhZmVIdG1sKCBgPHNwYW4+JHtmb3JtYXRJbnRsRGF0ZShkdGUsICdkJyl9PC9zcGFuPmAgKSxcclxuXHRcdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XHRcdGRvbV9ldmVudHM6IHtcclxuXHRcdFx0XHRcdFx0XHRjbGljazogKCkgPT4gdGhpcy5zZWxlY3QoZHRlKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZGF5cy5wdXNoKCBta0l0ZW0oIGRhdGVfY2xvbmUoIGR0ZSApICkgKTtcclxuXHJcblx0XHRcdFx0ZHRlLnNldERhdGUoZHRlLmdldERhdGUoKSArIDEpO1xyXG5cdFx0XHRcdGZpcnN0ID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJvd3MucHVzaChuZXcgSEJveCh7XHJcblx0XHRcdFx0Y2xzOiAnd2VlaycsXHJcblx0XHRcdFx0ZmxleDogMSxcclxuXHRcdFx0XHRjb250ZW50OiBkYXlzXHJcblx0XHRcdH0pKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQocm93cyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBzZWxlY3QgdGhlIGdpdmVuIGRhdGVcclxuXHQgKiBAcGFyYW0gZGF0ZSBcclxuXHQgKi9cclxuXHJcblx0cHJpdmF0ZSBzZWxlY3QoZGF0ZTogRGF0ZSkge1xyXG5cdFx0dGhpcy5tX2RhdGUgPSBkYXRlO1xyXG5cdFx0dGhpcy5maXJlKCdjaGFuZ2UnLCB7dmFsdWU6ZGF0ZX0gKTtcclxuXHRcdHRoaXMuX3VwZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHByaXZhdGUgX25leHQobjogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5tX2RhdGUuc2V0TW9udGgodGhpcy5tX2RhdGUuZ2V0TW9udGgoKSArIChuID8gMSA6IC0xKSk7XHJcblx0XHR0aGlzLl91cGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRwcml2YXRlIF9jaG9vc2UodHlwZTogJ21vbnRoJyB8ICd5ZWFyJykge1xyXG5cclxuXHRcdGxldCBpdGVtczogTWVudUl0ZW1bXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0eXBlID09ICdtb250aCcpIHtcclxuXHRcdFx0Zm9yIChsZXQgbSA9IDA7IG0gPCAxMjsgbSsrKSB7XHJcblx0XHRcdFx0aXRlbXMucHVzaCgoe1xyXG5cdFx0XHRcdFx0dGV4dDogX3RyLmdsb2JhbC5tb250aF9sb25nW21dLFxyXG5cdFx0XHRcdFx0Y2xpY2s6ICgpID0+IHsgdGhpcy5tX2RhdGUuc2V0TW9udGgobSk7IHRoaXMuX3VwZGF0ZSgpOyB9XHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0eXBlID09ICd5ZWFyJykge1xyXG5cclxuXHRcdFx0bGV0IG1pbiA9IHRoaXMucHJvcHMubWluRGF0ZT8uZ2V0RnVsbFllYXIoKSA/PyAxOTAwO1xyXG5cdFx0XHRsZXQgbWF4ID0gdGhpcy5wcm9wcy5tYXhEYXRlPy5nZXRGdWxsWWVhcigpID8/IDIwMzc7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBtID0gbWF4OyBtID49IG1pbjsgbS0tKSB7XHJcblx0XHRcdFx0aXRlbXMucHVzaCh7XHJcblx0XHRcdFx0XHR0ZXh0OiAnJyArIG0sXHJcblx0XHRcdFx0XHRjbGljazogKCkgPT4geyB0aGlzLm1fZGF0ZS5zZXRGdWxsWWVhcihtKTsgdGhpcy5fdXBkYXRlKCk7IH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBtZW51ID0gbmV3IE1lbnUoe1xyXG5cdFx0XHRpdGVtc1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IHJjID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QoKTtcclxuXHRcdG1lbnUuZGlzcGxheUF0KHJjLmxlZnQsIHJjLnRvcCk7XHJcblx0fVxyXG5cclxuXHRnZXREYXRlKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMubV9kYXRlO1xyXG5cdH1cclxuXHJcblx0c2V0RGF0ZShkYXRlOiBEYXRlKSB7XHJcblx0XHR0aGlzLm1fZGF0ZSA9IGRhdGU7XHJcblx0XHR0aGlzLl91cGRhdGUoKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBkZWZhdWx0IHBvcHVwIGNhbGVuZGFyXHJcbiAqIC9cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3B1cENhbGVuZGFyIGV4dGVuZHMgUG9wdXAge1xyXG5cclxuXHRtX2NhbDogQ2FsZW5kYXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByb3BzOiBDYWxlbmRhclByb3BzKSB7XHJcblx0XHRzdXBlcih7IHRhYkluZGV4OiAxIH0pO1xyXG5cclxuXHRcdHRoaXMuZW5hYmxlTWFzayhmYWxzZSk7XHJcblxyXG5cdFx0dGhpcy5tX2NhbCA9IG5ldyBDYWxlbmRhcihwcm9wcyk7XHJcblx0XHR0aGlzLm1fY2FsLmFkZENsYXNzKCdAZml0Jyk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb250ZW50KHRoaXMubV9jYWwpO1xyXG5cdH1cclxuXHJcblx0Ly8gYmluZGVkXHJcblx0cHJpdmF0ZSBfaGFuZGxlQ2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG5cdFx0aWYgKCF0aGlzLmRvbSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IG5ld2ZvY3VzID0gPEhUTUxFbGVtZW50PmUudGFyZ2V0O1xyXG5cclxuXHRcdC8vIGNoaWxkIG9mIHRoaXM6IG9rXHJcblx0XHRpZiAodGhpcy5kb20uY29udGFpbnMobmV3Zm9jdXMpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBtZW51OiBva1xyXG5cdFx0bGV0IGRlc3QgPSBDb21wb25lbnQuZ2V0RWxlbWVudChuZXdmb2N1cywgTWVudUl0ZW0pO1xyXG5cdFx0aWYgKGRlc3QpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuY2xvc2UoKTtcclxuXHR9XHJcblxyXG5cdC8gKiogQGlnbm9yZSAqIC9cclxuXHRzaG93KG1vZGFsPzogYm9vbGVhbiwgYXQ/OiBQb2ludCApIHtcclxuXHRcdHg0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5faGFuZGxlQ2xpY2spO1xyXG5cdFx0aWYoIGF0ICkge1xyXG5cdFx0XHRzdXBlci5kaXNwbGF5QXQoIGF0LngsIGF0LnksICd0b3AgbGVmdCcsIHVuZGVmaW5lZCwgbW9kYWwgKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzdXBlci5zaG93KG1vZGFsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8gKiogQGlnbm9yZSAqIC9cclxuXHRjbG9zZSgpIHtcclxuXHRcdHg0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5faGFuZGxlQ2xpY2spO1xyXG5cdFx0c3VwZXIuY2xvc2UoKTtcclxuXHR9XHJcbn1cclxuKi8iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgaW5wdXQudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcclxuaW1wb3J0IHsgSUNvbXBvbmVudEludGVyZmFjZSwgSUZvcm1FbGVtZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcclxuXHJcbmltcG9ydCBcIi4vaW5wdXQubW9kdWxlLnNjc3NcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCYXNlUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0bmFtZT86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIENoZWNrYm94UHJvcHMgZXh0ZW5kcyBCYXNlUHJvcHMge1xyXG5cdHR5cGU6IFwiY2hlY2tib3hcIjtcclxuXHR2YWx1ZT86IGJvb2xlYW4gfCBudW1iZXIgfCBzdHJpbmc7XHJcblx0Y2hlY2tlZD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBSYWRpb1Byb3BzIGV4dGVuZHMgQmFzZVByb3BzIHtcclxuXHR0eXBlOiBcInJhZGlvXCI7XHJcblx0dmFsdWU6IGJvb2xlYW4gfCBudW1iZXIgfCBzdHJpbmc7XHJcblx0Y2hlY2tlZD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VQcm9wcyBleHRlbmRzIEJhc2VQcm9wcyB7XHJcblx0dHlwZTogXCJyYW5nZVwiO1xyXG5cdHZhbHVlOiBudW1iZXI7XHJcblx0bWluOiBudW1iZXI7XHJcblx0bWF4OiBudW1iZXI7XHJcblx0c3RlcD86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIERhdGVQcm9wcyBleHRlbmRzIEJhc2VQcm9wcyB7XHJcblx0dHlwZTogXCJkYXRlXCI7XHJcblx0cmVhZG9ubHk/OiBib29sZWFuO1xyXG5cdHJlcXVpcmVkPzogYm9vbGVhbjtcclxuXHR2YWx1ZTogRGF0ZSB8IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIE51bWJlclByb3BzIGV4dGVuZHMgQmFzZVByb3BzIHtcclxuXHR0eXBlOiBcIm51bWJlclwiO1xyXG5cdHJlYWRvbmx5PzogYm9vbGVhbjtcclxuXHRyZXF1aXJlZD86IGJvb2xlYW47XHJcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZztcclxuXHRtaW4/OiBudW1iZXI7XHJcblx0bWF4PzogbnVtYmVyO1xyXG5cdHN0ZXA/OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBGaWxlUHJvcHMgZXh0ZW5kcyBCYXNlUHJvcHMge1xyXG5cdHR5cGU6IFwiZmlsZVwiO1xyXG5cdGFjY2VwdDogc3RyaW5nIHwgc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGV4dElucHV0UHJvcHMgZXh0ZW5kcyBCYXNlUHJvcHMge1xyXG5cdHR5cGU6IFwidGV4dFwiIHwgXCJlbWFpbFwiIHwgXCJwYXNzd29yZFwiO1xyXG5cdHJlYWRvbmx5PzogYm9vbGVhbjtcclxuXHRyZXF1aXJlZD86IGJvb2xlYW47XHJcblx0cGF0dGVybj86IHN0cmluZztcclxuXHR2YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xyXG5cdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG5cdHNwZWxsY2hlY2s/OiBib29sZWFuO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHR5cGUgSW5wdXRQcm9wcyA9IENoZWNrYm94UHJvcHMgfCBSYWRpb1Byb3BzIHwgVGV4dElucHV0UHJvcHMgfCBSYW5nZVByb3BzIHwgRGF0ZVByb3BzIHwgTnVtYmVyUHJvcHMgfCBGaWxlUHJvcHM7XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQ8SW5wdXRQcm9wcz4ge1xyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogSW5wdXRQcm9wcyApIHtcclxuXHRcdHN1cGVyKCB7IHRhZzogXCJpbnB1dFwiLCAuLi5wcm9wcyB9ICk7XHJcblxyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCBwcm9wcy50eXBlID8/IFwidGV4dFwiICk7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIHByb3BzLm5hbWUgKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0c3dpdGNoKCBwcm9wcy50eXBlICkge1xyXG5cdFx0XHRjYXNlIFwiY2hlY2tib3hcIjpcclxuXHRcdFx0Y2FzZSBcInJhZGlvXCI6IHtcclxuXHRcdFx0XHRjb25zdCBjayA9IHRoaXMuZG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdFx0Y2suY2hlY2tlZCA9IHByb3BzLmNoZWNrZWQ7XHJcblx0XHRcdFx0Y2sudmFsdWUgPSBwcm9wcy52YWx1ZStcIlwiO1xyXG5cdFx0XHRcdC8vdGhpcy5zZXRBdHRyaWJ1dGUoIFwiY2hlY2tlZFwiLCBwcm9wcy5jaGVja2VkICk7XHJcblx0XHRcdFx0Ly90aGlzLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBwcm9wcy52YWx1ZSApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwicmFuZ2VcIjoge1xyXG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcIm1pblwiLCBwcm9wcy5taW4gKTtcclxuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJtYXhcIiwgcHJvcHMubWF4ICk7XHJcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwic3RlcFwiLCBwcm9wcy5zdGVwICk7XHJcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiwgcHJvcHMudmFsdWUgKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2FzZSBcIm51bWJlclwiOiB7XHJcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwicmVxdWlyZWRcIiwgcHJvcHMucmVxdWlyZWQgKTtcclxuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJyZWFkb25seVwiLCBwcm9wcy5yZWFkb25seSApO1xyXG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcIm1pblwiLCBwcm9wcy5taW4gKTtcclxuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJtYXhcIiwgcHJvcHMubWF4ICk7XHJcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwic3RlcFwiLCBwcm9wcy5zdGVwICk7XHJcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiwgcHJvcHMudmFsdWUrJycgKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2FzZSBcImRhdGVcIjoge1xyXG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInJlcXVpcmVkXCIsIHByb3BzLnJlcXVpcmVkICk7XHJcblxyXG5cdFx0XHRcdGxldCB2ID0gcHJvcHMudmFsdWU7XHJcblx0XHRcdFx0aWYoIHYgaW5zdGFuY2VvZiBEYXRlICkge1xyXG5cdFx0XHRcdFx0Ly90aGlzLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBmb3JtYXREYXRlKCB2LCBcIlktTS1EXCIgKSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIHYgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwiZmlsZVwiOiB7XHJcblx0XHRcdFx0bGV0IHY6IHN0cmluZztcclxuXHRcdFx0XHRpZiggQXJyYXkuaXNBcnJheShwcm9wcy5hY2NlcHQpICkge1xyXG5cdFx0XHRcdFx0diA9IHByb3BzLmFjY2VwdC5qb2luKFwiLFwiICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0diA9IHByb3BzLmFjY2VwdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcImFjY2VwdFwiLCB2ICk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJyZXF1aXJlZFwiLCBwcm9wcy5yZXF1aXJlZCApO1xyXG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInJlYWRvbmx5XCIsIHByb3BzLnJlYWRvbmx5ICk7XHJcblxyXG5cdFx0XHRcdGlmKCBwcm9wcy52YWx1ZSE9PW51bGwgJiYgcHJvcHMudmFsdWUhPT11bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBwcm9wcy52YWx1ZSApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoIHByb3BzLnBhdHRlcm4hPT1udWxsICYmIHByb3BzLnBhdHRlcm4hPT11bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJwYXR0ZXJuXCIsIHByb3BzLnBhdHRlcm4gKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKCBwcm9wcy5wbGFjZWhvbGRlciE9PW51bGwgJiYgcHJvcHMucGxhY2Vob2xkZXIhPT11bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJwbGFjZWhvbGRlclwiLCBwcm9wcy5wbGFjZWhvbGRlciApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoIHByb3BzLnNwZWxsY2hlY2s9PT1mYWxzZSApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInNwZWxsY2hlY2tcIiwgZmFsc2UgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAcmV0dXJucyBcclxuXHQgKi9cclxuXHJcblx0cHVibGljIGdldFZhbHVlKCApIHtcclxuXHRcdHJldHVybiAodGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqIEBwYXJhbSB2YWx1ZSBcclxuXHQgKi9cclxuXHRcclxuXHRwdWJsaWMgc2V0VmFsdWUoIHZhbHVlOiBzdHJpbmcgKSB7XHJcblx0XHQodGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSB2YWx1ZStcIlwiO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICogQHJldHVybnMgXHJcblx0ICovXHJcblx0XHJcblx0cHVibGljIGdldE51bVZhbHVlKCApIHtcclxuXHRcdHJldHVybiBwYXJzZUZsb2F0KCB0aGlzLmdldFZhbHVlKCkgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqIEBwYXJhbSB2YWx1ZSBcclxuXHQgKi9cclxuXHJcblx0cHVibGljIHNldE51bVZhbHVlKCB2YWx1ZTogbnVtYmVyICkge1xyXG5cdFx0dGhpcy5zZXRWYWx1ZSggdmFsdWUrXCJcIiApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHB1YmxpYyBzZXRSZWFkT25seSggcm86IGJvb2xlYW4gKSB7XHJcblx0XHRjb25zdCBkID0gdGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHRcdGQucmVhZE9ubHkgPSBybztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIHNlbGVjdCBhbGwgdGhlIHRleHRcclxuXHQgKi9cclxuXHJcblx0cHVibGljIHNlbGVjdEFsbCggKSB7XHJcblx0XHRjb25zdCBkID0gdGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBkLnNlbGVjdCgpOyBcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIHNlbGVjdCBhIHBhcnQgb2YgdGhlIHRleHRcclxuXHQgKiBAcGFyYW0gc3RhcnQgXHJcblx0ICogQHBhcmFtIGxlbmd0aCBcclxuXHQgKi9cclxuXHJcblx0cHVibGljIHNlbGVjdCggc3RhcnQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIgPSA5OTk5ICkgOiB2b2lkIHtcclxuXHRcdGNvbnN0IGQgPSB0aGlzLmRvbSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cdFx0ZC5zZXRTZWxlY3Rpb25SYW5nZSggc3RhcnQsIHN0YXJ0K2xlbmd0aCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogZ2V0IHRoZSBzZWxlY3Rpb24gYXMgeyBzdGFydCwgbGVuZ3RoIH1cclxuXHQgKi9cclxuXHJcblx0cHVibGljIGdldFNlbGVjdGlvbiggKSB7XHJcblx0XHRjb25zdCBkID0gdGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzdGFydDogZC5zZWxlY3Rpb25TdGFydCxcclxuXHRcdFx0bGVuZ3RoOiBkLnNlbGVjdGlvbkVuZCAtIGQuc2VsZWN0aW9uU3RhcnQsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdG92ZXJyaWRlIHF1ZXJ5SW50ZXJmYWNlPFQgZXh0ZW5kcyBJQ29tcG9uZW50SW50ZXJmYWNlPiggbmFtZTogc3RyaW5nICk6IFQge1xyXG5cdFx0aWYoIG5hbWU9PVwiZm9ybS1lbGVtZW50XCIgKSB7XHJcblx0XHRcdGNvbnN0IGk6IElGb3JtRWxlbWVudCA9IHtcclxuXHRcdFx0XHRnZXRSYXdWYWx1ZTogKCApOiBhbnkgPT4geyByZXR1cm4gdGhpcy5nZXRWYWx1ZSgpOyB9LFxyXG5cdFx0XHRcdHNldFJhd1ZhbHVlOiAoIHY6IGFueSApID0+IHsgdGhpcy5zZXRWYWx1ZSh2KTsgfVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly9AdHMtaWdub3JlXHJcblx0XHRcdHJldHVybiBpIGFzIFQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBzdXBlci5xdWVyeUludGVyZmFjZSggbmFtZSApO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIEV2Q2hhbmdlLCBtYWtlVW5pcXVlQ29tcG9uZW50SWQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudC5qcyc7XHJcbmltcG9ydCB7IEV2ZW50Q2FsbGJhY2sgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfZXZlbnRzLmpzJztcclxuXHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQnO1xyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsJztcclxuXHJcbmltcG9ydCB7IHN2Z0xvYWRlciB9IGZyb20gJy4uL2ljb24vaWNvbi5qcyc7XHJcblxyXG5pbXBvcnQgXCIuL2NoZWNrYm94Lm1vZHVsZS5zY3NzXCJcclxuaW1wb3J0IGljb24gZnJvbSBcIi4vY2hlY2suc3ZnXCI7XHJcblxyXG4vKipcclxuICogQ2hlY2tib3ggZXZlbnRzXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIENoZWNrQm94RXZlbnRzIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcclxuXHRjaGFuZ2U/OiBFdkNoYW5nZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrYm94IHByb3BlcnRpZXMuXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIENoZWNrYm94UHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0bGFiZWw6IHN0cmluZzsgXHRcdFx0Ly8gVGhlIHRleHQgbGFiZWwgZm9yIHRoZSBjaGVja2JveC5cclxuXHRjaGVja2VkPzogYm9vbGVhbjtcdFx0Ly8gT3B0aW9uYWwgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBjaGVja2JveCBpcyBjaGVja2VkIGJ5IGRlZmF1bHQuXHJcblx0dmFsdWU/OiBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nO1x0XHRcdC8vIE9wdGlvbmFsIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2hlY2tib3guXHJcblx0Y2hhbmdlPzogRXZlbnRDYWxsYmFjazxFdkNoYW5nZT47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja2JveCBjb21wb25lbnQgdGhhdCBjYW4gYmUgY2hlY2tlZCBvciB1bmNoZWNrZWQuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIENoZWNrYm94IGV4dGVuZHMgQ29tcG9uZW50PENoZWNrYm94UHJvcHMsQ2hlY2tCb3hFdmVudHM+IHtcclxuXHJcblx0cmVhZG9ubHkgX2lucHV0OiBJbnB1dDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBDaGVja2JveCBjb21wb25lbnQuXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7Q2hlY2tib3hQcm9wc30gcHJvcHMgLSBUaGUgcHJvcGVydGllcyBmb3IgdGhlIGNoZWNrYm94IGNvbXBvbmVudCwgaW5jbHVkaW5nIGxhYmVsLCBjaGVja2VkIHN0YXRlLCBhbmQgdmFsdWUuXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogY29uc3QgY2hlY2tib3ggPSBuZXcgQ2hlY2tib3goeyBsYWJlbDogJ0FjY2VwdCBUZXJtcycsIGNoZWNrZWQ6IHRydWUgfSk7XHJcbiAgICAgKi9cclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBDaGVja2JveFByb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0Y29uc3QgaW5wdXRJZCA9IG1ha2VVbmlxdWVDb21wb25lbnRJZCggKTtcclxuXHJcblx0XHR0aGlzLm1hcFByb3BFdmVudHMoIHByb3BzLCAnY2hhbmdlJyApO1xyXG5cclxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xyXG5cdFx0XHRuZXcgQ29tcG9uZW50KCB7XHJcblx0XHRcdFx0Y2xzOiAnaW5uZXInLFxyXG5cdFx0XHRcdGNvbnRlbnQ6IFtcclxuXHRcdFx0XHRcdHRoaXMuX2lucHV0ID0gbmV3IElucHV0KCB7IFxyXG5cdFx0XHRcdFx0XHR0eXBlOlwiY2hlY2tib3hcIiwgXHJcblx0XHRcdFx0XHRcdGlkOiBpbnB1dElkLCBcclxuXHRcdFx0XHRcdFx0Y2hlY2tlZDogcHJvcHMuY2hlY2tlZCxcclxuXHRcdFx0XHRcdFx0ZG9tX2V2ZW50czoge1xyXG5cdFx0XHRcdFx0XHRcdGNoYW5nZTogKCApID0+IHRoaXMuX29uX2NoYW5nZSggKSxcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRdIFxyXG5cdFx0XHR9KSxcclxuXHRcdFx0bmV3IExhYmVsKCB7IFxyXG5cdFx0XHRcdHRhZzogJ2xhYmVsJyxcclxuXHRcdFx0XHR0ZXh0OiBwcm9wcy5sYWJlbCwgXHJcblx0XHRcdFx0bGFiZWxGb3I6IGlucHV0SWQsIFxyXG5cdFx0XHRcdGlkOiB1bmRlZmluZWQgXHJcblx0XHRcdH0gKSxcclxuXHRcdF0pXHJcblxyXG5cdFx0c3ZnTG9hZGVyLmxvYWQoIGljb24gKS50aGVuKCBzdmcgPT4ge1xyXG5cdFx0XHR0aGlzLnF1ZXJ5PExhYmVsPiggJy5pbm5lcicgKS5kb20uaW5zZXJ0QWRqYWNlbnRIVE1MKCBcImJlZm9yZWVuZFwiLCBzdmcgKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogY2hlY2sgc3RhdGUgY2hhbmdlZFxyXG5cdCAqL1xyXG5cclxuXHRwcml2YXRlIF9vbl9jaGFuZ2UoKSB7XHJcblx0XHR0aGlzLmZpcmUoJ2NoYW5nZScsIHsgdmFsdWU6dGhpcy5nZXRDaGVjaygpIH0gKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm4gdGhlIGNoZWNrZWQgdmFsdWVcclxuXHQgKi9cclxuXHJcblx0cHVibGljIGdldENoZWNrKCkge1xyXG5cdFx0Y29uc3QgZCA9IHRoaXMuX2lucHV0LmRvbSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cdFx0cmV0dXJuIGQuY2hlY2tlZDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIGNoYW5nZSB0aGUgY2hlY2tlZCB2YWx1ZVxyXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gY2sgbmV3IGNoZWNrZWQgdmFsdWVcdFxyXG5cdCAqL1xyXG5cclxuXHRwdWJsaWMgc2V0Q2hlY2soY2s6IGJvb2xlYW4pIHtcclxuXHRcdGNvbnN0IGQgPSB0aGlzLl9pbnB1dC5kb20gYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHRcdGQuY2hlY2tlZCA9IGNrO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogY2hhbmdlIHRoZSBjaGVja2JveCBsYWJlbFxyXG5cdCAqIEBwYXJhbSB0ZXh0IFxyXG5cdCAqL1xyXG5cclxuXHRwdWJsaWMgc2V0TGFiZWwodGV4dDogc3RyaW5nKSB7XHJcblx0XHR0aGlzLnF1ZXJ5PExhYmVsPignbGFiZWwnKS5zZXRUZXh0KCB0ZXh0ICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiB0b2dnbGUgdGhlIGNoZWNrYm94XHJcblx0ICovXHJcblxyXG5cdHB1YmxpYyB0b2dnbGUoKSB7XHJcblx0XHR0aGlzLnNldENoZWNrKCAhdGhpcy5nZXRDaGVjaygpICk7XHJcblx0fVxyXG5cclxufSIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBjb2xvcmlucHV0LnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcclxuaW1wb3J0IHsgaXNGZWF0dXJlQXZhaWxhYmxlIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfY29sb3JzJztcclxuXHJcbmltcG9ydCB7IEJveFByb3BzLCBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJy4uL2lucHV0L2lucHV0LmpzJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vYnV0dG9uL2J1dHRvbi5qcyc7XHJcblxyXG5cclxuaW1wb3J0IFwiLi9jb2xvcmlucHV0Lm1vZHVsZS5zY3NzXCJcclxuaW1wb3J0IGljb24gZnJvbSBcIi4vY3Jvc3NoYWlycy1zaW1wbGUtc2hhcnAtbGlnaHQuc3ZnXCJcclxuXHJcbi8vVE9ETzogYWRkIHN3YXRjaGVzXHJcbi8vVE9ETzogYmV0dGVyIGtleWJvYXJkIGhhbmRsaW5nIChzZWxlY3Rpb24gYWZ0ZXIgY3Vyc29yKVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmludGVyZmFjZSBDb2xvcklucHV0UHJvcHMgZXh0ZW5kcyBCb3hQcm9wcyB7XHJcblx0Y29sb3I6IENvbG9yIHwgc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9ySW5wdXQgZXh0ZW5kcyBIQm94PENvbG9ySW5wdXRQcm9wcz4ge1xyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogQ29sb3JJbnB1dFByb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0bGV0IHN3YXRjaDogQ29tcG9uZW50O1xyXG5cdFx0bGV0IGVkaXQ6IElucHV0O1xyXG5cclxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xyXG5cdFx0XHRzd2F0Y2ggPSBuZXcgQ29tcG9uZW50KCB7IGNsczogXCJzd2F0Y2hcIiB9ICksXHJcblx0XHRcdGVkaXQgPSBuZXcgSW5wdXQoIHsgdHlwZTogXCJ0ZXh0XCIsIHZhbHVlOiBcIlwiLCBzcGVsbGNoZWNrOiBmYWxzZSB9ICksXHJcblxyXG5cdFx0XHRpc0ZlYXR1cmVBdmFpbGFibGUoXCJleWVkcm9wcGVyXCIpID8gbmV3IEJ1dHRvbiggeyBpY29uOiBpY29uLCBjbGljazogKCApID0+IHtcclxuXHRcdFx0XHRjb25zdCBleWVEcm9wcGVyID0gbmV3ICh3aW5kb3cgYXMgYW55KS5FeWVEcm9wcGVyKCk7XHJcblx0XHRcdFx0ZXllRHJvcHBlci5vcGVuKCApLnRoZW4oICggcmVzdWx0OiBhbnkgKSA9PiB7XHJcblx0XHRcdFx0XHRjb2xvciA9IG5ldyBDb2xvciggcmVzdWx0LnNSR0JIZXggKTtcclxuXHRcdFx0XHRcdHVwZGF0ZUNvbG9yKCBjb2xvciApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IH0gKSA6IG51bGxcclxuXHRcdF0pXHJcblxyXG5cdFx0ZWRpdC5hZGRET01FdmVudCggXCJpbnB1dFwiLCAoICkgPT4ge1xyXG5cdFx0XHRjb25zdCB0eHQgPSBlZGl0LmdldFZhbHVlKCApO1xyXG5cdFx0XHRjb25zdCBjbHIgPSBuZXcgQ29sb3IoIHR4dCApO1xyXG5cdFx0XHRpZiggIWNsci5pc0ludmFsaWQoKSApIHtcclxuXHRcdFx0XHRjb2xvciA9IGNscjtcclxuXHRcdFx0XHR1cGRhdGVDb2xvciggY29sb3IgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y29uc3QgdXBkYXRlQ29sb3IgPSAoIGNscjogQ29sb3IgKSA9PiB7XHJcblx0XHRcdHN3YXRjaC5zZXRTdHlsZVZhbHVlKCBcImJhY2tncm91bmRDb2xvclwiLCBjbHIudG9SZ2JTdHJpbmcoZmFsc2UpICk7XHJcblx0XHRcdGVkaXQuc2V0VmFsdWUoIGNsci50b1JnYlN0cmluZyhmYWxzZSkgKTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY29sb3I6IENvbG9yO1xyXG5cdFx0aWYoIHByb3BzLmNvbG9yIGluc3RhbmNlb2YgQ29sb3IgKSB7XHJcblx0XHRcdGNvbG9yID0gcHJvcHMuY29sb3I7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoIHByb3BzLmNvbG9yICk7XHJcblx0XHR9XHJcblxyXG5cdFx0dXBkYXRlQ29sb3IoIGNvbG9yICk7XHJcblx0fVxyXG59IiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIGNvbG9ycGlja2VyLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbG9yLCBIc3YgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfY29sb3JzJztcclxuaW1wb3J0IHsgUmVjdCwgY2xhbXAsIGlzRmVhdHVyZUF2YWlsYWJsZSB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scyc7XHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCb3gsIEJveFByb3BzLCBIQm94LCBWQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xyXG5cclxuaW1wb3J0IFwiLi9jb2xvcnBpY2tlci5tb2R1bGUuc2Nzc1wiXHJcblxyXG5pbnRlcmZhY2UgQ29sb3JQaWNrZXJQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcclxuXHRjb2xvcjogc3RyaW5nIHwgQ29sb3I7XHJcbn1cclxuXHJcbmludGVyZmFjZSBIdWVDaGFuZ2VFdmVudCBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcclxuXHRodWU6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEFscGhhQ2hhbmdlRXZlbnQgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XHJcblx0YWxwaGE6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNhdENoYW5nZUV2ZW50IGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xyXG5cdHNhdHVyYXRpb246IG51bWJlcjtcclxuXHR2YWx1ZTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29tbW9uRXZlbnRzIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcclxuXHRodWVfY2hhbmdlOiBIdWVDaGFuZ2VFdmVudDtcdFxyXG5cdGFscGhhX2NoYW5nZTogQWxwaGFDaGFuZ2VFdmVudDtcclxuXHRzYXRfY2hhbmdlOiBTYXRDaGFuZ2VFdmVudDtcdFxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhdHVyYXRpb24gZXh0ZW5kcyBCb3g8Qm94UHJvcHMsQ29tbW9uRXZlbnRzPiB7XHJcblxyXG5cdHByaXZhdGUgbWRvd24gPSBmYWxzZTtcclxuXHRwcml2YXRlIGlyZWN0OiBSZWN0O1xyXG5cdFxyXG5cdHByaXZhdGUgaHN2OiBIc3YgPSB7IGh1ZTogMSwgc2F0dXJhdGlvbjogMSwgdmFsdWU6IDEsIGFscGhhOiAxIH07XHJcblxyXG5cdHByaXZhdGUgY29sb3I6IENvbXBvbmVudDtcclxuXHRwcml2YXRlIHRodW1iOiBDb21wb25lbnQ7XHJcblx0XHRcclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEJveFByb3BzLCBpbml0OiBIc3YgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0dGhpcy5jb2xvciA9IG5ldyBDb21wb25lbnQoIHsgY2xzOiBcIm92ZXJsYXlcIiB9ICksXHJcblx0XHRcdG5ldyBDb21wb25lbnQoIHsgY2xzOiBcIm92ZXJsYXlcIiwgc3R5bGU6IHsgYmFja2dyb3VuZEltYWdlOiBcImxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiKDI1NSwgMjU1LCAyNTUpLCB0cmFuc3BhcmVudClcIiB9IH0gKSxcclxuXHRcdFx0bmV3IENvbXBvbmVudCggeyBjbHM6IFwib3ZlcmxheVwiLCBzdHlsZTogeyBiYWNrZ3JvdW5kSW1hZ2U6IFwibGluZWFyLWdyYWRpZW50KDBkZWcsIHJnYigwLCAwLCAwKSwgdHJhbnNwYXJlbnQpXCIgfSB9ICksXHJcblx0XHRcdHRoaXMudGh1bWIgPSBuZXcgQ29tcG9uZW50KCB7IGNsczogXCJ0aHVtYlwiIH0gKSxcclxuXHRcdF0pO1xyXG5cclxuXHRcdHRoaXMuc2V0RE9NRXZlbnRzKCB7XHJcblx0XHRcdHBvaW50ZXJkb3duOiAoIGUgKSA9PiB0aGlzLm1vdXNlZG93biggZSApLFxyXG5cdFx0XHRwb2ludGVybW92ZTogKCBlICkgPT4gdGhpcy5tb3VzZW1vdmUoIGUgKSxcclxuXHRcdFx0cG9pbnRlcnVwOiAoIGUgKSA9PiB0aGlzLm1vdXNldXAoIGUgKSxcclxuXHRcdFx0Y3JlYXRlZDogKCkgPT4gdGhpcy51cGRhdGVUaHVtYk1hcmtlciggKSxcclxuXHRcdH0gKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZUJhc2VDb2xvciggaW5pdCApO1xyXG5cdH1cclxuXHJcblx0bW91c2Vkb3duKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cdFx0dGhpcy5tZG93biA9IHRydWU7XHJcblx0XHR0aGlzLmlyZWN0ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QoICk7XHJcblx0XHR0aGlzLnNldENhcHR1cmUoIGV2LnBvaW50ZXJJZCApO1xyXG5cdH1cclxuXHJcblx0bW91c2Vtb3ZlKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cclxuXHRcdGlmKCB0aGlzLm1kb3duICkge1xyXG5cdFx0XHRjb25zdCBpciA9IHRoaXMuaXJlY3Q7XHJcblxyXG5cdFx0XHRsZXQgaHBvcyA9IGNsYW1wKGV2LmNsaWVudFggLSBpci5sZWZ0LCAwLCBpci53aWR0aCApO1xyXG5cdFx0XHRsZXQgaHBlcmMgPSBocG9zIC8gaXIud2lkdGg7XHJcblxyXG5cdFx0XHRsZXQgdnBvcyA9IGNsYW1wKGV2LmNsaWVudFkgLSBpci50b3AsIDAsIGlyLmhlaWdodCApO1xyXG5cdFx0XHRsZXQgdnBlcmMgPSB2cG9zIC8gaXIuaGVpZ2h0O1xyXG5cclxuXHRcdFx0dGhpcy5oc3Yuc2F0dXJhdGlvbiA9IGhwZXJjO1xyXG5cdFx0XHR0aGlzLmhzdi52YWx1ZSA9IDEtdnBlcmM7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnVwZGF0ZVRodW1iTWFya2VyKCApO1xyXG5cdFx0XHR0aGlzLmZpcmUoIFwic2F0X2NoYW5nZVwiLCB7IHNhdHVyYXRpb246IHRoaXMuaHN2LnNhdHVyYXRpb24sIHZhbHVlOiB0aGlzLmhzdi52YWx1ZSB9ICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3VzZXVwKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cdFx0aWYoIHRoaXMubWRvd24gKSB7XHJcblx0XHRcdHRoaXMucmVsZWFzZUNhcHR1cmUoIGV2LnBvaW50ZXJJZCApO1xyXG5cdFx0XHR0aGlzLm1kb3duID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR1cGRhdGVUaHVtYk1hcmtlciggKSB7XHJcblx0XHRjb25zdCByYyA9IHRoaXMuY29sb3IuZ2V0Qm91bmRpbmdSZWN0KCApO1xyXG5cdFx0XHJcblx0XHR0aGlzLnRodW1iLnNldFN0eWxlKCB7IFxyXG5cdFx0XHRsZWZ0OiAodGhpcy5oc3Yuc2F0dXJhdGlvbiAqIHJjLndpZHRoICkgKyAncHgnLFxyXG5cdFx0XHRib3R0b206ICggdGhpcy5oc3YudmFsdWUgKiByYy5oZWlnaHQgKSArICdweCdcclxuXHRcdH0gKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZUJhc2VDb2xvciggaHN2OiBIc3YgKSB7XHJcblx0XHRjb25zdCBiYXNlID0gbmV3IENvbG9yKDAsMCwwKVxyXG5cdFx0YmFzZS5zZXRIc3YoIGhzdi5odWUsIDEsIDEsIDEgKTtcclxuXHRcdHRoaXMuY29sb3Iuc2V0U3R5bGVWYWx1ZSggXCJiYWNrZ3JvdW5kQ29sb3JcIiwgYmFzZS50b1JnYlN0cmluZyhmYWxzZSkgKTtcclxuXHR9XHJcblxyXG5cdG1vdmUoIHNlbnM6IHN0cmluZywgZGVsdGE6IG51bWJlciApIHtcclxuXHRcdHN3aXRjaCggc2VucyApIHtcclxuXHRcdFx0Y2FzZSAnc2F0dXJhdGlvbic6IHtcclxuXHRcdFx0XHR0aGlzLmhzdi5zYXR1cmF0aW9uICs9IGRlbHRhO1xyXG5cdFx0XHRcdGlmKCB0aGlzLmhzdi5zYXR1cmF0aW9uPDAgKSB7XHJcblx0XHRcdFx0XHR0aGlzLmhzdi5zYXR1cmF0aW9uID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiggdGhpcy5oc3Yuc2F0dXJhdGlvbj4xICkge1xyXG5cdFx0XHRcdFx0dGhpcy5oc3Yuc2F0dXJhdGlvbiA9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMuZmlyZSggXCJzYXRfY2hhbmdlXCIsIHsgc2F0dXJhdGlvbjogdGhpcy5oc3Yuc2F0dXJhdGlvbiwgdmFsdWU6IHRoaXMuaHN2LnZhbHVlIH0gKTtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVRodW1iTWFya2VyKCApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlICd2YWx1ZSc6IHtcclxuXHRcdFx0XHR0aGlzLmhzdi52YWx1ZSArPSBkZWx0YTtcclxuXHRcdFx0XHRpZiggdGhpcy5oc3YudmFsdWU8MCApIHtcclxuXHRcdFx0XHRcdHRoaXMuaHN2LnZhbHVlID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiggdGhpcy5oc3YudmFsdWU+MSApIHtcclxuXHRcdFx0XHRcdHRoaXMuaHN2LnZhbHVlID0gMTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuZmlyZSggXCJzYXRfY2hhbmdlXCIsIHsgc2F0dXJhdGlvbjogdGhpcy5oc3Yuc2F0dXJhdGlvbiwgdmFsdWU6IHRoaXMuaHN2LnZhbHVlIH0gKTtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVRodW1iTWFya2VyKCApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5jbGFzcyBIdWVTbGlkZXIgZXh0ZW5kcyBCb3g8Qm94UHJvcHMsQ29tbW9uRXZlbnRzPiB7XHJcblxyXG5cdHByaXZhdGUgdGh1bWI6IENvbXBvbmVudDtcclxuXHRwcml2YXRlIGhzdjogSHN2ID0geyBodWU6IDEsIHNhdHVyYXRpb246IDEsIHZhbHVlOiAxLCBhbHBoYTogMSB9O1xyXG5cclxuXHRwcml2YXRlIG1kb3duID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBpcmVjdDogUmVjdDtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBCb3hQcm9wcywgaW5pdDogSHN2ICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXHJcblx0XHRcdHRoaXMudGh1bWIgPSBuZXcgQ29tcG9uZW50KCB7IGNsczogXCJ0aHVtYlwiLCBsZWZ0OiBcIjUwJVwiIH0gKSxcclxuXHRcdF0pO1xyXG5cclxuXHRcdHRoaXMuc2V0RE9NRXZlbnRzKCB7XHJcblx0XHRcdHBvaW50ZXJkb3duOiAoIGUgKSA9PiB0aGlzLm1vdXNlZG93biggZSApLFxyXG5cdFx0XHRwb2ludGVybW92ZTogKCBlICkgPT4gdGhpcy5tb3VzZW1vdmUoIGUgKSxcclxuXHRcdFx0cG9pbnRlcnVwOiAoIGUgKSA9PiB0aGlzLm1vdXNldXAoIGUgKSxcclxuXHRcdH0gKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZUh1ZSggaW5pdCApO1xyXG5cdH1cclxuXHJcblx0bW91c2Vkb3duKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cdFx0dGhpcy5tZG93biA9IHRydWU7XHJcblx0XHR0aGlzLmlyZWN0ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QoICk7XHJcblx0XHR0aGlzLnNldENhcHR1cmUoIGV2LnBvaW50ZXJJZCApO1xyXG5cdH1cclxuXHJcblx0bW91c2Vtb3ZlKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cclxuXHRcdGlmKCB0aGlzLm1kb3duICkge1xyXG5cdFx0XHRjb25zdCBpciA9IHRoaXMuaXJlY3Q7XHJcblxyXG5cdFx0XHRsZXQgaHBvcyA9IGNsYW1wKGV2LmNsaWVudFggLSBpci5sZWZ0LCAwLCBpci53aWR0aCApO1xyXG5cdFx0XHRsZXQgaHBlcmMgPSBocG9zIC8gaXIud2lkdGg7XHJcblxyXG5cdFx0XHR0aGlzLmhzdi5odWUgPSBocGVyYztcclxuXHJcblx0XHRcdHRoaXMudXBkYXRlSHVlKCB0aGlzLmhzdiApO1xyXG5cdFx0XHR0aGlzLmZpcmUoIFwiaHVlX2NoYW5nZVwiLCB7IGh1ZTogdGhpcy5oc3YuaHVlIH0gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNldXAoIGV2OiBQb2ludGVyRXZlbnQgKSB7XHJcblx0XHRpZiggdGhpcy5tZG93biApIHtcclxuXHRcdFx0dGhpcy5yZWxlYXNlQ2FwdHVyZSggZXYucG9pbnRlcklkICk7XHJcblx0XHRcdHRoaXMubWRvd24gPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZUh1ZSggaHN2OiBIc3YgKSB7XHJcblx0XHR0aGlzLmhzdi5odWUgPSBoc3YuaHVlO1xyXG5cdFx0dGhpcy50aHVtYi5zZXRTdHlsZVZhbHVlKCBcImxlZnRcIiwgKGhzdi5odWUqMTAwKSsnJScgKTtcclxuXHR9XHJcblxyXG5cdG1vdmUoIGRlbHRhOiBudW1iZXIgKSB7XHJcblx0XHR0aGlzLmhzdi5odWUgKz0gZGVsdGE7XHJcblx0XHRpZiggdGhpcy5oc3YuaHVlPDAgKSB7XHJcblx0XHRcdHRoaXMuaHN2Lmh1ZSA9IDA7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCB0aGlzLmhzdi5odWU+MSApIHtcclxuXHRcdFx0dGhpcy5oc3YuaHVlID0gMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoIFwiaHVlX2NoYW5nZVwiLCB7IGh1ZTogdGhpcy5oc3YuaHVlIH0gKTtcclxuXHRcdHRoaXMudXBkYXRlSHVlKCB0aGlzLmhzdiApO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5jbGFzcyBBbHBoYVNsaWRlciBleHRlbmRzIEJveDxCb3hQcm9wcyxDb21tb25FdmVudHM+IHtcclxuXHRcclxuXHRwcml2YXRlIHRodW1iOiBDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBjb2xvcjogQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgaHN2OiBIc3YgPSB7IGh1ZTogMSwgc2F0dXJhdGlvbjogMSwgdmFsdWU6IDEsIGFscGhhOiAxIH07XHJcblxyXG5cdHByaXZhdGUgbWRvd24gPSBmYWxzZTtcclxuXHRwcml2YXRlIGlyZWN0OiBSZWN0O1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogQm94UHJvcHMsIGluaXQ6IEhzdiApIHtcclxuXHRcdHN1cGVyKCBwcm9wcyApO1xyXG5cclxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xyXG5cdFx0XHRuZXcgQ29tcG9uZW50KCB7IGNsczogXCJvdmVybGF5IGNoZWNrZXJzXCJ9ICksXHJcblx0XHRcdHRoaXMuY29sb3IgPSBuZXcgQ29tcG9uZW50KCB7IGNsczogXCJvdmVybGF5IGNvbG9yXCJ9ICksXHJcblx0XHRcdHRoaXMudGh1bWIgPSBuZXcgQ29tcG9uZW50KCB7IGNsczogXCJ0aHVtYlwiLCBsZWZ0OiBcIjUwJVwiIH0gKSxcclxuXHRcdF0pO1xyXG5cclxuXHRcdHRoaXMuc2V0RE9NRXZlbnRzKCB7XHJcblx0XHRcdHBvaW50ZXJkb3duOiAoIGUgKSA9PiB0aGlzLl9vbl9tb3VzZWRvd24oIGUgKSxcclxuXHRcdFx0cG9pbnRlcm1vdmU6ICggZSApID0+IHRoaXMuX29uX21vdXNlbW92ZSggZSApLFxyXG5cdFx0XHRwb2ludGVydXA6ICggZSApID0+IHRoaXMuX29uX21vdXNldXAoIGUgKSxcclxuXHRcdH0gKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZUFscGhhKCApO1xyXG5cdFx0dGhpcy51cGRhdGVCYXNlQ29sb3IoIGluaXQgKTtcclxuXHR9XHJcblxyXG5cdF9vbl9tb3VzZWRvd24oIGV2OiBQb2ludGVyRXZlbnQgKSB7XHJcblx0XHR0aGlzLm1kb3duID0gdHJ1ZTtcclxuXHRcdHRoaXMuaXJlY3QgPSB0aGlzLmdldEJvdW5kaW5nUmVjdCggKTtcclxuXHRcdHRoaXMuc2V0Q2FwdHVyZSggZXYucG9pbnRlcklkICk7XHJcblx0fVxyXG5cclxuXHRfb25fbW91c2Vtb3ZlKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cclxuXHRcdGlmKCB0aGlzLm1kb3duICkge1xyXG5cdFx0XHRjb25zdCBpciA9IHRoaXMuaXJlY3Q7XHJcblxyXG5cdFx0XHRsZXQgaHBvcyA9IGNsYW1wKGV2LmNsaWVudFggLSBpci5sZWZ0LCAwLCBpci53aWR0aCApO1xyXG5cdFx0XHRsZXQgaHBlcmMgPSBocG9zIC8gaXIud2lkdGg7XHJcblxyXG5cdFx0XHR0aGlzLmhzdi5hbHBoYSA9IGhwZXJjO1xyXG5cclxuXHRcdFx0dGhpcy51cGRhdGVBbHBoYSggKTtcclxuXHRcdFx0dGhpcy5maXJlKCBcImFscGhhX2NoYW5nZVwiLCB7IGFscGhhOiB0aGlzLmhzdi5hbHBoYSB9ICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfb25fbW91c2V1cCggZXY6IFBvaW50ZXJFdmVudCApIHtcclxuXHRcdGlmKCB0aGlzLm1kb3duICkge1xyXG5cdFx0XHR0aGlzLnJlbGVhc2VDYXB0dXJlKCBldi5wb2ludGVySWQgKTtcclxuXHRcdFx0dGhpcy5tZG93biA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dXBkYXRlQWxwaGEoICkge1xyXG5cdFx0dGhpcy50aHVtYi5zZXRTdHlsZVZhbHVlKCBcImxlZnRcIiwgKHRoaXMuaHN2LmFscGhhKjEwMCkrJyUnICk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVCYXNlQ29sb3IoIGhzdjogSHN2ICkge1xyXG5cdFx0Y29uc3QgYmFzZSA9IG5ldyBDb2xvcigwLDAsMClcclxuXHRcdGJhc2Uuc2V0SHN2KCBoc3YuaHVlLCBoc3Yuc2F0dXJhdGlvbiwgaHN2LnZhbHVlLCAxICk7XHJcblx0XHR0aGlzLmNvbG9yLnNldFN0eWxlVmFsdWUoIFwiYmFja2dyb3VuZEltYWdlXCIsIGBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50LCAke2Jhc2UudG9SZ2JTdHJpbmcoZmFsc2UpfSlgICk7XHRcdFxyXG5cdH1cclxuXHJcblx0c2V0Q29sb3IoIGhzdjogSHN2ICkge1xyXG5cdFx0dGhpcy5oc3YgPSBoc3Y7XHJcblx0XHR0aGlzLnVwZGF0ZUJhc2VDb2xvciggaHN2ICk7XHJcblx0XHR0aGlzLnVwZGF0ZUFscGhhKCApO1xyXG5cdH1cclxuXHJcblx0bW92ZSggZGVsdGE6IG51bWJlciApIHtcclxuXHRcdHRoaXMuaHN2LmFscGhhICs9IGRlbHRhO1xyXG5cdFx0aWYoIHRoaXMuaHN2LmFscGhhPDAgKSB7XHJcblx0XHRcdHRoaXMuaHN2LmFscGhhID0gMDtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIHRoaXMuaHN2LmFscGhhPjEgKSB7XHJcblx0XHRcdHRoaXMuaHN2LmFscGhhID0gMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoIFwiYWxwaGFfY2hhbmdlXCIsIHsgYWxwaGE6IHRoaXMuaHN2LmFscGhhIH0gKTtcclxuXHRcdHRoaXMudXBkYXRlQWxwaGEoICk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmludGVyZmFjZSBDaGFuZ2VFdmVudCBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcclxuXHRjb2xvcjogQ29sb3I7XHJcbn1cclxuXHJcbmludGVyZmFjZSBDb2xvclBpY2tlckNoYW5nZUV2ZW50cyBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XHJcblx0Y2hhbmdlOiBDaGFuZ2VFdmVudFxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29sb3JQaWNrZXIgZXh0ZW5kcyBWQm94PENvbG9yUGlja2VyUHJvcHMsQ29sb3JQaWNrZXJDaGFuZ2VFdmVudHM+IHtcclxuXHJcblx0cHJpdmF0ZSBfYmFzZTogQ29sb3I7XHJcblx0cHJpdmF0ZSBfc2F0OiBTYXR1cmF0aW9uO1xyXG5cdHByaXZhdGUgX3N3YXRjaDogQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX2h1ZTogSHVlU2xpZGVyO1xyXG5cdHByaXZhdGUgX2FscGhhOiBBbHBoYVNsaWRlcjtcclxuXHJcblxyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogQ29sb3JQaWNrZXJQcm9wcyApIHtcclxuXHRcdHN1cGVyKCBwcm9wcyApO1xyXG5cdFxyXG5cdFx0aWYoIHByb3BzLmNvbG9yIGluc3RhbmNlb2YgQ29sb3IgKSB7XHJcblx0XHRcdHRoaXMuX2Jhc2UgPSBwcm9wcy5jb2xvcjtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9iYXNlID0gbmV3IENvbG9yKCBwcm9wcy5jb2xvciApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBoc3YgPSB0aGlzLl9iYXNlLnRvSHN2KCApO1xyXG5cclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInRhYmluZGV4XCIsIDAgKTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0dGhpcy5fc2F0ID0gbmV3IFNhdHVyYXRpb24oIHsgfSwgaHN2ICksXHJcblx0XHRcdG5ldyBIQm94KCB7XHJcblx0XHRcdFx0Y2xzOiBcImJvZHlcIixcclxuXHRcdFx0XHRjb250ZW50OiBbXHJcblx0XHRcdFx0XHRuZXcgVkJveCgge2NsczogXCJ4NGZsZXhcIiwgY29udGVudDogW1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9odWUgPSBuZXcgSHVlU2xpZGVyKCB7IH0sIGhzdiApLFxyXG5cdFx0XHRcdFx0XHR0aGlzLl9hbHBoYSA9IG5ldyBBbHBoYVNsaWRlciggeyB9LCBoc3YgKSxcclxuXHRcdFx0XHRcdF0gfSApLFxyXG5cdFx0XHRcdFx0bmV3IEJveCggeyBjbHM6IFwic3dhdGNoXCIsIGNvbnRlbnQ6IFtcclxuXHRcdFx0XHRcdFx0bmV3IENvbXBvbmVudCggeyBjbHM6IFwib3ZlcmxheSBjaGVja2Vyc1wiIH0gKSxcclxuXHRcdFx0XHRcdFx0dGhpcy5fc3dhdGNoID0gbmV3IENvbXBvbmVudCggeyBjbHM6IFwib3ZlcmxheVwiIH0gKSxcclxuXHRcdFx0XHRcdF0gfSApXHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9KVxyXG5cdFx0XSk7XHJcblxyXG5cdFx0dGhpcy5fc2F0Lm9uKCBcInNhdF9jaGFuZ2VcIiwgKCBldiApID0+IHtcclxuXHRcdFx0aHN2LnNhdHVyYXRpb24gPSBldi5zYXR1cmF0aW9uO1xyXG5cdFx0XHRoc3YudmFsdWUgPSBldi52YWx1ZTtcclxuXHRcdFx0dXBkYXRlQ29sb3IoICk7XHJcblx0XHRcdHRoaXMuX2FscGhhLnVwZGF0ZUJhc2VDb2xvciggaHN2ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0dGhpcy5faHVlLm9uKCAnaHVlX2NoYW5nZScsICggZXYgKSA9PiB7XHJcblx0XHRcdGhzdi5odWUgPSBldi5odWU7XHJcblx0XHRcdHRoaXMuX3NhdC51cGRhdGVCYXNlQ29sb3IoIGhzdiApO1xyXG5cdFx0XHR0aGlzLl9hbHBoYS51cGRhdGVCYXNlQ29sb3IoIGhzdiApO1xyXG5cdFx0XHR1cGRhdGVDb2xvciggKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHR0aGlzLl9hbHBoYS5vbiggJ2FscGhhX2NoYW5nZScsICggZXYgKSA9PiB7XHJcblx0XHRcdGhzdi5hbHBoYSA9IGV2LmFscGhhO1xyXG5cdFx0XHR1cGRhdGVDb2xvciggKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRjb25zdCB1cGRhdGVDb2xvciA9ICggKSA9PiB7XHJcblx0XHRcdHRoaXMuX2Jhc2Uuc2V0SHN2KCBoc3YuaHVlLCBoc3Yuc2F0dXJhdGlvbiwgaHN2LnZhbHVlLCBoc3YuYWxwaGEgKTtcclxuXHRcdFx0dGhpcy5fc3dhdGNoLnNldFN0eWxlVmFsdWUoIFwiYmFja2dyb3VuZENvbG9yXCIsIHRoaXMuX2Jhc2UudG9SZ2JTdHJpbmcoKSApO1xyXG5cdFx0XHR0aGlzLl9zd2F0Y2guc2V0QXR0cmlidXRlKCBcInRvb2x0aXBcIiwgdGhpcy5fYmFzZS50b1JnYlN0cmluZygpICk7XHJcblxyXG5cdFx0XHR0aGlzLmZpcmUoIFwiY2hhbmdlXCIsIHsgY29sb3I6IHRoaXMuX2Jhc2UgfSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCBpc0ZlYXR1cmVBdmFpbGFibGUoXCJleWVkcm9wcGVyXCIpICkge1xyXG5cdFx0XHR0aGlzLl9zd2F0Y2guYWRkRE9NRXZlbnQoIFwiY2xpY2tcIiwgKCBlICkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGV5ZURyb3BwZXIgPSBuZXcgKHdpbmRvdyBhcyBhbnkpLkV5ZURyb3BwZXIoKTtcclxuXHRcdFx0XHRleWVEcm9wcGVyLm9wZW4oICkudGhlbiggKCByZXN1bHQ6IGFueSApID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKCByZXN1bHQuc1JHQkhleCApO1xyXG5cdFx0XHRcdFx0aHN2ID0gY29sb3IudG9Ic3YoICk7XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5fYWxwaGEuc2V0Q29sb3IoIGhzdiApO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR0aGlzLl9zYXQudXBkYXRlQmFzZUNvbG9yKCBoc3YgKTtcclxuXHRcdFx0XHRcdHRoaXMuX2h1ZS51cGRhdGVIdWUoIGhzdiApO1xyXG5cdFx0XHRcdFx0dXBkYXRlQ29sb3IoICk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5hZGRET01FdmVudCggXCJrZXlkb3duXCIsICggZXYgKSA9PiB0aGlzLl9vbmtleSggZXYgKSApO1xyXG5cclxuXHRcdHVwZGF0ZUNvbG9yKCApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25rZXkoIGV2OiBLZXlib2FyZEV2ZW50ICkge1xyXG5cdFx0c3dpdGNoKCBldi5rZXkgKSB7XHJcblx0XHRcdGNhc2UgXCJBcnJvd0xlZnRcIjoge1xyXG5cdFx0XHRcdGlmKCBldi5jdHJsS2V5ICkge1xyXG5cdFx0XHRcdFx0dGhpcy5faHVlLm1vdmUoIC0wLjAxICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5fc2F0Lm1vdmUoIFwic2F0dXJhdGlvblwiLCAtMC4wMSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2FzZSBcIkFycm93UmlnaHRcIjoge1xyXG5cdFx0XHRcdGlmKCBldi5jdHJsS2V5ICkge1xyXG5cdFx0XHRcdFx0dGhpcy5faHVlLm1vdmUoIDAuMDEgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLl9zYXQubW92ZSggXCJzYXR1cmF0aW9uXCIsIDAuMDEgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNhc2UgXCJBcnJvd1VwXCI6IHtcclxuXHRcdFx0XHRpZiggZXYuY3RybEtleSApIHtcclxuXHRcdFx0XHRcdHRoaXMuX2FscGhhLm1vdmUoIDAuMDEgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLl9zYXQubW92ZSggXCJ2YWx1ZVwiLCAwLjAxICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwiQXJyb3dEb3duXCI6IHtcclxuXHRcdFx0XHRpZiggZXYuY3RybEtleSApIHtcclxuXHRcdFx0XHRcdHRoaXMuX2FscGhhLm1vdmUoIC0wLjAxICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5fc2F0Lm1vdmUoIFwidmFsdWVcIiwgLTAuMDEgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgdmlld3BvcnQudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gXCIuLi8uLi9jb3JlL2NvbXBvbmVudFwiXHJcblxyXG5pbXBvcnQgXCIuL3ZpZXdwb3J0Lm1vZHVsZS5zY3NzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWV3cG9ydCBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBDb21wb25lbnRQcm9wcyApIHtcclxuXHRcdHN1cGVyKCBwcm9wcyApO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjcm9sbFZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogQ29tcG9uZW50UHJvcHMgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHRcdHRoaXMuc2V0Q29udGVudCggbmV3IFZpZXdwb3J0KCB7fSApICk7XHJcblx0fVxyXG5cclxuXHRnZXRWaWV3cG9ydCggKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5maXJzdENoaWxkPFZpZXdwb3J0PiggKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgbGlzdGJveC50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50LCBDb21wb25lbnRFdmVudHMsIGNvbXBvbmVudEZyb21ET00sIENvbXBvbmVudFByb3BzLCBFdkNoYW5nZSwgRXZDbGljaywgRXZDb250ZXh0TWVudSwgRXZEYmxDbGljaywgRXZTZWxlY3Rpb25DaGFuZ2UgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XHJcblxyXG5pbXBvcnQgeyBTY3JvbGxWaWV3LCBWaWV3cG9ydCB9IGZyb20gJy4uL3ZpZXdwb3J0L3ZpZXdwb3J0JztcclxuaW1wb3J0IHsgSEJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzLmpzJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbC9sYWJlbC5qcyc7XHJcblxyXG5pbXBvcnQgXCIuL2xpc3Rib3gubW9kdWxlLnNjc3NcIlxyXG5cclxuZXhwb3J0IGVudW0ga2JOYXYge1xyXG5cdGZpcnN0LFxyXG5cdHByZXYsXHJcblx0bmV4dCxcclxuXHRsYXN0LFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBMaXN0Ym94SUQgPSBudW1iZXIgfCBzdHJpbmc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExpc3RJdGVtIHtcclxuXHRpZDogTGlzdGJveElEO1xyXG5cdHRleHQ6IHN0cmluZztcclxuXHJcblx0aWNvbklkPzogc3RyaW5nO1xyXG5cdGRhdGE/OiBhbnk7XHJcblx0Y2xzPzogc3RyaW5nO1xyXG5cdGNoZWNrZWQ/OiBib29sZWFuO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuXHJcbmludGVyZmFjZSBMaXN0Ym94RXZlbnRzIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcclxuXHQvL2NoYW5nZTogRXZDaGFuZ2U7XHJcblx0Y2xpY2s/OiBFdkNsaWNrO1xyXG5cdGRibENsaWNrPzogRXZEYmxDbGljaztcclxuXHRjb250ZXh0TWVudT86IEV2Q29udGV4dE1lbnU7XHJcblx0c2VsZWN0aW9uQ2hhbmdlPzogRXZTZWxlY3Rpb25DaGFuZ2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5pbnRlcmZhY2UgTGlzdGJveFByb3BzIGV4dGVuZHMgT21pdDxDb21wb25lbnRQcm9wcywnY29udGVudCc+IHtcclxuXHRpdGVtcz86IExpc3RJdGVtW107XHJcblx0cmVuZGVyZXI/OiAoIGl0ZW06IExpc3RJdGVtICkgPT4gQ29tcG9uZW50O1xyXG5cdC8vaGVhZGVyPzogSGVhZGVyO1xyXG5cdGNoZWNrYWJsZT86IHRydWUsXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExpc3Rib3ggZXh0ZW5kcyBDb21wb25lbnQ8TGlzdGJveFByb3BzLExpc3Rib3hFdmVudHM+IHtcclxuXHJcblx0cHJpdmF0ZSBfdmlldzogVmlld3BvcnQ7XHJcblx0cHJpdmF0ZSBfc2VsZWN0aW9uOiBMaXN0Ym94SUQ7XHJcblx0cHJpdmF0ZSBfc2VsaXRlbTogQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX2l0ZW1zOiBMaXN0SXRlbVtdO1xyXG5cclxuXHRwcmV2ZW50Rm9jdXMgPSBmYWxzZTtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBMaXN0Ym94UHJvcHMgKSB7XHJcblx0XHRzdXBlciggeyAuLi5wcm9wcyB9ICk7XHJcblxyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidGFiaW5kZXhcIiwgMCApO1xyXG5cdFx0XHJcblx0XHRjb25zdCBzY3JvbGxlciA9IG5ldyBTY3JvbGxWaWV3KCB7IGNsczogXCJib2R5XCIgfSApO1xyXG5cdFx0dGhpcy5fdmlldyA9IHNjcm9sbGVyLmdldFZpZXdwb3J0KCApO1xyXG5cclxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xyXG5cdFx0XHQvL3Byb3BzLmhlYWRlciA/IHByb3BzLmhlYWRlciA6IG51bGwsXHJcblx0XHRcdHNjcm9sbGVyLFxyXG5cdFx0XSApO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNldERPTUV2ZW50cygge1xyXG5cdFx0XHRjbGljazogXHQgKGV2KSA9PiB0aGlzLl9vbl9jbGljayggZXYgKSxcclxuXHRcdFx0a2V5ZG93bjogKCBldiApID0+IHRoaXMuX29uX2tleSggZXYgKSxcclxuXHRcdFx0ZGJsY2xpY2s6IChlKSA9PiB0aGlzLl9vbl9jbGljayhlKSxcclxuXHRcdFx0Y29udGV4dG1lbnU6IChlKSA9PiB0aGlzLl9vbl9jdHhfbWVudShlKSxcclxuXHRcdH0gKTtcclxuXHJcblx0XHRpZiggcHJvcHMuaXRlbXMgKSB7XHJcblx0XHRcdHRoaXMuc2V0SXRlbXMoIHByb3BzLml0ZW1zICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cHJpdmF0ZSBfb25fa2V5KCBldjogS2V5Ym9hcmRFdmVudCApIHtcclxuXHRcdGlmKCB0aGlzLmlzRGlzYWJsZWQoKSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN3aXRjaCggZXYua2V5ICkge1xyXG5cdFx0XHRjYXNlIFwiQXJyb3dEb3duXCI6IHtcclxuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYk5hdi5uZXh0ICk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNhc2UgXCJBcnJvd1VwXCI6IHtcclxuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYk5hdi5wcmV2ICk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNhc2UgXCJIb21lXCI6IHtcclxuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYk5hdi5maXJzdCApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwiRW5kXCI6IHtcclxuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYk5hdi5sYXN0ICk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCApO1xyXG5cdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdG5hdmlnYXRlKCBzZW5zOiBrYk5hdiApIHtcclxuXHRcdFxyXG5cdFx0aWYoICF0aGlzLl9zZWxpdGVtICkge1xyXG5cdFx0XHRpZiggc2Vucz09a2JOYXYubmV4dCApICBzZW5zID0ga2JOYXYuZmlyc3Q7XHJcblx0XHRcdGVsc2Ugc2VucyA9IGtiTmF2Lmxhc3Q7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgbmV4dF92aXNpYmxlID0gKCBlbDogQ29tcG9uZW50LCBkb3duOiBib29sZWFuICkgPT4ge1xyXG5cdFx0XHRcclxuXHRcdFx0d2hpbGUoIGVsICYmICFlbC5pc1Zpc2libGUoKSApIHtcclxuXHRcdFx0XHRlbCA9IGRvd24gPyBlbC5uZXh0RWxlbWVudCgpIDogZWwucHJldkVsZW1lbnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGVsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCBzZW5zPT1rYk5hdi5maXJzdCB8fCBzZW5zPT1rYk5hdi5sYXN0ICkge1xyXG5cdFx0XHRsZXQgZmVsID0gc2Vucz09a2JOYXYuZmlyc3QgPyB0aGlzLl92aWV3LmZpcnN0Q2hpbGQoKSA6IHRoaXMuX3ZpZXcubGFzdENoaWxkKCApO1xyXG5cdFx0XHRmZWwgPSBuZXh0X3Zpc2libGUoIGZlbCwgc2Vucz09a2JOYXYuZmlyc3QgKTtcclxuXHJcblx0XHRcdGlmKCBmZWwgKSB7XHJcblx0XHRcdFx0Y29uc3QgaWQgPSBmZWwuZ2V0RGF0YSggXCJpZFwiICk7XHJcblx0XHRcdFx0dGhpcy5fc2VsZWN0SXRlbSggaWQsIGZlbCApO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bGV0IG5lbCA9IHNlbnM9PWtiTmF2Lm5leHQgPyB0aGlzLl9zZWxpdGVtLm5leHRFbGVtZW50KCkgOiB0aGlzLl9zZWxpdGVtLnByZXZFbGVtZW50KCk7XHJcblx0XHRcdG5lbCA9IG5leHRfdmlzaWJsZSggbmVsLCBzZW5zPT1rYk5hdi5uZXh0ICk7XHJcblxyXG5cdFx0XHRpZiggbmVsICkge1xyXG5cdFx0XHRcdGNvbnN0IGlkID0gbmVsLmdldERhdGEoIFwiaWRcIiApO1xyXG5cdFx0XHRcdHRoaXMuX3NlbGVjdEl0ZW0oIGlkLCBuZWwgKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cdFxyXG5cdHByaXZhdGUgX29uX2NsaWNrKCBldjogVUlFdmVudCApIHtcclxuXHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoICk7XHJcblxyXG5cdFx0bGV0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcclxuXHRcdHdoaWxlKCB0YXJnZXQgJiYgdGFyZ2V0IT10aGlzLmRvbSApIHtcclxuXHRcdFx0Y29uc3QgYyA9IGNvbXBvbmVudEZyb21ET00oIHRhcmdldCApO1xyXG5cdFx0XHRpZiggYyAmJiBjLmhhc0NsYXNzKFwieDRpdGVtXCIpICkge1xyXG5cdFx0XHRcdGNvbnN0IGlkID0gYy5nZXREYXRhKCBcImlkXCIgKTtcclxuXHRcdFx0XHRjb25zdCBmZXY6IENvbXBvbmVudEV2ZW50ID0geyBjb250ZXh0OmlkIH07XHJcblxyXG5cdFx0XHRcdGlmIChldi50eXBlID09ICdjbGljaycpIHtcclxuXHRcdFx0XHRcdHRoaXMuZmlyZSgnY2xpY2snLCBmZXYgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmZpcmUoJ2RibENsaWNrJywgZmV2ICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIWZldi5kZWZhdWx0UHJldmVudGVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBpZCwgYyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRhcmdldCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuY2xlYXJTZWxlY3Rpb24oICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cHJpdmF0ZSBfb25fY3R4X21lbnUoZXY6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1x0XHRcclxuXHJcblx0XHRsZXQgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG5cdFx0d2hpbGUoIHRhcmdldCAmJiB0YXJnZXQhPXRoaXMuZG9tICkge1xyXG5cdFx0XHRjb25zdCBjID0gY29tcG9uZW50RnJvbURPTSggdGFyZ2V0ICk7XHJcblx0XHRcdGlmKCBjICYmIGMuaGFzQ2xhc3MoXCJ4NGl0ZW1cIikgKSB7XHJcblx0XHRcdFx0Y29uc3QgaWQgPSBjLmdldERhdGEoIFwiaWRcIiApO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMuX3NlbGVjdEl0ZW0oaWQsIGMpO1xyXG5cdFx0XHRcdHRoaXMuZmlyZSgnY29udGV4dE1lbnUnLCB7dWlldmVudDogZXYsIGNvbnRleHQ6IGlkIH0gKTtcclxuXHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoJ2NvbnRleHRNZW51JywgeyB1aWV2ZW50OmV2LCBjb250ZXh0OiBudWxsIH0gKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRwcml2YXRlIF9zZWxlY3RJdGVtKCBpZDogTGlzdGJveElELCBpdGVtOiBDb21wb25lbnQgKSB7XHJcblx0XHRpZiggdGhpcy5fc2VsaXRlbSApIHtcclxuXHRcdFx0dGhpcy5fc2VsaXRlbS5yZW1vdmVDbGFzcyggXCJzZWxlY3RlZFwiICk7XHJcblx0XHRcdHRoaXMuX3NlbGl0ZW0gPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fc2VsaXRlbSA9IGl0ZW07XHJcblx0XHR0aGlzLl9zZWxlY3Rpb24gPSBpZDtcclxuXHJcblx0XHRpZiggaXRlbSApIHtcclxuXHRcdFx0aXRlbS5hZGRDbGFzcyggXCJzZWxlY3RlZFwiICk7XHJcblx0XHRcdGl0ZW0uc2Nyb2xsSW50b1ZpZXcoIHtcclxuXHRcdFx0XHRiZWhhdmlvcjogXCJzbW9vdGhcIixcclxuXHRcdFx0XHRibG9jazogXCJuZWFyZXN0XCJcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGl0bSA9IHRoaXMuX2ZpbmRJdGVtKCBpZCApO1xyXG5cdFx0dGhpcy5maXJlKCBcInNlbGVjdGlvbkNoYW5nZVwiLCB7IHNlbGVjdGlvbjogaXRtIH0gKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFxyXG5cdCAqL1xyXG5cclxuXHRwcml2YXRlIF9maW5kSXRlbSggaWQ6IExpc3Rib3hJRCApIHtcclxuXHRcdHJldHVybiB0aGlzLl9pdGVtcy5maW5kKCB4ID0+IHguaWQ9PWlkICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHRcclxuXHRwcml2YXRlIF9maW5kSXRlbUluZGV4KCBpZDogTGlzdGJveElEICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1zLmZpbmRJbmRleCggeCA9PiB4LmlkPT1pZCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdGNsZWFyU2VsZWN0aW9uKCApIHtcclxuXHRcdGlmKCB0aGlzLl9zZWxpdGVtICkge1xyXG5cdFx0XHR0aGlzLl9zZWxpdGVtLnJlbW92ZUNsYXNzKCBcInNlbGVjdGVkXCIgKTtcclxuXHRcdFx0dGhpcy5fc2VsaXRlbSA9IHVuZGVmaW5lZDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9zZWxlY3Rpb24gPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLmZpcmUoIFwic2VsZWN0aW9uQ2hhbmdlXCIsIHsgc2VsZWN0aW9uOiB1bmRlZmluZWQgfSApO1xyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0c2V0SXRlbXMoIGl0ZW1zOiBMaXN0SXRlbVtdICkge1xyXG5cdFx0dGhpcy5jbGVhclNlbGVjdGlvbiggKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5fdmlldy5jbGVhckNvbnRlbnQoICk7XHJcblx0XHR0aGlzLl9pdGVtcyA9IGl0ZW1zO1xyXG5cclxuXHRcdGlmKCBpdGVtcyApIHtcclxuXHRcdFx0Y29uc3QgY29udGVudCA9IGl0ZW1zLm1hcCggeCA9PiB0aGlzLnJlbmRlckl0ZW0oeCkgKTtcclxuXHRcdFx0dGhpcy5fdmlldy5zZXRDb250ZW50KCBjb250ZW50ICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0cmVuZGVySXRlbSggaXRlbTogTGlzdEl0ZW0gKSB7XHJcblx0XHRjb25zdCByZW5kZXJlciA9IHRoaXMucHJvcHMucmVuZGVyZXIgPz8gdGhpcy5kZWZhdWx0UmVuZGVyZXI7XHJcblx0XHRjb25zdCBsaW5lID0gcmVuZGVyZXIoIGl0ZW0gKTtcclxuXHRcclxuXHRcdGxpbmUuYWRkQ2xhc3MoIFwieDRpdGVtXCIgKTtcclxuXHRcdGxpbmUuc2V0RGF0YSggXCJpZFwiLCBpdGVtLmlkK1wiXCIgKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGxpbmU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0ZGVmYXVsdFJlbmRlcmVyKCBpdGVtOiBMaXN0SXRlbSApOiBDb21wb25lbnQge1xyXG5cdFx0cmV0dXJuIG5ldyBIQm94KCB7XHJcblx0XHRcdGNsczogaXRlbS5jbHMsXHJcblx0XHRcdGNvbnRlbnQ6IG5ldyBMYWJlbCggeyBpY29uOiBpdGVtLmljb25JZCwgdGV4dDogaXRlbS50ZXh0IH0pIFxyXG5cdFx0fSApXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0ZmlsdGVyKCBmaWx0ZXI6IHN0cmluZyApIHtcclxuXHRcdGNvbnN0IGNoaWxkcyA9IHRoaXMuX3ZpZXcuZW51bUNoaWxkQ29tcG9uZW50cyggZmFsc2UgKTtcclxuXHRcdFxyXG5cdFx0aWYoICFmaWx0ZXIgKSB7XHJcblx0XHRcdGNoaWxkcy5mb3JFYWNoKCB4ID0+IHguc2hvdyggdHJ1ZSApICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gZ2V0IGxpc3Qgb2YgdmlzaWJsZSBpdGVtc1xyXG5cdFx0XHRjb25zdCBmaWx0cmVkID0gdGhpcy5faXRlbXNcclxuXHRcdFx0XHRcdC5maWx0ZXIoIHggPT4geC50ZXh0LmluY2x1ZGVzKGZpbHRlcikgKVxyXG5cdFx0XHRcdFx0Lm1hcCggeCA9PiB4LmlkKycnICk7XHJcblxyXG5cdFx0XHQvLyBub3cgaGlkZSBhbGwgZWxlbWVudHMgbm90IGluIGxpc3RcclxuXHRcdFx0Y2hpbGRzLmZvckVhY2goIHggPT4ge1xyXG5cdFx0XHRcdHguc2hvdyggZmlsdHJlZC5pbmNsdWRlcyggeC5nZXREYXRhKCBcImlkXCIgKSApICk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogYXBwZW5kIG9yIHByZXBlbmQgYSBuZXcgaXRlbVxyXG5cdCAqIEBwYXJhbSBpdGVtIFxyXG5cdCAqIEBwYXJhbSBwcmVwZW5kIFxyXG5cdCAqIEBwYXJhbSBzZWxlY3QgXHJcblx0ICovXHJcblxyXG5cdGFwcGVuZEl0ZW0oIGl0ZW06IExpc3RJdGVtLCBwcmVwZW5kID0gZmFsc2UsIHNlbGVjdCA9IHRydWUgKSB7XHJcblx0XHRcclxuXHRcdGlmKCBzZWxlY3QgKSB7XHJcblx0XHRcdHRoaXMuY2xlYXJTZWxlY3Rpb24oICk7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGVsID0gdGhpcy5yZW5kZXJJdGVtKCBpdGVtICk7XHJcblxyXG5cdFx0aWYoIHByZXBlbmQgKSB7XHJcblx0XHRcdHRoaXMuX2l0ZW1zLnVuc2hpZnQoIGl0ZW0gKTtcclxuXHRcdFx0dGhpcy5fdmlldy5wcmVwZW5kQ29udGVudCggZWwgKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9pdGVtcy5wdXNoKCBpdGVtICk7XHJcblx0XHRcdHRoaXMuX3ZpZXcuYXBwZW5kQ29udGVudCggZWwgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiggc2VsZWN0ICkge1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBpdGVtLmlkLCBlbCApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogdXBkYXRlIGFuIGl0ZW1cclxuXHQgKi9cclxuXHJcblx0IHVwZGF0ZUl0ZW0oIGlkOiBhbnksIGl0ZW06IExpc3RJdGVtICkge1xyXG5cclxuXHRcdC8vIGZpbmQgaXRlbVxyXG5cdFx0Y29uc3QgaWR4ID0gdGhpcy5fZmluZEl0ZW1JbmRleCggaWQgKTtcclxuXHRcdGlmKCBpZHg8MCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyB0YWtlIGNhcmUgb2Ygc2VsZWN0aW9uXHJcblx0XHRsZXQgd2FzX3NlbCA9IGZhbHNlO1xyXG5cdFx0aWYoIHRoaXMuX3NlbGVjdGlvbiAmJiB0aGlzLl9zZWxlY3Rpb249PT1pZCApIHtcclxuXHRcdFx0d2FzX3NlbCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcmVwbGFjZSBpdCBpbiB0aGUgbGlzdFxyXG5cdFx0dGhpcy5faXRlbXNbaWR4XSA9IGl0ZW07XHJcblxyXG5cdFx0Ly8gcmVidWlsZCAmIHJlcGxhY2UgaXQncyBsaW5lXHJcblx0XHRjb25zdCBvbGRET00gPSB0aGlzLnF1ZXJ5KCBgW2RhdGEtaWQ9XCIke2l0ZW0uaWR9XCJdYCApPy5kb207XHJcblx0XHRpZiggb2xkRE9NICkge1xyXG5cdFx0XHRjb25zdCBfbmV3ID0gdGhpcy5yZW5kZXJJdGVtKCBpdGVtICk7XHJcblx0XHRcdHRoaXMuX3ZpZXcuZG9tLnJlcGxhY2VDaGlsZCggX25ldy5kb20sIG9sZERPTSApO1xyXG5cclxuXHRcdFx0aWYoIHdhc19zZWwgKSB7XHJcblx0XHRcdFx0dGhpcy5fc2VsZWN0SXRlbSggaXRlbS5pZCwgX25ldyApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBjb21ib2JveC50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50LCBDb21wb25lbnRQcm9wcywgRXZDaGFuZ2UsIEV2U2VsZWN0aW9uQ2hhbmdlLCBtYWtlVW5pcXVlQ29tcG9uZW50SWQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IExpc3Rib3gsIExpc3Rib3hJRCwgTGlzdEl0ZW0sIGtiTmF2IH0gZnJvbSAnLi4vbGlzdGJveC9saXN0Ym94JztcclxuaW1wb3J0IHsgUG9wdXAsIFBvcHVwRXZlbnRzLCBQb3B1cFByb3BzIH0gZnJvbSAnLi4vcG9wdXAvcG9wdXAuanMnO1xyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsJztcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuLi9pbnB1dC9pbnB1dCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2J1dHRvbi9idXR0b24nO1xyXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xyXG5cclxuaW1wb3J0IFwiLi9jb21ib2JveC5tb2R1bGUuc2Nzc1wiO1xyXG5pbXBvcnQgaWNvbiBmcm9tIFwiLi91cGRvd24uc3ZnXCI7XHJcblxyXG5cclxuXHJcbmludGVyZmFjZSBEcm9wZG93bkV2ZW50cyBleHRlbmRzIFBvcHVwRXZlbnRzIHtcclxuXHRzZWxlY3Rpb25DaGFuZ2U6IEV2U2VsZWN0aW9uQ2hhbmdlO1xyXG59XHJcblxyXG5cclxuaW50ZXJmYWNlIERyb3Bkb3duUHJvcHMgZXh0ZW5kcyBPbWl0PFBvcHVwUHJvcHMsXCJjb250ZW50XCI+IHtcclxuXHRpdGVtczogTGlzdEl0ZW1bXTtcclxufVxyXG5cclxuY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBQb3B1cDxEcm9wZG93blByb3BzLERyb3Bkb3duRXZlbnRzPiB7XHJcblxyXG5cdHByaXZhdGUgX2xpc3Q6IExpc3Rib3g7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogRHJvcGRvd25Qcm9wcywgY29udGVudD86IExpc3RJdGVtW10gKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHR0aGlzLl9saXN0ID0gbmV3IExpc3Rib3goIHsgaXRlbXM6IHByb3BzLml0ZW1zIH0gKTtcclxuXHRcdHRoaXMuc2V0Q29udGVudCggdGhpcy5fbGlzdCApO1xyXG5cclxuXHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwibW91c2Vkb3duXCIsICggZXY6IEV2ZW50ICkgPT4geyBcclxuXHRcdFx0Y29uc29sZS5sb2coIFwidHJhcFwiICk7XHJcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiggKTtcclxuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCApO1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCggKTtcclxuXHRcdH0sIHRydWUgKTtcclxuXHJcblx0XHR0aGlzLl9saXN0Lm9uKCBcInNlbGVjdGlvbkNoYW5nZVwiLCAoIGV2ICkgPT4ge1xyXG5cdFx0XHR0aGlzLmZpcmUoIFwic2VsZWN0aW9uQ2hhbmdlXCIsIGV2ICk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0Z2V0TGlzdCggKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbGlzdDtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIENvbWJvYm94UHJvcHMgZXh0ZW5kcyBPbWl0PENvbXBvbmVudFByb3BzLFwiY29udGVudFwiPiB7XHJcblx0bGFiZWw/OiBzdHJpbmc7XHJcblx0bGFiZWxXaWR0aD86IG51bWJlciB8IHN0cmluZztcclxuXHRyZWFkb25seT86IGJvb2xlYW47XHJcblx0aXRlbXM6IExpc3RJdGVtW107XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tYm9ib3ggZXh0ZW5kcyBDb21wb25lbnQ8Q29tYm9ib3hQcm9wcz4ge1xyXG5cclxuXHRwcml2YXRlIF9kcm9wZG93bjogRHJvcGRvd247XHJcblx0cHJpdmF0ZSBfbGFiZWw6IExhYmVsO1xyXG5cdHByaXZhdGUgX2lucHV0OiBJbnB1dDtcclxuXHRwcml2YXRlIF9idXR0b246IEJ1dHRvbjtcclxuXHRwcml2YXRlIF9wcmV2ZW50X2Nsb3NlID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfZWRpdDogSEJveDtcclxuXHRcdFx0XHRcclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IENvbWJvYm94UHJvcHMgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHRjb25zdCBpZCA9IG1ha2VVbmlxdWVDb21wb25lbnRJZCggKTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0bmV3IEhCb3goIHsgaWQ6IFwibGFiZWxcIiwgY29udGVudDogbmV3IExhYmVsKCB7IHRhZzogXCJsYWJlbFwiLCB0ZXh0OiBwcm9wcy5sYWJlbCwgbGFiZWxGb3I6IGlkLCB3aWR0aDogcHJvcHMubGFiZWxXaWR0aCB9ICkgfSApLFxyXG5cdFx0XHR0aGlzLl9lZGl0ICA9IG5ldyBIQm94KCB7IGlkOiBcImVkaXRcIiwgY29udGVudDogW1xyXG5cdFx0XHRcdHRoaXMuX2lucHV0ICA9IG5ldyBJbnB1dCggeyB0eXBlOiBcInRleHRcIiwgdmFsdWU6IFwiXCIsIHJlYWRvbmx5OiBwcm9wcy5yZWFkb25seSB9KSxcclxuXHRcdFx0XHR0aGlzLl9idXR0b24gPSBuZXcgQnV0dG9uKCB7IGljb246IGljb24gfSApXHJcblx0XHRcdF19ICksXHJcblx0XHRdKVxyXG5cclxuXHRcdHRoaXMuX2Ryb3Bkb3duID0gbmV3IERyb3Bkb3duKCB7IGl0ZW1zOiBwcm9wcy5pdGVtcyB9ICk7XHJcblxyXG5cdFx0dGhpcy5fZHJvcGRvd24ub24oIFwic2VsZWN0aW9uQ2hhbmdlXCIsICggZXYgKSA9PiB7XHJcblx0XHRcdGNvbnN0IHNlbCA9IGV2LnNlbGVjdGlvbiBhcyBMaXN0SXRlbTtcclxuXHRcdFx0dGhpcy5faW5wdXQuc2V0VmFsdWUoIHNlbCA/IHNlbC50ZXh0IDogXCJcIiApO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoICF0aGlzLl9wcmV2ZW50X2Nsb3NlICkge1xyXG5cdFx0XHRcdHRoaXMuX2Ryb3Bkb3duLnNob3coIGZhbHNlICk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuX2J1dHRvbi5hZGRET01FdmVudCggXCJjbGlja1wiLCAoICkgPT4gdGhpcy5fb25fY2xpY2soICkgKTtcclxuXHRcdHRoaXMuX2lucHV0LmFkZERPTUV2ZW50KCBcImlucHV0XCIsICggKSA9PiB0aGlzLl9vbl9pbnB1dCggKSApO1xyXG5cdFx0dGhpcy5faW5wdXQuYWRkRE9NRXZlbnQoIFwia2V5ZG93blwiLCAoIGV2ICkgPT4gdGhpcy5fb25fa2V5KCBldiApICk7XHJcblxyXG5cdFx0dGhpcy5zZXRET01FdmVudHMoIHtcclxuXHRcdFx0Zm9jdXNvdXQ6ICggKSA9PiB0aGlzLl9vbl9mb2N1c291dCggKSxcclxuXHRcdFx0Y2xpY2s6ICggKSA9PiB0aGlzLl9vbl9jbGljayggKSxcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbl9rZXkoIGV2OiBLZXlib2FyZEV2ZW50ICkge1xyXG5cdFx0c3dpdGNoKCBldi5rZXkgKSB7XHJcblx0XHRcdGNhc2UgXCJFbnRlclwiOlxyXG5cdFx0XHRjYXNlIFwiRXNjYXBlXCI6IHtcclxuXHRcdFx0XHR0aGlzLl9kcm9wZG93bi5zaG93KCBmYWxzZSApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwiQXJyb3dVcFwiOlxyXG5cdFx0XHRcdHRoaXMuX3ByZXZlbnRfY2xvc2UgPSB0cnVlO1xyXG5cdFx0XHRcdGlmKCAhdGhpcy5fZHJvcGRvd24uaXNPcGVuKCApICkge1xyXG5cdFx0XHRcdFx0dGhpcy5zaG93RHJvcERvd24oICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5fZHJvcGRvd24uZ2V0TGlzdCgpLm5hdmlnYXRlKCBrYk5hdi5wcmV2ICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl9wcmV2ZW50X2Nsb3NlID0gZmFsc2U7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFwiQXJyb3dEb3duXCI6XHJcblx0XHRcdFx0dGhpcy5fcHJldmVudF9jbG9zZSA9IHRydWU7XHJcblx0XHRcdFx0aWYoICF0aGlzLl9kcm9wZG93bi5pc09wZW4oICkgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNob3dEcm9wRG93biggKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLl9kcm9wZG93bi5nZXRMaXN0KCkubmF2aWdhdGUoIGtiTmF2Lm5leHQgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX3ByZXZlbnRfY2xvc2UgPSBmYWxzZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCggKTtcclxuXHRcdGV2LnN0b3BQcm9wYWdhdGlvbiggKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uX2lucHV0KCApIHtcclxuXHRcdGlmKCAhdGhpcy5fZHJvcGRvd24uaXNPcGVuKCApICkge1xyXG5cdFx0XHR0aGlzLnNob3dEcm9wRG93biggKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9kcm9wZG93bi5nZXRMaXN0KCkuZmlsdGVyKCB0aGlzLl9pbnB1dC5nZXRWYWx1ZSggKSApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25fZm9jdXNvdXQoICkge1xyXG5cdFx0dGhpcy5fZHJvcGRvd24uc2hvdyggZmFsc2UgKTtcclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfb25fY2xpY2soICkge1xyXG5cdFx0dGhpcy5zaG93RHJvcERvd24oICk7XHJcblx0fVxyXG5cclxuXHRzaG93RHJvcERvd24oICkge1xyXG5cdFx0aWYoIHRoaXMuaXNEaXNhYmxlZCgpICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGNvbnN0IHJjID0gdGhpcy5fZWRpdC5nZXRCb3VuZGluZ1JlY3QoICk7XHJcblx0XHR0aGlzLl9kcm9wZG93bi5zZXRTdHlsZVZhbHVlKCBcIndpZHRoXCIsIHJjLndpZHRoK1wicHhcIiApO1xyXG5cdFx0dGhpcy5fZHJvcGRvd24uZGlzcGxheU5lYXIoIHJjLCBcInRvcCBsZWZ0XCIsIFwiYm90dG9tIGxlZnRcIiwge3g6MCx5OjZ9ICk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIGRpYWxvZy50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBGb3JtIH0gZnJvbSBcIi4uL2Zvcm0vZm9ybS5qc1wiXHJcbmltcG9ydCB7IFBvcHVwRXZlbnRzLCBQb3B1cFByb3BzLCBQb3B1cCB9IGZyb20gJy4uL3BvcHVwL3BvcHVwLmpzJztcclxuaW1wb3J0IHsgQnRuR3JvdXAsIEJ0bkdyb3VwSXRlbSB9IGZyb20gXCIuLi9idG5ncm91cC9idG5ncm91cFwiXHJcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcy5qcyc7XHJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwuanMnO1xyXG5pbXBvcnQgeyBDb21wb25lbnRDb250ZW50LCBDb21wb25lbnRFdmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50LmpzJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vYnV0dG9uL2J1dHRvbi5qcyc7XHJcblxyXG5pbXBvcnQgXCIuL2RpYWxvZy5tb2R1bGUuc2Nzc1wiXHJcbmltcG9ydCBjbG9zZV9pY29uIGZyb20gXCIuL3htYXJrLXNoYXJwLWxpZ2h0LnN2Z1wiO1xyXG5pbXBvcnQgeyBDb3JlRXZlbnQgfSBmcm9tICdAY29yZS9jb3JlX2V2ZW50cy5qcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpYWxvZ1Byb3BzIGV4dGVuZHMgUG9wdXBQcm9wcyB7XHJcblx0aWNvbj86IHN0cmluZztcclxuXHR0aXRsZTogc3RyaW5nO1xyXG5cdGZvcm06IEZvcm07XHJcblx0YnV0dG9uczogQnRuR3JvdXBJdGVtW107XHJcblx0Y2xvc2FibGU/OiBib29sZWFuO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdkJ0bkNsaWNrIGV4dGVuZHMgQ29yZUV2ZW50IHtcclxuXHRidXR0b246IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIERpYWxvZ0V2ZW50cyBleHRlbmRzIFBvcHVwRXZlbnRzIHtcclxuXHRidG5jbGljazogRXZCdG5DbGljaztcclxuXHRjbG9zZTogQ29tcG9uZW50RXZlbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgRGlhbG9nPFAgZXh0ZW5kcyBEaWFsb2dQcm9wcyA9IERpYWxvZ1Byb3BzLCBFIGV4dGVuZHMgRGlhbG9nRXZlbnRzID0gRGlhbG9nRXZlbnRzPiAgZXh0ZW5kcyBQb3B1cDxQLEU+IHtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBQICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0dGhpcy5hcHBlbmRDb250ZW50KCBbXHJcblx0XHRcdG5ldyBIQm94KCB7XHJcblx0XHRcdFx0Y2xzOiBcImNhcHRpb25cIixcclxuXHRcdFx0XHRjb250ZW50OiBbXHJcblx0XHRcdFx0XHRuZXcgTGFiZWwoIHsgXHJcblx0XHRcdFx0XHRcdGlkOiBcInRpdGxlXCIsIFxyXG5cdFx0XHRcdFx0XHRjbHM6IFwiY2FwdGlvbi1lbGVtZW50XCIsXHJcblx0XHRcdFx0XHRcdGljb246IHByb3BzLmljb24sIFxyXG5cdFx0XHRcdFx0XHR0ZXh0OiBwcm9wcy50aXRsZSBcclxuXHRcdFx0XHRcdH0gKSxcclxuXHRcdFx0XHRcdHByb3BzLmNsb3NhYmxlID8gbmV3IEJ1dHRvbiggeyBcclxuXHRcdFx0XHRcdFx0aWQ6IFwiY2xvc2Vib3hcIiwgXHJcblx0XHRcdFx0XHRcdGljb246IGNsb3NlX2ljb24sIFxyXG5cdFx0XHRcdFx0XHRjbGljazogICggKSA9PiB7IHRoaXMuY2xvc2UoKSB9XHJcblx0XHRcdFx0XHR9ICkgOiBudWxsLFxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSksXHJcblx0XHRcdHByb3BzLmZvcm0sXHJcblx0XHRcdG5ldyBCdG5Hcm91cCgge1xyXG5cdFx0XHRcdGlkOiBcImJ0bmJhclwiLFxyXG5cdFx0XHRcdHJldmVyc2U6IHRydWUsXHJcblx0XHRcdFx0aXRlbXM6IHByb3BzLmJ1dHRvbnMsXHJcblx0XHRcdFx0YnRuY2xpY2s6ICggZXYgKSA9PiB7IHRoaXMuZmlyZSggXCJidG5jbGlja1wiLCBldiApIH1cclxuXHRcdFx0fSkgXHJcblx0XHRdKVxyXG5cdH1cclxuXHJcblx0ZGlzcGxheSggICkge1xyXG5cdFx0c3VwZXIuZGlzcGxheUNlbnRlciggICk7XHJcblx0fVxyXG5cclxuXHRvdmVycmlkZSBjbG9zZSggKSB7XHJcblx0XHR0aGlzLmZpcmUoIFwiY2xvc2VcIiwge30gKTtcclxuXHRcdHN1cGVyLmNsb3NlKCApO1xyXG5cdH1cclxufVxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIGZvcm0udHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQm94LCBCb3hQcm9wcyB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcclxuXHJcbmltcG9ydCBcIi4vZm9ybS5tb2R1bGUuc2Nzc1wiXHJcblxyXG50eXBlIEZvcm1WYWx1ZSA9IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW47XHJcbnR5cGUgRm9ybVZhbHVlcyA9IFJlY29yZDxzdHJpbmcsRm9ybVZhbHVlPjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRm9ybVByb3BzIGV4dGVuZHMgQm94UHJvcHMge1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRm9ybTxQIGV4dGVuZHMgRm9ybVByb3BzID0gRm9ybVByb3BzPiBleHRlbmRzIEJveDxQPiB7XHJcblxyXG5cdHNldFZhbHVlcyggdmFsdWVzOiBGb3JtVmFsdWVzICkge1xyXG5cdFx0Y29uc3QgaXRlbXMgPSB0aGlzLnF1ZXJ5QWxsKCBcImlucHV0W25hbWVdXCIgKTtcclxuXHRcdGNvbnNvbGUubG9nKCBpdGVtcyApO1xyXG5cdH1cclxuXHJcblx0Z2V0VmFsdWVzKCApOiBGb3JtVmFsdWVzIHtcclxuXHRcdGNvbnN0IHJlc3VsdDogRm9ybVZhbHVlcyA9IHt9O1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcbn1cclxuXHJcbiIsICJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQuanMnO1xyXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMuanMnO1xyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsLmpzJztcclxuaW1wb3J0IHsgQ1NpemVyIH0gZnJvbSAnLi4vc2l6ZXJzL3NpemVyLmpzJztcclxuXHJcbmltcG9ydCBcIi4vaGVhZGVyLm1vZHVsZS5zY3NzXCJcclxuXHJcbmludGVyZmFjZSBIZWFkZXJJdGVtIHtcclxuXHRuYW1lOiBzdHJpbmc7XHJcblx0dGl0bGU6IHN0cmluZztcclxuXHRpY29uSWQ/OiBzdHJpbmc7XHJcblx0d2lkdGg/OiBudW1iZXI7XHQvLyA8MCBmb3IgZmxleFxyXG59XHJcblxyXG5pbnRlcmZhY2UgSGVhZGVyUHJvcHMgZXh0ZW5kcyBPbWl0PENvbXBvbmVudFByb3BzLFwiY29udGVudFwiPiB7XHJcblx0aXRlbXM6IEhlYWRlckl0ZW1bXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGVhZGVyIGV4dGVuZHMgSEJveDxIZWFkZXJQcm9wcz4ge1xyXG5cclxuXHRwcml2YXRlIF9lbHM6IENvbXBvbmVudFtdO1xyXG5cdHByaXZhdGUgX3Z3cDogQ29tcG9uZW50O1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEhlYWRlclByb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0dGhpcy5fZWxzID0gcHJvcHMuaXRlbXM/Lm1hcCggeCA9PiB7XHJcblx0XHRcdGNvbnN0IGNlbGwgPSBuZXcgTGFiZWwoIHsgY2xzOiBcImNlbGxcIiwgdGV4dDogeC50aXRsZSwgaWNvbjogeC5pY29uSWQgfSApO1xyXG5cdFx0XHRjb25zdCBzaXplciA9IG5ldyBDU2l6ZXIoIFwicmlnaHRcIiApO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoIHgud2lkdGg+MCApIHtcclxuXHRcdFx0XHRjZWxsLnNldFN0eWxlVmFsdWUoIFwid2lkdGhcIiwgeC53aWR0aCsncHgnICk7XHJcblx0XHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoIFwid2lkdGhcIiwgeC53aWR0aCApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYoIHgud2lkdGg8MCApIHtcclxuXHRcdFx0XHRjZWxsLnNldEludGVybmFsRGF0YSggXCJmbGV4XCIsIC14LndpZHRoICk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoIFwid2lkdGhcIiwgMCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzaXplci5hZGRET01FdmVudCggXCJkYmxjbGlja1wiLCAoIGU6IE1vdXNlRXZlbnQgKSA9PiB7XHJcblx0XHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoIFwiZmxleFwiLCAxICk7XHJcblx0XHRcdFx0dGhpcy5fY2FsY19zaXplcyggKTtcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdHNpemVyLm9uKCBcInJlc2l6ZVwiLCAoIGV2ICkgPT4ge1xyXG5cdFx0XHRcdC8vY2VsbC5zZXRTdHlsZVZhbHVlKCBcImZsZXhHcm93XCIsIFwiMFwiICk7XHJcblx0XHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoXCJmbGV4XCIsMCk7XHJcblx0XHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoXCJ3aWR0aFwiLGV2LnNpemUpO1xyXG5cdFx0XHRcdHRoaXMuX2NhbGNfc2l6ZXMoICk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Y2VsbC5hcHBlbmRDb250ZW50KCBzaXplciApO1xyXG5cdFx0XHRjZWxsLnNldEludGVybmFsRGF0YSggXCJkYXRhXCIsIHggKTtcclxuXHJcblx0XHRcdHJldHVybiBjZWxsO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRET01FdmVudCggXCJyZXNpemVkXCIsICggKSA9PiB0aGlzLl9vbl9yZXNpemUoKSApO1xyXG5cdFx0dGhpcy5hZGRET01FdmVudCggXCJjcmVhdGVkXCIsICggKSA9PiB0aGlzLl9jYWxjX3NpemVzKCApICk7XHJcblxyXG5cdFx0dGhpcy5fdndwID0gbmV3IEhCb3goIHsgY29udGVudDogdGhpcy5fZWxzIH0gKTtcclxuXHRcdHRoaXMuc2V0Q29udGVudCggIHRoaXMuX3Z3cCApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FsY19zaXplcyggKSB7XHJcblxyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdGxldCBmaWxsZWQgPSAwO1xyXG5cclxuXHRcdHRoaXMuX2Vscy5mb3JFYWNoKCBjID0+IHtcclxuXHRcdFx0Y29uc3QgZmxleCA9IGMuZ2V0SW50ZXJuYWxEYXRhKCBcImZsZXhcIiApO1xyXG5cdFx0XHRpZiggZmxleCApIHtcclxuXHRcdFx0XHRjb3VudCArPSBmbGV4O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGxldCB3aWR0aCA9IGMuZ2V0SW50ZXJuYWxEYXRhKCBcIndpZHRoXCIgKTtcclxuXHRcdFx0XHRpZiggd2lkdGg9PTAgKSB7XHJcblx0XHRcdFx0XHRjb25zdCByYyA9IGMuZ2V0Qm91bmRpbmdSZWN0KCApO1xyXG5cdFx0XHRcdFx0d2lkdGggPSBNYXRoLmNlaWwoIHJjLndpZHRoICkrMjtcclxuXHRcdFx0XHRcdGMuc2V0SW50ZXJuYWxEYXRhKCBcIndpZHRoXCIsIHdpZHRoICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0ZmlsbGVkICs9IHdpZHRoO1xyXG5cdFx0XHR9XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Y29uc3QgcmMgPSB0aGlzLmdldEJvdW5kaW5nUmVjdCggKTtcclxuXHRcdFxyXG5cdFx0bGV0IHJlc3QgPSAocmMud2lkdGgtZmlsbGVkKTtcclxuXHRcdGNvbnN0IHVuaXQgPSBNYXRoLmNlaWwoIHJlc3QvY291bnQgKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyggXCJmaWxsZWRcIiwgZmlsbGVkICk7XHJcblx0XHRjb25zb2xlLmxvZyggXCJjb3VudFwiLCBjb3VudCApO1xyXG5cdFx0Y29uc29sZS5sb2coIFwicmVzdFwiLCByZXN0ICk7XHJcblx0XHRjb25zb2xlLmxvZyggXCJ1bml0XCIsIHVuaXQgKTtcclxuXHRcdFxyXG5cdFx0bGV0IGZ1bGx3ID0gMDtcclxuXHRcdHRoaXMuX2Vscy5mb3JFYWNoKCBjID0+IHtcclxuXHRcdFx0bGV0IHdpZHRoID0gMDtcclxuXHJcblx0XHRcdGNvbnN0IGZsZXggPSBjLmdldEludGVybmFsRGF0YSggXCJmbGV4XCIgKTtcclxuXHRcdFx0aWYoIGZsZXggKSB7XHJcblx0XHRcdFx0d2lkdGggPSBNYXRoLm1pbiggdW5pdCpmbGV4LCByZXN0ICk7XHJcblx0XHRcdFx0cmVzdCAtPSB3aWR0aDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR3aWR0aCA9IGMuZ2V0SW50ZXJuYWxEYXRhKCBcIndpZHRoXCIgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Yy5zZXRXaWR0aCggd2lkdGggKTtcclxuXHRcdFx0ZnVsbHcgKz0gd2lkdGg7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0dGhpcy5fdndwLnNldFdpZHRoKCBmdWxsdyApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25fcmVzaXplKCApIHtcclxuXHRcdHRoaXMuX2NhbGNfc2l6ZXMoICk7XHJcblx0fVxyXG5cclxuXHJcbn0iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgaW1hZ2UudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50LmpzJztcclxuXHJcbmltcG9ydCBcIi4vaW1hZ2UubW9kdWxlLnNjc3NcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbWFnZVByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xyXG5cdHNyYzogc3RyaW5nO1xyXG5cdGZpdD86IFwiY29udGFpblwiIHwgXCJjb3ZlclwiIHwgXCJmaWxsXCIgfCBcInNjYWxlLWRvd25cIjtcclxuXHRwb3NpdGlvbj86IHN0cmluZztcclxuXHRsYXp5PzogYm9vbGVhbjtcclxuXHRhbHQ/OiBzdHJpbmc7XHJcblx0ZHJhZ2dhYmxlPzogYm9vbGVhbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZSBleHRlbmRzIENvbXBvbmVudDxJbWFnZVByb3BzPiB7XHJcblxyXG5cdHByaXZhdGUgX2ltZzogQ29tcG9uZW50O1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEltYWdlUHJvcHMgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHR0aGlzLl9pbWcgPSBuZXcgQ29tcG9uZW50KCB7XHJcblx0XHRcdHRhZzogXCJpbWdcIixcclxuXHRcdFx0YXR0cnM6IHtcclxuXHRcdFx0XHRsb2FkaW5nOiBwcm9wcy5sYXp5LFxyXG5cdFx0XHRcdGFsdDogcHJvcHMuYWx0LFxyXG5cdFx0XHRcdGRyYWdnYWJsZTogcHJvcHMuZHJhZ2dhYmxlID8/IGZhbHNlLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdHlsZToge1xyXG5cdFx0XHRcdHdpZHRoOiBcIjEwMCVcIixcclxuXHRcdFx0XHRoZWlnaHQ6IFwiMTAwJVwiLFxyXG5cdFx0XHRcdG9iamVjdEZpdDogcHJvcHMuZml0LFxyXG5cdFx0XHRcdG9iamVjdFBvc2l0aW9uOiBwcm9wcy5wb3NpdGlvbixcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdFxyXG5cdFx0dGhpcy5zZXRDb250ZW50KCB0aGlzLl9pbWcgKTtcclxuXHRcdHRoaXMuc2V0SW1hZ2UoIHByb3BzLnNyYyApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblx0XHJcblx0c2V0SW1hZ2UoIHNyYzogc3RyaW5nICkge1xyXG5cdFx0dGhpcy5faW1nLnNldEF0dHJpYnV0ZSggXCJzcmNcIiwgc3JjICk7XHJcblx0fVxyXG59IiwgIlxyXG4vLyA6OiBNRVNTQUdFQk9YIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcblxyXG5pbXBvcnQgeyBfdHIgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfaTE4bic7XHJcblxyXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xyXG5pbXBvcnQgeyBJY29uIH0gZnJvbSAnLi4vaWNvbi9pY29uJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbC9sYWJlbCc7XHJcbmltcG9ydCB7IERpYWxvZywgRGlhbG9nUHJvcHMgfSBmcm9tIFwiLi4vZGlhbG9nL2RpYWxvZ1wiXHJcblxyXG5pbXBvcnQgXCIuL21lc3NhZ2VzLm1vZHVsZS5zY3NzXCI7XHJcblxyXG5pbXBvcnQgZXJyb3JfaWNvbiBmcm9tIFwiLi9jaXJjbGUtZXhjbGFtYXRpb24uc3ZnXCI7XHJcbmltcG9ydCB7IGFzYXAsIFVuc2FmZUh0bWwgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfdG9vbHMuanMnO1xyXG5pbXBvcnQgeyBGb3JtIH0gZnJvbSAnLi4vZm9ybS9mb3JtLmpzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZUJveFByb3BzIGV4dGVuZHMgRGlhbG9nUHJvcHMge1xyXG5cdG1lc3NhZ2U6IHN0cmluZztcclxuXHRjbGljazogKGJ1dHRvbjogc3RyaW5nKSA9PiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWVzc2FnZUJveCBleHRlbmRzIERpYWxvZzxEaWFsb2dQcm9wcz5cclxue1xyXG5cdG1fbGFiZWw6IExhYmVsO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcm9wczogRGlhbG9nUHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHR9XHJcblxyXG5cdHNldFRleHQodHh0OiBzdHJpbmcgfCBVbnNhZmVIdG1sICkge1xyXG5cdFx0dGhpcy5tX2xhYmVsLnNldFRleHQoIHR4dCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogZGlzcGxheSBhIG1lc3NhZ2Vib3hcclxuXHQgKi9cclxuXHJcblx0c3RhdGljIHNob3coIG1zZzogc3RyaW5nIHwgVW5zYWZlSHRtbCApOiBNZXNzYWdlQm94IHtcclxuXHJcblx0XHRjb25zdCBib3ggPSBuZXcgTWVzc2FnZUJveCh7IFxyXG5cdFx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdFx0dGl0bGU6IF90ci5nbG9iYWwuZXJyb3IsXHJcblx0XHRcdG1vdmFibGU6IHRydWUsXHJcblx0XHRcdGZvcm06IG5ldyBGb3JtKCB7XHJcblx0XHRcdFx0Y29udGVudDogW1xyXG5cdFx0XHRcdFx0bmV3IEhCb3goIHtcclxuXHRcdFx0XHRcdFx0Y29udGVudDogW1xyXG5cdFx0XHRcdFx0XHRcdG5ldyBJY29uKCB7IGljb25JZDogZXJyb3JfaWNvbiB9KSxcclxuXHRcdFx0XHRcdFx0XHRuZXcgTGFiZWwoIHsgdGV4dDogbXNnIH0gKSxcclxuXHRcdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9KSxcclxuXHRcdFx0YnV0dG9uczogW1wib2tcIixcImNhbmNlbFwiXVxyXG5cdFx0fSk7XHJcblx0XHJcblx0XHRib3gub24oIFwiYnRuY2xpY2tcIiwgKCBldiApID0+IHtcclxuXHRcdFx0YXNhcCggKCApID0+IGJveC5jbG9zZSgpICk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRib3guZGlzcGxheSgpO1xyXG5cdFx0cmV0dXJuIGJveDtcclxuXHR9XHJcbn0iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgbm90aWZpY2F0aW9uLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQuanMnO1xyXG5pbXBvcnQgeyBSZWN0LCBVbnNhZmVIdG1sIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcclxuXHJcbmltcG9ydCB7IFBvcHVwIH0gZnJvbSAnLi4vcG9wdXAvcG9wdXAuanMnO1xyXG5pbXBvcnQgeyBIQm94LCBWQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMuanMnO1xyXG5pbXBvcnQgeyBJY29uIH0gZnJvbSAnLi4vaWNvbi9pY29uLmpzJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbC9sYWJlbC5qcyc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2J1dHRvbi9idXR0b24uanMnO1xyXG5cclxuaW1wb3J0IFwiLi9ub3RpZmljYXRpb24ubW9kdWxlLnNjc3NcIjtcclxuXHJcbmltcG9ydCBkZWZfaWNvbiBmcm9tIFwiLi9jaXJjbGUtY2hlY2stc29saWQuc3ZnXCI7XHJcbmltcG9ydCBkYW5nZXJfaWNvbiBmcm9tIFwiLi9jaXJjbGUtZXhjbGFtYXRpb24tc29saWQuc3ZnXCJcclxuaW1wb3J0IHNwaW5faWNvbiBmcm9tIFwiLi9jaXJjbGUtbm90Y2gtbGlnaHQuc3ZnXCI7XHJcbmltcG9ydCBjbG9zZV9pY29uIGZyb20gXCIuL3htYXJrLXNoYXJwLWxpZ2h0LnN2Z1wiO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmludGVyZmFjZSBOb3RpZmljYXRpb25Qcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcclxuXHRsb2FkaW5nPzogYm9vbGVhbjtcclxuXHRpY29uSWQ/OiBzdHJpbmc7XHJcblx0Y2xvc2FibGU/OiBib29sZWFuO1xyXG5cdG1vZGU/OiBcInN1Y2Nlc3NcIiB8IFwiZGFuZ2VyXCI7XHJcblxyXG5cdHRpdGxlOiBzdHJpbmc7XHJcblx0dGV4dDogc3RyaW5nIHwgVW5zYWZlSHRtbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb24gZXh0ZW5kcyBQb3B1cCB7XHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBOb3RpZmljYXRpb25Qcm9wcyApIHtcclxuXHRcdHN1cGVyKCB7IH0gKTtcclxuXHJcblx0XHRsZXQgaWNvbiA9IHByb3BzLmljb25JZDtcclxuXHRcdGlmKCAhaWNvbiApIHtcclxuXHRcdFx0aWYoIHByb3BzLmxvYWRpbmcgKSB7XHJcblx0XHRcdFx0aWNvbiA9IHNwaW5faWNvbjtcclxuXHRcdFx0XHR0aGlzLmFkZENsYXNzKCBcIlwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYoIHByb3BzLm1vZGU9PVwiZGFuZ2VyXCIgKSB7XHJcblx0XHRcdFx0aWNvbiA9IGRhbmdlcl9pY29uO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGljb24gPSBkZWZfaWNvbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYWRkQ2xhc3MoIHByb3BzLm1vZGUgKTtcclxuXHJcblx0XHRjb25zdCBfaWNvbiA9IG5ldyBJY29uKCB7IGljb25JZDogaWNvbiB9ICk7XHJcblx0XHRpZiggcHJvcHMubG9hZGluZyApIHtcclxuXHRcdFx0X2ljb24uYWRkQ2xhc3MoIFwicm90YXRlXCIgKTtcclxuXHRcdFx0dGhpcy5wcm9wcy5tb2RhbCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zZXRDb250ZW50KCBuZXcgSEJveCggeyBcclxuXHRcdFx0Y29udGVudDogW1xyXG5cdFx0XHRcdF9pY29uLFxyXG5cdFx0XHRcdG5ldyBWQm94KCB7IGNsczogXCJib2R5XCIsIGNvbnRlbnQ6IFsgXHJcblx0XHRcdFx0XHRuZXcgTGFiZWwoIHsgY2xzOiBcInRpdGxlXCIsIHRleHQ6IHByb3BzLnRpdGxlIH0gKSxcclxuXHRcdFx0XHRcdG5ldyBMYWJlbCggeyBjbHM6IFwidGV4dFwiLCB0ZXh0OiBwcm9wcy50ZXh0IH0gKSxcclxuXHRcdFx0XHRdIH0pLFxyXG5cdFx0XHRcdG5ldyBCdXR0b24oIHsgY2xzOiBcIm91dGxpbmVcIiwgaWNvbjogY2xvc2VfaWNvbiwgY2xpY2s6ICggKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmNsb3NlKCApO1xyXG5cdFx0XHRcdH0gfSApXHJcblx0XHRcdF1cclxuXHRcdH0pICk7XHJcblx0fVxyXG5cclxuXHRjbG9zZSggKSB7XHJcblx0XHR0aGlzLmNsZWFyVGltZW91dCggXCJjbG9zZVwiICk7XHJcblx0XHRzdXBlci5jbG9zZSggKTtcclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoIHRpbWVfaW5fcyA9IDAgKSB7XHJcblx0XHRjb25zdCByID0gbmV3IFJlY3QoIDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuXHRcdHRoaXMuZGlzcGxheU5lYXIoIHIsIFwiYm90dG9tIHJpZ2h0XCIsIFwiYm90dG9tIHJpZ2h0XCIsIHsgeDogLTIwLCB5OiAtMTAgfSApO1xyXG5cclxuXHRcdGlmKCB0aW1lX2luX3MgKSB7XHJcblx0XHRcdHRoaXMuc2V0VGltZW91dCggXCJjbG9zZVwiLCB0aW1lX2luX3MqMTAwMCwgKCApID0+IHsgXHJcblx0XHRcdFx0dGhpcy5jbG9zZSgpIFxyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIHBhbmVsLnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q29udGVudCwgQ29tcG9uZW50UHJvcHMgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IFVuc2FmZUh0bWwsIENvbnN0cnVjdG9yIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzJztcclxuXHJcbmltcG9ydCB7IFZCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcyc7XHJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xyXG5cclxuaW1wb3J0IFwiLi9wYW5lbC5tb2R1bGUuc2Nzc1wiO1xyXG5cclxuaW50ZXJmYWNlIFBhbmVsUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0dGl0bGU6IHN0cmluZztcclxuXHRpY29uPzogc3RyaW5nO1xyXG5cdGJvZHlNb2RlbD86IENvbnN0cnVjdG9yPENvbXBvbmVudD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgUGFuZWwgZXh0ZW5kcyBWQm94PFBhbmVsUHJvcHM+IHtcclxuXHJcblx0cHJpdmF0ZSBfdGl0bGU6IENvbXBvbmVudDtcclxuXHRwcml2YXRlIF9ib2R5OiBDb21wb25lbnQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogUGFuZWxQcm9wcyApIHtcclxuXHRcdHN1cGVyKCB7IC4uLnByb3BzLCBjb250ZW50OiB1bmRlZmluZWQgfSApO1xyXG5cclxuXHRcdGNvbnN0IG1vZGVsID0gcHJvcHMuYm9keU1vZGVsID8/IFZCb3g7XHJcblx0XHRzdXBlci5zZXRDb250ZW50KCBbXHJcblx0XHRcdHRoaXMuX3RpdGxlID0gbmV3IExhYmVsKCB7IHRhZzogXCJsZWdlbmRcIiwgdGV4dDogcHJvcHMudGl0bGUsIGljb246IHByb3BzLmljb24gfSApLFxyXG5cdFx0XHR0aGlzLl9ib2R5ICA9IG5ldyBtb2RlbCggeyBjbHM6IFwiYm9keVwiLCBjb250ZW50OiBwcm9wcy5jb250ZW50IH0gKVxyXG5cdFx0XSApO1xyXG5cdH1cclxuXHJcblx0c2V0Q29udGVudCggY29udGVudDogQ29tcG9uZW50Q29udGVudCApIHtcclxuXHRcdHRoaXMuX2JvZHkuc2V0Q29udGVudCggY29udGVudCApO1xyXG5cdH1cclxuXHJcblx0c2V0VGl0bGUoIHRpdGxlOiBzdHJpbmcgfCBVbnNhZmVIdG1sICkge1xyXG5cdFx0dGhpcy5fdGl0bGUuc2V0Q29udGVudCggdGl0bGUgKVxyXG5cdH1cclxufSIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSBwcm9ncmVzcy50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IFwiLi9wcm9ncmVzcy5tb2R1bGUuc2Nzc1wiO1xyXG5cclxuaW50ZXJmYWNlIFByb2dyZXNzUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0dmFsdWU6IG51bWJlcjtcclxuXHRtaW46IG51bWJlcjtcclxuXHRtYXg6IG51bWJlcjtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmVzcyBleHRlbmRzIENvbXBvbmVudDxQcm9ncmVzc1Byb3BzPiB7XHJcblxyXG5cdHByaXZhdGUgX2JhcjogQ29tcG9uZW50O1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFByb2dyZXNzUHJvcHMgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIHRoaXMuX2Jhcj1uZXcgQ29tcG9uZW50KCB7IGNsczogXCJiYXJcIiB9ICkgKTtcclxuXHRcdHRoaXMuc2V0VmFsdWUoIHByb3BzLnZhbHVlICk7XHJcblx0fVxyXG5cclxuXHRzZXRWYWx1ZSggdmFsdWU6IG51bWJlciApIHtcclxuXHRcdGNvbnN0IHBlcmMgPSB2YWx1ZSAvICh0aGlzLnByb3BzLm1heC10aGlzLnByb3BzLm1pbikgKiAxMDA7XHJcblx0XHR0aGlzLl9iYXIuc2V0U3R5bGVWYWx1ZSggXCJ3aWR0aFwiLCBwZXJjK1wiJVwiICk7XHJcblx0fVxyXG59IiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIHJhdGluZy50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50cywgY29tcG9uZW50RnJvbURPTSwgQ29tcG9uZW50UHJvcHMsIEV2Q2hhbmdlIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQuanMnO1xyXG5pbXBvcnQgeyBFdmVudENhbGxiYWNrIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX2V2ZW50cy5qcyc7XHJcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcy5qcyc7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQuanMnO1xyXG5pbXBvcnQgeyBJY29uIH0gZnJvbSAnLi4vaWNvbi9pY29uLmpzJztcclxuXHJcbmltcG9ydCBcIi4vcmF0aW5nLm1vZHVsZS5zY3NzXCJcclxuaW1wb3J0IHN0YXJfaWNvbiBmcm9tIFwiLi9zdGFyLXNoYXJwLXNvbGlkLnN2Z1wiXHJcblxyXG5pbnRlcmZhY2UgUmF0aW5nRXZlbnRNYXAgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xyXG5cdGNoYW5nZTogRXZDaGFuZ2U7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSYXRpbmdQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcclxuXHRzdGVwcz86IG51bWJlcjtcclxuXHR2YWx1ZT86IG51bWJlcjtcclxuXHRpY29uPzogc3RyaW5nO1xyXG5cdG5hbWU/OiBzdHJpbmc7IFxyXG5cclxuXHRjaGFuZ2U/OiBFdmVudENhbGxiYWNrPEV2Q2hhbmdlPjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhdGluZyBleHRlbmRzIEhCb3g8UmF0aW5nUHJvcHMsUmF0aW5nRXZlbnRNYXA+IHtcclxuXHJcblx0cHJpdmF0ZSBtX2VsczogQ29tcG9uZW50W107XHJcblx0cHJpdmF0ZSBtX2lucHV0OiBJbnB1dDtcclxuXHRcclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFJhdGluZ1Byb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0cHJvcHMuc3RlcHMgPSBwcm9wcy5zdGVwcyA/PyA1O1xyXG5cdFx0dGhpcy5fdXBkYXRlKCApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfdXBkYXRlKCApIHtcclxuXHRcdFxyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGxldCBzaGFwZSA9IHByb3BzLmljb24gPz8gc3Rhcl9pY29uO1xyXG5cdFx0bGV0IHZhbHVlID0gcHJvcHMudmFsdWUgPz8gMDtcclxuXHJcblx0XHR0aGlzLm1faW5wdXQgPSBuZXcgSW5wdXQoIHtcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCIsXHJcblx0XHRcdGhpZGRlbjogdHJ1ZSxcclxuXHRcdFx0bmFtZTogcHJvcHMubmFtZSxcclxuXHRcdFx0dmFsdWU6ICcnK3ZhbHVlXHJcblx0XHR9ICk7XHJcblxyXG5cdFx0dGhpcy5hZGRET01FdmVudCggJ2NsaWNrJywgKGUpID0+IHRoaXMuX29uX2NsaWNrKGUpICk7XHJcblxyXG5cdFx0dGhpcy5tX2VscyA9IFtdO1xyXG5cdFx0Zm9yKCBsZXQgaT0wOyBpPHByb3BzLnN0ZXBzOyBpKysgKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgY2xzID0gJ2l0ZW0nO1xyXG5cdFx0XHRpZiggaSsxIDw9IHZhbHVlICkge1xyXG5cdFx0XHRcdGNscyArPSAnIGNoZWNrZWQnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgYyA9IG5ldyBJY29uKCB7IFxyXG5cdFx0XHRcdGNscyxcclxuXHRcdFx0XHRpY29uSWQ6IHNoYXBlLFxyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRjLnNldEludGVybmFsRGF0YSggXCJ2YWx1ZVwiLCBpICk7XHJcblxyXG5cdFx0XHR0aGlzLm1fZWxzLnB1c2goIGMgKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1fZWxzLnB1c2goIHRoaXMubV9pbnB1dCApO1xyXG5cdFx0dGhpcy5zZXRDb250ZW50KCB0aGlzLm1fZWxzICk7XHJcblx0fVxyXG5cclxuXHRnZXRWYWx1ZSggKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy52YWx1ZSA/PyAwO1xyXG5cdH1cclxuXHJcblx0c2V0VmFsdWUoIHY6IG51bWJlciApIHtcclxuXHRcdHRoaXMucHJvcHMudmFsdWUgPSB2O1xyXG5cclxuXHRcdGZvciggbGV0IGM9MDsgYzx0aGlzLnByb3BzLnN0ZXBzOyBjKysgKSB7XHJcblx0XHRcdHRoaXMubV9lbHNbY10uc2V0Q2xhc3MoICdjaGVja2VkJywgdGhpcy5tX2Vsc1tjXS5nZXRJbnRlcm5hbERhdGEoJ3ZhbHVlJyk8PXYgKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1faW5wdXQuc2V0VmFsdWUoICcnK3RoaXMucHJvcHMudmFsdWUgKTtcclxuXHR9XHJcblxyXG5cdHNldFN0ZXBzKCBuOiBudW1iZXIgKSB7XHJcblx0XHR0aGlzLnByb3BzLnN0ZXBzID0gbjtcclxuXHRcdHRoaXMuX3VwZGF0ZSggKTtcclxuXHR9XHJcblxyXG5cdHNldFNoYXBlKCBpY29uOiBzdHJpbmcgKSB7XHJcblx0XHR0aGlzLnJlbW92ZUNsYXNzKCB0aGlzLnByb3BzLmljb24gKTtcclxuXHRcdHRoaXMucHJvcHMuaWNvbiA9IGljb247XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbl9jbGljayggZXY6IE1vdXNlRXZlbnQgKSB7XHJcblx0XHRsZXQgaXRlbSA9IGNvbXBvbmVudEZyb21ET00oIGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudCApO1xyXG5cdFx0aXRlbSA9IGl0ZW0ucGFyZW50RWxlbWVudCggSWNvbiApO1xyXG5cdFx0XHJcblx0XHRpZiggaXRlbSApIHtcclxuXHRcdFx0dGhpcy5zZXRWYWx1ZSggaXRlbS5nZXRJbnRlcm5hbERhdGEoXCJ2YWx1ZVwiKSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZmlyZSggJ2NoYW5nZScsIHt2YWx1ZTp0aGlzLnByb3BzLnZhbHVlfSApO1xyXG5cdH0gXHJcbn1cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIHNsaWRlci50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIENvbXBvbmVudEV2ZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBSZWN0IH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcclxuXHJcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcyc7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQuanMnO1xyXG5cclxuaW1wb3J0ICcuL3NsaWRlci5tb2R1bGUuc2Nzcyc7XHJcblxyXG5pbnRlcmZhY2UgQ2hhbmdlRXZlbnQgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XHJcblx0dmFsdWU6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNsaWRlckV2ZW50cyBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XHJcblx0Y2hhbmdlOiBDaGFuZ2VFdmVudDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNsaWRlclByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xyXG5cdHZhbHVlOiBudW1iZXI7XHJcblx0bWluOiBudW1iZXI7XHJcblx0bWF4OiBudW1iZXI7XHJcblx0c3RlcD86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNsaWRlciBleHRlbmRzIENvbXBvbmVudDxTbGlkZXJQcm9wcyxTbGlkZXJFdmVudHM+IHtcclxuXHJcblx0cHJpdmF0ZSBfbWRvd24gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9pcmVjdDogUmVjdCA9IG51bGw7XHJcblx0cHJpdmF0ZSBfdGh1bWI6IENvbXBvbmVudCA9IG51bGw7XHJcblx0cHJpdmF0ZSBfYmFyOiBDb21wb25lbnQgPSBudWxsO1xyXG5cdHByaXZhdGUgX3JhbmdlOiBJbnB1dCA9IG51bGw7XHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFNsaWRlclByb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXHJcblx0XHRcdG5ldyBIQm94KCB7IGNsczogXCJ0cmFja1wiLCBjb250ZW50OiBbXHJcblx0XHRcdFx0dGhpcy5fYmFyID0gbmV3IENvbXBvbmVudCggeyBjbHM6IFwiYmFyXCIgfSApLFxyXG5cdFx0XHRcdHRoaXMuX3RodW1iID0gbmV3IENvbXBvbmVudCggeyBjbHM6IFwidGh1bWJcIiB9ICksXHJcblx0XHRcdF0gfSksXHJcblx0XHRcdHRoaXMuX3JhbmdlID0gbmV3IElucHV0KCB7IHR5cGU6IFwicmFuZ2VcIiwgaGlkZGVuOiB0cnVlLCB2YWx1ZTogcHJvcHMudmFsdWUsIG1pbjogcHJvcHMubWluLCBtYXg6IHByb3BzLm1heCwgc3RlcDogcHJvcHMuc3RlcCB9IClcclxuXHRcdF0pO1xyXG5cclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInRhYmluZGV4XCIsIDAgKTtcclxuXHJcblx0XHR0aGlzLnNldERPTUV2ZW50cygge1xyXG5cdFx0XHRwb2ludGVyZG93bjogKCBldiApID0+IHRoaXMuX29uX21vdXNlZG93biggZXYgKSxcclxuXHRcdFx0cG9pbnRlcm1vdmU6ICggZXYgKSA9PiB0aGlzLl9vbl9tb3VzZW1vdmUoIGV2ICksXHJcblx0XHRcdHBvaW50ZXJ1cDogKCBldiApID0+IHRoaXMuX29uX21vdXNldXAoIGV2ICksXHJcblx0XHRcdGtleWRvd246ICggZXYgKSA9PiB0aGlzLl9vbl9rZXkoIGV2ICksXHJcblx0XHR9ICk7XHJcblxyXG5cdFx0dGhpcy5fcmFuZ2UuYWRkRE9NRXZlbnQoIFwiY2hhbmdlXCIsICggZXY6IEV2ZW50KSA9PiB7XHJcblx0XHRcdC8vY29uc29sZS5sb2coIGV2ICk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25fbW91c2Vkb3duKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCApO1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoICk7XHJcblxyXG5cdFx0dGhpcy5mb2N1cyggKTtcclxuXHJcblx0XHR0aGlzLl9tZG93biA9IHRydWU7XHJcblx0XHR0aGlzLl9pcmVjdCA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCApO1xyXG5cclxuXHRcdHRoaXMuc2V0Q2FwdHVyZSggZXYucG9pbnRlcklkICk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbl9tb3VzZW1vdmUoIGV2OiBQb2ludGVyRXZlbnQgKSB7XHJcblx0XHRpZiggdGhpcy5fbWRvd24gKSB7XHJcblx0XHRcdGxldCBwb3MgPSBldi5wYWdlWCAtIHRoaXMuX2lyZWN0LmxlZnQ7XHJcblx0XHRcdGlmKCBwb3M8MCApIHtcclxuXHRcdFx0XHRwb3MgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYoIHBvcz50aGlzLl9pcmVjdC53aWR0aCApIHtcclxuXHRcdFx0XHRwb3MgPSB0aGlzLl9pcmVjdC53aWR0aDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHBlcmMgPSBwb3MgLyB0aGlzLl9pcmVjdC53aWR0aCAqIDEwMDtcclxuXHRcdFx0dGhpcy5fcmFuZ2Uuc2V0TnVtVmFsdWUoIHBlcmMgKTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuX3VwZGF0ZSggKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3VwZGF0ZSggKSB7XHJcblx0XHRjb25zdCB2YWx1ZSA9IHRoaXMuX3JhbmdlLmdldE51bVZhbHVlKCApO1xyXG5cclxuXHRcdGNvbnN0IHBlcmMgPSB2YWx1ZSAvICh0aGlzLnByb3BzLm1heC10aGlzLnByb3BzLm1pbikgKiAxMDA7XHJcblx0XHR0aGlzLl90aHVtYi5zZXRTdHlsZVZhbHVlKCBcImxlZnRcIiwgcGVyYytcIiVcIiApO1xyXG5cdFx0dGhpcy5fYmFyLnNldFN0eWxlVmFsdWUoIFwid2lkdGhcIiwgcGVyYytcIiVcIiApO1xyXG5cdFx0Ly90aHVtYi5zZXRBdHRyaWJ1dGUoIFwidG9vbHRpcFwiLCB2YWx1ZSApO1xyXG5cclxuXHRcdHRoaXMuZmlyZSggXCJjaGFuZ2VcIiwgeyB2YWx1ZSB9ICk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbl9tb3VzZXVwKCBldjogUG9pbnRlckV2ZW50ICkge1xyXG5cdFx0aWYoIHRoaXMuX21kb3duICkge1xyXG5cdFx0XHR0aGlzLnJlbGVhc2VDYXB0dXJlKCBldi5wb2ludGVySWQgKTtcclxuXHRcdFx0dGhpcy5fbWRvd24gPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uX2tleSggZXY6IEtleWJvYXJkRXZlbnQgKSB7XHJcblx0XHRjb25zb2xlLmxvZyggZXYua2V5ICk7XHJcblxyXG5cdFx0bGV0IHN0cCA9IHRoaXMucHJvcHMuc3RlcCA/PyAxO1xyXG5cdFx0bGV0IGluYyA9IDA7XHJcblx0XHRzd2l0Y2goIGV2LmtleSApIHtcclxuXHRcdFx0Y2FzZSBcIkFycm93UmlnaHRcIjpcclxuXHRcdFx0Y2FzZSBcIkFycm93VXBcIjogaW5jID0gc3RwOyBicmVhaztcclxuXHJcblx0XHRcdGNhc2UgXCJBcnJvd0xlZnRcIjpcclxuXHRcdFx0Y2FzZSBcIkFycm93RG93blwiOiBpbmMgPSAtc3RwOyBicmVhaztcclxuXHRcdH1cclxuXHJcblx0XHRpZiggaW5jICkge1xyXG5cdFx0XHRpZiggZXYuY3RybEtleSApIHtcclxuXHRcdFx0XHRpbmMgKj0gMTA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX3JhbmdlLnNldE51bVZhbHVlKCB0aGlzLl9yYW5nZS5nZXROdW1WYWx1ZSgpK2luYyApO1xyXG5cdFx0XHR0aGlzLl91cGRhdGUoICk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIHN3aXRjaC50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFByb3BzLCBtYWtlVW5pcXVlQ29tcG9uZW50SWQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XHJcblxyXG4vL2ltcG9ydCB7IENoZWNrYm94IH0gZnJvbSAnQGNvbnRyb2xzL2NvbnRyb2xzLmpzJztcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuLi9pbnB1dC9pbnB1dCc7XHJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xyXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMuanMnO1xyXG5cclxuaW1wb3J0IFwiLi9zd2l0Y2gubW9kdWxlLnNjc3NcIjtcclxuXHJcbmludGVyZmFjZSBTd2l0Y2hQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcclxuXHRsYWJlbDogc3RyaW5nO1xyXG5cdGNoZWNrZWQ/OiBib29sZWFuO1xyXG5cdHZhbHVlPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3dpdGNoIGV4dGVuZHMgSEJveDxTd2l0Y2hQcm9wcz4ge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzOiBTd2l0Y2hQcm9wcyApIHtcclxuXHRcdHN1cGVyKCBwcm9wcyApO1xyXG5cclxuXHRcdGNvbnN0IGlucHV0SWQgPSBtYWtlVW5pcXVlQ29tcG9uZW50SWQoICk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXHJcblx0XHRcdG5ldyBDb21wb25lbnQoIHtcclxuXHRcdFx0XHRjbHM6IFwic3dpdGNoXCIsXHJcblx0XHRcdFx0Y29udGVudDogW1xyXG5cdFx0XHRcdFx0bmV3IElucHV0KCB7IHR5cGU6IFwiY2hlY2tib3hcIiwgaWQ6IGlucHV0SWQsIGNoZWNrZWQ6IHByb3BzLmNoZWNrZWQgfSApLFxyXG5cdFx0XHRcdFx0bmV3IENvbXBvbmVudCggeyBjbHM6IFwidHJhY2tcIiB9ICksXHJcblx0XHRcdFx0XHRuZXcgQ29tcG9uZW50KCB7IGNsczogXCJ0aHVtYlwiIH0gKSxcclxuXHRcdFx0XHRdXHJcblx0IFx0XHR9ICksXHJcblx0XHRcdG5ldyBMYWJlbCgge1xyXG5cdFx0XHRcdHRhZzogXCJsYWJlbFwiLFxyXG5cdFx0XHRcdHRleHQ6IHByb3BzLmxhYmVsLFxyXG5cdFx0XHRcdGxhYmVsRm9yOiBpbnB1dElkLFxyXG5cdFx0XHR9KSxcclxuXHRcdF0pXHJcblxyXG5cdFx0XHJcblx0fVxyXG59IiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIHRhYnMudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIEV2Q2xpY2sgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvcmVFdmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV9ldmVudHMnO1xyXG5cclxuaW1wb3J0IHsgQnV0dG9uLCBCdXR0b25Qcm9wcyB9IGZyb20gJy4uL2J1dHRvbi9idXR0b24nO1xyXG5pbXBvcnQgeyBIQm94LCBWQm94LCBTdGFja0JveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcclxuXHJcbmltcG9ydCBcIi4vdGFicy5tb2R1bGUuc2Nzc1wiXHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGFiSXRlbSB7XHJcblx0bmFtZTogc3RyaW5nO1xyXG5cdHRpdGxlOiBzdHJpbmc7XHJcblx0aWNvbj86IHN0cmluZztcclxuXHR0YWI6IENvbXBvbmVudDtcclxufVxyXG5cclxuXHJcbmNsYXNzIENUYWIgZXh0ZW5kcyBCdXR0b24ge1xyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogQnV0dG9uUHJvcHMsIGl0ZW06IFRhYkl0ZW0gKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHR0aGlzLmFkZENsYXNzKCBcIm91dGxpbmVcIiApO1xyXG5cdFx0dGhpcy5zZXRJY29uKCBpdGVtLmljb24gKTtcclxuXHRcdHRoaXMuc2V0VGV4dCggaXRlbS50aXRsZSApO1xyXG5cdFx0dGhpcy5zZXREYXRhKCBcInRhYm5hbWVcIiwgaXRlbS5uYW1lICk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIFRhYmxpc3RDbGlja0V2ZW50IGV4dGVuZHMgQ29yZUV2ZW50IHtcclxuXHRuYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBUYWJsaXN0UHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0Y2xpY2s6ICggZXY6IFRhYmxpc3RDbGlja0V2ZW50ICkgPT4gdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRhYmxpc3RFdmVudHMgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xyXG5cdGNsaWNrOiBUYWJsaXN0Q2xpY2tFdmVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIGJhciBjb250YWluaW5nIGJ1dHRvbnNcclxuICovXHJcbmNsYXNzIENUYWJMaXN0IGV4dGVuZHMgSEJveDxUYWJsaXN0UHJvcHMsVGFibGlzdEV2ZW50cz4ge1xyXG5cclxuXHRwcml2YXRlIF9zZWxpdGVtOiBCdXR0b247XHJcblx0cHJpdmF0ZSBfc2VsZWN0aW9uOiBzdHJpbmc7XHJcblx0XHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBUYWJsaXN0UHJvcHMsIGNvbnRlbnQ6IFRhYkl0ZW1bXSApIHtcclxuXHRcdHN1cGVyKCBwcm9wcyApO1xyXG5cclxuXHRcdGNvbnN0IHRhYnMgPSBjb250ZW50Lm1hcCggdGFiID0+IHtcclxuXHRcdFx0cmV0dXJuIG5ldyBDVGFiKCB7XHJcblx0XHRcdFx0Y2xpY2s6ICggZXYgKSA9PiB0aGlzLl9vbl9jbGljayggZXYgKSxcclxuXHRcdFx0fSwgdGFiICk7XHJcblx0XHR9KVxyXG5cclxuXHRcdHRoaXMubWFwUHJvcEV2ZW50cyggcHJvcHMsIFwiY2xpY2tcIiApO1xyXG5cdFx0dGhpcy5zZXRDb250ZW50KCB0YWJzICk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbl9jbGljayggZXY6IEV2Q2xpY2sgKSB7XHJcblx0XHRjb25zdCBuYW1lID0gKGV2LnNvdXJjZSBhcyBDb21wb25lbnQpLmdldERhdGEoIFwidGFibmFtZVwiICk7XHJcblx0XHR0aGlzLmZpcmUoIFwiY2xpY2tcIiwge25hbWV9ICk7XHJcblx0fVxyXG5cclxuXHRzZWxlY3QoIG5hbWU6IHN0cmluZyApIHtcclxuXHRcdGNvbnN0IHRhYiA9IHRoaXMucXVlcnk8QnV0dG9uPiggYFtkYXRhLXRhYm5hbWU9XCIke25hbWV9XCJdYCApO1xyXG5cdFx0aWYoIHRoaXMuX3NlbGl0ZW0gKSB7XHJcblx0XHRcdHRoaXMuX3NlbGl0ZW0uc2V0Q2xhc3MoIFwic2VsZWN0ZWRcIiwgZmFsc2UgKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9zZWxpdGVtID0gdGFiO1xyXG5cdFx0dGhpcy5fc2VsZWN0aW9uID0gbmFtZTtcclxuXHRcdFxyXG5cdFx0aWYoIHRoaXMuX3NlbGl0ZW0gKSB7XHJcblx0XHRcdHRoaXMuX3NlbGl0ZW0uc2V0Q2xhc3MoIFwic2VsZWN0ZWRcIiwgdHJ1ZSApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5pbnRlcmZhY2UgVGFic1Byb3BzIGV4dGVuZHMgT21pdDxDb21wb25lbnRQcm9wcyxcImNvbnRlbnRcIj4ge1xyXG5cdGRlZmF1bHQ6IHN0cmluZztcclxuXHRpdGVtczogVGFiSXRlbVtdXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVGFicyBleHRlbmRzIFZCb3g8VGFic1Byb3BzPiB7XHJcblxyXG5cdHByaXZhdGUgX2xpc3Q6IENUYWJMaXN0O1xyXG5cdHByaXZhdGUgX3N0YWNrOiBTdGFja0JveDtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBUYWJzUHJvcHMgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHRjb25zdCBwYWdlcyA9IHByb3BzLml0ZW1zPy5tYXAoIHggPT4ge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG5hbWU6IHgubmFtZSxcclxuXHRcdFx0XHRjb250ZW50OiB4LnRhYiAsXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0dGhpcy5fbGlzdCA9IG5ldyBDVGFiTGlzdCggeyBcclxuXHRcdFx0XHRjbGljazogKCBldiApID0+IHRoaXMuX29uY2xpY2soIGV2ICkgfSwgXHJcblx0XHRcdFx0cHJvcHMuaXRlbXMgXHJcblx0XHRcdCksXHJcblx0XHRcdHRoaXMuX3N0YWNrID0gbmV3IFN0YWNrQm94KCB7IFxyXG5cdFx0XHRcdGNsczogXCJib2R5IHg0ZmxleFwiLCBcclxuXHRcdFx0XHRkZWZhdWx0OiBwcm9wcy5kZWZhdWx0LFxyXG5cdFx0XHRcdGl0ZW1zOiBwYWdlcywgIFxyXG5cdFx0XHR9ICksXHJcblx0XHRdKTtcclxuXHJcblx0XHRpZiggcHJvcHMuZGVmYXVsdCApIHtcclxuXHRcdFx0dGhpcy5zZWxlY3RUYWIoIHByb3BzLmRlZmF1bHQgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNlbGVjdFRhYiggbmFtZTogc3RyaW5nICkge1xyXG5cdFx0dGhpcy5fbGlzdC5zZWxlY3QoIG5hbWUgKTtcclxuXHRcdHRoaXMuX3N0YWNrLnNlbGVjdCggbmFtZSApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25jbGljayggZXY6IFRhYmxpc3RDbGlja0V2ZW50ICkge1xyXG5cdFx0dGhpcy5zZWxlY3RUYWIoIGV2Lm5hbWUgKTtcclxuXHR9XHJcbn1cclxuXHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSB0ZXh0YXJlYS50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBCYXNlUHJvcHMgfSBmcm9tICcuLi9pbnB1dC9pbnB1dCc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xyXG5pbXBvcnQgeyBWQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xyXG5cclxuaW1wb3J0IFwiLi90ZXh0YXJlYS5tb2R1bGUuc2Nzc1wiO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmludGVyZmFjZSBUZXh0QXJlYVByb3BzIGV4dGVuZHMgQmFzZVByb3BzIHtcclxuXHRsYWJlbD86IHN0cmluZztcclxuXHR2YWx1ZT86IHN0cmluZztcclxuXHRyZXNpemU/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dEFyZWEgZXh0ZW5kcyBWQm94IHtcclxuXHRcclxuXHRwcml2YXRlIF9pbnB1dDogQ29tcG9uZW50O1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFRleHRBcmVhUHJvcHMgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0bmV3IExhYmVsKCB7IHRleHQ6IHByb3BzLmxhYmVsIH0pLFxyXG5cdFx0XHR0aGlzLl9pbnB1dCA9IG5ldyBDb21wb25lbnQoIHsgdGFnOiBcInRleHRhcmVhXCIgfSlcclxuXHRcdF0pXHJcblxyXG5cdFx0dGhpcy5faW5wdXQuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgcHJvcHMubmFtZSApO1xyXG5cdFx0dGhpcy5faW5wdXQuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIHByb3BzLnZhbHVlKycnICk7XHJcblxyXG5cdFx0aWYoICFwcm9wcy5yZXNpemUgKSB7XHJcblx0XHRcdHRoaXMuX2lucHV0LnNldEF0dHJpYnV0ZSggXCJyZXNpemVcIiwgZmFsc2UgKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwgIi8qKiBcclxuICogIF9fXyAgX19fIF9fXHJcbiAqICBcXCAgXFwvICAvICAvIF9cclxuICogICBcXCAgICAvICAvX3wgfF9cclxuICogICAvICAgIFxcX19fXyAgIF98ICBcclxuICogIC9fXy9cXF9fXFwgICB8X3xcclxuICogXHJcbiAqIEBmaWxlIHRleHRlZGl0LnRzXHJcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxyXG4gKiBcclxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXHJcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXHJcbiAqKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50UHJvcHMsIG1ha2VVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcclxuaW1wb3J0IHsgVW5zYWZlSHRtbCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scyc7XHJcblxyXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xyXG5pbXBvcnQgeyBJbnB1dCwgVGV4dElucHV0UHJvcHMgfSBmcm9tIFwiLi4vaW5wdXQvaW5wdXRcIlxyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsJztcclxuXHJcbmltcG9ydCBcIi4vdGV4dGVkaXQubW9kdWxlLnNjc3NcIjtcclxuXHJcbi8vQHRvZG86IGRpc2FibGVkXHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIFRleHRFZGl0UHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XHJcblx0bGFiZWw6IHN0cmluZyB8IFVuc2FmZUh0bWw7XHJcblx0bGFiZWxXaWR0aD86IG51bWJlcjtcclxuXHRpbnB1dElkPzogc3RyaW5nO1xyXG5cclxuXHR0eXBlPzogXCJ0ZXh0XCIgfCBcImVtYWlsXCIgfCBcInBhc3N3b3JkXCI7XHJcblx0cmVhZG9ubHk/OiBib29sZWFuO1xyXG5cdHJlcXVpcmVkPzogYm9vbGVhbjtcclxuXHR2YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xyXG5cdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG5cclxuXHRpbnB1dEdhZGdldHM/OiBDb21wb25lbnRbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0RWRpdCBleHRlbmRzIEhCb3gge1xyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogVGV4dEVkaXRQcm9wcyApIHtcclxuXHRcdHN1cGVyKCBwcm9wcyApO1xyXG5cclxuXHRcdGlmKCAhcHJvcHMuaW5wdXRJZCApIHtcclxuXHRcdFx0cHJvcHMuaW5wdXRJZCA9IG1ha2VVbmlxdWVDb21wb25lbnRJZCgpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIHByb3BzLnJlcXVpcmVkICkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJyZXF1aXJlZFwiLCB0cnVlICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZ2FkZ2V0cyA9IHByb3BzLmlucHV0R2FkZ2V0cyA/PyBbXTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFtcclxuXHRcdFx0bmV3IEhCb3goIHsgaWQ6IFwibGFiZWxcIiwgd2lkdGg6IHByb3BzLmxhYmVsV2lkdGgsIGNvbnRlbnQ6IFtcclxuXHRcdFx0XHRuZXcgTGFiZWwoIHsgdGFnOiBcImxhYmVsXCIsIHRleHQ6IHByb3BzLmxhYmVsLCBsYWJlbEZvcjogcHJvcHMuaW5wdXRJZCB9ICksXHJcblx0XHRcdF19KSxcclxuXHRcdFx0bmV3IEhCb3goIHsgaWQ6IFwiZWRpdFwiLCBjb250ZW50OiBbXHJcblx0XHRcdFx0bmV3IElucHV0KCB7IFxyXG5cdFx0XHRcdFx0dHlwZTogcHJvcHMudHlwZSA/PyBcInRleHRcIiwgXHJcblx0XHRcdFx0XHRyZWFkb25seTogcHJvcHMucmVhZG9ubHksIFxyXG5cdFx0XHRcdFx0dmFsdWU6IHByb3BzLnZhbHVlLCBcclxuXHRcdFx0XHRcdGlkOiBwcm9wcy5pbnB1dElkLCBcclxuXHRcdFx0XHRcdHJlcXVpcmVkOiBwcm9wcy5yZXF1aXJlZCwgXHJcblx0XHRcdFx0XHRkaXNhYmxlZDogcHJvcHMuZGlzYWJsZWQsIFxyXG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI6IHByb3BzLnBsYWNlaG9sZGVyIFxyXG5cdFx0XHRcdH0gKSxcclxuXHRcdFx0XHQuLi5nYWRnZXRzLFxyXG5cdFx0XHRdfSlcclxuXHRcdF0pXHJcblx0fVxyXG59XHJcbiIsICIvKiogXHJcbiAqICBfX18gIF9fXyBfX1xyXG4gKiAgXFwgIFxcLyAgLyAgLyBfXHJcbiAqICAgXFwgICAgLyAgL198IHxfXHJcbiAqICAgLyAgICBcXF9fX18gICBffCAgXHJcbiAqICAvX18vXFxfX1xcICAgfF98XHJcbiAqIFxyXG4gKiBAZmlsZSB0b29sdGlwcy50c1xyXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcclxuICogXHJcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxyXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxyXG4gKiovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIHdyYXBET00gfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBvaW50LCBSZWN0LCBUaW1lciwgVW5zYWZlSHRtbCwgdW5zYWZlSHRtbCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scyc7XHJcblxyXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xyXG5pbXBvcnQgeyBQb3B1cCwgUG9wdXBQcm9wcyB9IGZyb20gJy4uL3BvcHVwL3BvcHVwLmpzJztcclxuaW1wb3J0IHsgSWNvbiB9IGZyb20gJy4uL2ljb24vaWNvbi5qcyc7XHJcblxyXG5pbXBvcnQgXCIuL3Rvb2x0aXBzLnNjc3NcIlxyXG5cclxuaW1wb3J0IGljb24gZnJvbSBcIi4vY2lyY2xlLWluZm8tc2hhcnAtbGlnaHQuc3ZnXCJcclxuXHJcblxyXG5sZXQgbGFzdF9oaXQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxubGV0IHRvb2x0aXA6IFRvb2x0aXAgPSBudWxsO1xyXG5cclxuY29uc3QgdGltZXIgPSBuZXcgVGltZXIoICk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdFRvb2x0aXBzKCApIHtcclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZWVudGVyXCIsICggZXY6IE1vdXNlRXZlbnQgKSA9PiB7XHJcblx0XHRpZiggZXYudGFyZ2V0PT09ZG9jdW1lbnQgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Y29uc3QgYyA9IHdyYXBET00oIGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudCApO1xyXG5cdFx0Y29uc3QgdHQgPSBjLmdldEF0dHJpYnV0ZSggXCJ0b29sdGlwXCIgKTtcclxuXHRcdGlmKCB0dCApIHtcclxuXHRcdFx0bGFzdF9oaXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRcdGNvbnN0IHJjID0gYy5nZXRCb3VuZGluZ1JlY3QoICk7XHJcblx0XHRcdHNob3dUVCggdHQsIHJjLCB7IHg6ZXYucGFnZVgseTpldi5wYWdlWSB9ICk7XHJcblx0XHR9XHJcblxyXG5cdH0sIHRydWUgKTtcclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZWxlYXZlXCIsICggZXY6IEV2ZW50ICkgPT4ge1xyXG5cdFx0Ly9jb25zb2xlLmxvZyggXCJsZWF2ZVwiLCBldi50YXJnZXQgKTtcclxuXHJcblx0XHRpZiggbGFzdF9oaXQgJiYgZXYudGFyZ2V0PT1sYXN0X2hpdCApIHtcclxuXHRcdFx0bGFzdF9oaXQgPSBudWxsO1xyXG5cdFx0XHRjbG9zZVRUKCApO1xyXG5cdFx0fVxyXG5cclxuXHR9LCB0cnVlICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dUVCggdGV4dDogc3RyaW5nLCByYzogUmVjdCwgcHQ6IFBvaW50ICkge1xyXG5cdGlmKCAhdG9vbHRpcCApIHtcclxuXHRcdHRvb2x0aXAgPSBuZXcgVG9vbHRpcCggeyB9ICk7XHJcblx0fVxyXG5cclxuXHR0aW1lci5zZXRUaW1lb3V0KCBudWxsLCAzMDAsICggKSA9PiB7XHJcblx0XHR0b29sdGlwLnNldFRleHQoIHVuc2FmZUh0bWwodGV4dCkgKTtcclxuXHRcdC8vdG9vbHRpcC5kaXNwbGF5TmVhciggcmMsIFwidG9wIGxlZnRcIiwgXCJib3R0b20gbGVmdFwiLCB7eDowLHk6NH0gKTtcclxuXHRcdHRvb2x0aXAuZGlzcGxheUF0KCBwdC54LCBwdC55ICk7XHJcblx0fSApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZVRUKCApIHtcclxuXHR0b29sdGlwLnNob3coIGZhbHNlICk7XHJcblx0dGltZXIuY2xlYXJUaW1lb3V0KCBudWxsICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5jbGFzcyBUb29sdGlwIGV4dGVuZHMgUG9wdXAge1xyXG5cclxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFBvcHVwUHJvcHMgKSB7XHJcblx0XHRzdXBlciggcHJvcHMgKTtcclxuXHJcblx0XHR0aGlzLnNldENvbnRlbnQoIFxyXG5cdFx0XHRuZXcgSEJveCgge2NvbnRlbnQ6IFtcclxuXHRcdFx0XHRuZXcgSWNvbiggeyBpY29uSWQ6IGljb24gfSApLFxyXG5cdFx0XHRcdG5ldyBDb21wb25lbnQoIHsgaWQ6IFwidGV4dFwiIH0gKVxyXG5cdFx0XHRdfSApXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdHNldFRleHQoIHRleHQ6IHN0cmluZ3xVbnNhZmVIdG1sIClcdHtcclxuXHRcdHRoaXMucXVlcnkoIFwiI3RleHRcIiApLnNldENvbnRlbnQoIHRleHQgKTtcclxuXHR9XHJcbn0iLCAiLyoqIFxyXG4gKiAgX19fICBfX18gX19cclxuICogIFxcICBcXC8gIC8gIC8gX1xyXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xyXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxyXG4gKiAgL19fL1xcX19cXCAgIHxffFxyXG4gKiBcclxuICogQGZpbGUgdHJlZXZpZXcudHNcclxuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXHJcbiAqIFxyXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcclxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cclxuICoqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudCwgQ29tcG9uZW50RXZlbnRzLCBDb21wb25lbnRQcm9wcywgY29tcG9uZW50RnJvbURPTSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xyXG5pbXBvcnQgeyBMaXN0Ym94SUQsIExpc3RJdGVtLCBrYk5hdiB9IGZyb20gJy4uL2xpc3Rib3gvbGlzdGJveCc7XHJcbmltcG9ydCB7IEJveCwgQm94UHJvcHMsIEhCb3gsIFZCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcyc7XHJcbmltcG9ydCB7IEljb24gfSBmcm9tICcuLi9pY29uL2ljb24uanMnO1xyXG5cclxuaW1wb3J0IFwiLi90cmVldmlldy5tb2R1bGUuc2Nzc1wiO1xyXG5pbXBvcnQgZm9sZGVyX2ljb24gZnJvbSBcIi4vY2hldnJvbi1kb3duLWxpZ2h0LnN2Z1wiXHJcblxyXG4vL2ltcG9ydCBmb2xkZXJfY2xvc2VkIGZyb20gXCIuL2ZvbGRlci1taW51cy1saWdodC5zdmdcIlxyXG5cclxuZXhwb3J0IGVudW0ga2JUcmVlTmF2IHtcclxuXHRmaXJzdCxcclxuXHRwcmV2LFxyXG5cdG5leHQsXHJcblx0bGFzdCxcclxuXHRcclxuXHRwYXJlbnQsXHJcblx0Y2hpbGQsXHJcblxyXG5cdGV4cGFuZCxcclxuXHRjb2xsYXBzZSxcclxuXHR0b2dnbGUsXHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRyZWVJdGVtIGV4dGVuZHMgTGlzdEl0ZW0ge1xyXG5cdGNoaWxkcmVuPzogVHJlZUl0ZW1bXTtcclxuXHRvcGVuPzogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRyZWV2aWV3UHJvcHMgZXh0ZW5kcyBPbWl0PENvbXBvbmVudFByb3BzLFwiY29udGVudFwiPiB7XHJcblx0aXRlbXM6IFRyZWVJdGVtW107XHJcbn1cclxuXHJcbmludGVyZmFjZSBDaGFuZ2VFdmVudCBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcclxuXHRzZWxlY3Rpb246IFRyZWVJdGVtO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVHJlZXZpZXdFdmVudHMgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xyXG5cdGNoYW5nZTogQ2hhbmdlRXZlbnQ7XHJcbn1cclxuXHJcbmNsYXNzIENUcmVlVmlld0l0ZW0gZXh0ZW5kcyBCb3gge1xyXG5cclxuXHRwcml2YXRlIF9pdGVtOiBUcmVlSXRlbTtcclxuXHRwcml2YXRlIF9sYWJlbDogQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX2ljb246IEljb247XHJcblx0cHJpdmF0ZSBfY2hpbGRzOiBDb21wb25lbnQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogQm94UHJvcHMsIGl0ZW06IFRyZWVJdGVtICkge1xyXG5cdFx0c3VwZXIoIHsgLi4ucHJvcHMgfSApO1xyXG5cclxuXHRcdHRoaXMuX2l0ZW0gPSBpdGVtO1xyXG5cclxuXHRcdGlmKCBpdGVtICkge1xyXG5cdFx0XHR0aGlzLl9sYWJlbCA9IG5ldyBIQm94KCB7Y2xzOlwibGFiZWwgaXRlbVwiLCBjb250ZW50OiBbXHJcblx0XHRcdFx0dGhpcy5faWNvbiA9IG5ldyBJY29uKCB7IGljb25JZDogaXRlbS5jaGlsZHJlbj8gZm9sZGVyX2ljb24gOiBpdGVtLmljb25JZCB9ICksXHJcblx0XHRcdFx0bmV3IExhYmVsKCB7IHRhZzogXCJzcGFuXCIsIGNsczogXCJcIiwgdGV4dDogaXRlbS50ZXh0IH0gKSxcclxuXHRcdFx0XX0pO1xyXG5cclxuXHRcdFx0dGhpcy5fbGFiZWwuc2V0RGF0YSggXCJpZFwiLCBpdGVtLmlkK1wiXCIgKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0aWYoIGl0ZW0uY2hpbGRyZW4gKSB7XHJcblx0XHRcdFx0dGhpcy4gX2NoaWxkcyA9IG5ldyBWQm94KCB7IGNsczogXCJib2R5XCIgfSApO1xyXG5cclxuXHRcdFx0XHRpZiggaXRlbS5vcGVuPT09dW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdFx0aXRlbS5vcGVuID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmFkZENsYXNzKCBcImZvbGRlclwiIClcclxuXHRcdFx0XHR0aGlzLnNldENsYXNzKCBcIm9wZW5cIiwgaXRlbS5vcGVuICk7XHJcblx0XHRcdFx0dGhpcy5zZXRJdGVtcyggaXRlbS5jaGlsZHJlbiApO1xyXG5cclxuXHRcdFx0XHR0aGlzLl9pY29uLmFkZERPTUV2ZW50KCBcImNsaWNrXCIsICggZXYgKT0+dGhpcy50b2dnbGUoZXYpICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLiBfY2hpbGRzID0gbmV3IFZCb3goIHsgY2xzOiBcImJvZHlcIiB9ICk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xyXG5cdFx0XHR0aGlzLl9sYWJlbCxcclxuXHRcdFx0dGhpcy5fY2hpbGRzLFxyXG5cdFx0XSApO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlKCBldj86IFVJRXZlbnQgKSB7XHJcblx0XHRcclxuXHRcdGNvbnN0IGlzT3BlbiA9IHRoaXMuaGFzQ2xhc3MoXCJvcGVuXCIpO1xyXG5cdFx0dGhpcy5vcGVuKCAhaXNPcGVuICk7XHJcblxyXG5cdFx0aWYoIGV2ICkge1xyXG5cdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvcGVuKCBvcGVuID0gdHJ1ZSApIHtcclxuXHRcdHRoaXMuc2V0Q2xhc3MoIFwib3BlblwiLCBvcGVuICk7XHJcblx0XHR0aGlzLl9pdGVtLm9wZW4gPSBvcGVuO1xyXG5cdH1cclxuXHJcblx0c2V0SXRlbXMoIGl0ZW1zOiBUcmVlSXRlbVsgXSApIHtcclxuXHRcdGlmKCBpdGVtcyApIHtcclxuXHRcdFx0Y29uc3QgY2hpbGRzID0gaXRlbXMubWFwKCBpdG0gPT4ge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgQ1RyZWVWaWV3SXRlbSgge30sIGl0bSApO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHR0aGlzLl9jaGlsZHMuc2V0Q29udGVudCggY2hpbGRzICk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy5fY2hpbGRzLmNsZWFyQ29udGVudCggKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgVHJlZXZpZXcgZXh0ZW5kcyBDb21wb25lbnQ8VHJlZXZpZXdQcm9wcyxUcmVldmlld0V2ZW50cz4ge1xyXG5cdHByaXZhdGUgX3NlbGVjdGlvbjogTGlzdGJveElEO1xyXG5cdHByaXZhdGUgX3NlbGl0ZW06IENvbXBvbmVudDtcclxuXHRwcml2YXRlIF9pdGVtczogVHJlZUl0ZW1bXTtcclxuXHJcblx0Y29uc3RydWN0b3IoIHByb3BzOiBUcmVldmlld1Byb3BzICkge1xyXG5cdFx0c3VwZXIoIHByb3BzICk7XHJcblxyXG5cdFx0aWYoIHByb3BzLml0ZW1zICkge1xyXG5cdFx0XHR0aGlzLnNldEl0ZW1zKCBwcm9wcy5pdGVtcyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInRhYmluZGV4XCIsIDAgKTtcclxuXHRcdHRoaXMuc2V0RE9NRXZlbnRzKCB7XHJcblx0XHRcdGNsaWNrOiAoIGV2ICkgPT4gdGhpcy5fb25jbGljayggZXYgKSxcclxuXHRcdFx0a2V5ZG93bjogKCBldiApID0+IHRoaXMuX29ua2V5KCBldiApLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcclxuXHQgKi9cclxuXHJcblx0c2V0SXRlbXMoIGl0ZW1zOiBUcmVlSXRlbVsgXSApIHtcclxuXHRcdHRoaXMuX2l0ZW1zID0gaXRlbXM7XHJcblxyXG5cdFx0Y29uc3Qgcm9vdCA9IG5ldyBDVHJlZVZpZXdJdGVtKCB7IGNsczogXCJyb290XCJ9LCBudWxsICk7XHJcblx0XHRyb290LnNldEl0ZW1zKCBpdGVtcyApO1xyXG5cdFx0dGhpcy5zZXRDb250ZW50KCByb290ICk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbmNsaWNrKCBldjogVUlFdmVudCApIHtcclxuXHRcdGxldCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHR3aGlsZSggdGFyZ2V0ICYmIHRhcmdldCE9dGhpcy5kb20gKSB7XHJcblx0XHRcdGNvbnN0IGMgPSBjb21wb25lbnRGcm9tRE9NKCB0YXJnZXQgKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmKCBjICYmIGMuaGFzQ2xhc3MoXCJpdGVtXCIpICkge1xyXG5cdFx0XHRcdGNvbnN0IGlkID0gYy5nZXREYXRhKCBcImlkXCIgKTtcclxuXHRcdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBpZCwgYyApO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jbGVhclNlbGVjdGlvbiggKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29ua2V5KCBldjogS2V5Ym9hcmRFdmVudCApIHtcclxuXHRcdHN3aXRjaCggZXYua2V5ICkge1xyXG5cdFx0XHRjYXNlIFwiQXJyb3dEb3duXCI6IHtcclxuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYlRyZWVOYXYubmV4dCApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwiQXJyb3dVcFwiOiB7XHJcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2LnByZXYgKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2FzZSBcIkhvbWVcIjoge1xyXG5cdFx0XHRcdHRoaXMubmF2aWdhdGUoIGtiVHJlZU5hdi5maXJzdCApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwiRW5kXCI6IHtcclxuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYlRyZWVOYXYubGFzdCApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYXNlIFwiQXJyb3dSaWdodFwiOntcclxuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYlRyZWVOYXYuY2hpbGQgKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2FzZSBcIitcIjoge1xyXG5cdFx0XHRcdHRoaXMubmF2aWdhdGUoIGtiVHJlZU5hdi5leHBhbmQgKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2FzZSBcIkFycm93TGVmdFwiOiB7XHJcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2LnBhcmVudCApO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiLVwiOiB7XHJcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2LmNvbGxhcHNlICk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdFxyXG5cdFx0XHRjYXNlICcgJzoge1xyXG5cdFx0XHRcdHRoaXMubmF2aWdhdGUoIGtiVHJlZU5hdi50b2dnbGUgKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRjb25zb2xlLmxvZyggZXYua2V5ICk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCApO1xyXG5cdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblxyXG5cdG5hdmlnYXRlKCBzZW5zOiBrYlRyZWVOYXYgKSB7XHJcblxyXG5cdFx0aWYoICF0aGlzLl9pdGVtcyB8fCB0aGlzLl9pdGVtcy5sZW5ndGg9PTAgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoICF0aGlzLl9zZWxpdGVtICkge1xyXG5cdFx0XHRpZiggc2Vucz09a2JUcmVlTmF2Lm5leHQgfHwgc2Vucz09a2JUcmVlTmF2LnBhcmVudCApIHNlbnMgPSBrYlRyZWVOYXYuZmlyc3Q7XHJcblx0XHRcdGVsc2UgaWYoIHNlbnM9PWtiVHJlZU5hdi5wcmV2ICkgc2VucyA9IGtiVHJlZU5hdi5sYXN0O1xyXG5cdFx0XHRlbHNlIHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwID0gdGhpcy5fc2VsaXRlbT8ucGFyZW50RWxlbWVudDxDVHJlZVZpZXdJdGVtPiggKTtcclxuXHRcdGNvbnN0IGlzRm9sZGVyID0gcD8uaGFzQ2xhc3MoXCJmb2xkZXJcIik7XHJcblxyXG5cdFx0aWYoIHAgJiYgc2Vucz09a2JUcmVlTmF2LnBhcmVudCAmJiBpc0ZvbGRlciAmJiBwLmhhc0NsYXNzKFwib3BlblwiKSApIHtcclxuXHRcdFx0c2VucyA9IGtiVHJlZU5hdi5jb2xsYXBzZTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoIHNlbnM9PWtiVHJlZU5hdi5jaGlsZCApIHtcclxuXHRcdFx0aWYoIGlzRm9sZGVyKSB7XHJcblx0XHRcdFx0aWYoICFwLmhhc0NsYXNzKFwib3BlblwiKSApIHtcclxuXHRcdFx0XHRcdHNlbnMgPSBrYlRyZWVOYXYuZXhwYW5kO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHNlbnMgPSBrYlRyZWVOYXYubmV4dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0c2VucyA9IGtiVHJlZU5hdi5uZXh0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIHNlbnM9PWtiVHJlZU5hdi5leHBhbmQgfHwgc2Vucz09a2JUcmVlTmF2LmNvbGxhcHNlIHx8IHNlbnM9PWtiVHJlZU5hdi50b2dnbGUgKSB7XHJcblx0XHRcdGlmKCBpc0ZvbGRlciApIHtcclxuXHRcdFx0XHRpZiggc2Vucz09a2JUcmVlTmF2LnRvZ2dsZSApIHtcclxuXHRcdFx0XHRcdHAudG9nZ2xlKCApO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cC5vcGVuKCBzZW5zPT1rYlRyZWVOYXYuZXhwYW5kICk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBhbGwgPSB0aGlzLl9mbGF0dGVuT3Blbkl0ZW1zKCApO1xyXG5cdFx0XHRsZXQgY3VyID0gYWxsLmZpbmRJbmRleCggeCA9PiB0aGlzLl9zZWxlY3Rpb249PXguaWQgKTtcclxuXHJcblx0XHRcdGxldCBuZXdTZWw6IExpc3Rib3hJRDtcclxuXHRcdFx0XHJcblx0XHRcdGlmKCBzZW5zPT1rYlRyZWVOYXYuZmlyc3QgKSB7XHJcblx0XHRcdFx0bmV3U2VsID0gYWxsWzBdLmlkO1xyXG5cdFx0XHR9IFxyXG5cdFx0XHRlbHNlIGlmKCBzZW5zPT1rYlRyZWVOYXYubGFzdCApIHtcclxuXHRcdFx0XHRuZXdTZWwgPSBhbGxbYWxsLmxlbmd0aC0xXS5pZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmKCBjdXI+PTAgKSB7XHJcblx0XHRcdFx0aWYoIHNlbnM9PWtiVHJlZU5hdi5wcmV2ICkge1xyXG5cdFx0XHRcdFx0aWYoIGN1cj4wICkge1xyXG5cdFx0XHRcdFx0XHRuZXdTZWwgPSBhbGxbY3VyLTFdLmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmKCBzZW5zPT1rYlRyZWVOYXYubmV4dCApIHtcclxuXHRcdFx0XHRcdGlmKCBjdXI8YWxsLmxlbmd0aC0xICkge1xyXG5cdFx0XHRcdFx0XHRuZXdTZWwgPSBhbGxbY3VyKzFdLmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmKCBzZW5zPT1rYlRyZWVOYXYucGFyZW50ICkge1xyXG5cclxuXHRcdFx0XHRcdGNvbnN0IGNsZXZlbCA9IGFsbFtjdXJdLmxldmVsO1xyXG5cdFx0XHRcdFx0d2hpbGUoIGN1cj4wICkge1xyXG5cdFx0XHRcdFx0XHRjdXItLTtcclxuXHRcdFx0XHRcdFx0aWYoIGFsbFtjdXJdLmxldmVsPGNsZXZlbCApIHtcclxuXHRcdFx0XHRcdFx0XHRuZXdTZWwgPSBhbGxbY3VyXS5pZDtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoIG5ld1NlbCApIHtcclxuXHRcdFx0XHRjb25zdCBuc2VsID0gdGhpcy5xdWVyeSggYFtkYXRhLWlkPVwiJHtuZXdTZWx9XCJdYClcclxuXHRcdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBuZXdTZWwsIG5zZWwgKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9mbGF0dGVuT3Blbkl0ZW1zKCApIHtcclxuXHRcdGxldCBhbGw6IHsgaWQ6IExpc3Rib3hJRCwgbGV2ZWw6IG51bWJlciB9W10gPSBbXTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgYnVpbGQgPSAoIHg6IFRyZWVJdGVtLCBsZXZlbDogbnVtYmVyICkgPT4ge1xyXG5cdFx0XHRhbGwucHVzaCgge2lkOiB4LmlkK1wiXCIsIGxldmVsIH0gKTtcclxuXHRcdFx0aWYoIHguY2hpbGRyZW4gJiYgeC5vcGVuICkge1xyXG5cdFx0XHRcdHguY2hpbGRyZW4uZm9yRWFjaCggeSA9PiBidWlsZCggeSwgbGV2ZWwrMSApICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKCB5ID0+IGJ1aWxkKCB5LCAwICkgKTtcclxuXHRcdHJldHVybiBhbGw7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9mbGF0dGVuSXRlbXMoICkge1xyXG5cdFx0bGV0IGFsbDogVHJlZUl0ZW1bXSA9IFtdO1xyXG5cdFx0XHJcblx0XHRjb25zdCBidWlsZCA9ICggeDogVHJlZUl0ZW0gKSA9PiB7XHJcblx0XHRcdGFsbC5wdXNoKCB4ICk7XHJcblx0XHRcdGlmKCB4LmNoaWxkcmVuICkge1xyXG5cdFx0XHRcdHguY2hpbGRyZW4uZm9yRWFjaCggeSA9PiBidWlsZCh5KSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5faXRlbXMuZm9yRWFjaCggeSA9PiBidWlsZCggeSApICk7XHJcblx0XHRyZXR1cm4gYWxsO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfc2VsZWN0SXRlbSggaWQ6IExpc3Rib3hJRCwgaXRlbTogQ29tcG9uZW50ICkge1xyXG5cdFx0aWYoIHRoaXMuX3NlbGl0ZW0gKSB7XHJcblx0XHRcdHRoaXMuX3NlbGl0ZW0ucmVtb3ZlQ2xhc3MoIFwic2VsZWN0ZWRcIiApO1xyXG5cdFx0XHR0aGlzLl9zZWxpdGVtID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3NlbGl0ZW0gPSBpdGVtO1xyXG5cdFx0dGhpcy5fc2VsZWN0aW9uID0gaWQ7XHJcblxyXG5cdFx0aWYoIGl0ZW0gKSB7XHJcblx0XHRcdGl0ZW0uYWRkQ2xhc3MoIFwic2VsZWN0ZWRcIiApO1xyXG5cdFx0XHRpdGVtLnNjcm9sbEludG9WaWV3KCB7XHJcblx0XHRcdFx0YmVoYXZpb3I6IFwic21vb3RoXCIsXHJcblx0XHRcdFx0YmxvY2s6IFwibmVhcmVzdFwiXHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBpdG0gPSB0aGlzLl9maW5kSXRlbSggaWQgKTtcclxuXHRcdHRoaXMuZmlyZSggXCJjaGFuZ2VcIiwgeyBzZWxlY3Rpb246IGl0bSB9ICk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9maW5kSXRlbSggaWQ6IExpc3Rib3hJRCApIHtcclxuXHRcdGNvbnN0IGFsbCA9IHRoaXMuX2ZsYXR0ZW5JdGVtcyggKTtcclxuXHRcdHJldHVybiBhbGwuZmluZCggeCA9PiB4LmlkPT1pZCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICovXHJcblx0XHJcblx0Y2xlYXJTZWxlY3Rpb24oICkge1xyXG5cdFx0aWYoIHRoaXMuX3NlbGl0ZW0gKSB7XHJcblx0XHRcdHRoaXMuX3NlbGl0ZW0ucmVtb3ZlQ2xhc3MoIFwic2VsZWN0ZWRcIiApO1xyXG5cdFx0XHR0aGlzLl9zZWxpdGVtID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3NlbGVjdGlvbiA9IHVuZGVmaW5lZDtcclxuXHRcdHRoaXMuZmlyZSggXCJjaGFuZ2VcIiwgeyBzZWxlY3Rpb246IHVuZGVmaW5lZCB9ICk7XHJcblx0fVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBNEJBLElBQU0sV0FBVyxPQUFRLE1BQU87QUFFaEMsSUFBSSxZQUFxQyxDQUN6QztBQVlPLFNBQVMsZUFBZ0IsTUFBYyxNQUFlO0FBQ3pELFlBQVUsSUFBSSxJQUFJO0FBQUEsSUFDZDtBQUFBLElBQ0E7QUFBQSxJQUNOLGtCQUFrQixDQUFDO0FBQUEsSUFDYixjQUFjLENBQUM7QUFBQSxFQUNuQjtBQUNKO0FBUGdCO0FBY1QsU0FBUyxXQUFZLE1BQXdCO0FBQ2hELFNBQU8sVUFBVSxJQUFJLE1BQUk7QUFDN0I7QUFGZ0I7QUFvQlQsU0FBUyxlQUFnQixTQUFpQixPQUFlO0FBRS9ELE1BQUksQ0FBQyxXQUFXLElBQUksR0FBSTtBQUN2QjtBQUFBLEVBQ0Q7QUFFQSxRQUFNLE9BQU8sVUFBVSxJQUFJO0FBRTNCLFFBQU0sUUFBUyxPQUFLO0FBQ25CLFdBQVEsS0FBSyxrQkFBa0IsQ0FBRTtBQUFBLEVBQ2xDLENBQUU7QUFFRixPQUFLLGVBQWUsU0FBVSxLQUFLLGtCQUFrQixLQUFLLE1BQU0sSUFBSztBQUN0RTtBQWJnQjtBQW9CaEIsU0FBUyxPQUFRLEtBQVUsSUFBVTtBQUVwQyxXQUFTLEtBQUssSUFBSztBQUNsQixVQUFNLE1BQU0sR0FBRyxDQUFDO0FBQ2hCLFFBQUksT0FBTyxRQUFRLFVBQVc7QUFDN0IsVUFBSSxDQUFDLElBQUk7QUFBQSxJQUNWLE9BQ0s7QUFDSixVQUFJLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFLO0FBQy9ELFlBQUksQ0FBQyxJQUFJLENBQUMs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QVU7QUFFZixRQUFJLE1BQU0sVUFBUSxLQUFLLGtCQUFrQixLQUFLLEtBQUssR0FBSTtBQUN0RCxZQUFNLEtBQUssU0FBVSxNQUFNLENBQUMsR0FBRyxFQUFHO0FBQ2xDLFlBQU0sS0FBSyxTQUFVLE1BQU0sQ0FBQyxHQUFHLEVBQUc7QUFDbEMsWUFBTSxLQUFLLFNBQVUsTUFBTSxDQUFDLEdBQUcsRUFBRztBQUNsQyxhQUFPLEtBQUssT0FBUSxNQUFJLElBQUUsSUFBSSxNQUFJLElBQUUsSUFBSSxNQUFJLElBQUUsSUFBSSxDQUFJO0FBQUEsSUFDdkQ7QUFFQSxRQUFJLE1BQU0sVUFBUSxLQUFLLGtCQUFrQixLQUFLLEtBQUssR0FBSTtBQUN0RCxZQUFNLEtBQUssU0FBVSxNQUFNLENBQUMsR0FBRyxFQUFHO0FBQ2xDLFlBQU0sS0FBSyxTQUFVLE1BQU0sQ0FBQyxHQUFHLEVBQUc7QUFDbEMsWUFBTSxLQUFLLFNBQVUsTUFBTSxDQUFDLEdBQUcsRUFBRztBQUNsQyxZQUFNLEtBQUssU0FBVSxNQUFNLENBQUMsR0FBRyxFQUFHO0FBQ2xDLFlBQU0sS0FBSyxTQUFVLE1BQU0sQ0FBQyxHQUFHLEVBQUc7QUFDbEMsWUFBTSxLQUFLLFNBQVUsTUFBTSxDQUFDLEdBQUcsRUFBRztBQUNsQyxhQUFPLEtBQUssT0FBUSxNQUFJLElBQUUsSUFBSSxNQUFJLElBQUUsSUFBSSxNQUFJLElBQUUsSUFBSSxDQUFJO0FBQUEsSUFDdkQ7QUFFQSxRQUFJLE1BQU0sVUFBUSxLQUFLLGtCQUFrQixLQUFLLEtBQUssR0FBSTtBQUN0RCxZQUFNLEtBQUssU0FBVSxNQUFNLENBQUMsR0FBRyxFQUFHO0FBQ2xDLFlBQU0sS0FBSyxTQUFVLE1BQU0sQ0FBQyxHQUFHLEVBQUc7QUFDbEMsWUFBTSxLQUFLLFNBQVUsTUFBTSxDQUFDLEdBQUcsRUFBRztBQUNsQyxZQUFNLEtBQUssU0FBVSxNQUFNLENBQUMsR0FBRyxFQUFHO0FBQ2xDLFlBQU0sS0FBSyxTQUFVLE1BQU0sQ0FBQyxHQUFHLEVBQUc7QUFDbEMsWUFBTSxLQUFLLFNB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LE1BQU87QUFDMUIsVUFBRSxTQUFTLFFBQVMsT0FBSyxNQUFPLEdBQUcsUUFBTSxDQUFFLENBQUU7QUFBQSxNQUM5QztBQUFBLElBQ0QsR0FMYztBQU9kLFNBQUssT0FBTyxRQUFTLE9BQUssTUFBTyxHQUFHLENBQUUsQ0FBRTtBQUN4QyxXQUFPO0FBQUEsRUFDUjtBQUFBLEVBRVEsZ0JBQWlCO0FBQ3hCLFFBQUksTUFBa0IsQ0FBQztBQUV2QixVQUFNLFFBQVEsd0JBQUUsTUFBaUI7QUFDaEMsVUFBSSxLQUFNLENBQUU7QUFDWixVQUFJLEVBQUUsVUFBVztBQUNoQixVQUFFLFNBQVMsUUFBUyxPQUFLLE1BQU0sQ0FBQyxDQUFFO0FBQUEsTUFDbkM7QUFBQSxJQUNELEdBTGM7QUFPZCxTQUFLLE9BQU8sUUFBUyxPQUFLLE1BQU8sQ0FBRSxDQUFFO0FBQ3JDLFdBQU87QUFBQSxFQUNSO0FBQUEsRUFFUSxZQUFhLElBQWUsTUFBa0I7QUFDckQsUUFBSSxLQUFLLFVBQVc7QUFDbkIsV0FBSyxTQUFTLFlBQWEsVUFBVztBQUN0QyxXQUFLLFdBQVc7QUFBQSxJQUNqQjtBQUVBLFNBQUssV0FBVztBQUNoQixTQUFLLGFBQWE7QUFFbEIsUUFBSSxNQUFPO0FBQ1YsV0FBSyxTQUFVLFVBQVc7QUFDMUIsV0FBSyxlQUFnQjtBQUFBLFFBQ3BCLFVBQVU7QUFBQSxRQUNWLE9BQU87QUFBQSxNQUNSLENBQUU7QUFBQSxJQUNIO0FBRUEsVUFBTSxNQUFNLEtBQUssVUFBVyxFQUFHO0FBQy9CLFNBQUssS0FBTSxVQUFVLEVBQUUsV0FBVyxJQUFJLENBQUU7QUFBQSxFQUN6QztBQUFBLEVBRVEsVUFBVyxJQUFnQjtBQUNsQyxVQUFNLE1BQU0sS0FBSyxjQUFlO0FBQ2hDLFdBQU8sSUFBSSxLQUFNLE9BQUssRUFBRSxNQUFJLEVBQUc7QUFBQSxFQUNoQztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUEsaUJBQWtCO0FBQ2pCLFFBQUksS0FBSyxVQUFXO0FBQ25CLFdBQUssU0FBUyxZQUFhLFVBQVc7QUFDdEMsV0FBSyxXQUFXO0FBQUEsSUFDakI7QUFFQSxTQUFLLGFBQWE7QUFDbEIsU0FBSyxLQUFNLFVBQVUsRUFBRSxXQUFXLE9BQVUsQ0FBRTtBQUFBLEVBQy9DO0FBQ0Q7QUExUXNFO0FBQS9ELElBQU0sV0FBTjsiLAogICJuYW1lcyI6IFsidmFsdWUiLCAiZW4iLCAiaWR4IiwgImR0ZSIsICJrYk5hdiIsICJyYyIsICJJbWFnZSIsICJ4bWFya19zaGFycF9saWdodF9kZWZhdWx0IiwgImtiVHJlZU5hdiJdCn0K
