/* One entry, one atomic setItem; a stale page may never silently replace a newer snapshot. */
(function (global) {
  'use strict';
  global.BoraProgressStore = function (openStorage, key) {
    let seen = null, initialized = false;
    function read() {
      const value = openStorage().getItem(key);
      seen = value; initialized = true;
      return value;
    }
    function write(value) {
      try {
        const db = openStorage();
        if (!initialized) { const value = db.getItem(key); if(value !== null) return 'conflict'; seen=null; initialized=true; }
        if (db.getItem(key) !== seen) return 'conflict';
        if (seen === value) return 'unchanged';
        db.setItem(key, value);
        seen = value;
        return 'ok';
      } catch { return 'unavailable'; }
    }
    return {read,write,changed(){try{return initialized && openStorage().getItem(key)!==seen;}catch{return false;}}};
  };
})(window);
