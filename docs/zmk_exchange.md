# Zone Master Key (ZMK) Exchange

## Introduction

A Zone Master Key (ZMK) exchange is required to establish trust between the POS aggregator and the Stoe Token Service Provider (STS). After both parties have loaded the ZMK in to their respective hardware security modules (HSM).

## Preproduction procedure

For preproduction the exchange of ZMK can be done via secure email or other secure means agreed upon between the parties. The key ceremony can be done by either parties. Details about Stø procedure can be provided on request.

### Parameters

The ZMK will be generated as an AES-256 key, unless customer or business requirements demand anything else, and be delivered as two components digitally. Please note that the ZMK can only protect keys that are of the same length or shorter than the ZMK itself.

### Delivery

For preproduction the ZMK can be delivered via secure email or other secure means agreed upon between the parties.

Below is an example of how the ZMK components can be represented.

```
Label: EXAMPLE.LABEL.FOR.DOCUMENTATION.PURPOSE.ONLY
Comp1: 000000001111111122222222333333334444444455555555
KCV1:  AABBCC
Comp2: 66666666777777778888888899999999AAAAAAAABBBBBBBB
KCV2:  FFEEDD


KCV for key: AA0099
```

## Production procedure

### Parameters

### Delivery

