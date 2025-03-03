import * as vscode from "vscode";
import { GitExtension, Repository } from "./api/git";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "gitPrefix.setMessage",
    async (uri?) => {
      const git = getGitExtension();

      if (!git) {
        vscode.window.showErrorMessage("Unable to load Git Extension");
        return;
      }

      vscode.commands.executeCommand("workbench.view.scm");

      if (uri) {
        const selectedRepository = git.repositories.find((repository) => {
          return repository.rootUri.path === uri.rootUri.path;
        });

        if (selectedRepository) {
          await prefixCommit(selectedRepository);
        }
      } else {
        for (const repo of git.repositories) {
          await prefixCommit(repo);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function prefixCommit(repository: Repository) {
  const branchName =
    (repository.state.HEAD && repository.state.HEAD.name) || "";
  const ticketId = extractTicketId(branchName);

  const items = [
    { label: "feat" },
    { label: "fix" },
    { label: "refactor" },
    { label: "chore" },
  ];

  const selectedItem = await vscode.window.showQuickPick(items, {
    placeHolder: "Select an option",
  });
  const currentMessage = repository.inputBox.value;

  repository.inputBox.value = `${
    selectedItem?.label ?? "feat"
  }: pcae/tspf-planning#${ticketId} ${currentMessage}`;
  vscode.commands.executeCommand("list.focusFirst");
  vscode.commands.executeCommand("list.select");
}

function extractTicketId(branchName: string) {
  const ticketIdPattern = branchName.match(/\d+/);
  if (!ticketIdPattern) {
    vscode.window.showErrorMessage("Can not find ticket id in branch name");
    return;
  }

  return ticketIdPattern[0];
}

function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = vscodeGit && vscodeGit.exports;
  return gitExtension && gitExtension.getAPI(1);
}

export function deactivate() {
  // called when extension is deactivated
}
