<script setup lang="ts">
const props = defineProps<{
    tip: string;
}>();
</script>

<template>
    <h3>{{ props.tip }}</h3>
</template>

<style lang="css" scoped>
h3 {
    text-align: center;
}
</style>
