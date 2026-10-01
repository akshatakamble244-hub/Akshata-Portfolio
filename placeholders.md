# Placeholders Checklist

A complete list of every hard-coded personal value and unfinished content block in this portfolio
project, with the exact locations and the exact strings to search for.

Use this file whenever you rename a value, change an email, or publish a new project — then **delete
this file** once everything is final.

**Scope:** `index.html`, `script.js`, `style.css`, `images/`, `resume/`

> **Tip:** most values appear in several places. Use the "Find and replace" table below and update a
> value in one pass instead of hunting down every line.

---

## 1. Fast Find-and-Replace Table

Search for the **Current value** exactly as written, and replace **all** occurrences.

| # | Current value | Find in | Replace with | Occurrences |
| --- | --- | --- | --- | --- |
| 1 | `Akshata Kamble` | `index.html`, `script.js` | Your full name | 11 |
| 2 | `AK` | `index.html` (line 61) | Your initials | 1 |
| 3 | `akshatakamble244@gmail.com` | `index.html`, `script.js` | Your email | 5 |
| 4 | `akshatakamble244-hub` | `index.html` | Your GitHub username | 6 |
| 5 | `https://www.linkedin.com/in/akshata-kamble-a100b8384/` | `index.html` | Your LinkedIn profile URL | 3 |
| 6 | `https://akshatakamble244-hub.github.io/Akshata-Portfolio/` | `index.html` (line 13) | Your live site URL | 1 |
| 7 | `images/profile.jpg` | `index.html` | Your image file path | 3 |
| 8 | `resume/Akshata_Kamble_Resume.pdf` | `index.html` | Your resume file path | 1 |
| 9 | `Akshata_Kamble_Resume.pdf` | file name on disk | Your resume file name | 1 file |
| 10 | `AI-Customer-Support-Agent` | `index.html` (line 483) | Your project repo name | 1 |
| 11 | `AI Engineer \| Machine Learning Student` | `index.html` | Your professional title | 4 |

---

## 2. Name

**Current value:** `Akshata Kamble`

| File | Line | Context |
| --- | --- | --- |
| `index.html` | 8 | `<title>` — browser tab |
| `index.html` | 9 | `meta description` |
| `index.html` | 10 | `meta keywords` |
| `index.html` | 11 | `meta author` |
| `index.html` | 17 | `og:title` — social preview title |
| `index.html` | 60 | `aria-label` on the top bar brand link |
| `index.html` | 62 | Top bar brand name (uses `&nbsp;`) |
| `index.html` | 152 | `alt` text on the profile photo |
| `index.html` | 182 | Hero heading — "Hi, I'm …" |
| `index.html` | 729 | Footer credit |
| `script.js` | 2 | File header comment (cosmetic only) |
| `script.js` | 418 | Footer credit **overwritten by JavaScript at runtime** |

⚠️ **Important:** the footer text at `index.html:729` is replaced on load by `script.js:418`. If you
only edit the HTML, the footer will still show the old name. Update **both**.

**Initials mark:** `index.html:61`

```html
<span class="topbar__mark" aria-hidden="true">AK</span>
```

A two-letter monogram shown in the top-left corner. Change it to match your initials, or replace the
whole span with a logo image.

---

## 3. Profile Photo

**Current value:** `images/profile.jpg`

| File | Line | Usage |
| --- | --- | --- |
| `index.html` | 19 | `og:image` — social preview image |
| `index.html` | 28 | Favicon (`<link rel="icon">`) |
| `index.html` | 152 | Profile photo in the hero |

**To replace the photo:**

1. Add your new image to the `images/` folder.
2. Update all three references above.
3. Update the `width` and `height` attributes on line 152 — they are currently `1080` × `1108` and
   are set to the exact pixel size of the existing file. **Wrong values cause layout shift.**

⚠️ **Open Graph image:** `og:image` on line 19 is a *relative* path. Most social platforms (LinkedIn,
Facebook, X) require an **absolute** URL to render a preview image. Change it to your full URL:

```
https://akshatakamble244-hub.github.io/Akshata-Portfolio/images/profile.jpg
```

---

## 4. Email Address

**Current value:** `akshatakamble244@gmail.com`

| File | Line | Usage |
| --- | --- | --- |
| `script.js` | 14 | `const CONTACT_EMAIL` — **where the form actually sends** |
| `index.html` | 685 | `mailto:` link and visible text in the form note (email appears twice on this line) |
| `index.html` | 692 | "Email" contact card link |
| `index.html` | 698 | Visible email text in the contact card |

⚠️ **`script.js:14` is the one that matters.** The contact form builds its `mailto:` link from that
constant. If you change the email in the HTML but not in the script, the **"Send Message" button will
still deliver to the old address**.

---

## 5. GitHub URL

**Current value:** `https://github.com/akshatakamble244-hub`

| File | Line | Usage |
| --- | --- | --- |
| `index.html` | 13 | `link rel="canonical"` (part of the full site URL) |
| `index.html` | 157 | GitHub icon button under the profile photo |
| `index.html` | 201 | "GitHub" button in the hero actions |
| `index.html` | 483 | "View on GitHub" button on the featured project |
| `index.html` | 702 | "GitHub" contact card link |
| `index.html` | 708 | Visible username text in the contact card |

**Username also appears as plain text** at line 708 (`akshatakamble244-hub`) — update it alongside
the links, or the card will show one username and open another.

---

## 6. LinkedIn URL

**Current value:** `https://www.linkedin.com/in/akshata-kamble-a100b8384/`

| File | Line | Usage |
| --- | --- | --- |
| `index.html` | 160 | LinkedIn icon button under the profile photo |
| `index.html` | 202 | "LinkedIn" button in the hero actions |
| `index.html` | 712 | "LinkedIn" contact card link |

**Username also appears as plain text** at line 717 (`akshata-kamble-a100b8384`).

---

## 7. Portfolio / Live Site URL

**Current value:** `https://akshatakamble244-hub.github.io/Akshata-Portfolio/`

| File | Line | Usage |
| --- | --- | --- |
| `index.html` | 13 | `<link rel="canonical">` |

**Also required for social sharing** — currently missing, and worth adding once your site is live:

- `og:url` — absolute URL of the deployed page
- `twitter:image` — absolute URL of your preview image

`twitter:card` is already set to `summary_large_image` on line 20, but no image is attached to it.

---

## 8. Project Links & Content

### 8.1 Featured project — has a link

**Current value:** `https://github.com/akshatakamble244-hub/AI-Customer-Support-Agent/tree/main`

| File | Line | Usage |
| --- | --- | --- |
| `index.html` | 483 | "View on GitHub" button on the AI Customer Support Agent card |

Replace the repository name **and** the branch name (`main`) if yours differs.

### 8.2 Project 02 — **no link exists**

**Student LangChain Chatbot** — `index.html` lines 491–508

This card intentionally has **no** "View on GitHub" button (see the comment on line 490). If you make
the repository public, copy the button markup from the featured project and add it inside
`<div class="project__actions">`.

### 8.3 Project 03 — **no link exists**

**Python Basic Programs** — `index.html` lines 511–524

Same situation as above (see the comment on line 510). Add a `project__actions` block if you publish
it.

### 8.4 Add a new project

Each project card is a `<article class="card project">` block containing, in order:

1. `<div class="project__top">` — the tag (`Featured Project`, `Generative AI`, `Foundations`…) and
   the number (`01`, `02`, `03`)
2. `<h3 class="project__title">`
3. `<p class="project__desc">`
4. `<ul class="chips">` — the tech stack
5. `<div class="project__actions">` — the GitHub button (optional)

Copy the featured project block to start a new one and renumber the `project__num` values.

---

## 9. Resume

**Current value:** `resume/Akshata_Kamble_Resume.pdf`

| File | Line | Usage |
| --- | --- | --- |
| `index.html` | 197 | "Download Resume" button |

**To replace the resume:**

1. Delete `resume/Akshata_Kamble_Resume.pdf`.
2. Add your new PDF to the `resume/` folder.
3. Update the link on line 197 to match the new file name.

Keep the file small (under ~1 MB) so the download stays instant on slow connections.

---

## 10. Certificates Section — **unfinished**

**Location:** the `<section id="certificates">` block in `index.html`

The certificate list is **empty**, so the page shows a placeholder card instead:

- `#certList` — empty container, filled with `.cert-card` elements
- `#certEmpty` — the "Certificates coming soon" card currently on screen

`script.js` lines 33–35 automatically hide the "coming soon" card the moment you add the first
`.cert-card`, so **you only need to add the cards in the HTML**.

⚠️ **Before adding certificates**, read the note in the comment above that section: it is
intentionally empty because no certificate has been verified yet. Only list credentials you actually
hold, and include the name, issuer and date for each.

---

## 11. Professional Title

**Current value:** `AI Engineer | Machine Learning Student`

| File | Line | Usage |
| --- | --- | --- |
| `index.html` | 8 | `<title>` |
| `index.html` | 9 | `meta description` |
| `index.html` | 17 | `og:title` |
| `index.html` | 178 | Eyebrow badge above the hero heading |
| `index.html` | 185 | `hero__headline` paragraph |

Note the `|` characters are written as `&nbsp;|&nbsp;` in the HTML. Keep that encoding if you edit
those lines, otherwise the spacing collapses.

---

## 12. Other Content Worth Reviewing

These are not placeholders, but they are the parts most likely to go out of date.

| What | Where | Note |
| --- | --- | --- |
| `og:description` | `index.html:18` | Must be kept in step with the title and description |
| `alt` text on the photo | `index.html:152` | Describes you by name and title |
| Bio / About copy | `index.html:187–193`, `226–232`, `252–268` | Written in the first person — re-read after a few months |
| Education timeline | `index.html:403–451` | Update the years and results when they change |
| Skills chips | `index.html:328–393` | Add or remove chips as your stack grows |
| Current learning | `index.html:530–566` | Reflects what you are studying right now |
| Career goal | `index.html:586–606` | Keep this honest and current |

---

## 13. Files With No Personal Data

For reference, these files contain **no** personal information and need no editing:

- `style.css` — design tokens and layout only. The only trace of a name is the file header comment on
  line 2, which is cosmetic.
- `README.md` — contains your name and links. Update it too when you change any value in the tables
  above, otherwise the repository and the site will disagree.
- `images/profile.jpg` and `resume/Akshata_Kamble_Resume.pdf` — the assets themselves.

---

## 14. Before You Publish

- [ ] `script.js:14` `CONTACT_EMAIL` matches the email shown in the HTML
- [ ] Footer name updated in **both** `index.html:729` and `script.js:418`
- [ ] Profile image `width`/`height` match the real image dimensions
- [ ] `og:image` and `twitter:image` use absolute `https://` URLs
- [ ] Every project link opens the repository you intend
- [ ] LinkedIn and GitHub **links and visible usernames** agree
- [ ] The canonical URL matches your deployed address
- [ ] Test the contact form end to end and confirm the email arrives
- [ ] `README.md` updated to match
- [ ] Delete this file before the final commit
