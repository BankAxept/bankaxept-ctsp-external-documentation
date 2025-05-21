# Requests validation by TSP

TSP performs a number of verifications on reception of 1100 and 1120 request messages using
information available at TSP level.

## TSP Database

When processing a message request, the TSP is using as a database either

* Token Information stored in the token vault or
* Transaction History File that log information related to transactions previously detokenized in last 18 months.
The retrieval of transaction in the Transaction History File is performed using an index composed of ‘Retrieval reference number + Transaction Date and Time’ corresponding to the concatenation of the field 37 value and field 07 value present in the origin transaction.
The type of “database” used by the TSP is depending on the type of request message.

## 1100 –Detokenization request to the Cloud TSP

The TSP is capable to process two types of de-tokenization request:

* Type 1 – Detokenization request related to a new transaction: the detokenization has to be performed based on token vault data.
* Type 2 - Detokenization request related to a transaction already performed: the detokenization is based on TSP Transaction History File.

For “type 1” transactions, the Processing Code (field 03) Position 1-2 always equal to “00” (purchase)

The “type 2” transactions are the transactions with Processing Code (field 03) Position 1-2 equals to one of the following values

* 20: Refunds
* 22: Credit reversal
* 52: Credit – return of goods
* 92: Confirmation of a pre-authorization

Note 1: With these 4 types of transaction, the presence of field 55 in the detokenization request message is optional when the transaction is a chip transaction.
Note 2: 1100 is optional for these use cases. The 1120 message (Advise) can be sent without 1100 if detokenization, meaning PAN knowledge, is not required.

### 1120 - Transaction Advice communication to the Cloud TSP (re-tokenization)

The TSP looks up a detokenization request in TSP Transaction History File by using TDT+RRN value as transaction ID. The token tied to the transaction ID is used to look up PAN in token vault. TSP checks PAN in token vault matches PAN in 1120 – Advice Message else an error is returned in Advice response

## Verification on 1100 –Detokenization request to the Cloud TSP

### HCE verification flow

**Note**: this flow applies to any digital wallet that is based on host-card-emulation (HCE) framework and applies software security measures such as single-use-key. Such wallets include Samsung Pay, Google Pay, and proprietary HCE wallets.

