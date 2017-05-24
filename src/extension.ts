'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// 使用node子进程来运行fecs命令
import * as child_process from 'child_process';
// const child_process = require('child_process');
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
        // let fileType = vscode.window.activeTextEditor.document.languageId;
        if(vscode.window.activeTextEditor) {
            const fileType = vscode.window.activeTextEditor.document.languageId;
            if (
                fileType === 'javascript' 
                || fileType === 'html' 
                || fileType === 'css' 
                || fileType === 'less'
                || fileType === 'jsx'
                || fileType === 'javascriptreact'
            ) {
                let options = [vscode.window.activeTextEditor.document.fileName];

                // display output in English if 'fecs.en' is true
                const ifEnglish = vscode.workspace.getConfiguration('fecs').get('en');
                if (ifEnglish) {
                }
                else {
                    options.push('--reporter=baidu');
                }
                const level = vscode.workspace.getConfiguration('fecs').get('level');
                options.push('--level=' + level);
                
                showOutput(options);
                return;
            }
            else {
                deactivate();
                return false;
            }
        }
        return;
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
 * @param options 命令参数
 */
function showOutput(options: string[]) {
    // 先清空output
    output.clear();
    // 运行命令
    const fecs = child_process.spawn('fecs', options);
    // 有数据时向output添加数据
    fecs.stdout.on('data', data => {
        vscode.workspace.saveAll();
        output.append(data.toString());
        output.show(5, true);
    })
    // 有错误时显示错误
    fecs.stderr.on('data', data => {
        vscode.workspace.saveAll();
        vscode.window.showInformationMessage(data.toString());
        output.append(data.toString());
        output.show(5, true);
    })
}

// automatically use fecs on did save file if 'extension.fecs' is true
vscode.workspace.onDidSaveTextDocument(() => {
    const ifAutoFecs = vscode.workspace.getConfiguration('fecs').get('auto');
    if (ifAutoFecs) {
        vscode.commands.executeCommand('extension.fecs');
        return;
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