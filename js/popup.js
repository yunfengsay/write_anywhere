let BASE_URL = 'http://localhost:8080';
let username = localStorage.getItem('username') || '未登录';
var app = new Vue({
    el: '#app',
    data: {
        content: '@registAction log console.log(this)',
        user:{
            username: username
        }
    },
    methods: {
        parseCommand: function () {
            let content = this.content;
            if(content.startsWith('@')){
                content = content.slice(1, content.length);
                let contents = content.split(' ').filter(v => v !== '');
                let command = contents[0].trim();
                let params = contents.slice(1, contents.length);
                this._actions[command](params);
            }
        },
        setMessage: function (type, message) {
            switch (type) {
                case 'success':
                    this.content += "\n Success!";
                    setTimeout(() => {
                        this.content = '';
                    }, 700);
                    break;
                case 'error':
                    this.content += `\n Error! ${message}`;
                    setTimeout(() => {
                        this.content = '';
                    }, 1000);
                    break;
                default:
                    break
            }
        },
        login: function (params) {
            let [username, pwd] = params;
            fetch(BASE_URL + '/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${username}&pwd=${pwd}`
            }).then( (response) => {
                localStorage.setItem('username', username);
                this.user.username = username;
                this.setMessage('success')
            });
        },
        logout: function(params) {
            localStorage.removeItem('username');
            fetch(BASE_URL + '/logout', {method: "GET"}).then(() => {
                this.user.username = "";
                this.setMessage('success');
            })
        },
        other: function (params) {
            fetch(BASE_URL + '/other', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `params=${JSON.stringify(params).trim()}`
            }).then((response) => {
                console.log(response)
            });
        },
        registAction: function(params){
            let current_self_actions = localStorage.getItem('self_actions') || '{}';
            current_self_actions = JSON.parse(current_self_actions);
            let [name, code] = params;
            current_self_actions[name] = code;
            localStorage.setItem('self_actions', JSON.stringify(current_self_actions));
            this.setMessage('success')

        },
        openDetailWindow: function() {
            window.open(chrome.extension.getURL('pages/detail.html'));
        }
    },
    mounted: function () {
        let self_actions = JSON.parse(localStorage.getItem('self_actions'));
        self_actions&&Object.keys(self_actions).forEach(v => {
            try{
                self_actions[v] = new (() => {}).__proto__.constructor(self_actions[v])
            }catch(e) {
                this.setMessage('error', `script ${v} error: ${e}`)
            }
        });
        this._actions = {
            'login': this.login,
            'logout': this.logout,
            'other': this.other,
            'registAction': this.registAction,
            ...self_actions
        }
    }
})