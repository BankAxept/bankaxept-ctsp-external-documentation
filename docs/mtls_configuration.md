# Mutual TLS

STS requires mutual TLS (mTLS) authentication. You authenticate to STS with a client certificate
issued by Stø; STS authenticates to you with a server certificate.

Perform this procedure for both preproduction and production. Certificates are environment-specific
and are not interchangeable.

## Procedure

1. Generate a certificate signing request (CSR) and send it to the Stø Token Service support team.
2. Stø issues a client certificate and returns it to you.
3. Install the certificate and verify the connection with the
   [connectivity test](connectivity_test.md).

## Certificate signing request

Generate an X.509 CSR using your preferred method. It must:

* be in **PEM** format;
* include the **C** (Country), **O** (Organization Name) and **CN** (Common Name) attributes;
* use a Common Name that uniquely identifies both your organization and the environment, preferably
  without spaces.

Because the Common Name identifies the environment as well as the organization, generate a separate
CSR for preproduction and for production.

If you are also integrating against the [JSON detokenization API](choosing_an_interface.md), you need
a second, separate CSR for the data encryption certificate, generated with a 2048-bit or 4096-bit
key.

## Validity and renewal

Client certificates are typically valid for **three years**.

!!! warning "Renew before expiry"

    An expired client certificate will fail mTLS authentication and stop all traffic. Track the
    expiry date and begin renewal — a new CSR — well before it is reached.

## Server certificates

To validate the STS server certificate, your client needs the relevant certificate chain in its trust
store. The chains for both environments are in [Connectivity test](connectivity_test.md).
