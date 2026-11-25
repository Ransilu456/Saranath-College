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

function setupFeedbackForm() {
  const form = document.querySelector("#feedback-submission-form");
  const status = document.querySelector("#feedback-form-status");
  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const type = formData.get("type");
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const subject = `${type} - Saranath College`;
    const body = [
      `Message type: ${type}`,
      `Name: ${name || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      "",
      message
    ].join("\n");

    status.textContent = "Your email app should open with the message. Review and send it there; it is not sent until you press Send.";
    window.location.href = `mailto:info.saranathcollege@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

setupFeedbackForm();