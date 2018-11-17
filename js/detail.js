var editor = ace.edit("editor");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
});
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


var code_container = ace.edit("editor");
code_container.setValue(localStorage.getItem('__code'))
document.onkeydown = function (event) {
    if (event.metaKey) { // 83 cmd+s | 66 cmd+b
        // console.log('key is ', event.which)

        switch (event.which) {
            case 83:
                var code = code_container.getValue();
                localStorage.setItem('__code', code_container.getValue());
                return false;
            case 66:
                var code = code_container.getValue();
                try {
                    eval(code);
                } catch (e) {};
                break;
            default:
                break;
        }
    } else {
        return true;
    }
}

setInterval(() => {
    localStorage.setItem('__code', code_container.getValue());
},2000)