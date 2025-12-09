# Google Search Console: Remove Malware/Phishing Content

## Overview
This guide provides step-by-step instructions to identify and remove malware/phishing content from your website using Google Search Console.

---

## Part 1: Verify Site Ownership

### Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google Account
3. Click **Add Property** in the left sidebar

### Step 2: Add Your Domain
1. Select **Domain** (recommended)
2. Enter your domain: `yourdomain.com`
3. Click **Continue**

### Step 3: Verify Ownership
Choose one verification method:

**Option A: DNS TXT Record (Recommended)**
- Copy the DNS TXT record provided
- Go to your domain registrar (GoDaddy, Namecheap, etc.)
- Add the TXT record to your DNS settings
- Click **Verify** in GSC

**Option B: HTML File Upload**
- Download the verification HTML file
- Upload to your website root directory
- Click **Verify** in GSC

**Option C: Google Analytics**
- If you have Google Analytics installed, select this option
- Click **Verify**

---

## Part 2: Identify Security Issues

### Step 1: Check for Manual Actions
1. In GSC, go to **Security & Manual Actions** → **Manual Actions**
2. Look for any warnings about:
   - Hacked content
   - User-generated spam
   - Cloaking issues
   - Structured data issues

### Step 2: Check Security Issues Report
1. Go to **Security & Manual Actions** → **Security Issues**
2. Review any flagged issues:
   - Malware
   - Phishing content
   - Deceptive pages
   - Unwanted software

### Step 3: Review Page Indexing
1. Go to **Coverage** to see:
   - Pages with errors
   - Pages with warnings
   - Valid pages
   - Excluded pages

---

## Part 3: Remove Malware/Phishing Content

### Option A: Remove Infected Pages

**If entire pages are compromised:**

1. **Delete the files** from your web server
   ```bash
   rm /var/www/html/infected-page.html
   rm /var/www/html/malicious-script.js
   ```

2. **Remove from GSC**:
   - In GSC, go to **Indexing** → **Removals**
   - Click **New Request**
   - Select **Remove these URLs temporarily** (28 days)
   - Enter affected URLs
   - Click **Request Removal**

3. **Request Re-indexing**:
   - Go to **Indexing** → **URL Inspection**
   - Enter each cleaned URL
   - Click **Request Indexing**

### Option B: Fix Infected Code (Recommended for Our Site)

**For inline JavaScript vulnerabilities:**

1. **Identify malicious code patterns**:
   - Inline event handlers: `onclick=`, `onload=`, `onerror=`
   - Unsafe HTML insertion: `innerHTML`, `document.write()`
   - External script injections: `<script src="malicious.js">`

2. **Replace with secure code**:
   ```javascript
   // BEFORE (Vulnerable)
   <button onclick="processPayment()">Pay</button>
   
   // AFTER (Secure)
   <button class="pay-button" data-action="payment">Pay</button>
   <script>
   document.querySelector('.pay-button').addEventListener('click', () => {
       processPayment();
   });
   </script>
   ```

3. **Use Content Security Policy (CSP)**:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self'; 
                  style-src 'self' https://fonts.googleapis.com; 
                  img-src 'self' data:; 
                  connect-src 'self' https:">
   ```

---

## Part 4: Audit for Common Vulnerabilities

### Vulnerability Checklist

| Vulnerability | Risk | Fix |
|---|---|---|
| Inline onclick handlers | 🔴 Critical | Use event listeners |
| Unsanitized innerHTML | 🔴 Critical | Escape HTML or use textContent |
| No CSP header | 🟡 High | Add CSP meta tag |
| Missing input validation | 🟡 High | Validate all user input |
| Unescaped URLs | 🟡 High | Use encodeURIComponent() |
| Direct eval() usage | 🔴 Critical | Never use eval() |
| External script injections | 🔴 Critical | Remove unknown scripts |

### Scan Your Code
```bash
# Search for inline event handlers
grep -r "onclick=" .
grep -r "onload=" .
grep -r "onerror=" .
grep -r "innerHTML =" .

# Search for eval usage
grep -r "eval(" .

# Search for suspicious external scripts
grep -r "src=" *.html
```

---

## Part 5: Submit Cleaned Site for Review

### Step 1: Prepare Your Site
1. **Remove all malicious code** (see Part 3)
2. **Add security headers**:
   ```
   Strict-Transport-Security: max-age=31536000
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   Referrer-Policy: strict-origin-when-cross-origin
   ```

3. **Update robots.txt** (if needed):
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /private/
   ```

### Step 2: Request Review in GSC
1. Go to **Security & Manual Actions** → **Manual Actions**
2. If a manual action is listed:
   - Click the issue
   - Review the details
   - Click **Request Review** (after fixes)

3. For general security cleanup:
   - Go to **URL Inspection**
   - Test your homepage
   - Click **Request Indexing**

### Step 3: Monitor Progress
1. Wait 24-48 hours for GSC to re-crawl
2. Check **Coverage** for improvement
3. Monitor **Security Issues** for clearance

---

## Part 6: Set Up Ongoing Security

### Enable Security Features

**1. HTTPS/SSL Certificate**
```bash
# If using certbot (Let's Encrypt)
sudo certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

**2. Implement CSP Headers**
```html
<!-- In <head> -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' https://fonts.googleapis.com; 
               img-src 'self' data: https:; 
               connect-src 'self' https:; 
               frame-ancestors 'none';">
```

**3. Enable Referrer Policy**
```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

**4. Disable Framing**
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

---

## Part 7: Verify Fix via Safe Browsing

### Check with Google Safe Browsing
1. Visit [Google Safe Browsing](https://transparencyreport.google.com/safe-browsing/search)
2. Enter your domain
3. If clear, you're good! If flagged, report the issue

### Browser Testing
1. Open your site in Chrome
2. Should show a green lock (HTTPS)
3. No security warnings in console

---

## Common Malware Patterns

### Pattern 1: Base64 Encoded Scripts
```html
<!-- Malicious -->
<script>eval(atob('dmFyIHggPSAx'));</script>

<!-- Fix: Remove entirely -->
```

### Pattern 2: Obfuscated URLs
```javascript
// Malicious
var url = 'ht' + 'tp:' + '//malicious-site.com';
fetch(url);

// Fix: Remove external calls -->
```

### Pattern 3: Hidden Iframes
```html
<!-- Malicious -->
<iframe src="malicious-site.com" style="display:none;"></iframe>

<!-- Fix: Remove entirely -->
```

---

## Recovery Timeline

| Action | Timeline |
|---|---|
| Identify and remove malware | Immediate |
| Submit cleaned site for review | Day 1 |
| Google re-crawls site | 1-7 days |
| Security issues cleared | 1-2 weeks |
| Manual action removed | 2-4 weeks |
| Full ranking recovery | 4-12 weeks |

---

## Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Safe Browsing Report](https://transparencyreport.google.com/safe-browsing/search)
- [Web Security Best Practices](https://cheatsheetseries.owasp.org/)
- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## Support

For additional help:
1. Contact Google Search Console support
2. Use [Google Groups](https://groups.google.com/g/google.webmasters)
3. Check [Google Webmaster Blog](https://webmasters.googleblog.com/)

---

**Last Updated**: December 9, 2025
**Version**: 1.0
