const sectionLinks = document.querySelectorAll(".section-index a");
const contentSections = document.querySelectorAll(".content-section[id]");

// highlight the page section to nearest the viewport.
if ("IntersectionObserver" in window && sectionLinks.length && contentSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      sectionLinks.forEach((link) => {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle("is-active", isCurrent);
        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-18% 0px -68% 0px" });

  contentSections.forEach((section) => sectionObserver.observe(section));
}

const academicLevels = window.SaranathData.studentLife.academicLevels;
const academicStreams = window.SaranathData.studentLife.academicStreams;

function createImageViewerButton(image, caption) {
  const button = document.createElement("button");
  button.className = "image-viewer-trigger";
  button.type = "button";
  button.dataset.fullImage = image.src;
  button.dataset.fullAlt = image.alt;
  button.dataset.fullCaption = caption || image.alt;
  button.setAttribute("aria-label", `View full-size image: ${caption || image.alt}`);
  if (image.parentElement) {
    image.parentElement.insertBefore(button, image);
  }
  button.append(image);
  return button;
}

function renderAcademicLevels() {
  const levelGrid = document.querySelector("#academic-levels");
  const levelTemplate = document.querySelector("#academic-level-template");
  if (!levelGrid || !levelTemplate) {
    return;
  }

  const levels = document.createDocumentFragment();
  academicLevels.forEach((level) => {
    const card = levelTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    image.src = `../assets/images/${level.image}`;
    image.alt = level.alt;
    createImageViewerButton(image);
    card.querySelector(".academic-label").textContent = level.gradeRange;
    card.querySelector("h3").textContent = level.name;
    card.querySelector("p").textContent = level.description;
    levels.append(card);
  });
  levelGrid.replaceChildren(levels);
}

function renderAcademicStreams() {
  const selector = document.querySelector("#academic-stream-selector");
  const buttonTemplate = document.querySelector("#academic-stream-button-template");
  const detailMount = document.querySelector("#academic-stream-detail");
  const detailTemplate = document.querySelector("#academic-stream-detail-template");
  if (!selector || !buttonTemplate || !detailMount || !detailTemplate) {
    return;
  }

  const buttons = document.createDocumentFragment();
  Object.entries(academicStreams).forEach(([key, stream]) => {
    const button = buttonTemplate.content.firstElementChild.cloneNode(true);
    button.dataset.academicStream = key;
    button.querySelector(".academic-stream-selector__icon").textContent = stream.number;
    button.querySelector("strong").textContent = stream.name;
    button.querySelector("small").textContent = stream.selectorCaption;
    buttons.append(button);
  });
  selector.replaceChildren(buttons);

  const detail = detailTemplate.content.firstElementChild.cloneNode(true);
  detailMount.replaceChildren(detail);
  const streamImage = detail.querySelector("#academic-stream-image");
  createImageViewerButton(streamImage);

  function selectAcademicStream(streamKey) {
    const stream = academicStreams[streamKey];
    if (!stream) {
      return;
    }

    selector.querySelectorAll("[data-academic-stream]").forEach((button) => {
      const isActive = button.dataset.academicStream === streamKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    const image = detail.querySelector("#academic-stream-image");
    image.src = `../assets/images/${stream.image}`;
    image.alt = stream.alt;
    const imageButton = image.closest(".image-viewer-trigger");
    imageButton.dataset.fullImage = image.src;
    imageButton.dataset.fullAlt = stream.alt;
    imageButton.dataset.fullCaption = stream.alt;
    imageButton.setAttribute("aria-label", `View full-size image: ${stream.alt}`);
    detail.querySelector("#academic-stream-category").textContent = stream.category;
    detail.querySelector("#academic-stream-title").textContent = `Exploring ${stream.name}`;
    detail.querySelector("#academic-stream-focus").textContent = stream.focus;
    detail.querySelector("#academic-stream-careers").textContent = stream.careers;
    detail.querySelector("#academic-stream-description").textContent = stream.description;

    const subjects = detail.querySelector("#academic-stream-subjects");
    const subjectItems = stream.subjects.map((subject) => {
      const item = document.createElement("li");
      item.textContent = subject;
      return item;
    });
    subjects.replaceChildren(...subjectItems);
    detail.querySelector("#academic-stream-contact").href =
      `mailto:info.saranathcollege@gmail.com?subject=${encodeURIComponent(`${stream.name} A/L enquiry`)}`;
  }

  selector.addEventListener("click", (event) => {
    const button = event.target.closest("[data-academic-stream]");
    if (button && selector.contains(button)) {
      selectAcademicStream(button.dataset.academicStream);
    }
  });

  selectAcademicStream("physical");
}

renderAcademicLevels();
renderAcademicStreams();

const studentLifeSections = window.SaranathData.studentLife.sections;
const studentHouses = window.SaranathData.studentLife.houses;

function createSectionHeading(section) {
  const heading = document.createElement("div");
  heading.className = "section-heading";
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = section.eyebrow;
  const title = document.createElement("h2");
  title.textContent = section.title;
  const intro = document.createElement("p");
  intro.className = "section-intro";
  intro.textContent = section.intro;
  heading.append(eyebrow, title, intro);
  return heading;
}

function createLifeFeature(section) {
  const feature = document.createElement("div");
  feature.className = section.reverse ? "life-feature life-feature--reverse" : "life-feature";

  const copy = document.createElement("div");
  copy.className = "life-feature--copy";
  const title = document.createElement("h3");
  title.textContent = section.heading;
  const description = document.createElement("p");
  description.textContent = section.description;
  copy.append(title, description);

  if (section.link) {
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = section.link.href;
    link.append(document.createTextNode(section.link.label));
    const icon = document.createElement("i");
    icon.className = "fa fa-arrow-right";
    icon.setAttribute("aria-hidden", "true");
    link.append(" ", icon);
    copy.append(link);
  }

  const figure = document.createElement("figure");
  figure.className = "life-feature--photo";
  const image = document.createElement("img");
  image.src = `../assets/images/${section.image}`;
  image.alt = section.imageAlt;
  image.width = 1200;
  image.height = 800;
  image.loading = "lazy";
  const caption = document.createElement("figcaption");
  caption.textContent = section.imageCaption;
  figure.append(createImageViewerButton(image, section.imageCaption), caption);

  feature.append(copy, figure);
  return feature;
}

function createHouseExplorer() {
  const explorer = document.createElement("div");
  explorer.className = "house-explorer";

  const heading = document.createElement("h3");
  heading.className = "house-explorer__heading";
  heading.textContent = "Four houses, one community";
  explorer.append(heading);

  const cards = document.createElement("div");
  cards.className = "house-grid";
  cards.setAttribute("role", "group");
  cards.setAttribute("aria-label", "Select a school house");

  const spotlight = document.createElement("article");
  spotlight.className = "house-spotlight";
  spotlight.setAttribute("aria-live", "polite");
  const copy = document.createElement("div");
  copy.className = "house-spotlight__copy";
  const label = document.createElement("p");
  label.className = "house-spotlight__label";
  const title = document.createElement("h3");
  const description = document.createElement("p");
  description.className = "house-spotlight__description";
  const facts = document.createElement("div");
  facts.className = "house-spotlight__facts";
  const emblemFact = document.createElement("div");
  emblemFact.className = "house-spotlight__fact";
  const emblemLabel = document.createElement("span");
  emblemLabel.textContent = "HOUSE EMBLEM";
  const emblemValue = document.createElement("strong");
  emblemFact.append(emblemLabel, emblemValue);
  const colourFact = document.createElement("div");
  colourFact.className = "house-spotlight__fact";
  const colourLabel = document.createElement("span");
  colourLabel.textContent = "HOUSE COLOUR";
  const colourValue = document.createElement("strong");
  colourFact.append(colourLabel, colourValue);
  facts.append(emblemFact, colourFact);
  copy.append(label, title, description, facts);

  const score = document.createElement("div");
  score.className = "house-spotlight__score";
  const scoreValue = document.createElement("strong");
  const scoreLabel = document.createElement("small");
  scoreLabel.textContent = "HOUSE POINTS";
  score.append(scoreValue, scoreLabel);
  spotlight.append(copy, score);

  function selectHouse(house) {
    cards.querySelectorAll("[data-house-id]").forEach((button) => {
      const active = button.dataset.houseId === house.id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.querySelector(".house-card__selected").hidden = !active;
    });

    label.textContent = "HOUSE SPOTLIGHT";
    title.textContent = `${house.name} House`;
    description.textContent = house.description;
    emblemValue.textContent = house.bird;
    colourValue.textContent = house.colour;
    scoreValue.textContent = String(house.points);
  }

  studentHouses.forEach((house, index) => {
    const button = document.createElement("button");
    button.className = "house-card";
    button.type = "button";
    button.dataset.houseId = house.id;
    button.style.setProperty("--house-color", house.color);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `${house.name} House, ${house.points} points`);

    const top = document.createElement("span");
    top.className = "house-card__top";
    const emblem = document.createElement("span");
    emblem.className = "house-card__emblem";
    emblem.setAttribute("aria-hidden", "true");
    emblem.textContent = house.name[0];
    const points = document.createElement("span");
    points.className = "house-card__points";
    points.textContent = `${house.points} pts`;
    top.append(emblem, points);

    const name = document.createElement("strong");
    name.className = "house-card__name";
    name.textContent = `${house.name} House`;
    const bird = document.createElement("span");
    bird.className = "house-card__bird";
    bird.textContent = house.bird;
    const colour = document.createElement("span");
    colour.className = "house-card__colour";
    colour.textContent = house.colour;
    const selected = document.createElement("span");
    selected.className = "house-card__selected";
    selected.textContent = "Currently selected";
    selected.hidden = index !== 0;
    button.append(top, name, bird, colour, selected);
    button.addEventListener("click", () => selectHouse(house));
    cards.append(button);
  });

  explorer.append(cards, spotlight);
  selectHouse(studentHouses[0]);
  return explorer;
}

function createLifeSectionContent(section) {
  if (section.type === "community") {
    const card = document.createElement("article");
    card.className = "voice-card voice-card--feature";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Community feedback";
    const title = document.createElement("h3");
    title.textContent = section.heading;
    const description = document.createElement("p");
    description.textContent = section.description;
    const link = document.createElement("a");
    link.className = "button button--navy";
    link.href = section.link.href;
    link.append(document.createTextNode(section.link.label));
    const icon = document.createElement("i");
    icon.className = "fa fa-arrow-right";
    icon.setAttribute("aria-hidden", "true");
    link.append(" ", icon);
    card.append(eyebrow, title, description, link);
    return card;
  }

  if (section.id === "academics" || section.id === "gallery") {
    return null;
  }

  if (section.type === "achievements") {
    const grid = document.createElement("div");
    grid.className = "achievement-grid";
    const stories = window.SaranathData.school.news
      .filter((story) => section.storyIds.includes(story.id));

    stories.forEach((story) => {
      const card = document.createElement("article");
      card.className = "achievement-card";
      const image = document.createElement("img");
      image.src = `../assets/images/${story.image}`;
      image.alt = story.imageAlt;
      image.width = 1200;
      image.height = 800;
      image.loading = "lazy";
      card.append(createImageViewerButton(image, story.title));

      const content = document.createElement("div");
      content.className = "achievement-card__content";
      const title = document.createElement("h3");
      title.textContent = story.title;
      const excerpt = document.createElement("p");
      excerpt.textContent = story.excerpt;
      const link = document.createElement("a");
      link.className = "text-link";
      link.href = `news-story.html?story=${encodeURIComponent(story.id)}`;
      link.textContent = "Read achievement story";
      content.append(title, excerpt, link);
      card.append(content);
      grid.append(card);
    });

    return grid;
  }

  if (section.type === "feature") {
    return createLifeFeature(section);
  }

  if (section.type === "photo") {
    const figure = document.createElement("figure");
    figure.className = "wide-photo";
    const image = document.createElement("img");
    image.src = `../assets/images/${section.image}`;
    image.alt = section.imageAlt;
    image.width = section.imageWidth;
    image.height = section.imageHeight;
    image.loading = "lazy";
    const caption = document.createElement("figcaption");
    caption.textContent = section.imageCaption;
    figure.append(createImageViewerButton(image, section.imageCaption), caption);
    return figure;
  }

  if (section.type === "clubs") {
    const preview = document.createElement("div");
    preview.className = "club-preview";
    const copy = document.createElement("div");
    copy.className = "club-preview--copy";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = section.cardEyebrow;
    const title = document.createElement("h3");
    title.textContent = section.heading;
    const description = document.createElement("p");
    description.textContent = section.description;
    const link = document.createElement("a");
    link.className = "button button--navy";
    link.href = section.link.href;
    link.setAttribute("aria-label", `${section.link.label}: view all clubs and societies`);
    link.append(document.createTextNode(section.link.label));
    const icon = document.createElement("i");
    icon.className = "fa fa-arrow-right";
    icon.setAttribute("aria-hidden", "true");
    link.append(" ", icon);
    copy.append(eyebrow, title, description, link);

    const interests = document.createElement("div");
    interests.className = "interest-row";
    interests.setAttribute("aria-label", "Club interests");
    const interestIcons = {
      arts: '<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4c-.6-.6-.2-1.6.7-1.6H18a3 3 0 0 0 3-3c0-5.3-4-10-9-10Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="16" cy="9" r="1"/>',
      media: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M2 21h20M8 17l-1 4m9-4 1 4"/>',
      learning: '<path d="M9 3h6m-5 0v6l-5.5 9a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7.5 16h9"/>',
      service: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20v-1a6 6 0 0 1 12 0v1m0-4a5 5 0 0 1 6 4"/>'
    };
    section.interests.forEach((interest) => {
      const item = document.createElement("a");
      item.href = `clubs.html?category=${encodeURIComponent(interest.category)}#club-directory`;
      item.setAttribute("aria-label", `Browse ${interest.label} groups`);
      const icon = document.createElement("span");
      icon.className = "interest-row__icon";
      icon.setAttribute("aria-hidden", "true");
      const iconGlyph = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      iconGlyph.setAttribute("viewBox", "0 0 24 24");
      iconGlyph.setAttribute("fill", "none");
      iconGlyph.setAttribute("stroke", "currentColor");
      iconGlyph.setAttribute("stroke-width", "1.7");
      iconGlyph.setAttribute("stroke-linecap", "round");
      iconGlyph.setAttribute("stroke-linejoin", "round");
      iconGlyph.innerHTML = interestIcons[interest.category];
      icon.append(iconGlyph);
      const label = document.createElement("span");
      label.className = "interest-row__label";
      label.textContent = interest.label;
      const arrow = document.createElement("span");
      arrow.className = "interest-row__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      item.append(icon, label, arrow);
      interests.append(item);
    });
    preview.append(copy, interests);
    return preview;
  }

  if (section.type === "events") {
    const container = document.createDocumentFragment();
    const teasers = document.createElement("div");
    teasers.className = "event-teaser-grid";
    section.teasers.forEach((teaser) => {
      const card = document.createElement("a");
      card.className = teaser.warm ? "event-teaser event-teaser--warm" : "event-teaser";
      card.href = "news-events.html#school-events";
      const icon = document.createElement("i");
      icon.className = "event-teaser--icon fa fa-arrow-right";
      icon.setAttribute("aria-hidden", "true");
      const eyebrow = document.createElement("span");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = teaser.eyebrow;
      const title = document.createElement("strong");
      title.textContent = teaser.title;
      const description = document.createElement("span");
      description.textContent = teaser.description;
      card.append(icon, eyebrow, title, description);
      teasers.append(card);
    });
    container.append(teasers);

    const events = window.SaranathData.school.events.filter((event) => section.eventIds.includes(event.id));
    const timeline = document.createElement("div");
    timeline.className = "event-timeline";
    timeline.id = "student-life-event-timeline";
    timeline.setAttribute("aria-label", "Student life event timeline");
    events.forEach((event) => {
      const entry = document.createElement("article");
      entry.className = "event-timeline--entry";
      const time = document.createElement("time");
      time.className = "event-timeline--year";
      time.dateTime = event.dateTime || "";
      time.textContent = event.dateTime ? event.dateTime.slice(0, 4) : "";
      const link = document.createElement("a");
      link.className = "event-timeline--card";
      link.href = "news-events.html#school-events";
      const cardHeading = document.createElement("div");
      cardHeading.className = "event-timeline--card-heading";
      const title = document.createElement("h3");
      title.textContent = event.title;
      const date = document.createElement("span");
      date.textContent = event.shortDate ? `${event.category} · ${event.shortDate}` : event.category;
      cardHeading.append(title, date);
      const excerpt = document.createElement("p");
      excerpt.textContent = event.excerpt;
      link.append(cardHeading, excerpt);
      entry.append(time, link);
      timeline.append(entry);
    });
    container.append(timeline);
    return container;
  }

  return document.createDocumentFragment();
}

function renderStudentLifeSections() {
  studentLifeSections.forEach((section) => {
    const mount = document.querySelector(`#${section.id}`);
    if (!mount) {
      return;
    }
    const headingMount = mount.querySelector("[data-section-heading]");
    if (headingMount) {
      headingMount.replaceChildren(...createSectionHeading(section).childNodes);
      return;
    }

    const content = [createSectionHeading(section), createLifeSectionContent(section)];
    if (section.id === "sports") {
      content.push(createHouseExplorer());
    }
    mount.replaceChildren(...content);
  });
}

renderStudentLifeSections();

const galleryPhotos = window.SaranathData.studentLife.galleryPhotos;

const galleryGrid = document.querySelector(".gallery-grid");
const galleryTemplate = document.querySelector("#gallery-item-template");
const galleryFilters = document.querySelector(".gallery-filters");
const galleryDialog = document.querySelector("#gallery-dialog");
const galleryDialogImage = document.querySelector("#gallery-dialog-image");
const galleryDialogCaption = document.querySelector("#gallery-dialog-caption");
let galleryItems = [];
let activeGalleryItems = [];
let activeGalleryIndex = 0;

const galleryFilterData = window.SaranathData.studentLife.galleryFilters;

function renderGalleryFilters() {
  if (!galleryFilters) {
    return;
  }
  const buttons = galleryFilterData.map((filter, index) => {
    const button = document.createElement("button");
    button.type = "button";
    if (index === 0) {
      button.className = "is-active";
    }
    button.dataset.galleryFilter = filter.value;
    button.setAttribute("aria-pressed", String(index === 0));
    button.textContent = filter.label;
    return button;
  });
  galleryFilters.replaceChildren(...buttons);
}

function renderGallery() {
  if (!galleryGrid || !galleryTemplate) {
    return;
  }

  const items = document.createDocumentFragment();
  galleryPhotos.forEach((photo) => {
    const item = galleryTemplate.content.firstElementChild.cloneNode(true);
    const image = item.querySelector("img");
    const caption = item.querySelector(".gallery-item--caption");
    item.dataset.galleryCategory = photo.category;
    item.dataset.galleryCaption = photo.caption;
    if (photo.size) {
      item.classList.add(`gallery-item--${photo.size}`);
    }
    image.src = `../assets/images/${photo.image}`;
    image.alt = photo.alt;
    image.width = photo.width || 1200;
    image.height = photo.height || 800;
    caption.append(document.createTextNode(`${photo.caption} `));
    const label = document.createElement("small");
    label.textContent = photo.label;
    caption.append(label);
    items.append(item);
  });
  galleryGrid.replaceChildren(items);
  galleryItems = Array.from(galleryGrid.querySelectorAll(".gallery-item"));
  activeGalleryItems = galleryItems;
}

function showGalleryItem() {
  const item = activeGalleryItems[activeGalleryIndex];
  if (!item || !galleryDialogImage || !galleryDialogCaption) {
    return;
  }

  galleryDialog.classList.remove("gallery-dialog--single");
  const image = item.querySelector("img");
  galleryDialogImage.src = image.currentSrc || image.src;
  galleryDialogImage.alt = image.alt;
  galleryDialogCaption.textContent = item.dataset.galleryCaption || image.alt;
}

function moveGallery(direction) {
  activeGalleryIndex = (activeGalleryIndex + direction + activeGalleryItems.length) % activeGalleryItems.length;
  showGalleryItem();
}

renderGalleryFilters();
renderGallery();

document.addEventListener("click", (event) => {
  const button = event.target.closest(".image-viewer-trigger");
  if (!button || !galleryDialog || typeof galleryDialog.showModal !== "function") {
    return;
  }

  galleryDialog.classList.add("gallery-dialog--single");
  galleryDialogImage.src = button.dataset.fullImage;
  galleryDialogImage.alt = button.dataset.fullAlt;
  galleryDialogCaption.textContent = button.dataset.fullCaption;
  galleryDialog.showModal();
});

if (galleryFilters && galleryGrid) {
  galleryFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-filter]");
    if (!button || !galleryFilters.contains(button)) {
      return;
    }

    galleryFilters.querySelectorAll("[data-gallery-filter]").forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    const filter = button.dataset.galleryFilter;
    galleryItems.forEach((item) => {
      item.hidden = filter !== "all" && item.dataset.galleryCategory !== filter;
    });
    activeGalleryItems = galleryItems.filter((item) => !item.hidden);
  });

  galleryGrid.addEventListener("click", (event) => {
    const item = event.target.closest(".gallery-item");
    if (!item || !galleryGrid.contains(item) || !galleryDialog || typeof galleryDialog.showModal !== "function") {
      return;
    }

    activeGalleryItems = galleryItems.filter((galleryItem) => !galleryItem.hidden);
    activeGalleryIndex = activeGalleryItems.indexOf(item);
    showGalleryItem();
    galleryDialog.showModal();
  });
}

const galleryCloseButton = document.querySelector(".gallery-dialog--close");
const galleryPreviousButton = document.querySelector(".gallery-dialog--prev");
const galleryNextButton = document.querySelector(".gallery-dialog--next");

if (galleryDialog && galleryCloseButton && galleryPreviousButton && galleryNextButton) {
  galleryCloseButton.addEventListener("click", () => galleryDialog.close());
  galleryPreviousButton.addEventListener("click", () => moveGallery(-1));
  galleryNextButton.addEventListener("click", () => moveGallery(1));

  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) {
      galleryDialog.close();
    }
  });

  galleryDialog.addEventListener("keydown", (event) => {
    if (galleryDialog.classList.contains("gallery-dialog--single")) {
      return;
    }
    if (event.key === "ArrowLeft") {
      moveGallery(-1);
    } else if (event.key === "ArrowRight") {
      moveGallery(1);
    }
  });
}
