const reverseInBox = document.getElementById("reverseIn");

function widgetIsValid(element) {
    if (element.tagName !== "IFRAME") return false;
    const url = new URL(element.src);
    if (url.host !== window.location.host) return false;
    if (url.pathname !== "/embed.html") return false;
    
    return true;
}

document.reverseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const temp = document.createElement('p')
    temp.innerHTML = reverseInBox.value;

    const widget = temp.firstChild;
    if(!widgetIsValid(widget)) {
        alert("Not a valid widget");
        return;
    }

    const url = new URL(widget.src);
    for (var [key, value] of url.searchParams.entries()) {
        if (key === "nocopy") {
            document.generateForm["clickact"].value = (value === "on") ? "none" : "copy";
        } else {
            document.generateForm[key].value = value;
        }
    }
})