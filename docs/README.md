<p align="center">
<img alt="Stø logo" src="assets/images/sto-primary.png" width="300"/>
</p>

# STØ Token Service

STØ Token Service (STS) is a SaaS Token Service Provider (TSP) providing EMV and PCI payment
tokenization. It performs tokenization, detokenization, token life cycle management (LCM), and
notification.

STS exposes two interfaces to the same underlying service and the same input data: an ISO 8583
interface, and a JSON API. This site describes the connectivity, message exchange and cryptography
required to connect a remote host — typically a POS aggregator, acquirer host or bank host — to
either interface.

## Who this is for

Engineers implementing and operating an integration against STS — typically POS aggregators
connecting to the detokenization interface, or payment systems implementing tokenization. It
assumes familiarity with TLS, HTTP, and — for the ISO 8583 interface — ISO 8583 message construction
and HSM-based key management.

## How to read this documentation

The documentation follows the order in which you will need it:

| Chapter | Covers | Read it when |
|---------|--------|--------------|
| [Overview](getting_started.md) | What STS does, which interface to use, environments and endpoints | Before you plan the work |
| [Connectivity](onboarding.md) | IP allow-listing, mutual TLS, certificates, key exchange | Setting up the network and cryptographic trust |
| [ISO 8583 API](TSP_ISO_Message_V2.9.md) | Message authentication (MAC), message types, data elements, field-by-field detail | If you integrate over ISO 8583 |
| [JSON API](api_reference.md) | OpenAPI reference for the JSON detokenization interface | If you integrate over JSON |
| [Reference](api_policy.md) | API design guidelines and versioning policy | Ongoing |

Connectivity and key exchange involve steps on both sides and have the longest lead time. Start
[there](onboarding.md) once you know which interface you need.

## Support

Integration is a cooperative process. Contact the Stø Token Service support team for onboarding,
certificate issuance, and preproduction assistance.
