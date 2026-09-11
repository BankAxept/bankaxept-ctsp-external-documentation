# Integration overview

This page describes the shape of an STS integration end to end, so you can scope the work before
starting it. Each phase links to the chapter that covers it in detail.

Every integration differs in detail, but all follow the same sequence. Phases 1 and 2 involve work on
both sides and cannot be compressed by the integrator alone — begin them early.

## Phase 1 — Decide scope

Determine which interface you need and which environments you will use:

* [Choosing an interface](choosing_an_interface.md) — ISO 8583 or the JSON detokenization API.
* [Environments and endpoints](environments.md) — preproduction and production hostnames.

Both environments are set up independently. The full connectivity procedure is performed twice.

## Phase 2 — Establish connectivity

Network-level and cryptographic trust between your host and STS. See
[Connectivity](onboarding.md) for the checklist. In summary:

1. Submit your source IP addresses for allow-listing.
2. Submit a certificate signing request; Stø issues your client certificate for
   [mutual TLS](mtls_configuration.md).
3. Run the [connectivity test](connectivity_test.md) against the healthcheck endpoint.
4. For the ISO 8583 interface, complete the [key exchange](zmk_exchange.md) — a Zone Master Key
   ceremony followed by Key Interchange key exchange.

Step 4 has the longest lead time in production, where key components are delivered by courier to
separate key custodians.

## Phase 3 — Implement the protocol

How messages are carried over HTTP and authenticated. For the ISO 8583 interface, every message in
both directions is protected by a [Message Authentication Code](macusage.md); a
[worked example](mac_create.md) shows the full computation against real values.

## Phase 4 — Implement message handling

Message types, data elements and validation rules are in the
[ISO 8583 message reference](TSP_ISO_Message_V2.9.md). Implement against the current version and
track changes through the [API design guidelines](api_policy.md), which define what Stø treats as a
backwards-compatible change.

## Phase 5 — Test in preproduction

Preproduction is used for development and integration testing. The support team can provide more
detailed log information there than in production. During initial integration, one or more security
features can be disabled to ease the process — this is agreed case by case with Stø.

## Ongoing

Two operational commitments outlast the integration project:

* **Certificate renewal.** Client certificates are typically valid for three years and must be
  renewed before expiry.
* **Source IP changes.** Any change to your source IP addresses must be communicated to Stø in
  advance, or traffic will be blocked by the firewall.
