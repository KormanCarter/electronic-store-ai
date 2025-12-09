# Google Search Console Submission Checklist

**Date**: December 9, 2025  
**Domain**: yourdomain.com  
**Status**: Ready for Submission

---

## Pre-Submission Verification

### ✅ Security Fixes Completed

- [x] Removed all inline event handlers (onclick, onload, onerror)
- [x] Implemented event delegation for all user interactions
- [x] Added Content Security Policy (CSP) headers
- [x] Implemented input validation
- [x] Fixed XSS vulnerabilities in payment forms
- [x] Removed eval() usage
- [x] Sanitized user input handling
- [x] Added security headers (Referrer-Policy, X-UA-Compatible)

### ✅ Code Quality

- [x] No console errors
- [x] No CSP violations
- [x] All functionality preserved
- [x] Forms work correctly
- [x] Cart operations functional
- [x] Payment processing intact

### ✅ Browser Testing

- [x] Chrome (latest version)
- [x] Firefox (latest version)  
- [x] Safari (latest version)
- [x] Edge (latest version)
- [x] Mobile browsers

### ✅ Developer Console Check

Open your site and press F12, verify:
- [x] No errors in Console tab
- [x] No CSP violations warnings
- [x] Network tab shows no suspicious requests
- [x] All resources load from allowed origins

---

## Google Search Console Setup

### Step 1: Verify Ownership

**Choose one verification method:**

#### Method A: DNS TXT Record (Recommended)
- [ ] Copy the verification record from GSC
- [ ] Log into domain registrar (GoDaddy, Namecheap, Route 53, etc.)
- [ ] Add DNS TXT record
- [ ] Wait 5-10 minutes for DNS propagation
- [ ] Click "Verify" in GSC

#### Method B: HTML File
- [ ] Download verification file from GSC
- [ ] Upload to website root: `yourdomain.com/[verification-file].html`
- [ ] Verify file is accessible at that URL
- [ ] Click "Verify" in GSC

#### Method C: Google Analytics
- [ ] If you have Google Analytics installed, select this option
- [ ] Click "Verify"

#### Method D: Google Tag Manager
- [ ] If you have GTM installed, select this option
- [ ] Click "Verify"

**Record:**
```
Verification method used: ___________________
Verification record/file: ___________________
Date verified: ___________________
```

---

## Property Setup

### Step 2: Configure Site Settings

- [ ] Go to Settings → General
- [ ] Confirm primary domain (yourdomain.com or www.yourdomain.com)
- [ ] Set preferred domain
- [ ] Confirm geographic targeting (optional)

### Step 3: Add Sitemap

**If you have a sitemap:**
- [ ] Go to Sitemaps
- [ ] Add: `yourdomain.com/sitemap.xml`
- [ ] Click Submit
- [ ] Wait for indexing

**If you don't have a sitemap yet:**
- [ ] Create sitemap.xml with all important URLs
- [ ] Submit to GSC

**Sample sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-12-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/products</loc>
    <lastmod>2025-12-09</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/checkout</loc>
    <lastmod>2025-12-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## Security Review Before Submission

### Step 4: Run Security Checks

- [ ] Test for malware on VirusTotal
  - [ ] Go to virustotal.com
  - [ ] Scan your domain
  - [ ] Verify no malware detected

- [ ] Check Google Safe Browsing
  - [ ] Visit transparencyreport.google.com/safe-browsing
  - [ ] Enter your domain
  - [ ] Verify status is "safe"

- [ ] Check SSL Certificate
  - [ ] Open site in browser
  - [ ] Click padlock icon
  - [ ] Verify certificate is valid
  - [ ] Verify HTTPS is enabled

**Security Check Results:**
```
VirusTotal Status: ___________________
Safe Browsing Status: ___________________
SSL Certificate: ___________________
HTTPS Enabled: ___________________
```

### Step 5: Test Security Headers

Run this command to check security headers:
```bash
curl -i https://yourdomain.com | grep -i "content-security-policy\|x-content-type\|x-frame-options"
```

Should show:
```
Content-Security-Policy: ...
X-Frame-Options: DENY
Strict-Transport-Security: ...
```

---

## Content Review

### Step 6: Verify Content Quality

- [ ] Homepage is accessible
- [ ] All products load correctly
- [ ] Search functionality works
- [ ] Shopping cart works
- [ ] Checkout process functions
- [ ] No broken links
- [ ] No missing images
- [ ] Mobile responsive design works
- [ ] Load time acceptable (< 3 seconds)

**Content Verification:**
```
Homepage load time: _________ seconds
Product page load time: _________ seconds
Broken links found: _________
Missing images: _________
Mobile test result: PASS / FAIL
```

---

## Manual Action Resolution

### Step 7: Address Manual Actions (if any)

**If your site has a manual action:**
- [ ] Note the issue type:
  ```
  Issue: _________________
  Date flagged: _________
  Details: _________________
  ```

- [ ] Apply fixes from SECURITY_FIXES.md
- [ ] Re-test all functionality
- [ ] Submit reconsideration request:
  1. Go to Security & Manual Actions
  2. Click the manual action listed
  3. Review the violation details
  4. Click "Request Review"
  5. Follow Google's steps to submit

**Reconsideration Request Template:**
```
Provide as much detail as possible about the changes made to fix the issue:

1. What was the problem?
   [Describe the vulnerability]

2. How did it happen?
   [Explain the root cause]

3. How did you fix it?
   [Detail the fixes applied]

4. How will you prevent it in the future?
   [Describe prevention measures]

Attached files:
- SECURITY_AUDIT_REPORT.md
- SECURITY_FIXES.md
- Updated code files
```

---

## Submission Steps

### Step 8: Initial Submission

- [ ] Go to Security & Manual Actions → Manual Actions
- [ ] If manual action exists:
  - [ ] Click on the issue
  - [ ] Review "Affected sample pages"
  - [ ] Verify fixes are applied to those URLs
  - [ ] Click "Request Review"

- [ ] If no manual action:
  - [ ] Go to URL Inspection tool
  - [ ] Enter your homepage URL
  - [ ] Click "Request Indexing"
  - [ ] Wait for crawl completion

### Step 9: Monitor Submission

- [ ] Check email for submission confirmation
- [ ] Return to GSC and monitor status
- [ ] Expected review time: 2-4 weeks
- [ ] Google will email updates on progress

---

## Post-Submission Monitoring

### Step 10: Weekly Monitoring (Days 1-7)

| Day | Action | Notes |
|-----|--------|-------|
| 1 | Submit to GSC | Initial request submitted |
| 2 | Monitor coverage | Check for crawl errors |
| 3 | Check security issues | No new issues should appear |
| 4 | Test functionality | Verify all features work |
| 5 | Check mobile usability | Use mobile-friendly test |
| 6 | Review performance | Monitor Core Web Vitals |
| 7 | Check indexing | Verify pages are indexed |

- [ ] Day 1: Submission confirmed
- [ ] Day 2: Check for crawl errors
- [ ] Day 3: Verify no new security warnings
- [ ] Day 4: Test all site features
- [ ] Day 5: Run mobile usability test
- [ ] Day 6: Check Core Web Vitals
- [ ] Day 7: Verify indexing progress

### Step 11: Bi-Weekly Monitoring (Weeks 2-4)

- [ ] Week 2: Check request review status
- [ ] Week 3: Monitor for status updates
- [ ] Week 4: Check if review is completed

**Expected outcomes:**
- No manual action after review
- Security issues cleared
- Pages properly indexed
- Ranking stabilization

---

## Recovery Timeline

| Milestone | Timeline | Action |
|-----------|----------|--------|
| Submit request | Day 0 | Click "Request Review" in GSC |
| Google reviews | Days 1-7 | Google crawls and reviews site |
| Manual action removal | Days 7-14 | Manual action badge removed |
| Re-indexing | Days 7-28 | Pages re-indexed with fresh crawl |
| Ranking recovery | Weeks 2-4 | Rankings begin to recover |
| Full recovery | Weeks 4-8 | Full ranking restoration |

---

## Ongoing Maintenance

### Step 12: Regular Security Audits

**Monthly Checklist:**
- [ ] Review GSC security issues
- [ ] Check for new vulnerabilities
- [ ] Update security headers
- [ ] Scan for malware (VirusTotal)
- [ ] Test SSL certificate validity
- [ ] Review access logs for suspicious activity
- [ ] Check Core Web Vitals
- [ ] Monitor indexing status

**Quarterly Checklist:**
- [ ] Full penetration testing
- [ ] Code security audit
- [ ] Dependency updates
- [ ] Backup verification
- [ ] Disaster recovery plan test
- [ ] Security training for team

---

## Emergency Response Plan

### If New Security Issue Found:

1. **Immediate Actions (0-1 hour)**
   - [ ] Identify the vulnerability
   - [ ] Document the issue
   - [ ] Take site offline if critical
   - [ ] Notify team members

2. **Short-term (1-6 hours)**
   - [ ] Develop fix
   - [ ] Test fix thoroughly
   - [ ] Deploy fix to production
   - [ ] Verify fix works

3. **Medium-term (6-24 hours)**
   - [ ] Document root cause
   - [ ] Create incident report
   - [ ] Submit to GSC if needed
   - [ ] Request re-indexing

4. **Long-term (1+ weeks)**
   - [ ] Implement prevention measures
   - [ ] Update security policies
   - [ ] Train team on new procedures
   - [ ] Monitor for recurrence

---

## Contact Information

**GSC Support**: https://support.google.com/webmasters  
**Safe Browsing**: https://transparencyreport.google.com/safe-browsing  
**Issue Reported**: _________________  
**Support Ticket**: _________________  
**Status Page**: _________________

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | _________ | _________ | _________ |
| Security Lead | _________ | _________ | _________ |
| Project Manager | _________ | _________ | _________ |

---

## Appendix: Useful Commands

### Check Site Health
```bash
# Test domain
dig yourdomain.com
nslookup yourdomain.com

# Check headers
curl -i https://yourdomain.com | head -20

# Test SSL/TLS
openssl s_client -connect yourdomain.com:443

# Check robots.txt
curl https://yourdomain.com/robots.txt

# Check sitemap
curl https://yourdomain.com/sitemap.xml
```

### Monitor Performance
```bash
# Check page speed
# Use Google PageSpeed Insights: https://pagespeed.web.dev/

# Check mobile friendliness
# Use Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

# Check Core Web Vitals
# View in GSC: Security & Manual Actions → Page Experience
```

---

**Document Version**: 1.0  
**Last Updated**: December 9, 2025  
**Next Review**: December 31, 2025
