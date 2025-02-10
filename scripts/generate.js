const outputBox = document.getElementById("output");
const showcaseBox = document.getElementById("showcase");

document.generateForm.reset();

document.generateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const url = new URL(window.location.href);
    url.pathname = "/embed.html"

    const data = new FormData(document.generateForm);
    for (var [key, value] of data.entries()) {
        if (key === "otherattribs") continue;
        if (value !== "") {
            url.searchParams.append(key, value);
        }
    }

    const widget = document.createElement("iframe");
    widget.src = url.toString()

    widget.style.cssText = "width:100%;height:166px;border:none;"

    const attribs = data.get("otherattribs")
    if (attribs !== "") {
        const attribsData = JSON.parse(attribs)
        for (var [key, value] of Object.entries(attribsData)) {
            try {
                widget.setAttribute(key, value);
            } catch (error) {
                console.warn(`Exception when tried to add attrib ${key} to widget. Skipped.`)
            }
        }
    }
    
    outputBox.innerHTML = widget.outerHTML;

    widget.style.cssText = "";
    showcaseBox.innerHTML = "";
    showcaseBox.appendChild(widget);
})