<template>
    <Transition name="fade" mode="out-in">
        <slot></slot>
    </Transition>
</template>

<style lang="css" scoped>
/* Transition 组件淡入淡出动画（Fade） */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
