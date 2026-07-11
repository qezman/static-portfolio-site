# Project 1: The Global Launch

A static portfolio site hosted on AWS with no servers - private S3 origin behind CloudFront, HTTPS via a custom domain, and automated deployment via GitHub Actions.

**Live site:** https://static-portfolio-site.qossim005.online

## Architecture

```
Browser → Route 53 → CloudFront (CDN/TLS) → S3 bucket (private, via OAC)

GitHub push → GitHub Actions → IAM role (OIDC) → sync to S3 + invalidate CloudFront
```

- **S3** - private bucket, holds `index.html` / `404.html`, not publicly reachable
- **CloudFront** - public entry point, HTTPS, global edge caching, reaches S3 via Origin Access Control
- **Route 53 + ACM** - custom subdomain with a DNS-validated TLS certificate
- **IAM** - root account MFA-locked with no active keys; scoped IAM users/roles for admin and deploy work
- **GitHub Actions** - deploys on push to `main` using OIDC (temporary credentials, no stored AWS keys)

## Deployment

Push to `main` → workflow assumes the deploy role → `aws s3 sync` mirrors the repo to the bucket → CloudFront cache is invalidated. See `.github/workflows/deploy.yml`.

## Security Notes

- Bucket policy trusts only this CloudFront distribution (no public bucket access)
- Deploy credentials are short-lived (OIDC), scoped to this bucket + distribution only
- Root user: MFA enabled, no access keys, console-login only

## Full Documentation

<!-- See `Project1_Global_Launch_FINAL_Documentation.docx` for the complete implementation walkthrough, architecture diagram, and debugging log. -->