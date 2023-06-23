const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

// 执行命令
const execCommand = (command) => {
    console.log(`正在执行：${command}`);
    execSync(command, { stdio: 'inherit' });
};

// 执行webpack打包命令
const buildWebpack = () => {
    execCommand(`rm -rf ./out`);
    execCommand(`rm -rf ./dist`);
    execCommand('webpack --mode=production --node-env=production');
};

// 切换目录并执行npm install命令
const installNpm = () => {
    execCommand('cd dist && npm install');
};

// 弹出选择框，选择并执行命令
const runCommand = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('请输入要打包的目标操作系统（Windows/macOS，输入w/m）：', (answer) => {
        if (answer.toLowerCase() === 'w') {
            execCommand('cd dist && npm run build');
        } else if (answer.toLowerCase() === 'm') {
            execCommand('cd dist && npm run buildm');
        } else {
            console.log('输入无效，请重新运行脚本。');
        }

        rl.close();
        moveAndRemove();
    });
};

// 移动文件并删除目录
const moveAndRemove = () => {
    const path = './dist/dist';
    const newPath = './out';

    if (fs.existsSync(path)) {
        execCommand(`mv ${path} ${newPath}`);
        execCommand(`rm -rf ./dist`);
        console.log('完成文件移动');
        console.log('项目打包完成')
    } else {
        console.log(`${path}不存在`);
    }
}

// 主函数，按顺序执行命令
const main = () => {
    buildWebpack();
    installNpm();
    runCommand();
};

main();