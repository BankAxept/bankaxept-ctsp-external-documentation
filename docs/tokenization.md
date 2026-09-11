# Tokenization concepts

This page defines the terms used throughout the documentation. If you are already familiar with EMV
payment tokenization, skip to [Choosing an interface](choosing_an_interface.md).

## Tokens and PANs

A **PAN** (Primary Account Number) is the card number printed on a physical payment card. A **token**
is a surrogate value that stands in for a PAN in a specific domain — a particular wallet, device or
channel. The mapping between the two is held by the **Token Service Provider (TSP)**, which is the
role STS performs.

Because the token is only valid within its domain, a token captured outside that domain is not
usable. This is what allows systems handling tokens to avoid storing PANs.

STS supports both **EMV tokenization** — tokens provisioned to wallets and devices, carrying
chip-level transaction data — and **PCI tokenization**.

## Detokenization and re-tokenization

Two operations make up the transaction path:

**Detokenization** resolves a token back to its PAN so a transaction can be authorized against the
issuer. Your host sends the token; STS validates it and returns the PAN and associated data.

**Re-tokenization** happens after the transaction is authorized. Your host reports the outcome —
approved, declined, or a reversal of a previously approved transaction — and STS returns the token
and token-related data for the PAN, and sends any required notification to the wallet.

In the ISO 8583 interface these are the `1100`/`1110` and `1120`/`1130` message pairs respectively.
They correspond to Token Authorization Request, PAN Authorization Request and PAN Authorization
Response in the *EMV Payment Tokenisation Specification Technical Framework v2.0*.

## Token domain restriction controls

When STS receives a detokenization request it does not simply look the token up. It applies **token
domain restriction controls** appropriate to the token type, verifying that the token is being used
in the domain it was issued for, before returning the PAN.

## Transaction types and verification flows

The cryptographic verification STS performs depends on how the token was provisioned and where it is
stored:

* **HCE** (Host Card Emulation) — credentials stored in software on the device.
* **Secure Element** — credentials stored in dedicated tamper-resistant hardware.
* **In-app payment cloud cryptogram** — in-app transactions using a cloud-generated cryptogram.

Each has its own verification flow with different requirements on the chip data you supply. These are
specified in section 6 of the [ISO 8583 message reference](TSP_ISO_Message_V2.9.md).

## Token assurance

**Token assurance method** records how the cardholder was identified and verified when the token was
provisioned — ranging from no verification performed, through issuer account verification, to
interactive two-factor cardholder authentication. The codes are defined by EMVCo and listed in the
appendix of the [message reference](TSP_ISO_Message_V2.9.md).

## Life cycle management and notification

Tokens outlive individual transactions. **Life cycle management (LCM)** covers the token's states,
including the re-linking that keeps a token valid when the underlying physical card is renewed or
reissued, so the cardholder does not have to re-enrol. **Notification** is how STS informs the wallet
of events affecting a token.

## Key terms

| Term | Meaning |
|------|---------|
| **TSP** | Token Service Provider — the role STS performs |
| **Remote host** | Your system connecting to STS: POS aggregator, acquirer host or bank host |
| **PAN** | Primary Account Number — the underlying card number |
| **Token** | Domain-restricted surrogate for a PAN |
| **LCM** | Life cycle management of tokens |
| **MAC** | Message Authentication Code protecting each ISO 8583 message |
| **ZMK** | Zone Master Key — protects keys exchanged between you and Stø |
| **KI** | Key Interchange key — encrypts the ephemeral MAC key in each message |
| **HSM** | Hardware Security Module holding key material |
| **KVC** | Key Verification Check value, used to confirm a key was loaded correctly |
