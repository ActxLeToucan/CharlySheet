<template>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-center">
        <p class="flex text-lg font-semibold grow min-h-fit pr-10">
            {{ label }}
        </p>
        <input
            class="flex p-1 w-fit h-fit border-2 rounded-md text-slate-700 dark:text-white bg-white dark:bg-slate-800 overflow-hidden transition-all"
            :class="`bg-${color}-500 border-${color}-500 ` + (disabled ? `opacity-50 cursor-default` : `hover:text-${color}-500 hover:dark:text-${color}-500 hover:shadow-slate-300 hover:dark:shadow-slate-800`)"
            :placeholder="placeholder"
            :type="type"
            :value="value"
            :name="name"
        >
        <span
            class="hidden bg-indigo-500 border-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-500
                    bg-red-500    border-red-500    hover:text-red-500    hover:dark:text-red-500
                    bg-green-500  border-green-500  hover:text-green-500  hover:dark:text-green-500
                    bg-blue-500   border-blue-500   hover:text-blue-500   hover:dark:text-blue-500
                    bg-yellow-500 border-yellow-500 hover:text-yellow-500 hover:dark:text-yellow-500"
        /> <!-- useless, just for tailwind to generate classes -->
    </div>
</template>

<script>

export default {
    name: "CompButton",
    components: {
        
    },
    props: {
        color: {
            type: String,
            default: 'indigo'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        return {};
    },
    mounted() {

    },
    methods: {
        triggerOnClick(ev) {
            if (!this.disabled) {
                this.onclick(ev);
            }
        }
    }
}
</script>

<style scoped>
button > .shifted {
    @apply translate-x-0 w-9 transition-all
}
button:hover > .shifted {
    @apply -translate-x-1 w-10
}
</style>