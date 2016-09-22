export default class MPAN {
  /**
   * @param {object} core
   * @param {object} supplementary
   */
  constructor(core, supplementary = null) {
    this.core = core;
    this.supplementary = supplementary;
    this.valid = this._validate();
  }

  /**
   * @param {string} reference
   * @returns {object}
   */
  static fromString(reference) {
    return new MPAN(
      MPAN._parseCore(reference.substr(8, 21)),
      MPAN._parseSupplementary(reference.substr(0, 8))
    );
  }

  /**
   * @param {string} reference
   * @returns {MPAN}
   */
  static fromCoreString(reference) {
    return new MPAN(
      MPAN._parseCore(reference)
    );
  }

  /**
   * @param {string} reference
   * @returns {object}
   */
  static _parseCore(reference) {
    const distributorId = reference.substr(0, 2);
    const uniqueId = reference.substr(2, 8);
    const checkDigit = reference.substr(10, 3);

    return {
      distributorId,
      uniqueId,
      checkDigit
    }
  }

  /**
   * @param {string} reference
   * @returns {object}
   */
  static _parseSupplementary(reference) {
    const profileClass = reference.substr(0, 2);
    const meterTimeSwitchClass = reference.substr(2, 3);
    const lineLossFactorClass = reference.substr(5, 3);

    return {
      profileClass,
      meterTimeSwitchClass,
      lineLossFactorClass
    }
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.supplementary.profileClass
      + this.supplementary.meterTimeSwitchClass
      + this.supplementary.lineLossFactorClass
      + this.toCoreString();
  }

  /**
   * @returns {string}
   */
  toCoreString() {
    return this.core.distributorId
      + this.core.uniqueId
      + this.core.checkDigit;
  }

  /**
   * @returns {boolean}
   */
  _validate() {
    return this._validateCore()
      && (!this.supplementary || this._validateSupplementary())
      && this._validateCheckDigit();
  }

  /**
   * @returns {boolean}
   */
  _validateCore() {
    return !!this.core.distributorId.match(/^([12][0-9]|3[01])$/)
      && !!this.core.uniqueId.match(/^[0-9]{8}$/)
      && !!this.core.checkDigit.match(/^[0-9]{3}$/);
  }

  /**
   * @returns {boolean}
   */
  _validateSupplementary() {
    return !!this.supplementary.profileClass.match(/^0[0-8]$/)
      && !!this.supplementary.meterTimeSwitchClass.match(/^[0-9]{3}$/)
      && !!this.supplementary.lineLossFactorClass.match(/^[0-9]{3}$/);
  }

  /**
   * @returns {boolean}
   */
  _validateCheckDigit() {
    const primes = [3, 5, 7, 13, 17, 19, 23, 29, 31, 37, 41, 43];
    const nums = [...this.toCoreString()].map(v => parseInt(v));
    const sum = primes.reduce((prev, curr, i) => prev + (nums[i] * curr), 0);

    return (sum % 11 % 10) === nums[12];
  }
}