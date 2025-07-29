<script setup lang="ts">
import "mdui/components/menu-item.js";
import "mdui/components/select.js";

defineProps<{
    value: string;
}>();

defineEmits<{
    (e: "change", value: string): void;
}>();
</script>

<template>
    <div class="select">
        <span class="select-label">模式</span>
        <mdui-select
            :value="value"
            @change="
                (e: CustomEvent<void> & Event) => {
                    $emit('change', (e.target as HTMLSelectElement).value);
                }
            "
            placeholder="请选择模式"
            required
        >
            <mdui-menu-item value="check">校验</mdui-menu-item>
            <mdui-menu-item value="generate">生成</mdui-menu-item>
        </mdui-select>
    </div>
</template>
