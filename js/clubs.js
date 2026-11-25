const clubs = window.SaranathData.clubs;
const clubFilterOptions = window.SaranathData.clubFilters;

const clubGrid = document.querySelector(".clubs-grid");
const clubTemplate = document.querySelector("#club-card-template");
const clubFilters = document.querySelector(".club-filters");
const clubFilterTemplate = document.querySelector("#club-filter-template");

function renderClubFilters() {
  if (!clubFilters || !clubFilterTemplate) {
    return;
  }

  const filters = document.createDocumentFragment();
  clubFilterOptions.forEach((option, index) => {
    const button = clubFilterTemplate.content.firstElementChild.cloneNode(true);
    button.dataset.clubFilter = option.category;
    button.textContent = option.label;
    button.setAttribute("aria-pressed", String(index === 0));
    if (index === 0) {
      button.classList.add("is-active");
    }
    filters.append(button);
  });
  clubFilters.replaceChildren(filters);
}

function renderClubCards() {
  if (!clubGrid || !clubTemplate) {
    return;
  }

  const cards = document.createDocumentFragment();
  clubs.forEach((club) => {
    const card = clubTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector(".club-card--image");
    card.dataset.clubCategory = club.category;
    image.src = `../assets/images/${club.image}`;
    image.alt = club.alt;
    card.querySelector(".club-card--category").textContent = club.label;
    card.querySelector("h3").textContent = club.name;
    card.querySelector(".club-card--description").textContent = club.description;
    card.querySelector(".club-card--details").textContent = club.details;
    card.querySelector(".club-card--more a").href =
      `mailto:info.saranathcollege@gmail.com?subject=${encodeURIComponent(`${club.name} enquiry`)}`;
    cards.append(card);
  });
  clubGrid.replaceChildren(cards);
}

function filterClubs(filter) {
  clubGrid.querySelectorAll("[data-club-category]").forEach((card) => {
    const isVisible = filter === "all" || card.dataset.clubCategory === filter;
    card.hidden = !isVisible;
    if (!isVisible) {
      card.querySelector(".club-card--more").open = false;
    }
  });
}

renderClubCards();
renderClubFilters();

if (clubFilters && clubGrid) {
  clubFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-club-filter]");
    if (!button || !clubFilters.contains(button)) {
      return;
    }

    clubFilters.querySelectorAll("[data-club-filter]").forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    filterClubs(button.dataset.clubFilter);
  });

  clubGrid.addEventListener("click", (event) => {
    const summary = event.target.closest(".club-card--more summary");
    if (!summary) {
      return;
    }

    const selectedDetails = summary.parentElement;
    if (!selectedDetails.open) {
      clubGrid.querySelectorAll(".club-card--more[open]").forEach((details) => {
        if (details !== selectedDetails) {
          details.open = false;
        }
      });
    }
  });
}
