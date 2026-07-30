/* Minimal progressive enhancement — no dependencies, no storage. */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close the menu after tapping a link (mobile)
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Active section highlighting in the nav ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__menu a[href^="#"]'));
  var sections = links
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      return el ? { id: id, el: el, link: a } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    sections.forEach(function (s) { byId[s.id] = s.link; });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.removeAttribute("aria-current"); });
            var active = byId[entry.target.id];
            if (active) active.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* ---- Auto-strike past deadlines ----
     Add data-date="YYYY-MM-DD" to a .timeline__item and, once real dates
     are filled in, it will automatically dim + strike through after it passes. */
  var now = new Date();
  Array.prototype.forEach.call(
    document.querySelectorAll(".timeline__item[data-date]"),
    function (item) {
      var d = new Date(item.getAttribute("data-date") + "T23:59:59");
      if (!isNaN(d) && d < now) item.classList.add("is-past");
    }
  );
})();
