const projectDetails = {
  mellow: {
    title: "Mellow Coffee",
    description: "나만의 커피 취향을 발견하고 매달 새로운 원두를 만나는 구독 경험을 설계했습니다. 브랜드의 따뜻한 무드를 디지털 화면 전반에 일관되게 담았습니다.",
    role: "서비스 흐름과 화면을 설계하고 브랜드 웹사이트 구현을 주도했습니다.",
    technologies: ["Figma", "HTML", "CSS", "JavaScript"],
    achievements: ["취향 진단부터 구독 신청까지의 사용자 흐름을 하나로 정리했습니다.", "일관된 브랜드 경험을 위한 반응형 웹 화면을 구성했습니다."]
  },
  orbit: {
    title: "Orbit Finance",
    description: "복잡하게 느껴지는 투자 정보를 누구나 이해할 수 있도록 시각화하고, 사용자의 첫 투자부터 꾸준한 관리까지 이어지는 흐름을 만들었습니다.",
    role: "사용자 조사와 정보 구조 설계, 금융 대시보드 디자인을 담당했습니다.",
    technologies: ["Figma", "Prototyping", "Design System", "Data Visualization"],
    achievements: ["핵심 투자 정보를 한눈에 파악할 수 있는 대시보드 구조를 제안했습니다.", "반복 사용되는 화면 요소를 정리해 디자인 일관성을 높였습니다."]
  },
  sori: {
    title: "Sori Archive",
    description: "소리를 통해 기억을 기록하는 모바일 아카이브입니다. 소리의 감정을 시각 언어로 번역해 차분하고 몰입감 있는 탐색 경험을 구현했습니다.",
    role: "브랜드 아이덴티티와 모바일 앱의 주요 화면 및 프로토타입을 제작했습니다.",
    technologies: ["Figma", "Illustrator", "Prototyping", "Mobile UX"],
    achievements: ["소리 기록을 쉽게 탐색할 수 있도록 아카이브 화면을 구성했습니다.", "시각 요소와 인터랙션을 통일해 차분한 탐색 경험을 만들었습니다."]
  }
};

const modal = document.querySelector("#project-modal");
const modalContent = modal.querySelector(".modal-content");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalRole = document.querySelector("#modal-role");
const modalTags = document.querySelector("#modal-tags");
const modalAchievements = document.querySelector("#modal-achievements");
let lastFocusedCard = null;

// 프로젝트 상세 정보를 채운 뒤 모달을 열고 포커스를 이동합니다.
function openProject(projectKey, card) {
  const project = projectDetails[projectKey];
  if (!project) return;
  lastFocusedCard = card;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalRole.textContent = project.role;
  modalTags.replaceChildren(...project.technologies.map((technology) => {
    const element = document.createElement("span");
    element.textContent = technology;
    return element;
  }));
  modalAchievements.replaceChildren(...project.achievements.map((achievement) => {
    const element = document.createElement("li");
    element.textContent = achievement;
    return element;
  }));
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalContent.focus();
}

// 모달을 닫고 열기 전 프로젝트 카드로 키보드 포커스를 돌려줍니다.
function closeProject() {
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedCard) lastFocusedCard.focus();
}

// 각 프로젝트 카드는 클릭, Enter 또는 Space 키로 열 수 있습니다.
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => openProject(card.dataset.project, card));
  card.addEventListener("keydown", (event) => {
    if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openProject(card.dataset.project, card);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeProject);
});

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("is-open")) return;
  if (event.key === "Escape") {
    closeProject();
    return;
  }
  if (event.key !== "Tab") return;

  const focusableElements = modal.querySelectorAll("button:not([disabled])");
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === modalContent)) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && (document.activeElement === lastElement || document.activeElement === modalContent)) {
    event.preventDefault();
    firstElement.focus();
  }
});

const contactForm = document.querySelector("#contact-form");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = contactForm.elements.namedItem("name");
  const email = contactForm.elements.namedItem("email");
  const message = contactForm.elements.namedItem("message");
  const status = document.querySelector("#contact-form-status");
  const errors = [];
  let firstInvalidField = null;

  [
    { field: name, isInvalid: !name.value.trim(), error: "이름을 입력해 주세요." },
    {
      field: email,
      isInvalid: !email.value.trim() || !email.validity.valid,
      error: email.value.trim() ? "올바른 이메일 주소를 입력해 주세요." : "이메일을 입력해 주세요."
    },
    { field: message, isInvalid: !message.value.trim(), error: "메시지를 입력해 주세요." }
  ].forEach(({ field, isInvalid, error }) => {
    field.setAttribute("aria-invalid", String(isInvalid));
    if (isInvalid) {
      errors.push(error);
      firstInvalidField ||= field;
    }
  });

  if (errors.length > 0) {
    status.textContent = errors.join(" ");
    firstInvalidField.focus();
    return;
  }

  status.textContent = "입력이 확인되었습니다. 이 실습에서는 이메일이 전송되지 않습니다.";
  contactForm.reset();
  [name, email, message].forEach((field) => field.removeAttribute("aria-invalid"));
});
