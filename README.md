# uw-lib-mpan.js

Small JavaScript library for parsing and validating Meter Point Administration Number (MPAN) values.

## Usage

```
import MPAN from 'uw-lib-mpan.js';

const m = MPAN.parse('018011002000000139445');
console.log(m);

/*
Outputs:

MPAN {
  core: { distributorId: '20',
    uniqueId: '00000139',
    checkDigit: '445'
  },
  supplementary: { 
    profileClass: '01',
    meterTimeSwitchClass: '801',
    lineLossFactorClass: '100'
  },
  valid: true
}
*/
```