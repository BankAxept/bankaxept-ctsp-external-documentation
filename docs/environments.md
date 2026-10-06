# Environments and endpoints

STS provides two environments. They are configured independently: the full
[connectivity procedure](onboarding.md) — IP allow-listing, certificate issuance, connectivity test
and key exchange — is performed separately for each.

| | Preproduction | Production |
|---|---|---|
| **Hostname** | `ctsp-proc-pp.baxlab.no` | `tx.ctsp.stoe.no` |
| **Purpose** | Development and integration testing | Live transactions |
| **Support logging** | Detailed log information available from support | Restricted |
| **Security relaxations** | Possible during initial integration, by agreement | None |
| **ZMK delivery** | Secure email or other agreed secure means | Courier, to separate key custodians |

## Endpoints

Both environments expose the same paths.

### Healthcheck

```
GET https://<hostname>/gtotx/api/healthcheck
```

Returns `204 No Content` when the service is available. Used for the
[connectivity test](connectivity_test.md) and for ongoing monitoring.

!!! warning "Do not poll more than once per minute"

    The healthcheck is intended for periodic peer-to-peer connectivity checking, not for
    high-frequency probing.

A deprecated variant at `/gtotx/api/iso/healthcheck` returns `200 OK` with a `text/html` body. Do not
use it in new integrations.

### ISO 8583 messages

```
POST https://<hostname>/gtotx/api/iso/<scheme>/v10/msg/<processor>
```

The `<scheme>` and `<processor>` path segments are assigned to you by Stø. The actual URL is provided
during onboarding — do not assume values from the examples in this documentation.

## Access requirements

Both environments are firewalled. A request will not reach the service unless:

* the source IP address is on the allow list for that environment, and
* the request presents a valid client certificate issued by Stø for that environment.

Certificates are environment-specific. A preproduction certificate will not authenticate against
production.

## Preproduction constraints

During initial integration, one or more security features can be disabled in preproduction to ease
the process. This is agreed case by case with Stø and applies to preproduction only — production
always enforces the full set.
