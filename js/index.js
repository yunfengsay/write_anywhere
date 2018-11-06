let origin_document_onkey = document.onkeydown;
Vue.use(VueMarkdown);
var app = new Vue({
    el: '#container',
    data: {
        isOpen: false,
        content: 'this is content'
    },
    methods: {
        toggleOpen: function () {
            this.isOpen = !this.isOpen;
            let isOpen = this.isOpen;
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendMessage(tab.id, {
                    isOpen: isOpen
                }, function (response) {

                });
            });
        },
        focus: function () {
            let that = this;
            document.onkeydown = function (event) {
                if (event.metaKey && event.which == 83) {
                    that.save()
                    event.preventDefault();
                    return false;
                } else {
                    return true;
                }
            }
        },
        blur: function () {
            document.onkeydown = origin_document_onkey;
        },
        save: function() {
            let href = location.href;
            chrome.storage.local.set({
                content: {k: href, v: this.content},
            },() => {
                console.log('保存成功')
            })
        }
    }
})