const body = document.body

function displayErrorMessage(message) {
    const element = document.createElement('div');
    element.classList.add("error")
    element.innerHTML = `<p><b>Error</b>: ${message}</p>`;
    document.body.appendChild(element);
}

function translateVideoQualities(postData) {
    
    const available = postData.sample.alternates.samples; // Why

    let qualities = {
        file: postData.file.url,
        sample: postData.file.url,
        preview: postData.file.url
    }

    if (Object.hasOwn(available, "480p")) {
        qualities.sample = available["480p"].url
        qualities.preview = available["480p"].url
    }

    if (Object.hasOwn(available, "720p")) {
        qualities.sample = available["720p"].url
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

    element.setAttribute('data-copy', "")
    element.setAttribute('title', `Click to copy #${post.id}'s link`)
}

function addNewTabAction(post, element) {
    element.setAttribute('href', `https://e621.net/posts/${post.id}`)
    element.setAttribute('target', `_blank`);
    element.setAttribute('title', `Click to open #${post.id} in a new tab`)
}

const urlParams = getUrlParameters();

if (urlParams.fav === null) {
    displayErrorMessage(`No username specified`);
    throw new Error(`No username specified`);
}

const response = await fetch(`https://e621.net/posts.json?tags=fav:${urlParams.fav} ${urlParams.q} order:random limit:${urlParams.count} -young -type:swf ${urlParams.video === null ? '-type:webm -type:mp4' : ''}`)

if (!response.ok) {

    switch (response.status) {
        case 403:
            displayErrorMessage(`This user's favorties are unavailable, or e621's API is currently unavailable (403)`);
            break;
        case 503:
            displayErrorMessage(`e621 may be in maintenance mode, or you may be rate limited. (503)`);
            break;
        case 521:
            displayErrorMessage(`e621's server may be down (521)`)
            break;
        case 524:
            displayErrorMessage(`e621 took too long to respond to CloudFlare (524)`)
            break;
        default:
            displayErrorMessage(`e621 responded with non-2xx code (${response.status})`);
            break;
    }
    
    throw new Error(`e621 responded with code ${response.status}`);
}

const data = await response.json();

if (data.posts.length === 0) {
    displayErrorMessage(`e621 didn't return any posts. Check widget settings`);
    throw new Error(`e621 didn't return any posts. Check widget settings`);
}

body.style.cssText = `
    grid-template-columns: repeat(${urlParams.ppr}, 1fr);
    gap:${urlParams.gap}px;
`

const imageTemplate = document.getElementById("img-temp")

data.posts.forEach(post => {

    let mediaElement;

    if (post.file.ext === "webm" || post.file.ext === "mp4") {
        mediaElement = document.createElement('video');
        mediaElement.className = "video-display";

        let sources = translateVideoQualities(post);
        mediaElement.src = sources[urlParams.quality];

        mediaElement.poster = post.preview.url;

        mediaElement.autoplay = true;
        mediaElement.disablePictureInPicture = true;
        mediaElement.loop = true;
        mediaElement.muted = true;
        mediaElement.style.borderRadius = `${urlParams.br}px`;
    } else {
        mediaElement = imageTemplate.content.cloneNode(true);
        let progElement = mediaElement.getElementById("webp")
        let stdElement = mediaElement.getElementById("jpg")

        switch (urlParams.quality) {
            case "preview":
                progElement.srcset = post.preview.alt;
                stdElement.src = post.preview.url;
                break;
            case "sample":
                progElement.srcset = post.sample.has ? post.sample.alt : post.file.url;
                stdElement.src = post.sample.has ? post.sample.url : post.file.url;
                break;
            default:
                stdElement.src = post.file.url;
                break;
        }
        stdElement.style.borderRadius = `${urlParams.br}px`
    }

    let linkElement;
    linkElement = document.createElement("a");

    if (urlParams.nocopy !== "on") {
        switch (urlParams.act) {
            case "copy":
                addCopyAction(post, linkElement);
                break;
            case "tab":
                addNewTabAction(post, linkElement);
                break
            default:
                break;
        }
    }

    linkElement.appendChild(mediaElement);
    body.appendChild(linkElement);
});
