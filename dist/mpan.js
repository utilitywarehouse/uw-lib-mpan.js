"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MPAN = function () {
  /**
   * @param {object} core
   * @param {object} supplementary
   */
  function MPAN(core) {
    var supplementary = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, MPAN);

    this.core = core;
    this.supplementary = supplementary;
    this.valid = this._validate();
  }

  /**
   * @param {string} reference
   * @returns {object}
   */


  _createClass(MPAN, [{
    key: "toString",


    /**
     * @returns {string}
     */
    value: function toString() {
      return this.supplementary.profileClass + this.supplementary.meterTimeSwitchClass + this.supplementary.lineLossFactorClass + this.toCoreString();
    }

    /**
     * @returns {string}
     */

  }, {
    key: "toCoreString",
    value: function toCoreString() {
      return this.core.distributorId + this.core.uniqueId + this.core.checkDigit;
    }

    /**
     * @returns {boolean}
     */

  }, {
    key: "_validate",
    value: function _validate() {
      return this._validateCore() && (!this.supplementary || this._validateSupplementary()) && this._validateCheckDigit();
    }

    /**
     * @returns {boolean}
     */

  }, {
    key: "_validateCore",
    value: function _validateCore() {
      return !!this.core.distributorId.match(/^([12][0-9]|3[01])$/) && !!this.core.uniqueId.match(/^[0-9]{8}$/) && !!this.core.checkDigit.match(/^[0-9]{3}$/);
    }

    /**
     * @returns {boolean}
     */

  }, {
    key: "_validateSupplementary",
    value: function _validateSupplementary() {
      return !!this.supplementary.profileClass.match(/^0[0-8]$/) && !!this.supplementary.meterTimeSwitchClass.match(/^[0-9]{3}$/) && !!this.supplementary.lineLossFactorClass.match(/^[0-9]{3}$/);
    }

    /**
     * @returns {boolean}
     */

  }, {
    key: "_validateCheckDigit",
    value: function _validateCheckDigit() {
      var primes = [3, 5, 7, 13, 17, 19, 23, 29, 31, 37, 41, 43];
      var nums = [].concat(_toConsumableArray(this.toCoreString())).map(function (v) {
        return parseInt(v);
      });
      var sum = primes.reduce(function (prev, curr, i) {
        return prev + nums[i] * curr;
      }, 0);

      return sum % 11 % 10 === nums[12];
    }
  }], [{
    key: "fromString",
    value: function fromString(reference) {
      return new MPAN(MPAN._parseCore(reference.substr(8, 21)), MPAN._parseSupplementary(reference.substr(0, 8)));
    }

    /**
     * @param {string} reference
     * @returns {MPAN}
     */

  }, {
    key: "fromCoreString",
    value: function fromCoreString(reference) {
      return new MPAN(MPAN._parseCore(reference));
    }

    /**
     * @param {string} reference
     * @returns {object}
     */

  }, {
    key: "_parseCore",
    value: function _parseCore(reference) {
      var distributorId = reference.substr(0, 2);
      var uniqueId = reference.substr(2, 8);
      var checkDigit = reference.substr(10, 3);

      return {
        distributorId: distributorId,
        uniqueId: uniqueId,
        checkDigit: checkDigit
      };
    }

    /**
     * @param {string} reference
     * @returns {object}
     */

  }, {
    key: "_parseSupplementary",
    value: function _parseSupplementary(reference) {
      var profileClass = reference.substr(0, 2);
      var meterTimeSwitchClass = reference.substr(2, 3);
      var lineLossFactorClass = reference.substr(5, 3);

      return {
        profileClass: profileClass,
        meterTimeSwitchClass: meterTimeSwitchClass,
        lineLossFactorClass: lineLossFactorClass
      };
    }
  }]);

  return MPAN;
}();

exports.default = MPAN;