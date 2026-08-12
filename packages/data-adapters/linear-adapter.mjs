// LinearAdapter — observert issue-statistikk via Linear GraphQL API.
import { observed, error } from "./lib/provenance.mjs";

const ENDPOINT = "https://api.linear.app/graphql";

async function gql(key, query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: key },
    body: JSON.stringify({ query, variables }),
  });
  const j = await res.json();
  if (j.errors) throw new Error(j.errors[0]?.message ?? "GQL-feil");
  return j.data;
}

export async function fetchTeamStats(teamKey) {
  const key = process.env.LINEAR_API_KEY;
  if (!key) return error("linear", "LINEAR_API_KEY ikke satt");
  try {
    const { teams } = await gql(key, `{ teams { nodes { key id name } } }`);
    const team = teams.nodes.find((t) => t.key === teamKey);
    if (!team) return error("linear", `team ${teamKey} ikke funnet`);
    const { issues } = await gql(
      key,
      `query($t: String!){ issues(filter: { team: { id: { eq: $t } } }) { nodes { state { type } } } }`,
      { t: team.id },
    );
    const byState = {};
    for (const i of issues.nodes) {
      const t = i.state.type;
      byState[t] = (byState[t] || 0) + 1;
    }
    return observed({ team: team.name, key: team.key, issue_counts: byState }, `linear:${teamKey}`);
  } catch (e) {
    return error(`linear:${teamKey}`, e);
  }
}
