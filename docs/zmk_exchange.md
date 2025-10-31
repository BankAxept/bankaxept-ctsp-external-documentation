# Zone Master Key (ZMK) Exchange

A Zone Master Key (ZMK) exchange is required to establish trust between the POS aggregator and the Stoe Token Service Provider (STS).
After both parties have loaded the ZMK in to their respective hardware security modules (HSM).

The ZMK will be delivered as key components, where each component is delivered separately to different key custodians.
Each component is provided with a KVC and the KVC to the final key. The KVC algorithm is CMAC for AES keys, and ZL6
(aka encrypt zero) for 3DES (not supported for ZMK in STS).

## Key Exchange and Delivery Procedure

### ZMK Exchange Method
For production environments, the Zone Master Key (ZMK) shall be exchanged via a courier service mutually agreed upon by the involved parties. If a single courier service is employed for the delivery of all key components, the second component shall be dispatched only upon confirmed receipt of the first component.

### ZMK Generation and Format
The ZMK shall be generated using the AES-256 encryption standard, unless alternative specifications are required due to customer or business constraints. The key will be delivered digitally in two separate components.

### Key Length Limitation
It is important to note that the ZMK can only be used to protect cryptographic keys that are of equal or shorter length than the ZMK itself.

### Component Delivery Protocol
Each key component shall be enclosed in tamper-evident envelopes and delivered to designated key custodians. Custodians are required to formally acknowledge receipt by signing the delivery documentation.

### Key Component Combination Method
The two key components shall be combined using the bitwise XOR operation to reconstruct the complete ZMK.

## Preproduction procedure

For preproduction the exchange of ZMK can be done via secure email or other secure means agreed upon between the parties. The key ceremony can be done by either parties. Details about Stø procedure can be provided on request.

### Delivery

For preproduction the ZMK can be delivered via secure email or other secure means agreed upon between the parties.

The components are joined with XOR.

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
