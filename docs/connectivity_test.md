# Connectivity test

Once your source IP address is allow-listed and your client certificate is installed, verify that
mutual TLS is working before attempting any application messages. The test isolates connectivity
problems from message-format problems.

Perform the test in each [environment](environments.md) separately.

## Running the test

Send a request to the healthcheck endpoint for the environment. The commands below are examples
using `curl`; any HTTP client that supports mutual TLS will work. Replace `client.pem` and
`client.key` with the paths to your own client certificate and private key.

=== "Preproduction"

    ```bash
    curl -v --cert client.pem --key client.key https://ctsp-proc-pp.baxlab.no/gtotx/api/healthcheck
    ```

=== "Production"

    ```bash
    curl -v --cert client.pem --key client.key https://tx.ctsp.stoe.no/gtotx/api/healthcheck
    ```

A successful test returns `204 No Content`, and the verbose output (`curl -v`) shows the TLS
handshake completing with your client certificate accepted.

!!! warning "Do not poll more than once per minute"

    The healthcheck is intended for periodic connectivity checking, not high-frequency probing.

## Interpreting failures

| Symptom | Likely cause |
|---------|--------------|
| Connection times out | Source IP not allow-listed, or allow-listed for the other environment |
| TLS handshake fails, server requests a certificate | Client certificate not presented, or presented for the wrong environment |
| TLS handshake fails on certificate verification | DigiCert Global Root G2 missing from your trust store — see below |
| Certificate expired | Client certificate past its validity; request renewal via a new CSR |

## Server certificate chains

Your client validates the STS server certificate by trusting its root certificate authority,
**DigiCert Global Root G2**. Both environments use certificates issued under this root, which most
system trust stores already contain. If your client uses a restricted trust store, add the DigiCert
Global Root G2 certificate to it. Do not add the leaf or intermediate certificate as the trust
anchor.

!!! warning "Do not pin the leaf or intermediate certificate"

    The leaf certificates are reissued periodically, and the intermediate certificate may also
    change. A client that pins either of them will lose connectivity when they are rotated. Trust the
    root and rely on standard chain validation, including hostname verification.

The chains below are for reference and troubleshooting only, and may lag behind the live
certificates. You can inspect the chain currently served with any TLS tool available on your
platform. For example, with `openssl`:

```bash
openssl s_client -showcerts -connect tx.ctsp.stoe.no:443 -servername tx.ctsp.stoe.no </dev/null
```

`openssl` may not be installed on every system, and the exact command depends on your environment.
If your client connects through an outbound proxy, run the check from a host with the same network
path. A TLS-inspecting proxy presents its own certificate chain instead of the STS chain, so the
output will not match the chains below.

### Preproduction

Leaf certificate `*.baxlab.no`, valid until **1 April 2027**.

??? abstract "Preproduction certificate chain (PEM)"

    ```
    -----BEGIN CERTIFICATE-----
    MIIGxDCCBaygAwIBAgIQAaD/9YdcTx4MuoMJrh39LjANBgkqhkiG9w0BAQsFADBZ
    MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMTMwMQYDVQQDEypE
    aWdpQ2VydCBHbG9iYWwgRzIgVExTIFJTQSBTSEEyNTYgMjAyMCBDQTEwHhcNMjYw
    OTE1MDAwMDAwWhcNMjcwNDAxMjM1OTU5WjBEMQswCQYDVQQGEwJOTzENMAsGA1UE
    BxMET3NsbzEQMA4GA1UECgwHU1TDmCBBUzEUMBIGA1UEAwwLKi5iYXhsYWIubm8w
    ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDD/Vkhim8jNCbMyoLUsUQk
    JpJy0Sp9FsBkaKSin7neFTcfW1B02As6HvOtZ1YH7IJ63vPOEKTiop81GirhIClX
    No61uL2sPgjvISPMICb7NjKwr5/XqX32BbMWwBDAdYgGS3OGCfRpXAQOT4u1AVt3
    7Q5j8r6jLPPSd+6j1sIowESMtL8ndZjHKpI0Rq/VUPpQeBFAt6F2vYwv31Bn+EzG
    WawcoUyv7QR4AfrPEh0p02ldtVjMXPFWP+zWxe1PnGIorjKAt0A8EZjXm2GDrIdf
    yrGW9M7KTCPKxmHNAnAtitqbDwEmDfiug0zNRxoiDKelFimIeCkqkSpbtoP4dn63
    AgMBAAGjggObMIIDlzAfBgNVHSMEGDAWgBR0hYDAZsffN97PvSk3qgMdvu3NFzAd
    BgNVHQ4EFgQUnwFcCKH7dtlyUDD2L6xftyOg08EwIQYDVR0RBBowGIILKi5iYXhs
    YWIubm+CCWJheGxhYi5ubzA+BgNVHSAENzA1MDMGBmeBDAECAjApMCcGCCsGAQUF
    BwIBFhtodHRwOi8vd3d3LmRpZ2ljZXJ0LmNvbS9DUFMwDgYDVR0PAQH/BAQDAgWg
    MB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjCBnwYDVR0fBIGXMIGUMEig
    RqBEhkJodHRwOi8vY3JsMy5kaWdpY2VydC5jb20vRGlnaUNlcnRHbG9iYWxHMlRM
    U1JTQVNIQTI1NjIwMjBDQTEtMS5jcmwwSKBGoESGQmh0dHA6Ly9jcmw0LmRpZ2lj
    ZXJ0LmNvbS9EaWdpQ2VydEdsb2JhbEcyVExTUlNBU0hBMjU2MjAyMENBMS0xLmNy
    bDCBhwYIKwYBBQUHAQEEezB5MCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdp
    Y2VydC5jb20wUQYIKwYBBQUHMAKGRWh0dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNv
    bS9EaWdpQ2VydEdsb2JhbEcyVExTUlNBU0hBMjU2MjAyMENBMS0xLmNydDAMBgNV
    HRMBAf8EAjAAMIIBhwYKKwYBBAHWeQIEAgSCAXcEggFzAXEAdwBMY9yY5Zwdq4j2
    Hoo93q6Pq0SjN3tfm5TD+6Gc/MG+JgAAAaCkmQecAAAEAwBIMEYCIQCGLjKwGK37
    oNwzh042nc5VmncGZuh4gea/dcochxggzQIhAJJhhZfa9A+p1NZ6GFq+mRgXUwQ2
    2sk0dWhzBKATz5YpAHYA1tWNqdAXU/NqSqDHV0kCr+vH3CzTjNn3ZMgMiRkenwIA
    AAGgpJkIUwAABAMARzBFAiEAps0zHjHxcPUqsnSbeabXs2e+OGQx2sBnFNOJiNpA
    CHQCIGwQVcD14CSK1MZOl2bBMEeqATaz8TEcXzuxDMU9OTeMAH4AooEAGHNOF24d
    R+CVQPOBulRml81jqENQcW64CU7a8Q0AAAGgpJkIKAAIAAAFAA18tRwEAwBHMEUC
    IQD52kuAYUh1+jUL2R10+R/ysJw4nkWkhcnuRvq/SbJz9QIgPf9t8kWLRhmpc3lb
    3v++OO4LyWbsIbwLweImoFOT+RQwDQYJKoZIhvcNAQELBQADggEBALf9NsaFh2Jm
    mWNHdrJkXW+BNkkijUhUnXh5Z8ohvItuizG6c2fgXJ1Y/0LPW52JSICgvZw1aNDS
    koHe4ltitI57rOXN0198y+bdESaRNVY6E0c7wDL2Q+5MrCGGxB5STq73gRZGaQNH
    BjSVJ7SmJza246KE5IA1EwJplzbNNJhC889R4qDAOWom27m2gWjirneenWLRVT3B
    yYplPyFlySSbeV7S0w4W709NoS4gHYQl9x8Fq7p/MMPucrEzZzImo/mMc3YThoMP
    UdbKkwPOVrpKVhLq14D8NK5Hpoh90BAT0iQ/JrNx8Bm72u3mfFPwxX/vhk2jk+qL
    mMLVjegkA1U=
    -----END CERTIFICATE-----

    -----BEGIN CERTIFICATE-----
    MIIEyDCCA7CgAwIBAgIQDPW9BitWAvR6uFAsI8zwZjANBgkqhkiG9w0BAQsFADBh
    MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
    d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH
    MjAeFw0yMTAzMzAwMDAwMDBaFw0zMTAzMjkyMzU5NTlaMFkxCzAJBgNVBAYTAlVT
    MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxMzAxBgNVBAMTKkRpZ2lDZXJ0IEdsb2Jh
    bCBHMiBUTFMgUlNBIFNIQTI1NiAyMDIwIENBMTCCASIwDQYJKoZIhvcNAQEBBQAD
    ggEPADCCAQoCggEBAMz3EGJPprtjb+2QUlbFbSd7ehJWivH0+dbn4Y+9lavyYEEV
    cNsSAPonCrVXOFt9slGTcZUOakGUWzUb+nv6u8W+JDD+Vu/E832X4xT1FE3LpxDy
    FuqrIvAxIhFhaZAmunjZlx/jfWardUSVc8is/+9dCopZQ+GssjoP80j812s3wWPc
    3kbW20X+fSP9kOhRBx5Ro1/tSUZUfyyIxfQTnJcVPAPooTncaQwywa8WV0yUR0J8
    osicfebUTVSvQpmowQTCd5zWSOTOEeAqgJnwQ3DPP3Zr0UxJqyRewg2C/Uaoq2yT
    zGJSQnWS+Jr6Xl6ysGHlHx+5fwmY6D36g39HaaECAwEAAaOCAYIwggF+MBIGA1Ud
    EwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFHSFgMBmx9833s+9KTeqAx2+7c0XMB8G
    A1UdIwQYMBaAFE4iVCAYlebjbuYP+vq5Eu0GF485MA4GA1UdDwEB/wQEAwIBhjAd
    BgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwdgYIKwYBBQUHAQEEajBoMCQG
    CCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wQAYIKwYBBQUHMAKG
    NGh0dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydEdsb2JhbFJvb3RH
    Mi5jcnQwQgYDVR0fBDswOTA3oDWgM4YxaHR0cDovL2NybDMuZGlnaWNlcnQuY29t
    L0RpZ2lDZXJ0R2xvYmFsUm9vdEcyLmNybDA9BgNVHSAENjA0MAsGCWCGSAGG/WwC
    ATAHBgVngQwBATAIBgZngQwBAgEwCAYGZ4EMAQICMAgGBmeBDAECAzANBgkqhkiG
    9w0BAQsFAAOCAQEAkPFwyyiXaZd8dP3A+iZ7U6utzWX9upwGnIrXWkOH7U1MVl+t
    wcW1BSAuWdH/SvWgKtiwla3JLko716f2b4gp/DA/JIS7w7d7kwcsr4drdjPtAFVS
    slme5LnQ89/nD/7d+MS5EHKBCQRfz5eeLjJ1js+aWNJXMX43AYGyZm0pGrFmCW3R
    bpD0ufovARTFXFZkAdl9h6g4U5+LXUZtXMYnhIHUfoyMo5tS58aI7Dd8KvvwVVo4
    chDYABPPTHPbqjc1qCmBaZx2vN4Ye5DUys/vZwP9BFohFrH/6j/f3IL16/RZkiMN
    JCqVJUzKoZHm1Lesh3Sz8W2jmdv51b2EQJ8HmA==
    -----END CERTIFICATE-----

    -----BEGIN CERTIFICATE-----
    MIIDjjCCAnagAwIBAgIQAzrx5qcRqaC7KGSxHQn65TANBgkqhkiG9w0BAQsFADBh
    MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
    d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH
    MjAeFw0xMzA4MDExMjAwMDBaFw0zODAxMTUxMjAwMDBaMGExCzAJBgNVBAYTAlVT
    MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j
    b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IEcyMIIBIjANBgkqhkiG
    9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzfNNNx7a8myaJCtSnX/RrohCgiN9RlUyfuI
    2/Ou8jqJkTx65qsGGmvPrC3oXgkkRLpimn7Wo6h+4FR1IAWsULecYxpsMNzaHxmx
    1x7e/dfgy5SDN67sH0NO3Xss0r0upS/kqbitOtSZpLYl6ZtrAGCSYP9PIUkY92eQ
    q2EGnI/yuum06ZIya7XzV+hdG82MHauVBJVJ8zUtluNJbd134/tJS7SsVQepj5Wz
    tCO7TG1F8PapspUwtP1MVYwnSlcUfIKdzXOS0xZKBgyMUNGPHgm+F6HmIcr9g+UQ
    vIOlCsRnKPZzFBQ9RnbDhxSJITRNrw9FDKZJobq7nMWxM4MphQIDAQABo0IwQDAP
    BgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNVHQ4EFgQUTiJUIBiV
    5uNu5g/6+rkS7QYXjzkwDQYJKoZIhvcNAQELBQADggEBAGBnKJRvDkhj6zHd6mcY
    1Yl9PMWLSn/pvtsrF9+wX3N3KjITOYFnQoQj8kVnNeyIv/iPsGEMNKSuIEyExtv4
    NeF22d+mQrvHRAiGfzZ0JFrabA0UWTW98kndth/Jsw1HKj2ZL7tcu7XUIOGZX1NG
    Fdtom/DzMNU+MeKNhJ7jitralj41E6Vf8PlwUHBHQRFXGU7Aj64GxJUTFy8bJZ91
    8rGOmaFvE7FBcf6IKshPECBV1/MUReXgRPTqh5Uykw7+U0b6LJ3/iyK5S9kJRaTe
    pLiaWN0bfVKfjllDiIGknibVb63dDcY3fe0Dkhvld1927jyNxF1WW6LZZm6zNTfl
    MrY=
    -----END CERTIFICATE-----
    ```

### Production

Leaf certificate `tx.ctsp.stoe.no`, valid until **1 November 2026**.

??? abstract "Production certificate chain (PEM)"

    ```
    -----BEGIN CERTIFICATE-----
    MIIGrjCCBZagAwIBAgIQC3uUu0MxgSgOQuVPbiPDhzANBgkqhkiG9w0BAQsFADBZ
    MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMTMwMQYDVQQDEypE
    aWdpQ2VydCBHbG9iYWwgRzIgVExTIFJTQSBTSEEyNTYgMjAyMCBDQTEwHhcNMjYw
    NDE3MDAwMDAwWhcNMjYxMTAxMjM1OTU5WjBIMQswCQYDVQQGEwJOTzENMAsGA1UE
    BxMET3NsbzEQMA4GA1UECgwHU1TDmCBBUzEYMBYGA1UEAxMPdHguY3RzcC5zdG9l
    Lm5vMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxsKfpUwVaU1wcXA/
    mcU2WMyXt/zq4nusdpOSkuTmzR9RNJHGprbK7fKUv25JOvPz/cBE/MTn60KVMiji
    tXSYyUjy9TUOw6jc6r2Ao2Eb3KxL1mvtlWZx/m/FJpJwyPuk596ch6kywpFb/hEQ
    9kIrLNTwSQrdVxp6xjrCi/YMJ8TJ8ThlVyiywlZ5giw97gxqq9xHvIo/b6f9+GhE
    LtqJlodBWYCEmtbmjGM8gZXoX846JJjbuTgPrHVwADrBtPFO4C9Yk4dODUMxvGbU
    +aLrWuMt4KqlRytsHh/akV3I+W38JkUXYYpMNrcGokhhuvBUBJfmqBzi1LegJtLv
    z9oBwwIDAQABo4IDgTCCA30wHwYDVR0jBBgwFoAUdIWAwGbH3zfez70pN6oDHb7t
    zRcwHQYDVR0OBBYEFGdSpV2KqOe1EMRFlX+8y23xwRcQMBoGA1UdEQQTMBGCD3R4
    LmN0c3Auc3RvZS5ubzA+BgNVHSAENzA1MDMGBmeBDAECAjApMCcGCCsGAQUFBwIB
    FhtodHRwOi8vd3d3LmRpZ2ljZXJ0LmNvbS9DUFMwDgYDVR0PAQH/BAQDAgWgMBMG
    A1UdJQQMMAoGCCsGAQUFBwMBMIGfBgNVHR8EgZcwgZQwSKBGoESGQmh0dHA6Ly9j
    cmwzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydEdsb2JhbEcyVExTUlNBU0hBMjU2MjAy
    MENBMS0xLmNybDBIoEagRIZCaHR0cDovL2NybDQuZGlnaWNlcnQuY29tL0RpZ2lD
    ZXJ0R2xvYmFsRzJUTFNSU0FTSEEyNTYyMDIwQ0ExLTEuY3JsMIGHBggrBgEFBQcB
    AQR7MHkwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmRpZ2ljZXJ0LmNvbTBRBggr
    BgEFBQcwAoZFaHR0cDovL2NhY2VydHMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0R2xv
    YmFsRzJUTFNSU0FTSEEyNTYyMDIwQ0ExLTEuY3J0MAwGA1UdEwEB/wQCMAAwggF+
    BgorBgEEAdZ5AgQCBIIBbgSCAWoBaAB3AMIxfldFGaNF7n843rKQQevHwiFaIr9/
    1bWtdprZDlLNAAABnZs+3c4AAAQDAEgwRgIhAOgk/oqANFfzRqdqfvbhJQD89ccN
    UohadUa4K8/dPWcTAiEA0IicaYUnsY2ZYyGnQecFjDf0HyWFBd90kPUjO1ysULMA
    dQDYCVU7lE96/8gWGW+UT4WrsPj8XodVJg8V0S5yu0VLFAAAAZ2bPt3XAAAEAwBG
    MEQCIC8nHyvzRf60RGoc9CbRYlqE7A2XmW7qONj1VGM+RSsPAiA1Av6LqWp76Cvv
    eWdqGT52Hg5qiiHvSpCm9plOf2gkxgB2AJROQ4f67MHvgfMZJCaoGGUBx9NfOAIB
    P3JnfVU3LhnYAAABnZs+3d0AAAQDAEcwRQIhAPb1Kp7QjaLQCr8e9XOyDIG2mByO
    xD1a0Yy0a0be50AxAiAQgqaQe5njYK2VWaYIHaqBN4nn4rgKBnTtZ7FxHKSJIzAN
    BgkqhkiG9w0BAQsFAAOCAQEAwdGmPc7+eKoUuU6vHf8XE35w7eCdgDkeAp153aHg
    hDQsrFYdgY+VMSnPBmEH155JUMbTDP5D+X0YV/KTURKyBG1nr4tU/TL2D5DOGBF3
    kQZ9dCm/AX504+fnJW2ucLiHA+Jqjdfkj38gb41/6Lbho0F4FtduLp1/tKQwkK25
    RK/5SZTdGFmU8Z4lQHJCnxfwna540F1iilwqyLDRi8vXHo0D9jhsPhxtf1RidVXF
    rqTgoTv85lAjmpNTZ3Ab9qDore45FA4zUQpnZLqLMmvZ96ILU8a/q6PlG1bVpTfp
    WbRt/wg47kPW+lQo+1jIbqrTNJDOUJtQwz4uLzVPZhWSIg==
    -----END CERTIFICATE-----

    -----BEGIN CERTIFICATE-----
    MIIEyDCCA7CgAwIBAgIQDPW9BitWAvR6uFAsI8zwZjANBgkqhkiG9w0BAQsFADBh
    MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
    d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH
    MjAeFw0yMTAzMzAwMDAwMDBaFw0zMTAzMjkyMzU5NTlaMFkxCzAJBgNVBAYTAlVT
    MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxMzAxBgNVBAMTKkRpZ2lDZXJ0IEdsb2Jh
    bCBHMiBUTFMgUlNBIFNIQTI1NiAyMDIwIENBMTCCASIwDQYJKoZIhvcNAQEBBQAD
    ggEPADCCAQoCggEBAMz3EGJPprtjb+2QUlbFbSd7ehJWivH0+dbn4Y+9lavyYEEV
    cNsSAPonCrVXOFt9slGTcZUOakGUWzUb+nv6u8W+JDD+Vu/E832X4xT1FE3LpxDy
    FuqrIvAxIhFhaZAmunjZlx/jfWardUSVc8is/+9dCopZQ+GssjoP80j812s3wWPc
    3kbW20X+fSP9kOhRBx5Ro1/tSUZUfyyIxfQTnJcVPAPooTncaQwywa8WV0yUR0J8
    osicfebUTVSvQpmowQTCd5zWSOTOEeAqgJnwQ3DPP3Zr0UxJqyRewg2C/Uaoq2yT
    zGJSQnWS+Jr6Xl6ysGHlHx+5fwmY6D36g39HaaECAwEAAaOCAYIwggF+MBIGA1Ud
    EwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFHSFgMBmx9833s+9KTeqAx2+7c0XMB8G
    A1UdIwQYMBaAFE4iVCAYlebjbuYP+vq5Eu0GF485MA4GA1UdDwEB/wQEAwIBhjAd
    BgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwdgYIKwYBBQUHAQEEajBoMCQG
    CCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wQAYIKwYBBQUHMAKG
    NGh0dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydEdsb2JhbFJvb3RH
    Mi5jcnQwQgYDVR0fBDswOTA3oDWgM4YxaHR0cDovL2NybDMuZGlnaWNlcnQuY29t
    L0RpZ2lDZXJ0R2xvYmFsUm9vdEcyLmNybDA9BgNVHSAENjA0MAsGCWCGSAGG/WwC
    ATAHBgVngQwBATAIBgZngQwBAgEwCAYGZ4EMAQICMAgGBmeBDAECAzANBgkqhkiG
    9w0BAQsFAAOCAQEAkPFwyyiXaZd8dP3A+iZ7U6utzWX9upwGnIrXWkOH7U1MVl+t
    wcW1BSAuWdH/SvWgKtiwla3JLko716f2b4gp/DA/JIS7w7d7kwcsr4drdjPtAFVS
    slme5LnQ89/nD/7d+MS5EHKBCQRfz5eeLjJ1js+aWNJXMX43AYGyZm0pGrFmCW3R
    bpD0ufovARTFXFZkAdl9h6g4U5+LXUZtXMYnhIHUfoyMo5tS58aI7Dd8KvvwVVo4
    chDYABPPTHPbqjc1qCmBaZx2vN4Ye5DUys/vZwP9BFohFrH/6j/f3IL16/RZkiMN
    JCqVJUzKoZHm1Lesh3Sz8W2jmdv51b2EQJ8HmA==
    -----END CERTIFICATE-----

    -----BEGIN CERTIFICATE-----
    MIIDjjCCAnagAwIBAgIQAzrx5qcRqaC7KGSxHQn65TANBgkqhkiG9w0BAQsFADBh
    MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
    d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH
    MjAeFw0xMzA4MDExMjAwMDBaFw0zODAxMTUxMjAwMDBaMGExCzAJBgNVBAYTAlVT
    MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j
    b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IEcyMIIBIjANBgkqhkiG
    9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzfNNNx7a8myaJCtSnX/RrohCgiN9RlUyfuI
    2/Ou8jqJkTx65qsGGmvPrC3oXgkkRLpimn7Wo6h+4FR1IAWsULecYxpsMNzaHxmx
    1x7e/dfgy5SDN67sH0NO3Xss0r0upS/kqbitOtSZpLYl6ZtrAGCSYP9PIUkY92eQ
    q2EGnI/yuum06ZIya7XzV+hdG82MHauVBJVJ8zUtluNJbd134/tJS7SsVQepj5Wz
    tCO7TG1F8PapspUwtP1MVYwnSlcUfIKdzXOS0xZKBgyMUNGPHgm+F6HmIcr9g+UQ
    vIOlCsRnKPZzFBQ9RnbDhxSJITRNrw9FDKZJobq7nMWxM4MphQIDAQABo0IwQDAP
    BgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNVHQ4EFgQUTiJUIBiV
    5uNu5g/6+rkS7QYXjzkwDQYJKoZIhvcNAQELBQADggEBAGBnKJRvDkhj6zHd6mcY
    1Yl9PMWLSn/pvtsrF9+wX3N3KjITOYFnQoQj8kVnNeyIv/iPsGEMNKSuIEyExtv4
    NeF22d+mQrvHRAiGfzZ0JFrabA0UWTW98kndth/Jsw1HKj2ZL7tcu7XUIOGZX1NG
    Fdtom/DzMNU+MeKNhJ7jitralj41E6Vf8PlwUHBHQRFXGU7Aj64GxJUTFy8bJZ91
    8rGOmaFvE7FBcf6IKshPECBV1/MUReXgRPTqh5Uykw7+U0b6LJ3/iyK5S9kJRaTe
    pLiaWN0bfVKfjllDiIGknibVb63dDcY3fe0Dkhvld1927jyNxF1WW6LZZm6zNTfl
    MrY=
    -----END CERTIFICATE-----
    ```

## Next steps

With connectivity confirmed, complete the [key exchange](zmk_exchange.md) if you are using the ISO
8583 interface, then continue to the [Protocol](macusage.md) chapter.
