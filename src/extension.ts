'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// 使用node子进程来运行fecs命令
import * as child_process from 'child_process';
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
        if (
            fileType === 'javascript' 
            || fileType === 'html' 
            || fileType === 'css' 
            || fileType === 'less'
        ) {
            const ifEnglish = vscode.workspace.getConfiguration('fecs').get('en');
            let options = ''
            if (ifEnglish) {
                options = '';
            }
            else {
                options = ' --reporter=baidu';
            }
            const level = vscode.workspace.getConfiguration('fecs').get('level');
            options += ' --level=' + level;
            // display output in English if 'fecs.en' is true
            let fecsCmd = 'fecs ' + vscode.window.activeTextEditor.document.fileName + options;
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
// 新建output
const output = vscode.window.createOutputChannel('fecs output');

/**
 * 将命令执行结果显示在output中
 *
 * @param cmd 命令
 */
function showOutput(cmd:string) {
    // 运行命令并将结果输出到output
    child_process.exec(cmd, null, function (error, stdout, stderr) {
        let lines = stdout.split(/\r{0,1}\n/);
        console.log(lines);
        vscode.workspace.saveAll();
        // vscode.window.showInformationMessage(stdout);
        output.clear();
        output.append(stdout);
        output.show(5,true);
    })
}

// automatically use fecs on did save file if 'extension.fecs' is true
vscode.workspace.onDidSaveTextDocument(() => {
    const ifAutoFecs = vscode.workspace.getConfiguration('fecs').get('auto');
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