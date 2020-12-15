const showTags = (posts) => {
    posts.forEach(post => {
        var tagsCont = document.createElement('div')
        tagsCont.setAttribute("class", "pur-cont")
        appendFeedback(tagsCont)
        post.tags.forEach(tag => drowTag(tag, tagsCont))  

        post.postDom.parentElement.parentElement.parentElement.children[1].appendChild(tagsCont)
    });
    
}

const drowTag = (title, div) => {
    var kk = document.createElement('div')
    kk.setAttribute("class", "pur-tag")
    kk.innerText = title
    div.appendChild(kk)
}

const appendFeedback = (div) => {
    var agree = document.createElement('a')
    agree.innerText = 'Agree'
    var disagree = document.createElement('a')
    disagree.innerText = 'Disagree'

    agree.setAttribute("style", "float:right; color: #d3d3d3;    padding: 5px;    font-weight: bold;")
    disagree.setAttribute("style", "float:right;margin-right: 10px;color: #d3d3d3;    padding: 5px;    font-weight: bold;")
    div.appendChild(disagree)
    div.appendChild(agree)

    agree.onclick = (e) => feedback(e, 'agree')
    disagree.onclick = (e) => feedback(e, 'do_not_agree')

    return div
}
