const { execSync } = require('child_process');

// 执行命令
const execCommand = (command) => {
    console.log(`正在执行：${command}`);
    execSync(command, { stdio: 'inherit' });
};

// 执行webpack打包命令
const buildWebpack = () => {
    execCommand('webpack serve');
};

// 切换目录并执行npm install命令
const startElectron = () => {
    execCommand('electron .');
};

const main = () => {
    buildWebpack();
    startElectron();
};

main();