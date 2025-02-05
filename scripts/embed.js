function displayErrorMessage(message) {
    const element = document.createElement('div');
    element.innerHTML = `<b>Error</b>: ${message}`;
    element.style.color = "white";
    document.body.appendChild(element);
}

function getUrlParameters() {
    const searchParams = Object.fromEntries(new URLSearchParams(window.location.search));
    return {
        fav: null, 
        count: 4, 
        ppr: 4,
        gap: 8,
        br: 6,
        quality: "sample",
        clickact: "copy",
        nocopy: "off",
        ...searchParams
    }
}

function addCopyAction(post, element) {
    const elementText = document.createElement('p');
    elementText.innerHTML = "Click to copy link";

    element.addEventListener("click", () => {
        navigator.clipboard.writeText(`https://e621.net/posts/${post.id}`);
        elementText.innerHTML = "✔ Link copied";
        setTimeout(() => {
            elementText.innerHTML = "Click to copy link";
        }, 2000);
    })

    element.setAttribute('data-action', "copy")
    element.appendChild(elementText);
}

function addNewTabAction(post, element) {
    element.addEventListener("click", () => {
        window.open(`https://e621.net/posts/${post.id}`);
    })
    element.setAttribute('data-action', "tab")
}

const urlParams = getUrlParameters();

if (urlParams.fav === null) throw new Error(`No username specified`);

const response = await fetch(`https://e621.net/posts.json?tags=fav:${urlParams.fav} order:random limit:${urlParams.count} -young -type:swf -type:webm`)

if (!response.ok) {
    displayErrorMessage(`e621 server responded with non 2xx code (${response.status})`);
    throw new Error(`e621 server responded with non 2xx code (${response.status})`);
}

const data = await response.json();

if (data.posts.length === 0) {
    displayErrorMessage(`e621 returned empty array. Check username for typos`);
    throw new Error(`e621 returned empty array. Check username for typos`);
}

document.body.style.cssText = `
    grid-template-columns: repeat(${urlParams.ppr}, 1fr);
    gap:${urlParams.gap}px;
`

data.posts.forEach(post => {
    const element = document.createElement('div');
    element.className = "image-display";

    element.style.background = `url('${post[urlParams.quality].url}')`;
    element.style.borderRadius = `${urlParams.br}px`;

    if (urlParams.nocopy !== "on") {
        switch (urlParams.clickact) {
            case "copy":
                addCopyAction(post, element);
                break;
            case "tab":
                addNewTabAction(post, element);
                break
            case "0":
                break
            default:
                break;
        }
    }

    document.body.appendChild(element);
});
