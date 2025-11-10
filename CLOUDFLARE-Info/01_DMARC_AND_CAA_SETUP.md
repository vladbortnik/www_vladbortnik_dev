# DMARC and CAA Records Setup

**Date:** November 9, 2025
**Domain:** vladbortnik.dev

## Summary

Successfully added DMARC policy and CAA records to protect email authentication and SSL certificate issuance.

## 1. DMARC Policy Added ✅

**Record Type:** TXT
**Hostname:** `_dmarc.vladbortnik.dev`
**Content:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@vladbortnik.dev; pct=100; adkim=s; aspf=s`
**TTL:** 3600 seconds
**Record ID:** a4117507cd77c1177fcc2978ae66eafa
**Created:** 2025-11-10 05:29:24 UTC

### What This Does

- **p=quarantine** - Emails failing authentication go to spam (not rejected)
- **rua=mailto:dmarc@vladbortnik.dev** - Daily reports sent to this address
- **pct=100** - Policy applies to 100% of emails
- **adkim=s** - Strict DKIM alignment required
- **aspf=s** - Strict SPF alignment required

### Next Steps

1. Monitor daily DMARC reports at dmarc@vladbortnik.dev
2. After 2-4 weeks of clean reports, upgrade policy to `p=reject` for maximum security
3. Review reports for any legitimate email issues

## 2. CAA Records Added ✅

### CAA Record #1: Standard Certificates

**Record Type:** CAA
**Hostname:** `vladbortnik.dev`
**Tag:** issue
**Value:** letsencrypt.org
**TTL:** 3600 seconds
**Record ID:** 719b451ae403196310cc52c8749bb5ab
**Created:** 2025-11-10 05:29:31 UTC

### CAA Record #2: Wildcard Certificates

**Record Type:** CAA
**Hostname:** `vladbortnik.dev`
**Tag:** issuewild
**Value:** letsencrypt.org
**TTL:** 3600 seconds
**Record ID:** 1a9fd48a8344596b68c1b8dca01248b2
**Created:** 2025-11-10 05:29:36 UTC

### What This Does

- **Only Let's Encrypt** can issue SSL certificates for vladbortnik.dev
- **Prevents unauthorized certificate issuance** from other CAs
- **Protects against** man-in-the-middle attacks via rogue certificates
- **Covers both** standard domain and wildcard (*.vladbortnik.dev)

## Verification

### Check DMARC Record
```bash
dig _dmarc.vladbortnik.dev TXT +short
```

Expected output:
```
"v=DMARC1; p=quarantine; rua=mailto:dmarc@vladbortnik.dev; pct=100; adkim=s; aspf=s"
```

### Check CAA Records
```bash
dig vladbortnik.dev CAA +short
```

Expected output:
```
0 issue "letsencrypt.org"
0 issuewild "letsencrypt.org"
```

## Impact

### Security Improvements

1. **Email Authentication**
   - Emails have DMARC policy enforcement
   - Receivers know how to handle failed authentication
   - Daily reports help monitor email security

2. **Certificate Security**
   - Only Let's Encrypt can issue certificates
   - Prevents CA compromise attacks
   - Matches your current SSL setup (Let's Encrypt wildcard cert)

### No Negative Impact

- Existing email delivery continues normally
- Let's Encrypt renewal continues normally
- No changes needed to DigitalOcean configuration

## Status

✅ **DMARC Policy:** Active and monitoring
✅ **CAA Records:** Active and protecting certificate issuance
✅ **Email Authentication:** Fully configured (SPF + DKIM + DMARC)
✅ **SSL Security:** Certificate issuance restricted to authorized CA
