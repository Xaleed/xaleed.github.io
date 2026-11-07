/* ---------------------------------------------------------------------------
   kent-geometry-3d.js
   Interactive figures for "From a triangle to an ellipse".

   Every 3-D scene here can be rotated with the mouse and zoomed with the
   wheel. All numbers come from window.GEO, written by the R chunk that
   fits the model, so the pictures and the prose cannot disagree.

   Requires Plotly to be loaded first. Self-contained otherwise.
--------------------------------------------------------------------------- */
(function () {
"use strict";

var P = {
  mu: "#EB6834", g2: "#2A78D6", g3: "#1BAF7A", bs: "#4A3AA7",
  ink: "#141412", ink2: "#4D4C48", mut: "#8A8883", rule: "#D8D7CE",
  sph: "#B9B7AB", dot: "#5A5955"
};
var FONT = { family: "Helvetica, Arial, sans-serif", size: 11, color: P.ink2 };
var CFG  = { displayModeBar: false, responsive: true, scrollZoom: false };

function el(id) { return document.getElementById(id); }
function G() { return window.GEO; }

/* ------------------------------------------------------------- small algebra */
function dot(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
function comb3(s, a, t, b, r, c) {
  return [s*a[0] + t*b[0] + r*c[0], s*a[1] + t*b[1] + r*c[1], s*a[2] + t*b[2] + r*c[2]];
}
function scal(a, s) { return [a[0]*s, a[1]*s, a[2]*s]; }

/* --------------------------------------------------------------- scene chrome */
function layout3(eye, extra) {
  var L = {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 0, r: 0, t: 0, b: 0 }, showlegend: false, font: FONT,
    scene: {
      xaxis: { visible: false }, yaxis: { visible: false }, zaxis: { visible: false },
      aspectmode: "cube", bgcolor: "rgba(0,0,0,0)", dragmode: "orbit",
      camera: { eye: eye || { x: 1.35, y: 1.0, z: 0.85 }, up: { x: 0, y: 0, z: 1 } }
    }
  };
  for (var k in (extra || {})) L[k] = extra[k];
  return L;
}
function layout2(extra) {
  var L = {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 44, r: 12, t: 10, b: 40 }, showlegend: false, font: FONT
  };
  for (var k in (extra || {})) L[k] = extra[k];
  return L;
}
/* keep the angle the reader dragged to */
function react(gd, data, layout) {
  if (gd && gd.layout && gd.layout.scene && gd.layout.scene.camera && layout.scene)
    layout.scene.camera = gd.layout.scene.camera;
  Plotly.react(gd, data, layout, CFG);
}

function sphereSurf(octant, opacity, color) {
  var nu = 44, nv = 26, X = [], Y = [], Z = [], i, j;
  var thMax = octant ? Math.PI/2 : Math.PI, phMax = octant ? Math.PI/2 : 2*Math.PI;
  for (j = 0; j <= nv; j++) {
    var th = thMax*j/nv, xr = [], yr = [], zr = [];
    for (i = 0; i <= nu; i++) {
      var ph = phMax*i/nu;
      xr.push(Math.sin(th)*Math.cos(ph)); yr.push(Math.sin(th)*Math.sin(ph)); zr.push(Math.cos(th));
    }
    X.push(xr); Y.push(yr); Z.push(zr);
  }
  color = color || P.sph;
  return { type: "surface", x: X, y: Y, z: Z, showscale: false,
    opacity: opacity === undefined ? 0.20 : opacity,
    colorscale: [[0, color], [1, color]],
    surfacecolor: Z.map(function (r) { return r.map(function () { return 0; }); }),
    hoverinfo: "skip", lighting: { ambient: 1, diffuse: 0, specular: 0 },
    contours: { x: { highlight: false }, y: { highlight: false }, z: { highlight: false } } };
}
function graticule(octant) {
  var xs = [], ys = [], zs = [], r = 1.004, k, i;
  function push(p) { xs.push(p[0]*r); ys.push(p[1]*r); zs.push(p[2]*r); }
  function brk() { xs.push(null); ys.push(null); zs.push(null); }
  var thMax = octant ? Math.PI/2 : Math.PI, phMax = octant ? Math.PI/2 : 2*Math.PI;
  var nm = octant ? 4 : 8;
  for (k = 0; k <= nm; k++) {
    if (!octant && k === nm) break;
    var ph = phMax*k/nm;
    for (i = 0; i <= 48; i++) { var t = thMax*i/48;
      push([Math.sin(t)*Math.cos(ph), Math.sin(t)*Math.sin(ph), Math.cos(t)]); }
    brk();
  }
  for (k = 1; k < (octant ? 4 : 8); k++) {
    var th = thMax*k/(octant ? 4 : 8);
    for (i = 0; i <= 64; i++) { var p = phMax*i/64;
      push([Math.sin(th)*Math.cos(p), Math.sin(th)*Math.sin(p), Math.cos(th)]); }
    brk();
  }
  return { type: "scatter3d", mode: "lines", x: xs, y: ys, z: zs,
           line: { color: P.sph, width: 1 }, hoverinfo: "skip" };
}
function seg(a, b, col, w, dash) {
  return { type: "scatter3d", mode: "lines", x: [a[0], b[0]], y: [a[1], b[1]], z: [a[2], b[2]],
           line: { color: col, width: w || 5, dash: dash || "solid" }, hoverinfo: "skip" };
}
function tag(p, col, txt) {
  return { type: "scatter3d", mode: "markers+text", x: [p[0]], y: [p[1]], z: [p[2]],
           marker: { size: 3, color: col }, text: [txt], textposition: "middle right",
           textfont: { color: col, size: 13, family: FONT.family }, hoverinfo: "skip" };
}
function pts3(M, col, size, tmpl) {
  return { type: "scatter3d", mode: "markers",
    x: M.map(function (u) { return u[0]; }),
    y: M.map(function (u) { return u[1]; }),
    z: M.map(function (u) { return u[2]; }),
    marker: { size: size || 4, color: col, opacity: 0.95 },
    hovertemplate: tmpl || "(%{x:.3f}, %{y:.3f}, %{z:.3f})<extra></extra>" };
}
function planePatch(mu, b1, b2, r, opacity) {
  var X = [[], []], Y = [[], []], Z = [[], []];
  [-r, r].forEach(function (s, i) {
    [-r, r].forEach(function (t) {
      var p = comb3(1, mu, s, b1, t, b2);
      X[i].push(p[0]); Y[i].push(p[1]); Z[i].push(p[2]);
    });
  });
  return { type: "surface", x: X, y: Y, z: Z, showscale: false,
    opacity: opacity === undefined ? 0.17 : opacity,
    colorscale: [[0, P.ink2], [1, P.ink2]], surfacecolor: [[0,0],[0,0]],
    hoverinfo: "skip", lighting: { ambient: 1, diffuse: 0, specular: 0 } };
}
function axesAtMu(mu, g2, g3, L2, L3) {
  return [
    seg(mu, comb3(1, mu, L2, g2, 0, g2), P.g2, 6),
    tag(comb3(1, mu, L2*1.15, g2, 0, g2), P.g2, "&gamma;&#770;<sub>2</sub>"),
    seg(mu, comb3(1, mu, L3, g3, 0, g3), P.g3, 6),
    tag(comb3(1, mu, L3*1.6, g3, 0, g3), P.g3, "&gamma;&#770;<sub>3</sub>")
  ];
}

/* ------------------------------------------- Kent level set and its contour */
function levelZ(x, y, k, b, C) { return (C - b*(x*x - y*y)) / k; }
function levelFromFrac(k, frac) { return k + Math.log(frac); }

function levelSurf(k, b, C, rng, n, opacity) {
  rng = rng || 0.8; n = n || 40;
  var X = [], Y = [], Z = [], i, j;
  for (j = 0; j <= n; j++) {
    var yy = -rng + 2*rng*j/n, xr = [], yr = [], zr = [];
    for (i = 0; i <= n; i++) {
      var xx = -rng + 2*rng*i/n, zz = levelZ(xx, yy, k, b, C);
      xr.push(xx); yr.push(yy); zr.push(Math.abs(zz) > 1.25 ? null : zz);
    }
    X.push(xr); Y.push(yr); Z.push(zr);
  }
  return { type: "surface", x: X, y: Y, z: Z, showscale: false,
    opacity: opacity === undefined ? 0.38 : opacity,
    colorscale: [[0, P.bs], [1, P.bs]],
    surfacecolor: Z.map(function (r) { return r.map(function () { return 0; }); }),
    lighting: { ambient: 1, diffuse: 0, specular: 0 },
    contours: { x: { highlight: false }, y: { highlight: false }, z: { highlight: false } },
    hovertemplate: "level-set surface<br>z = %{z:.3f}<extra></extra>" };
}
/* exact intersection with the unit sphere: a quadratic in cos(theta) per azimuth */
function contour3d(k, b, C, nphi) {
  nphi = nphi || 721;
  var x = [], y = [], z = [], missing = 0, i;
  for (i = 0; i < nphi; i++) {
    var phi = 2*Math.PI*i/(nphi - 1), cc = Math.cos(2*phi);
    var A = -b*cc, B = k, D = b*cc - C, c = NaN;
    if (Math.abs(A) < 1e-10) { c = -D/B; }
    else {
      var disc = B*B - 4*A*D;
      if (disc >= 0) {
        var ok = [(-B + Math.sqrt(disc))/(2*A), (-B - Math.sqrt(disc))/(2*A)]
                 .filter(function (v) { return isFinite(v) && v >= -1 && v <= 1; });
        if (ok.length) c = Math.max.apply(null, ok);
      }
    }
    if (!isFinite(c) || Math.abs(c) > 1) { missing++; x.push(null); y.push(null); z.push(null); continue; }
    var st = Math.sqrt(Math.max(0, 1 - c*c));
    x.push(st*Math.cos(phi)*1.004); y.push(st*Math.sin(phi)*1.004); z.push(c*1.004);
  }
  return { x: x, y: y, z: z, closed: missing === 0 };
}
function contourTrace(cu, col, w) {
  return { type: "scatter3d", mode: "lines", x: cu.x, y: cu.y, z: cu.z,
           line: { color: col || P.ink, width: w || 7 },
           hovertemplate: "the contour<br>(%{x:.3f}, %{y:.3f}, %{z:.3f})<extra></extra>" };
}
function reach(k, b, C) {
  var cu = contour3d(k, b, C, 1441), ax = 0, ay = 0, i;
  for (i = 0; i < cu.x.length; i++) {
    if (cu.x[i] === null) continue;
    ax = Math.max(ax, Math.abs(cu.x[i])); ay = Math.max(ay, Math.abs(cu.y[i]));
  }
  return { x: ax/1.004, y: ay/1.004, closed: cu.closed };
}

/* ------------------------------------------------- tangent-plane 2-D panels */
function tangentContour(k, b, R, n) {
  n = n || 101;
  var xs = [], z = [], i, j;
  for (i = 0; i < n; i++) xs.push(-R + 2*R*i/(n - 1));
  for (j = 0; j < n; j++) {
    var row = [];
    for (i = 0; i < n; i++) {
      var p = xs[i], q = xs[j], s = 1 - p*p - q*q;
      row.push(s <= 1e-9 ? null : Math.exp(k*Math.sqrt(s) + b*(p*p - q*q) - k));
    }
    z.push(row);
  }
  return { type: "contour", x: xs, y: xs, z: z,
    contours: { coloring: "lines", start: 0.1, end: 0.9, size: 0.2, showlabels: false },
    line: { color: P.ink2, width: 1.3 }, showscale: false,
    hovertemplate: "density / peak = %{z:.2f}<extra></extra>" };
}
function squareAxes(R) {
  return {
    xaxis: { range: [-R, R], zeroline: false, showgrid: false, showticklabels: true,
             tickfont: { size: 9, color: P.mut }, showline: true, linecolor: P.rule,
             mirror: true, constrain: "domain" },
    yaxis: { range: [-R, R], zeroline: false, showgrid: false, showticklabels: true,
             tickfont: { size: 9, color: P.mut }, showline: true, linecolor: P.rule,
             mirror: true, scaleanchor: "x", scaleratio: 1 }
  };
}
function axisArrows(a2, a3, R) {
  var ann = [];
  ann.push({ x: a2, y: 0, ax: 0, ay: 0, xref: "x", yref: "y", axref: "x", ayref: "y",
             showarrow: true, arrowhead: 3, arrowwidth: 2, arrowcolor: P.g2 });
  ann.push({ x: 0, y: a3, ax: 0, ay: 0, xref: "x", yref: "y", axref: "x", ayref: "y",
             showarrow: true, arrowhead: 3, arrowwidth: 2, arrowcolor: P.g3 });
  ann.push({ x: Math.max(a2, 0.34*R), y: 0, text: "&gamma;&#770;<sub>2</sub>", showarrow: false,
             font: { color: P.g2, size: 13 }, yshift: -12 });
  ann.push({ x: 0, y: Math.max(a3, 0.34*R), text: "&gamma;&#770;<sub>3</sub>", showarrow: false,
             font: { color: P.g3, size: 13 }, xshift: 14 });
  ann.push({ x: 0, y: 0, text: "&bull;", showarrow: false, font: { color: P.mu, size: 20 } });
  ann.push({ x: 0, y: 0, text: "&mu;&#770;", showarrow: false, font: { color: P.mu, size: 12 },
             xshift: -14, yshift: -12 });
  return ann;
}

/* =========================================================================== */
/*  the figures                                                                */
/* =========================================================================== */
var F = {};

/* Step 1 -- the simplex, as a ternary diagram */
F.simplex = function (id) {
  var g = G();
  var tern = function (Z, col, size, sym, name) {
    return { type: "scatterternary", mode: "markers",
      a: Z.map(function (z) { return z[0]; }),
      b: Z.map(function (z) { return z[1]; }),
      c: Z.map(function (z) { return z[2]; }),
      marker: { size: size, color: col, symbol: sym || "circle",
                line: sym ? { color: col, width: 2 } : undefined },
      hovertemplate: "sand %{a:.3f}<br>silt %{b:.3f}<br>clay %{c:.3f}<extra>" + (name||"") + "</extra>" };
  };
  var mean = [[g.mu[0]*g.mu[0], g.mu[1]*g.mu[1], g.mu[2]*g.mu[2]]];
  Plotly.react(el(id), [tern(g.Z, P.g2, 7, null, "soil sample"),
                        tern(mean, P.mu, 13, "x-thin", "the average")],
    layout2({ margin: { l: 40, r: 40, t: 20, b: 30 },
      ternary: { sum: 1, bgcolor: "rgba(0,0,0,0)",
        aaxis: { title: { text: "sand", font: { size: 11, color: P.ink2 } },
                 linecolor: P.rule, gridcolor: P.rule, tickfont: { size: 9, color: P.mut } },
        baxis: { title: { text: "silt", font: { size: 11, color: P.ink2 } },
                 linecolor: P.rule, gridcolor: P.rule, tickfont: { size: 9, color: P.mut } },
        caxis: { title: { text: "clay", font: { size: 11, color: P.ink2 } },
                 linecolor: P.rule, gridcolor: P.rule, tickfont: { size: 9, color: P.mut } } } }), CFG);
};

/* Step 2 -- the square root lifting the triangle onto the sphere */
F.lift = function (id) {
  var g = G(), d = [sphereSurf(true, 0.18), graticule(true)];
  d.push({ type: "mesh3d", x: [1,0,0], y: [0,1,0], z: [0,0,1], i: [0], j: [1], k: [2],
           color: P.ink2, opacity: 0.16, hoverinfo: "skip", flatshading: true });
  [0,1,2].forEach(function (i) { var e = [0,0,0]; e[i] = 1.2; d.push(seg([0,0,0], e, P.rule, 3)); });
  for (var i = 0; i < g.Z.length; i += 3) {
    d.push(seg(g.Z[i], g.U[i], P.mu, 3, "dot"));
  }
  var Zs = g.Z.filter(function (_, i) { return i % 3 === 0; });
  var Us = g.U.filter(function (_, i) { return i % 3 === 0; });
  d.push(pts3(Zs, P.ink2, 4, "composition z<br>(%{x:.3f}, %{y:.3f}, %{z:.3f})<extra>on the flat triangle</extra>"));
  d.push(pts3(Us, P.g2, 6, "square root u<br>(%{x:.3f}, %{y:.3f}, %{z:.3f})<extra>on the sphere</extra>"));
  react(el(id), d, layout3({ x: 1.5, y: 1.35, z: 1.0 }));
};

/* Step 3 -- the data on the sphere */
F.onSphere = function (id) {
  var g = G(), d = [sphereSurf(true, 0.20), graticule(true)];
  [0,1,2].forEach(function (i) { var e = [0,0,0]; e[i] = 1.18; d.push(seg([0,0,0], e, P.rule, 3)); });
  d.push(pts3(g.U, P.g2, 5, "sample<br>(%{x:.3f}, %{y:.3f}, %{z:.3f})<extra>on the sphere</extra>"));
  react(el(id), d, layout3({ x: 1.45, y: 1.1, z: 0.95 }));
};

/* Step 4 -- the mean direction and the tangent plane */
F.plane = function (id) {
  var g = G(), d = [sphereSurf(true, 0.18), graticule(true)];
  [0,1,2].forEach(function (i) { var e = [0,0,0]; e[i] = 1.18; d.push(seg([0,0,0], e, P.rule, 3)); });
  d.push(planePatch(g.mu, g.b1, g.b2, 0.34));
  d.push(pts3(g.U, P.g2, 5, "sample<extra></extra>"));
  d.push(seg([0,0,0], scal(g.mu, 1.18), P.mu, 7));
  d.push(tag(scal(g.mu, 1.24), P.mu, "&mu;&#770;"));
  react(el(id), d, layout3({ x: 1.4, y: 1.05, z: 0.95 }));
};

/* Step 5 -- dropping each point onto the plane */
F.project = function (id3, id2) {
  var g = G(), d = [sphereSurf(true, 0.16), graticule(true)];
  d.push(planePatch(g.mu, g.b1, g.b2, 0.30));
  var feet = [];
  g.U.forEach(function (u) {
    var t = dot(g.mu, u);
    var foot = [g.mu[0] + u[0] - t*g.mu[0], g.mu[1] + u[1] - t*g.mu[1], g.mu[2] + u[2] - t*g.mu[2]];
    feet.push(foot);
    d.push(seg(u, foot, P.mu, 2));
  });
  d.push(pts3(feet, P.ink2, 3, "shadow on the plane<extra></extra>"));
  d.push(pts3(g.U, P.g2, 5, "sample on the sphere<extra></extra>"));
  d.push(seg(scal(g.mu, 0.78), scal(g.mu, 1.12), P.mu, 6));
  d.push(tag(scal(g.mu, 1.16), P.mu, "&mu;&#770;"));
  react(el(id3), d, layout3({ x: 1.0, y: 1.5, z: 0.75 }));

  if (!el(id2)) return;
  var R = 3.4*Math.sqrt(g.lam2);
  var v2 = g.U.map(function (u) { return dot(g.g2, u); });
  var v3 = g.U.map(function (u) { return dot(g.g3, u); });
  var lay = layout2(squareAxes(R));
  lay.annotations = axisArrows(2*Math.sqrt(g.lam2), 2*Math.sqrt(g.lam3), R);
  lay.xaxis.title = { text: "v₂  (along γ̂₂)", font: { size: 11, color: P.ink2 } };
  lay.yaxis.title = { text: "v₃  (along γ̂₃)", font: { size: 11, color: P.ink2 } };
  lay.margin = { l: 52, r: 14, t: 12, b: 44 };
  Plotly.react(el(id2), [{ type: "scatter", mode: "markers", x: v2, y: v3,
    marker: { size: 7, color: P.g2 },
    hovertemplate: "v₂ %{x:.4f}<br>v₃ %{y:.4f}<extra>soil sample</extra>" }], lay, CFG);
};

/* Steps 6 and 7 -- vMF and Kent on the tangent plane */
F.tangentFit = function (id, which) {
  var g = G();
  var k = which === "vmf" ? g.kappaVMF : g.kappa;
  var b = which === "vmf" ? 0 : g.beta;
  var R = 3.4*Math.sqrt(g.lam2);
  var v2 = g.U.map(function (u) { return dot(g.g2, u); });
  var v3 = g.U.map(function (u) { return dot(g.g3, u); });
  var a2 = which === "vmf" ? 2*Math.sqrt(1/k) : 2*Math.sqrt(g.lam2);
  var a3 = which === "vmf" ? 2*Math.sqrt(1/k) : 2*Math.sqrt(g.lam3);
  var lay = layout2(squareAxes(R));
  lay.annotations = axisArrows(a2, a3, R);
  Plotly.react(el(id), [tangentContour(k, b, R),
    { type: "scatter", mode: "markers", x: v2, y: v3, marker: { size: 7, color: P.g2 },
      hovertemplate: "v₂ %{x:.4f}<br>v₃ %{y:.4f}<extra>soil sample</extra>" }], lay, CFG);
};

/* the spread-by-direction curve that goes beside them */
F.spread = function (id, withKent) {
  var g = G(), ang = [], sdv = [], sdk = [], i;
  for (i = 0; i <= 180; i++) {
    var a = 2*Math.PI*i/180;
    ang.push(a*180/Math.PI);
    sdv.push(Math.sqrt(1/g.kappaVMF));
    sdk.push(Math.sqrt(g.lam2*Math.cos(a)*Math.cos(a) + g.lam3*Math.sin(a)*Math.sin(a)));
  }
  var tr = [{ type: "scatter", mode: "lines", x: ang, y: sdv,
      line: { color: withKent ? P.mut : P.g3, width: withKent ? 2 : 3, dash: withKent ? "dash" : "solid" },
      hovertemplate: "vMF: %{y:.4f}<extra></extra>" }];
  if (withKent) tr.push({ type: "scatter", mode: "lines", x: ang, y: sdk,
      line: { color: P.g2, width: 3 }, hovertemplate: "Kent: %{y:.4f}<extra></extra>" });
  var lay = layout2({
    xaxis: { range: [0, 360], tickvals: [0, 90, 180, 270, 360], showgrid: false,
             showline: true, linecolor: P.rule, tickfont: { size: 9, color: P.mut },
             title: { text: "direction around the plane (degrees)", font: { size: 11, color: P.ink2 } } },
    yaxis: { range: [0, 1.25*Math.sqrt(g.lam2)], showgrid: false, showline: true,
             linecolor: P.rule, tickfont: { size: 9, color: P.mut },
             title: { text: "standard deviation", font: { size: 11, color: P.ink2 } } },
    margin: { l: 56, r: 14, t: 12, b: 46 } });
  Plotly.react(el(id), tr, lay, CFG);
};

/* Step 8 -- the three objects, with toggles */
F.mechanism = function (ids) {
  var g = G(), KA = 50, BE = 18, CC = levelFromFrac(KA, 0.10);
  var show = { sphere: true, surface: true, curve: true };
  function build() {
    var d = [];
    if (show.sphere) { d.push(sphereSurf(false, 0.16)); d.push(graticule(false)); }
    if (show.surface) d.push(levelSurf(KA, BE, CC, 0.8, 40, 0.42));
    if (show.curve) d.push(contourTrace(contour3d(KA, BE, CC)));
    d.push(seg([0,0,0], [0,0,1.25], P.mu, 6));
    d.push(tag([0,0,1.30], P.mu, "&mu;"));
    d.push(seg([0,0,1], [0.78,0,1], P.g2, 5));
    d.push(tag([0.83,0,1], P.g2, "x = &gamma;<sub>2</sub>"));
    d.push(seg([0,0,1], [0,0.78,1], P.g3, 5));
    d.push(tag([0,0.83,1], P.g3, "y = &gamma;<sub>3</sub>"));
    react(el(ids.plot), d, layout3({ x: 1.35, y: 0.95, z: 0.8 }));
  }
  ["sphere", "surface", "curve"].forEach(function (key) {
    var btn = el(ids[key]); if (!btn) return;
    btn.addEventListener("click", function () {
      show[key] = !show[key];
      btn.setAttribute("aria-pressed", show[key] ? "true" : "false");
      build();
    });
  });
  build();
};

/* Step 8 -- the beta switch, as one scene with a slider */
F.betaSwitch = function (ids) {
  var KA = 50, CC = levelFromFrac(KA, 0.10);
  var sb = el(ids.beta);
  function build() {
    var b = +sb.value;
    el(ids.vb).textContent = b;
    var d = [sphereSurf(false, 0.16), graticule(false),
             levelSurf(KA, b, CC, 0.78, 40, 0.42)];
    if (b > 0) d.push(contourTrace(contour3d(KA, 0, CC), P.mut, 3));  /* the circle, faint */
    d.push(contourTrace(contour3d(KA, b, CC)));
    d.push(seg([0,0,0], [0,0,1.22], P.mu, 6));
    d.push(tag([0,0,1.27], P.mu, "&mu;"));
    d.push(seg([0,0,1], [0.76,0,1], P.g2, 5));
    d.push(tag([0.81,0,1], P.g2, "x = &gamma;<sub>2</sub>"));
    d.push(seg([0,0,1], [0,0.76,1], P.g3, 5));
    d.push(tag([0,0.81,1], P.g3, "y = &gamma;<sub>3</sub>"));
    react(el(ids.plot), d, layout3({ x: 1.3, y: 0.95, z: 0.72 }));
    var rc = reach(KA, b, CC);
    el(ids.out).innerHTML = (b === 0
      ? '<span style="color:' + P.g3 + '">&beta; = 0: the surface is a flat plane and the contour is a circle of radius ' +
        rc.x.toFixed(3) + ' &mdash; von Mises-Fisher.</span>'
      : "reaches <b>" + rc.x.toFixed(3) + "</b> along &gamma;<sub>2</sub> and <b>" +
        rc.y.toFixed(3) + "</b> along &gamma;<sub>3</sub> &nbsp;(ratio <b>" +
        (rc.x/rc.y).toFixed(2) + "</b>)");
  }
  sb.addEventListener("input", build);
  build();
};

/* Step 8 -- the exact curve and its elliptical shadow */
F.exactVsEllipse = function (id3, id2) {
  var KA = 50, BE = 18;
  var tight = contour3d(KA, BE, levelFromFrac(KA, 0.10));
  var wide  = contour3d(KA, BE, levelFromFrac(KA, 0.01));
  var d = [sphereSurf(false, 0.16), graticule(false),
           planePatch([0,0,1], [1,0,0], [0,1,0], 0.65, 0.14),
           contourTrace(tight)];
  d.push(seg([0,0,0], [0,0,1.28], P.mu, 6));
  d.push(tag([0,0,1.33], P.mu, "&mu;"));
  d.push(seg([0,0,1], [0.62,0,1], P.g2, 5));
  d.push(tag([0.67,0,1], P.g2, "&gamma;<sub>2</sub>"));
  d.push(seg([0,0,1], [0,0.62,1], P.g3, 5));
  d.push(tag([0,0.67,1], P.g3, "&gamma;<sub>3</sub>"));
  react(el(id3), d, layout3({ x: 1.1, y: 0.8, z: 1.05 }));

  if (!el(id2)) return;
  function ell(cu) {
    var a = 0, b = 0, i;
    for (i = 0; i < cu.x.length; i++) { if (cu.x[i] === null) continue;
      a = Math.max(a, Math.abs(cu.x[i])); b = Math.max(b, Math.abs(cu.y[i])); }
    var ex = [], ey = [];
    for (i = 0; i <= 200; i++) { var t = 2*Math.PI*i/200;
      ex.push(a*Math.cos(t)); ey.push(b*Math.sin(t)); }
    return { x: ex, y: ey, a: a, b: b };
  }
  var e1 = ell(tight), e2 = ell(wide), R = 0.78;
  var tr = [
    { type: "scatter", mode: "lines", x: wide.x, y: wide.y,
      line: { color: P.ink, width: 2 }, opacity: 0.55,
      hovertemplate: "exact, 1% of peak<extra></extra>" },
    { type: "scatter", mode: "lines", x: e2.x, y: e2.y,
      line: { color: P.g2, width: 2, dash: "dash" }, hovertemplate: "ellipse<extra></extra>" },
    { type: "scatter", mode: "lines", x: tight.x, y: tight.y,
      line: { color: P.ink, width: 3.5 }, hovertemplate: "exact, 10% of peak<extra></extra>" },
    { type: "scatter", mode: "lines", x: e1.x, y: e1.y,
      line: { color: P.g2, width: 2, dash: "dash" }, hovertemplate: "ellipse<extra></extra>" }
  ];
  var lay = layout2(squareAxes(R));
  Plotly.react(el(id2), tr, lay, CFG);
};

/* Step 8 -- the full slider panel */
F.levelSet = function (ids) {
  var sk = el(ids.kap), sb = el(ids.bet), sc = el(ids.lev), gd = el(ids.plot);
  if (!sk || !sb || !sc || !gd) return;
  function build() {
    var k = +sk.value, b = +sb.value, frac = +sc.value, C = levelFromFrac(k, frac);
    el(ids.vk).textContent = k; el(ids.vb).textContent = b; el(ids.vc).textContent = frac.toFixed(2);
    var cu = contour3d(k, b, C), rc = reach(k, b, C);
    var d = [sphereSurf(false, 0.18), graticule(false), levelSurf(k, b, C), contourTrace(cu)];
    d.push(seg([0,0,0], [0,0,1.25], P.mu, 6));
    d.push(tag([0,0,1.30], P.mu, "&mu;"));
    d.push(seg([0,0,1], [0.75,0,1], P.g2, 5));
    d.push(tag([0.80,0,1], P.g2, "x = &gamma;<sub>2</sub>"));
    d.push(seg([0,0,1], [0,0.75,1], P.g3, 5));
    d.push(tag([0,0.80,1], P.g3, "y = &gamma;<sub>3</sub>"));
    react(gd, d, layout3({ x: 1.35, y: 0.95, z: 0.80 }));

    var msg = "level set: &nbsp;<b>z = (" + C.toFixed(2) + " &minus; " + b +
      "(x&sup2; &minus; y&sup2;)) / " + k + "</b> &nbsp;·&nbsp; C = <b>" + C.toFixed(3) + "</b><br>" +
      "reaches <b>" + rc.x.toFixed(3) + "</b> along &gamma;<sub>2</sub> and <b>" +
      rc.y.toFixed(3) + "</b> along &gamma;<sub>3</sub>" +
      (rc.y > 1e-6 ? " &nbsp;(ratio <b>" + (rc.x/rc.y).toFixed(2) + "</b>)" : "");
    if (b === 0) msg += '<br><span style="color:' + P.g3 +
      '">&beta; = 0: a flat plane, and the contour is a circle &mdash; von Mises-Fisher.</span>';
    if (2*b >= k) msg += '<br><span style="color:' + P.mu + '"><b>2&beta; = ' + (2*b) +
      ' &ge; &kappa; = ' + k + '.</b> &mu; is no longer the peak and the level set stops cutting a ' +
      'single closed loop around the pole &mdash; this is what 2&beta; &lt; &kappa; rules out.</span>';
    else if (!rc.closed) msg += '<br><span style="color:' + P.mu +
      '">At this level the curve is not a single closed loop around the pole.</span>';
    el(ids.out).innerHTML = msg;
  }
  [sk, sb, sc].forEach(function (s) { s.addEventListener("input", build); });
  build();
};

window.KentGeo = F;

/* ------------------------------------------------------------- bootstrap */
window.kentReady = function (fn) {
  function go() {
    if (!window.Plotly || !window.GEO) {
      Array.prototype.forEach.call(document.querySelectorAll(".kplot"), function (e) {
        e.innerHTML = '<p style="color:' + P.mut + ';font-size:12px;text-align:center;' +
          'padding:2rem">This figure needs Plotly, which did not load.</p>';
      });
      return;
    }
    try { fn(); } catch (e) { if (window.console) console.warn(e); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
};
})();
