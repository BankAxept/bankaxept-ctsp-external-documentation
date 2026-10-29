# Key exchange

!!! info "ISO 8583 interface only"

    This step is required for the [ISO 8583 interface](choosing_an_interface.md), which protects
    every message with a MAC. The JSON detokenization API does not use these keys.

Before MAC-protected messages can be exchanged, a key hierarchy must be established between your HSM
and Stø's.

## Key hierarchy

| Key | Purpose | Exchanged how |
|-----|---------|---------------|
| **ZMK** (Zone Master Key) | Establishes trust between the two parties; protects the keys exchanged under it | Key ceremony — components delivered separately to key custodians |
| **KI** (Key Interchange) | Encrypts the ephemeral MAC key carried in each message | Exchanged encrypted under the ZMK |
| **MAC key** | Ephemeral; computes the MAC on an individual message | Generated per message, sent encrypted under KI in the message itself |

The ZMK is exchanged once, during onboarding. KI keys are exchanged under it and can be rotated
afterwards without a new ceremony — each is identified by a key index from 1 to 255, allowing
switchover. See [Message authentication](macusage.md) for how these keys are used per message.

!!! warning "Key length constraint"

    A ZMK can only protect keys of equal or shorter length than itself. Size the ZMK for the longest
    KI you intend to use.

## ZMK format

The ZMK is generated using **AES-256** unless alternative specifications are required by customer or
business constraints. It is delivered as **two components**, combined with a bitwise **XOR** to
reconstruct the full key.

Each component is provided with its own **KVC** (Key Verification Check value), together with the KVC
of the final combined key, so each custodian can confirm their component loaded correctly and both
parties can confirm the reconstructed ZMK matches. The KVC algorithm is **CMAC** for AES keys, and
**ZL6** ("encrypt zero") for 3DES — 3DES is not supported for ZMK in STS.

## Production delivery

For production, ZMK components are exchanged via a courier service mutually agreed by both parties.

* Each component is enclosed in a **tamper-evident envelope** and delivered to a designated key
  custodian. Custodians formally acknowledge receipt by signing the delivery documentation.
* If a single courier service is used for all components, the second component is dispatched **only
  after receipt of the first has been confirmed**.

Both parties load the ZMK into their respective HSMs. Courier delivery to separate custodians sets
the pace of production onboarding — start this early.

## Preproduction delivery

For preproduction the ZMK may be exchanged by secure email or other secure means agreed between the
parties. The key ceremony can be performed by either party; details of the Stø procedure are
available on request. Components are combined with XOR as in production.

### Example of digital delivery

Both components may be delivered in a single file:

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

Or in separate files, one per component:

=== "File 1"

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

=== "File 2"

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

In both cases `KVC of KEY` refers to the complete reconstructed ZMK, not to either component.

!!! note "Example values"

    The key components above are illustrative and are not valid key material.

## Next steps

With the key hierarchy in place, continue to [Message authentication](macusage.md).
