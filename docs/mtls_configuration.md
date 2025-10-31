# Mutual TLS configuration

The ISO-API of Stø Token Service requires mutual TLS (mTLS) authentication for enhanced security. This document outlines
the steps necessary to configure mTLS for secure communication between POS aggregators and the ISO-API. The procedure 
needs to be followed for both preproduction and production environments.

## Procedure

The following steps describe the mTLS configuration process;

1. POS aggregator provide a Certificate Signing Request (CSR) to Stø Token Service.
2. Stø Token Service returns a client certificate to the POS aggregator.

## Certificate signing request (CSR)

The POS aggregator must generate a X509 certificate signing request using their preferred method. The CSR should include
a common name (CN) that uniquely identifies the POS aggregator and environment, preferably without spaces. The CSR must
be in PEM format.

The validity of the generated client certificate is typically 2 years and needs to be renewed before expiration.

