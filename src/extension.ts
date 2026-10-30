import * as vscode from 'vscode';
import { ReadmeEditorProvider } from './editor';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(ReadmeEditorProvider.register(context));
}

export function deactivate() {}
