location.href = location.href
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
});

const pegEditor = CodeMirror.fromTextArea($('#pegEditor').get(0), {
    lineNumbers: true,
    mode: 'pegjs' // 设置mode 对应的也要这之前引入相应的js
});
pegEditor.getDoc().setValue(localStorage.getItem('__peg'));
var code_container = ace.edit("editor");
code_container.setValue(localStorage.getItem('__code') || '')
document.onkeydown = function (event) {
    if (event.metaKey) { // 83 cmd+s | 66 cmd+b
        switch (event.which) {
            case 83:
                saveAllHtmlCode();
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
    saveAllHtmlCode()
}, 2000)


function saveAllHtmlCode() {
    localStorage.setItem('__code', code_container.getValue());
    localStorage.setItem('__peg', pegEditor.getValue());
}

function getGrammar() {
    return pegEditor.getValue();
}
var parser;
function pegBuild() {

    try {
        var timeBefore = (new Date).getTime();
        var parserSource = peg.generate(getGrammar(), {
            cache: true,
            output: "source"
        });
        var timeAfter = (new Date).getTime();
        console.log(parserSource)
        parser = eval(parserSource);
        let timeConsum = timeAfter - timeBefore;
        $("#build-message").attr("class", "message success").text('Build Success');

        var result = true;
    } catch (e) {
        $("#build-message").attr("class", "message error").text(buildErrorMessage(e));

        var result = false;
    }
    return result;
}
function buildErrorMessage(e) {
    return e.location !== undefined
      ? "Line " + e.location.start.line + ", column " + e.location.start.column + ": " + e.message
      : e.message;
}
function pegParseTarget() {
    try {
        var timeBefore = (new Date).getTime();
        var output = parser.parse($("#pegTest").val());
        var timeAfter = (new Date).getTime();
        var timeConsum = timeAfter - timeBefore;
        $("#parse-message").attr("class", "message success").text(`[consume time ${timeConsum}]parse result --> \n ${output}`)
        var result = true;
      } catch (e) {
        $("#parse-message").attr("class", "message error").text(buildErrorMessage(e));

        var result = false;
      }
      return result;
}
function pegBuildAndParse() {
    pegBuild() && pegParseTarget();
}
function scheduleBuildAndParse() {
    setTimeout(() => {
        pegBuildAndParse()
    })
}

pegEditor.on("change", scheduleBuildAndParse);
$("#pegTest").on('input', scheduleBuildAndParse)
// ------------- dom ---------------

let $menu = document.querySelector('#menu');
let activeHash = location.hash;
let $active = $(`a[href$='${activeHash}']`).get(0);
$active.classList.toggle('active')
$menu.addEventListener('click', (e) => {
    $active.classList.toggle('active');
    $active = e.target;
    $active.classList.toggle('active');
})

let $root = document.querySelector('#root');
let innerHTML = $root.innerHTML;

// ---------------------------------