const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

let deleteCmd;
if (process.platform === 'win32') {
    deleteCmd = 'rd /s /q';
} else {
    deleteCmd = 'rm -rf';
}

let moveCmd;
if (process.platform === 'win32') {
    moveCmd = 'move';
} else {
    moveCmd = 'ov';
}


// 执行命令
function execCommand(command) {
    console.log(`正在执行：${command}`);
    execSync(command, { stdio: 'inherit' });
}

// 执行webpack打包命令
function buildWebpack() {
    // 先检测并删除dist目录
    if (fs.existsSync('./dist')) {
        execCommand(`${deleteCmd} ${path.join('.', 'dist')}`);
        console.log('dist 目录已删除');
    } else {
        console.log('dist 目录不存在');
    }

    // 先检测并删除out目录
    if (fs.existsSync('./out')) {
        execCommand(`${deleteCmd} ${path.join('.', 'out')}`);
        console.log('out 目录已删除');
    } else {
        console.log('out 目录不存在');
    }

    execCommand('webpack --mode=production --node-env=production');
}

// 切换目录并执行npm install命令
function installNpm() {
    execCommand('cd dist && npm install');
}

// 弹出选择框，选择并执行命令
function runCommand() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('请输入要打包的目标操作系统（Windows/macOS，输入w/m）：', (answer) => {
        if (answer.toLowerCase() === 'w') {
            execCommand('cd dist && npx electron-builder -w');
        } else if (answers.platform === 'm') {
            execCommand('cd dist && electron-builder -m');
        } else {
            console.log('输入无效');
        }
        rl.close();
        moveAndRemove();
    });
}

// 移动文件并删除目录
function moveAndRemove() {
    const srcDir = './dist/dist';
    const destDir = './out';

    // 检查源目录是否存在
    if (fs.existsSync(srcDir)) {
        execCommand(`${moveCmd} ${srcDir} ${destDir}`);
        execCommand(`${deleteCmd} ${path.join('.', 'dist')}`);
        console.log('项目打包完成');
    } else {
        console.log(`移动目录失败: ${srcDir} 目录不存在`);
    }
}

// 主函数，按顺序执行命令
function main() {
    buildWebpack();
    installNpm();
    runCommand();
}

main();