# Quick Reference: Google Search Console & Security Commands

## Google Search Console Quick Access

### URLs
```
Google Search Console: https://search.google.com/search-console
Safe Browsing Report: https://transparencyreport.google.com/safe-browsing
Page Speed Insights: https://pagespeed.web.dev/
Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
Domain Authority Check: https://moz.com/domain-analysis
```

---

## Pre-Submission Commands

### 1. Check DNS Records
```bash
# Check if DNS is properly configured
nslookup yourdomain.com
dig yourdomain.com

# Expected output should show your server IP
```

### 2. Check Security Headers
```bash
# Verify CSP and security headers are present
curl -i https://yourdomain.com | grep -i "content-security-policy\|x-frame\|x-content-type\|strict-transport"

# Expected output:
# Content-Security-Policy: ...
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

### 3. Check SSL/TLS Certificate
```bash
# Verify SSL certificate validity
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check certificate expiration
curl -vI https://yourdomain.com 2>&1 | grep "expire date"
```

### 4. Check Robots.txt
```bash
# Verify robots.txt is accessible and proper
curl https://yourdomain.com/robots.txt

# Should return 200 OK with proper rules
```

### 5. Check Sitemap
```bash
# Verify sitemap is accessible
curl https://yourdomain.com/sitemap.xml

# Should return valid XML
```

### 6. Scan for Malware
```bash
# Using curl to check file hashes
curl -s https://yourdomain.com/*.html | md5sum

# Compare against known malware signatures
```

---

## Testing Commands

### 1. Test XSS Prevention
```bash
# Try XSS payload in search/input (should be escaped)
curl -X POST -d "search=<script>alert('xss')</script>" https://yourdomain.com/search

# Should NOT execute script
```

### 2. Check Page Load Time
```bash
# Using curl with timing
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com

# curl-format.txt contents:
# time_namelookup:  %{time_namelookup}s
# time_connect:     %{time_connect}s
# time_appconnect:  %{time_appconnect}s
# time_pretransfer: %{time_pretransfer}s
# time_redirect:    %{time_redirect}s
# time_starttransfer: %{time_starttransfer}s
# ---
# time_total:       %{time_total}s
```

### 3. Test Mobile Responsiveness
```bash
# Check viewport meta tag
curl https://yourdomain.com | grep "viewport"

# Should show: <meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 4. Check for Mixed Content (HTTP/HTTPS)
```bash
# Find HTTP resources on HTTPS site
curl https://yourdomain.com | grep "http://" | grep -v "https://"

# Should return nothing (no mixed content)
```

---

## Google Search Console API Commands

### 1. Get Search Performance Data (requires API key)
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-12-01",
    "endDate": "2025-12-09",
    "dimensions": ["query"]
  }' \
  https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fyourdomain.com/searchAnalytics/query
```

### 2. Request URL Indexing (requires API key)
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourdomain.com/page"}' \
  https://www.googleapis.com/indexing/v3/urlNotifications:publish
```

---

## Monitoring Commands

### 1. Monitor Search Rankings
```bash
# Track keyword rankings (requires SEO tool)
# Using SEMrush API:
curl https://api.semrush.com/?type=domain_ranks&domain=yourdomain.com&api_key=YOUR_KEY

# Using Ahrefs API:
curl https://api.ahrefs.com/v2/ranking-keywords?target=yourdomain.com&api_key=YOUR_KEY
```

### 2. Monitor Backlinks
```bash
# Check backlinks using public data
curl https://www.googleapis.com/customsearch/v1?q=link:yourdomain.com&key=YOUR_API_KEY
```

### 3. Monitor Crawl Errors
```bash
# Check for 404s, 5xx errors, etc. via GSC
# Manual check: Go to Coverage tab in GSC
```

---

## Automated Monitoring Scripts

### Bash Script: Daily Security Check
```bash
#!/bin/bash

DOMAIN="yourdomain.com"
LOG_FILE="security_check_$(date +%Y%m%d).log"

echo "Security Check for $DOMAIN - $(date)" > $LOG_FILE

# Check SSL Certificate
echo "=== SSL Certificate Check ===" >> $LOG_FILE
openssl s_client -connect $DOMAIN:443 -servername $DOMAIN </dev/null 2>/dev/null | grep "Issuer\|Not Before\|Not After" >> $LOG_FILE

# Check Security Headers
echo "=== Security Headers ===" >> $LOG_FILE
curl -s -I https://$DOMAIN | grep -i "security\|policy" >> $LOG_FILE

# Check for XSS Vulnerabilities (basic)
echo "=== XSS Check ===" >> $LOG_FILE
curl -s https://$DOMAIN | grep -i "onclick\|onerror\|onload" >> $LOG_FILE

# Check robots.txt
echo "=== Robots.txt Status ===" >> $LOG_FILE
curl -s -I https://$DOMAIN/robots.txt | head -1 >> $LOG_FILE

echo "Security check complete. Results in $LOG_FILE"
```

**Usage**:
```bash
chmod +x security_check.sh
./security_check.sh
```

### Python Script: GSC Site Health Monitor
```python
#!/usr/bin/env python3

import requests
import json
from datetime import datetime, timedelta

DOMAIN = "yourdomain.com"
GSC_URL = f"https://search.google.com/search-console/welcome?resource_id=sc-domain:{DOMAIN}"

def check_domain_health():
    """Check domain health via Google Safe Browsing API"""
    
    api_key = "YOUR_GOOGLE_API_KEY"
    url = "https://safebrowsing.googleapis.com/v4/threatMatches:find"
    
    payload = {
        "client": {
            "clientId": "your_client_id",
            "clientVersion": "1.5.2"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {"url": f"https://{DOMAIN}"}
            ]
        }
    }
    
    response = requests.post(f"{url}?key={api_key}", json=payload)
    result = response.json()
    
    if "matches" in result:
        print(f"⚠️ ALERT: {DOMAIN} flagged as malicious!")
        return False
    else:
        print(f"✅ {DOMAIN} is clean")
        return True

def log_status(status):
    """Log check status"""
    timestamp = datetime.now().isoformat()
    log_entry = {
        "timestamp": timestamp,
        "domain": DOMAIN,
        "status": "CLEAN" if status else "FLAGGED",
        "url": GSC_URL
    }
    
    with open("health_log.json", "a") as f:
        json.dump(log_entry, f)
        f.write("\n")

if __name__ == "__main__":
    status = check_domain_health()
    log_status(status)
```

**Usage**:
```bash
pip install requests
python3 gsc_monitor.py
```

---

## GSC Submission Workflow (Command Summary)

### Step 1: Preparation
```bash
# Verify all fixes are in place
grep -r "onclick=" *.html *.js  # Should return nothing
grep -r "onerror=" *.html *.js  # Should return nothing
grep -r "onload=" *.html *.js   # Should return nothing

# Check for CSP header
grep -r "Content-Security-Policy" *.html
```

### Step 2: Test Site
```bash
# Local testing
python3 -m http.server 8000

# Test in browser: http://localhost:8000
# Press F12 → Console → Check for errors
```

### Step 3: Deploy to Production
```bash
# Deploy your fixed code
git add .
git commit -m "Security: Fix XSS vulnerabilities"
git push origin main

# Verify deployment
curl https://yourdomain.com
```

### Step 4: GSC Submission
```bash
# Manual process in GSC:
# 1. Visit: https://search.google.com/search-console
# 2. Add property: yourdomain.com
# 3. Verify ownership: Add DNS TXT record
# 4. Go to URL Inspection
# 5. Enter homepage URL
# 6. Click "Request Indexing"
```

### Step 5: Monitor Progress
```bash
# Check daily for 2 weeks
# Commands to check status:

# Check if indexed
curl -s https://yourdomain.com | head -20

# Monitor GSC API
curl -H "Authorization: Bearer TOKEN" \
  https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fyourdomain.com/urlTestingTools/mobileFriendlyTest
```

---

## Troubleshooting Commands

### Issue: DNS Not Propagating
```bash
# Check DNS propagation across multiple servers
for ns in 8.8.8.8 1.1.1.1 208.67.222.222; do
  echo "Checking $ns:"
  nslookup yourdomain.com $ns
done
```

### Issue: SSL Certificate Errors
```bash
# Check certificate details
openssl x509 -in /path/to/cert.pem -text -noout

# Verify certificate chain
curl -vI https://yourdomain.com
```

### Issue: CSP Violations
```bash
# Check for CSP violations in browser console
# View in DevTools: F12 → Console → Look for CSP errors

# Common CSP violations to fix:
# 1. Inline styles: Move to external CSS
# 2. Inline scripts: Use event delegation
# 3. External fonts: Add to CSP policy
```

### Issue: Page Load Slow
```bash
# Test speed with multiple tools
curl -w "Total time: %{time_total}s\n" -o /dev/null -s https://yourdomain.com

# Analyze with Google PageSpeed
# Visit: https://pagespeed.web.dev/?url=https://yourdomain.com
```

---

## Recovery Verification

### Phase 1 (Days 1-7): Initial Review
```bash
# Daily checks
curl -s https://yourdomain.com > /dev/null && echo "✅ Site up" || echo "❌ Site down"

# Check console for errors
curl https://yourdomain.com 2>&1 | grep -i "error\|warning"

# Monitor GSC
# Manual check in GSC: Security & Manual Actions → Check status
```

### Phase 2 (Weeks 2-3): Fix Verification
```bash
# Test all functionality
# Manual testing of:
# - Product grid
# - Shopping cart
# - Checkout form
# - Payment processing

# Check rankings (if SEO tool available)
# Monitor traffic in Google Analytics
```

### Phase 3 (Weeks 4+): Recovery
```bash
# Verify manual action removed
# Check GSC: No warnings should appear

# Monitor rankings
# Should see gradual recovery

# Track traffic
# Should return to normal levels within 4-8 weeks
```

---

## Quick Status Check (One-Liner)

```bash
echo "=== Domain Health ===" && \
curl -s -I https://yourdomain.com | grep "HTTP\|Server" && \
echo "=== Security ===" && \
curl -s https://yourdomain.com | grep -c "onclick" | (read count; if [ $count -eq 0 ]; then echo "✅ No inline handlers"; else echo "❌ Found $count inline handlers"; fi) && \
echo "=== CSP ===" && \
curl -s -I https://yourdomain.com | grep -i "Content-Security-Policy" | head -1
```

---

## Useful Resources Links

```
Google Search Console: https://search.google.com/search-console
GSC Help: https://support.google.com/webmasters/
Safe Browsing Report: https://transparencyreport.google.com/safe-browsing/
PageSpeed Insights: https://pagespeed.web.dev/
Mobile Test: https://search.google.com/test/mobile-friendly
robots.txt Tester: https://www.google.com/webmasters/tools/robots-testing-tool
Structured Data: https://search.google.com/structured-data/testing-tool
CSP Checker: https://csp-evaluator.withgoogle.com
SSL Test: https://www.ssllabs.com/ssltest/
```

---

**Last Updated**: December 9, 2025  
**Quick Reference Version**: 1.0
