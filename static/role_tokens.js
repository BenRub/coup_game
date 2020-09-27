let roleTokens = {
    "tax": 2,
    "treaty": 2,
    "peacekeeper": 2,
    "disappear": 3,
}

let myTokensElements = {}
function createMyTokens() {
    getMyTokensElement().innerHTML = ''
    for (let tokenType in roleTokens) {
        for (let index = 0; index < roleTokens[tokenType]; index++) {
            let myTokenTypeElement = document.createElement("div")
            myTokenTypeElement.className = "token"
            myTokenTypeElement.draggable = true
            myTokenTypeElement.ondragstart = function (ev) {
                dragTokenFromMyself(ev, tokenType, index)
            }
            myTokensElements[tokenType + index] = myTokenTypeElement
            getMyTokensElement().appendChild(myTokenTypeElement)
        }
    }
}

let baseTokensElements = {}
function createBaseTokens() {
    getBaseTokensElement().innerHTML = ''
    for (let tokenType in roleTokens) {
        for (let index = 0; index < roleTokens[tokenType]; index++) {
            let baseTokenTypeElement = document.createElement("div")
            baseTokenTypeElement.className = "token"
            baseTokenTypeElement.draggable = true
            baseTokenTypeElement.ondragstart = function (ev) {
                dragTokenFromBase(ev, tokenType, index)
            }
            baseTokensElements[tokenType + index] = baseTokenTypeElement
            getBaseTokensElement().appendChild(baseTokenTypeElement)
        }
    }
}



