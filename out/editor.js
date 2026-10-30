"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeEditorProvider = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
class ReadmeEditorProvider {
    static register(context) {
        return vscode.window.registerCustomEditorProvider('readmeEditor.wysiwyg', new ReadmeEditorProvider(context), { supportsMultipleEditorsPerDocument: false });
    }
    constructor(context) {
        this.context = context;
    }
    async resolveCustomTextEditor(document, webviewPanel) {
        webviewPanel.webview.options = { enableScripts: true };
        webviewPanel.webview.html = this.getHtml();
        // Counter-based echo suppression: applyEdit + document.save() each fire one
        // onDidChangeTextDocument event. We suppress both.
        let suppressCount = 0;
        const updateWebview = () => {
            webviewPanel.webview.postMessage({
                type: 'update',
                markdown: document.getText()
            });
        };
        const changeSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() !== document.uri.toString()) {
                return;
            }
            if (suppressCount > 0) {
                suppressCount--;
                return;
            }
            updateWebview();
        });
        webviewPanel.onDidDispose(() => changeSubscription.dispose());
        webviewPanel.webview.onDidReceiveMessage(async (msg) => {
            if (msg.type === 'save') {
                suppressCount = 2; // applyEdit fires 1, document.save() fires 1
                const edit = new vscode.WorkspaceEdit();
                // Range must cover the whole document: line 0 col 0 → last line last col.
                const lastLine = document.lineCount - 1;
                edit.replace(document.uri, new vscode.Range(0, 0, lastLine, document.lineAt(lastLine).text.length), msg.markdown);
                await vscode.workspace.applyEdit(edit);
                await document.save();
            }
        });
        updateWebview();
    }
    getHtml() {
        const htmlPath = path.join(this.context.extensionPath, 'media', 'editor.html');
        return fs.readFileSync(htmlPath, 'utf8');
    }
}
exports.ReadmeEditorProvider = ReadmeEditorProvider;
//# sourceMappingURL=editor.js.map