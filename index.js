var MPAN = require('./dist/mpan').default;

module.exports.parse = function(mpan) {
  const number = mpan.replace(/^S/, '');

  if (number.length === 21) {
    return MPAN.fromString(number);
  } else if (number.length === 13) {
    return MPAN.fromCoreString(number);
  }

  throw new Error('Malformed MPAN, expecting string with a length of 13 or 21');
};