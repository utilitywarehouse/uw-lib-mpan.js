import MPAN from '../lib/mpan';

const CORE = {
  distributorId: '10',
  uniqueId: '12858624',
  checkDigit: '490'
};

const SUPPLEMENTARY = {
  profileClass: '03',
  meterTimeSwitchClass: '123',
  lineLossFactorClass: '456'
};

describe('MPAN', () => {
  it('can be created from a 21 digit string "full" representation', () => {
    const value = Object.values({...SUPPLEMENTARY, ...CORE}).join('');
    const mpan = MPAN.fromString(value);

    mpan.core.should.eql(CORE);
    mpan.supplementary.should.eql(SUPPLEMENTARY);
    mpan.valid.should.equal(true);
  });

  it('can be created from a 13 digit string "core" representation', () => {
    const value = Object.values(CORE).join('');
    const mpan = MPAN.fromCoreString(value);

    mpan.core.should.eql(CORE);
    mpan.valid.should.equal(true);
  });

  it('validates the Profile Class (00 - 08 permitted)', () => {
    const mpans = [
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {profileClass: '9'})),
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {profileClass: '09'})),
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {profileClass: '99'})),
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {profileClass: 'AB'}))
    ];

    mpans.should.all.have.property('valid', false);
  });

  it('validates the Meter Time Switch Class (000 - 999 permitted)', () => {
    const mpans = [
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {meterTimeSwitchClass: '99'})),
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {meterTimeSwitchClass: '1000'})),
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {meterTimeSwitchClass: 'ABC'}))
    ];

    mpans.should.all.have.property('valid', false);
  });

  it('validates the Line Loss Factor Class (000 - 999 permitted)', () => {
    const mpans = [
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {lineLossFactorClass: '99'})),
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {lineLossFactorClass: '1000'})),
      new MPAN(CORE, Object.assign({}, SUPPLEMENTARY, {lineLossFactorClass: 'ABC'}))
    ];

    mpans.should.all.have.property('valid', false);
  });

  it('validates the Distributor ID (10 - 31 permitted)', () => {
    const mpans = [
      new MPAN(Object.assign({}, CORE, {distributorId: '9'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: '09'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: '32'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: 'AB'}), SUPPLEMENTARY)
    ];

    mpans.should.all.have.property('valid', false);
  });

  it('validates the Unique ID (000000 - 999999 permitted)', () => {
    const mpans = [
      new MPAN(Object.assign({}, CORE, {distributorId: '9999999'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: '100000000'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: 'ABCDEFGH'}), SUPPLEMENTARY)
    ];

    mpans.should.all.have.property('valid', false);
  });

  it('validates the Check Digit (000 - 999 permitted, last value must pass modulus 11 test)', () => {
    const mpans = [
      new MPAN(Object.assign({}, CORE, {distributorId: '99'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: '1000'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: 'ABC'}), SUPPLEMENTARY),
      new MPAN(Object.assign({}, CORE, {distributorId: '914'}), SUPPLEMENTARY)
    ];

    mpans.should.all.have.property('valid', false);
  });

  it('can be formatted into a 13 digit "core" string', () => {
    const mpan = new MPAN(CORE);
    const expected = Object.values(CORE).join('');

    mpan.toCoreString().should.equal(expected);
  });

  it('can be formatted into a 21 digit "full" string', () => {
    const mpan = new MPAN(CORE, SUPPLEMENTARY);
    const expected = Object.values({...SUPPLEMENTARY, ...CORE}).join('');

    mpan.toString().should.equal(expected);
  });
});