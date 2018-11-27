let app = new Vue({
    el: '#notes',
    data: {
        notes: [1]
    },
    mounted: function(params) {
        let notes = [];
        let len = localStorage.length;
        var i = 0 ;
        while(i < len) {
            i++;
            let key = localStorage.key(i);
            if(/^http/.test(key)) {
                let item = JSON.parse(localStorage.getItem(key));
                let indexofN =  item.content.indexOf('\n')|| item.content.length;
                indexofN === -1?indexofN = item.content.length: null;

                var title = item.content.substr(0, indexofN);
                var content = item.content.substr(indexofN+1) ||item.content;
                item = {
                    content,
                    title,
                    createAt:new Date(item.createAt).toDateString(),
                    url: item.url
                }
                notes.push(item)
            }
        }
        this.notes = notes;
    }
})