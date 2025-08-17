<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/radio.js";

defineProps<{
    displayName: string;
    checked: boolean;
}>();

const emit = defineEmits<{
    (e: "select"): void;
}>();
</script>

<template>
    <mdui-list-item :headline="displayName" @click.self="emit('select')">
        <mdui-radio :checked="checked" slot="icon" @click="emit('select')"></mdui-radio>
    </mdui-list-item>
</template>

<style lang="css" scoped>
mdui-list-item {
    --shape-corner: var(--mdui-shape-corner-large);
}
</style>
