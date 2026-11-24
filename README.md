# Hooked416 Roadside Assistance website

The production site is [www.hooked416.com](https://www.hooked416.com/). The site source lives in `Hooked416-GitHub-Pages-Publish/` on `main`.

## Publish website updates

1. Batch related edits in the site source folder and test the affected pages locally.
2. Push the batch to `main`. The **Publish original Hooked416 website** workflow builds and deploys the source folder to GitHub Pages.
3. Confirm the workflow succeeds in [GitHub Actions](https://github.com/hooked416-lab/hooked416-website/actions/workflows/deploy-pages.yml), then spot-check the affected pages on the production domain.

Keep the custom-domain `CNAME` inside the site source folder. Use the app’s media route for new photos and video. The repository is public. Keep credentials and submitted form data out of it.
