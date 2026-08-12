// Customer portal — sanitert visning. Leser window.ARCH_DATA (data.js, public).
(function () {
  const D = window.ARCH_DATA;
  if (!D) { document.body.innerHTML = '<p style="padding:40px;color:#e74c3c">Mangler data.js — kjør build-scriptet.</p>'; return; }
  const el = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  document.getElementById("ver").textContent = D.version || "—";
  document.getElementById("gen").textContent = "Oppdatert " + (D.generated || "").slice(0, 16).replace("T", " ");

  // Prosjekter
  el("projects").innerHTML = (D.projects || []).map((p) => {
    const status = p.status === "live" ? "live" : "building";
    const url = p.url ? `<a href="${esc(p.url)}">↗</a>` : "";
    const score = p.health && p.health.total != null ? `${p.health.total}%` : "—";
    const w = p.health && p.health.total != null ? p.health.total : 0;
    return `<div class="project-row">
      <span class="dot ${status}"></span>
      <span class="p-name">${esc(p.name)}${url}</span>
      <span class="p-type">${esc(p.type)}</span>
      <span class="score-bar"><span class="score-fill" style="width:${w}%"></span></span>
      <span class="p-score">${score}</span>
    </div>`;
  }).join("") || '<p class="note">Ingen offentlige prosjekter.</p>';

  // Knowledge
  const kg = D.knowledge;
  if (kg) {
    const items = [["Failures", kg.failures], ["Patterns", kg.patterns], ["Lessons", kg.lessons],
                   ["Decisions", kg.decisions], ["Customers", kg.customers], ["Architectures", kg.architectures]];
    el("knowledge").innerHTML = items.map(([l, n]) => `<div class="k-cell"><div class="k-num">${n}</div><div class="k-label">${l}</div></div>`).join("");
    el("knowledge-src").textContent = "Aggregert kunnskapsbase — læring som arves til neste prosjekt.";
  } else {
    el("knowledge").innerHTML = '<p class="note">Ikke tilgjengelig.</p>';
  }

  // Security
  const sec = D.security || {};
  el("security").innerHTML = [["Secrets", sec.secrets], ["Policies", sec.policies], ["Audit", sec.audit]]
    .map(([k, v]) => `<div class="sec-row"><span>${k}</span><span class="sec-val">${esc(v)}</span></div>`).join("");

  // Agents
  el("agents").innerHTML = (D.agents || []).map((a) => {
    const cls = a.status === "observed" ? "observed" : a.status === "declared" ? "declared" : "unknown";
    const label = a.status === "observed" ? "Aktiv" : a.status === "declared" ? "Rolle" : "Ukjent";
    return `<div class="agent-row">
      <span class="a-name">${esc(a.name)}</span>
      <span class="a-role">${esc(a.role)}</span>
      <span class="badge ${cls}">${label}</span>
    </div>`;
  }).join("");
})();
