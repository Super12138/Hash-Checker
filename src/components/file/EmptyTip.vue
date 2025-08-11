<script setup lang="ts">
const props = defineProps<{
    tip: string;
}>();
</script>

<template>
    <h1>{{ props.tip }}</h1>
</template>

<style lang="css"></style>
