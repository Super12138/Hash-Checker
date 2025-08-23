<script setup lang="ts">
const props = defineProps<{
    tip: string;
}>();
</script>

<template>
    <span>{{ props.tip }}</span>
</template>

<style lang="css" scoped>
span {
    display: block;
    text-align: center;
    line-height: var(--mdui-typescale-body-large-line-height);
    font-size: var(--mdui-typescale-body-large-size);
    letter-spacing: var(--mdui-typescale-body-large-tracking);
    font-weight: var(--mdui-typescale-body-large-weight);
}
</style>
