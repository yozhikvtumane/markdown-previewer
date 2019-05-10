const resizer = document.querySelector('#resizer')
const leftPanel = document.querySelector('.left')
const rightPanel = document.querySelector('.right')
const mdText = document.querySelector('#editor')
const content = document.querySelector('.content')

const defaultText = `
# Welcome to dot MD!
## This is a tool to help you edit your Markdown files
### You can resize panels by moving the divider  
### If you are not familiar with Markdown here is a quick faq:  
This is a simple text  

**This text will be bold**  

*Italic styled text*  

[Link](http://google.com)  

![Image](https://picsum.photos/200/200)  

Two spaces and return in the end of the line will make a line break  

#### Inline code:
To find the length of a string, access its \`length\` property:

#### Code block:
\`\`\`
function awesomeTool(e) {
   console.log(e.target)
}

window.addEventListener('resize' , awesomeTool)
\`\`\`
# Header \<h1\>
## Header \<h2\>
### Header \<h3>
### Lists:  
#### Ordered list

1. Item 1
1. Item 2
1. Item 3
    1. Item 3a
    1. Item 3b  

#### Unordered list
* Milk
* Coffee
* Cookies

#### Block quotes are made like this:

Block quote title:
> We're living the future so
> the present is our past.
`

//Marked.js setup
marked.setOptions({
    gfm: true,
    headerIds: false
})

const renderer = new marked.Renderer()
const linkRenderer = renderer.link

renderer.link = function (href, title, text) {
    const html = linkRenderer.call(renderer, href, title, text)
    return html.replace(/^<a /, '<a target="_blank"')
}
//Marked.js setup end

window.addEventListener('load', () => {
    mdText.value = defaultText.toString()
    content.innerHTML = marked(defaultText, {
        renderer
    })
})

function resizeInit(e) {
    e.preventDefault()

    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', stopResize)
}

function handleResize(e) {
    e.preventDefault()

    let leftPanelWidth = leftPanel.offsetWidth
    let rightPanelWidth = rightPanel.offsetWidth

    if (e.target === window) {
        rightPanel.style.width = document.body.offsetWidth - leftPanelWidth - resizer.offsetWidth + 'px'
        return
    }

    if (leftPanelWidth + e.movementX < 80 || rightPanelWidth - e.movementX < 80) return

    leftPanel.style.width = leftPanelWidth + e.movementX + 'px'
    rightPanel.style.width = rightPanelWidth - e.movementX + 'px'
}

function stopResize(e) {
    window.removeEventListener('mousemove', handleResize)
}

function compileMarkdown(e) {
    let text = e.target.value

    content.innerHTML = text
    content.innerHTML = marked(text, {
        renderer
    })
}

resizer.addEventListener('mousedown', resizeInit)
mdText.addEventListener('keyup', compileMarkdown)
window.addEventListener('resize', handleResize)