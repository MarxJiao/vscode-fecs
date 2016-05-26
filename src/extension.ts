'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// 使用node子进程来运行fecs命令
import child_process = require('child_process');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "fecs" is now active!');
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.fecs', () => {
        
        // 命令代码
        let ifEnglish = vscode.workspace.getConfiguration('fecs').get('en');
        let reporter = ''
        if (ifEnglish) {
            reporter = '';
        }
        else {
            reporter = ' --reporter=baidu';
        }
        let fecsCmd = 'fecs ' + vscode.window.activeTextEditor.document.fileName + reporter;
        console.log(ifEnglish);
        showOutput(fecsCmd);
        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
function showOutput(cmd:string) {
    
    // 新建output
    let output = vscode.window.createOutputChannel('fecs output');
    
    // 运行命令并将结果输出到output
    child_process.exec(cmd, null, function (error, stdout, stderr) {
        vscode.workspace.saveAll();
        // vscode.window.showInformationMessage(stdout);
        console.log(stdout);
        output.append(stdout);
        output.show(5,true);
    })
}
// this method is called when your extension is deactivated
export function deactivate() {
}