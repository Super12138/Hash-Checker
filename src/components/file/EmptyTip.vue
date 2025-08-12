<script setup lang="ts">
const props = defineProps<{
    tip: string;
}>();
</script>

<template>
    <div>
        <h3>{{ props.tip }}</h3>
    </div>
</template>

<style lang="css" scoped>
div {
    text-align: center;
}
</style>
