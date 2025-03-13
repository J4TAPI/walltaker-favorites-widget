function displayErrorMessage(message) {
    const element = document.createElement('div');
    element.innerHTML = `<b>Error</b>: ${message}`;
    element.style.color = "white";
    document.body.appendChild(element);
}

function translateVideoQualities(postData) {
    
    const available = postData.sample.alternates;

    let qualities = {
        file: postData.file.url,
        sample: postData.file.url,
        preview: postData.file.url
    }

    if (Object.hasOwn(available, "480p")) {
        qualities.sample = available["480p"].urls[0]
        qualities.preview = available["480p"].urls[0]
    }

    if (Object.hasOwn(available, "720p")) {
        qualities.sample = available["720p"].urls[0]
    }

    return qualities;
}

function getUrlParameters() {
    const searchParams = Object.fromEntries(new URLSearchParams(window.location.search));
    return {
        fav: null,
        q: "",
        count: 4, 
        ppr: 4,
        gap: 8,
        br: 6,
        quality: "sample",
        act: "copy",
        nocopy: "off",
        video: null,
        ...searchParams
    }
}

function addCopyAction(post, element) {
    element.addEventListener("click", () => {
        navigator.clipboard.writeText(`https://e621.net/posts/${post.id}`);
    })

    element.setAttribute('data-action', "copy")
    element.setAttribute('title', `Click to copy #${post.id}'s link`)
}

function addNewTabAction(post, element) {
    element.addEventListener("click", () => {
        window.open(`https://e621.net/posts/${post.id}`);
    })
    element.setAttribute('data-action', "tab")
    element.setAttribute('title', `Click to open #${post.id} in a new tab`)
}

const urlParams = getUrlParameters();

if (urlParams.fav === null) {
    displayErrorMessage(`No username specified`);
    throw new Error(`No username specified`);
}

const response = await fetch(`https://e621.net/posts.json?tags=fav:${urlParams.fav} ${urlParams.q} order:random limit:${urlParams.count} -young -type:swf ${urlParams.video === null ? '-type:webm' : ''}`)

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

    let element;

    if (post.file.ext === "webm") {
        element = document.createElement('video');
        element.className = "video-display";

        let sources = translateVideoQualities(post);
        element.src = sources[urlParams.quality];

        element.poster = post.preview.url;

        element.autoplay = true;
        element.disablePictureInPicture = true;
        element.loop = true;
        element.muted = true;
    } else {
        element = document.createElement('img')
        element.className = "image-display";

        element.src = post[urlParams.quality].url
    }

    element.style.borderRadius = `${urlParams.br}px`;

    if (urlParams.nocopy !== "on") {
        switch (urlParams.act) {
            case "copy":
                addCopyAction(post, element);
                break;
            case "tab":
                addNewTabAction(post, element);
                break
            default:
                break;
        }
    }

    document.body.appendChild(element);
});
