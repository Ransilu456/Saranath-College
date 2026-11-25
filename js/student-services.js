const studentServices = window.SaranathData.services;

function renderStudentServices() {
  const grid = document.querySelector("#services-grid");
  const template = document.querySelector("#service-card-template");
  if (!grid || !template) {
    return;
  }

  const cards = document.createDocumentFragment();
  studentServices.forEach((service) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector(".service-card__number").textContent = service.number;
    card.querySelector(".eyebrow").textContent = service.category;
    card.querySelector("h2").textContent = service.title;
    card.querySelector(".service-card__description").textContent = service.description;

    const link = card.querySelector(".service-card__link");
    link.href = service.link.href;
    link.querySelector("span").textContent = service.link.label;
    link.hidden = false;
    cards.append(card);
  });
  grid.replaceChildren(cards);
}

renderStudentServices();

function renderFeedbackReport() {
  const mount = document.querySelector("#feedback-report-list");
  if (!mount) {
    return;
  }

  const entries = window.SaranathData.feedbackReport;

  let activeFilter = "all";

  document.querySelector("#report-total").textContent = String(entries.length);
  document.querySelector("#report-ideas-total").textContent = String(entries.filter((entry) => entry.type === "ideas").length);
  document.querySelector("#report-concerns-total").textContent = String(entries.filter((entry) => entry.type === "concerns").length);
  document.querySelector("#report-feedback-total").textContent = String(entries.filter((entry) => entry.type === "feedback").length);

  const getReaction = (id) => {
    try {
      return JSON.parse(localStorage.getItem(`saranath-reaction-${id}`) || "{}");
    } catch {
      return {};
    }
  };

  mount.replaceChildren(...entries.map((entry) => {
    const article = document.createElement("article");
    article.className = "feedback-report-item";
    article.dataset.reportType = entry.type;

    const type = document.createElement("p");
    type.className = "feedback-report-item__type";
    type.textContent = entry.typeLabel;

    const content = document.createElement("div");
    content.className = "feedback-report-item__content";
    const title = document.createElement("h2");
    title.textContent = entry.title;
    const message = document.createElement("p");
    message.textContent = entry.content;
    content.append(title, message);

    const reactions = document.createElement("div");
    reactions.className = "feedback-report-reactions";

    ["like", "dislike"].forEach((reaction) => {
      const stored = getReaction(entry.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "feedback-report-reaction";
      button.setAttribute("aria-pressed", String(stored.reaction === reaction));
      button.textContent = `${reaction === "like" ? "↑" : "↓"} ${reaction === "like" ? "Like" : "Dislike"} ${Number(stored[reaction] || 0)}`;

      button.addEventListener("click", () => {
        const value = getReaction(entry.id);
        const previous = value.reaction;

        if (previous === reaction) {
          value[reaction] = Math.max(0, Number(value[reaction] || 0) - 1);
          delete value.reaction;
        } else {
          if (previous) {
            value[previous] = Math.max(0, Number(value[previous] || 0) - 1);
          }
          value[reaction] = Number(value[reaction] || 0) + 1;
          value.reaction = reaction;
        }

        localStorage.setItem(`saranath-reaction-${entry.id}`, JSON.stringify(value));
        window.location.reload();
      });

      reactions.append(button);
    });

    article.append(type, content, reactions);
    return article;
  }));

  document.querySelectorAll("[data-report-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.reportFilter;
      document.querySelectorAll("[data-report-filter]").forEach((filterButton) => {
        const active = filterButton === button;
        filterButton.classList.toggle("is-active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });
      mount.querySelectorAll(".feedback-report-item").forEach((item) => {
        item.hidden = activeFilter !== "all" && item.dataset.reportType !== activeFilter;
      });
    });
  });
}

renderFeedbackReport();
