const form = document.getElementById("form");
const outputBox = document.getElementById("output");
const showcaseBox = document.getElementById("showcase");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const url = new URL(window.location.href);
    url.pathname = "/embed.html"

    const data = new FormData(form);
    for (var [key, value] of data.entries()) {
        if (value !== "") {
            url.searchParams.append(key, value);
        }
    }

    const widget = document.createElement("iframe");
    widget.src = url.toString()
    widget.style.cssText = "width:100%;height:166px;border:none;"

    outputBox.innerHTML = widget.outerHTML;

    widget.style.cssText = "";
    showcaseBox.innerHTML = ""
    showcaseBox.appendChild(widget);
})