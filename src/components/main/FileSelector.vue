<script setup lang="ts">
import "mdui/components/card.js";

import "@mdui/icons/upload-file--outlined.js";
</script>

<template>
    <mdui-card
        variant="outlined"
        clickable
    >
        <mdui-icon-upload-file--outlined></mdui-icon-upload-file--outlined>
        <p>点击选择文件</p>
        <strong>或拖拽文件到本页</strong>
        <p class="file-info">xxx.exe (3 MB)</p>
    </mdui-card>
</template>

<style lang="css" scoped>
.file-info {
    color: rgb(var(--mdui-color-on-surface-variant));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    width: 100%;
}

.strong {
    color: rgb(var(--mdui-color-on-surface-variant));
    line-height: var(--mdui-typescale-label-medium-line-height);
    font-size: var(--mdui-typescale-label-medium-size);
    letter-spacing: var(--mdui-typescale-label-medium-tracking);
    font-weight: var(--mdui-typescale-label-medium-weight);
}

p {
    margin: 0;
}

mdui-icon-upload-file--outlined {
    font-size: var(--mdui-typescale-headline-large-size);
    display: block;
    margin-bottom: 0.8rem;
}

mdui-card {
    width: auto;
    max-width: 400px;
    height: auto;
    max-height: 200px;
    user-select: none;
    padding: 1rem 2.5rem 1rem 2.5rem;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}
</style>
