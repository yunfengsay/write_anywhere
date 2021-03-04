
import './lib/util.js';
import './labs/notes.js';
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
const pegEditorTest = CodeMirror.fromTextArea($('#pegTest').get(0), {
    lineNumbers: true,
    mode: 'text' // 设置mode 对应的也要这之前引入相应的js
});
pegEditor.getDoc().setValue(localStorage.getItem('__peg')  || '');
pegEditorTest.getDoc().setValue(localStorage.getItem('__peg_test') || '');
var code_container = ace.edit("editor");
code_container.setValue(localStorage.getItem('__code') || '');

document.onkeydown = function (event) {
    if (event.metaKey) { // 83 cmd+s | 66 cmd+b
        switch (event.which) {
            case 83:
                saveAllHtmlCode();
                // chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
                //     writableFileEntry.createWriter(function(writer) {
                //       writer.onerror = errorHandler;
                //       writer.onwriteend = function(e) {
                //         console.log('write complete');
                //       };
                //       writer.write(new Blob(['1234567890'], {type: 'text/plain'}));
                //     }, errorHandler);
                // });
                return false;
            case 66:
                var code = code_container.getValue();
                // console.clear();
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
    localStorage.setItem('__peg_test',pegEditorTest.getValue());
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
function clearParseResultErrorMessaage() {
    $('.peg-test-container .error-red').removeClass('error-red')
}
function getResult(output){
    console.log('parse result -> ', output);
    return output
}
function pegParseTarget() {
    // console.clear();
    clearParseResultErrorMessaage()
    try {
        var timeBefore = (new Date).getTime();
        var output = parser.parse(pegEditorTest.getValue());
        var timeAfter = (new Date).getTime();
        pegEditorTest.refresh();
        var timeConsum = timeAfter - timeBefore;
        $("#parse-message").attr("class", "message success").text(`[consume time ${timeConsum} ms ]parse result --> \n ${getResult(output)}`)
        var result = true;
      } catch (e) {
          let {location} = e;
          let {start,end} = location;
          pegEditorTest.getDoc().markText({line: start.line-1, ch: start.column-1}, {line: end.line-1, ch: end.column-1}, {
              className: 'error-red'
          });
        //   pegEditorTest.getDoc().setCursor({line: start.line-1, ch: start.column-1});
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
pegBuildAndParse()
pegEditor.on("change", scheduleBuildAndParse);
pegEditorTest.on("change", scheduleBuildAndParse);
// ------------- dom ---------------

let $menu = document.querySelector('#menu');
let activeHash = location.hash || '#labs';
let $$active = $(`a[href$='${activeHash}']`);
window.$$active = $$active;
$$active[0].click();
let $active = $$active.get(0);
$active.classList.toggle('active')
$menu.addEventListener('click', (e) => {
    $active.classList.toggle('active');
    $active = e.target;
    $active.classList.toggle('active');
})

let $root = document.querySelector('#root');
let innerHTML = $root.innerHTML;

// ---------------------------------
