/* ---------------------------------------------------------------------------
   geo-chrome.js
   Gives the Quarto page the same furniture as "Kent on the Sphere":
     - a sticky bar showing which step you are in, with a Contents button
     - a full-screen contents panel built from the step headings
     - "Step N" lifted out of each heading into a small eyebrow label
   Pure DOM work; no dependencies.
--------------------------------------------------------------------------- */
(function () {
"use strict";

function build() {
  /* With theme:none Quarto writes its content straight into <body> with no
     wrapper of its own, so make one before adding any furniture. */
  var main = document.querySelector("main.gmain");
  if (!main) {
    var kids = Array.prototype.slice.call(document.body.childNodes);
    main = document.createElement("main");
    main.className = "gmain";
    document.body.appendChild(main);
    kids.forEach(function (n) {
      if (n.nodeType === 1 && (n.tagName === "SCRIPT" || n.tagName === "LINK" ||
                               n.tagName === "STYLE")) return;   /* leave assets put */
      main.appendChild(n);
    });
  }

  /* ---- collect the step headings ------------------------------------- */
  var heads = Array.prototype.filter.call(
    main.querySelectorAll("h1"),
    function (h) { return !h.classList.contains("title"); });
  if (!heads.length) return;

  /* ---- split "Step N — Title" into an eyebrow plus a title ------------ */
  var items = heads.map(function (h, i) {
    var raw = (h.textContent || "").trim();
    var m = raw.match(/^Step\s+(\d+)\s*(?:—|–|--)\s*(.+)$/);
    var label = m ? ("Step " + m[1]) : null;
    var title = m ? m[2] : raw;
    if (m) {
      h.textContent = "";
      var eb = document.createElement("span");
      eb.className = "geyebrow";
      eb.textContent = label;
      h.appendChild(eb);
      h.appendChild(document.createTextNode(title));
    }
    if (!h.id) h.id = "gsec-" + i;
    return { id: h.id, label: label || ("§" + (i + 1)), title: title, el: h };
  });

  /* ---- the sticky bar -------------------------------------------------- */
  var bar = document.createElement("div");
  bar.className = "gtop";
  bar.innerHTML =
    '<div class="gtop-in">' +
      '<a class="gback" href="../blog.html" title="Back to the blog">&larr;</a>' +
      '<a class="gbrand" href="../index.html"><span class="dot"></span>Khaled Masoumifard</a>' +
      '<span class="ghere" id="ghere"></span>' +
      '<button class="gtocbtn" id="gtocbtn" aria-expanded="false">Contents</button>' +
    '</div>';
  document.body.insertBefore(bar, main);

  /* ---- the contents overlay ------------------------------------------- */
  var toc = document.createElement("nav");
  toc.className = "gtoc";
  toc.id = "gtoc";
  toc.hidden = true;
  toc.innerHTML =
    '<div class="gtoc-in"><h3>Contents</h3>' +
    '<p>Nine steps, in order. Each one only uses ideas from the steps before it.</p>' +
    '<ol>' + items.map(function (it) {
      return '<li><a href="#' + it.id + '"><span class="n">' +
             it.label.replace(/^Step\s+/, "") + '</span><span>' +
             it.title + '</span></a></li>';
    }).join("") + '</ol></div>';
  document.body.insertBefore(toc, bar.nextSibling);

  var btn = document.getElementById("gtocbtn");
  function setOpen(open) {
    toc.hidden = !open;
    toc.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? "Close" : "Contents";
  }
  btn.addEventListener("click", function () { setOpen(toc.hidden); });
  toc.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  /* ---- which step am I in --------------------------------------------- */
  var here = document.getElementById("ghere"), ticking = false;
  function spy() {
    ticking = false;
    var cur = null, i;
    for (i = 0; i < items.length; i++) {
      if (items[i].el.getBoundingClientRect().top < 140) cur = items[i];
    }
    here.textContent = cur ? (cur.label + " · " + cur.title) : "From a triangle to an ellipse";
  }
  addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();

  /* ---- a colour key under the subtitle, like the other page ----------- */
  var hdr = document.getElementById("title-block-header");
  if (hdr) {
    var key = document.createElement("ul");
    key.className = "gkey";
    key.innerHTML =
      '<li><i style="background:#eb6834"></i>μ &mdash; mean direction</li>' +
      '<li><i style="background:#2a78d6"></i>γ₂ &mdash; long axis</li>' +
      '<li><i style="background:#1baf7a"></i>γ₃ &mdash; short axis</li>' +
      '<li><i style="background:#4a3aa7"></i>the level-set surface</li>';
    hdr.appendChild(key);
  }

  /* ---- a footer ------------------------------------------------------- */
  var foot = document.createElement("div");
  foot.className = "gfoot";
  foot.innerHTML = '<a href="../blog.html">&larr; Back to the blog</a> &nbsp;·&nbsp; ' +
                   '© 2026 Khaled Masoumifard';
  document.body.appendChild(foot);

  /* ---- let wide tables scroll rather than overflow -------------------- */
  Array.prototype.forEach.call(main.querySelectorAll("table"), function (t) {
    if (t.closest(".gscroll")) return;
    var w = document.createElement("div");
    w.className = "gscroll";
    w.style.overflowX = "auto";
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
else build();
})();
