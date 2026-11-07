/* ---------------------------------------------------------------------------
   kent-interactive.js
   Interactive companions to the static R figures in kent-tutorial.qmd.
   These appear only in the HTML output; the PDF keeps the R figures.
   Palette and styling deliberately match the base-R figures so the two
   versions of a picture look like the same picture.
   Requires plotly.min.js to be loaded first.
--------------------------------------------------------------------------- */
(function () {
"use strict";

var P = {
  mu: "#EB6834", g2: "#2A78D6", g3: "#1BAF7A", bs: "#4A3AA7",
  ink: "#141412", ink2: "#4D4C48", mut: "#8A8883", rule: "#D8D7CE",
  sph: "#B9B7AB", sphb: "#E0DED5", dot: "#5A5955"
};
var FONT = { family: "Helvetica, Arial, sans-serif", size: 11, color: P.ink2 };
var CFG  = { displayModeBar: false, responsive: true, scrollZoom: false };

/* ----------------------------------------------------------- linear algebra */
function dot(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
function nrm(a) { return Math.sqrt(dot(a, a)); }
function unit(a) { var n = nrm(a) || 1; return [a[0]/n, a[1]/n, a[2]/n]; }
function comb3(s, a, t, b, r, c) {
  return [s*a[0] + t*b[0] + r*c[0], s*a[1] + t*b[1] + r*c[1], s*a[2] + t*b[2] + r*c[2]];
}
function householder(mu) {
  var h = [1 - mu[0], -mu[1], -mu[2]];
  var hh = h[0]*h[0] + h[1]*h[1] + h[2]*h[2];
  if (hh < 1e-12) return [[0,1,0], [0,0,1]];
  function col(j) {
    var e = [0,0,0]; e[j] = 1;
    var c = 2*h[j]/hh;
    return [e[0] - c*h[0], e[1] - c*h[1], e[2] - c*h[2]];
  }
  return [col(1), col(2)];
}
function eig2(S) {                       /* S = [[a,b],[b,c]], values descending */
  var a = S[0][0], b = S[0][1], c = S[1][1];
  var tr = a + c, det = a*c - b*b;
  var disc = Math.sqrt(Math.max(0, tr*tr/4 - det));
  var l1 = tr/2 + disc, l2 = tr/2 - disc, w1;
  if (Math.abs(b) > 1e-14) {
    var v = [b, l1 - a], n = Math.hypot(v[0], v[1]);
    w1 = [v[0]/n, v[1]/n];
  } else w1 = (a >= c) ? [1,0] : [0,1];
  return { l: [l1, l2], W: [w1, [-w1[1], w1[0]]] };
}
function rot2(t) { return [[Math.cos(t), -Math.sin(t)], [Math.sin(t), Math.cos(t)]]; }
function mm2(A, B) {
  return [[A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
          [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]];
}
function t2(A) { return [[A[0][0], A[1][0]], [A[0][1], A[1][1]]]; }
function fixSign(v) {
  var k = 0, j;
  for (j = 1; j < 3; j++) if (Math.abs(v[j]) > Math.abs(v[k])) k = j;
  return v[k] < 0 ? [-v[0], -v[1], -v[2]] : v.slice();
}

/* --------------------------------------------------- Kent density & sampling */
function rng32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
/* exact draws in the standard frame mu=e3, g2=e1, g3=e2, by cap rejection */
function rkentStd(n, kappa, beta, seed) {
  var rnd = rng32(seed || 1);
  var sd = 1 / Math.sqrt(Math.max(1e-6, kappa - 2*Math.abs(beta)));
  var cap = Math.min(Math.PI, 5*sd), cmin = Math.cos(cap);
  var out = [], guard = 0;
  while (out.length < n && guard < 600000) {
    guard++;
    var ct = cmin + (1 - cmin)*rnd();
    var st = Math.sqrt(Math.max(0, 1 - ct*ct));
    var ph = 2*Math.PI*rnd();
    var u = [st*Math.cos(ph), st*Math.sin(ph), ct];
    var lp = kappa*u[2] + beta*(u[0]*u[0] - u[1]*u[1]);
    if (Math.log(rnd() + 1e-300) < lp - kappa) out.push(u);
  }
  return out;
}
function toFrame(U, mu, g2, g3) {
  return U.map(function (u) { return comb3(u[2], mu, u[0], g2, u[1], g3); });
}

/* --------------------------------------------------------- Plotly furniture */
function baseLayout(extra) {
  var L = {
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 0, r: 0, t: 0, b: 0 }, showlegend: false, font: FONT
  };
  for (var k in (extra || {})) L[k] = extra[k];
  return L;
}
function scene(eye) {
  return {
    xaxis: { visible: false }, yaxis: { visible: false }, zaxis: { visible: false },
    aspectmode: "cube", bgcolor: "rgba(0,0,0,0)", dragmode: "orbit",
    camera: { eye: eye || { x: 1.5, y: 1.4, z: 1.0 }, up: { x: 0, y: 0, z: 1 } }
  };
}
function sphereTrace(octant, opacity) {
  var nu = 44, nv = 24, X = [], Y = [], Z = [], i, j;
  var thMax = octant ? Math.PI/2 : Math.PI, phMax = octant ? Math.PI/2 : 2*Math.PI;
  for (j = 0; j <= nv; j++) {
    var th = thMax*j/nv, xr = [], yr = [], zr = [];
    for (i = 0; i <= nu; i++) {
      var ph = phMax*i/nu;
      xr.push(Math.sin(th)*Math.cos(ph));
      yr.push(Math.sin(th)*Math.sin(ph));
      zr.push(Math.cos(th));
    }
    X.push(xr); Y.push(yr); Z.push(zr);
  }
  return {
    type: "surface", x: X, y: Y, z: Z, showscale: false,
    opacity: opacity === undefined ? 0.28 : opacity,
    colorscale: [[0, P.sphb], [1, P.sphb]],
    surfacecolor: Z.map(function (r) { return r.map(function () { return 0; }); }),
    hoverinfo: "skip",
    lighting: { ambient: 1, diffuse: 0, specular: 0 },
    contours: { x: { highlight: false }, y: { highlight: false }, z: { highlight: false } }
  };
}
function graticule(octant) {
  var xs = [], ys = [], zs = [], r = 1.004, k, i, t;
  function push(p) { xs.push(p[0]*r); ys.push(p[1]*r); zs.push(p[2]*r); }
  function brk() { xs.push(null); ys.push(null); zs.push(null); }
  var thMax = octant ? Math.PI/2 : Math.PI, phMax = octant ? Math.PI/2 : 2*Math.PI;
  var nm = octant ? 4 : 8;
  for (k = 0; k <= nm; k++) {
    if (!octant && k === nm) break;
    var ph = phMax*k/nm;
    for (i = 0; i <= 48; i++) {
      t = thMax*i/48;
      push([Math.sin(t)*Math.cos(ph), Math.sin(t)*Math.sin(ph), Math.cos(t)]);
    }
    brk();
  }
  var np = octant ? 4 : 8;
  for (k = octant ? 1 : 1; k < np; k++) {
    var th = thMax*k/np;
    for (i = 0; i <= 64; i++) {
      t = phMax*i/64;
      push([Math.sin(th)*Math.cos(t), Math.sin(th)*Math.sin(t), Math.cos(th)]);
    }
    brk();
  }
  return { type: "scatter3d", mode: "lines", x: xs, y: ys, z: zs,
           line: { color: P.sph, width: 1 }, hoverinfo: "skip" };
}
function seg(a, b, col, w, dash) {
  return { type: "scatter3d", mode: "lines", x: [a[0], b[0]], y: [a[1], b[1]],
           z: [a[2], b[2]], line: { color: col, width: w || 5, dash: dash || "solid" },
           hoverinfo: "skip" };
}
function tip(p, col, label) {
  return { type: "scatter3d", mode: "markers+text", x: [p[0]], y: [p[1]], z: [p[2]],
           marker: { size: 3, color: col }, text: [label], textposition: "middle right",
           textfont: { color: col, size: 13, family: FONT.family }, hoverinfo: "skip" };
}
function cloud(U, col, size, name) {
  return { type: "scatter3d", mode: "markers",
    x: U.map(function (u) { return u[0]*1.004; }),
    y: U.map(function (u) { return u[1]*1.004; }),
    z: U.map(function (u) { return u[2]*1.004; }),
    marker: { size: size || 2.6, color: col, opacity: 0.85 },
    hovertemplate: (name || "observation") + "<br>(%{x:.3f}, %{y:.3f}, %{z:.3f})<extra></extra>" };
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
           opacity: opacity === undefined ? 0.16 : opacity,
           colorscale: [[0, P.ink2], [1, P.ink2]], surfacecolor: [[0,0],[0,0]],
           hoverinfo: "skip", lighting: { ambient: 1, diffuse: 0, specular: 0 } };
}
/* the "looking straight down mu" contour panel */
function tangentTraces(kappa, beta, R, nSample, seed, showPts) {
  var N = 101, xs = [], z = [], i, j;
  for (i = 0; i < N; i++) xs.push(-R + 2*R*i/(N - 1));
  for (j = 0; j < N; j++) {
    var row = [];
    for (i = 0; i < N; i++) {
      var p = xs[i], q = xs[j], s = 1 - p*p - q*q;
      row.push(s <= 1e-9 ? null : Math.exp(kappa*Math.sqrt(s) + beta*(p*p - q*q) - kappa));
    }
    z.push(row);
  }
  var tr = [{ type: "contour", x: xs, y: xs, z: z,
    contours: { coloring: "lines", start: 0.1, end: 0.9, size: 0.2, showlabels: false },
    line: { color: P.ink2, width: 1.2 }, showscale: false,
    hovertemplate: "density / peak = %{z:.2f}<extra></extra>" }];
  if (showPts !== false && nSample > 0) {
    var S = rkentStd(nSample, kappa, beta, seed || 7);
    tr.unshift({ type: "scatter", mode: "markers",
      x: S.map(function (u) { return u[0]; }), y: S.map(function (u) { return u[1]; }),
      marker: { size: 4, color: P.dot, opacity: 0.45 },
      hovertemplate: "(%{x:.3f}, %{y:.3f})<extra></extra>" });
  }
  return tr;
}
function tangentLayout(R, axes) {
  var L = baseLayout({
    xaxis: { range: [-R, R], zeroline: false, showgrid: false, showticklabels: false,
             ticks: "", showline: true, linecolor: P.rule, mirror: true, constrain: "domain" },
    yaxis: { range: [-R, R], zeroline: false, showgrid: false, showticklabels: false,
             ticks: "", showline: true, linecolor: P.rule, mirror: true,
             scaleanchor: "x", scaleratio: 1 },
    margin: { l: 6, r: 6, t: 6, b: 6 }, annotations: []
  });
  if (axes) {
    var a = R*0.82;
    L.annotations.push(
      { x: a, y: 0, ax: 0, ay: 0, xref: "x", yref: "y", axref: "x", ayref: "y",
        showarrow: true, arrowhead: 3, arrowsize: 1, arrowwidth: 2, arrowcolor: P.g2 },
      { x: 0, y: a, ax: 0, ay: 0, xref: "x", yref: "y", axref: "x", ayref: "y",
        showarrow: true, arrowhead: 3, arrowsize: 1, arrowwidth: 2, arrowcolor: P.g3 },
      { x: a, y: 0, text: "&gamma;<sub>2</sub>", showarrow: false, xanchor: "left",
        yanchor: "top", font: { color: P.g2, size: 13 }, xshift: 3, yshift: -3 },
      { x: 0, y: a, text: "&gamma;<sub>3</sub>", showarrow: false, xanchor: "left",
        yanchor: "bottom", font: { color: P.g3, size: 13 }, xshift: 4 },
      { x: 0, y: 0, text: "&bull;", showarrow: false, font: { color: P.mu, size: 20 } },
      { x: 0, y: 0, text: "&mu;", showarrow: false, font: { color: P.mu, size: 13 },
        xshift: -11, yshift: -11 }
    );
  }
  return L;
}
function el(id) { return document.getElementById(id); }
/* keep whatever camera angle the reader has dragged the scene to, so that
   moving a slider never throws away their viewpoint */
function keepCam(gd, layout) {
  try {
    if (gd && gd.layout && gd.layout.scene && gd.layout.scene.camera && layout.scene)
      layout.scene.camera = gd.layout.scene.camera;
  } catch (e) { /* first draw: nothing to keep */ }
  return layout;
}
function draw(id, data, layout) {
  var e = el(id);
  if (e && window.Plotly) Plotly.react(e, data, keepCam(e, layout), CFG);
}
function fmt(x, d) { var v = Math.abs(x) < 5e-7 ? 0 : x; return v.toFixed(d === undefined ? 3 : d); }
function mbox(lab, rows, dec) {
  var nc = rows[0].length;
  return '<div class="kmbox"><span class="kmlab">' + lab +
    '</span><div class="kmgrid" style="grid-template-columns:repeat(' + nc + ',auto)">' +
    rows.map(function (r) {
      return r.map(function (v) { return "<span>" + fmt(v, dec) + "</span>"; }).join("");
    }).join("") + "</div></div>";
}

/* ========================================================================== */
/* Playground 1 -- a composition, its square root, and the sphere             */
/* ========================================================================== */
function playSimplex(ids) {
  var s1 = el(ids.s1), s2 = el(ids.s2), s3 = el(ids.s3);

  function update() {
    var raw = [+s1.value, +s2.value, +s3.value];
    var tot = raw[0] + raw[1] + raw[2];
    if (tot <= 0) { raw = [1, 1, 1]; tot = 3; }
    var z = raw.map(function (v) { return v/tot; });      /* normalise to a composition */
    var u = z.map(Math.sqrt);

    el(ids.out).innerHTML =
      '<span class="kz">z = (' + z.map(function (v) { return v.toFixed(3); }).join(", ") +
      ')</span>  &rarr;  <span class="ku">u = &radic;z = (' +
      u.map(function (v) { return v.toFixed(3); }).join(", ") + ')</span>' +
      '<br><span class="kchk">check: z sums to ' + (z[0]+z[1]+z[2]).toFixed(6) +
      ' &nbsp;and&nbsp; u has squared length ' + (u[0]*u[0]+u[1]*u[1]+u[2]*u[2]).toFixed(6) +
      '</span>';

    var d = [sphereTrace(true, 0.30), graticule(true),
      { type: "mesh3d", x: [1,0,0], y: [0,1,0], z: [0,0,1], i: [0], j: [1], k: [2],
        color: P.ink2, opacity: 0.13, hoverinfo: "skip", flatshading: true }];
    [0,1,2].forEach(function (i) {
      var e = [0,0,0]; e[i] = 1.2;
      d.push(seg([0,0,0], e, P.rule, 3));
    });
    d.push(seg(z, u, P.mu, 4, "dot"));
    d.push({ type: "scatter3d", mode: "markers", x: [z[0]], y: [z[1]], z: [z[2]],
      marker: { size: 5, color: P.ink2 },
      hovertemplate: "composition z<extra>on the flat simplex</extra>" });
    d.push({ type: "scatter3d", mode: "markers", x: [u[0]], y: [u[1]], z: [u[2]],
      marker: { size: 7, color: P.g2 },
      hovertemplate: "square root u<extra>on the sphere</extra>" });
    d.push(tip([u[0]*1.12, u[1]*1.12, u[2]*1.12], P.g2, "u"));
    d.push(tip([z[0]*0.96, z[1]*0.96, z[2]*0.96], P.ink2, "z"));

    draw(ids.plot, d, baseLayout({ scene: scene({ x: 1.45, y: 1.4, z: 1.15 }) }));
  }
  [s1, s2, s3].forEach(function (s) { s.addEventListener("input", update); });
  update();
}

/* ========================================================================== */
/* Playground 2 -- kappa and beta                                             */
/* ========================================================================== */
function playKappaBeta(ids) {
  var sk = el(ids.kap), sb = el(ids.bet);
  var first = true;

  function update() {
    var k = +sk.value, frac = +sb.value, b = frac*k/2;
    var l2 = 1/(k - 2*b), l3 = 1/(k + 2*b);
    el(ids.vk).textContent = k;
    el(ids.vb).textContent = frac.toFixed(2);
    el(ids.out).innerHTML =
      "&kappa; = <b>" + k + "</b> &nbsp; &beta; = <b>" + b.toFixed(1) + "</b> &nbsp;&nbsp; " +
      "&lambda;<sub>2</sub> = <b>" + l2.toFixed(4) + "</b> &nbsp; " +
      "&lambda;<sub>3</sub> = <b>" + l3.toFixed(5) + "</b> &nbsp;&nbsp; " +
      "semi-axis ratio = <b>" + Math.sqrt(l2/l3).toFixed(2) + "</b> &nbsp;&nbsp; " +
      "2&beta; &lt; &kappa; ? <b>" + (2*b < k ? "yes" : "no") + "</b>" +
      (b === 0 ? ' &nbsp; <span class="knote">&beta; = 0, so this is exactly von Mises-Fisher</span>' : "");

    var R = 0.92;
    draw(ids.flat, tangentTraces(k, b, R, 260, 44, true), tangentLayout(R, true));

    var S = toFrame(rkentStd(300, k, b, 45), [0,0,1], [1,0,0], [0,1,0]);
    if (first) {
      draw(ids.globe, [sphereTrace(false, 0.28), graticule(false), cloud(S, P.dot, 2.8),
                       seg([0,0,0], [0,0,1], P.mu, 4), tip([0,0,1.16], P.mu, "&mu;")],
           baseLayout({ scene: scene({ x: 0.8, y: 1.5, z: 1.35 }) }));
      first = false;
    } else if (window.Plotly && el(ids.globe)) {
      Plotly.restyle(el(ids.globe), {
        x: [S.map(function (u) { return u[0]*1.004; })],
        y: [S.map(function (u) { return u[1]*1.004; })],
        z: [S.map(function (u) { return u[2]*1.004; })]
      }, [2]);
    }
  }
  sk.addEventListener("input", update);
  sb.addEventListener("input", update);
  update();
}

/* ========================================================================== */
/* Playground 3 -- B, W and K: turn the rulers, the answer does not move      */
/* ========================================================================== */
function playBWK(ids) {
  var SL0 = [[0.03, 0.02], [0.02, 0.03]];
  var BB0 = [[0,1,0], [1,0,0]];            /* the Householder rulers for mu = (0,0,1) */
  var sl = el(ids.theta);

  /* a fixed sample from N(0, diag(0.05, 0.01)) rotated to 45 degrees */
  var rnd = rng32(55), pts = [], i;
  for (i = 0; i < 150; i++) {
    var u1 = Math.max(1e-9, rnd()), u2 = rnd();
    var r = Math.sqrt(-2*Math.log(u1));
    var a = r*Math.cos(2*Math.PI*u2)*Math.sqrt(0.05);
    var b = r*Math.sin(2*Math.PI*u2)*Math.sqrt(0.01);
    var c = Math.SQRT1_2;
    pts.push([a*c - b*c, a*c + b*c]);
  }

  function arrow(x1, y1, x2, y2, col, w, dash) {
    var ang = Math.atan2(y2 - y1, x2 - x1), L = 9;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + col + '" stroke-width="' + w + '"' +
      (dash ? ' stroke-dasharray="' + dash + '"' : "") + ' stroke-linecap="round"/>' +
      '<path d="M' + x2 + ',' + y2 +
      ' L' + (x2 - L*Math.cos(ang - 0.4)) + ',' + (y2 - L*Math.sin(ang - 0.4)) +
      ' L' + (x2 - L*Math.cos(ang + 0.4)) + ',' + (y2 - L*Math.sin(ang + 0.4)) +
      ' Z" fill="' + col + '"/>';
  }
  function bi(cx, cy, dx, dy, col, w, dash) {
    return arrow(cx, cy, cx + dx, cy + dy, col, w, dash) +
           arrow(cx, cy, cx - dx, cy - dy, col, w, dash);
  }
  function txt(x, y, s, col, size, anchor) {
    return '<text x="' + x + '" y="' + y + '" fill="' + col +
      '" font-family="' + FONT.family + '" font-size="' + size +
      '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>";
  }

  function update() {
    var th = (+sl.value)*Math.PI/180;
    el(ids.vt).textContent = sl.value + "°";

    var R = rot2(th);
    var b1 = comb3(R[0][0], BB0[0], R[1][0], BB0[1], 0, BB0[0]);
    var b2 = comb3(R[0][1], BB0[0], R[1][1], BB0[1], 0, BB0[0]);
    var SLt = mm2(t2(R), mm2(SL0, R));
    var E = eig2(SLt);
    var g2 = fixSign(comb3(E.W[0][0], b1, E.W[0][1], b2, 0, b1));
    var g3 = fixSign(comb3(E.W[1][0], b1, E.W[1][1], b2, 0, b1));

    /* screen mapping: x = component along e2, y = -component along e1 */
    function sv(v) { return [v[1], -v[0]]; }
    var cx = 330, cy = 165, SC = 520, L = 132;
    var d1 = sv(b1), d2 = sv(b2), a2 = sv(g2), a3 = sv(g3);
    var r2 = Math.sqrt(0.05)*SC, r3 = Math.sqrt(0.01)*SC;

    var s = txt(cx, 24, "LOOKING STRAIGHT DOWN THE μ AXIS", P.mut, 11);
    s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + r2.toFixed(1) +
         '" ry="' + r3.toFixed(1) + '" fill="none" stroke="' + P.ink2 +
         '" stroke-width="1.6" transform="rotate(-45 ' + cx + " " + cy + ')"/>';
    s += pts.map(function (p) {
      return '<circle cx="' + (cx + p[0]*SC).toFixed(1) + '" cy="' + (cy - p[1]*SC).toFixed(1) +
             '" r="2.1" fill="' + P.dot + '" fill-opacity="0.40"/>';
    }).join("");
    s += bi(cx, cy, d1[0]*L, d1[1]*L, P.bs, 1.8, "5 4");
    s += bi(cx, cy, d2[0]*L, d2[1]*L, P.bs, 1.8, "5 4");
    s += txt(cx + d1[0]*(L + 17), cy + d1[1]*(L + 17) + 4, "b₁", P.bs, 12);
    s += txt(cx + d2[0]*(L + 17), cy + d2[1]*(L + 17) + 4, "b₂", P.bs, 12);
    s += bi(cx, cy, a2[0]*r2, a2[1]*r2, P.g2, 2.6);
    s += bi(cx, cy, a3[0]*r3, a3[1]*r3, P.g3, 2.6);
    s += txt(cx + a2[0]*(r2 + 22), cy + a2[1]*(r2 + 22) + 4, "γ₂", P.g2, 13);
    s += txt(cx + a3[0]*(r3 + 26), cy + a3[1]*(r3 + 26) + 4, "γ₃", P.g3, 13);
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="4.5" fill="' + P.mu + '"/>';
    s += txt(cx, 318, "violet dashed = your rulers (they move)   —   " +
             "blue and green = the answer (it does not)", P.ink2, 11);
    el(ids.svg).innerHTML = '<svg viewBox="0 0 660 330" role="img" aria-label="' +
      'Rotating the tangent-plane basis changes B, S and W but not their product">' + s + "</svg>";

    el(ids.mats).innerHTML =
      mbox("R(&theta;) =", R) +
      mbox("B&#771; =", [[b1[0], b2[0]], [b1[1], b2[1]], [b1[2], b2[2]]]) +
      mbox("S&#771;<sub>L</sub> =", SLt, 4) +
      mbox("W&#771; =", t2(E.W)) +
      mbox("&lambda; =", [[E.l[0]], [E.l[1]]], 4) +
      mbox("B&#771;W&#771; =", [[g2[0], g3[0]], [g2[1], g3[1]], [g2[2], g3[2]]]);
  }
  sl.addEventListener("input", update);
  update();
}

/* ========================================================================== */
/* Playground 4 -- the fitted soil example, rotatable                         */
/* ========================================================================== */
function playFit(ids) {
  var F = window.KENTFIT;
  if (!F) return;
  var mu = F.mu, g2 = F.g2, g3 = F.g3, B = householder(mu);
  var mode = "data";

  function build() {
    var d = [sphereTrace(true, 0.30), graticule(true)];
    [0,1,2].forEach(function (i) {
      var e = [0,0,0]; e[i] = 1.16;
      d.push(seg([0,0,0], e, P.rule, 3));
    });
    d.push(planePatch(mu, B[0], B[1], 0.30, 0.16));
    if (mode === "kent" || mode === "vmf") {
      var k = (mode === "kent") ? F.kappa : F.kappa_vmf;
      var b = (mode === "kent") ? F.beta  : 0;
      d.push(cloud(toFrame(rkentStd(500, k, b, 77), mu, g2, g3), P.dot, 2.2,
                   mode === "kent" ? "Kent draw" : "vMF draw"));
    }
    d.push(cloud(F.U, P.g2, 5, "soil sample"));
    d.push(seg([0,0,0], mu, P.mu, 4));
    d.push(tip([mu[0]*1.14, mu[1]*1.14, mu[2]*1.14], P.mu, "&mu;&#770;"));
    var s2 = 3.0*Math.sqrt(F.lam2), s3 = 3.0*Math.sqrt(F.lam3);
    d.push(seg(comb3(1, mu, -s2, g2, 0, g2), comb3(1, mu, s2, g2, 0, g2), P.g2, 6));
    d.push(tip(comb3(1, mu, s2*1.25, g2, 0, g2), P.g2, "&gamma;&#770;&#8322;"));
    d.push(seg(comb3(1, mu, -s3, g3, 0, g3), comb3(1, mu, s3, g3, 0, g3), P.g3, 6));
    d.push(tip(comb3(1, mu, s3*3.0, g3, 0, g3), P.g3, "&gamma;&#770;&#8323;"));
    draw(ids.plot, d, baseLayout({ scene: scene({ x: 1.3, y: 1.05, z: 0.95 }) }));
  }
  ["data", "kent", "vmf"].forEach(function (m) {
    var btn = el(ids[m]);
    if (!btn) return;
    btn.addEventListener("click", function () {
      mode = m;
      ["data", "kent", "vmf"].forEach(function (x) {
        var b = el(ids[x]);
        if (b) b.setAttribute("aria-pressed", x === m ? "true" : "false");
      });
      build();
    });
  });
  build();
}

/* --------------------------------------------------------------- bootstrap */
window.KentPlay = {
  simplex: playSimplex, kappabeta: playKappaBeta, bwk: playBWK, fit: playFit
};
window.kentReady = function (fn) {
  function go() {
    if (!window.Plotly) {
      document.querySelectorAll(".kplot").forEach(function (e) {
        e.innerHTML = '<p style="color:' + P.mut + ';font-size:12px;text-align:center;' +
          'padding:2rem">The interactive version needs plotly.min.js, which did not load. ' +
          'The static figure above shows the same thing.</p>';
      });
      return;
    }
    try { fn(); } catch (e) { if (window.console) console.warn(e); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
};
})();
