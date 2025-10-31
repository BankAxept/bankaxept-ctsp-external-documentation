# Zone Master Key (ZMK) Exchange

## Introduction

A Zone Master Key (ZMK) exchange is required to establish trust between the POS aggregator and the Stoe Token Service Provider (STS). After both parties have loaded the ZMK in to their respective hardware security modules (HSM).

## Preproduction procedure

For preproduction the exchange of ZMK can be done via secure email or other secure means agreed upon between the parties. The key ceremony can be done by either parties. Details about Stø procedure can be provided on request.

### Parameters

The ZMK will be generated as an AES-256 key, unless customer or business requirements demand anything else, and be delivered as two components digitally. Please note that the ZMK can only protect keys that are of the same length or shorter than the ZMK itself.

### Delivery

For preproduction the ZMK can be delivered via secure email or other secure means agreed upon between the parties.

The components are joined with XOR.

## Production procedure

For production the ZMK will be exchanged via a courier service agreed upon between the parties. If the same courier
service is used for all components, the second components will be sent after confirmation of receipt of the first component.

The component will be delivered in tamperproof envelopes to named key custodians, that sign off the receipt of the components.

Key components are joined with XOR.

## Example of digital delivery for test / preproduction

For preproduction both components can be delivered digitally. Below is an example of how the ZMK components will be delivered.

### Example with two components in one file.

```
#############################################
# STØ Token service - Key Components Form   #
# Environment: Test / Preprod               #
# Date       : 2025-10-31                   #
#############################################

Key Component 1: 0143 2B73 C73E 97D2 09A4 4560 5440 561C 3D81 1563 F540 0A62 9AB3 95F7 27E9 6D8F
KVC            : D2E93B

Key Component 2: 67D2 2AB3 2ECD 6D3B A4C1 239D 59C6 35EA 5C11 3B7C BBB8 74D6 62A5 1C8F BD0A 7D73
KVC            : 32F9A0

KVC of KEY     : 094D1D
```

### Example with components in different files.

File 1:
```
#############################################
# STØ Token service - Key Components Form   #
# Environment: Test / Preprod               #
# Date       : 2025-10-31                   #
#############################################

Key Component 1: 0143 2B73 C73E 97D2 09A4 4560 5440 561C 3D81 1563 F540 0A62 9AB3 95F7 27E9 6D8F
KVC            : D2E93B

KVC of KEY     : 094D1D
```

File 2:
```
#############################################
# STØ Token service - Key Components Form   #
# Environment: Test / Preprod               #
# Date       : 2025-10-31                   #
#############################################

Key Component 2: 67D2 2AB3 2ECD 6D3B A4C1 239D 59C6 35EA 5C11 3B7C BBB8 74D6 62A5 1C8F BD0A 7D73
KVC            : 32F9A0

KVC of KEY     : 094D1D
```

Note that the KVC of key refers to the complete ZMK.

The KVC algorithm is CMAC for AES keys, and ZL6 (aka encrypt zero) for 3DES (not supported for ZMK in STS).
