<script setup lang="ts">
import "mdui/components/circular-progress.js";
import "mdui/components/list-item.js";
</script>

<template>
    <mdui-list-item headline="Headline" description="Supporting text">
        <mdui-circular-progress slot="end-icon"></mdui-circular-progress>
    </mdui-list-item>
</template>
