class PostClass{
    constructor(postDom) {
        this.postDom = postDom;
        this.postDom.classList.add('pure') 
        this.text = this.postDom.textContent
        this.hash = this.postDom.textContent.hashCode()
        this.isKa = (this.text.match(/[ა-ჰ0-9 \.\!\?]/g) || []).length / this.text.length > .7
        this.isEn = (this.text.match(/[a-zA-Z0-9 \.\!\?]/g) || []).length / this.text.length > .7
        window.posts[this.hash] = this
    }

    checkInDB = async () => {
        if(this.tags && this.tags.length) return
        this.tags = await getTagsFromDB(this.hash)
    }

    setTags = async (tags) => {
        this.tags = tags
        await addTagsToDB({ hash: this.hash, tags: tags })
    }
}