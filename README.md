# Buddy for Sleep — Deposit Landing Page

Built from the Figma file `Sleep UXUI Stuff` (XIsXyINth0TKfEtroAMZha), page "Waitlist Dev Export", frame "Deposit Landing Page — Desktop". Real photos, real fonts (Satoshi + Inter), real colors pulled directly from Figma's dev-mode export.

## Run locally / in Replit

This is a plain static site, no build step, no dependencies.

- **In Replit:** create a new Repl → "Import from GitHub" → paste this repo's URL → it should auto-detect as static HTML and just work. If not, add a `.replit` file with:
  ```
  run = "npx serve ."
  ```
- **Locally:** open `index.html` directly, or run `npx serve .` in this folder.

## Before this goes live, you need to:

1. **Create a Stripe Payment Link** for the $5 deposit:
   - Go to https://dashboard.stripe.com/payment-links → Create a payment link → one-time price, $5.00, name it "Buddy for Sleep — Reservation Deposit"
   - Copy the link (looks like `https://buy.stripe.com/xxxxx`)
   - Paste it into `script.js`, replacing `STRIPE_PAYMENT_LINK`'s placeholder value
2. **Point the subdomain**: add a CNAME record at your domain registrar for `sleep` → wherever this ends up hosted (Replit gives you a domain to point at, or use their custom domain feature directly if available on your plan)
3. **Test the email step**: submit a real email through the hero form and confirm it lands in your Klaviyo "Sleep Waitlist" list (id `QTWbQm`) within a minute or two
4. **Set up the Sleep Deposit welcome email** in Klaviyo (no API for this, has to be done in the UI): Flows → Create Flow → trigger "Added to List" → Sleep Deposit list (id `WS6cXL`). Draft copy:
   - Subject: "You're in — here's what happens next"
   - Body: "Hi there, thanks for reserving your Buddy for Sleep. Your $5 deposit locked in the lowest price Buddy will ever launch at, put you in our first production batch, and unlocked two years of Intelligent Buddy free (normally $59.99/yr). We'll keep you posted as we get closer to shipping. Want your $5 back? Just reply to this email or write hello@buddydesign.co, no questions asked."

## What's not pixel-perfect (yet)

- The hypnogram graph is a hand-built approximation (SVG stage bars + the real HR trace line asset), not a literal recreation of every element in the Figma sleep-performance-visualization group.
- The comparison table's Wearables/Mindfulness/Smart Alarms icons are simple CSS shapes (a ring, a phone outline, a lamp silhouette), deliberately generic rather than photos of real products, for trademark/comparative-advertising safety.

## Reference IDs
- Klaviyo Sleep Waitlist list: `QTWbQm`
- Klaviyo Sleep Deposit list: `WS6cXL`
- Klaviyo public API key: `SXBN7k`
