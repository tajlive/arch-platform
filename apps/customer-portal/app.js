// Customer portal — sanitert visning. Leser window.ARCH_DATA (data.js, public).
// Alle seksjoner er null-sikre: ulike sider har ulike elementer (#ver, #gen,
// #projects, #knowledge, #security, #agents). Uten guard krasjer scriptet på
// det første manglende elementet og nedstrøms seksjoner fylles aldri ut.
(function () {
  const D = window.ARCH_DATA;
  if (!D) { document.body.innerHTML = '<p style="padding:40px;color:#e74c3c">Mangler data.js — kjør build-scriptet.</p>'; return; }
  const esc = (s) => String(s ?? "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Kun oppdater elementet hvis det finnes på siden.
  const setHTML = (id, html) => { const e = document.getElementById(id); if (e) e.innerHTML = html; };
  const setText = (id, text) => { const e = document.getElementById(id); if (e) e.textContent = text; };

  setText("ver", D.version || "—");
  setText("gen", "Oppdatert " + (D.generated || "").slice(0, 16).replace("T", " "));

  // Prosjekter
  setHTML("projects", (D.projects || []).map((p) => {
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
  }).join("") || '<p class="note">Ingen offentlige prosjekter.</p>');

  // Knowledge
  const kg = D.knowledge;
  if (kg) {
    const items = [["Feil", kg.failures], ["Mønstre", kg.patterns], ["Læringer", kg.lessons],
                   ["Beslutninger", kg.decisions], ["Kunder", kg.customers], ["Arkitekturer", kg.architectures]];
    setHTML("knowledge", items.map(([l, n]) => `<div class="k-cell"><div class="k-num">${n}</div><div class="k-label">${l}</div></div>`).join(""));
    setText("knowledge-src", "Aggregert kunnskapsbase — læring som arves til neste prosjekt.");
  } else {
    setHTML("knowledge", '<p class="note">Ikke tilgjengelig.</p>');
  }

  // Security
  const sec = D.security || {};
  setHTML("security", [["Hemmeligheter", sec.secrets], ["Regler", sec.policies], ["Revisjon", sec.audit]]
    .map(([k, v]) => `<div class="sec-row"><span>${k}</span><span class="sec-val">${esc(v)}</span></div>`).join(""));

  // Agents
  setHTML("agents", (D.agents || []).map((a) => {
    const cls = a.status === "observed" ? "observed" : a.status === "declared" ? "declared" : "unknown";
    const roleLabels = {
      "Chief Architect + Ops": "Hovedarkitekt og drift",
      "Senior Developer": "Seniorutvikler",
      "Research Analyst": "Forskningsanalytiker"
    };
    const label = a.status === "observed" ? "Aktiv" : a.status === "declared" ? "Rolle" : "Ukjent";
    return `<div class="agent-row">
      <span class="a-name">${esc(a.name)}</span>
      <span class="a-role">${esc(roleLabels[a.role] || a.role)}</span>
      <span class="badge ${cls}">${label}</span>
    </div>`;
  }).join(""));
})();
