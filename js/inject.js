const body = document.querySelector('body');
const IFRAME_ELEMENT_ID = 'collections_chrome_id';
const locationHref = location.href;
const src = 'pages/index.html';
let created = false;
let TAB_HEIGHT = 30;

function setIframeHeight(height = 300) {
    height += TAB_HEIGHT;
    window.IFRAME.style.height = height + 'px';
}

let runningExtension = false;
if (typeof (chrome) !== 'undefined' && chrome.extension) {
    runningExtension = true;
}

function createIframe() {
    let iframe = document.createElement('iframe');
    iframe.src = runningExtension ? chrome.extension.getURL(src) : src;
    iframe.src += '?' + locationHref;
    iframe.id = IFRAME_ELEMENT_ID;
    iframe.style = `
        display: none;
        position:fixed;
        bottom: 0;
        left:200px;
        z-index:999999999;
        border:none;
        height: 30px;
        overflow:hidden;
    `;
    window.IFRAME = iframe;
    document.body.insertBefore(iframe, document.body.firstChild);
    created = true
}

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log(sender.tab ?
        //     "from a content script:" + sender.tab.url :
        //     "from the extension");
        if(window.IFRAME&&window.IFRAME.style.display === 'none'){
            window.IFRAME.style.display = 'block';
        };
        if (request.isOpen){
            setIframeHeight();
        } else {
            setIframeHeight(0);
            sendResponse({}); // snub them.
        }
    });
createIframe()