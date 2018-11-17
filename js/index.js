let origin_document_onkey = document.onkeydown;
Vue.use(VueMarkdown);
var app = new Vue({
    el: '#container',
    data: {
        isOpen: false,
        content: ''
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
            let that = this;
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                let url = tabs[0].url;
                let time_now = new Date().getTime();
                localStorage.setItem(url + '|' + time_now, that.content)
            });
            // chrome.storage.local.set({
            //     content: {k: href, v: this.content},
            // },() => {
            //     console.log('保存成功')
            // })
        },
    },
    mounted: function() {
        let that = this;
        chrome.commands.onCommand.addListener(function(command) {
            switch(command) {
                case 'toggle_open':
                    that.toggleOpen();
                    that.$refs.content_textarea.focus();
                    break;
                default:
                    break;
            }
          });
    }
})