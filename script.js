const revealElements = document.querySelectorAll(
  ".reveal-up, .reveal-left, .reveal-right, .reveal-scale"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
);

revealElements.forEach((element) => revealObserver.observe(element));

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });
}

const touchTargets = document.querySelectorAll(
  ".project-card, .enhanced-project-card, .research-action, .research-fact, .feature-card, .mini-card, .cert-card, .skill-list span, .projects-page .project-tags span, .animated-paragraph, .btn"
);

touchTargets.forEach((item) => {
  item.addEventListener("touchstart", () => item.classList.add("touch-active"), {
    passive: true,
  });
  item.addEventListener(
    "touchend",
    () => setTimeout(() => item.classList.remove("touch-active"), 220),
    { passive: true }
  );
});

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const body = [
      `Hello Suchira,`,
      "",
      message,
      "",
      `From: ${name}`,
      `Email: ${email}`,
    ].join("\n");

    const mailtoUrl = `mailto:wijerathnadmst324@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    const note = document.querySelector("#form-note");
    if (note) {
      note.textContent =
        "Your email application should open with the message prepared. You can review it before sending.";
    }
  });
}

// Animated cybersecurity network and binary-rain background on the home page.
const cyberCanvas = document.querySelector("#cyber-canvas");

if (cyberCanvas) {
  const context = cyberCanvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: -1000, y: -1000, active: false };
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let particles = [];
  let binaryDrops = [];
  let animationFrame = 0;

  const randomBetween = (minimum, maximum) =>
    Math.random() * (maximum - minimum) + minimum;

  const createScene = () => {
    const bounds = cyberCanvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    cyberCanvas.width = Math.round(width * pixelRatio);
    cyberCanvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const particleCount = Math.max(28, Math.min(82, Math.floor(width / 18)));
    particles = Array.from({ length: particleCount }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.22, 0.22),
      vy: randomBetween(-0.2, 0.2),
      radius: randomBetween(1, 2.3),
      pulse: randomBetween(0, Math.PI * 2),
    }));

    const columnGap = width < 650 ? 32 : 42;
    binaryDrops = Array.from(
      { length: Math.ceil(width / columnGap) },
      (_, index) => ({
        x: index * columnGap + randomBetween(-8, 8),
        y: randomBetween(-height, height),
        speed: randomBetween(0.24, 0.75),
        value: Math.random() > 0.5 ? "1" : "0",
        opacity: randomBetween(0.035, 0.13),
      })
    );
  };

  const drawBinaryRain = () => {
    context.font = '11px "Orbitron", monospace';
    context.textAlign = "center";

    binaryDrops.forEach((drop) => {
      context.fillStyle = `rgba(56, 189, 248, ${drop.opacity})`;
      context.fillText(drop.value, drop.x, drop.y);

      if (!reducedMotion) {
        drop.y += drop.speed;
        if (drop.y > height + 20) {
          drop.y = randomBetween(-160, -20);
          drop.value = Math.random() > 0.5 ? "1" : "0";
        }
      }
    });
  };

  const drawNetwork = (time) => {
    const connectionDistance = width < 650 ? 92 : 132;

    particles.forEach((particle, index) => {
      if (!reducedMotion) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.025;
      }

      if (particle.x < -8) particle.x = width + 8;
      if (particle.x > width + 8) particle.x = -8;
      if (particle.y < -8) particle.y = height + 8;
      if (particle.y > height + 8) particle.y = -8;

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const dx = particle.x - next.x;
        const dy = particle.y - next.y;
        const distance = Math.hypot(dx, dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.17;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }

      if (pointer.active) {
        const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
        if (pointerDistance < 170) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `rgba(250, 204, 21, ${(1 - pointerDistance / 170) * 0.24})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }

      const glow = 0.52 + Math.sin(particle.pulse + time * 0.001) * 0.22;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(125, 211, 252, ${glow})`;
      context.shadowBlur = 10;
      context.shadowColor = "rgba(56, 189, 248, 0.7)";
      context.fill();
      context.shadowBlur = 0;
    });
  };

  const renderCyberScene = (time = 0) => {
    context.clearRect(0, 0, width, height);
    drawBinaryRain();
    drawNetwork(time);

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(renderCyberScene);
    }
  };

  const cyberHome = cyberCanvas.closest(".cyber-home");
  const pointerSurface = cyberHome || cyberCanvas;

  pointerSurface.addEventListener("pointermove", (event) => {
    const bounds = cyberCanvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  });

  pointerSurface.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  const resizeObserver = new ResizeObserver(() => {
    window.cancelAnimationFrame(animationFrame);
    createScene();
    renderCyberScene();
  });

  resizeObserver.observe(cyberCanvas);
}

// Premium home-page focus rotation and subtle portrait parallax.
const dynamicFocus = document.querySelector(".dynamic-focus");

if (dynamicFocus) {
  const words = String(dynamicFocus.dataset.focusWords || "")
    .split("|")
    .map((word) => word.trim())
    .filter(Boolean);
  let focusIndex = 0;

  if (words.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      dynamicFocus.classList.add("is-changing");
      window.setTimeout(() => {
        focusIndex = (focusIndex + 1) % words.length;
        dynamicFocus.textContent = words[focusIndex];
        dynamicFocus.classList.remove("is-changing");
      }, 240);
    }, 2600);
  }
}

const premiumVisual = document.querySelector(".premium-visual");

if (premiumVisual && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  premiumVisual.addEventListener("pointermove", (event) => {
    const bounds = premiumVisual.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    premiumVisual.style.setProperty("--visual-rotate-y", `${horizontal * 7}deg`);
    premiumVisual.style.setProperty("--visual-rotate-x", `${vertical * -6}deg`);
  });

  premiumVisual.addEventListener("pointerleave", () => {
    premiumVisual.style.setProperty("--visual-rotate-y", "0deg");
    premiumVisual.style.setProperty("--visual-rotate-x", "0deg");
  });
}

// Keep both hero-name lines fully visible after web fonts load and on resize.
const premiumName = document.querySelector('.premium-name');

if (premiumName) {
  const nameLines = premiumName.querySelectorAll('span, strong');
  let nameResizeTimer;

  const fitPremiumName = () => {
    const availableWidth = Math.max(1, premiumName.clientWidth);

    nameLines.forEach((line) => {
      line.style.removeProperty('font-size');
      const computedSize = Number.parseFloat(window.getComputedStyle(line).fontSize);
      const minimumSize = line.tagName === 'STRONG' ? 30 : 25;
      let fittedSize = computedSize;

      while (line.scrollWidth > availableWidth && fittedSize > minimumSize) {
        fittedSize -= 0.5;
        line.style.fontSize = `${fittedSize}px`;
      }
    });
  };

  const scheduleNameFit = () => {
    window.clearTimeout(nameResizeTimer);
    nameResizeTimer = window.setTimeout(fitPremiumName, 80);
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(fitPremiumName).catch(fitPremiumName);
  } else {
    window.addEventListener('load', fitPremiumName, { once: true });
  }

  window.addEventListener('resize', scheduleNameFit);
  fitPremiumName();
}
