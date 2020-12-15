window.posts = {}

const addObserver = () => {
    window.intervalId = setInterval(() => {
        let cont = document.querySelectorAll('div[role="main"]').length == 2 
            ? document.querySelectorAll('div[role="main"]')[1].children[0] 
            : document.querySelector('div[role="feed"]') || document.querySelector('div[role="main"] > div:last-child > div:last-child > div > div:last-child')

                
        if(!cont) return
        window.clearInterval(window.intervalId)

        new window.MutationObserver(postsAdded).observe(cont, { childList: true })
        setTimeout(postsAdded, 800)
    }, 500)
}

const postsAdded = async () => {
    const addedPosts = [...document.querySelectorAll('div[data-ad-preview="message"]:not(.pure)')].map(posdDom => new PostClass(posdDom))
    
    if (!addedPosts.length) return

    for(let i = 0; i < addedPosts.length; i++){
        await addedPosts[i].checkInDB()
    } 

    showTags(addedPosts.filter(post => post.tags && post.tags.length))

    let postsForPrediction = addedPosts.filter(post => !post.tags)
        
    if (!postsForPrediction.length) return
    
    let postsForPredictionKa = postsForPrediction.filter(post => post.isKa )
    
    if(postsForPredictionKa.length){
        let predictions = await predictKa(postsForPrediction.map(post => ({hash: post.hash, text: post.text})))

        for(let i = 0; i < Object.keys(predictions).length; i++){
            let hash = Object.keys(predictions)[i]
            await window.posts[hash].setTags(predictions[hash])
        } 
    
        showTags(Object.keys(predictions).map(hash => window.posts[hash]).filter(post => post.tags.length))
    } 
    
    let postsForPredictionEn = postsForPrediction.filter(post => post.isEn )
    
    if(postsForPredictionEn.length){
        let predictions = await predictEn(postsForPredictionEn)
        for(let i = 0; i < Object.keys(predictions).length; i++){
            let hash = Object.keys(predictions)[i]
            await window.posts[hash].setTags(predictions[hash])
        } 
    
        showTags(Object.keys(predictions).map(hash => window.posts[hash]).filter(post => post.tags.length))
    }
}