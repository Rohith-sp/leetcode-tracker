# Supabase Rate Limit Configuration Guide

## Overview
By default, Supabase has conservative rate limits on authentication emails to prevent abuse. If you're experiencing "rate limit exceeded" errors, you'll need to adjust these settings in your Supabase dashboard.

## Current Issue
The default Supabase rate limits are:
- **Email sending**: 3-4 emails per hour per email address
- **Password reset requests**: Very conservative limits

This can be problematic during:
- Development and testing
- User onboarding periods
- When users legitimately need multiple password resets

## Solution: Adjust Rate Limits

### Step 1: Access Supabase Dashboard
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Rate Limits** (in the left sidebar)

### Step 2: Configure Email Rate Limits
Adjust the following settings based on your needs:

#### For Development/Testing:
```
Email Rate Limit: 10-20 per hour
Password Reset Rate Limit: 10 per hour
Sign Up Rate Limit: 20 per hour
```

#### For Production:
```
Email Rate Limit: 6-10 per hour
Password Reset Rate Limit: 5 per hour
Sign Up Rate Limit: 10 per hour
```

### Step 3: Configure Email Provider (Optional)
For higher email volumes, consider using a custom SMTP provider:

1. Go to **Authentication** → **Email Templates**
2. Click **Settings** → **SMTP Settings**
3. Configure your own SMTP provider (SendGrid, AWS SES, Mailgun, etc.)

**Benefits:**
- Higher rate limits
- Better deliverability
- Custom email templates
- Detailed analytics

### Step 4: Enable Email Confirmations (Security)
1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, ensure:
   - ✅ **Enable email confirmations** is checked
   - ✅ **Secure email change** is enabled
   - Set **Redirect URLs** to include your production domain

## Troubleshooting

### "Rate limit exceeded" Error
**Cause**: Too many requests from the same email/IP address

**Solutions**:
1. Increase rate limits in Supabase dashboard (see Step 2)
2. Implement client-side cooldown (already implemented in login page)
3. Use custom SMTP provider for higher limits

### Password Reset Email Not Arriving
**Possible causes**:
1. Rate limit exceeded (check Supabase logs)
2. Email in spam folder
3. Invalid redirect URL configuration

**Solutions**:
1. Check **Authentication** → **Logs** in Supabase dashboard
2. Verify redirect URL in **Authentication** → **URL Configuration**
3. Add your domain to allowed redirect URLs

### Email Confirmation Link Expired
**Cause**: Token expiration (default: 24 hours)

**Solution**:
1. Go to **Authentication** → **Settings**
2. Adjust **Email confirmation token expiry** (default: 86400 seconds / 24 hours)
3. Consider extending to 48-72 hours for better UX

## Recommended Settings Summary

| Setting | Development | Production |
|---------|-------------|------------|
| Email Rate Limit | 20/hour | 10/hour |
| Password Reset Limit | 10/hour | 5/hour |
| Sign Up Limit | 20/hour | 10/hour |
| Token Expiry | 24 hours | 24-48 hours |
| Email Confirmations | Enabled | Enabled |

## Additional Resources
- [Supabase Auth Rate Limits Documentation](https://supabase.com/docs/guides/auth/rate-limits)
- [Custom SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

## Notes
- Rate limit changes take effect immediately
- Monitor your **Authentication** → **Logs** to track usage
- Consider implementing application-level rate limiting for additional security
- The app already includes a 60-second cooldown for resend verification emails
