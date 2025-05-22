# List of ISO messages supported

## 1100 –Detokenization request to the Cloud TSP

The remote Host is using this message for requesting the Cloud TSP to detokenize a message.
During the message processing, the Cloud TSP is processing:

* Token domain restriction Controls checks based on the type of token
* Detokenization

Note: This message corresponds to the “Token Authorization Request” message in the ‘EMV Payment Tokenisation Specification Technical Framework v2.0”.

## 1110 - Detokenization request response from the Cloud TSP

The Cloud TSP uses this message for communicating the result of the detokenization request
message.

It may be either

* Communicating that the detokenization has failed
* Communicating the PAN, PAN related data associated to the token, proprietary data and token-related data
* Depending of the type of payment transaction, check chip data in relation with the token

Note: This message corresponds to the “PAN Authorization Request” message in the ‘EMV Payment
Tokenisation Specification Technical Framework v2.0”.

## 1120 - Transaction Advice communication to the Cloud TSP (re-
tokenization)

The remote Host is using this message, for communicating the result of the transaction processing to
the Cloud TSP and to request the Cloud TSP to retokenize a message.

The result of transaction processing may be either

* ‘transaction approved’,
* ‘transaction declined’
*  or transaction previously approved is reversed’.

During the message processing, the Cloud TSP is processing:

* Check related to the PAN value communicated
* Send notification message to the wallet
* Retokenization
* Depending of the type of payment transaction, check chip data in relation with the token

Note: This message corresponds to the “PAN Authorization Response” message in the ‘EMV
Payment Tokenisation Specification Technical Framework v2.0”.

## 1130 - Transaction Advice communication response from the Cloud TSP (re-tokenization)

The Cloud TSP uses this message for communicating the result of the Transaction Advice
communication request message.

It may be either
* Failure to retrieve information related to the associated detokenization request transaction in the Transaction History File managed by the TSP
* Communicating that the retokenization has failed
* Communicating the Token and Token related data associated to the PAN for the current type  of transaction and the chip data generated

Note: This message corresponds to the “Token Authorization Response” message in the ‘EMV
Payment Tokenisation Specification Technical Framework v2.0”.
