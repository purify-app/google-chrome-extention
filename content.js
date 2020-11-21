const apiUrl = 'https://purify-295716.oa.r.appspot.com/';
    
const options = {
    method: 'GET',
    //   body: JSON.stringify(posts.map(p => p.innerText)),
    headers: {
        'Content-Type': 'application/json'
    }
}

const appendFeedback = (div) => {
    var a0 = document.createElement('a')

    var a1 = document.createElement('a')
    a1.innerText = 'Agree'
    var a2 = document.createElement('a')
    a2.innerText = 'Disagree'

    a1.setAttribute("style", "float:right; color: #d3d3d3;    padding: 5px;    font-weight: bold;")
    a2.setAttribute("style", "float:right;margin-right: 10px;color: #d3d3d3;    padding: 5px;    font-weight: bold;")
    div.appendChild(a2)
    div.appendChild(a1)

    a1.onclick = (e) => feedback(e, 'agree')
    a2.onclick = (e) => feedback(e, 'do_not_agree')

    return div
}

const drowTag = (title, div) => {
    var kk = document.createElement('div')
    kk.setAttribute("class", "pur-tag")
    kk.innerText = title
    div.appendChild(kk)
}

const showPredictions = (pred, post) => {
    res = pred[0]
    if(res[5] < 3.5 && res[1] < 3.5 && res[2] < 3.5 && res[3] < 3.5 && res[4] < 3.5) return
    
    var div = document.createElement('div')
    div.setAttribute("class", "pur-cont")
    appendFeedback(div)
    
    if(res[1] > 3.5) drowTag('Discrediting', div)
        
    if(res[2] > 3.5) drowTag('Ideologized Propaganda', div)
        
    if(res[3] > 3.5) drowTag('False Media', div)
        
    if(res[4] > 3.5) drowTag('False Supporting', div)
        
    if(res[4] > 3.5) drowTag('Government Propaganda', div)
        

    post.parentElement.parentElement.parentElement.children[1].appendChild(div)
}
const posts = []

class PostClass{
    constructor(posdDom) {
        posts.push(this)
        this.posdDom = posdDom;
        this.posdDom.classList.add('pure')
        fetch(apiUrl + '?txt='+ this.posdDom.innerText, options)
            .then(res => res.json())
            .then(res => showPredictions(res, this.posdDom));
    }
}

class batchPredict{
    constructor(){
        this.posts = [...document.querySelectorAll('div[data-ad-comet-preview="message"]:not(.pure)')]//.map(a => ({ dom: a, text: a.innerText}))  
        const postTexts = this.posts.map(a => a.innerText)
        this.posts.forEach(post => post.classList.add('pure'))
        fetch("https://purify-295716.oa.r.appspot.com/batch")
            .then(res => res.json())
            .then(res => {
                if(!res.lenght) return
                res.forEach((prediction, index) => showPredictions(prediction, this.posts[index]))
            });
    }
}

const parse = () => [...document.querySelectorAll('div[data-ad-comet-preview="message"]:not(.pure)')].forEach(posdDom => postClass = new PostClass(posdDom))

const observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
    return function( obj, callback ){
        if( !obj || obj.nodeType !== 1 ) return; 
    
        if( MutationObserver ){
            var mutationObserver = new MutationObserver(callback)
            mutationObserver.observe( obj, { childList:true, subtree:true })
            return mutationObserver
        } else if( window.addEventListener ){
                obj.addEventListener('DOMNodeInserted', callback, false)
                obj.addEventListener('DOMNodeRemoved', callback, false)
            }
        }
    }
)()

setInterval(() => {
    parse()
    // observeDOM(document.querySelectorAll('div[role="feed"]')[0], () => parse())
}, 1000)

const feedback = async (e, feedback) => {
    e.target.parentElement.querySelectorAll('a')[1].innerText = 'Thanks for your feedback'
    e.target.parentElement.querySelectorAll('a')[1].onclick = () => {}
    b64 = btoa(unescape(encodeURIComponent(e.target.parentNode.parentNode.parentNode.querySelectorAll('div[data-ad-comet-preview="message"]')[0].innerText)))
    e.target.parentElement.removeChild(e.target.parentElement.querySelectorAll('a')[0])
    fetch("https://purify-295716.oa.r.appspot.com/log?post_id=" + b64 + "&feedback=" + feedback)
        .then(console.log)
}
