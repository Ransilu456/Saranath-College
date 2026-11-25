// Header
function renderSiteHeader() {
  const mount = document.querySelector("[data-site-header]");
  if (!mount) {
    return;
  }

  const root = document.body.dataset.root || "";
  const currentPage = document.body.dataset.currentPage;

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="header--inner">
      <a class="brand" href="${root}index.html" aria-label="Saranath College home">
        <img src="${root}assets/images/college-icon.webp" alt="" width="44" height="44">
        <span>Saranath College</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation menu">
        <span></span><span></span><span></span>
      </button>
      <nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">
        <a href="${root}pages/student-life.html" data-page="student-life">Student Life</a>
        <a href="${root}pages/clubs.html" data-page="clubs">Clubs &amp; Societies</a>
        <a href="${root}pages/news-events.html" data-page="news-events">News &amp; Events</a>
        <a href="${root}pages/student-services.html" data-page="student-services">Student Services</a>
      </nav>
    </div>`;

  const currentLink = header.querySelector(`[data-page="${currentPage}"]`);
  if (currentLink) {
    currentLink.classList.add("is-current");
    currentLink.setAttribute("aria-current", "page");
  }
  mount.replaceWith(header);

  const menuButton = header.querySelector(".menu-toggle");
  const primaryNavigation = header.querySelector(".primary-nav");
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    primaryNavigation.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedMenu = primaryNavigation.contains(event.target) || menuButton.contains(event.target);
    if (!clickedMenu && primaryNavigation.classList.contains("is-open")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryNavigation.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
}

// Footer
function renderSiteFooter() {
  const mount = document.querySelector("[data-site-footer]");
  if (!mount) {
    return;
  }

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-contact">
      <div class="footer-contact--inner">
        <p>Main Street, Kuliyapitiya, Sri Lanka<br>(North Western Province)</p>
        <p><a href="tel:+94372281355">+94 37 228 1355</a><br><a href="mailto:info.saranathcollege@gmail.com">info.saranathcollege@gmail.com</a></p>
      </div>
    </div>`
  mount.replaceWith(footer);
}

renderSiteHeader();
renderSiteFooter();

// Reveal content 
const revealElements = document.querySelectorAll(".life-story, .gallery-item, .club-card, .event-card, .voice-card");

if ("IntersectionObserver" in window && revealElements.length) {
  document.documentElement.classList.add("has-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}