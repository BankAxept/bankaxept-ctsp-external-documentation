# Choosing an interface

STS exposes two interfaces to the same underlying service. Choose one before starting connectivity
work — the choice determines which certificates you need and whether an HSM-backed key ceremony is
required.

## Comparison

| | ISO 8583 interface | JSON detokenization API |
|---|---|---|
| **Payload** | ISO 8583 messages, Base64-encoded over HTTP | JSON over HTTPS |
| **Operations** | Detokenization and re-tokenization (`1100`/`1110`, `1120`/`1130`) | `detokenize`, `notify` |
| **Transport security** | Mutual TLS | Mutual TLS |
| **Application security** | MAC on every message, keyed from an HSM | PAN encrypted with JWE (RFC 7516, Compact Serialization) |
| **Certificates required** | Client certificate | Client certificate **and** a separate data encryption certificate |
| **HSM required** | Yes | No |
| **Key ceremony required** | Yes — ZMK and Key Interchange exchange | No |
| **Documented in** | [ISO 8583 message reference](TSP_ISO_Message_V2.9.md) | [API reference](api_reference.md) |

## ISO 8583 interface

The primary interface, and the one most integrations use. It suits remote hosts that already process
ISO 8583 payment traffic and operate an HSM.

Message integrity and authenticity are protected by a MAC on every message in both directions, using
an ephemeral MAC key wrapped under a Key Interchange key. This requires HSM key management on your
side and a key ceremony with Stø during onboarding, which is the longest-lead item in the
[connectivity](onboarding.md) process.

The ISO 8583 specification is the authoritative description of service behaviour for both interfaces.

## JSON detokenization API

An alternate interface for hosts that do not process ISO 8583. Instead of a MAC, sensitive card data
is protected at application level: the PAN is encrypted using JSON Web Encryption
([RFC 7516](https://datatracker.ietf.org/doc/html/rfc7516)) with Compact Serialization. This removes
the HSM and key ceremony requirements, but adds a second certificate — you generate a CSR with a
2048-bit or 4096-bit key for data encryption alongside the mutual TLS client certificate.

Behavioural detail for the operations is not repeated in the OpenAPI specification; the
[ISO 8583 message reference](TSP_ISO_Message_V2.9.md) describes the behaviour of the equivalent
operations in more depth.

See the [API reference](api_reference.md) for the rendered OpenAPI specification.

!!! note

    The OpenAPI specification for this interface is published in the repository at
    `openapi/ctsp-web-service-interface/ctsp-token-api.yaml` and is currently marked as a draft.
    Contact the Stø Token Service support team before implementing against it.

## Which to choose

Use the ISO 8583 interface if you already handle ISO 8583 traffic, operate an HSM, or need the full
set of message-level data elements. Use the JSON API if you need detokenization only and prefer to
avoid HSM-based key management. If you are unsure, discuss it with the support team during
onboarding — the connectivity steps differ enough that changing course later means repeating work.
