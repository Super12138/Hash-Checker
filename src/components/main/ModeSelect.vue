<script setup lang="ts">
import "mdui/components/menu-item.js";
import "mdui/components/select.js";
</script>

<template>
    <div class="select">
        <span class="select-label">模式</span>
        <mdui-select
            value="unselected"
            required
        >
            <mdui-menu-item
                value="unselected"
                disabled
                >请选择模式</mdui-menu-item
            >
            <mdui-menu-item value="check">校验</mdui-menu-item>
            <mdui-menu-item value="generate">生成</mdui-menu-item>
        </mdui-select>
    </div>
</template>
