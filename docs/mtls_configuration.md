# Mutual TLS configuration

## Introduction

The ISO-API of Stø Token Service requires mutual TLS (mTLS) authentication for enhanced security. This document outlines
the steps necessary to configure mTLS for secure communication between POS aggregators and the ISO-API. The procedure 
needs to be followed for both preproduction and production environments.

## Procedure

The following steps describe the mTLS configuration process;

1. POS aggregator provide a Certificate Signing Request (CSR) to Stø Token Service.
2. POS aggregator provide source IP address to add to ISO-API allowlist for the required environment.
3. Stø Token Service signs the CSR and returns a client certificate to the POS aggregator.
4. Stø Token Service adds the provided source IP address to the ISO-API allowlist.
5. POS aggregator configures their systems to use the client certificate for mTLS authentication when communicating
6. A Connectivity test is performed to ensure successful mTLS authentication.

### Certificate signing request (CSR)

The POS aggregator must generate a X509 certificate signing request using their preferred method. The CSR should include
a common name (CN) that uniquely identifies the POS aggregator and environment, preferably without spaces. The CSR must
be in PEM format.

### Connectivity test procedure

### Preproduction environment

After source IP is added to allow list and client certificate is installed, the POS aggregator should perform a connectivity
test to ensure that mTLS is functioning correctly. The test can be performed by sending a request to the preproduction ISO-API healthcheck endpoint:

```
https://ctsp-proc-pp.baxlab.no/gtotx/api/healthCheck
```

### Production environment

After source IP is added to allow list and client certificate is installed, the POS aggregator should perform a connectivity
test to ensure that mTLS is functioning correctly. The test can be performed by sending a request to the preproduction ISO-API healthcheck endpoint:

```
https://tx.ctsp.stoe.no/gtotx/api/healthCheck
```

