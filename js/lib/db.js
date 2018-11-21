// 数据库数据结果
var db, transaction, objectStore;
var db_name = 'write_here';

// 打开数据库
var DBOpenRequest = window.indexedDB.open(db_name, 1);
// 数据库打开成功后
DBOpenRequest.onsuccess = function (event) {
    // 存储数据结果
    db = DBOpenRequest.result;
    transaction = db.transaction(["article"], "readwrite");
    transaction.oncomplete = () => console.log('transaction  complete');
    transaction.onclose = () => console.log('onclose');
    objectStore = transaction.objectStore("article");
    // 做其他事情...
};

DBOpenRequest.onerror = function (event) {
    // 错误处理程序在这里。
};

// 下面事情执行于：数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
DBOpenRequest.onupgradeneeded = function (event) {
    var db = event.target.result;
    objectStore = db.createObjectStore("article");
    objectStore.createIndex("url", "url", {
        keyPath: "url"
    });
    objectStore.createIndex("content", "content", {
        keyPath: "url"
    });
    objectStore.createIndex("createAt", "createAt", {
        unique: false
    });
    objectStore.createIndex("isDelete", "isDelete", {
        unique: false
    });
    objectStore.createIndex("updateAt", "updateAt", {
        unique: false
    });
    objectStore.add({
        url: 'test',
        content: 'test'
    })
};

function saveData(obj) {
    let {url, content} = obj;
    var existing = localStorage.getItem(url);
    var existing_obj = JSON.parse(existing);
    var content_is_change = existing_obj? content === existing_obj.content: true;
    var data = existing&&!content_is_change ? existing : JSON.stringify(obj);
    localStorage.setItem(url, data);

    // var DBOpenRequest = window.indexedDB.open(db_name, 1);
    // DBOpenRequest.onsuccess = () => {
    //     db = DBOpenRequest.result;
    //     transaction = db.transaction(["article"], "readwrite");
    //     objectStore = transaction.objectStore("article");
    //     let result = objectStore.add(obj);
    //     result.onsuccess = (e) => {};
    //     result.onerror = (e) => console.error(e);
    // };
}

export default {
    db,
    saveData
}