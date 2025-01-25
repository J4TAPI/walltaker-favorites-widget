const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("fav");

if (username === null) throw new Error(`No username specified`);

const count = urlParams.get("count") ?? 4;

const response = await fetch(`https://e621.net/posts.json?tags=fav:${username} order:random limit:${count} -young -type:swf`)

if (!response.ok) {
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

const ppr = urlParams.get("ppr") ?? 4;
const gap = urlParams.get("gap") ?? 8;
const quality = urlParams.get("quality") ?? 8;

document.body.style.cssText = `
    grid-template-columns: repeat(${ppr}, 1fr);
    gap:${gap}px;
`

const data = await response.json()

data.posts.forEach(post => {
    const element = document.createElement('img');
    element.src = post[quality].url;

    element.addEventListener("click", () => {
        navigator.clipboard.writeText(`https://e621.net/posts/${post.id}`);
    })

    document.body.appendChild(element);
});
