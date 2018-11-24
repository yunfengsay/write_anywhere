import db from '../js/lib/db.js';

let origin_document_onkey = document.onkeydown;
// let saveData = require('./lib/db').saveData;
Vue.use(VueMarkdown);
let app = new Vue({
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
            return isOpen;
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
                db.saveData({
                    url,
                    content: that.content,
                    createAt: time_now,
                    updateAt: time_now,
                    isDelete: 0,
                })
                // localStorage.setItem(url + '|' + time_now, that.content)
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
        let $textarea = document.querySelector("#textarea")
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            let url = tabs[0].url;
            let old_obj = localStorage.getItem(url);

            old_obj? that.content = JSON.parse(old_obj).content: null;
            
        });
        chrome.commands.onCommand.addListener(function(command) {
            switch(command) {
                case 'toggle_open':
                    if(that.toggleOpen()){
                        setTimeout(() => {
                            that.$refs.content_textarea.focus();
                        })
                    };
                    break;
                default:
                    break;
            }
          });
    }
})