<script setup lang="ts">
import "mdui/components/list-item.js";

defineProps<{
    icon: string;
    name: string;
    description?: string;
}>();
</script>

<template>
    <mdui-list-item :headline="name" :description="description">
        <component :is=""></component>
        <mdui-icon-info--outlined slot="icon"></mdui-icon-info--outlined>
    </mdui-list-item>
</template>
