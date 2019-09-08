const level = require(`src/commands/Xp/xpUtils/level.js`);

module.exports = (oldAmount, newAmount) => level(newAmount) > level(oldAmount);
