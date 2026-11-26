const newsStories = [
  ...window.SaranathData.school.news,
  ...window.SaranathData.school.events.map((event) => ({ ...event, type: "event" }))
];

function createStoryUrl(storyId) {
  return `news-story.html?story=${encodeURIComponent(storyId)}`;
}

function renderNewsCards() {
  const newsTemplate = document.querySelector("#news-card-template");
  const grids = {
    news: document.querySelector("#news-grid"),
    event: document.querySelector("#events-grid")
  };
  if (!newsTemplate || !grids.news || !grids.event) {
    return;
  }

  const cards = {
    news: document.createDocumentFragment(),
    event: document.createDocumentFragment()
  };
  newsStories.forEach((story) => {
    const gridCards = cards[story.type];
    if (!gridCards) {
      return;
    }

    const card = newsTemplate.content.firstElementChild.cloneNode(true);
    const storyUrl = createStoryUrl(story.id);
    const imageLink = card.querySelector(".story-card__image-link");
    const image = imageLink.querySelector("img");
    imageLink.href = storyUrl;
    image.src = `../assets/images/${story.image}`;
    image.alt = story.imageAlt;

    const time = card.querySelector("time");
    time.hidden = !story.date;
    time.dateTime = story.dateTime || "";
    time.textContent = story.date ? story.date.toUpperCase() : "";
    time.nextElementSibling.hidden = !story.date;
    card.querySelector(".story-card__category").textContent = story.category;
    card.querySelector(".story-card__title").href = storyUrl;
    card.querySelector(".story-card__title").textContent = story.title;
    card.querySelector(".story-card__excerpt").textContent = story.excerpt;
    card.querySelector(".story-card__link").href = storyUrl;
    gridCards.append(card);
  });
  grids.news.replaceChildren(cards.news);
  grids.event.replaceChildren(cards.event);
}

function renderNewsStory() {
  const storyArticle = document.querySelector("#news-story");
  if (!storyArticle) {
    return;
  }

  const storyId = new URLSearchParams(window.location.search).get("story");
  const story = newsStories.find((entry) => entry.id === storyId);
  const errorMessage = document.querySelector("#news-story-error");
  if (!story) {
    if (errorMessage) {
      errorMessage.hidden = false;
    }
    return;
  }

  const image = document.querySelector("#news-story-image");
  image.src = `../assets/images/${story.image}`;
  image.alt = story.imageAlt;
  const imageLink = document.querySelector("#news-story-image-link");
  imageLink.href = image.src;
  imageLink.setAttribute("aria-label", `View full-size image: ${story.title}`);
  const date = document.querySelector("#news-story-date");
  date.hidden = !story.date;
  date.dateTime = story.dateTime || "";
  date.textContent = story.date ? story.date.toUpperCase() : "";
  date.nextElementSibling.hidden = !story.date;
  document.querySelector("#news-story-type").textContent =
    story.type === "event" ? "School Event" : story.category === "School Feature" ? "Feature" : "School News";
  document.querySelector("#news-story-category").textContent = story.category.toUpperCase();
  document.querySelector("#news-story-title").textContent = story.title;

  const copy = document.querySelector("#news-story-copy");
  const paragraphs = document.createDocumentFragment();
  story.paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraphs.append(paragraph);
  });
  if (Array.isArray(story.studentNames) && story.studentNames.length > 0) {
    const students = document.createElement("section");
    students.className = "news-story-students";
    const heading = document.createElement("h2");
    heading.className = "news-story-students__title";
    heading.textContent = story.studentNames.length === 1 ? "Featured student" : "Selected students";
    const list = document.createElement("ul");
    list.className = "news-story-students__list";
    story.studentNames.forEach((name) => {
      const item = document.createElement("li");
      const student = document.createElement("strong");
      student.textContent = name;
      item.append(student);
      list.append(item);
    });
    students.append(heading, list);
    paragraphs.append(students);
  }
  copy.replaceChildren(paragraphs);

  const gallery = document.querySelector("#news-story-gallery");
  const galleryImages = document.querySelector("#news-story-gallery-images");
  gallery.hidden = true;
  galleryImages.replaceChildren();
  if (story.moreImages === true) {
    if (!Array.isArray(story.images) || story.imageCount !== story.images.length) {
      console.error(`Invalid photo gallery data for story "${story.id}".`);
    } else if (story.imageCount > 0) {
      const galleryTitle = document.querySelector("#news-story-gallery-title");
      galleryTitle.textContent = `More photos (${story.imageCount})`;
      story.images.forEach((photo) => {
        const link = document.createElement("a");
        link.href = `../assets/images/${photo.image}`;
        link.target = "_blank";
        link.rel = "noopener";
        const galleryImage = document.createElement("img");
        galleryImage.src = link.href;
        galleryImage.alt = photo.alt;
        galleryImage.width = 1200;
        galleryImage.height = 800;
        galleryImage.loading = "lazy";
        link.append(galleryImage);
        galleryImages.append(link);
      });
      gallery.hidden = false;
    }
  }

  document.title = `${story.title} | Saranath College`;
  storyArticle.hidden = false;
}

renderNewsCards();
renderNewsStory();