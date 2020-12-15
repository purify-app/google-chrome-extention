const apiUrl = 'https://purify-295716.oa.r.appspot.com/';
// const apiUrl = 'http://127.0.0.1:5000/'
    
const predictKa = async (posts) => new Promise(r => {
    const postData = {}
    
    posts.forEach(post => postData[String(post.hash)] = post.text );

    fetch(apiUrl + 'predict', {
        method : "POST",
        body : JSON.stringify(postData)
    }).then(
        response => response.json()
    ).then(r)
})



const feedback = async (e, feedback) => {
    e.target.parentElement.querySelectorAll('a')[1].innerText = 'Thanks for your feedback'
    e.target.parentElement.querySelectorAll('a')[1].onclick = () => {}
    b64 = btoa(unescape(encodeURIComponent(e.target.parentNode.parentNode.parentNode.querySelectorAll('div[data-ad-comet-preview="message"]')[0].innerText)))
    e.target.parentElement.removeChild(e.target.parentElement.querySelectorAll('a')[0])
    fetch("https://purify-295716.oa.r.appspot.com/log?post_id=" + b64 + "&feedback=" + feedback)
        .then(console.log)
}

const threshold = 0.9;


let model_
const getModel = async () => new Promise(r => {
    if(model_) {
        r(model_)
        return
    }
    toxicity.load(threshold).then(m => {
        model_ = m
        r(model_)
    }) 
})

const predictEn = async (posts) => new Promise(r => {
    const predictionsToReturn = {}
    getModel()
        .then(model => {
            model
                .classify(posts.map(post => post.text ))
                .then(predictions => {
                    predictions.forEach(head => {
                        head.results.forEach((result, index) => {
                            // if(result.match){
                            if(result.probabilities[1] > threshold){
                                predictionsToReturn[posts[index].hash] = predictionsToReturn[posts[index].hash] || []
                                predictionsToReturn[posts[index].hash].push(head.label.replace('_', ' '))
                            }
                        })
                    })
                    r(predictionsToReturn)
                })
        })
})
