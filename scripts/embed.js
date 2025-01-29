function displayErrorMessage(message) {
    const element = document.createElement('div');
    element.innerHTML = `<b>Error</b>: ${message}`;
    element.style.color = "white";
    document.body.appendChild(element);
}

const urlParams = new URLSearchParams(window.location.search);

const username = urlParams.get("fav");

if (username === null) throw new Error(`No username specified`);

const count = urlParams.get("count") ?? 4;

const response = await fetch(`https://e621.net/posts.json?tags=fav:${username} order:random limit:${count} -young -type:swf -type:webm`)

if (!response.ok) {
    displayErrorMessage(`e621 server responded with non 2xx code (${response.status})`);
    throw new Error(`e621 server responded with non 2xx code (${response.status})`);
}

const data = await response.json();

if (data.posts.length === 0) {
    displayErrorMessage(`e621 returned empty array. Check username for typos`);
    throw new Error(`e621 returned empty array. Check username for typos`);
}

const ppr = urlParams.get("ppr") ?? 4;
const gap = urlParams.get("gap") ?? 8;
const br = urlParams.get("br") ?? 6;
const quality = urlParams.get("quality") ?? 8;

document.body.style.cssText = `
    grid-template-columns: repeat(${ppr}, 1fr);
    gap:${gap}px;
`
const nocopy = urlParams.get("nocopy") ?? "off";

data.posts.forEach(post => {
    const element = document.createElement('div');
    element.className = "image-display";

    element.style.background = `url('${post[quality].url}')`;
    element.style.borderRadius = `${br}px`;

    element.setAttribute('data-nocopy', nocopy)

    if (nocopy !== "on") {
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
    }

    document.body.appendChild(element);
});
