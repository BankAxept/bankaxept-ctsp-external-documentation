# Structure and Content of Messages

## Overview of the message structure

HTTP is used as transport layer for carrying ISO message payload. HTTP header includes a unique transaction ID for a
given request and some information related to the payload. HTTP body contains ISO Message Type, Bitmap and Data Elements
encoded in base64.

| HTTP Header |                                                                   |
|-------------|-------------------------------------------------------------------|
| tid         | Transaction ID. Unique ID of the request.                         |
| header      | Information about the request/response. As described in document. |

| HTTP body |                                                                  |
|-----------|------------------------------------------------------------------|
| Payload   | Base64 encoded ISO8583 (Message Type, Bitmap and Data Elements). |

## Payload

Payload includes information specified in table below. Each part is detailed in this document.

| Offset | Length   | Information                                                    |
|--------|----------|----------------------------------------------------------------|
| 1      | 4        | Message Type                                                   |
| 5      | 8        | Primary Bitmap                                                 |
| 13     | variable | Data Elements (may include the secondary bitmap in field n° 1) |

## Header

The header is required in all messages and is 8 bytes long. The header has the following format:

| Position | Content                                                                                                                                                                                                                                                                                                         |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| 1        | Request Indicates the product associated with the message. ‘3’ = Interface with an Acquiring Host (for processing Card Present transaction with the issuer). ‘4’ = Interface with an Acquiring Host (for processing Card Not Present transaction with the Issuer). ‘5’ = Interface with an Authorization HOST." |
|          | "Response Value is echoed back in response."                                                                                                                                                                                                                                                                    |
| 2 - 5    | 	"Request Release & version of the protocol. 1000: version 1"                                                                                                                                                                                                                                                   | 
|          | "Response Value is echoed back in response."                                                                                                                                                                                                                                                                    |
| 6 - 8    | "Request Always set to 000."                                                                                                                                                                                                                                                                                    |
|          | "Response When Cloud TSP rejects a message for format error, this element contains the number of the first erroneous data element. Otherwise, this element contains: ‘000’."                                                                                                                                    |

## Message type

The message type is an element of 4 positions serving to identify the general function of the message. This element is
mandatory in all messages. |

The following message types are exchanged between Cloud TSP and the remote Host:

| Message | Description                                                                     |
|---------|---------------------------------------------------------------------------------|
| 1100    | Detokenization request to the Cloud TSP.                                        |
| 1110    | Detokenization request response from the Cloud TSP.                             |
| 1120    | Transaction Advice communication to the Cloud TSP (re-tokenization).            |
| 1130    | Transaction Advice communication response from the Cloud TSP (re-tokenization). |

## Primary Bitmap

The ISO 8583/1993-12-15 uses a message scheme by bits vector or ‘‘bit maps’’. The bitmap structure indicates the
presence or absence of a data element (‘1’ inside the bitmap indicates the element is present, while ‘0’ indicates the
element is absent). The bytes in the bitmap are numbered from left to right.

The message supports up to two bitmaps (primary and secondary). Each bitmap is 8 bytes long (64-bit string contained
within an eight-byte data element).

* The primary bitmap indicates the presence of fields from 1 to 64.
* The secondary bitmap indicates the presence of fields from 65 to 128.

The primary bitmap is required in all the messages. The secondary bitmap is included in the message if at least one
field in the interval 65 to 128 is present. The presence of the secondary bitmap is signaled by setting the first bit of
the primary bitmap (The leftmost bit) to 1. In the current version of this document the data elements referenced in the
secondary bitmap are not used.

Example:

11 00 72 04 66 00 08 61 82 01

11 00 Message type = detokenization request)
72 04 66 00 08 61 82 01 Bitmap
Bitmap in binary
0111 0010 0000 0100    (7204 hex)
0110 0110 0000 0000    (6600 hex)
0000 1000 0110 0001        (0861 hex)
1000 0010 0000 0001    (8201 hex)

The leftmost bit is equal to 0 meaning there is a single bitmap.

The position of each bit after the leftmost bit corresponds to a data element number. The bit value indicates if the DE
is present (bit=1) or not (bit=0).

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

## Data elements

Data Elements are fields carrying the information of the transaction itself. In section 7 of this document the fields of
the ISO message are described. Field attributes and codings are used to describe the fields.

### Field attributes

The attributes below are used to represent the data type of the data field values:

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

All fields in this document are specified as being numeric (type n), alphanumeric (type a, an, and ans) or binary (type
b). A data field value may have either a fixed or variable length.

Fields with a fixed length are presented by their type followed by the length.
Example:

    an-3 means 3 alphanumeric characters (eg: ab8).
    n-5 means 5 digits (eg: 12345).
    b-10 means 10 hexadecimal numbers (eg: F8 A5 07 …etc).

Fields with a variable length are presented by their type followed by 2 points, followed by the length.

Example:

    an..25 means variable length, up to 25 alphanumeric characters.

The description of the length follows a particular naming as well. The number of digits needed to express the length
value in decimal is specified in this document as per example below:

    LLVAR = variable length field using 2 digits for length information.
    LLLVAR = variable length field using 3 digits for length information.

### Field Coding

#### Fields with a fixed length

A length indicator is not included in a field of fixed length. Only the field value is present in.

#### Fields with a variable length:

A field length is included, followed by the field value. The length is coded in hexadecimal on 1 byte, i.e. the maximum
value for length is 255.

#### Numeric field

This field is bcd encoded. The length is expressed as a number of nibbles (half byte). When the length is an odd value,
the leftmost nible must be ignored. It is used only for padding and equal to zero.

    Example:
    Field n° 02 – Primary Account Number
    Attribute: n..19
    Coding: 11 01 23 45 67 89 01 23 45 67
    Length: 11 hex = 17 dec = 17 digits
    PAN: 1 2345 6789 0123 4567

#### Alphanumeric field

This field is ASCII encoded. The length is expressed as a number of ASCII characters meaning a number of bytes.

    Example:
    Field n° 43 – Card Acceptor Name and Address
    Attribute: ans-55
    Coding: 42 41 58 20 54 65 73 74 20 20 20 20 20 20 20 20 20 20 20 20 20 20 2f 20 20 20 20 20 2f 50 61 72 69 73 20 20 20
    20 20 20 20 20 20 20 20 20 20 20 20 20 20 2f 46 52 20
    
    Length: not specified since fixed length always equal to 55 characters (55 bytes)
    
    Value: “BAX Test / /Paris /FR “

#### Binary field

This field is encoded in hexa. The length is expressed as a number of bytes.

    Example:
    Field n° 55 – Chip Related Data
    Attribute: LLVAR b…255
    Coding: 69 9f 02 06 00 00 00 00 21 00 9f 03 06 00 00 00 00 00 00 9f 1a 02 02 50 95 05 00 00 00 00 00 5f 2a 02 09 78 9a
    03 18 01 09 9c 01 00 9f 37 04 0f 01 0e 03 82 02 1a 80 9f 36 02 00 01 9f 10 20 0f a5 01 a0 81 01 00 00 ee af 28 c6 83 81
    c2 ed 0f 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 9f 26 08 a1 a7 17 06 5f f0 30 a3
    Length: 69 hex = 105 dec
