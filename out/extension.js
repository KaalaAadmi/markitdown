"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const editor_1 = require("./editor");
function activate(context) {
    context.subscriptions.push(editor_1.ReadmeEditorProvider.register(context));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map