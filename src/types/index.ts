export interface CommitMessage {
  prefix: string;
  ticketId: string;
  message: string;
}

export function createCommitMessage(commit: CommitMessage): string {
  return `${commit.prefix}: pcae/tspf-planning#${commit.ticketId} ${commit.message}`;
}