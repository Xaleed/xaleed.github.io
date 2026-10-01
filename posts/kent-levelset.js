/* ---------------------------------------------------------------------------
   kent-levelset.js
   Interactive companion to "Where the contour actually comes from".

   Shows three objects at once and lets the reader change kappa, beta and the
   contour level:
       the unit sphere          x^2 + y^2 + z^2 = 1      (where data live)
       the level-set surface    kappa*z + beta*(x^2-y^2) = C   (scaffolding)
       their intersection       the Kent density contour

   Self-contained: defines its own window.kentReady, so the page needs only
   Plotly loaded before it.
--------------------------------------------------------------------------- */
(function () {
"use strict";

var P = {
  mu: "#EB6834", g2: "#2A78D6", g3: "#1BAF7A", bs: "#4A3AA7",
  ink: "#141412", ink2: "#4D4C48", mut: "#8A8883", sph: "#B9B7AB"
};
var FONT = { family: "Helvetica, Arial, sans-serif", size: 11, color: P.ink2 };
var CFG  = { displayModeBar: false, responsive: true, scrollZoom: false };

function el(id) { return document.getElementById(id); }

/* the auxiliary surface, rearranged for z */
function levelZ(x, y, k, b, C) { return (C - b * (x*x - y*y)) / k; }

/* the peak of the exponent is kappa, at the north pole */
function levelFromFrac(k, frac) { return k + Math.log(frac); }

/* ---------------------------------------------------------------------------
   Exact intersection of the level-set surface with the unit sphere.
   Put z = cos(t) and x^2 - y^2 = sin^2(t) cos(2phi); the level-set equation
   becomes a quadratic in c = cos(t) for each azimuth phi:
       -b cos(2phi) c^2 + k c + (b cos(2phi) - C) = 0
   Keep the root nearest the north pole.  Returns {x, y, z, closed}.
--------------------------------------------------------------------------- */
function contour3d(k, b, C, nphi) {
  nphi = nphi || 721;
  var x = [], y = [], z = [], missing = 0, i;
  for (i = 0; i < nphi; i++) {
    var phi = 2 * Math.PI * i / (nphi - 1);
    var cc = Math.cos(2 * phi);
    var A = -b * cc, B = k, D = b * cc - C, c = NaN;
    if (Math.abs(A) < 1e-10) {
      c = -D / B;
    } else {
      var disc = B*B - 4*A*D;
      if (disc >= 0) {
        var r1 = (-B + Math.sqrt(disc)) / (2*A);
        var r2 = (-B - Math.sqrt(disc)) / (2*A);
        var ok = [r1, r2].filter(function (v) { return isFinite(v) && v >= -1 && v <= 1; });
        if (ok.length) c = Math.max.apply(null, ok);
      }
    }
    if (!isFinite(c) || Math.abs(c) > 1) { missing++; x.push(null); y.push(null); z.push(null); continue; }
    var st = Math.sqrt(Math.max(0, 1 - c*c));
    x.push(st * Math.cos(phi) * 1.004);
    y.push(st * Math.sin(phi) * 1.004);
    z.push(c * 1.004);
  }
  return { x: x, y: y, z: z, closed: missing === 0 };
}

/* furthest reach of the contour along each tangent axis */
function reach(k, b, C) {
  var cu = contour3d(k, b, C, 1441), ax = 0, ay = 0, i;
  for (i = 0; i < cu.x.length; i++) {
    if (cu.x[i] === null) continue;
    ax = Math.max(ax, Math.abs(cu.x[i]));
    ay = Math.max(ay, Math.abs(cu.y[i]));
  }
  return { x: ax / 1.004, y: ay / 1.004, closed: cu.closed };
}

/* ------------------------------------------------------------------ traces */
function sphereTrace() {
  var nu = 46, nv = 26, X = [], Y = [], Z = [], i, j;
  for (j = 0; j <= nv; j++) {
    var th = Math.PI * j / nv, xr = [], yr = [], zr = [];
    for (i = 0; i <= nu; i++) {
      var ph = 2 * Math.PI * i / nu;
      xr.push(Math.sin(th) * Math.cos(ph));
      yr.push(Math.sin(th) * Math.sin(ph));
      zr.push(Math.cos(th));
    }
    X.push(xr); Y.push(yr); Z.push(zr);
  }
  return {
    type: "surface", x: X, y: Y, z: Z, showscale: false, opacity: 0.22,
    colorscale: [[0, P.sph], [1, P.sph]],
    surfacecolor: Z.map(function (r) { return r.map(function () { return 0; }); }),
    hoverinfo: "skip", lighting: { ambient: 1, diffuse: 0, specular: 0 },
    contours: { x: { highlight: false }, y: { highlight: false }, z: { highlight: false } },
    name: "sphere"
  };
}
function levelTrace(k, b, C, rng, n) {
  rng = rng || 0.8; n = n || 40;
  var X = [], Y = [], Z = [], i, j;
  for (j = 0; j <= n; j++) {
    var yy = -rng + 2*rng*j/n, xr = [], yr = [], zr = [];
    for (i = 0; i <= n; i++) {
      var xx = -rng + 2*rng*i/n;
      var zz = levelZ(xx, yy, k, b, C);
      xr.push(xx); yr.push(yy);
      zr.push(Math.abs(zz) > 1.25 ? null : zz);      /* clip far away from the sphere */
    }
    X.push(xr); Y.push(yr); Z.push(zr);
  }
  return {
    type: "surface", x: X, y: Y, z: Z, showscale: false, opacity: 0.38,
    colorscale: [[0, P.bs], [1, P.bs]],
    surfacecolor: Z.map(function (r) { return r.map(function () { return 0; }); }),
    lighting: { ambient: 1, diffuse: 0, specular: 0 },
    contours: { x: { highlight: false }, y: { highlight: false }, z: { highlight: false } },
    hovertemplate: "level-set surface<br>x %{x:.2f}  y %{y:.2f}  z %{z:.3f}<extra></extra>",
    name: "level set"
  };
}
function curveTrace(cu) {
  return {
    type: "scatter3d", mode: "lines", x: cu.x, y: cu.y, z: cu.z,
    line: { color: P.ink, width: 7 },
    hovertemplate: "the contour<br>(%{x:.3f}, %{y:.3f}, %{z:.3f})<extra></extra>",
    name: "contour"
  };
}
function seg(a, b, col, w, dash) {
  return { type: "scatter3d", mode: "lines", x: [a[0], b[0]], y: [a[1], b[1]],
           z: [a[2], b[2]], line: { color: col, width: w, dash: dash || "solid" },
           hoverinfo: "skip" };
}
function tag(p, col, txt) {
  return { type: "scatter3d", mode: "markers+text", x: [p[0]], y: [p[1]], z: [p[2]],
           marker: { size: 3, color: col }, text: [txt], textposition: "middle right",
           textfont: { color: col, size: 13, family: FONT.family }, hoverinfo: "skip" };
}

/* --------------------------------------------------------------- the panel */
window.KentLevelSet = function (ids) {
  var sk = el(ids.kap), sb = el(ids.bet), sc = el(ids.lev);
  var gd = el(ids.plot);
  if (!sk || !sb || !sc || !gd) return;
  var first = true;

  function build() {
    var k = +sk.value, b = +sb.value, frac = +sc.value;
    var C = levelFromFrac(k, frac);
    el(ids.vk).textContent = k;
    el(ids.vb).textContent = b;
    el(ids.vc).textContent = frac.toFixed(2);

    var cu = contour3d(k, b, C);
    var rc = reach(k, b, C);

    var data = [sphereTrace(), levelTrace(k, b, C), curveTrace(cu)];
    data.push(seg([0, 0, 0], [0, 0, 1.25], P.mu, 6));
    data.push(tag([0, 0, 1.30], P.mu, "&mu;"));
    data.push(seg([0, 0, 1], [0.75, 0, 1], P.g2, 5));
    data.push(tag([0.80, 0, 1], P.g2, "x = &gamma;<sub>2</sub>"));
    data.push(seg([0, 0, 1], [0, 0.75, 1], P.g3, 5));
    data.push(tag([0, 0.80, 1], P.g3, "y = &gamma;<sub>3</sub>"));

    var layout = {
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      margin: { l: 0, r: 0, t: 0, b: 0 }, showlegend: false, font: FONT,
      scene: {
        xaxis: { visible: false }, yaxis: { visible: false }, zaxis: { visible: false },
        aspectmode: "cube", bgcolor: "rgba(0,0,0,0)", dragmode: "orbit",
        camera: { eye: { x: 1.35, y: 0.95, z: 0.80 }, up: { x: 0, y: 0, z: 1 } }
      }
    };
    /* keep whatever angle the reader has dragged to */
    if (!first && gd.layout && gd.layout.scene && gd.layout.scene.camera)
      layout.scene.camera = gd.layout.scene.camera;

    Plotly.react(gd, data, layout, CFG);
    first = false;

    var legal = 2*b < k;
    var msg =
      "level-set surface: &nbsp;<b>z = (" + C.toFixed(2) + " &minus; " + b +
      "(x&sup2; &minus; y&sup2;)) / " + k + "</b>" +
      " &nbsp;&nbsp;·&nbsp;&nbsp; C = &kappa; + ln(" + frac.toFixed(2) + ") = <b>" +
      C.toFixed(3) + "</b><br>" +
      "contour reaches <b>" + rc.x.toFixed(3) + "</b> along &gamma;<sub>2</sub> and <b>" +
      rc.y.toFixed(3) + "</b> along &gamma;<sub>3</sub>" +
      (rc.y > 1e-6 ? " &nbsp;(ratio <b>" + (rc.x / rc.y).toFixed(2) + "</b>)" : "");
    if (b === 0)
      msg += '<br><span style="color:' + P.g3 + '">&beta; = 0: the surface is a flat ' +
             'horizontal plane and the contour is a circle &mdash; this is von Mises-Fisher.</span>';
    if (!legal)
      msg += '<br><span style="color:' + P.mu + '"><b>2&beta; = ' + (2*b) + ' &ge; &kappa; = ' + k +
             '.</b> Past this point &mu; is no longer the peak and the level set stops cutting a ' +
             'single closed loop around the pole &mdash; the constraint 2&beta; &lt; &kappa; is what rules this out.</span>';
    else if (!rc.closed)
      msg += '<br><span style="color:' + P.mu + '">At this level the curve is not a single closed ' +
             'loop around the pole.</span>';
    el(ids.out).innerHTML = msg;
  }

  [sk, sb, sc].forEach(function (s) { s.addEventListener("input", build); });
  build();
};

/* ------------------------------------------------------------- bootstrap */
window.kentReady = function (fn) {
  function go() {
    if (!window.Plotly) {
      Array.prototype.forEach.call(document.querySelectorAll(".kplot"), function (e) {
        e.innerHTML = '<p style="color:' + P.mut + ';font-size:12px;text-align:center;' +
          'padding:2rem">The interactive version needs Plotly, which did not load. ' +
          'The figures above show the same thing.</p>';
      });
      return;
    }
    try { fn(); } catch (e) { if (window.console) console.warn(e); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
};
})();
