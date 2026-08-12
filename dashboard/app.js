// Arch Control Center — renderer. Leser window.ARCH_DATA (data.js, generert).
(function () {
  const D = window.ARCH_DATA;
  if (!D) { document.body.innerHTML = '<p style="padding:40px;color:#e74c3c">Mangler data.js — kjør: node project-factory/collect-dashboard-data.mjs</p>'; return; }

  const el = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  document.getElementById("ver").textContent = D.version;
  document.getElementById("cert-ver").textContent = D.version;
  document.getElementById("gen").textContent = (D.generated || "").slice(0, 16).replace("T", " ");

  // Projects
  el("projects").innerHTML = D.projects.map((p) => {
    const status = p.status === "live" ? "live" : "building";
    const url = p.url ? `<a href="${p.url}" style="color:var(--accent);text-decoration:none;font-size:12px">↗</a>` : "";
    return `<div class="project-row">
      <span class="dot ${status}"></span>
      <span class="p-name">${esc(p.name)} ${url}</span>
      <span class="p-type">${esc(p.type)}</span>
      <span class="score-bar"><span class="score-fill" style="width:${p.total}%"></span></span>
      <span class="p-score">${p.total}%</span>
    </div>`;
  }).join("");

  // Agents
  el("agents").innerHTML = D.agents.map((a) => {
    const cls = a.status.toLowerCase();
    return `<div class="agent-row">
      <span class="a-name">${esc(a.name)}</span>
      <span class="a-role">${esc(a.role)}</span>
      <span class="badge ${cls}">${esc(a.status)}</span>
    </div>`;
  }).join("");

  // Knowledge
  const kg = D.knowledge;
  const kgItems = [["Failures", kg.failures], ["Patterns", kg.patterns], ["Lessons", kg.lessons],
                   ["Decisions", kg.decisions], ["Customers", kg.customers], ["Architectures", kg.architectures]];
  el("knowledge").innerHTML = kgItems.map(([label, num]) =>
    `<div class="k-cell"><div class="k-num">${num}</div><div class="k-label">${label}</div></div>`
  ).join("");

  // Security
  const sec = D.security;
  const secItems = [
    ["Secrets", sec.secrets, sec.secrets === "OK"],
    ["Policies", sec.policies, sec.policies === "OK"],
    ["Audit", sec.audit, sec.audit === "OK"],
  ];
  el("security").innerHTML = secItems.map(([k, v, ok]) =>
    `<div class="sec-row"><span class="sec-key">${k}</span><span class="sec-val ${ok ? "" : "warn"}">${v}</span></div>`
  ).join("");

  // Score breakdown
  const order = ["Governance", "Security", "Engineering", "Operations", "Documentation"];
  el("breakdown").innerHTML = D.projects.map((p) => {
    const cats = order.map((name) => {
      const c = (p.categories || {})[name];
      const pct = c ? c.pct : 0;
      return `<div class="bd-cat">
        <div class="bd-cat-label">${name}</div>
        <div class="bd-cat-bar"><div class="bd-cat-fill" style="width:${pct}%"></div></div>
        <div class="bd-cat-pct">${pct}%</div>
      </div>`;
    }).join("");
    return `<div class="breakdown-project">
      <div class="bd-head"><span class="bd-name">${esc(p.name)}</span><span class="bd-total">${p.total}%</span></div>
      <div class="bd-cats">${cats}</div>
    </div>`;
  }).join("");
})();
