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
  figure.append(image, caption);

  feature.append(copy, figure);
  return feature;
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
    figure.append(image, caption);
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
    link.append(document.createTextNode(section.link.label));
    const icon = document.createElement("i");
    icon.className = "fa fa-arrow-right";
    icon.setAttribute("aria-hidden", "true");
    link.append(" ", icon);
    copy.append(eyebrow, title, description, link);

    const interests = document.createElement("div");
    interests.className = "interest-row";
    interests.setAttribute("aria-label", "Club interests");
    section.interests.forEach((interest) => {
      const item = document.createElement("span");
      item.textContent = interest;
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
      time.dateTime = event.dateTime;
      time.textContent = event.dateTime.slice(0, 4);
      const link = document.createElement("a");
      link.className = "event-timeline--card";
      link.href = "news-events.html#school-events";
      const cardHeading = document.createElement("div");
      cardHeading.className = "event-timeline--card-heading";
      const title = document.createElement("h3");
      title.textContent = event.title;
      const date = document.createElement("span");
      date.textContent = `${event.category} · ${event.shortDate}`;
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
    } else if (section.type === "community") {
      mount.replaceChildren(createSectionHeading(section), createLifeSectionContent(section));
    } else {
      mount.replaceChildren(createSectionHeading(section), createLifeSectionContent(section));
    }
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
    if (event.key === "ArrowLeft") {
      moveGallery(-1);
    } else if (event.key === "ArrowRight") {
      moveGallery(1);
    }
  });
}

// Community feedback: display short reflections from this browser.
const feedbackList = document.querySelector("#feedback-list");
const feedbackCount = document.querySelector("#feedback-count");
const feedbackStorageKey = "saranath-student-life-feedback";
let feedbackEntries = [];

const renderFeedback = () => {
  if (!feedbackList || !feedbackCount) {
    return;
  }

  feedbackList.replaceChildren();
  feedbackCount.textContent = String(feedbackEntries.length);
  feedbackEntries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "feedback-entry";
    const message = document.createElement("p");
    message.textContent = entry.message;
    card.append(message);
    feedbackList.append(card);
  });
};

try {
  const savedFeedback = localStorage.getItem(feedbackStorageKey);
  if (savedFeedback) {
    const parsedFeedback = JSON.parse(savedFeedback);
    if (Array.isArray(parsedFeedback)) {
      feedbackEntries = parsedFeedback.filter((entry) =>
        entry && typeof entry.message === "string"
      ).slice(0, 8);
    }
  }
} catch {
  feedbackEntries = [];
}

renderFeedback();
