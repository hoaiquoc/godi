const themeToggle = document.getElementById("toggleTheme");
const sidebarToggle = document.getElementById("toggleSidebar");
const sidePanel = document.getElementById("sidePanel");
const floatingControls = document.getElementById("floatingControls");
const floatingMenuToggle = document.getElementById("toggleFloatingMenu");
const navLinks = document.querySelectorAll(".nav-link");
const filters = document.querySelectorAll(".roadmap-filter");
const roadmapCards = document.querySelectorAll(".roadmap-card");

const savedTheme = localStorage.getItem("godi-theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const currentTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
  localStorage.setItem("godi-theme", currentTheme);
});

const syncSidebarState = () => {
  const isCollapsed = sidePanel?.classList.contains("collapsed");
  sidebarToggle?.setAttribute(
    "aria-label",
    isCollapsed ? "Mở menu điều hướng" : "Ẩn menu điều hướng"
  );
};

const syncFloatingMenuState = () => {
  const isOpen = floatingControls?.classList.contains("open");
  floatingMenuToggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
  floatingMenuToggle?.setAttribute("aria-label", isOpen ? "Đóng menu nổi" : "Mở menu nổi");
};

floatingMenuToggle?.addEventListener("click", () => {
  floatingControls?.classList.toggle("open");
  syncFloatingMenuState();
});

sidebarToggle?.addEventListener("click", () => {
  sidePanel?.classList.toggle("collapsed");
  syncSidebarState();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    if (window.innerWidth <= 1200) {
      sidePanel?.classList.add("collapsed");
      syncSidebarState();
      floatingControls?.classList.remove("open");
      syncFloatingMenuState();
    }
  });
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    roadmapCards.forEach((card) => {
      const track = card.dataset.track;
      const shouldShow = filter === "all" || track === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

const sections = document.querySelectorAll("main .section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0.1,
  }
);

sections.forEach((section) => observer.observe(section));

syncSidebarState();
syncFloatingMenuState();
