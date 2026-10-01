/* ==========================================================================
   Akshata Kamble | Portfolio Scripts
   --------------------------------------------------------------------------
   Six small features, all in plain JavaScript (no libraries):
     1. Mobile drawer menu (open / close)
     2. Smooth scrolling to each section
     3. Fading sections in as they scroll into view
     4. Highlighting the active icon in the right-side rail
     5. Contact form -> opens the visitor's email app, ready to send
     6. Floating glowing bubble background that reacts to mouse and touch
   ========================================================================== */

/* The email that the contact form sends to */
const CONTACT_EMAIL = "akshatakamble244@gmail.com";

document.addEventListener("DOMContentLoaded", function () {

    /* ==================================================================
       STEP 1: FIND THE ELEMENTS ON THE PAGE
       ================================================================== */
    const rail           = document.getElementById("rail");
    const railLinks      = document.querySelectorAll(".rail__link");
    const topbar         = document.getElementById("topbar");
    const topbarLinks    = document.querySelectorAll(".topbar__link");
    const drawerToggle   = document.getElementById("drawerToggle");
    const drawerOverlay  = document.getElementById("drawerOverlay");
    const sections       = document.querySelectorAll(".page .section");

    /* The certificate section shows a "coming soon" card only while it is empty.
       As soon as real .cert-card entries are added, hide it automatically. */
    const certList  = document.getElementById("certList");
    const certEmpty = document.getElementById("certEmpty");
    if (certList && certEmpty) {
        certEmpty.hidden = certList.children.length > 0;
    }

    /* ==================================================================
       STEP 2: MOBILE DRAWER MENU
       We only add or remove CSS classes here. CSS does the animation.
       ================================================================== */
    function openDrawer() {
        rail.classList.add("is-open");
        drawerOverlay.classList.add("is-visible");
        drawerToggle.classList.add("is-open");
        drawerToggle.setAttribute("aria-expanded", "true");
        drawerToggle.setAttribute("aria-label", "Close menu");
        document.body.classList.add("is-menu-open");
        if (topbar) {
            topbar.classList.add("is-menu-open");
        }
    }

    function closeDrawer() {
        rail.classList.remove("is-open");
        drawerOverlay.classList.remove("is-visible");
        drawerToggle.classList.remove("is-open");
        drawerToggle.setAttribute("aria-expanded", "false");
        drawerToggle.setAttribute("aria-label", "Open menu");
        document.body.classList.remove("is-menu-open");
        if (topbar) {
            topbar.classList.remove("is-menu-open");
        }
    }

    drawerToggle.addEventListener("click", function () {
        if (rail.classList.contains("is-open")) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    drawerOverlay.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && rail.classList.contains("is-open")) {
            closeDrawer();
        }
    });

    /* ==================================================================
       STEP 3: SMOOTH SCROLLING
       We scroll with JavaScript so the mobile drawer closes first, and so
       we can respect the visitor's "reduce motion" system setting.
       ================================================================== */
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* How far below the top of the viewport a section should land, so its
       heading is never hidden behind the fixed top navigation bar. */
    function topbarOffset() {
        const barHeight = topbar ? topbar.offsetHeight : 0;
        const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-gap")) || 0;
        return barHeight + gap;
    }

    /* Current vertical translateY of an element, from its CSS transform.
       The scroll maths must ignore this: sections fade in with a
       translateY(32px) start state, so their painted position sits lower
       than their real layout position until they are revealed. Measuring
       the raw rect would over-scroll by exactly that amount. */
    function translateYOf(element) {
        const transform = window.getComputedStyle(element).transform;
        if (!transform || transform === "none") {
            return 0;
        }
        try {
            if (window.DOMMatrixReadOnly) {
                return new window.DOMMatrixReadOnly(transform).m42;
            }
        } catch (error) {
            /* Fall through to manual parsing below */
        }
        const matrix3d = transform.match(/^matrix3d\(([^)]+)\)$/);
        if (matrix3d) {
            return parseFloat(matrix3d[1].split(",")[13]) || 0;
        }
        const matrix = transform.match(/^matrix\(([^)]+)\)$/);
        if (matrix) {
            return parseFloat(matrix[1].split(",")[5]) || 0;
        }
        return 0;
    }

    /* Scroll the window so that "target" sits just under the top bar.
       The destination is calculated explicitly rather than relying on
       scrollIntoView + CSS scroll offsets, which can stack and over-shoot. */
    function scrollToSection(target) {
        const offset = topbarOffset();
        const rect = target.getBoundingClientRect();

        /* Subtract the reveal transform to get the true layout position */
        const layoutTop = rect.top - translateYOf(target);
        const destination = layoutTop + window.scrollY - offset;

        /* The final section cannot scroll far enough to reach the offset,
           so clamp to the bottom of the page instead of leaving a gap. */
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

        window.scrollTo({
            top: Math.min(Math.max(0, destination), maxScroll),
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    }

    /* Any in-page link scrolls smoothly, not just the rail icons. This covers
       the top navigation, the rail (which sits outside .page), and buttons
       such as "View Projects" and "Contact Me!" inside the page. */
    const inPageLinks = document.querySelectorAll('a[href^="#"]');

    inPageLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            /* Only handle links that point to a section on this page */
            if (!href || href.charAt(0) !== "#") {
                return;
            }

            const target = document.querySelector(href);

            /* If the target is missing, do nothing rather than break */
            if (!target) {
                return;
            }

            event.preventDefault();
            closeDrawer();

            scrollToSection(target);

            /* Update the address bar without jumping the page */
            if (window.history.replaceState) {
                window.history.replaceState(null, "", href);
            }
        });

    });

    /* The "Back to top" link in the footer */
    const backToTop = document.querySelector(".footer__top");

    if (backToTop) {
        backToTop.addEventListener("click", function (event) {
            event.preventDefault();
            closeDrawer();
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        });
    }

    /* ==================================================================
       STEP 4: FADE SECTIONS IN AS THEY APPEAR
       IntersectionObserver is a built-in browser feature, so no library
       is needed. It tells us when a section scrolls into view.
       ================================================================== */
    sections.forEach(function (section) {
        section.classList.add("reveal");
    });

    /* The hero is on screen as soon as the page opens */
    const heroSection = document.getElementById("introduction");
    if (heroSection) {
        heroSection.classList.add("is-visible");
    }

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);   /* animate only once */
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -60px 0px"
        });

        sections.forEach(function (section) {
            revealObserver.observe(section);
        });

    } else {
        /* Older browser: just show everything straight away */
        sections.forEach(function (section) {
            section.classList.add("is-visible");
        });
    }

    /* ==================================================================
       STEP 5: HIGHLIGHT THE ACTIVE SECTION
       One pass over the sections moves the highlight in BOTH navigations:
       the top bar link and the right-hand icon rail.
       ================================================================== */
    /* Index every section the navigation points at, keyed by its href */
    const sectionByHref = new Map();

    document.querySelectorAll(".rail__link, .topbar__link").forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.charAt(0) !== "#") {
            return;
        }
        if (!sectionByHref.has(href)) {
            const section = document.querySelector(href);
            if (section) {
                sectionByHref.set(href, section);
            }
        }
    });

    /* Every section that the navigation points at, in document order */
    const navSections = [];
    sectionByHref.forEach(function (section) {
        navSections.push(section);
    });
    navSections.sort(function (a, b) {
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    function setActiveLink(activeHref) {
        railLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
        });
        topbarLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
        });
    }

    function updateActiveLink() {
        /* The line a section must pass to count as "current". It sits just
           below the fixed top bar, so the highlighted item always matches
           the heading the visitor can actually see. */
        const marker = (topbar ? topbar.offsetHeight : 0) + window.innerHeight * 0.26;

        let currentHref = navSections.length ? "#" + navSections[0].id : null;

        navSections.forEach(function (section) {
            if (section.getBoundingClientRect().top <= marker) {
                currentHref = "#" + section.id;
            }
        });

        /* At the very bottom, always highlight the last item */
        const atBottom =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;

        if (atBottom && navSections.length) {
            const last = navSections[navSections.length - 1];
            currentHref = "#" + last.id;
        }

        setActiveLink(currentHref);
    }

    /* Solid background + glow once the visitor leaves the top of the page */
    function updateTopbarState() {
        if (!topbar) {
            return;
        }
        topbar.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    /* Only run the scroll handler once per frame to keep scrolling smooth */
    let ticking = false;

    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateActiveLink();
                updateTopbarState();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* Run once on load in case the browser restored a scrolled position */
    updateActiveLink();
    updateTopbarState();

    /* ==================================================================
       STEP 6: CONTACT FORM
       There is no server behind a static website, so the form does the
       next best thing: it opens the visitor's own email app with the
       name, email and message already filled in, addressed to me.
       ================================================================== */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        const nameInput    = document.getElementById("fullName");
        const emailInput   = document.getElementById("email");
        const messageInput = document.getElementById("message");
        const errorBox     = document.getElementById("formError");

        /* Show a short message under the form if a field is missing */
        function showError(message) {
            errorBox.textContent = message;
            errorBox.hidden = false;
        }

        function clearError() {
            errorBox.hidden = true;
            errorBox.textContent = "";
        }

        /* Clear the warning as soon as the visitor starts typing again */
        [nameInput, emailInput, messageInput].forEach(function (input) {
            input.addEventListener("input", clearError);
        });

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            clearError();

            const name    = nameInput.value.trim();
            const email   = emailInput.value.trim();
            const message = messageInput.value.trim();

            /* Check that nothing important is empty */
            if (!name || !email || !message) {
                showError("Please fill in your full name, your email and a message.");
                return;
            }

            /* Very simple email check: needs an @ and a dot */
            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showError("Please enter a valid email address so I can reply to you.");
                emailInput.focus();
                return;
            }

            /* Build the email and open the visitor's mail app */
            const subject = "Portfolio Contact from " + name;
            const body =
                "Name: " + name + "\n" +
                "Email: " + email + "\n\n" +
                "Message:\n" + message;

            /* encodeURIComponent keeps spaces and line breaks safe */
            const mailtoUrl =
                "mailto:" + CONTACT_EMAIL +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);

            /* Open the mail app using a temporary link. This works in every
               modern browser and works on more platforms than assigning
               directly to window.location. */
            const mailLink = document.createElement("a");
            mailLink.href = mailtoUrl;
            mailLink.style.display = "none";
            document.body.appendChild(mailLink);
            mailLink.click();
            document.body.removeChild(mailLink);
        });
    }

    /* ==================================================================
       STEP 7: SMALL EXTRAS
       ================================================================== */

    /* Close the drawer automatically when the screen becomes wide again */
    window.addEventListener("resize", function () {
        if (window.innerWidth > 820) {
            closeDrawer();
        }
    });

    /* Make sure external links always carry rel="noopener noreferrer" */
    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
        link.setAttribute("rel", "noopener noreferrer");
    });

    /* Put the current year in the footer automatically */
    const footerText = document.querySelector(".footer p");

    if (footerText) {
        footerText.innerHTML =
            "Designed and built by <span class=\"grad\">Akshata Kamble</span> &nbsp;|&nbsp; &copy; " +
            new Date().getFullYear();
    }


/* ======================================================================
   STEP 8: COLOURFUL FLOATING BUBBLE / PARTICLE BACKGROUND
   ----------------------------------------------------------------------
   A single full-screen canvas holding a dense field of soft neon bubbles,
   dots and small shapes drifting upward forever. Nothing here touches the
   page content: the canvas sits at z-index 0 and the page above it at 1.

   How it stays cheap enough for phones:
     - every shape x colour x finish combination is pre-rendered ONCE into
       a small sprite canvas, so a frame is only a list of drawImage calls
     - the soft "blurred" particles are produced by applying ctx.filter while
       the sprite is being built, never per frame
     - the loop stops completely when the tab is hidden
     - the particle count and drift speed scale down on small screens
     - particles fade in and out instead of ever popping into view

   Readability is protected on purpose:
     - alphas are low and the whole canvas is faded
     - bigger particles are drawn MORE faintly, so a large glow behind a
       heading never competes with the text
     - particles fade out near the edges of the screen
   ====================================================================== */
   (function startBubbleBackground() {

       const canvas = document.getElementById("bgBubbles");

       if (!canvas || !canvas.getContext) {
           return;
       }

       const ctx = canvas.getContext("2d");

       /* Respect the visitor's motion settings - no animation if they asked
          for reduced motion. The background still shows, it just stays still. */
       const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
       let reduceMotion = motionQuery.matches;

       /* Particle size bands. Most particles are small, with a long tail of
          tiny dots and only a few large glowing bubbles, which is what gives
          the field its sense of depth. */
       const BANDS = [
             { name: "dot",    min: 1.5, max: 4,    weight: 0.40, alpha: 0.95, shapes: ["dot", "dot", "circle"] },
             { name: "small",  min: 4,   max: 9,    weight: 0.32, alpha: 0.88, shapes: ["circle", "ring", "dot"] },
             { name: "medium", min: 9,   max: 16,   weight: 0.20, alpha: 0.72, shapes: ["circle", "ring", "diamond", "square", "heart"] },
             { name: "large",  min: 16,  max: 30,   weight: 0.08, alpha: 0.50, shapes: ["circle", "ring", "heart"] }

       ];

       /* How close the pointer has to be before it starts nudging bubbles */
       const POINTER_RANGE = 150;

       let bubbles = [];
       let width = 0;
       let height = 0;
       let frameId = null;
       let lastTime = 0;

       const pointer = { x: -9999, y: -9999, active: false };

       /* Seven tints: cyan, blue, purple, pink, green, yellow, orange.
          The first two carry the site, the rest add the colourful life.
          Alphas stay low on purpose - these sit behind body text. */
         const TINTS = [
             { name: "cyan",    core: "rgba(190, 245, 255, 0.42)", mid: "rgba(34, 211, 238, 0.30)", soft: "rgba(34, 211, 238, 0.10)", body: "rgba(190, 245, 255, 0.26)" },
             { name: "blue",    core: "rgba(190, 225, 255, 0.40)", mid: "rgba(59, 130, 246, 0.28)", soft: "rgba(59, 130, 246, 0.09)", body: "rgba(190, 225, 255, 0.25)" },
             { name: "purple",  core: "rgba(214, 210, 255, 0.38)", mid: "rgba(139, 92, 246, 0.26)", soft: "rgba(139, 92, 246, 0.085)", body: "rgba(214, 210, 255, 0.24)" },
             { name: "pink",    core: "rgba(255, 214, 235, 0.36)", mid: "rgba(236, 72, 153, 0.24)", soft: "rgba(236, 72, 153, 0.08)", body: "rgba(255, 214, 235, 0.22)" },
             { name: "green",   core: "rgba(209, 250, 229, 0.38)", mid: "rgba(16, 185, 129, 0.26)", soft: "rgba(16, 185, 129, 0.085)", body: "rgba(209, 250, 229, 0.24)" },
             { name: "yellow",  core: "rgba(254, 243, 199, 0.40)", mid: "rgba(250, 204, 21, 0.27)", soft: "rgba(250, 204, 21, 0.09)", body: "rgba(254, 243, 199, 0.25)" },
             { name: "orange",  core: "rgba(255, 237, 213, 0.42)", mid: "rgba(249, 115, 22, 0.28)", soft: "rgba(249, 115, 22, 0.095)", body: "rgba(255, 237, 213, 0.26)" }
         ];


       /* Shapes that drift through the background. "dot" is a tiny solid
          speck, "ring" is an outline, the rest are small decorations. */
       const ALL_SHAPES = ["dot", "circle", "ring", "diamond", "square", "heart"];

       /* Every shape x colour x finish combination is drawn once at a fixed
          size and then simply scaled per bubble. Drawing a batch of sprites
          once is far cheaper than building gradients on every frame. */
       const SPRITE_SIZE = 80;
       const SPRITES = [];

       function drawShape(sctx, shape, half) {
           sctx.beginPath();

           if (shape === "dot" || shape === "circle") {
               sctx.arc(0, 0, half, 0, Math.PI * 2);
           } else if (shape === "ring") {
               sctx.arc(0, 0, half, 0, Math.PI * 2);
           } else if (shape === "diamond") {
               sctx.moveTo(0, -half);
               sctx.lineTo(half, 0);
               sctx.lineTo(0, half);
               sctx.lineTo(-half, 0);
               sctx.closePath();
           } else if (shape === "square") {
               const r = half * 0.34;
               sctx.moveTo(-half + r, -half);
               sctx.lineTo(half - r, -half);
               sctx.quadraticCurveTo(half, -half, half, -half + r);
               sctx.lineTo(half, half - r);
               sctx.quadraticCurveTo(half, half, half - r, half);
               sctx.lineTo(-half + r, half);
               sctx.quadraticCurveTo(-half, half, -half, half - r);
               sctx.lineTo(-half, -half + r);
               sctx.quadraticCurveTo(-half, -half, -half + r, -half);
               sctx.closePath();
           } else if (shape === "heart") {
               /* Heart drawn from two lobes and a point, centred on 0,0 */
               sctx.moveTo(0, half * 0.92);
               sctx.bezierCurveTo(-half * 1.5, -half * 0.2, -half * 0.62, -half * 1.15, 0, -half * 0.36);
               sctx.bezierCurveTo(half * 0.62, -half * 1.15, half * 1.5, -half * 0.2, 0, half * 0.92);
               sctx.closePath();
           }
       }

       function buildSprite(shape, tint, blurred) {
           const sprite = document.createElement("canvas");
           sprite.width = SPRITE_SIZE;
           sprite.height = SPRITE_SIZE;

           const sctx = sprite.getContext("2d");
           const c = SPRITE_SIZE / 2;

           /* Soft halo behind the shape, which is where the neon glow comes
              from. The peak is kept deliberately flat and low: particles
              drift and sometimes overlap, and a bright centre would stack up
              into a distracting hotspot. */
           const halo = sctx.createRadialGradient(c, c, 0, c, c, c - 1);
           halo.addColorStop(0.00, "rgba(255, 255, 255, 0.07)");
           halo.addColorStop(0.12, tint.core);
           halo.addColorStop(0.34, tint.mid);
           halo.addColorStop(0.70, tint.soft);
           halo.addColorStop(1.00, "rgba(34, 211, 238, 0)");

           sctx.fillStyle = halo;
           sctx.beginPath();
           sctx.arc(c, c, c - 1, 0, Math.PI * 2);
           sctx.fill();

           /* The shape itself, small enough to sit inside its own glow.
              Hearts are shrunk a little because they read heavier than the
              rest, and "dot" is kept tiny on purpose. */
           let half = SPRITE_SIZE * 0.19;

           if (shape === "heart") {
               half *= 0.78;
           } else if (shape === "dot") {
               half *= 0.5;
           }

           sctx.save();
           sctx.translate(c, c);

           /* The blur is baked in here, once, rather than being applied to
              every frame. This is what gives the field its sense of depth
              without costing anything at animation time. */
           if (blurred) {
               sctx.filter = "blur(3.2px)";
           }

           /* The body uses a lower alpha than the halo, otherwise the two
              stack up and the particles start to compete with the text. */
           sctx.fillStyle = tint.body;
           sctx.strokeStyle = tint.body;
           sctx.lineWidth = 3.2;
           sctx.lineJoin = "round";
           drawShape(sctx, shape, half);

           /* Rings are outlines, everything else is filled */
           shape === "ring" ? sctx.stroke() : sctx.fill();

           sctx.restore();

           return sprite;
       }

       function buildSprites() {
           SPRITES.length = 0;

           for (let t = 0; t < TINTS.length; t++) {
               for (let s = 0; s < ALL_SHAPES.length; s++) {
                   const shape = ALL_SHAPES[s];
                   const tint = TINTS[t];
                   const scale = shape === "heart" ? 0.78 : shape === "dot" ? 0.5 : 1;

                   /* Each shape gets a crisp version and a blurred one, so
                      some particles read as nearer and softer than others. */
                   SPRITES.push({
                       image: buildSprite(shape, tint, false),
                       shapeName: shape,
                       tintName: tint.name,
                       blurred: false,
                       scale: scale
                   });
                   SPRITES.push({
                       image: buildSprite(shape, tint, true),
                       shapeName: shape,
                       tintName: tint.name,
                       blurred: true,
                       scale: scale
                   });
               }
           }
       }

       let sprites = [];

       /* Cached lookup table, filled once the sprite pool exists */
       let spriteIndex = null;

       function buildSpriteIndex() {
           spriteIndex = new Map();

           for (let i = 0; i < SPRITES.length; i++) {
               const key = SPRITES[i].shapeName + "|" + SPRITES[i].tintName + "|" + SPRITES[i].blurred;
               spriteIndex.set(key, SPRITES[i]);
           }
       }

       function pickBand() {
           let roll = Math.random();
           for (let i = 0; i < BANDS.length; i++) {
               roll -= BANDS[i].weight;
               if (roll <= 0) {
                   return BANDS[i];
               }
           }
           return BANDS[0];
       }

       function makeBubble() {
           const band = pickBand();
           const radius = band.min + Math.random() * (band.max - band.min);
           const shape = band.shapes[Math.floor(Math.random() * band.shapes.length)];
           const tint = TINTS[Math.floor(Math.random() * TINTS.length)];
           const blurred = Math.random() < 0.38;

           /* Look up the matching pre-rendered sprite */
           const sprite = spriteIndex.get(shape + "|" + tint.name + "|" + blurred) || SPRITES[0];

           /* Sprites are drawn at a fixed size and scaled to the radius */
           const size = SPRITE_SIZE * (radius / 30) * sprite.scale;

           return {
               radius: radius,
               sprite: sprite.image,
               drawSize: size,
               /* Bigger particles are drawn more faintly so a large glow never
                  competes with the text sitting on top of it. */
               baseAlpha: band.alpha,
               x: Math.random() * width,
               y: Math.random() * height,
               /* Straight up and sideways, both very slow */
               vx: (Math.random() - 0.5) * 0.16,
               vy: -(0.07 + Math.random() * 0.17),
               /* Each bubble sways on its own rhythm */
               swayRate: 0.0004 + Math.random() * 0.0011,
               swaySize: 0.25 + Math.random() * 0.55,
               swayOffset: Math.random() * Math.PI * 2,
               pulseRate: 0.0008 + Math.random() * 0.0012,
               pulseOffset: Math.random() * Math.PI * 2,
               /* Slow fade in / fade out so particles never pop into view */
               fadeRate: 0.00022 + Math.random() * 0.00048,
               fadeOffset: Math.random() * Math.PI * 2,
               /* Only the geometric shapes turn, and only slowly */
               spin: shape === "diamond" || shape === "square" ? (Math.random() - 0.5) * 0.0006 : 0,
               spinOffset: Math.random() * Math.PI * 2,
               pushX: 0,
               pushY: 0
           };
       }

       /* Denser field, but scaled so phones and small laptops stay smooth. */
       function bubbleCount() {
           const area = width * height;
           let count = Math.round(area / 12000);

           /* Very small screens get fewer, and short/wide ones too, so the
              particles do not bunch up on a phone. */
           if (width < 700) {
               count = Math.round(count * 0.62);
           }
           if (height < 620) {
               count = Math.round(count * 0.85);
           }
           if (reduceMotion) {
               count = Math.round(count * 0.45);
           }

           return Math.max(14, Math.min(count, 96));
       }

         function resize(firstRun) {
             const oldWidth = width;
             const oldHeight = height;
 
             width = window.innerWidth;
             height = window.innerHeight;
 
             /* Cap the pixel density at 2 so high-DPI phones stay fast */
             const dpr = Math.min(window.devicePixelRatio || 1, 2);
 
             canvas.width = Math.round(width * dpr);
             canvas.height = Math.round(height * dpr);
             ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 
             /* Draw the shape sprites the very first time we know the canvas
                size, then reuse them for every bubble from then on. */
             if (sprites.length === 0) {
                 buildSprites();
                 sprites = SPRITES;
                 buildSpriteIndex();
             }
 
             const wanted = bubbleCount();
 
             if (bubbles.length > wanted) {
                 bubbles.length = wanted;
             }
             while (bubbles.length < wanted) {
                 bubbles.push(makeBubble());
             }
 
             /* Spread everything out over the whole screen on the very first
                layout, so the field never starts clumped in one corner.
                Particles are dropped onto a jittered grid, which scatters them
                far more evenly than pure randomness would. */
             if (firstRun) {
                 distribute(bubbles, wanted);
                 return;
             }
 
             /* On a later resize, carry the existing particles over instead of
                rebuilding them. Rebuilding would restart every particle's life
                and fade phase at once, which shows up as a visible flash, so
                the new field is just the old one carried over and made whole. */
             for (let i = 0; i < bubbles.length; i++) {
                 const b = bubbles[i];
 
                 if (oldWidth > 0 && oldHeight > 0) {
                     b.x = (b.x / oldWidth) * width;
                     b.y = (b.y / oldHeight) * height;
                 } else {
                     b.x = Math.random() * width;
                     b.y = Math.random() * height;
                 }
 
                 /* Keep them off the new edges so nothing is born hidden */
                 const pad = b.drawSize;
                 b.x = Math.min(Math.max(b.x, pad), Math.max(pad, width - pad));
                 b.y = Math.min(Math.max(b.y, pad), Math.max(pad, height - pad));
             }
         }
 
         /* A drag-resize fires dozens of events a second. Re-laying out the
            field on every one of them is wasted work, so the rebuild waits for
            the size to settle. */
         let resizeTimer = null;
 
         function scheduleResize() {
             if (resizeTimer !== null) {
                 window.clearTimeout(resizeTimer);
             }
             resizeTimer = window.setTimeout(function () {
                 resizeTimer = null;
                 resize(false);
             }, 140);
         }


       function distribute(list, total) {
           if (!total) {
               return;
           }

           /* A near-square grid suits any aspect ratio well enough */
           const cols = Math.max(1, Math.round(Math.sqrt(total)));
           const rows = Math.max(1, Math.ceil(total / cols));
           const cellW = width / cols;
           const cellH = height / rows;

           for (let i = 0; i < list.length; i++) {
               const col = i % cols;
               const row = Math.floor(i / cols);
               list[i].x = (col + 0.5 + (Math.random() - 0.5) * 0.85) * cellW;
               list[i].y = (row + 0.5 + (Math.random() - 0.5) * 0.85) * cellH;
           }
       }

       function frame(time) {
           frameId = null;

           if (!lastTime) {
               lastTime = time;
           }

           /* Clamp the step so a backgrounded tab cannot teleport bubbles */
           const step = Math.min(time - lastTime, 48);
           lastTime = time;

           ctx.clearRect(0, 0, width, height);

           for (let i = 0; i < bubbles.length; i++) {
               const b = bubbles[i];

               if (!reduceMotion) {
                   /* Gentle sideways sway on top of the steady drift */
                   b.x += (b.vx + Math.sin(time * b.swayRate + b.swayOffset) * b.swaySize * 0.05) * step * 0.06;
                   b.y += b.vy * step * 0.06;
               }

               /* Push the bubble away from the pointer, then let it ease
                  back to where it would have been. */
               let px = 0;
               let py = 0;

               if (pointer.active) {
                   const dx = b.x - pointer.x;
                   const dy = b.y - pointer.y;
                   const distance = Math.hypot(dx, dy);

                   if (distance < POINTER_RANGE && distance > 0.5) {
                       const force = (1 - distance / POINTER_RANGE) * 1.5;
                       px = (dx / distance) * force;
                       py = (dy / distance) * force;
                   }
               }

               b.pushX += (px - b.pushX) * 0.09;
               b.pushY += (py - b.pushY) * 0.09;

               const drawX = b.x + b.pushX;
               const drawY = b.y + b.pushY;
               const pulse = reduceMotion ? 1 : 1 + Math.sin(time * b.pulseRate + b.pulseOffset) * 0.07;
               const size = b.drawSize * pulse;

               /* Fade in and out on a long cycle, and fade away at the edges
                  so a particle crossing the border dissolves instead of
                  appearing from nowhere. */
               let alpha = b.baseAlpha;

               if (!reduceMotion) {
                   const fade = 0.5 + 0.5 * Math.sin(time * b.fadeRate * 6 + b.fadeOffset);
                   alpha *= 0.35 + fade * 0.65;
               }

               const edge = 60;
               if (drawY < edge) {
                   alpha *= Math.max(0, drawY / edge);
               } else if (drawY > height - edge) {
                   alpha *= Math.max(0, (height - drawY) / edge);
               }
               if (drawX < edge) {
                   alpha *= Math.max(0, drawX / edge);
               } else if (drawX > width - edge) {
                   alpha *= Math.max(0, (width - drawX) / edge);
               }

               if (alpha > 0.004) {
                   ctx.globalAlpha = alpha;
                   ctx.drawImage(b.sprite, drawX - size / 2, drawY - size / 2, size, size);
               }

               /* Wrap around the edges so the effect never runs out of
                  particles while you scroll */
               if (b.y + b.pushY < -size) {
                   b.y = height + size;
                   b.x = Math.random() * width;
               } else if (b.x + b.pushX < -size) {
                   b.x = width + size;
               } else if (b.x + b.pushX > width + size) {
                   b.x = -size;
               }
           }

           ctx.globalAlpha = 1;

           /* Only keep looping while the tab is actually visible */
           if (!document.hidden) {
               frameId = window.requestAnimationFrame(frame);
           }
       }

       function start() {
           if (frameId === null) {
               lastTime = 0;
               frameId = window.requestAnimationFrame(frame);
           }
       }

       function stop() {
           if (frameId !== null) {
               window.cancelAnimationFrame(frameId);
               frameId = null;
           }
       }

       function movePointer(x, y) {
           pointer.x = x;
           pointer.y = y;
           pointer.active = true;
       }

       window.addEventListener("mousemove", function (event) {
           movePointer(event.clientX, event.clientY);
       }, { passive: true });

       /* Touch: a finger nudges the bubbles the same way */
       window.addEventListener("touchmove", function (event) {
           if (event.touches && event.touches.length) {
               movePointer(event.touches[0].clientX, event.touches[0].clientY);
           }
       }, { passive: true });

       window.addEventListener("touchstart", function (event) {
           if (event.touches && event.touches.length) {
               movePointer(event.touches[0].clientX, event.touches[0].clientY);
           }
       }, { passive: true });

       window.addEventListener("touchend", function () {
           pointer.active = false;
       }, { passive: true });

       /* Back to normal drifting once the mouse leaves the window */
       window.addEventListener("mouseout", function (event) {
           if (!event.relatedTarget) {
               pointer.active = false;
           }
       });

       /* Save battery: no drawing at all while the tab is in the background,
          and pick it straight back up when the visitor returns. */
       document.addEventListener("visibilitychange", function () {
           if (document.hidden) {
               stop();
           } else {
               start();
           }
       });

         window.addEventListener("resize", scheduleResize, { passive: true });
 
         /* If the motion preference changes mid-visit, respect it straight away */
         if (motionQuery.addEventListener) {
             motionQuery.addEventListener("change", function (event) {
                 reduceMotion = event.matches;
                 resize(false);
             });
         }
 
         resize(true);
         start();


   })();
});


    /* ======================================================================
       STEP 9: FLOATING DECORATIVE BUBBLES
       ----------------------------------------------------------------------
       Step 8 paints a fine field of small dots on a fixed canvas. That field
       is deliberately quiet so it never competes with text. This step adds
       the decorations that actually read as "colourful bubbles": glowing
       circles, rings, hearts, triangles and diamonds, spread from the top of
       the hero down to the footer.

       How they are built:
         - one <i class="bubble"><span></span></i> per decoration
         - the outer <i> drifts, the inner <span> pulses and spins, so a bubble
           can move and rotate at once
         - position is a percentage of the whole page, so the decorations stay
           spread out at any window size without needing a resize handler
         - every bubble gets its own colour, size, opacity, speed and start
           offset, so the result never looks like a repeating pattern

       They live in .deco-field, which is z-index 0 with pointer-events:none,
       so the content (z-index 1) and the top bar (z-index 80) sit above them
       and no bubble can ever cover or intercept a word or a button.
       ====================================================================== */
    (function addFloatingBubbles() {

        const field = document.getElementById("decoField");

        if (!field) {
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* The seven tints the design calls for. Each is a light core, a
           saturated mid and a deep edge, which is what gives the spheres
           their glassy, lit-from-above look. */
        const PALETTE = [
            { name: "cyan",   c1: "#cffafe", c2: "#22d3ee", c3: "#0e7490" },
            { name: "blue",   c1: "#dbeafe", c2: "#3b82f6", c3: "#1d4ed8" },
            { name: "purple", c1: "#ede9fe", c2: "#8b5cf6", c3: "#6d28d9" },
            { name: "pink",   c1: "#fce7f3", c2: "#ec4899", c3: "#be185d" },
            { name: "green",  c1: "#d1fae5", c2: "#10b981", c3: "#047857" },
            { name: "yellow", c1: "#fef9c3", c2: "#facc15", c3: "#a16207" },
            { name: "orange", c1: "#ffedd5", c2: "#f97316", c3: "#c2410c" }
        ];

        /* Circles dominate, because that is what reads as "bubble", but every
           other shape in the brief gets a healthy share. `spin` marks the
           shapes where a slow rotation is actually visible. */
        const SHAPES = [
            { cls: "bubble--circle",  weight: 26, spin: false },
            { cls: "bubble--circle",  weight: 14, spin: false },
            { cls: "bubble--soft",    weight: 13, spin: false },
            { cls: "bubble--dot",     weight: 12, spin: false },
            { cls: "bubble--ring",    weight: 11, spin: true },
            { cls: "bubble--tri",     weight: 8,  spin: true },
            { cls: "bubble--diamond", weight: 7,  spin: true },
            { cls: "bubble--square",  weight: 5,  spin: true },
            { cls: "bubble--heart",   weight: 4,  spin: true }
        ];

        /* Four size bands, from tiny glowing dust up to wide soft halos. */
        const SIZES = [
            { min: 5,   max: 10,  weight: 32, opacity: [0.75, 0.98], glow: [8, 16] },
            { min: 12,  max: 28,  weight: 32, opacity: [0.55, 0.88], glow: [14, 30] },
            { min: 30,  max: 58,  weight: 22, opacity: [0.42, 0.70], glow: [20, 42] },
            { min: 66,  max: 118, weight: 14, opacity: [0.20, 0.38], glow: [30, 62] }
        ];

        function rand(min, max) {
            return min + Math.random() * (max - min);
        }

        function pick(list) {
            let total = 0;
            let i;

            for (i = 0; i < list.length; i++) {
                total += list[i].weight;
            }

            let roll = Math.random() * total;

            for (i = 0; i < list.length; i++) {
                roll -= list[i].weight;
                if (roll <= 0) {
                    return list[i];
                }
            }

            return list[0];
        }

        /* Every section gets its own share, so the decorations reach all the
           way down the page instead of bunching up in the hero. */
        const sections = Array.prototype.slice.call(
            document.querySelectorAll(".section, .intro")
        ).filter(function (el) {
            return el.getBoundingClientRect().height > 40;
        });

        if (!sections.length) {
            return;
        }

        const frag = document.createDocumentFragment();

        function addBubble(xPct, yPct, shapeCls, sizeBand, tint, spin, opts) {
            const size = opts.size;
            const opacity = rand(sizeBand.opacity[0], sizeBand.opacity[1]).toFixed(2);
            const glow = Math.round(rand(sizeBand.glow[0], sizeBand.glow[1]));
            const blur = Math.round(size * rand(0.1, 0.18));

            /* Long, prime-ish durations keep the bubbles from ever lining up */
            const duration = Math.round(rand(26, 58));
            const pulseRate = Math.round(rand(5, 13));
            const spinRate = Math.round(rand(38, 96));
            const delay = -Math.round(rand(0, duration));

            const driftX = opts.driftX;
            const driftY = opts.driftY;

            const bubble = document.createElement("i");
            bubble.className = "bubble " + shapeCls;
            bubble.style.cssText =
                "--x:" + xPct.toFixed(2) + "%;" +
                "--y:" + yPct.toFixed(2) + "%;" +
                "--s:" + size + "px;" +
                "--o:" + opacity + ";" +
                "--g:" + glow + "px;" +
                "--blur:" + blur + "px;" +
                "--c1:" + tint.c1 + ";" +
                "--c2:" + tint.c2 + ";" +
                "--c3:" + tint.c3 + ";" +
                "--dx:" + driftX + "px;" +
                "--dy:" + driftY + "px;" +
                "--dur:" + duration + "s;" +
                "--pdur:" + pulseRate + "s;" +
                "--sdur:" + (spin ? spinRate : spinRate * 3) + "s;" +
                "--delay:" + delay + "s;";

            const core = document.createElement("span");
            bubble.appendChild(core);
            frag.appendChild(bubble);
        }

        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );

        /* ---- Where is it safe to put a bubble? ------------------------ */

        /* A bubble must never end up behind a line of copy. Rather than guess
           with a fixed left/right margin - which was wrong here, because the
           content column is 1180px wide inside a 1440px window and so there is
           only about 130px of true gutter on each side - we measure the real
           occupied rectangles of every text block, card and image, then reject
           any candidate position that would land on one of them. */
        window.scrollTo(0, 0);

        const occupied = Array.prototype.slice.call(
            document.querySelectorAll(
                "p, h1, h2, h3, h4, h5, li, dt, dd, label, " +
                ".card, .avatar, .avatar__glow, .avatar__ring, .avatar__img, " +
                "img, .btn, button, input, textarea, .timeline, .sec-head, " +
                ".hero__focus, .hero__socials, .contact__detail, .form__row, " +
                ".tag, .chip, .rail, .topbar"
            )
        ).map(function (el) {
            const r = el.getBoundingClientRect();
            return {
                l: r.left + window.scrollX,
                t: r.top + window.scrollY,
                r: r.right + window.scrollX,
                b: r.bottom + window.scrollY
            };
        }).filter(function (r) {
            return r.r > r.l && r.b > r.t;
        });

        /* Clearance around a text block. It scales with the size of the bubble,
           because a big soft glow throws light much further than a small dot
           does - a 140px halo sitting 20px from a paragraph will visibly lift
           the background behind that paragraph, while a 6px dot will not. */
        const PAD_MIN = 32;
        const PAD_PER_PX = 1.05;

        function padFor(size) {
            return Math.round(PAD_MIN + size * PAD_PER_PX);
        }
        const viewW = window.innerWidth;
        const SAFE_TOP = 90;
        const SAFE_BOTTOM = docHeight - 40;

        /* A bubble is not a dot, it travels. The clearance test therefore has to
           cover the whole path the bubble sweeps while it drifts, not just the
           spot it starts on - otherwise it would happily drift into a heading
           a second after being placed. `driftX`/`driftY` are the end offset and
           `sweep` is the largest radius it reaches at any point of the cycle
           (the size is scaled up to 1.14 by the pulse and 1.06 by the drift). */
        function pathIsClear(x, y, driftX, driftY, sweep, pad) {
            const minX = Math.min(x, x + driftX) - sweep;
            const maxX = Math.max(x, x + driftX) + sweep;
            const minY = Math.min(y, y + driftY) - sweep;
            const maxY = Math.max(y, y + driftY) + sweep;

            if (minX < 4 || maxX > viewW - 4) {
                return false;
            }
            if (minY < SAFE_TOP || maxY > SAFE_BOTTOM) {
                return false;
            }

            for (let i = 0; i < occupied.length; i++) {
                const o = occupied[i];
                if (
                    maxX > o.l - pad &&
                    minX < o.r + pad &&
                    maxY > o.t - pad &&
                    minY < o.b + pad
                ) {
                    return false;
                }
            }
            return true;
        }

        /* Find a home for one bubble, negotiating the size down when the space
           is tight. A big soft glow needs a lot of clear room, so it is only
           placed where there genuinely is some; where there is not, a smaller
           dot takes its place instead of the bubble being dropped. */
        function placeBubble(band, driftX, driftY, area) {
            let size = Math.round(rand(band.min, band.max));

            while (size >= 5) {
                const sweep = Math.ceil(size * 0.62);
                const pad = padFor(size);

                for (let attempt = 0; attempt < 34; attempt++) {
                    let x;
                    let y;

                    if (attempt < 16) {
                        /* outer margins, where there is no copy at all */
                        x = Math.random() < 0.5
                            ? rand(16, viewW * 0.085)
                            : rand(viewW * 0.915, viewW - 16);
                    } else {
                        x = rand(26, viewW - 26);
                    }

                    y = rand(area.t, Math.max(area.t + 1, area.b));

                    if (pathIsClear(x, y, driftX, driftY, sweep, pad)) {
                        return { x: x, y: y, size: size };
                    }
                }

                size = Math.floor(size * 0.7);
            }

            return null;
        }

        /* ---- Pass 1: decide where every bubble goes ------------------- */

        const plan = [];

        sections.forEach(function (section, index) {
            const rect = section.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const height = rect.height;
            const area = { t: top, b: top + height };

            /* The hero is the first thing anyone sees, so it gets the most.
               Elsewhere the count follows the height of the section. */
            const count = index === 0
                ? 11
                : Math.max(5, Math.round((height / 240) * 1.05));

            for (let i = 0; i < count; i++) {
                const band = pick(SIZES);

                /* Slow, small travel. Anything much larger would drag the
                   bubble across the text column and wreck the clearance. */
                const driftX = Math.round(rand(-46, 46));
                const driftY = Math.round(rand(-58, 58));

                const spot = placeBubble(band, driftX, driftY, area);

                if (!spot) {
                    continue;
                }

                plan.push({
                    xPct: (spot.x / viewW) * 100,
                    yPct: (spot.y / docHeight) * 100,
                    band: band,
                    size: spot.size,
                    driftX: driftX,
                    driftY: driftY
                });
            }
        });

        /* ---- Pass 2: guarantee the brief, then fill randomly ----------- */

        /* Every shape and every colour the design calls for is seeded first, so
           the page can never end up with, say, zero hearts just because the
           dice were unkind. The remainder is filled by weight, and the whole
           pool is shuffled, so the guaranteed items do not clump together. */
        function seededPool(required, filler, total) {
            /* Never keep more guaranteed entries than there are slots, or the
               shuffle could push a required shape past the end and drop it. */
            const pool = required.slice(0, Math.max(0, total));

            while (pool.length < total) {
                pool.push(filler());
            }

            /* Fisher-Yates, so the order looks random */
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const swap = pool[i];
                pool[i] = pool[j];
                pool[j] = swap;
            }

            return pool;
        }

        const spinFor = {};
        SHAPES.forEach(function (s) {
            spinFor[s.cls] = s.spin;
        });

        const requiredShapes = [
            "bubble--heart", "bubble--heart", "bubble--heart",
            "bubble--tri", "bubble--tri", "bubble--tri",
            "bubble--diamond", "bubble--diamond",
            "bubble--ring", "bubble--ring", "bubble--ring",
            "bubble--soft", "bubble--soft", "bubble--soft",
            "bubble--square", "bubble--square",
            "bubble--dot", "bubble--dot"
        ];

        const requiredTints = PALETTE.map(function (t) {
            return t.name;
        });

        const shapePool = seededPool(
            requiredShapes,
            function () {
                return pick(SHAPES).cls;
            },
            plan.length
        );

        const tintPool = seededPool(
            requiredTints,
            function () {
                return PALETTE[Math.floor(Math.random() * PALETTE.length)].name;
            },
            plan.length
        );

        const tintByName = {};
        PALETTE.forEach(function (t) {
            tintByName[t.name] = t;
        });

        /* ---- Pass 3: build them --------------------------------------- */

        plan.forEach(function (spot, i) {
            const shapeCls = shapePool[i];
            const tint = tintByName[tintPool[i]];

            addBubble(spot.xPct, spot.yPct, shapeCls, spot.band, tint, spinFor[shapeCls], {
                size: spot.size,
                driftX: spot.driftX,
                driftY: spot.driftY
            });
        });

        field.appendChild(frag);

        /* If the page grows after the bubbles are placed (a web font landing,
           for example) the percentages still resolve against the new height, so
           the decorations stay spread across the whole document on their own. */
    })();
