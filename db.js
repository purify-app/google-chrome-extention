dbVersion = 1.1
let openDB = async () => new Promise(r => {
    let req = window.indexedDB.open('purify-db', dbVersion);
 
    req.onupgradeneeded = (e) => {
        e.target.result.createObjectStore('posts-store', { keyPath: "hash" });
    };
 
    req.onsuccess = e => r(e.target.result)
})


let addTagsToDB = async (post) => new Promise(r => {
    openDB().then(db => {
        let req = db.transaction(["posts-store"], "readwrite")
            .objectStore("posts-store")
            .add(post)
            
        req.onsuccess = r
    })
})


let getTagsFromDB = async (hash) => new Promise(r => {
    openDB().then(db => {
        let req = db.transaction(["posts-store"], "readwrite")
            .objectStore("posts-store")
            .get(hash)

        req.onsuccess = e => r(e.target.result ? e.target.result.tags : false)
    })
})
