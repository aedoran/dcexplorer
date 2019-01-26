const editors = {}

function createEditor(id) {
    const editor = ace.edit(id);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    editors[id] = editor;
}

export { editors, createEditor }
