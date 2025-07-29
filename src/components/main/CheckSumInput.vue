<script setup lang="ts">
import "mdui/components/text-field.js";

defineProps<{
    value: string;
    enabled: boolean;
}>();

defineEmits<{
    (e: "input", value: string): void;
}>();
</script>

<template>
    <mdui-text-field
        label="校验值"
        helper="在此处粘贴您获取到的校验值"
        clearable
        :disabled="!enabled"
        :value="value"
        @input="
            (event: CustomEvent<void> & Event) => {
                $emit('input', (event.target as HTMLInputElement).value);
            }
        "
    ></mdui-text-field>
</template>

<style lang="css" scoped>
mdui-text-field {
    margin-bottom: 1.5rem;
}
</style>
