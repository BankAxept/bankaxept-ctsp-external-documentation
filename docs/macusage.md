# Message Authentication Code (MAC) Usage in ISO-API

All messages exchanged with the ISO-API are protected using a Message Authentication Code (MAC) to ensure integrity and authenticity. The sender generates a MAC based on agreed parameters, and the receiver verifies it. If verification fails, the message is rejected. The response message is also protected and verified in the same manner.

## Principles

- Every ISO message is protected with a MAC.
- An ephemeral MAC key is generated for each message (recommended maximum lifetime: 1 hour). The key may be reused within this period.
- The MAC key is encrypted using a Key Interchange (KI) key, which is protected by an agreed key protection method.
- KI keys are exchanged between parties, encrypted under a Zone Master Key (ZMK), and imported into a Hardware Security Module (HSM).
- The ZMK is exchanged during a key ceremony.

## Message Preparation

1. **Generate Ephemeral MAC Key:** Create a new MAC key for the message.
2. **Encrypt MAC Key:** Encrypt the MAC key under the KI key and include it in Field 48, subfield 002.
3. **Prepare ISO Message:** Construct the message, ensuring the bitmap reflects the presence of Field 64 (MAC).
4. **Message Transformation:** Apply the agreed transformation (e.g., SHA-256) to the message, excluding Field 64.
5. **Compute MAC:** Calculate the MAC over the transformed message using the ephemeral MAC key.
6. **Insert MAC:** Place the MAC in Field 64 of the ISO message.

**Note:** The encrypted MAC key must be present in the message (Field 48, subfield 002). The bitmap must indicate Field 64 before MAC computation, as it will be present during verification.

## Message Transformation Options

- SHA-1
- SHA-256 (default)
- None

## Supported MAC Algorithms

- AES-CMAC (RFC 4493, with padding as specified; output is the leftmost 8 bytes)

### Deprecated MAC Algorithm

- ISO 9797-1 Algorithm 3 (3DES, with padding method 1; output is the leftmost 8 bytes)

## Key Interchange (KI)

- KI is the encrypted key used to protect the ephemeral MAC key.
- KI keys are exchanged during setup, encrypted under the ZMK, and protected by HSM.
- KI is identified by a key index (1–255), present in Field 48, subfield 001, allowing for key renewal.
- KI and ZMK must be of equal or greater strength (AES or 3DES, as appropriate).

## MAC Key

- Each ISO message contains a MAC key, encrypted under KI (Field 48, subfield 002).
- The MAC key is ephemeral and should be regenerated at least every hour.

## Key Types and Algorithms

### AES (Recommended)

| Component         | Specification                                                                                      |
|-------------------|---------------------------------------------------------------------------------------------------|
| KI Key Type       | AES (128, 192, or 256 bits)                                                                       |
| MAC Key Type      | AES (128, 192, or 256 bits)                                                                       |
| MAC Key Wrapping  | AES TR-31                                                                                         |
| MAC Algorithm     | AES-CMAC (RFC 4493), with padding; MAC is the leftmost 8 bytes of the output                      |

### 3DES (Deprecated)

| Component         | Specification                                                                                      |
|-------------------|---------------------------------------------------------------------------------------------------|
| KI Key Type       | 2-key (16 bytes) or 3-key (24 bytes) 3DES                                                         |
| MAC Key Type      | 2-key 3DES (16 bytes)                                                                             |
| MAC Key Wrapping  | 3DES using CBC or ECB                                                                             |
| MAC Algorithm     | ISO 9797-1 Algorithm 3, padding method 1; MAC is the leftmost 8 bytes of the output               |

## Key Interchange Alternatives

- AES-128 (TR-31)
- AES-192 (TR-31)
- AES-256 (TR-31)

### Deprecated Alternatives

- 2KeyTDES ECB (no padding)
- 3KeyTDES ECB (no padding)

---

**Note:** For legacy projects, deprecated algorithms and key types are supported but not recommended for new implementations.