const form = document.getElementById("form");
const outputBox = document.getElementById("output");
const showcaseBox = document.getElementById("showcase");
const usernameInput = document.getElementById("username");
const countInput = document.getElementById("count");
const pprInput = document.getElementById("ppr");
const gapInput = document.getElementById("gap");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const url = new URL(window.location.href);

    url.pathname = "/embed.html"
    url.searchParams.append("fav", usernameInput.value);
    if (countInput.value !== "") url.searchParams.append("count", countInput.value);
    if (pprInput.value !== "") url.searchParams.append("ppr", pprInput.value);
    if (gapInput.value !== "") url.searchParams.append("gap", gapInput.value);

    const widget = document.createElement("iframe");
    widget.src = url.toString()
    widget.style.cssText = "width:100%;height:166px;border:none;"

    outputBox.innerHTML = widget.outerHTML;

    widget.style.cssText = "";
    showcaseBox.innerHTML = ""
    showcaseBox.appendChild(widget);
})