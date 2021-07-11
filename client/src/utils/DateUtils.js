const TIMES = {
    now: 1,
    second: 1000,
    minute: 60,
    hour: 60
  },
  // I will add more locales in the future, but for this projet UI is french only
  LOCALES = {
    now: "Maintenant",
    second: "%ns",
    minute: "%n min",
    hour: "%nh",
    month: Array.from(
      { length: 12 },
      (_, i) =>
        `%n ${new Date(0, i).toLocaleString("fr-FR", { month: "long" })}`
    )
  };

Date.prototype.formatTwitter = function() {
    let delta = Math.abs(Date.now() - this),
      unit = "now";

    for (let key in TIMES) {
      if (delta < TIMES[key]) break;

      unit = key;
      delta = delta / TIMES[key];
    }
    delta = Math.floor(delta);

    //Check if more than 24 hours and adapt date format
    return unit === "hour" && delta >= 24
      ? LOCALES["month"][this.getMonth()].replace("%n", this.getDate())
      : LOCALES[unit].replace("%n", delta);
}