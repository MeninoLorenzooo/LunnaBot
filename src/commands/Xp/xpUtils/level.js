let _CURVE = 0.1;

module.exports = (amountXP) => {
    return Math.floor(_CURVE * Math.sqrt(amountXP));
};
