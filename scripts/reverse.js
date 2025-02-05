const reverseInBox = document.getElementById("reverseIn");
const attribsTransferBox = document.getElementById("oldwidgetattribs");

function widgetIsValid(element) {
    if (element.tagName !== "IFRAME") return false;
    const url = new URL(element.src);
    if (url.host !== window.location.host) return false;
    if (url.pathname !== "/embed.html") return false;
    
    return true;
}

reverseInBox.value = "";
attribsTransferBox.value = "";

document.reverseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(document.generateForm);

    const temp = document.createElement('p')
    temp.innerHTML = reverseInBox.value;

    const widget = temp.firstChild;
    if(!widgetIsValid(widget) && data.get("isvalid") == false) {
        alert("Not a valid widget");
        return;
    }

    const url = new URL(widget.src);
    for (var [key, value] of url.searchParams.entries()) {
        if (key === "nocopy") {
            document.generateForm["clickact"].value = (value === "on") ? "" : "copy";
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

    console.log(widgetAttributes)
 
    attribsTransferBox.value = JSON.stringify(widgetAttributes);
})