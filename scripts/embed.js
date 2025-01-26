const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("fav");

if (username === null) throw new Error(`No username specified`);

const count = urlParams.get("count") ?? 4;

const response = await fetch(`https://e621.net/posts.json?tags=fav:${username} order:random limit:${count} -young -type:swf`)

if (!response.ok) {
    const element = document.createElement('div');
    element.innerHTML = `<b>Error</b>: e621 server responded with non 2xx code (${response.status})`;
    element.style.color = "white"
    document.body.appendChild(element);
    throw new Error(`e621 server responded with non 2xx code (${response.status})`);
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
    const element = document.createElement('div');
    element.className = "image-display";

    element.style.background = `url('${post[quality].url}')`;

    const elementText = document.createElement('p');
    elementText.innerHTML = "Click to copy link";

    element.addEventListener("click", () => {
        navigator.clipboard.writeText(`https://e621.net/posts/${post.id}`);
        elementText.innerHTML = "✔ Link copied";
        setTimeout(() => {
            elementText.innerHTML = "Click to copy link";
        }, 2000);
    })

    element.appendChild(elementText);
    document.body.appendChild(element);
});
