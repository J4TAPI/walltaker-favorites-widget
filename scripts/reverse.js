function widgetIsValid(element) {
    if (element.tagName !== "IFRAME") return false;
    const url = new URL(element.src);
    if (url.pathname !== "/embed.html") return false;
    
    return true;
}

document.autofillForm.reset();

document.autofillForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(document.autofillForm);

    const widget = new DOMParser().parseFromString(data.get("widgetCode"), "text/html").body.firstChild;
    if(!widgetIsValid(widget)) {
        alert("Not a valid widget");
        return;
    }

    const url = new URL(widget.src);

    if (!Object.hasOwn(url.searchParams, "act")) {
        document.generateForm["act"].value = "copy";
    }

    for (var [key, value] of url.searchParams.entries()) {
        if (key === "nocopy") {
            document.generateForm["act"].value = (value === "on") ? "0" : "copy";
        } else {
            document.generateForm[key].value = value;
        }
    }

    const widgetAttributes = {}
    for (let i = 0; i < widget.attributes.length; i++) {
        const attribute = widget.attributes[i];
        if (attribute.nodeName === "src") continue;
        widgetAttributes[attribute.nodeName] = attribute.nodeValue
    }
 
    document.generateForm.otherattribs.value = JSON.stringify(widgetAttributes);
})