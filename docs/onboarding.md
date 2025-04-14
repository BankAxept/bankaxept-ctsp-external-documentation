# Onboarding

This page describes all steps required to start utilizing Cloud TSP APIs. It includes a checklist of all necessary steps
and requirements. As well as a description of why they are required

There are two environments available: preproduction and production. The preproduction environment is used for testing
and development purposes, while the production environment is used for live transactions. Our support team can provide
more detailed log information and assistance in the preproduction environment. During the initial integration, one or more
security features can be disabled to ease the integration process. This is done on a case-by-case basis and must be
agreed upon with BankAxept.

Connectivity is completed, the APIs are ready to be used. If the ISO-API is used, a set of MAC keys needs to be
exchanged between the integrator and BankAxept. The MAC keys are used to ensure message integrity and authenticity in
the messages exchanged.

## Connectivity activities

For each of the supported environments (preproduction and production) the following activities must be completed:

1. Submit source IP address to BankAxept
2. Create certificate signing request 
3. Connectivity test

### Source IP address

The source IP address, or addresses, is used to allow the integrator's IP address in the BankAxept firewall. Any changes
in the source IP needs to be communicated to BankAxept.

### Certificate signing request

A certificate signing request (CSR) needs to be provided to the Cloud TSP support team. Once the CSR is received, the
support team will generate a certificate. This will be used to enable secure connectivity to the APIs.

### Connectivity test

The connectivity test is used to verify that the connectivity between the integrator and BankAxept is working as
expected. The test is performed by the integrator with support by the Cloud TSP support team. A HTTP request, from
the same source IPs as the ip that was added to the allow list, is sent to the health check endpoint provided by
BankAxept. The health check endpoint URL is: `https://api.bankaxept.com/health-check`.

By verifying that the health check can be called successfully, the connectivity is considered to be working.
