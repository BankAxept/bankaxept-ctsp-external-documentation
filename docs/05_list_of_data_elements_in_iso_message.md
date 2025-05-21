# List of data elements in ISO messages

| Field | Description                                                                                                                                | 1100        | 1110         | 1120 | 1130    |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------|-------------|--------------|------|---------|
| 02    | Primary Account Number <br/> - Token value <br>  - PAN value                                                                               | <br/>M      | C5           | C4   | <br/>C1 |
| 03    | Processing Code                                                                                                                            | M           |              | M    |         |
| 04    | Transaction Amount                                                                                                                         | M           | -            | M    | -       |
| 07    | Transaction Date and Time                                                                                                                  | M           | -            | M    | -       |
| 14    | Expiration Date <br/> - Token Expiration Date value <br/> - PAN Expiration Date value                                                      | <br/>M      | C5           | C4   | <br/>C1 |
| 18    | Merchant Type                                                                                                                              | M*          | -            | M*   | -       |
| 19    | Acquiring Institution Country Code                                                                                                         | M*          | -            | M*   | -       |
| 22    | POS Data                                                                                                                                   | M           | -            | M    | -       |
| 23    | Card Sequence Number                                                                                                                       | C6          | -            | O    | -       |
| 35    | Track2 Data <br/> PAN value is a Token value and CVV based on token value <br/> PAN value is accurate PAN value and CVV based on PAN value | <br/><br/>O | <br/><br/>C3 | C4   | -       |
|       |                                                                                                                                            |             | C3           | C4   | .       |
| 37    | Retrieval reference number                                                                                                                 | M           | C8           | M    | C8      |
| 39    | Action/Response Code <br> Cloud TSP message processing result                                                                              | -           | M            |      | M       |
|       | Issuer Authorization Response Code                                                                                                         |             |              | M    |         |
| 42    | Card Acceptor Identification Code                                                                                                          | M*          | -            | M*   | -       |
| 43    | Card Acceptor Name and Address                                                                                                             | M           | -            | M    | -       |
| 48    | Additional data, private                                                                                                                   | M           | M            | M    | M       |
| 49    | Transaction Currency Code                                                                                                                  | M           | -            | M    | -       |
| 55    | Chip Related Data                                                                                                                          | C2          | -            | -    | -       |
| 56    | Token Related Data                                                                                                                         | -           | C7           | -    | C7      |
| 64    | Message Authentication Code [MAC]                                                                                                          | M           | M            | M    | M       |

Table 4 – Fields presence in ISO messages

| Code | Description                                                                                                                                                                                                                                                           |
|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| C1   | Present only when the Cloud TSP has processed the message request without error.                                                                                                                                                                                      |
| C2   | Required when the transaction is performed using a chip payment application \[Field 22 position 1 equals to 05, 07 or 08\] except for “Type 2” transactions described in section 6.1.1 \(for these types of transaction, the presence of field 55 is optional\).      |
| C3   | Present when Track2 Data is present in 1100 message. The value returned is using a PAN value that is either the echo of the PAN value present in the request message or the PAN value result of the detokenization \(For details, see 6 Requests validation by TSP\). |
| C4   | This field must be set to the value of the equivalent parameter present in the de-tokenization response \(1110\) message.                                                                                                                                             |
| C5   | This field is always present. Its value may be either the echo of the value present in the request message or the PAN-related value result of the detokenization \(For details, see 6 Requests validation by TSP\).                                                   |
| C6   | Presence recommended when Field 55 is present \(when not present, the TSP must use the ‘00’ default value in cryptographic algorithm\).                                                                                                                               |
| C7   | Presence is depending on project business requirements.                                                                                                                                                                                                               |
| C8   | Presence is depending on project business requirements.                                                                                                                                                                                                               |
| M    | Mandatory.                                                                                                                                                                                                                                                            |
| M\*  | Field currently mandatory. Proposition: If these fields are not currently used, they may be either removed from the document or become optional.                                                                                                                      |

