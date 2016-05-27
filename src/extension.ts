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
        
        let fileType = vscode.window.activeTextEditor.document.languageId;
        console.log(fileType);
        if (
            fileType === 'javascript' 
            || fileType === 'html' 
            || fileType === 'css' 
            || fileType === 'less'
        ) {
            let ifEnglish = vscode.workspace.getConfiguration('fecs').get('en');
            let reporter = ''
            if (ifEnglish) {
                reporter = '';
            }
            else {
                reporter = ' --reporter=baidu';
            }
            // if display output in English if 'fecs.en' is true
            let fecsCmd = 'fecs ' + vscode.window.activeTextEditor.document.fileName + reporter;
            showOutput(fecsCmd);
        }
        else {
            deactivate();
            return false;
        }
        
       
        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
let output = vscode.window.createOutputChannel('fecs output');
function showOutput(cmd:string) {
    
    // 新建output
    
    
    // 运行命令并将结果输出到output
    child_process.exec(cmd, null, function (error, stdout, stderr) {
        vscode.workspace.saveAll();
        // vscode.window.showInformationMessage(stdout);
        console.log(stdout);
        output.clear();
        output.append(stdout);
        output.show(5,true);
    })
}

// automatically use fecs on did save file if 'extension.fecs' is true
vscode.workspace.onDidSaveTextDocument(() => {
    let ifAutoFecs = vscode.workspace.getConfiguration('fecs').get('auto');
    if (ifAutoFecs) {
        vscode.commands.executeCommand('extension.fecs');
    }
    else {
        return false;
    }
})
// this method is called when your extension is deactivated
export function deactivate() {
    output.clear();
    output.hide();
}