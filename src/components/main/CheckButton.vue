<script setup lang="ts">
defineEmits<{
    (e: "click"): void;
}>();
</script>

<template>
    <mdui-button full-width @click="$emit('click')">检查 </mdui-button>
</template>
