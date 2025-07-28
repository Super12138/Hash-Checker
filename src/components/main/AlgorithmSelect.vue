<script setup lang="ts">
import "mdui/components/menu-item.js";
import "mdui/components/select.js";
</script>

<template>
    <div class="select">
        <span class="select-label">算法</span>
        <mdui-select value="unselected" required>
            <mdui-menu-item value="unselected" disabled>请选择算法</mdui-menu-item>
            <mdui-menu-item value="MD5">MD5</mdui-menu-item>
            <mdui-menu-item value="SHA1">SHA1</mdui-menu-item>
            <mdui-menu-item value="SHA3">SHA3</mdui-menu-item>
            <mdui-menu-item value="SHA256">SHA256</mdui-menu-item>
            <mdui-menu-item value="SHA384">SHA384</mdui-menu-item>
            <mdui-menu-item value="SHA512">SHA512</mdui-menu-item>
        </mdui-select>
    </div>
</template>
