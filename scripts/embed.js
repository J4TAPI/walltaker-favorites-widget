const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("fav")
var count = urlParams.get("count")
var ppr = urlParams.get("ppr")
var gap = urlParams.get("gap")

if (count === null) count = 4;
if (ppr === null) ppr = 4;
if (gap === null) gap = 8;

const response = await fetch(`https://e621.net/posts.json?tags=fav:${username} order:random limit:${count}`)
const data = await response.json()

if (response.status !== 200) {
    const element = document.createElement('img');

    switch (response.status) {
        case 403:
            element.src = "/assets/private.png";
            break;
        default:
            element.src = "/assets/generalfetcherror.png";
            break;
    }

    document.body.appendChild(element);
    throw new Error(`e621 responded with code ${response.status}`);
}

document.body.style.cssText = `
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(${ppr}, 1fr);
    gap:${gap}px;
`

data.posts.forEach(post => {
    const element = document.createElement('img');
    if (post.file.ext === "swf") {
        element.src = "/assets/unsupported.png"
    } else if (post.sample.url === null) {
        element.src = "/assets/blacklisted.png";
    } else {
        element.src = post.sample.url;
    }
    element.addEventListener("click", () => {
        navigator.clipboard.writeText(`https://e621.net/posts/${post.id}`);
    })
    document.body.appendChild(element);
});
