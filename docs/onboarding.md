# Onboarding

This page describes all steps required to start utilzing BankAxept CTSP. It includes a checklist of all necessary steps and requirements.
As well as a description of why they are required

## Step by Step Guide

1. Lorem
2. Ipsum
3. Support MTLs, see the [Connectivity](#Connectivity) section for more information.

### Connectivity

All communication with CTSP and the remote host (Acquirer Server or Bank Server) must be secured and support Mutual TLS.

#### VPN
A VPN (IPSEC) coul be used with TLS Server Authentication but not recommended option

#### mTLS Authentication (HTTPS)

The TLS shall be used to get end-to-end encryption.
If VPN is used, TLS shall be TLS server authentication otherwise TLS mutual authentication.

The full ISO payload will be exchanged using HTTP Request/Response scheme:
* HTTP Request
  * initiated by the remote host
  * method POST
  * content type: “x-www-form-urlencoded”
  * The full full byte array ISO message request is Base64 encoded and present in the Body Request
* HTTP Response
  * It contains the synchronous ISO message Response from Cloud TSP.
  * The full byte array ISO message response is Base64 encoded in present in the Body Response.
  * HTTP Status code
    * 200 if Cloud TSP decodes and parses the ISO message Request. Response will contain the ISO message Response
    * 4xx if Cloud TSP fails to decode and parse ISO message. No ISO message will be present.
    * 5xx connection error. No ISO message will be present.
