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
    <mdui-list-item :headline="displayName" rounded @click.self="emit('select')">
        <mdui-radio :checked="checked" slot="icon" @click="emit('select')"></mdui-radio>
    </mdui-list-item>
</template>
