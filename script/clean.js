const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let deleteCmd;
if (process.platform === 'win32') {
    deleteCmd = 'rd /s /q';
} else {
    deleteCmd = 'rm -rf';
}

function execCommand(command) {
    console.log(`正在执行：${command}`);
    execSync(command, { stdio: 'inherit' });
}

function deleteFolder(){
    if (fs.existsSync('./dist')) {
        execCommand(`${deleteCmd} ${path.join('.', 'dist')}`);
        console.log('dist 目录已删除');
    } else {
        console.log('dist 目录不存在');
    }

    if (fs.existsSync('./out')) {
        execCommand(`${deleteCmd} ${path.join('.', 'out')}`);
        console.log('out 目录已删除');
    } else {
        console.log('out 目录不存在');
    }

    if (fs.existsSync('./package-lock.json')) {
        execCommand(`${deleteCmd} ${path.join('.', 'package-lock.json')}`);
        console.log('package-lock.json 已删除');
    } else {
        console.log('package-lock.json 不存在');
    }
}

deleteFolder();