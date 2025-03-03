import * as vscode from 'vscode';
import { CommitMessage } from './types';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "commit-message-helper" is now active!');

    const disposable = vscode.commands.registerCommand('commit-message-helper.helloWorld', async () => {
        const prefix = await vscode.window.showInputBox({ prompt: 'Enter the prefix' });
        const ticketId = await vscode.window.showInputBox({ prompt: 'Enter the ticket ID (e.g., pcae/tspf-planning#123)' });
        const message = await vscode.window.showInputBox({ prompt: 'Enter the commit message' });

        if (prefix && ticketId && message) {
            const commitMessage: CommitMessage = {
                prefix,
                ticketId,
                message
            };
            const finalMessage = formatCommitMessage(commitMessage);
            const scm = vscode.scm;
            if (scm.inputBox) {
                scm.inputBox.value = finalMessage;
            }
            vscode.window.showInformationMessage(`Commit Message: ${finalMessage}`);
        } else {
            vscode.window.showErrorMessage('All fields are required to create a commit message.');
        }
    });

    context.subscriptions.push(disposable);
}

function formatCommitMessage(commitMessage: CommitMessage): string {
    return `${commitMessage.prefix}: ${commitMessage.ticketId} ${commitMessage.message}`;
}

export function deactivate() {}