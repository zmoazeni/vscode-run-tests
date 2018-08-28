const vscode = require('vscode');
const pastebuffer = require('copy-paste')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const cantFindFileMessage = "Could not find file";

    function getCommand(withLine) {
        const prefix = vscode.workspace.getConfiguration('run-tests').get("prefix");
        const fileName = vscode.window.activeTextEditor.document.fileName;
        const workspacePath = vscode.workspace.rootPath;

        if (workspacePath && !vscode.window.activeTextEditor.document.isUntitled) {
            const relativePath = fileName.replace(workspacePath + "/", "");
            if (withLine) {
                const currentLine = vscode.window.activeTextEditor.selection.start.line + 1;
                return prefix + " " + relativePath + ":" + currentLine;
            } else {
                return prefix + " " + relativePath;
            }

            pastebuffer.copy(testCommand, function () {
                vscode.window.showInformationMessage('Copied test command');
            });
        }
    }

    function copyTestCommandCallback () {
        const command = getCommand();
        if (command) {
            pastebuffer.copy(command, function () {
                vscode.window.showInformationMessage('Copied test command');
            });
        } else {
            vscode.window.showInformationMessage(cantFindFileMessage);
        }
    }

    function copyTestCommandLineCallback () {
        const command = getCommand(true);
        if (command) {
            pastebuffer.copy(command, function () {
                vscode.window.showInformationMessage('Copied test command with line');
            });
        } else {
            vscode.window.showInformationMessage(cantFindFileMessage);
        }
    }

    function runTestCallback () {
        const command = getCommand();
        if (command && vscode.window.terminals[0]) {
            vscode.window.terminals[0].sendText(command)
        } else {
            vscode.window.showInformationMessage(cantFindFileMessage);
        }
    }

    function runTestLineCallback () {
        const command = getCommand(true);
        if (command && vscode.window.terminals[0]) {
            vscode.window.terminals[0].sendText(command)
        } else {
            vscode.window.showInformationMessage(cantFindFileMessage);
        }
    }

    context.subscriptions.push(vscode.commands.registerCommand('extension.copyTestCommand', copyTestCommandCallback));
    context.subscriptions.push(vscode.commands.registerCommand('extension.copyTestCommandLine', copyTestCommandLineCallback));
    context.subscriptions.push(vscode.commands.registerCommand('extension.runTest', runTestCallback));
    context.subscriptions.push(vscode.commands.registerCommand('extension.runTestLine', runTestLineCallback));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
