<script setup lang="ts"></script>

<template>
    <div>
        <h1>松开鼠标以读取文件</h1>
    </div>
</template>

<style lang="css" scoped>
div {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(var(--mdui-color-scrim), 0.8);
    z-index: 2100;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    backdrop-filter: blur(3px);
    text-align: center;
    display: flex;
    align-items: center;
}

h1 {
    width: fit-content;
    margin: auto;
    line-height: var(--mdui-typescale-display-small-line-height);
    font-size: var(--mdui-typescale-display-small-size);
    letter-spacing: var(--mdui-typescale-display-small-tracking);
    font-weight: var(--mdui-typescale-display-small-weight);
}
</style>
