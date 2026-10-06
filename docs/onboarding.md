# Connectivity overview and checklist

This chapter covers everything required to establish a working, trusted connection to STS, before any
application messages are exchanged. It is the longest-lead part of an integration because several
steps depend on work performed by Stø.

Perform the whole procedure once per [environment](environments.md). Preproduction first.

## Checklist

Steps 1–3 apply to both interfaces. Step 4 applies to the ISO 8583 interface only.

- [ ] **1. Submit source IP addresses** — see [below](#source-ip-addresses)
- [ ] **2. Obtain a client certificate** — see [Mutual TLS](mtls_configuration.md)
- [ ] **3. Run the connectivity test** — see [Connectivity test](connectivity_test.md)
- [ ] **4. Complete key exchange** — see [Key exchange](zmk_exchange.md)

Steps 1 and 2 can run in parallel; both must complete before step 3, since the firewall and the
certificate are checked together. Step 4 is independent of steps 1–3 and should be started early in
production, where courier delivery of key components sets the pace.

## Source IP addresses

Submit the source IP address, or addresses, from which your host will connect. Stø adds them to the
firewall allow list for that environment. Traffic from any other address is rejected before it
reaches the service.

!!! warning "Notify Stø before changing source IPs"

    Any change to your source IP addresses must be communicated to Stø in advance. An unannounced
    change will cause all traffic to be blocked.

## What happens next

Once connectivity is established the APIs are reachable, and — for the ISO 8583 interface — a set of
keys is in place to protect message integrity and authenticity. From there, continue to the
[Protocol](macusage.md) chapter.

## Support

Integration is a cooperative process that expects continuous communication between Stø and the
integrator. Contact the Stø Token Service support team at any point in this procedure.
