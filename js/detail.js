var editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
});

var code_container = ace.edit("editor");
code_container.setValue(localStorage.getItem('__code') || '')
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
                console.clear();
                console.log('--------------  RUNNING  -----------------')
                try {
                    eval(code);
                } catch (e) {
                    console.error(e);
                };
                console.log('--------------  END      -----------------')
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

// ------------- dom ---------------
document.addEventListener('DOMContentLoaded', () => {
    let $menu = document.querySelector('#menu');
    let $active = $menu.firstElementChild.firstElementChild;
    $active.classList.add('active');
    $menu.addEventListener('click', (e) => {
        $active.classList.toggle('active');
        $active = e.target;
        $active.classList.toggle('active');
    })
})

let $root = document.querySelector('#root');
let innerHTML = $root.innerHTML;

// ---------------------------------