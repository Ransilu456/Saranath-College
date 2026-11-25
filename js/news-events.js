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
  const date = document.querySelector("#news-story-date");
  date.hidden = !story.date;
  date.dateTime = story.dateTime || "";
  date.textContent = story.date ? story.date.toUpperCase() : "";
  date.nextElementSibling.hidden = !story.date;
  document.querySelector("#news-story-type").textContent =
    story.type === "event" ? "School Event" : story.date ? "School News" : "Feature";
  document.querySelector("#news-story-category").textContent = story.category.toUpperCase();
  document.querySelector("#news-story-title").textContent = story.title;

  const copy = document.querySelector("#news-story-copy");
  const paragraphs = document.createDocumentFragment();
  story.paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraphs.append(paragraph);
  });
  copy.replaceChildren(paragraphs);

  document.title = `${story.title} | Saranath College`;
  storyArticle.hidden = false;
}

renderNewsCards();
renderNewsStory();