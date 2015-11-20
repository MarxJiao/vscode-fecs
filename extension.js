
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
// 引入
var fs = require('fs');
var exec = require('child_process').exec;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fecs" is now active!'); 
    // var fecsCmd = 'fecs ' + vscode.window.activeTextEditor.document.fileName;
    // exec(fecsCmd, null, function (error, stdout, stderr) {
    //     console.log(stdout);
    //     vscode.window.showInformationMessage(stdout);
    // })
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('fecs.check', function () {
        
        var fecsCmd = 'fecs ' + vscode.window.activeTextEditor.document.fileName;
        exec(fecsCmd, null, function (error, stdout, stderr) {
            vscode.workspace.saveAll();
            vscode.window.showInformationMessage(stdout);
            console.log(stdout);
        })
		// // The code you place here will be executed every time your command is executed
        
		// // Display a message box to the user
		// vscode.window.showInformationMessage(__filename);
	});
	
	context.subscriptions.push(disposable);
}
exports.activate = activate;