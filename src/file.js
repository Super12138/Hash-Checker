let tempfile

export function getfileinfo(file){
    const wfilename = document.querySelector('#fm');
    const wfilesize = document.querySelector('#fsize');
    const wetips = document.querySelector('#etips');
    const wdate = document.querySelector('#fdate');

    if (!file || file.length == 0) {
        wfilename.innerHTML = "未选择文件";
        wfilesize.innerHTML = "未选择文件";
        console.log("未选择文件");
    } else {
        if (file.size >= 104857600) {
            wfilename.innerHTML = file.name;
            wfilesize.innerHTML = file.size + "&nbsp; Byte";
            wdate.innerHTML = file.lastModifiedDate;
            wetips.innerHTML = "文件大小较大，计算时间可能较长";
        } else {
            wfilename.innerHTML = file.name;
            wfilesize.innerHTML = file.size + "&nbsp; Byte";
            wdate.innerHTML = file.lastModifiedDate;
        }
        console.log(file);
    }
}

export function sendfile(file){
    tempfile = file
    console.log("收到了来自index.js发送到文件：" + tempfile)
}

export function getfile(){
    console.log("收到了来自index.js的请求：" + tempfile)
    return tempfile
}