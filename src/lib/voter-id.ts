const VOTER_ID_KEY = "fanvue_voter_id";
const VOTED_IDS_KEY = "fanvue_voted_ids";

export function getVoterIdentifier(): string {
  let id = localStorage.getItem(VOTER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_ID_KEY, id);
  }
  return id;
}

export function hasVotedFor(feedbackId: string): boolean {
  return getVotedIds().includes(feedbackId);
}

export function addVotedId(feedbackId: string): void {
  const ids = getVotedIds();
  if (!ids.includes(feedbackId)) {
    ids.push(feedbackId);
    localStorage.setItem(VOTED_IDS_KEY, JSON.stringify(ids));
  }
}

export function removeVotedId(feedbackId: string): void {
  const ids = getVotedIds().filter((id) => id !== feedbackId);
  localStorage.setItem(VOTED_IDS_KEY, JSON.stringify(ids));
}

function getVotedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VOTED_IDS_KEY) || "[]");
  } catch {
    return [];
  }
}
