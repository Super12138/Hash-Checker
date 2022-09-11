const { shell } = require('electron');

let uplink = document.querySelector("#uplink");
uplink.onclick = (e) => {
    e.preventDefault();
    let href = uplink.getAttribute("href");
    shell.openExternal(href);
}
