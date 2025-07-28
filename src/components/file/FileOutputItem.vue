<script setup lang="ts">
import "mdui/components/circular-progress.js";
import "mdui/components/list-item.js";

defineProps<{
    name: string;
    status: string;
    progress?: number;
}>();
</script>

<template>
    <mdui-list-item
        :headline="name"
        :description="status"
    >
        <mdui-circular-progress
            :value="progress"
            slot="end-icon"
        ></mdui-circular-progress>
    </mdui-list-item>
</template>
