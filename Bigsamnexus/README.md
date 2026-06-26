# Bigsam Nexus Website

Marketing site for **Bigsam Nexus**, a digital marketing agency. Built as a single-page static site with a built-in booking form (calendar + time slot picker + lead form) wired up to EmailJS.

## Project structure

```
.
├── index.html              # Main page
├── assets/
│   ├── css/
│   │   └── style.css       # Custom styles (Tailwind is loaded via CDN in index.html)
│   └── js/
│       └── script.js       # Nav, calendar booking flow, form submission, animations
├── .nojekyll                # Tells GitHub Pages to skip Jekyll processing
└── .gitignore
```

This structure matches the asset paths referenced inside `index.html` (`assets/css/style.css`, `assets/js/script.js`), so it will render correctly once pushed to GitHub.

## Tech used

- **Tailwind CSS** (via CDN, configured inline in `index.html`)
- **AOS** (Animate On Scroll) for entrance animations
- **Font Awesome** for icons
- **EmailJS** for sending booking/lead form submissions by email, with a `mailto:` fallback if EmailJS fails

## Deploying to GitHub Pages

1. Create a new repository on GitHub (or use an existing one).
2. Push these files to the repository, keeping the folder structure above intact:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch", choose the **main** branch and **/ (root)** folder, then save.
5. GitHub will publish the site at `https://<your-username>.github.io/<your-repo>/` within a minute or two.

## Configuring the booking form (EmailJS)

The booking form in `assets/js/script.js` uses EmailJS to send submissions. It already contains a public key, service ID, and template ID:

```js
const EMAILJS_PUBLIC_KEY = 'nB2IbjSHdZBl9Pi8Y';
const EMAILJS_SERVICE_ID = 'service_1049gfs';
const EMAILJS_TEMPLATE_ID = 'template_76kfc4i';
```

If you set up your own EmailJS account, replace these three values with your own from the [EmailJS dashboard](https://www.emailjs.com/). If EmailJS isn't configured or a send fails, the form automatically falls back to opening the visitor's email client with a pre-filled message to `bigsamnexus1313@gmail.com`.

## Notes / fixes applied

- Reorganized the flat uploaded files (`index.html`, `style.css`, `script.js`) into the `assets/css/` and `assets/js/` folders that `index.html` actually expects — without this, the page would load unstyled and without any interactivity on GitHub Pages.
- Fixed an inconsistent WhatsApp link (`wa.me/+234...` → `wa.me/234...`); `wa.me` links should not include the `+` before the country code.
- Fixed a bug in the booking form where the "Submit Another Request" button's click handler was being re-attached every time the form was submitted, causing the reset logic to fire multiple times after repeated submissions.
- Added `.nojekyll` so GitHub Pages serves the site as-is without running it through Jekyll.
