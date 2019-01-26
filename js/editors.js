const editors = {}

function createEditor(id,mode) {
    const editor = ace.edit(id);
    editor.setTheme("ace/theme/monokai");
    if (mode) { 
        editor.session.setMode(mode);
    } else { 
        editor.session.setMode("ace/mode/javascript");
    }
    editors[id] = editor;
}

export { editors, createEditor }
