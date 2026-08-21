// Arch Control Center — INTERN visning (full provenance). Leser window.ARCH_DATA (data.js, internal).
(function () {
  const D = window.ARCH_DATA;
  if (!D) { document.body.innerHTML = '<p style="padding:40px;color:#e74c3c">Mangler data.js — kjør build-scriptet.</p>'; return; }
  const el = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const statusBadge = (s) => ({ observed: "obs", declared: "decl", unknown: "ukj", error: "feil" }[s] || s);

  document.getElementById("ver").textContent = D.version;
  document.getElementById("gen").textContent = (D.generated || "").slice(0, 16).replace("T", " ");

  // Prosjekter (full provenance)
  el("projects").innerHTML = D.projects.map((p) => {
    const h = p.health || {};
    const score = h.status === "observed" ? `${h.total}%` : h.status === "not_scored" ? "—" : "feil";
    const prov = (src, datum) => {
      if (!datum) return '<span class="prov prov-unknown">ikke hentet</span>';
      return `<span class="prov prov-${datum.status}">${esc(src)}: ${statusBadge(datum.status)}${datum.status === "observed" ? " · " + (datum.observed_at || "").slice(11, 16) : datum.reason ? " · " + esc(datum.reason) : ""}</span>`;
    };
    return `<div class="project-block">
      <div class="ph"><span class="p-name">${esc(p.name)}</span><span class="p-type">${esc(p.type)}</span>
        <span class="badge ${p.status}">${esc(p.status)}</span><span class="badge vis">${esc(p.visibility)}</span>
        <span class="p-score">${score}</span></div>
      <div class="p-meta">
        <span>repo: <code>${esc(p.repository)}</code></span>
        ${p.dev_path ? `<span class="devpath">dev: ${esc(p.dev_path)}</span>` : ""}
      </div>
      <div class="p-prov">
        ${prov("github", p.github)} ${prov("ci", p.ci)} ${prov("health", h.status === "observed" ? { status: "observed", observed_at: h.observed_at } : null)}
      </div>
    </div>`;
  }).join("");

  // Agents (ærlig status)
  el("agents").innerHTML = D.agents.map((a) => {
    const cls = a.status === "observed" ? "active" : a.status === "declared" ? "ready" : "research";
    const label = a.status === "observed" ? "Observert" : a.status === "declared" ? "Deklarert rolle" : "Ukjent";
    return `<div class="agent-row">
      <span class="a-name">${esc(a.name)}</span>
      <span class="a-role">${esc(a.role)}</span>
      <span class="a-src">${esc(a.source || "")}${a.reason ? " — " + esc(a.reason) : ""}</span>
      <span class="badge ${cls}">${label}</span>
    </div>`;
  }).join("");

  // Knowledge (med kilde + tidspunkt)
  const kg = D.knowledge;
  if (kg && kg.status === "observed") {
    const v = kg.value;
    el("knowledge").innerHTML = [["Failures", v.failures], ["Patterns", v.patterns], ["Lessons", v.lessons],
      ["Decisions", v.decisions], ["Customers", v.customers], ["Architectures", v.architectures]]
      .map(([l, n]) => `<div class="k-cell"><div class="k-num">${n}</div><div class="k-label">${l}</div></div>`).join("");
    el("knowledge-src").textContent = `Kilde: ${kg.source} · ${kg.observed_at}`;
  } else {
    el("knowledge").innerHTML = '<p class="note">Ikke observert.</p>';
  }

  // Security (med funn-tall + kilde)
  const sec = D.security || {};
  el("security").innerHTML = [["Secrets", sec.secrets], ["Policies", sec.policies], ["Audit", sec.audit]]
    .map(([k, v]) => `<div class="sec-row"><span>${k}</span><span class="sec-val">${esc(v)}</span></div>`).join("");
  el("security-src").textContent = sec.source || "";

  // Health breakdown med PASS/FAIL/UNKNOWN/NA
  const order = ["Governance", "Security", "Engineering", "Operations", "Documentation"];
  el("breakdown").innerHTML = D.projects.filter((p) => p.health && p.health.status === "observed").map((p) => {
    const cats = order.map((name) => {
      const c = (p.health.categories || {})[name];
      if (!c) return "";
      const pct = c.pct;
      const checks = (c.checks || []).map((ch) => `<li class="${ch.result.toLowerCase()}"><code>${esc(ch.id)}</code> ${ch.result} — ${esc(ch.evidence)}</li>`).join("");
      return `<details class="bd-cat"><summary><b>${name}</b> ${pct}% <span class="muted">(${c.pass}P/${c.fail}F/${c.unknown}U)</span></summary><ul>${checks}</ul></details>`;
    }).join("");
    return `<div class="breakdown-project"><div class="bd-head"><span class="bd-name">${esc(p.name)}</span><span class="bd-total">${p.health.total}%</span></div>${cats}</div>`;
  }).join("");
})();
