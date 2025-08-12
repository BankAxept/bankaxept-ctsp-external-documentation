# Thales - ISO 8583 Interface with Cloud TSP

Confidential information of Thales
NO WARRANTIES OF ANY NATURE ARE EXTENDED BY THIS DOCUMENT. Any product and related material
disclosed herein are only furnished pursuant and subject to the terms and conditions of a duly executed
License or Agreement related to this Specification. The only warranties made by Thales , if any, with respect
to the products described in this document are set forth in such Licence or Agreement. Thales cannot accept
any financial or other responsibility that may be the result of your use of the information or soft ware material,
including direct, indirect, special or consequential damages.

You should be careful to ensure that the use of this information and/or software material complies with the
laws, rules, and regulations of the jurisdictions with respect to which it is used. All rights reserved.
Copyright © 202 1 Thales .

# Table of Contents

- [Revision status](#revision-status)
- [Introduction](#1-introduction)
  - [Scope](#11-scope)
  - [Audience](#12-audience)
  - [Reference documents](#13-reference-documents)
- [Communication channel between a remote host and the Cloud TSP](#2-communication-channel-between-a-remote-host-and-the-cloud-tsp)
- [Structure and Content of Messages](#3-structure-and-content-of-messages)
  - [Overview of the message structure](#31-overview-of-the-message-structure)
  - [Header](#32-header)
  - [Message type](#33-message-type)
  - [Primary Bitmap](#34-primary-bitmap)
  - [Data Elements Fields attributes](#35-data-elements-fields-attributes)
  - [Data Elements Coding](#36-data-elements-coding)
- [List of ISO messages supported](#4-list-of-iso-messages-supported)
  - [1100 – Detokenization request to the Cloud TSP](#41-1100--detokenization-request-to-the-cloud-tsp)
  - [1110 – Detokenization request response from the Cloud TSP](#42-1110---detokenization-request-response-from-the-cloud-tsp)
  - [1120 – Transaction Advice communication to the Cloud TSP (re-tokenization)](#43-1120---transaction-advice-communication-to-the-cloud-tsp-re-)
  - [1130 – Transaction Advice communication response from the Cloud TSP (re-tokenization)](#44-1130--transaction-advice-communication-response-from-the-cloud-tsp-re-tokenization)
  - [List of data elements in ISO messages](#5-list-of-data-elements-in-iso-messages)
- [Requests validation by TSP](#6-requests-validation-by-tsp)
  - [TSP Database](#61-tsp-database)
    - [1100 – Detokenization request to the Cloud TSP](#611-1100--detokenization-request-to-the-cloud-tsp)
    - [1120 – Transaction Advice communication to the Cloud TSP (re-tokenization)](#612-1120---transaction-advice-communication-to-the-cloud-tsp-re-tokenization)
  - [Verification of 1100 – Detokenization request to the Cloud TSP](#62-verification-on-1100-detokenization-request-to-the-cloud-tsp)
    - [HCE verification flow](#621-hce-verification-flow)
    - [Secure Element verification flow](#622-secure-element-based-verification-flow)
    - [In-app payment cloud cryptogram verification flow](#623-in-app-payment-cloud-cryptogram-verification-flow)
  - [Verification of 1120 – Transaction Advice communication to the Cloud TSP (re-tokenization)](#63-verification-on-1120---transaction-advice-communication-to-the-cloud-tsp-re-tokenization)
- [Message Data Elements Description](#7-message-data-elements-description)
- [Appendix](#8-appendix)
  - [Token Assurance Method codification](#81-token-assurance-method-codification)
  - [Storage Type](#82-storage-type)
  - [Connectivity Requirements](#83-connectivity-requirements)
    - [TLS Authentication](#831-tls-authentication-https)
    - [MAC usage](#833-mac-usage)
  - [MAC Details](#84-mac-details)
    - [Message transformations](#841-message-transformations)
    - [MAC Algorithm](#842-mac-algorithms)
    - [MAC key protection alternatives](#843-mac-key-protection-alternatives)
    - [Key Interchange](#844-key-interchange)
    - [MAC key](#845-mac-key)
    - [MAC](#846-mac)
    - [Keys type and algorithms – 3DES](#847-keys-type-and-algorithms---3des)
    - [Keys type and algorithms – AES](#848-keys-type-and-algorithms---aes)
  - [Healthcheck Interface](#85-healthcheck-interface)
  - [ISO interface](#86-iso-interface)
  - [ISO8583 request/response examples](#87-iso8583-requestresponse-examples)

# Table List

Table 1 - MESSAGE STRUCTURE
Table 2 - MESSAGE HEADER
Table 3 - LIST OF ISO MESSAGES SUPPORTED
Table 4 - FIELDS PRESENCE IN ISO MESSAGES

# Revision status

| Revision | Date       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|----------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0      | 09/02/2018 | Initial version                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 1.1      | 06/03/2018 | Simplified ISO header message by leveraging on HTTP capabilities + healthcheck + examples + correction in §4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 1.2      | 13/03/2018 | Correction on examples                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 1.3      | 27/06/2018 | Changes done: <br/> * Chapter 5 added to describe PAN delivery and error code handling. <br/> * Additional info in field 56 – Token Related Data (walletID + device information) <br/> * Local time fields removed <br/> * Additional transaction types in field 03                                                                                                                                                                                                                                                                                                                           |
| 1.4      | 28/06/2018 | Clarification in section 5.2 and 5.3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 1.5      | 03/09/2018 | Additional comment on walletID value <br/> Correction on error codes in paragraph 5.2 to make it consistent with 6.12 <br/> Correction on device information field                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1.6      | 28/09/2018 | Clarifications on fields coding. <br/> Device information field is split in two fields brand & model                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 1.7      | 19/10/2018 | Examples added at the end of the doc <br/> Correction on DE48 and DE56 description <br/> Clarification on error code management in DE39 description                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 1.8      | 18/12/2018 | Correction on ATC check order in 1100 validation sequence (6.2) and other checks in 1120 (6.3) <br/> Additional details on error code management <br/> Add-ons in several sections to specify reversal use case notification                                                                                                                                                                                                                                                                                                                                                                  |
| 1.9      | 22/06/2020 | Updated the Advice message validations (4.1, 4.2, and 7.12) to: <br/> * Include the recence changes on reversal <br/> * Align the other validation responses and actions with the implementation <br/> Added one more processing code ´52´, for Credit -Return of Goods (7.2) <br/> Added a new data id “006” - Transaction Category Code (TCC) data in Field 48 (7.15).                                                                                                                                                                                                                      |
| 2.0      | 24/06/2020 | The following updates apply: <br/> 6.1.1: <br/> * Specified verificatioin flow for PURE. <br/> * Added check in case of Transit with ATC negative window <br/> * Added check in TVR in case of CDA faiure <br/> 6.1.2: <br/> * Specified verification flow for Apple Pay Applet <br/> 7.6: specified Merchant Type codes <br/> 7.12: added a new response code in case of CDA failure                                                                                                                                                                                                         |
| 2.1      | 09/07/2020 | Updates after review by TSP team and Bancomat: <br/> * Terminology updated (generic terms used for PURE and Apple Pay: HCE in the first case and Secure-Element in the second). <br/> * ATC check logic updated. <br/> * TVR check removed. <br/> * 7.6: added reference to ISO 18245 for compliancy. <br/> Logo and Gemalto references updated to Thales.                                                                                                                                                                                                                                    |
| 2.2      | 16/07/2020 | Explicit the full condition on ATC check for transit case in 6.2.1 and 6.2.2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2.3      | 21/05/2021 | - Included DE37 (retrival reference number) in the 1110/1130 messages as conditional presence depending on the project business requirement. <br/> - Added a new subfield “005” (token value) in DE56 of 1110/1130 message <br/> - Added a new subfield “009” (token requestor ID) in DE56 of 1110/1130 message                                                                                                                                                                                                                                                                               |
| 2.4      | 12/07/2021 | The following updates apply: <br/> - 8.3.2: added content type description of the HTTP request <br/> - 8.4.3: added the support of SHA-1 hash. Such support is subject to special request <br/> - 8.4.4: added more details regarding the padding method of the MAC                                                                                                                                                                                                                                                                                                                           |
| 2.5      | 29/09/2022 | Section 1 – Renamed to Introduction and reedited <br/> Section 1.2, 1.3 – Added <br/> Section 2 – Moved as standalone chapter from section <br/> Section 6.2.3 – Added In-app payment cloud cryptogram verification flow <br/> Section 7.12 – Added error codes ‘017’, ‘018’ and ‘019’ <br/> Section 7.15 – Editorial changes <br/> Section 7.18 – Added tags `10` (Device type) and `11` (Token type) as RFU <br/> Section 8.3.2 – Editorial changes <br/> Section 8.4 – Editorial changes <br/> Section 8.4.1 – Editorial changes <br/> Section 8.4.4 – Added ECB in MAC Key wrapping <br/> |
| 2.6      | 06/02/2023 | Section 7.2 – Add transaction type code 36 <br/> Section 7.5 – Added new field 12 Date and time local transaction <br/> Section 7.19 – Added tags, 10, 11 and 12 <br/> Section 8.4 – Clearifications on MAC details <br/> Section 8.4 – Include new option for AES in MAC                                                                                                                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2.7      | 07/08/2023 | Section 7.6 – Add support for unknown token expiry from processor <br/> Section 8.3 removed VPN section as it is not supported. <br/> Section 7.5 Clarification on field 12 <br/> Section 8.5 Details about health check <br/> Section 8.6 Corrected URL scheme <br/> unified dateformat in revision                                                                                                                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2.8      | 07/08/2023 | Section 8.7 – Update examples with currently supported message format. <br/> Section 7.18 Move details about tags to appendix.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                                                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

# 1 Introduction

The Cloud Token Service Provider is a payment tokenization service providing EMV tokenization or PCI tokenization.

## 1.1 Scope

The present document describes the format of messages exchanged between Cloud TSP and a remote Host (Acquirer server or Bank server).

## 1.2 Audience

The audience of this documents is:

    * POS aggregators connecting to the detokenization interface of the Cloud TSP service
    * Payment systems implementing tokenization

## 1.3 Reference documents

    * BankAxept. Cloud TSP In-app payment cloud cryptogram.

# 2 Communication channel between a remote host and the Cloud TSP

The communication channel is specific to each project and must established a secure channel (see 8.3 Connectivity Requirements)

The messages exchanged through this interface are based on ISO 8583 norm. Using this norm, the message content formats and length vary according to the message exchanged.

This document provides a description of thes messages (message structure and the data elements contained in these messages).

# 3 Structure and Content of Messages

## 3.1 Overview of the message structure

HTTP is used as transport layer for carrying ISO message payload. HTTP header includes a unique
transaction ID for a given request and some information related to the payload. HTTP body contains
ISO Message Type, Bitmap and Data Elements encoded in base64.

| HTTP Header |                                                                   |
|-------------|-------------------------------------------------------------------|
| tid         | Transaction ID. Unique ID of the request                          |
| header      | Information about the request/response. As described in document. |

| HTTP body |                                                                  |
|-----------|------------------------------------------------------------------|
| Payload   | Base64 encoded ISO8583 (Message Type, Bitmap and Data Elements). |

Header format is detailed hereafter in this document.

Payload includes information specified in table below. Each part is detailed in this document.

| Offset | Length   | Information                                                    |
|--------|----------|----------------------------------------------------------------|
| 1      | 4        | Message Type                                                   |
| 5      | 8        | Primary Bitmap                                                 |
| 13     | variable | Data Elements (may include the secondary bitmap in field n° 1) |

Table 1: Message Structure

## 3.2 Header

The header is required in all messages. The header value is 8 bytes length.
It has the following format:

| Position | Content                                                                                                                                                                                                                                                                                                                           |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| 1        | **Request** <br>Indicates the product associated with the message  <br>‘3’ = Interface with an Acquiring Host (for processing Card Present transaction with the issuer) <br>‘4’ = Interface with an Acquiring Host (for processing Card Not Present transaction with the Issuer) <br> ‘5’ = Interface with an Authorization HOST. |
|          | **Response** <br> Value is echoed back in response.                                                                                                                                                                                                                                                                               |
| 2 - 5    | **Request** <br> Release & version of the protocol. <br> 1000: version 1                                                                                                                                                                                                                                                          | 
|          | **Response** <br> Value is echoed back in response.                                                                                                                                                                                                                                                                               |
| 6 - 8    | **Request** <br> Always set to 000.                                                                                                                                                                                                                                                                                               |
|          | **Response** <br> When Cloud TSP rejects a message for format error, this element contains the number of the first erroneous data element. Otherwise, this element contains: ‘000’.                                                                                                                                               |

Table 2 – Message Header

## 3.3 Message type

The message type is an element of 4 positions serving to identify the general function of the
message. This element is mandatory in all the messages.

The following messages are exchanged between Cloud TSP and the remote Host:

| Message | Description                                                                     |
|---------|---------------------------------------------------------------------------------|
| 1100    | Detokenization request to the Cloud TSP.                                        |
| 1110    | Detokenization request response from the Cloud TSP.                             |
| 1120    | Transaction Advice communication to the Cloud TSP (re-tokenization).            |
| 1130    | Transaction Advice communication response from the Cloud TSP (re-tokenization). |

Table 3 – List of ISO messages supported

## 3.4 Primary Bitmap

The ISO 8583/1993-12-15 uses a messages scheme by bits vector or ‘‘bit maps’’. The bitmap
structure indicates the presence or absence of data element _(‘1’ inside the bitmap indicates the
element is present, while ‘0’ indicates the element is absent)_. The bytes in the bitmap are numbered
from left to right.

The message may support several bitmaps each one has 8 bytes length (64-bit string contained within
an eight-byte data element), can be used in the messages exchanged with Cloud TSP.

* A primary bitmap indicates the presence of fields from 1 to 64.
* A secondary bitmap indicates the presence of fields from 65 to 128.

The primary bitmap is required in all the messages. The secondary bitmap is included in the message if at least one
field in the interval 65 to 128 is present. The presence of the secondary bitmap is signaled by setting the first bit of
the primary bitmap _(The leftmost bit)_ to 1. In the current version of this document the data elements referenced in
the secondary bitmap are not used.

    Example:
    
    11 00 72 04 66 00 08 61 82 01
    
    11 00 Message type = detokenization request)
    72 04 66 00 08 61 82 01 Bitmap
    Bitmap in binary
    0111 0010 0000 0100    (7204 hex)
    0110 0110 0000 0000    (6600 hex)
    0000 1000 0110 0001    (0861 hex)
    1000 0010 0000 0001    (8201 hex)

Leftmost bit is equal to zero meaning there is a single bitmap.

Then the position of each bit after leftmost bit corresponds to a data
element number. The bit value indicates if DE is present (bit=1) or not
(bit=0)

|                 |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
|-----------------|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| 2nd bitmap ind. | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| 0               | 1  | 1  | 1  | 0  | 0  | 1  | 0  | 0  | 0  | 0  | 0  | 0  | 1  | 0  | 0  |
| 17              | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 |
| 0               | 1  | 1  | 0  | 0  | 1  | 1  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  |
| 33              | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 |
| 0               | 0  | 0  | 0  | 1  | 0  | 0  | 0  | 0  | 1  | 1  | 0  | 0  | 0  | 0  | 1  |
| 49              | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 |
| 1               | 0  | 0  | 0  | 0  | 0  | 1  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 1  |

## 3.5 Data Elements Fields attributes

For each Data Element some attributes are specified according to a particular naming described
hereafter.

The values below used to represent the data elements type:

| Code | Description                                                    |
|------|----------------------------------------------------------------|
| a    | Alphabetic characters A-Z and a-z                              |
| n    | Numeric characters 0-9                                         |
| an   | Alphanumeric characters A-Z, a-z and 0-9                       |
| ans  | Alphanumeric characters A-Z, a-z, 0-9, space and special chars |
| ns   | Numeric characters 0-9 and space character                     |
| b    | Binary field                                                   |
| MM   | Month                                                          |
| DD   | Day                                                            |
| YY   | Year                                                           |
| hh   | Hour                                                           |
| mm   | Minute                                                         |
| ss   | Seconds                                                        |

The data element containing a data field may have either a fixed length or a variable length.

* Fields with a fixed length are presented by their type followed by the length

  Example:

        an-3 means 3 alphanumeric characters (eg: ab8).
        n-5 means 5 digits (eg: 12345).
        b-10 means 10 hexadecimal numbers (eg: F8 A5 07 …etc).

* Fields with a variable length are presented by their type followed by 2 points, followed by the length.

  Example:

        an..25 means variable length, up to 25 alphanumeric characters.

The description of the length follows a particular naming as well. The number of digits
needed to express the length value in decimal is specified in this document as per example
below:

    LLVAR = variable length field using 2 digits for length information.
    LLLVAR = variable length field using 3 digits for length information.

## 3.6 Data Elements Coding

Fields with a fixed length:

A length field is not included in ISO message for the field having a fixed length. Only the field
value is present in ISO message.

Fields with a variable length:

A field length is included, followed by the field value for data elements with a variable length.
The length is coded in hexadecimal on 1 byte. So the maximum value for length is 255.
All the data elements in this document are specified as being numeric (type n), alphanumeric
(type a, a, and ans) or binary (type b).

#### Numeric field

This field is bcd encoded. The length is expressed as a number of nibbles (half byte). When the
length is an odd value, the leftmost nible must be ignored. It is used only for padding and equal to
zero.

Example:

    Field n° 02 – Primary Account Number
    Attribute: n..19
    Coding: 11 01 23 45 67 89 01 23 45 67
    Length: 11 hex = 17 dec = 17 digits
    PAN: 1 2345 6789 0123 4567

#### Alphanumeric field

This field is ASCII encoded. The length is expressed as a number of ASCII characters meaning a
number of bytes.

Example:

    Field n° 43 – Card Acceptor Name and Address
    Attribute: ans-55
    Coding: 42 41 58 20 54 65 73 74 20 20 20 20 20 20 20 20 20 20 20 20 20 20 2f 20 20 20 20 20 2f 50 61 72 69 73 20 20 20
    20 20 20 20 20 20 20 20 20 20 20 20 20 20 2f 46 52 20
    
    Length: not specified since fixed length always equal to 55 characters (55 bytes)
    
    Value: "BAX Test / /Paris /FR "

#### Binary field

This field is encoded in hexa. The length is expressed as a number of bytes.

Example:

    Field n° 55 – Chip Related Data
    Attribute: LLVAR b…255
    Coding: 69 9f 02 06 00 00 00 00 21 00 9f 03 06 00 00 00 00 00 00 9f 1a 02 02 50 95 05 00 00 00 00 00 5f 2a 02 09 78 9a
    03 18 01 09 9c 01 00 9f 37 04 0f 01 0e 03 82 02 1a 80 9f 36 02 00 01 9f 10 20 0f a5 01 a0 81 01 00 00 ee af 28 c6 83 81
    c2 ed 0f 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 9f 26 08 a1 a7 17 06 5f f0 30 a3
    Length: 69 hex = 105 dec

# 4 List of ISO messages supported

## 4.1 1100 – Detokenization request to the Cloud TSP

The remote Host is using this message for requesting the Cloud TSP to detokenize a message.
During the message processing, the Cloud TSP is processing:

* Token domain restriction Controls checks based on the type of token
* Detokenization

Note: This message corresponds to the “Token Authorization Request” message in the ‘EMV Payment Tokenisation Specification Technical Framework v2.0”.

## 4.2 1110 - Detokenization request response from the Cloud TSP

The Cloud TSP uses this message for communicating the result of the detokenization request
message.

It may be either

* Communicating that the detokenization has failed
* Communicating the PAN, PAN related data associated to the token, proprietary data and token-related data
* Depending of the type of payment transaction, check chip data in relation with the token

Note: This message corresponds to the “PAN Authorization Request” message in the ‘EMV Payment
Tokenisation Specification Technical Framework v2.0”.

## 4.3 1120 - Transaction Advice communication to the Cloud TSP (re-
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

## 4.4 1130 -Transaction Advice communication response from the Cloud TSP (re-tokenization)

The Cloud TSP uses this message for communicating the result of the Transaction Advice
communication request message.

It may be either
* Failure to retrieve information related to the associated detokenization request transaction in the Transaction History File managed by the TSP
* Communicating that the retokenization has failed
* Communicating the Token and Token related data associated to the PAN for the current type  of transaction and the chip data generated

Note: This message corresponds to the “Token Authorization Response” message in the ‘EMV
Payment Tokenisation Specification Technical Framework v2.0”.

# 5 List of data elements in ISO messages

| Field | Description                                                                                                                                | 1100        | 1110         | 1120 | 1130   |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------|-------------|--------------|------|--------|
| 02    | Primary Account Number <br/> - Token value <br>  - PAN value                                                                               | <br/>M      | C5           | C4   | <br/>C1 |
| 03    | Processing Code                                                                                                                            | M           |              | M    |        |
| 04    | Transaction Amount                                                                                                                         | M           | -            | M    | -      |
| 07    | Transaction Date and Time                                                                                                                  | M           | -            | M    | -      |
| 12    | Date and Time Local Transaction                                                                                                            | O           | C9           | O    | C9     |
| 14    | Expiration Date <br/> - Token Expiration Date value <br/> - PAN Expiration Date value                                                      | M           | C5           | C4   | C1     |
| 18    | Merchant Type                                                                                                                              | M*          | -            | M*   | -      |
| 19    | Acquiring Institution Country Code                                                                                                         | M*          | -            | M*   | -      |
| 22    | POS Data                                                                                                                                   | M           | -            | M    | -      |
| 23    | Card Sequence Number                                                                                                                       | C6          | -            | O    | -      |
| 35    | Track2 Data <br/> PAN value is a Token value and CVV based on token value <br/> PAN value is accurate PAN value and CVV based on PAN value | <br/><br/>O | <br/><br/>C3 | C4   | -      |
|       |                                                                                                                                            |             | C3           | C4   | .      |
| 37    | Retrieval reference number                                                                                                                 | M           | C8           | M    | C8     |
| 39    | Action/Response Code <br> Cloud TSP message processing result                                                                              | -           | M            |      | M      |
|       | Issuer Authorization Response Code                                                                                                         |             |              | M    |        |
| 42    | Card Acceptor Identification Code                                                                                                          | M*          | -            | M*   | -      |
| 43    | Card Acceptor Name and Address                                                                                                             | M           | -            | M    | -      |
| 48    | Additional data, private                                                                                                                   | M           | M            | M    | M      |
| 49    | Transaction Currency Code                                                                                                                  | M           | -            | M    | -      |
| 55    | Chip Related Data                                                                                                                          | C2          | -            | -    | -      |
| 56    | Token Related Data                                                                                                                         | -           | C7           | -    | C7     |
| 64    | Message Authentication Code [MAC]                                                                                                          | M           | M            | M    | M      |

Table 4 – Fields presence in ISO messages

| Code | Description                                                                                                                                                                                                                                                              |
|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| C1   | Present only when the Cloud TSP has processed the message request without error.                                                                                                                                                                                         |
| C2   | required when the transaction is performed using a chip payment application \[Field 22 position 1 equals to 05, 07 or 08] except for “Type 2” transactions described in section 6.1.1 (for these types of transaction, the presence of field 55 is optional).            |
| C3   | Present when Track2 Data is present in 1100 message. The value returned is using a PAN value that is either the echo of the PAN value present in the request message or the PAN value result of the detokenization (For details, see 6 Requests validation by Cloud TSP) |
| C4   | This field must be set to the value of the equivalent parameter present in the de-tokenization response (1110) message.                                                                                                                                                  |
| C5   | This field is always present. Its value may be either the echo of the value present in the request message or the PAN-related value result of the detokenization (For details, see 6 Requests validation by Cloud TSP).                                                  |
| C6   | Presence recommended when Field 55 is present (when not present, the TSP must use the ‘00’ default value in cryptographic algorithm)                                                                                                                                     |
| C7   | Presence is depending on project business requirements.                                                                                                                                                                                                                  |
| C8   | Presence is depending on project business requirements.                                                                                                                                                                                                                  |
| C9   | Will be present in response, if present in request. The value will be verbatim.                                                                                                                                                                                          |
| M    | Mandatory.                                                                                                                                                                                                                                                               |
| M\*  | Field currently mandatory. Proposition: If these fields are not currently used, they may be either removed from the document or become optional.                                                                                                                         |

# 6 Requests validation by TSP

TSP performs a number of verifications on reception of 1100 and 1120 request messages using
information available at TSP level.

## 6.1 TSP Database

When processing a message request, the TSP is using as a database either

* Token Information stored in the token vault or
* Transaction History File that log information related to transactions previously detokenized in last 18 months.

The retrieval of transaction in the Transaction History File is performed using an index composed of ‘Retrieval
reference number + Transaction Date and Time’ corresponding to the concatenation of the field 37 value and field 07
value present in the origin transaction.

The type of “database” used by the TSP is depending on the type of request message.

### 6.1.1 1100 – Detokenization request to the Cloud TSP

The TSP is capable to process two types of de-tokenization request:

* Type 1 – Detokenization request related to a new transaction: the detokenization has to be performed based on token
  vault data.
* Type 2 - Detokenization request related to a transaction already performed: the detokenization is based on TSP
  Transaction History File.

For “type 1” transactions, the Processing Code (field 03) Position 1-2 always equal to “00” (purchase)

The “type 2” transactions are the transactions with Processing Code (field 03) Position 1-2 equals to one of the
following values

* 20: Refunds
* 22: Credit reversal
* 52: Credit – return of goods
* 92: Confirmation of a pre-authorization

Note 1: With these 4 types of transaction, the presence of field 55 in the detokenization request message is optional
when the transaction is a chip transaction.
Note 2: 1100 is optional for these use cases. The 1120 message (Advise) can be sent without 1100 if detokenization,
meaning PAN knowledge, is not required.

### 6.1.2 1120 - Transaction Advice communication to the Cloud TSP (re-tokenization)

The TSP looks up a detokenization request in TSP Transaction History File by using TDT+RRN value as transaction ID. The
token tied to the transaction ID is used to look up PAN in token vault. TSP checks PAN in token vault matches PAN in
1120 – Advice Message else an error is returned in Advice response

## 6.2 Verification on 1100 –Detokenization request to the Cloud TSP

### 6.2.1 HCE verification flow

**Note**: this flow applies to any digital wallet that is based on host-card-emulation (HCE) framework and applies
software security measures such as single-use-key. Such wallets include Samsung Pay, Google Pay, and proprietary HCE
wallets.

|         | TSP Check                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Field (02,14,35) | Field 39 value |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|----------------|
| **1**   | **General Message Structure checks**                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                  |                |
| 1.1     | Authorize client (mutual TLS / IP whitelist)                                                                                                                                                                                                                                                                                                                                                                                                                                                  | No message body  |                |
| 1.2     | Well formed HTTP request (mandatory HTTP headers...)                                                                                                                                                                                                                                                                                                                                                                                                                                          | No message body  |                |
| 1.3     | Validate header                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No message body  |                |
| 1.4     | Parse ISO request                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | No message body  |                |
| 1.5     | Validate processing code                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | No message body  |                |
| 1.6     | Find correct handler by MTI and processing code (error if not match is found)                                                                                                                                                                                                                                                                                                                                                                                                                 | No message body  |                |
| **2**   | **1100 Message checks**                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                  |                |
| 2.1     | Parse 1100 message                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | No message body  |                |
| 2.2     | Validate 1100 message                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | As request value | 006            |
| 2.3     | Verify MAC                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | No message body  |                |
| **3.1** | **Message processing – Token value check**                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                  |                |
| 3.1.1   | Is VC known for given DPAN in token vault                                                                                                                                                                                                                                                                                                                                                                                                                                                     | As request value | 003            |
| 3.1.2   | Is requestor authorized to access DPAN                                                                                                                                                                                                                                                                                                                                                                                                                                                        | As request value | 003            |
| 3.1.3   | Validate issuer, VC and card (status is active)                                                                                                                                                                                                                                                                                                                                                                                                                                               | As request value | 003            |
| 3.1.4   | Validate that VC and card has not expired                                                                                                                                                                                                                                                                                                                                                                                                                                                     | As request value | 001            |
| **3.2** | **Message processing – PURE transaction Data validation**                                                                                                                                                                                                                                                                                                                                                                                                                                     |                  |                |
| 3.2.1   | Validate format and version of field 55                                                                                                                                                                                                                                                                                                                                                                                                                                                       | PAN or Req (*)   | 015            |
| 3.2.2   | Validate ATC is not outside the ATC window <br/><br/>Check:<br/> * IF (TCC presence in DE48 AND equals to X) AND (MCC in DE18 is one of the values in 7.6), <br/> THEN Apply ATC negative window * Check ATC within the overall window (either positive or negative) that means check IF: Previous value + ATC negative window < ATC < Previous value + ATC window. <br/> ELSE, Check ATC within the positive window that means check IF: Previous value < ATC < Previous  value + ATC window | PAN or Req (*)   | 030            |
| 3.2.3   | Validate SUK key is associated to key index defined in Issuer Application Data.                                                                                                                                                                                                                                                                                                                                                                                                               | PAN or Req (*)   | 014            |
| 3.2.4   | Validate ARQC cryptogram                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | PAN or Req (*)   | 005            |
| 3.2.5   | Optional, for QR code only: Validate ARQC validity period                                                                                                                                                                                                                                                                                                                                                                                                                                     | PAN or Req (*)   | 016            |
| 3.2.6   | Validate if CDCVM cryptogram should be present: Verify that when CVR[2][8-6] = ‘100’ (or IAD[5][8-6]), CDCVM Stamp is different from 0000000000000000                                                                                                                                                                                                                                                                                                                                         | PAN or Req (*)   | 020            |
| 3.2.7   | Check CDCVM cryptogram when CDCVM Stamp is different from 0000000000000000 and when CVR[2][8-6] = ‘100’ (or IAD[5][8-6])                                                                                                                                                                                                                                                                                                                                                                      | PAN or Req (*)   | 021            |
| 3.2.8   | Validate that Cloud PIN stamp is not used (not supported in current version): when CVR[2][8-6] = ‘011’ (or IAD[5][8-6])                                                                                                                                                                                                                                                                                                                                                                       | PAN or Req (*)   | 029            |
| 3.2.9   | Reserved For Future use (not implemented) Validate if Cloud PIN stamp should be present                                                                                                                                                                                                                                                                                                                                                                                                       | PAN or Req (*)   | 024            |
| 3.2.10  | Reserved For Future use (not implemented) Check Cloud PIN stamp                                                                                                                                                                                                                                                                                                                                                                                                                               | PAN or Req (*)   | 024            |
|         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                  |                |
| 3.2.11  | Message verified OK                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | PAN              | 000            |

### 6.2.2 Secure Element-based verification flow

|         | TSP Check                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Field (02,14,35) | Field 39 value |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|----------------|
| **1**   | **General Message Structure checks**                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                  |                |
|         | Same as for 6.2.1                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                  |                |
| **2**   | **1100 Message checks**                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                  |                |
|         | Same as for 6.2.1                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                  |                |
| **3.1** | **Message processing – Token value check**                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                  |                |
|         | Same as for 6.2.1                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                  |                |
| **3.2** | **Message processing – Apple Pay Applet transaction Data validation**                                                                                                                                                                                                                                                                                                                                                                                                                      |                  |                |
| 3.2.1   | Validate format and version of field 55                                                                                                                                                                                                                                                                                                                                                                                                                                                    | PAN or Req (*)   | 015            |
| 3.2.2   | Validate ATC is not outside the ATC window <br/> Check: <br/> * IF (TCC presence in DE48 AND equals to X) AND (MCC in DE18 is one of the values in 7.6), THEN ** Apply ATC negative window *** Check ATC within the overall window (either positive or negative) that means check IF: Previous value + ATC negative window < ATC < Previous value + ATC window. <br/> • ELSE, Check ATC within the positive window that means check IF: Previous value < ATC < Previous value + ATC window | PAN or Req (*)   | 030            |
| 3.2.3   | Validate the key is associated to key index defined in Issuer Application Data.                                                                                                                                                                                                                                                                                                                                                                                                            | PAN or Req (*)   | 014            |
| 3.2.4   | Validate ARQC cryptogram                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | PAN or Req (*)   | 005            |
|         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                  |                |
| 3.2.6   | Message verified OK                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | PAN              | 000            |

(*) A TSP configuration parameter allows the support of two distinct rules related to the management of the field (02,
14, 35) value present in the response message.

* Option 1: The field (02, 14, 35) are using PAN value (result of the detokenization) only when all the TSP checks are
  passed (TSP action/response code equal to 000). In case of check failure (TSP action/response code different from
  000), the TSP echoes the value communicated in the request message.
* Option 2: The field (02, 14, 35) are using PAN value as soon as the detokenization process is successful. Therefore
  the field (02, 14, 35) are using PAN value even if one of the Token Domain Restriction checks (ei. field 55
  validation) fails (TSP action/response code not equal to one of the following values {001, 003, 006}).

This behavior (option 1 or option 2) is configurable per customer (domestic scheme or any closed loop environment).

### 6.2.3 In-app payment cloud cryptogram verification flow

The in-app payment cloud cryptograms is a functionality provided by Cloud TSP for PSD2 compliance. The overview of the
functionality and format of the cryptograms is described in (1).

This flow is enabled by a configuration per customer. For customers in which enabled, the identification of the
applicability of the flow is performed by Field 22, Sub-field 1 PAN Entry Mode being ´08´.

|         | TSP Check                                                                                                                                                                                                                                                                                                       | Field (02,14,35) | Field 39 value |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|----------------|
| **1**   | **General Message Structure checks**                                                                                                                                                                                                                                                                            |                  |                |
|         | Same as for 6.2.1                                                                                                                                                                                                                                                                                               |                  |                |
| **2**   | **1100 Message checks**                                                                                                                                                                                                                                                                                         |                  |                |
|         | Same as for 6.2.1                                                                                                                                                                                                                                                                                               |                  |                |
| **3.1** | **Message processing – Token value check**                                                                                                                                                                                                                                                                      |                  |                |
|         | Same as for 6.2.1                                                                                                                                                                                                                                                                                               |                  |                |
| **3.2** | **Message processing – In-App payment cloud cryptogram transaction Data validation**                                                                                                                                                                                                                            |                  |                |
| 3.2.1   | Validate format and version of field 55                                                                                                                                                                                                                                                                         | PAN or Req (*)   | 015            |
| 3.2.2   | Validate format of cryptogram in tag C4                                                                                                                                                                                                                                                                         | PAN or Req (*)   | 015            |
| 3.2.3   | Validate Version (tag C5 of cryptogram in tag C4)                                                                                                                                                                                                                                                               | PAN or Req (*)   | 015            |
| 3.2.4   | Validate ATC (tag 9F36 of cryptogram in tag C4) is not outside the ATC window <br/> Check ATC within the positive window that means check IF: Previous value < ATC < Previous value + ATC window                                                                                                                | PAN or Req (*)   | 030            |
| 3.2.5   | Validate the LVR (tag C5 of cryptogram in tag C4) against allowed values                                                                                                                                                                                                                                        | PAN or Req (*)   | 019            |
| 3.2.6   | Validate “Transaction Currency Code” (tag 5F2A of cryptogram in tag C4)                                                                                                                                                                                                                                         | PAN or Req (*)   | 018            |
| 3.2.7   | Being: <br/> * amount_field, the “Amount, Authorised” in field 4; and <br/>  amount_crypto, the “Amount, Authorised” in tag 9F02 of cryptogram in tag C4 <br/> p, the percentage above the consented amount that will be allowed for authorisation br/> Verify that 0 ≤ amount_field ≤ (1 + 𝑝) x amount_crypto | PAN or Req (*)   | 017            |
| 3.2.8   | Validate the key associated to DKI (tag C5 of cryptogram in tag C4)                                                                                                                                                                                                                                             | PAN or Req (*)   | 018            |
| 3.2.9   | Validate cryptographically the Authentication value (tag C5 of cryptogram in tag C4)                                                                                                                                                                                                                            | PAN or Req (*)   | 018            |
| 3.2.6   | Message verified OK                                                                                                                                                                                                                                                                                             | PAN              | 000            |

(*) A TSP configuration parameter allows the support of two distinct rules related to the management of the field (02,
14, 35) value present in the response message.

* Option 1: The field (02, 14, 35) are using PAN value (result of the detokenization) only when all the TSP checks are
  passed (TSP action/response code equal to 000). In case of check failure (TSP action/response code different from
  000), the TSP echoes the value communicated in the request message.

* Option 2: The field (02, 14, 35) are using PAN value as soon as the detokenization process is successful. Therefore
  the field (02, 14, 35) are using PAN value even if one of the Token Domain Restriction checks (ei. field 55
  validation) fails (TSP action/response code not equal to one of the following values {001, 003, 006}).

This behavior (option 1 or option 2) is configurable per customer (domestic scheme or any closed loop environment)

## 6.3 Verification on 1120 - Transaction Advice communication to the Cloud TSP (re-tokenization)

|         | TSP Check                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Notification sent | Field (02,14,35) | Field 39 value |
|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|------------------|----------------|
| **1**   | **General Message Structure checks**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |                   | No message body  |                |
| 1.1     | Authorize client (mutual TLS / IP whitelist)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | No                | No message body  |                |
| 1.2     | Well formed HTTP request (mandatory HTTP headers ...)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | No                | No message body  |                |
| 1.3     | Validate header                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | No                | No message body  |                |
| 1.4     | Parse ISO request                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | No                | No message body  |                |
| 1.5     | Validate processing code                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No                | No message body  |                |
| 1.6     | Find correct handler by MTI and processing code (error if not match is found)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | No                | No message body  |                |
| **2**   | **1120 Message checks**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                   |                  |                |
| 2.1     | Parse 1120 message                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | No                | No message body  |                |
| 2.2     | Validate 1120 message                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | No                | Request          | 006            |
| 2.3     | Check that field 39 value is in the range of values supported (see 6.12)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No                | As request value | 006            |
| 2.4     | Validate MAC                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | No                | No message body  |                |
| **3**   | **Message processing**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                   |                  |                |
| 3       | Check if field 02 is a DPAN (Token) or a FPAN (physical card PAN)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                   |                  |                |
| **3.1** | **Field 02 = DPAN (Advice after failed detokenization)**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                   |                  |                |
| 3.1.1   | Check that field 39 in advice 1120 message is not 000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | No                | Request          | 003            |
| 3.1.2   | Validate issuer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | No                | Request          | 003            |
| 3.1.3   | Try to retrieve the original message in Transaction History File (by using RRN and TDT)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                   |                  |                |
| 3.1.4   | If message retrieved, validate that the response code in the original message is different from 000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | No                | Request          | 006            |
| 3.1.6   | Request the TSH to send a notification message to the mobile. The type of notification is dependeng on the Field 03 position 1-2 value: <br/> * First, it is not expected to receive value ´20´, ´22´ or ´52´ in Field 03 position 1-2, in this specific case <br/> * For all the other values of Field 03 position 1-2 value (values not equal to 20, 22 or 52), transactionType in the notification depends on the exact value of position 1 – 2, and the mapping can be found in Section 7.2. <br/> For all cases, transactionResult =DECLINED                                                                                                                                                                                                                      | Yes               | DPAN             | 000            |
| **3.2** | **Field 02 = FPAN: Advice on payment after detokenization (transaction approved or transaction declined or transaction reversed)**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                   |                  |                |
| 3.2.1   | Find original message in Transaction History File (by using RRN and TDT)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No                | Request          | 003            |
| 3.2.2   | Validate issuer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | No                | Request          | 003            |
| 3.2.2   | Is requestor authorized to access DPAN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | No                | Request          | 003            |
| 3.2.4   | Request the TSH to send a notification message to the mobile. <br/> The values for transactionType and transactionResult follow: <br/> <table><th>Field 03 position 1-2</th><th>Field 39</th><th>Transaction Type</th><th>Transaction Result</th><tr><td>'00'</td><td>'00' <br/> not '00'</td><td>PURCHASE</td><td>APPROVED <br/> DECLINED</td></tr><tr><td>'20'</td><td>'00' <br/> not '00'</td><td>REFUND</td><td>APPROVED <br/> DECLINED</td></tr><tr><td>'22'</td><td>'00' <br/> not '00'</td><td>PURCHASE</td><td>APPROVED <br/> DECLINED</td></tr><tr><td>'52'</td><td>'00' <br/> not '00'</td><td>PURCHASE</td><td>APPROVED <br/> DECLINED</td></tr><tr><td>'92'</td><td>'00' <br/> not '00'</td><td>PURCHASE</td><td>APPROVED <br/> DECLINED</td></tr></table> | Yes               | DPAN             | 000            |


# 7 Message Data Elements Description

This section provides detailed descriptions of all data elements used by Cloud TSP / Remote Host
Interface messages.

## 7.1 Field n° 02 – Primary Account Number

|                 |                                                                                                                                                                                                                                  |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | LLVAR; n... 19                                                                                                                                                                                                                   |
| **Description** | The primary account number is a number used to identify a customer account. It may be either the PAN value associated to the card issued by the Issuer or the token value generated by the Cloud TSP during card digitalisation. |

## 7.2 Field n° 03 – Processing Code

|                                          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**                            | n-6                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Description**                          | Code used to describe the impact of a transaction on the client and related accounts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Values** <br/> (Value to be confirmed) | **Positions 1-2: Transaction Type Code** <br/> 00: Purchases & Services <br/> 01: Withdrawal <br/> 02: Adjustment <br/> 09: Purchase with cashback <br/> 11: Quasi cash <br/> 12: Manual cash <br/> 17: Cash advance <br/> 19: Fees <br/> 20: Refunds <br/> 22: Reversal <br/> 28: MoneySend (MS) <br/> 31: Balance request <br/> 36: Cash balance inquiry <br/> 40: Transfer request <br/> 52: Credit – Return of goods <br/> 91: Status Check <br/> 92: Confirmation of a pre-authorization <br/> 93: Card on File Token Processing <br/> 96: Purchase at ATM <br/> <br/> **Positions 3-4: Account Type (source)** <br/> 00: Not specified <br/> 10: Savings account <br/> 20: Checking account <br/> 30: Credit card account <br/> 38: Loan account <br/> 40: Universal account <br/> **Positions 5-6: Account Type (destination)** <br/> 00: Not specified <br/> 10: Savings account <br/> 20: Checking account <br/> 30: Credit card account <br/> 38: Loan account <br/> 40: Universal account <br/> |

## 7.3 Field n° 04 – Transaction Amount

|                 |                                                                                                                                                                                                                   |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | n-12                                                                                                                                                                                                              |
| **Description** | Transaction amount in local currency in the the smallest unit associated to the currency (for example, in cents with Euro currency), right justified with leading  zeros, eg: 00 00 00 00 21 00 is coding for 21€ |

## 7.4 Field n° 07 –Transaction Date and Time

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | n-10                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Description** | Transaction date and time, expressed in Coordinated Universal Time (UTC) or local time, at which the transaction takes place at the point of card acceptor location. The format is MMDDhhmmss. TSP does not know if timestamp is in UTC or local time, Therefore all transactions must be expressed in the same way (UTC or local time) for a given domestic scheme or closed loop environment (eg: closed loop payment for a retailer). |

## 7.5 Field n° 12 – Date and Time Local Transaction

|                 |                                                                                                                 |
|-----------------|-----------------------------------------------------------------------------------------------------------------|
| **Attribute**   | n-14                                                                                                            |
| **Description** | The date and timestamp of the transaction at the card acceptor location. Format of the field is CCYYMMDDhhmmss. |

## 7.6 Field n° 14 – Expiration Date

|                 |                                                                                                                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | n-4                                                                                                                                                                                                           |
| **Description** | The expiration date of the payment product. It may be either the expiration date of the card issued by the Issuer or the expiration date of the token generated by  the Cloud TSP during card digitalisation. |

## 7.7 Field n° 18 – Merchant Type

|                 |                                                                                                                                                                                                                                                                                                       |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | n-4                                                                                                                                                                                                                                                                                                   |
| **Description** | Classification of the merchant type of business or service. It allows the bank to identify the transaction type that takes place. In general, values must be compliant with ISO 18245. The following values are defined for Transit use case: <br/> 4784 <br/> 7523 <br/> 4111 <br/> 4131 <br/> 4112. |

## 7.8 Field n° 19 – Acquiring Institution Country Code

|                 |                                                                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | n-3                                                                                                                                 |
| **Description** | Code of the country where the acquiring institution is located. Refer to the ISO 3166 specification for more information, eg: 02 53 |

## 7.9 Field n° 22 – POS Data

|                                          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**                            | n-3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Description**                          | The POS Data is composed of two sub-fields: <br/> * n-2 (most significant digits): PAN Entry Mode (Field 1) <br/> n-1 (least significant digit): Terminal PIN Entry Mode (Field 2) *                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Values** <br/> (Value to be confirmed) | **Field 01: PAN Entry Mode** <br/> 0: Unknown <br/> 01: PAN manual entry <br/> 02: PAN read in Magnetic stripe <br/> 03: PAN read in Magnetic stripe (fallback to chip reading issue) <br/> 04: PAN read in QR code <br/> 05: PAN read in contact chip <br/> 06: PAN/Token entry via electronic commerce with optional AAV <br/> 07: PAN read in contactless chip <br/> 08: PAN/Token entry via electronic commerce containing cryptogram in field 55 <br/> **Field 02: Terminal PIN Entry Mode** <br/> 0: Unknown <br/> 1: Terminal has PIN entry capability <br/> 2: Terminal does not have PIN entry capability <br/> Coding example: <br/> 00 51 <br/> Field 01: 05 - PAN read in contact chip <br/> Field 02: 1 - Terminal has PIN entry capability |

## 7.10 Field n° 23 – Card Sequence Number

|                 |                                                                                          |
|-----------------|------------------------------------------------------------------------------------------|
| **Attribute**   | n-3                                                                                      |
| **Description** | Allows distinguishing between separate cards related to the same primary account number. |

## 7.11 Field n° 35 - Track2 Data

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | LLVAR ans... 37                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Description** | Track 2 data compliant with ISO 7813, excluding the start and end sentinels and the LRC. The PAN value in Track2 Data is either the PAN value associated to the card issued by the Issuer or the token value generated by the Cloud TSP during card digitalisation. <br/> For chip transactions, DE 35 carries data read from the chip as EMV tag 57 (Track 2 Equivalent Data). The account number in DE 2 (Primary Account  Number [PAN]) must match the account number in DE 35. |


## 7.12 Field n° 37 - Retrieval reference number

|                 |                                                                                            |
|-----------------|--------------------------------------------------------------------------------------------|
| **Attribute**   | an-12                                                                                      |
| **Description** | Unique reference used to retrieve the original messages and used to help find these data   |

## 7.13 Field n° 39 – Action/Response Code

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | n-3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Description** | The code value must be part of full successful/error code list below else an error is returned by TSP. <br/> TSP notifies TSH and therefore the wallet in case of failed payment only for error code listed below. Any other value included in Advise message does not trigger payment notification to TSH and wallet. <br/> <br/> a) In 1120 message not related to a reversal or refund message. <br/> When the message 1120 message is processed without any error: <br/> If 1120 field 39 is 000: <br/> - A notification is sent to the TSH with transaction result APPROVED. <br/> - 1130 response code will be 000 if no further error is found by processing the request <br/> If 1120 field 39 is one of the list above except 000: <br/> - A notification is sent to the TSH with transaction result DECLINED. <br/> - 1130 response code will be 000 if no further error is found by processing the request <br/> If 1120 field 39 was NOT one of the list above: <br/> - No notification is sent to the TSH <br/> - 1130 response code will be 006. Header field in HTTP header will state field number 039 if this inconsistency on field 39 if the first one experienced by TSP during ISO message validation (see 3.2) <br/> When the message 1120 message is processed with error: <br/> - No notification is sent to the TSH <br/> - 1130 response code will be set to the value associated to the error <br/> <br/> b) In 1120 message related to a reversal message (Processing Code (field 03) position 1-2 is equal to ’22- reversal’ and Response Code (field 39)=000 <br/> When the message 1120 message is processed without any error: <br/> - A notification is sent to the TSH with transactionType= PURCHASE, and transactionResult = REFUNDED. <br/> - 1130 response code will be 000 <br/> When the message 1120 message is processed with error: <br/> - No notification is sent to the TSH <br/> - 1130 response code will be set to the value associated to the error <br/> <br/> c) In 1120 message related to a refund message (Processing Code (field 03) position 1-2 is equal to ’20- refund’ and Response Code (field 39)=000 ) <br/> When the message 1120 message is processed without any error: <br/> - A notification is sent to the TSH with transactionType = REFUND transactionResult = APPROVED. <br/> - 1130 response code will be 000 <br/> <br/> When the message 1120 message is processed with error: <br/> - No notification is sent to the TSH <br/> - 1130 response code will be set to the value associated to the error <br/> <br/> e) In 1120 message related to a refund message (Processing Code (field 03) position 1-2 is equal to ’52- Credit – Return of goods and Response Code (field 39)=000 ) <br/> <br/> When the message 1120 message is processed without any error: <br/> - A notification is sent to the TSH with transactionType = PURCHASE transactionResult = REFUNDED. <br/> - 1130 response code will be 000 <br/> <br/> When the message 1120 message is processed with error: <br/> ssed with error: <br/> - 1130 response code will be set to the value associated to the error <br/> <br/> e) In 1110 message and 1130 message, it corresponds to Cloud TSP message processing result |
| **Values**      | <table><tr><th>Code</th><th>Description</th></tr><tr><td>'000'</td><td>Transaction or request approved</td></tr><tr><td>'001'</td><td>Expired card</td></tr><tr><td>‘002'</td><td>Bad Merchant</td></tr><tr><td>'003'</td><td>Unknown Card or wrong card status</td></tr><tr><td>'004'</td><td>Terminal Transaction not permitted</td></tr><tr><td>'005'</td><td>Cryptographic checks failure (wrong ARQC cryptogram)</td></tr><tr><td>'006'</td><td>Message Format error</td></tr><tr><td>'007'</td><td>Invalid amount</td></tr><tr><td>'008'</td><td>Insufficient funds/over credit limit (token domain control)</td></tr><tr><td>'009'</td><td>Duplicate transmission detected</td></tr><tr><td>'010'</td><td>System error</td></tr><tr><td>'011'</td><td>Lost card</td></tr><tr><td>'012'</td><td>Stolen card</td></tr><tr><td>'013'</td><td>Suspect fraud</td></tr><tr><td>'014'</td><td>Cryptographic Key not supported</td></tr><tr><td>'015'</td><td>Wrong Field 55 format</td></tr><tr><td>'016'</td><td>Cryptogram expired (specific to QR Code project)</td></tr><tr><td>'017'</td>Amount in the message field not within allowable limits derived from amount in field 55<td></td></tr><tr><td>'018'</td><td>Currency code in the message field does not match currency code in field 55</td></tr><tr><td>'019'</td><td>Local Verification Results check failed (Apple Pay)</td></tr><tr><td>'020'</td><td>Required CDCVM stamp is missing</td></tr><tr><td>'021'</td><td>CDCVM Stamp checking failure</td></tr><tr><td>'024'</td><td>RFU (Required Cloud PIN stamp is missing)</td></tr><tr><td>'025'</td><td>RFU (Cloud PIN stamp Stamp checking failure)</td></tr><tr><td>'029'</td><td>Cloud PIN not supported (Cloud PIN was used but it is not supported)</td></tr><tr><td>'030'</td><td>ATC Check failure</td></tr></table>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## 7.14 Field n° 42 – Card Acceptor Identification Code

|                 |                                                                                                                                                                                                                                                      |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | ans-15                                                                                                                                                                                                                                               |
| **Description** | The card acceptor defines the point of the transaction in both local and interchange environments. It is is used as a merchant ID to uniquely identify the merchant in a POS transaction. The field is left justified with spaces on right positions |

## 7.15 Field n° 43 – Card Acceptor Name and Address

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | ans-55                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Description** | Card Acceptor Name and Address is using the following structure composed of 7 sub-fields <br/> <table> <tr><th>#</th><th>Attributes</th><th>Description</th></tr> <tr><td>1</td><td>ans-22</td><td>Card Acceptor Name</td></tr> <tr><td>2</td><td>ans-1</td><td>Separator value: '/'</td></tr> <tr><td>3</td><td>ans-5</td><td>Card Acceptor ZIP code</td></tr> <tr><td>4</td><td>ans-1</td><td>Separator value: '/'</td></tr> <tr><td>5</td><td>ans-22</td><td>Card Acceptor Location City</td></tr> <tr><td>6</td><td>ans-1</td><td>Separator value: '/'</td></tr> <tr><td>7</td><td>ans-3</td><td>Card Acceptor state/Province/country Code location</td></tr> </table> |

## 7.16 Field n° 48 – Additional data, private

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | LLLVAR ans…255                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Description** | Dedicated to the storage of additional data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Values**      | The data element field is composed of the concatenation of several sub-fields. Each subfield has the following structure: <br/> * Sub-field Identifier (3 characters) <br/> * Sub-field Length (3 characters) <br/> * Sub-field value (x characters with x= Sub-field Length) <br/> <br/> The most frequently field 48 sub-field used are from the following list. <br/> <table> <tr> <th>Identifier</th> <th>Length</th> <th>Value</th> <th>Presence in messages</th></tr> <tr> <td>'001'</td> <td>'002'</td> <td>Encrypted key Index to key used for encrypting MAC key. This value must be unique per processor. Hexadecimal characters in the range 0–9 and A–F. <br/> See MAC details</td> <td>Presence is required only when field 64 is present</td></tr> <tr> <td>'002'</td> <td>'032'</td> <td>MAC key: element containing 32 hexadecimal characters in the range 0–9 and A–F to represent the 16 bytes of a MAC key encrypted under the encryption key associated to the index. <br/> See MAC details</td> <td>Presence is required only when field 64 is present</td></tr> <tr> <td>'003'</td> <td>'003'</td> <td>CVV2 value on 3 digits</td> <td>Currently not used</td></tr> <tr> <td>'004'</td> <td>'032'</td> <td>AAV</td> <td>Currently not used</td></tr> <tr> <td>'005'</td> <td>Variable up to 32</td> <td>Archive Reference <br/> up to 32 Alphanumeric characters A-Z , a-z , 0-9 , space and special characters</td> <td>Conditional in 1110 and 1130 <br/> Presence is depending on project business requirements (use for recurring payment)</td></tr> <tr> <td>'006'</td> <td>'001'</td> <td>Transaction Category Code (TCC) <br/> One character indicating the type of the transactions. <br/> Corresponding values are listed: <br/> <table> <tr><th>Value</th><th>Description</th></tr> <tr><td>A</td><td>Car rental</td></tr> <tr><td>H</td><td>Hotel</td></tr> <tr><td>R</td><td>Retail sale</td></tr> <tr><td>M</td><td>MOTO (mail order or telephone order)</td></tr> <tr><td>X</td><td>Public transport services</td></tr> </table> </td> <td>Conditional. Presensce is only required in case of transit transaction for TSP to handle transit-specific processing. <br/> In other cases it is optional. If present, TSP will store it as a transaction attribute. No impact on the processing by TSP</td> </tr> <tr> <td>'007'</td> <td>Variable</td> <td>Acquirer Institution Id from request.</td> <td>Conditional in 1110 and 1130 echoing request. Presence is depending on project business requirements.</td></tr> </table> <br/> Coding example: <br/> 40 30 30 31 30 30 32 30 31 30 30 32 30 33 32 32 34 34 37 32 36 44 37 30 31 39 30 36 43 30 <br/> 38 35 46 39 37 37 41 39 34 31 36 36 43 35 35 46 33 30 30 35 30 31 32 31 31 41 41 32 32 42 <br/> 42 33 33 43 43 <br/> ASCII decoded and identifier shown in bold: <br/> Length = 40 hex = 64 dec <br/> 001 002 01 002 032 244726D701906C085F977A94166C55F3 005 012 11AA22BB33CC |

## 7.17 Field n° 49 – Transaction Currency Code

|                 |                            |
|-----------------|----------------------------|
| **Attribute**   | n-3                        |
| **Description** | Local transaction currency |

## 7.18 Field n° 55 – Chip Related Data

|                 |                                                                                               |
|-----------------|-----------------------------------------------------------------------------------------------|
| **Attribute**   | LLLVAR b…255                                                                                  |
| **Description** | Contains data related to ICC systems related to the card.                                     |
| **Values**      | The data element value field is BER-TLV structured as defined in EMV specifications Book 3.   |

## 7.19 Field n° 56 – Token Related Data

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | LLLVAR b ... 255                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Description** | Token-related data                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Values**      | The data element value field is BER-TLV structured as defined in EMV specifications Book 3. <br/> The following table provides the list of optional data elements that may be present in field 56. When no token-related data has to be communicated, the field 56 is not  present in the message. <br/> The column message indicates in which type of message the token-related data may be present. <table> <tr><th></th> <th>Tag</th> <th>Length</th> <th>Type</th> <th>Optional presence in Messages (*)</th> <th>Data Element</th> </tr> <tr> <td>'05'</td> <td>Variable up to 19</td> <td>n</td> <td>1110/1130</td> <td>Token value. Token. This numerical field contains the token value received in DE02 of the corresponding 1100/1120 message.</td> </tr> <tr> <td>'06'</td> <td>Variable up to 32</td> <td>an</td> <td>1110/1130</td> <td>Wallet Provider ID (eg: ‘APPLE_PAY’,‘SPAYHCE’, ‘ANDROID_PAY’) <br/> Specific value can be defined upon integration</td> </tr> <tr> <td>'07'</td> <td>Variable up to 32</td> <td>an</td> <td>1110/1130</td> <td>Device Brand (1) <br/> eg: Samsung </td> </tr> <tr> <td>'08'</td> <td>Variable up to 32</td> <td>an</td> <td>1110/1130</td> <td>Device Model (1) <br/> eg: SM920T </td> </tr> <tr> <td>'09'</td> <td>11</td> <td>n</td> <td>1110/1130</td> <td>Token requestor ID</td> </tr> <tr> <td>'10'</td> <td>Variable up to 16 (2)</td> <td>an</td> <td>1110/1130</td> <td>Device type (eg: 'MOBILE_PHONE', 'TABLET', 'WATCH', 'COMPUTER', 'HOUSEHOLD', 'WEARABLE', 'AUTOMOTIVE', 'UNKNOWN') (2)</td> </tr> <tr> <td>'11'</td> <td>Variable up to 4 (2)</td> <td>an</td> <td>1110/1130</td> <td>Token type (eg: 'SE' (token for a secure element), 'HCE' (token for Host Card Emulated device), 'TEE' (token for Trusted Execution Environment device), 'COF' (token for a card on file)) (2) (2)</td> </tr> <tr><td>'12'</td><td>11</td><td>n</td><td>1110/1130</td><td>Alternative Token requestor ID, for applicable project.</td></tr></table> |

(*) The list of data that will be included by the TSP in each response message (1110, 1130) are defined for each project during the specification phase.

(1) The device brand and model are dependant of information provided by the wallet. One of both or both fields may be not populated by the wallet.
(2) RFU and subject to availability of the suitable information from the wallet.

## 7.20 Field n° 64 – Message Authentication Code

|                 |                                                                                                                                                                                                                          |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**   | b-8                                                                                                                                                                                                                      |
| **Description** | Message Authentication Code [MAC]) validates the source and the text of the message between the sender and the receiver. <br/> It is generated using the MAC key provided in field 48 (Identifier “001”) See MAC details |

# 8 Appendix

## 8.1 Token Assurance Method codification

The values are defined in the document: “Token Authorization Response” message in the ‘EMV Payment Tokenisation
Specification Technical Framework v2.0”.

| Token Assurance Method Category | Description                                                             |
|---------------------------------|-------------------------------------------------------------------------|
| Spaces                          | No Value Set                                                            |
| **01 – 19**                     | **Common method categories**                                            |
| 00                              | ID&V Not Performed                                                      |
| 01                              | Non-Card Issuer Interactive Cardholder Authentication - 1 Factor        |
| 02                              | Non-Card Issuer Interactive Cardholder Authentication - 2 Factor        |
| 03                              | Non-Card Issuer Risk Oriented Non-Interactive Cardholder Authentication |
| 04 - 09                         | Reserved for future EMVCo use                                           |
| 10                              | Card Issuer Account Verification                                        |
| 11                              | Card Issuer Interactive Cardholder Authentication - 1 Factor            |
| 12                              | Card Issuer Interactive Cardholder Authentication - 2 Factor            |
| 13                              | Card Issuer Risk Oriented Non-Interactive Cardholder Authentication     |
| 14                              | Card Issuer Asserted Authentication                                     |
| 15 - 19                         | Reserved for future EMVCo use                                           |
| **20 - 89**                     | **Token Programme Specific**                                            |
| **99 - 99**                     | **Reserved for future EMVCo use**                                       |

## 8.2 Storage Type

Attributes of the device that may be used to identify the specific device where a Payment Token is stored.

| Storage Type | Description                         |
|--------------|-------------------------------------|
| 01           | Device memory                       |
| 02           | Device memory protected by TPM      |
| 03           | Server                              |
| 04           | TEE                                 |
| 05           | SE                                  |
| 06           | Virtual execution environment (VEE) |

## 8.3 Connectivity Requirements

A secure channel must be established between the Cloud TSP and the remote Host (Acquirer server  or Bank server) as described below.

### 8.3.1 TLS Authentication (HTTPS)

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

### 8.3.2 MAC usage

Usage of MAC is required in all ISO Message (Request and Response). See MAC details

## 8.4 MAC details

Prerequisites for MAC usage:
* A ZMK (Zone Master Key) has been exchanged between the parties during a key ceremony and imported into HSM.
* A MAC key encryption key (MAC KEK) has subsequently been generated and securely exchanged, encrypted under the ZMK.

The following principles shall be applied for all ISO messages:
* All ISO messages are protected using MAC.
* All ISO messages should contain a MAC session key.
* The MAC session key is protected under the MAC KEK.

### 8.4.1 MAC KEK

The MAC KEK serves as the cryptographic key responsible for encrypting the MAC session key.
During the setup phase, the MAC KEK must be securely exchanged between the parties, protected under the ZMK.
Additionally, HSM is mandatory for the protection of MAC KEKs.
Its cryptographic period is defined as either a maximum length of time or a maximum number of transactions, whichever is reached first.
Upon the expiration of the cryptographic period, the MAC KEK must be renewed.
The MAC KEK is identified by a key index (ranging from 1 to 255) to allow for key renewal. The key index is present in the ISO Message in Field n° 48 – Additional data, private (Identifier “001”, the encrypted key index).

### 8.4.2 MAC session key

The MAC session key is an ephemeral key used to calculate the MAC.
The MAC session key, encrypted under the MAC KEK, shall be present in each ISO message, located in Field n° 48 – Additional data, private (Identifier "002", the MAC key).
The MAC session key is generated by each party and can be reused in multiple ISO messages. The maximum recommended lifetime for an ephemeral MAC session key is one hour.

### 8.4.3 MAC

MAC shall be computed for each ISO Message and put in Field n° 64 – Message Authentication Code.
Input data to calculate the MAC is the hash of the full ISO payload encoded to bytes excluding the mac value field (Field 64).
**Note:** SHA-256 hash is used by default. SHA-1 hash can be used under request.

### 8.4.4 Message transformations

The transformation is applied to the message and the output from the transformation is input to the
MAC algorithm. The following transformations are supported:

* SHA1
* SHA-256
* None

### 8.4.5 MAC algorithms

The following algorithms are supported:

* ISO 9797 algorithm 3 (3DES)
* CMAC (AES)

### 8.4.6 MAC key protection alternatives

Currently there is support for 4 MAC KEK alternatives

* Triple DES CBC no-padding
* Triple DES ECB no-padding
* AES CBC no-padding
* AES ECB no-padding


### 8.4.7 Key types and algorithms - 3DES

|                      |                                                                                                                                                                                                                                                                                    |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MAC KEK Key Type     | "3 key" 3DES (size 24 bytes) or <br/>  "2 key" 3DES (size 16 bytes) (*)                                                                                                                                                                                                            |
| MAC session Key Type | "2 key" 3DES (size 16 bytes)                                                                                                                                                                                                                                                       |
| MAC Key wrapping     | 3DES using CBC or ECB                                                                                                                                                                                                                                                              |
| MAC                  | MAC Algorithm 3 (ISO 9797-1 Algorithm 3). Padding method 1 is used: input data is completed with `0`s until the data reaches a multiple of 8-byte blocks. No `0` is added if the input is already a multiple of 8-byte blocks. <br/> The MAC is the 8 leftmost bytes of the output |
(*) MAC KEK key length depends to remote Host capability

### 8.4.8 Key types and algorithms - AES

|                      |                                                                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| MAC KEK Key Type     | AES (128, 192 or 256 bits)                                                                                                          |
| MAC session Key Type | AES 128bits                                                                                                                         |
| MAC Key wrapping     | AES using CBC or ECB                                                                                                                |
| MAC                  | AES-CMAC Algorithm (RFC 4493), with padding as defined in the AES-CMAC specification The MAC is the 8 leftmost bytes of the output. |




## 8.5 Healthcheck interface

A healthcheck mechanism allow testing on a regular basis the peer to peer connectivity. On HTTP request to dedicated
URL, a successful response is returned by TSP while the status is up and running. This healthcheck should not be called
more often than once per minute.

### 8.5.1 Pre-Production

#### Option 1:
> GET /gtotx/api/healthcheck HTTP/1.1
> Host: ctsp-proc-pp.baxlab.no
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 204

#### Option 2 (Deprecated):
> GET /gtotx/api/iso/healthcheck HTTP/1.1
> Host: ctsp-proc-pp.baxlab.no
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 200
< Content-Type: text/html; charset=utf-8

### 8.5.2 Production

#### Option 1:
> GET /gtotx/api/healthcheck HTTP/1.1
> Host: tx.ctsp.stoe.no
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 204

### Option 2 (Deprecated):
> GET /gtotx/api/iso/healthcheck HTTP/1.1
> Host: tx.ctsp.stoe.no
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 200
< Content-Type: text/html; charset=utf-8

## 8.6 ISO interface

ISO message are carried over HTTP.

HTTP POST method can be invoked.

URL is formatted as below, the actual URL will be provided:

  https://<domain name>/gtotx/api/iso/<scheme>/v10/msg/<processor>

## 8.7 ISO8583 request/response examples

The following examples illustrate the ISO8583 request/response messages that are exchanged between the remote host and the Cloud TSP.

### Detokenization Request:

A detokenization request is sent by the remote host to the Cloud TSP to retrieve the PAN from a token. The example is
has a 2KEY 3DES MAC key and uses SHA-256 hash for the MAC computation. Field-55 is from a PURE wallet.

#### HTTP dump

```
POST /gtotx/api/iso/stoepay/v10/msg/stoepay HTTP/1.1
Host: ctsp-proc-pp.baxlab.no:443
Accept: */*
TID: 001cb3dc-b2f6-4c71-a0c4-53ed96799109
header: 41000000
Content-Type: text/plain
Content-Length: 412

EQByBGYACGGCAREGAyABBIYgGWEAAAAAAAAAIQAGBQYBQygJFSACUAAAAAA3NjM0MDgzMjQyMjM0OTkyICAgICAgICAgICBCQVggVGVzdCAgICAgICAgICAgICAgLyAgICAgL1BhcmlzICAgICAgICAgICAgICAgICAvRlIgQDAwMTAwMjExMDAyMDMyRTU0MTIxQTBCQTVBQkM1NjVFOEYzRTYyNUU2Q0VGRTAwMDUwMTIxMUFBMjJCQjMzQ0MJeGmfAgYAAAAAIQCfAwYAAAAAAACfGgICUJUFAAAAAABfKgIJeJoDGAEJnAEAnzcEDwEOA4ICGoCfNgIAAZ8QIA+lAaCBAQAA8BCg+o6FJxMPAAAAAAAAAAAAAAAAAAAAnyYI+PQV6Iz2nvgIZxuvDPXbRg==
```

#### Fields specification

| Field      | Value                                                                                                                                                                                                                                                                                                                                            | Description                        |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| MTI        | 1100                                                                                                                                                                                                                                                                                                                                             |                                    |
| BitMap     | {2, 3, 4, 7, 14, 18, 19, 22, 23, 37, 42, 43, 48, 49, 55, 64}                                                                                                                                                                                                                                                                                     |                                    |
| Field-2    | 603200\*\*\*\*\*\*\*\*1961                                                                                                                                                                                                                                                                                                                       | PAN - PRIMARY ACCOUNT NUMBER       |
| Field-3    | 000000                                                                                                                                                                                                                                                                                                                                           | PROCESSING CODE                    |
| Field-4    | 000000002100                                                                                                                                                                                                                                                                                                                                     | AMOUNT, TRANSACTION                |
| Field-7    | 0605060143                                                                                                                                                                                                                                                                                                                                       | TRANSMISSION DATE AND TIME         |
| Field-14   | 2809                                                                                                                                                                                                                                                                                                                                             | DATE, EXPIRATION                   |
| Field-18   | 1520                                                                                                                                                                                                                                                                                                                                             | MERCHANTS TYPE                     |
| Field-19   | 250                                                                                                                                                                                                                                                                                                                                              | ACQUIRING INSTITUTION COUNTRY CODE |
| Field-22   | 000                                                                                                                                                                                                                                                                                                                                              | POINT OF SERVICE ENTRY MODE        |
| Field-23   | 000                                                                                                                                                                                                                                                                                                                                              | CARD SEQUENCE NUMBER               |
| Field-37   | 763408324223                                                                                                                                                                                                                                                                                                                                     | RETRIEVAL REFERENCE NUMBER         |
| Field-42   | 4992&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                                                                                                                                                                                                                                               | CARD ACCEPTOR IDENTIFICATION CODE  |
| Field-43   | BAX Test&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/Paris&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/FR | CARD ACCEPTOR NAME/LOCATION        |
| Field-48   | 00100211002032E54121A0BA5ABC565E8F3E625E6CEFE000501211AA22BB33CC                                                                                                                                                                                                                                                                                 | ADDITIONAL DATA - PRIVATE          |
| Field-49   | 978                                                                                                                                                                                                                                                                                                                                              | CURRENCY CODE, TRANSACTION         |
| Field-55   | 9F02060000000021009F03060000000000009F1A020250......00000000000000000000000000009F2608F8F415E88CF69EF8 (*)                                                                                                                                                                                                                                       | IC card system related data        |
| Field-64   | 08671BAF0CF5DB46                                                                                                                                                                                                                                                                                                                                 | MESSAGE AUTHENTICATION CODE FIELD  |
(*) Full field55: 9F02060000000021009F03060000000000009F1A020250950500000000005F2A0209789A031801099C01009F37040F010E0382021A809F360200019F10200FA501A081010000F010A0FA8E8527130F0000000000000000000000000000009F2608F8F415E88CF69EF8

### Detokenization response:

The response is successful and contains the PAN in Field-2. The MAC is computed using SHA-256 hash and 2KEY 3DES MAC key.

#### HTTP dump

```
HTTP/1.1 200 OK
TID: 001cb3dc-b2f6-4c71-a0c4-53ed96799109
header: 41000000
Content-Type: text/plain
Content-Length: 120
Date: Thu, 05 Jun 2025 06:01:44 GMT
Keep-Alive: timeout=20
Connection: keep-alive

ERBABAAAAgEBAREFAAUAFWAAAFMnBAAALjAwMTAwMjExMDAyMDMyQ0NDQjk2MjE3ODQ4NTU5RkI1RjdFRUZDMjA4NjEzNUEJBgdTUEFZSENFFhQCxLmfVUI=
```

| Field      | Value                                          | Description                        |
|------------|------------------------------------------------|------------------------------------|
| MTI        | 1110                                           |                                    |
| Field-2    | 500050\*\*\*\*\*\*\*\*0053                     | PAN - PRIMARY ACCOUNT NUMBER       |
| Field-14   | 2704                                           | DATE, EXPIRATION                   |
| Field-39   | 000                                            | ACTION CODE                        |
| Field-48   | 00100211002032CCCB96217848559FB5F7EEFC2086135A | ADDITIONAL DATA - PRIVATE          |
| Field-56   | 060753504159484345                             | Token Related Data                 |
| Field-64   | 161402C4B99F5542                               | MESSAGE AUTHENTICATION CODE FIELD  |


### Advice request:

The advice request is sent to notify the wallet about the detokenization result. Field 2 contains the PAN, field-39
contains the result of the detokenization.

#### HTTP dump

```
POST /gtotx/api/iso/stoepay/v10/msg/stoepay HTTP/1.1
Host: ctsp-proc-pp.baxlab.no:443
Accept: text/plain, text/*
TID: 88a1a721-a3dc-4502-a340-435c4e6a8064
header: 41000000
Content-Type: text/html
Content-Length: 272

ESByBGYACmGAAREFAAUAFWAAAFMAAAAAAAAAAQAGBQhDJScEFSACUAAAAAE2MDg2NzE5ODA2NDIAADQ5OTIgICAgICAgICAgIEJBWCBUZXN0ICAgICAgICAgICAgICAvICAgICAvUGFyaXMgICAgICAgICAgICAgICAgIC9GUiBAMDAxMDAyMTEwMDIwMzI4QTdGMzUyRjg2QjNGM0QyNDg2REIxRDdCNzM1MDgwQTAwNTAxMjExQUEyMkJCMzNDQwl4RU0U+Glc5dI=

```

#### Fields specification

| Field     | Value                                                                                                                                                                                                                                                                                                                                            | Description                        |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| MTI       | 1120                                                                                                                                                                                                                                                                                                                                             |                                    |
| BitMap    | {2, 3, 4, 7, 14, 18, 19, 22, 23, 37, 39, 42, 43, 48, 49, 64}                                                                                                                                                                                                                                                                                     |                                    |
| Field-2   | 500050\*\*\*\*\*\*\*\*0053                                                                                                                                                                                                                                                                                                                       | PAN - PRIMARY ACCOUNT NUMBER       |
| Field-3   | 000000                                                                                                                                                                                                                                                                                                                                           | PROCESSING CODE                    |
| Field-4   | 000000000100                                                                                                                                                                                                                                                                                                                                     | AMOUNT, TRANSACTION                |
| Field-7   | 0605084325                                                                                                                                                                                                                                                                                                                                       | TRANSMISSION DATE AND TIME         |
| Field-14  | 2704                                                                                                                                                                                                                                                                                                                                             | DATE, EXPIRATION                   |
| Field-18  | 1520                                                                                                                                                                                                                                                                                                                                             | MERCHANTS TYPE                     |
| Field-19  | 250                                                                                                                                                                                                                                                                                                                                              | ACQUIRING INSTITUTION COUNTRY CODE |
| Field-22  | 000                                                                                                                                                                                                                                                                                                                                              | POINT OF SERVICE ENTRY MODE        |
| Field-23  | 001                                                                                                                                                                                                                                                                                                                                              | CARD SEQUENCE NUMBER               |
| Field-37  | 608671980642                                                                                                                                                                                                                                                                                                                                     | RETRIEVAL REFERENCE NUMBER         |
| Field-39  | 000                                                                                                                                                                                                                                                                                                                                              | ACTION CODE                        |
| Field-42  | 4992&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                                                                                                                                                                                                                                               | CARD ACCEPTOR IDENTIFICATION CODE  |
| Field-43  | BAX Test&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/Paris&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/FR | CARD ACCEPTOR NAME/LOCATION        |
| Field-48  | 001002110020328A7F352F86B3F3D2486DB1D7B735080A00501211AA22BB33CC                                                                                                                                                                                                                                                                                 | ADDITIONAL DATA - PRIVATE          |
| Field-49  | 978                                                                                                                                                                                                                                                                                                                                              | CURRENCY CODE, TRANSACTION         |
| Field-64  | 454D14F8695CE5D2                                                                                                                                                                                                                                                                                                                                 | MESSAGE AUTHENTICATION CODE FIELD  |

### Advice response:

The advice response contains the token pan in field-2.

#### HTTP dump

```
HTTP/1.1 200 OK
TID: 001cb3dc-b2f6-4c71-a0c4-53ed96799109
header: 41000000
Content-Type: text/plain
Content-Length: 120
Date: Thu, 05 Jun 2025 06:01:44 GMT
Keep-Alive: timeout=20
Connection: keep-alive

ERBABAAAAgEBAREFAAUAFWAAAFMnBAAALjAwMTAwMjExMDAyMDMyQTA2QTUwNjFDQkI5RjE1RTE1Nzg4MEM0MDkzQ0YzNzQJBgdTUEFZSENF1kvCKDWu060=

```
## 8.8 Field 55 Example

Field 55 contains the data elements related to the Integrated Circuit Card (ICC). The contents of the fields is a series
of tags created by the merchant POS typically. It is formatted as a BER-TLV structure, with various tags depending on
the payment kernel used. The tags are defined in the EMV specifications Book 3.

In the Cloud TSP ISO API, the main usage of field 55 is to verify the application cryptogram, to authenticate the
request. The ISO API will not reject requests with additional tags, but the minimum set of tags, depending on the
payment kernel in use, must be present.

### PURE

The following table provides the list of mandatory data elements that must be present in field 55 when present in the 1100 ISO message:

| Tag     | Length            | Data element                                                                                   |
|---------|-------------------|-----------------------------------------------------------------------------------------------|
| 5F2A    | 2                 | Transaction Currency Code                                                                     |
| 82      | 2                 | Application Interchange Profile                                                               |
| 95      | 5                 | Terminal Verification Result                                                                  |
| 9A      | 3                 | Transaction Date                                                                              |
| 9C      | 1                 | Transaction Type                                                                              |
| 9F02    | 6                 | Authorized Amount                                                                             |
| 9F03    | 6                 | Other Amount (Default value `000000000000` when the remote host ignores its value)           |
| 9F10    | Variable up to 32 | Issuer Application Data                                                                       |
| 9F1A    | 2                 | Terminal Country Code                                                                         |
| 9F26    | 8                 | Application Cryptogram                                                                        |
| 9F27    | 1                 | Cryptogram Information Data                                                                   |
| 9F36    | 2                 | Application Transaction Counter                                                               |
| 9F37    | 4                 | Unpredictable Number                                                                          |

Remember to check the specifications for the wallet in use. This is an example for reference only.

Additional data elements may be present. The following table provides the list of data elements that are present in field 55 when present in the 1130 ISO message:

| Tag  | Length              | Data Element                                                 |
|------|---------------------|--------------------------------------------------------------|
| `91` | Variable up to 16   | Issuer Authentication Data (containing the ARPC cryptogram)  |

Note: The field 55 is present in the 1130 ISO message only when PAN Entry Mode in POS Entry Mode is equal to “04: PAN read in contact chip”.

The structure of each of mandatory data element is defined in the EMV specifications Book 3.

Example of field 55:

```
69 (length = 105 dec)
69 9f 02 06 00 00 00 00 21 00 9f 03 06 00 00 00 00 00 00 9f 1a 02 <br/> 02 50 95 05 00 00 00 00 00 5f 2a 02 09 78 9a 03 18 01 09 9c 01 00 <br/> 9f 37 04 0f 01 0e 03 82 02 1a 80 9f 36 02 00 01 9f 10 20 0f a5 01 <br/> a0 81 01 00 00 ee af 28 c6 83 81 c2 ed 0f 00 00 00 00 00 00 00 00 <br/> 00 00 00 00 00 00 00 9f 26 08 a1 a7 17 06 5f f0 30 a3
```

| Field     | Value                                          | Description                        |
|-----------|------------------------------------------------|------------------------------------|
| MTI       | 1130                                           |                                    |
| Field-2   | 603200\*\*\*\*\*\*\*\*1961                     | PAN - PRIMARY ACCOUNT NUMBER       |
| Field-14  | 2809                                           | DATE, EXPIRATION                   |
| Field-39  | 000                                            | ACTION CODE                        |
| Field-48  | 00100211002032BD4E0A1DAAA47C25CB1EF6CA107DBECA | ADDITIONAL DATA - PRIVATE          |
| Field-64  | 729A79DB1D60F465                               | MESSAGE AUTHENTICATION CODE FIELD  |
