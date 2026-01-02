---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1091
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1091 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: logoutresponse.txt]---
Location: zulip-main/zerver/tests/fixtures/saml/logoutresponse.txt

```text
<samlp:LogoutResponse xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Destination="http://zulip.testserver/complete/saml/" ID="ID_d76b3713-ef98-45b2-9ba3-f1c8a5f277f0" InResponseTo="ONELOGIN_0e2c575e2111fe775d776ece5cf7bbad24d1c669" IssueInstant="2022-04-17T20:45:46.273Z" Version="2.0"><Issuer>https://idp.testshib.org/idp/shibboleth</Issuer><samlp:Status><samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></samlp:Status></samlp:LogoutResponse>
```

--------------------------------------------------------------------------------

---[FILE: samlresponse.txt]---
Location: zulip-main/zerver/tests/fixtures/saml/samlresponse.txt

```text
<?xml version="1.0" encoding="UTF-8"?><saml2p:Response Destination="http://zulip.testserver/complete/saml/" ID="id544612569720442296425226" InResponseTo="ONELOGIN_a5fde8b09598814d7af2537f865d31c2f7aea831" IssueInstant="2019-09-25T01:02:02.120Z" Version="2.0" xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:xs="http://www.w3.org/2001/XMLSchema"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">https://idp.testshib.org/idp/shibboleth</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#id544612569720442296425226"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces PrefixList="xs" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>P/e+Gdz179UAcrrPZW2R9hzxMlSAGwbZ+Ogksp7Rzlg=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>H1eepG122h3jzIqorofI6sr636xVFFtqsN0Vj5eb9YoFN3KMDH1AqzvGbzA+XEoT/1vle/D2n1A0qMv6UrnMy0EgrZlA+Mx3MgcQDhFoIqI7lV48I2aJ+G1+FvTrzt1hhfn6SBTorhc3M2+ST9z68V8mLsNXr82GveL/Ej5J4rxbQQ0Jxaic3luAkV0EhROqiSDwC7e/45II34e3sdtQ9bbnf3feDbovklb7Daa/NIqWpWX+0Y9qhHo1zx05oPiGZFtveJHiUbFXPpjR0r1juuG3HTGkORhRHCMYnpz73NsmuBTkAgYE+G0vUr0k5Sk28efS15ZZuAyiN+XCjl6SzQ==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIDojCCAoqgAwIBAgIGAW0svbVqMA0GCSqGSIb3DQEBCwUAMIGRMQswCQYDVQQGEwJVUzETMBEG
A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU
MBIGA1UECwwLU1NPUHJvdmlkZXIxEjAQBgNVBAMMCXp1bGlwY2hhdDEcMBoGCSqGSIb3DQEJARYN
aW5mb0Bva3RhLmNvbTAeFw0xOTA5MTMyMjI3MTNaFw0yOTA5MTMyMjI4MTNaMIGRMQswCQYDVQQG
EwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UE
CgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEjAQBgNVBAMMCXp1bGlwY2hhdDEcMBoGCSqG
SIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL3K
E57ZDDVplrZO1RKpz9zFekhXZZFiPhW2TCTtoaI966sGaRCmV10cb1FCUxxI3ilcjY8G5irHYc5O
D4S8+FeIaHb036VjtZZNCDkamE2zGZCix5wCpXhxhQrXkkPJbzO4IGW896O43FPwefGfYnPC8/Oj
bZ0OUuR8KkNbgn2VnqwZtmb0EX5xrA+212UDyVQ7izVXOoBbvzeydLh8EWteEXjKBREKGBfCL9Kl
x8JY7BlYrZx+13NeDQsL7bgTXMnTIp3MVP3xddRqsatwersRVGr9b/HzXxfwu/MU230swjsNlgLZ
OXiYD43rNEkJRlFfMnlY8F3IoE1Mki2BJtMCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAI8Xk13NT
rjo417U1+wZjUKqvB7iw4zGapMqpGRVavGw9hZmSCs8/AJAkFZQKMhAR9GGqf7JHHj/4fNEQ+XVh
YF1jCUR/X2VwUiBseDHaUKj7EZiX9tIFEI/6LVfPRjKNy1RkEXHo7Lg4RnctclZ1KU7mIZkPSk1J
fShKIUhtvNaCYJ4OVkN+giQQ6u9HwBqoBYikOBhvgXfIlBFD5H1n7JqxOjWZNO7Rhhx+TjD/0Dmd
BE04J2bv5zCllBWSv2e1YFi+5SBTBq6FaIMz5c8T4WRFpRlnDEvvEREeAsAbaDiYvpJlO6hOzHNj
KVmHpmQsDhsgXP02tDsfTARf3EXhbA==</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2p:Status xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"><saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></saml2p:Status><saml2:Assertion ID="id54461256972849811250394622" IssueInstant="2019-09-25T01:02:02.120Z" Version="2.0" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">http://www.okta.com/exk1da4osrIL3Y7ip357</saml2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#id54461256972849811250394622"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"><ec:InclusiveNamespaces PrefixList="xs" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>J5+QPDVShpm1VpG+dAjbU5GNrRwkEVMQ3MthoFukiH4=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>RWvjlS6nr7MUm6JzSn71nD3nkM77bja8Mnfy8GZYL0tQwtLBdixgW+oUF8jSXId9/dkYKCcq1n3fxzyX1iMkAeF7YcUlmpfN56hRKECzdWmaaceCS7s15vTqN/Gy83AFWp6d/nBbyt25UnGtmOSJjU5+QmBBB/JJO2EjtCiJZlJkJy3V1nOU/PnJ5p3iutUNtn17gqVYKkWix8b95xdoOHEZLC/0w8pt6OOLePlg+HafCg0XA7jS3g4+vPagcAEhSBIEpX9rZVdaWZdpP5NxHbjtyG979n5tzx7ooVBebrEfPdneoQeZQabNU/jUeeWXBJNaQ3Rv59EidOaTI68LZA==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIDojCCAoqgAwIBAgIGAW0svbVqMA0GCSqGSIb3DQEBCwUAMIGRMQswCQYDVQQGEwJVUzETMBEG
A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU
MBIGA1UECwwLU1NPUHJvdmlkZXIxEjAQBgNVBAMMCXp1bGlwY2hhdDEcMBoGCSqGSIb3DQEJARYN
aW5mb0Bva3RhLmNvbTAeFw0xOTA5MTMyMjI3MTNaFw0yOTA5MTMyMjI4MTNaMIGRMQswCQYDVQQG
EwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UE
CgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEjAQBgNVBAMMCXp1bGlwY2hhdDEcMBoGCSqG
SIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL3K
E57ZDDVplrZO1RKpz9zFekhXZZFiPhW2TCTtoaI966sGaRCmV10cb1FCUxxI3ilcjY8G5irHYc5O
D4S8+FeIaHb036VjtZZNCDkamE2zGZCix5wCpXhxhQrXkkPJbzO4IGW896O43FPwefGfYnPC8/Oj
bZ0OUuR8KkNbgn2VnqwZtmb0EX5xrA+212UDyVQ7izVXOoBbvzeydLh8EWteEXjKBREKGBfCL9Kl
x8JY7BlYrZx+13NeDQsL7bgTXMnTIp3MVP3xddRqsatwersRVGr9b/HzXxfwu/MU230swjsNlgLZ
OXiYD43rNEkJRlFfMnlY8F3IoE1Mki2BJtMCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAI8Xk13NT
rjo417U1+wZjUKqvB7iw4zGapMqpGRVavGw9hZmSCs8/AJAkFZQKMhAR9GGqf7JHHj/4fNEQ+XVh
YF1jCUR/X2VwUiBseDHaUKj7EZiX9tIFEI/6LVfPRjKNy1RkEXHo7Lg4RnctclZ1KU7mIZkPSk1J
fShKIUhtvNaCYJ4OVkN+giQQ6u9HwBqoBYikOBhvgXfIlBFD5H1n7JqxOjWZNO7Rhhx+TjD/0Dmd
BE04J2bv5zCllBWSv2e1YFi+5SBTBq6FaIMz5c8T4WRFpRlnDEvvEREeAsAbaDiYvpJlO6hOzHNj
KVmHpmQsDhsgXP02tDsfTARf3EXhbA==</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml2:Subject xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">{email}</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData InResponseTo="ONELOGIN_a5fde8b09598814d7af2537f865d31c2f7aea831" NotOnOrAfter="2019-09-25T01:07:02.120Z" Recipient="http://zulip.testserver/complete/saml/"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="2019-09-25T00:57:02.120Z" NotOnOrAfter="2019-09-25T01:07:02.120Z" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AudienceRestriction><saml2:Audience>http://zulip.testserver</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="2019-09-25T01:01:37.741Z" SessionIndex="ONELOGIN_a5fde8b09598814d7af2537f865d31c2f7aea831" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement><saml2:AttributeStatement xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:Attribute Name="first_name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><saml2:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">{first_name}</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="last_name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><saml2:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">{last_name}</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><saml2:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">{email}</saml2:AttributeValue></saml2:Attribute>{extra_attrs}</saml2:AttributeStatement></saml2:Assertion></saml2p:Response>
```

--------------------------------------------------------------------------------

---[FILE: zulip.crt]---
Location: zulip-main/zerver/tests/fixtures/saml/zulip.crt

```text
-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUdxMUceyfJ0JWc9+631OR8cJDxREwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0xOTA5MjQyMjAwMDFaFw0yOTA5
MjMyMjAwMDFaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQDk5VXGfX6rAwkCoNYTTCsmZLcmhNW8KXbr0+giMHJ2
1wswiFZadOevRbgEKeB6b7d/4G0JNTtcTKrq3LqBX7YiQqRsUegBMf1Ev8Gsx8c3
LJKreOd2NdN0CKgEYtm0YAkOwoM4Idg5JUzfDHOJN6Q/ktUsUD8/LERjDzrLGTte
A/HThow++1HIUKQCubzJXqyehC9/+gz17bCRq5XBaKB5oxjq0c8tNU6rFXnbYVZJ
/v6OpKfzzg+BV73VVQWtfT40Aco5kBhp6gCjj3N1UQHX9KgEmtQpBHSqb9YbWGcn
CILJ7HUgRdRVf0TEj83bT/IEmgAw0DOaDbWIjmUTsOW3AgMBAAGjUzBRMB0GA1Ud
DgQWBBSXe/5beCNwVuyWNfQLiET1HYrjaTAfBgNVHSMEGDAWgBSXe/5beCNwVuyW
NfQLiET1HYrjaTAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAQ
n4tWLuO2pcJzN4s8xJdG19Qne+H2N1mfRgzfSOIAAHWYXuP8i2JXp+QgPRai/Jse
54p3WRM2JWrGicjgx/XDAsDv+SyZB3uF1r5yPGdKt05VRC/wiGh3p0rosGr5+8B0
lICHeKPgOg0pCX3k3iU15ZkT8OA+5IQmyonB3gxtAjkUKTTUjd5gnIY8KIbcfrTw
iJMPLLumpUx1NMbEcmcB1HKT2YHwPUh93d6FA5WAr0y9swke4VhI2vXTovwnR9CU
oXbZrHH231O6SDaccl0/qFp6FDuSogRt9oiZorw8kk1NPyx21mqfmCgZ6tAZ7SJZ
0ppBMmyTLo1PL86rZcF9
-----END CERTIFICATE-----
```

--------------------------------------------------------------------------------

---[FILE: zulip.key]---
Location: zulip-main/zerver/tests/fixtures/saml/zulip.key

```text
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDk5VXGfX6rAwkC
oNYTTCsmZLcmhNW8KXbr0+giMHJ21wswiFZadOevRbgEKeB6b7d/4G0JNTtcTKrq
3LqBX7YiQqRsUegBMf1Ev8Gsx8c3LJKreOd2NdN0CKgEYtm0YAkOwoM4Idg5JUzf
DHOJN6Q/ktUsUD8/LERjDzrLGTteA/HThow++1HIUKQCubzJXqyehC9/+gz17bCR
q5XBaKB5oxjq0c8tNU6rFXnbYVZJ/v6OpKfzzg+BV73VVQWtfT40Aco5kBhp6gCj
j3N1UQHX9KgEmtQpBHSqb9YbWGcnCILJ7HUgRdRVf0TEj83bT/IEmgAw0DOaDbWI
jmUTsOW3AgMBAAECggEAfCCyB1X+3xZiSH6YGRbxP3zWpZjbn5KM3w6nkALdz/yG
IOeOjLdg/Pe99uQOy9bRmBNIjfnEGyWoen0A1y/kQWgKaoNwYVWOlz219dDRA+a0
EzEZtE00QnR/SQGiNeLuhoaNSl9wNm035q2F6h+2fpNN7x4Fbmi/HUkhBQrF2xEZ
vK6WXb5uHiWYJ4wIEw5nc/DMY3NZ6vJgU+T6uMkj1llhlTtKFFNnRS9yrt46D0Bb
yJEP+9RhmSkAjZyKICYNh/r7Me0CU3AOHnyAR6Tyz7KweupE91INclzPuL2HEd6R
05TntfqC+yimwa0AY4dX+cUntr82B5KarWur94Uj4QKBgQD9az4OcIPV7qEobVwo
eqfgJc9sN0806ESgzCxIRut/RPNykr76zE6tYPQbzAi9iQQYi+yXVkZddUWWPtht
qTv9LIuGb0NqKLUQYx2tpyh0gFnJJHyKSmooIfoKDEkSLWyPzn2tKPrGOQ683tjX
vMGNfUIyaHMsidRwOs58oiweswKBgQDnOibfvPjEVrSYRcimUmm8WS7tCBJFd5LL
cL//NfHQ92SX6z33j71Qz80ezLIrHHizhjaxPTxXGny/unc8j3njM15ilZmNB9Lg
wtTW3H+MamFF3nTI6/M1iaAM2OIY9nTwZv/UMMmBuVsNOa0mdo1FxxF9ik8MQibB
vsO65YKe7QKBgQCamE2nKWSDoauWqgBKgWjgCLDc53DeacNUBLoO7ZTEcx/AiV0Q
SorEohzIyFOcrHVfNB0ExZDvepcU7QnC/DaoYABN5ppNrL+oW47DXPIFADfFyQhg
pLzV9sQ+VPhOqn9Ly0BH3nP9cNlYxump0nCRDBTSA34fcYWzYWyOA7C+mQKBgQCS
UjpHW04Q8M1XjtFqbrx6c/U+Cd2GGCTMmIzm8zwTAHqnqDWOc2dZvCYRV3dn0JyQ
/l2dyyJj/F709Qp/SEvZeqg/umtw04KeuKv3S5FrSeZEUIGWo7lEJ9MgTh7FrTBS
8Nrza+wYKzNzKwxnSp4bid2Hk/5xw2rDL/SsUJBYAQKBgQDqeuuosCuynOZKF/Vy
tMZ7ms1GQzfmnkh1uA+OdTMkxwN/DXbJJwo89EouPN+KVpdM8GlvWRZesrVtqSpO
wK94UzIVrejv6sLUz33tTyRoMrPmkQ9r6KdpHrHwTAJzfceeqHwK1XUCEf/ht4A6
0zaX2kWvylQBjsD293QfCerl3A==
-----END PRIVATE KEY-----
```

--------------------------------------------------------------------------------

---[FILE: channels.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/channels.json

```json
[
    {
        "id": "C061A0WJG",
        "name": "random",
        "created": "1433558319",
        "is_general": false,
        "members": ["U061A1R2R", "U061A5N1G"],
        "is_archived": true,
        "topic": {
            "value": "random"
        },
        "purpose": {
            "value": "no purpose"
        }
    },
    {
        "id": "C061A0YJG",
        "name": "general",
        "created": "1433559319",
        "is_general": false,
        "is_archived": false,
        "members": ["U061A1R2R", "U061A5N1G", "U064KUGRJ"],
        "topic": {
            "value": "general"
        },
        "purpose": {
            "value": "general"
        }
    },
    {
        "id": "C061A0YJP",
        "name": "general1",
        "created": "1433559319",
        "is_general": false,
        "is_archived": false,
        "members": ["U061A1R2R"],
        "topic": {
            "value": "general channel"
        },
        "purpose": {
            "value": "For everyone"
        }
    },
    {
        "id": "C061A0HJG",
        "name": "sharedchannel",
        "created": "1433558359",
        "is_general": false,
        "members": ["U061A3E0G", "U061A1R2R"],
        "is_archived": false,
        "topic": {
            "value": ""
        },
        "purpose": {
            "value": ""
        }
    }
]
```

--------------------------------------------------------------------------------

---[FILE: dms.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/dms.json

```json
[
    {
        "id": "DJ47BL849",
        "created": 1556638416,
        "members": [
            "U061A1R2R",
            "U061A5N1G"
        ]
    },
    {
        "id": "DHX1UP7EG",
        "created": 1555422321,
        "members": [
            "U061A5N1G",
            "U064KUGRJ"
        ]
    },
    {
        "id": "DK8HSJDHS",
        "created": 1555422321,
        "members": [
            "U061A1R2R",
            "U064KUGRJ"
        ]
    },
    {
        "id": "DRS3PSLDK",
        "created": 1555422321,
        "members": [
            "U064KUGRJ",
            "U064KUGRJ"
        ]
    }
]
```

--------------------------------------------------------------------------------

---[FILE: mpims.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/mpims.json

```json
[
    {
        "id": "G9HBG2A5D",
        "name": "mpdm-user9--user2--user10-1",
        "created": 1519833671,
        "creator": "U1HJ9SY49",
        "is_archived": false,
        "members": [
            "U061A1R2R",
            "U061A5N1G",
            "U064KUGRJ",
            "U061A3E0G"
        ],
        "topic": {
            "value": "Group messaging",
            "creator": "U061A1R2R",
            "last_set": "1519833671"
        },
        "purpose": {
            "value": "Group messaging with: @user1 @user2 @user3",
            "creator": "U061A1R2R",
            "last_set": "1519833671"
        }
    },
    {
        "id": "G6H1Z0ZPS",
        "name": "mpdm-user6--user7--user4-1",
        "created": 1501769332,
        "creator": "U3673G9N2",
        "is_archived": false,
        "members": [
            "U061A1R2R",
            "U061A5N1G",
            "U064KUGRJ"
        ],
        "topic": {
            "value": "Group messaging",
            "creator": "U061A5N1G",
            "last_set": "1501769332"
        },
        "purpose": {
            "value": "Group messaging with: @user4 @user1 @user5",
            "creator": "U061A5N1G",
            "last_set": "1501769332"
        }
    },
    {
        "id": "G6N944JPL",
        "name": "mpdm-user4--user1--user5-1",
        "created": 1502722911,
        "creator": "U1HJ9SY49",
        "is_archived": false,
        "members": [
            "U064KUGRJ",
            "U061A3E0G"
        ],
        "topic": {
            "value": "Group messaging",
            "creator": "U064KUGRJ",
            "last_set": "1502722911"
        },
        "purpose": {
            "value": "Group messaging with: @user6 @user7 @user4",
            "creator": "U064KUGRJ",
            "last_set": "1502722911"
        }
    }
]
```

--------------------------------------------------------------------------------

---[FILE: team_info.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/team_info.json

```json
{
    "ok": true,
    "team": {
        "id": "Z7LITMQ0Y",
        "name": "acme",
        "domain": "acme",
        "email_domain": "acme.com",
        "icon": {
            "image_34": "https:\/\/avatars.slack-edge.com\/2019-01-21\/783629837827_98743hb4793vjhad73jh3_34.jpg",
            "image_44": "https:\/\/avatars.slack-edge.com\/2019-01-21\/783629837827_98743hb4793vjhad73jh3_44.jpg",
            "image_68": "https:\/\/avatars.slack-edge.com\/2019-01-21\/783629837827_98743hb4793vjhad73jh3_68.jpg",
            "image_88": "https:\/\/avatars.slack-edge.com\/2019-01-21\/783629837827_98743hb4793vjhad73jh3_88.jpg",
            "image_102": "https:\/\/avatars.slack-edge.com\/2019-01-21\/783629837827_98743hb4793vjhad73jh3_102.jpg",
            "image_132": "https:\/\/avatars.slack-edge.com\/2019-01-21\/783629837827_98743hb4793vjhad73jh3_132.jpg",
            "image_230": "https:\/\/avatars.slack-edge.com\/2019-01-21\/783629837827_98743hb4793vjhad73jh3_230.jpg",
            "image_original": "https:\/\/avatars.slack-edge.com\/2019-01-23\/783629837827_98743hb4793vjhad73jh3_original.jpg"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: unicode_team_info.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/unicode_team_info.json

```json
{
  "ok": true,
  "team": {
    "id": "T04LT7JD2AZ",
    "name": "例",
    "url": "https://w1674835429-reo773452.slack.com/",
    "domain": "w1674835429-reo773452",
    "email_domain": "",
    "icon": {
      "image_default": true,
      "image_34": "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-34.png",
      "image_44": "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-44.png",
      "image_68": "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-68.png",
      "image_88": "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-88.png",
      "image_102": "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-102.png",
      "image_230": "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-230.png",
      "image_132": "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-132.png"
    },
    "avatar_base_url": "https://ca.slack-edge.com/",
    "is_verified": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: unicode_user_data.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/unicode_user_data.json

```json
{
    "cache_ts": 1674860232,
    "members": [
        {
            "color": "757575",
            "deleted": false,
            "id": "USLACKBOT",
            "is_admin": false,
            "is_app_user": false,
            "is_bot": false,
            "is_email_confirmed": false,
            "is_owner": false,
            "is_primary_owner": false,
            "is_restricted": false,
            "is_ultra_restricted": false,
            "name": "slackbot",
            "profile": {
                "always_active": true,
                "avatar_hash": "sv41d8cd98f0",
                "display_name": "Slackbot",
                "display_name_normalized": "Slackbot",
                "fields": {},
                "first_name": "slackbot",
                "image_192": "https://a.slack-edge.com/80588/marketing/img/avatars/slackbot/avatar-slackbot.png",
                "image_24": "https://a.slack-edge.com/80588/img/slackbot_24.png",
                "image_32": "https://a.slack-edge.com/80588/img/slackbot_32.png",
                "image_48": "https://a.slack-edge.com/80588/img/slackbot_48.png",
                "image_512": "https://a.slack-edge.com/80588/img/slackbot_512.png",
                "image_72": "https://a.slack-edge.com/80588/img/slackbot_72.png",
                "last_name": "",
                "phone": "",
                "real_name": "Slackbot",
                "real_name_normalized": "Slackbot",
                "skype": "",
                "status_emoji": "",
                "status_emoji_display_info": [],
                "status_expiration": 0,
                "status_text": "",
                "status_text_canonical": "",
                "team": "T04LT7JD2AZ",
                "title": ""
            },
            "real_name": "Slackbot",
            "team_id": "T04LT7JD2AZ",
            "tz": "America/Los_Angeles",
            "tz_label": "Pacific Standard Time",
            "tz_offset": -28800,
            "updated": 0,
            "who_can_share_contact_card": "EVERYONE"
        },
        {
            "color": "9f69e7",
            "deleted": false,
            "id": "U04LW5V0LH0",
            "is_admin": true,
            "is_app_user": false,
            "is_bot": false,
            "is_email_confirmed": true,
            "is_owner": true,
            "is_primary_owner": true,
            "is_restricted": false,
            "is_ultra_restricted": false,
            "name": "alexmv",
            "profile": {
                "avatar_hash": "g6040af6e26d",
                "display_name": "",
                "display_name_normalized": "",
                "email": "alexmv@zulip.com",
                "fields": null,
                "first_name": "alexmv",
                "image_192": "https://secure.gravatar.com/avatar/6040af6e26d481c0e5fd4ac2fe4ea460.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0004-192.png",
                "image_24": "https://secure.gravatar.com/avatar/6040af6e26d481c0e5fd4ac2fe4ea460.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0004-24.png",
                "image_32": "https://secure.gravatar.com/avatar/6040af6e26d481c0e5fd4ac2fe4ea460.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0004-32.png",
                "image_48": "https://secure.gravatar.com/avatar/6040af6e26d481c0e5fd4ac2fe4ea460.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0004-48.png",
                "image_512": "https://secure.gravatar.com/avatar/6040af6e26d481c0e5fd4ac2fe4ea460.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0004-512.png",
                "image_72": "https://secure.gravatar.com/avatar/6040af6e26d481c0e5fd4ac2fe4ea460.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0004-72.png",
                "last_name": "",
                "phone": "",
                "real_name": "alexmv",
                "real_name_normalized": "alexmv",
                "skype": "",
                "status_emoji": "",
                "status_emoji_display_info": [],
                "status_expiration": 0,
                "status_text": "",
                "status_text_canonical": "",
                "team": "T04LT7JD2AZ",
                "title": ""
            },
            "real_name": "alexmv",
            "team_id": "T04LT7JD2AZ",
            "tz": "America/New_York",
            "tz_label": "Eastern Standard Time",
            "tz_offset": -18000,
            "updated": 1674835388,
            "who_can_share_contact_card": "EVERYONE"
        },
        {
            "color": "4bbe2e",
            "deleted": false,
            "id": "U04LYMYPGSG",
            "is_admin": false,
            "is_app_user": false,
            "is_bot": true,
            "is_email_confirmed": false,
            "is_owner": false,
            "is_primary_owner": false,
            "is_restricted": false,
            "is_ultra_restricted": false,
            "name": "zulip_export",
            "profile": {
                "always_active": false,
                "api_app_id": "A04LFM9BJ6T",
                "avatar_hash": "g2668f8ddfc6",
                "bot_id": "B04LW4RLEGK",
                "display_name": "",
                "display_name_normalized": "",
                "fields": null,
                "first_name": "Zulip",
                "image_192": "https://secure.gravatar.com/avatar/2668f8ddfc6b6c6289f2fd5ba5490cae.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-192.png",
                "image_24": "https://secure.gravatar.com/avatar/2668f8ddfc6b6c6289f2fd5ba5490cae.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-24.png",
                "image_32": "https://secure.gravatar.com/avatar/2668f8ddfc6b6c6289f2fd5ba5490cae.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-32.png",
                "image_48": "https://secure.gravatar.com/avatar/2668f8ddfc6b6c6289f2fd5ba5490cae.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-48.png",
                "image_512": "https://secure.gravatar.com/avatar/2668f8ddfc6b6c6289f2fd5ba5490cae.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-512.png",
                "image_72": "https://secure.gravatar.com/avatar/2668f8ddfc6b6c6289f2fd5ba5490cae.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-72.png",
                "last_name": "export",
                "phone": "",
                "real_name": "Zulip export",
                "real_name_normalized": "Zulip export",
                "skype": "",
                "status_emoji": "",
                "status_emoji_display_info": [],
                "status_expiration": 0,
                "status_text": "",
                "status_text_canonical": "",
                "team": "T04LT7JD2AZ",
                "title": ""
            },
            "real_name": "Zulip export",
            "team_id": "T04LT7JD2AZ",
            "tz": "America/Los_Angeles",
            "tz_label": "Pacific Standard Time",
            "tz_offset": -28800,
            "updated": 1674836111,
            "who_can_share_contact_card": "EVERYONE"
        }
    ],
    "ok": true,
    "response_metadata": {
        "next_cursor": ""
    }
}
```

--------------------------------------------------------------------------------

---[FILE: user_data.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/user_data.json

```json
{
    "ok": true,
    "members": [
       {"id": "U6006P1CN",
        "team_id": "T5YFFM2QY",
        "name": "k._",
        "deleted": false,
        "color": "9f69e7",
        "real_name": "Josef K.",
        "tz": "Europe\/Amsterdam",
        "tz_label": "Central European Time",
        "tz_offset": 3600,
        "profile": {
            "title": "",
            "phone": "",
            "skype": "",
            "real_name": "Josef K.",
            "real_name_normalized": "Josef K.",
            "display_name": "k._",
            "display_name_normalized": "k._",
            "status_text": "",
            "status_emoji": "",
            "avatar_hash": "gd41c3c33cbe",
            "email": "rhtbot@protonmail.com",
            "first_name": "Josef",
            "last_name": "K.",
            "image_24": "https:\/\/secure.gravatar.com\/avatar\/d41c3c33cbe6accfb8711e6f21a17c45.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2F0180%2Fimg%2Favatars%2Fava_0025-24.png",
                    "image_32": "https:\/\/secure.gravatar.com\/avatar\/d41c3c33cbe6accfb8711e6f21a17c45.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0025-32.png",
                    "image_48": "https:\/\/secure.gravatar.com\/avatar\/d41c3c33cbe6accfb8711e6f21a17c45.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0025-48.png",
                    "image_72": "https:\/\/secure.gravatar.com\/avatar\/d41c3c33cbe6accfb8711e6f21a17c45.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0025-72.png",
                    "image_192": "https:\/\/secure.gravatar.com\/avatar\/d41c3c33cbe6accfb8711e6f21a17c45.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0025-192.png",
                    "image_512": "https:\/\/secure.gravatar.com\/avatar\/d41c3c33cbe6accfb8711e6f21a17c45.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0025-512.png",
                    "team": "T5YFFM2QY"
            },
        "is_admin": true,
        "is_owner": true,
        "is_primary_owner": true,
        "is_restricted": false,
        "is_ultra_restricted": false,
        "is_bot": false,
        "updated": 1504496865,
        "is_app_user": false,
        "has_2fa": false},
       {"id": "U8W3QFGQ5",
        "team_id": "T5YFFM2QY",
        "name": "rheaparekh12",
        "deleted": false,
        "color": "e7392d",
        "real_name": "Rhea Parekh",
        "tz": "Asia\/Kolkata",
        "tz_label": "India Standard Time",
        "tz_offset": 19800,
        "profile": {
                "title": "",
                "phone": "",
                "skype": "",
                "real_name": "Rhea Parekh",
                "real_name_normalized": "Rhea Parekh",
                "display_name": "Rhea",
                "display_name_normalized": "Rhea",
                "status_text": "",
                "status_emoji": "",
                "avatar_hash": "g1260bbb9ad8",
                "email": "rheaparekh12@gmail.com",
                "image_24": "https:\/\/secure.gravatar.com\/avatar\/1260bbb9ad836a3122d081d49d083214.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0024-24.png",
                "image_32": "https:\/\/secure.gravatar.com\/avatar\/1260bbb9ad836a3122d081d49d083214.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0024-32.png",
                "image_48": "https:\/\/secure.gravatar.com\/avatar\/1260bbb9ad836a3122d081d49d083214.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0024-48.png",
                "image_72": "https:\/\/secure.gravatar.com\/avatar\/1260bbb9ad836a3122d081d49d083214.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0024-72.png",
                "image_192": "https:\/\/secure.gravatar.com\/avatar\/1260bbb9ad836a3122d081d49d083214.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0024-192.png",
                "image_512": "https:\/\/secure.gravatar.com\/avatar\/1260bbb9ad836a3122d081d49d083214.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0024-512.png",
                "team": "T5YFFM2QY"
        },
        "is_admin": true,
        "is_owner": true,
        "is_primary_owner": false,
        "is_restricted": false,
        "is_ultra_restricted": false,
        "is_bot": false,
        "updated": 1516457942,
        "is_app_user": false,
        "has_2fa": false},
       {"id": "U8X25EBAB",
        "team_id": "T5YFFM2QY",
        "name": "rishiweb_0",
        "deleted": false,
        "color": "3c989f",
        "real_name": "Rishi \u0939\u093f\u0928\u094d\u0926\u0940 \u6c49\u8bed",
        "tz": "Asia\/Kolkata",
        "tz_label": "India Standard Time",
        "tz_offset": 19800,
        "profile": {
                "title": "",
                "phone": "",
                "skype": "",
                "real_name": "Rishi \u0939\u093f\u0928\u094d\u0926\u0940 \u6c49\u8bed",
                "real_name_normalized": "Rishi \u0939\u0928\u0926 \u6c49\u8bed",
                "display_name": "\u6c49\u8bed \u0939\u093f\u0928\u094d\u0926\u0940",
                "display_name_normalized": "\u6c49\u8bed \u0939\u0928\u0926",
                "status_text": "",
                "status_emoji": "",
                "avatar_hash": "gbe7dc6bed51",
                "email": "rishiweb+0@mit.edu",
                "image_24": "https:\/\/secure.gravatar.com\/avatar\/be7dc6bed51f59ef43acb198109451da.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0001-24.png",
                "image_32": "https:\/\/secure.gravatar.com\/avatar\/be7dc6bed51f59ef43acb198109451da.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0001-32.png",
                "image_48": "https:\/\/secure.gravatar.com\/avatar\/be7dc6bed51f59ef43acb198109451da.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F0180%2Fimg%2Favatars%2Fava_0001-48.png",
                "image_72": "https:\/\/secure.gravatar.com\/avatar\/be7dc6bed51f59ef43acb198109451da.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2F3654%2Fimg%2Favatars%2Fava_0001-72.png",
                "image_192": "https:\/\/secure.gravatar.com\/avatar\/be7dc6bed51f59ef43acb198109451da.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0001-192.png",
                "image_512": "https:\/\/secure.gravatar.com\/avatar\/be7dc6bed51f59ef43acb198109451da.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0001-512.png",
                "team": "T5YFFM2QY"
        },
        "is_admin": true,
        "is_owner": false,
        "is_primary_owner": false,
        "is_restricted": false,
        "is_ultra_restricted": false,
        "is_bot": false,
        "updated": 1516457965,
        "is_app_user": false,
        "has_2fa": false},
       {"id": "U8VAHEVUY",
        "team_id": "T5YFFM2QY",
        "name": "showell30",
        "deleted": false,
        "color": "4bbe2e",
        "real_name": "Steve Howell",
        "tz": "America\/New_York",
        "tz_label": "Eastern Standard Time",
        "tz_offset": -18000,
        "profile": {
                "title": "",
                "phone": "",
                "skype": "",
                "real_name": "Steve Howell",
                "real_name_normalized": "Steve Howell",
                "display_name": "Steve",
                "display_name_normalized": "Steve",
                "status_text": "",
                "status_emoji": "",
                "avatar_hash": "gb60683e6dac",
                "email": "showell30@yahoo.com",
                "image_24": "https:\/\/secure.gravatar.com\/avatar\/b60683e6dacd4556ae15430a7c9b6f13.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2F0180%2Fimg%2Favatars%2Fava_0004-24.png",
                "image_32": "https:\/\/secure.gravatar.com\/avatar\/b60683e6dacd4556ae15430a7c9b6f13.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0004-32.png",
                "image_48": "https:\/\/secure.gravatar.com\/avatar\/b60683e6dacd4556ae15430a7c9b6f13.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0004-48.png",
                "image_72": "https:\/\/secure.gravatar.com\/avatar\/b60683e6dacd4556ae15430a7c9b6f13.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0004-72.png",
                "image_192": "https:\/\/secure.gravatar.com\/avatar\/b60683e6dacd4556ae15430a7c9b6f13.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0004-192.png",
                "image_512": "https:\/\/secure.gravatar.com\/avatar\/b60683e6dacd4556ae15430a7c9b6f13.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0004-512.png",
                "team": "T5YFFM2QY"
        },
        "is_admin": false,
        "is_owner": false,
        "is_primary_owner": false,
        "is_restricted": false,
        "is_ultra_restricted": false,
        "is_bot": false,
        "updated": 1516454398,
        "is_app_user": false,
        "has_2fa": false},
       {"id": "USLACKBOT",
        "team_id": "T5YFFM2QY",
        "name": "slackbot",
        "deleted": false,
        "color": "757575",
        "real_name": "slackbot",
        "tz": null,
        "tz_label": "Pacific Standard Time",
        "tz_offset": -28800,
        "profile": {
                "title": "",
                "phone": "",
                "skype": "",
                "real_name": "slackbot",
                "real_name_normalized": "slackbot",
                "display_name": "slackbot",
                "display_name_normalized": "slackbot",
                "fields": null,
                "status_text": "",
                "status_emoji": "",
                "avatar_hash": "sv1444671949",
                "always_active": true,
                "first_name": "slackbot",
                "last_name": "",
                "image_24": "https:\/\/a.slack-edge.com\/0180\/img\/slackbot_24.png",
                "image_32": "https:\/\/a.slack-edge.com\/7f1a0\/plugins\/slackbot\/assets\/service_32.png",
                "image_48": "https:\/\/a.slack-edge.com\/7f1a0\/plugins\/slackbot\/assets\/service_48.png",
                "image_72": "https:\/\/a.slack-edge.com\/0180\/img\/slackbot_72.png",
                "image_192": "https:\/\/a.slack-edge.com\/66f9\/img\/slackbot_192.png",
                "image_512": "https:\/\/a.slack-edge.com\/1801\/img\/slackbot_512.png",
                "team": "T5YFFM2QY"
        },
        "is_admin": false,
        "is_owner": false,
        "is_primary_owner": false,
        "is_restricted": false,
        "is_ultra_restricted": false,
        "is_bot": false,
        "updated": 0,
        "is_app_user": false}],
    "cache_ts": 1518116853
}
```

--------------------------------------------------------------------------------

---[FILE: normal_messages.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/normal_messages.json

```json
[
    {
        "text": "<@U066MTL5U> has joined the channel",
        "subtype": "channel_join",
        "user": "U066MTL5U",
        "ts": "1434139102.000002",
        "channel_name": "random"
    },
    {
        "text": "<@U061A5N1G>: hey!",
        "user": "U061A1R2R",
        "ts": "1437868294.000006",
        "has_image": true,
        "channel_name": "random"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: normal_thread.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/normal_thread.json

```json
[
    {
        "text": "message body text",
        "user": "U061A5N1G",
        "ts": "1434139102.000002",
        "thread_ts": "1434139102.000002",
        "channel_name": "random"
    },
    {
        "text": "random",
        "user": "U061A5N1G",
        "ts": "1439868294.000007",
        "parent_user_id": "U061A5N1G",
        "thread_ts": "1434139102.000002",
        "channel_name": "random"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: threads_with_colliding_topic_names.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/threads_with_colliding_topic_names.json

```json
[
    {
        "text": "message body text",
        "user": "U061A5N1G",
        "ts": "1434139102.000002",
        "thread_ts": "1434139102.000002",
        "channel_name": "random"
    },
    {
        "text": "random",
        "user": "U061A5N1G",
        "ts": "1439868294.000007",
        "parent_user_id": "U061A5N1G",
        "thread_ts": "1434139102.000002",
        "channel_name": "random"
    },
    {
        "text": "message body text",
        "user": "U061A5N1G",
        "ts": "1434139200.000002",
        "thread_ts": "1434139200.000002",
        "channel_name": "random"
    },
    {
        "text": "The first reply to the third thread",
        "user": "U061A1R2R",
        "ts": "1439869295.000008",
        "parent_user_id": "U061A5N1G",
        "thread_ts": "1434139200.000002",
        "channel_name": "random"
    },
    {
        "text": "message body text",
        "user": "U061A5N1G",
        "ts": "144139100.000008",
        "thread_ts": "144139100.000008",
        "channel_name": "random"
    },
    {
        "text": "This thread shouldn't collide",
        "user": "U061A1R2R",
        "ts": "1439869295.000008",
        "parent_user_id": "U061A5N1G",
        "thread_ts": "144139100.000008",
        "channel_name": "random"
    }
]
```

--------------------------------------------------------------------------------

````
