# Hooked416 Roadside Assistance — original website

This repository is intended to publish the recovered October 30, 2026 Hooked416 website via GitHub Pages, using **www.hooked416.com** as the canonical domain.

## Publish the recovered site

1. Download **Hooked416-GitHub-Pages-Publish.zip** from the ChatGPT conversation and extract it on your computer.
2. In GitHub Desktop, clone this repository and copy **the contents** of the extracted archive into the repository root, alongside this README (do not copy the ZIP itself or wrap the files in another folder).
3. Commit and push to `main`. Ensure `index.html`, `styles.css`, `assets/`, and `CNAME` are in the repository root.
4. In repository **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
5. Confirm the site works at its GitHub Pages URL before editing GoDaddy DNS.
6. Under Pages **Custom domain**, set `www.hooked416.com`. At GoDaddy, configure `www` CNAME to `hooked416-lab.github.io`, and root `@` A records to GitHub Pages IP addresses (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) after confirming these are current. Retain all email-related DNS records.
7. Enable **Enforce HTTPS** once GitHub has issued the certificate and confirm both `www.hooked416.com` and `hooked416.com`.

## Notes

- The full site assets, including photos and videos, are needed: this small repository configuration alone is **not** the website.
- Re-test third-party contact/application forms, daily facts automation, and external links after deployment.
- This repository is public. Do not commit secrets, personal application submissions, or API keys.
