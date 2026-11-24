(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#site-nav");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Menüyü aç" : "Menüyü kapat");
      menu.classList.toggle("is-open", !open);
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Menüyü aç");
        menu.classList.remove("is-open");
      });
    });
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Menüyü aç");
        menu.classList.remove("is-open");
      }
    });
  }

  document.querySelectorAll("[data-service]").forEach((link) => {
    const service = link.getAttribute("data-service");
    const message = "Merhaba, " + service + " hakkında bilgi almak istiyorum.";
    link.href = "https://wa.me/905071931930?text=" + encodeURIComponent(message);
  });

  const dialog = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const lightboxCount = document.querySelector(".lightbox-count");
  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"));
  const closeButton = document.querySelector(".lightbox-close");
  const previousButton = document.querySelector(".lightbox-previous");
  const nextButton = document.querySelector(".lightbox-next");
  let activeIndex = 0;
  let lastFocused = null;

  const galleryData = galleryItems.map((button) => {
    const image = button.querySelector("img");
    return { source: image.currentSrc || image.src, alt: image.alt, title: image.alt };
  });

  const showPhoto = (index) => {
    if (!galleryData.length) return;
    activeIndex = (index + galleryData.length) % galleryData.length;
    const photo = galleryData[activeIndex];
    lightboxImage.src = photo.source;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.title;
    lightboxCount.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(galleryData.length).padStart(2, "0");
  };

  const openGallery = (index, trigger) => {
    if (!dialog) return;
    lastFocused = trigger;
    showPhoto(index);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    closeButton.focus();
  };

  document.querySelectorAll("[data-open-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-open-gallery")) || 0;
      openGallery(index, button);
    });
  });
  galleryItems.forEach((button, index) => button.addEventListener("click", () => openGallery(index, button)));
  closeButton?.addEventListener("click", () => dialog.close());
  previousButton?.addEventListener("click", () => showPhoto(activeIndex - 1));
  nextButton?.addEventListener("click", () => showPhoto(activeIndex + 1));

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("close", () => {
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  });
  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });

  const leadButton = document.querySelector(".lead-photo-button");
  const leadImage = leadButton?.querySelector("img");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (leadButton && leadImage && finePointer && !reduceMotion) {
    leadButton.addEventListener("pointermove", (event) => {
      const bounds = leadButton.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      leadImage.style.transform = "scale(1.035) perspective(1100px) rotateY(" + (x * 1.4) + "deg) rotateX(" + (y * -1.2) + "deg)";
    });
    leadButton.addEventListener("pointerleave", () => { leadImage.style.transform = ""; });
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-ready");
    const tiles = document.querySelectorAll(".gallery-thumb");
    tiles.forEach((tile, index) => tile.style.setProperty("--reveal-delay", (index * 55) + "ms"));
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    tiles.forEach((tile) => observer.observe(tile));
  }
})();
