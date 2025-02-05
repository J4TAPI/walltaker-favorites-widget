const outputBox = document.getElementById("output");
const showcaseBox = document.getElementById("showcase");
const oldWidgetAttribsBox = document.getElementById("oldwidgetattribs")

document.generateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const url = new URL(window.location.href);
    url.pathname = "/embed.html"

    const data = new FormData(document.generateForm);
    for (var [key, value] of data.entries()) {
        if (key === "oldwidgetattribs") continue;
        if (value !== "") {
            url.searchParams.append(key, value);
        }
    }

    const widget = document.createElement("iframe");
    widget.src = url.toString()

    widget.style.cssText = "width:100%;height:166px;border:none;"

    if (oldWidgetAttribsBox.value !== "") {
        const oldWidgetAttribs = JSON.parse(oldWidgetAttribsBox.value);
        console.log(oldWidgetAttribs);
        for (var [key, value] of Object.entries(oldWidgetAttribs)) {
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