(function (global) {
  "use strict";

  const DAY_BOUNDARY_HOUR = 3;
  const DAY_BOUNDARY_MINUTE = 8;
  const ANCHOR_DATE = Date.UTC(1989, 10, 19);
  const ANCHOR_KIN = 49;
  const CYCLE_LENGTH = 273;

  function modulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function dateFromIso(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
    const [year, month, day] = iso.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
  }

  function isoFromDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function today(now) {
    const date = now ? new Date(now) : new Date();
    if (date.getHours() < DAY_BOUNDARY_HOUR || (date.getHours() === DAY_BOUNDARY_HOUR && date.getMinutes() < DAY_BOUNDARY_MINUTE)) {
      date.setDate(date.getDate() - 1);
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function kinForDate(date) {
    const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const difference = Math.round((utcDate - ANCHOR_DATE) / 86400000);
    return modulo(ANCHOR_KIN - 1 + difference, CYCLE_LENGTH) + 1;
  }

  global.ItschanaCalendar = Object.freeze({ dateFromIso, isoFromDate, today, kinForDate });
})(window);
