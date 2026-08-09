<template>
    <section class="v-blocks">
        <component
            :is="blockComponentName(block.type)"
            v-for="block in visibleBlocks"
            :key="block.id"
            :block="block"
            :images="images"
            :files="files"
        />
    </section>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
    blocks?: KqlBlock[]
    images?: KqlFile[]
    files?: KqlFile[]
}>()

const visibleBlocks = computed(() => (props.blocks ?? []).filter(block => !block.isHidden))

function blockComponentName(type: string): string {
    const pascal = type
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

    return `Blocks${pascal}`
}
</script>

<style lang="scss" scoped>
.v-blocks {
}
</style>
