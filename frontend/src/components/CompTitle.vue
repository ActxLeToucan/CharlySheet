<template>
    <h1
        class="text-3xl md:text-4xl text-indigo-500 dark:text-slate-50 font-extrabold tracking-wider"
        :class="shadow ? 'shadow-highlight' : ''"
    >
        <slot />
    </h1>
</template>

<script>
export default {
    name: "CompTitle",
    components: {},
    props: {
        shadow: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {},
};
</script>
