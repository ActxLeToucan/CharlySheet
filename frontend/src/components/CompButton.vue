<template>
    <button
        class="flex w-fit h-fit border-2 rounded-md text-slate-700 dark:text-white dark:shadow-slate-800/[0.5] overflow-hidden transition-all"
        :class="`bg-${color}-500 border-${color}-500 ` + (disabled ? `opacity-50 cursor-default` : `hover:text-${color}-500 hover:dark:text-${color}-500 hover:shadow-slate-300 hover:dark:shadow-slate-800`)"
        @click="triggerOnClick"
    >
        <div
            class="flex grow w-fit justify-center items-center py-1 px-2 pr-1.5"
            :class="disabled? '' : 'shifted'"
        >
            <img
                v-if="typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'))"
                :src="icon"
                class="h-4"
                alt=""
            >
            <svg
                v-else-if="typeof icon === 'string'"
                xmlns="http://www.w3.org/2000/svg"
                :viewBox="viewBox"
                class="h-4 text-slate-200 transition-all"
                fill="currentColor"
            >
                <path :d="icon" />
            </svg>
            <component
                :is="icon"
                v-else
                class="h-5 text-slate-200 transition-all"
            />
        </div>
        <span class="flex grow -skew-x-12 transform-gpu bg-white dark:bg-slate-800 w-2 translate-x-1" />
        <p class="flex font-semibold grow min-h-fit py-1 pl-2 px-4 bg-white dark:bg-slate-800">
            <slot />
        </p>
        <span
            class="hidden bg-indigo-500 border-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-500
                   bg-red-500    border-red-500    hover:text-red-500    hover:dark:text-red-500
                   bg-green-500  border-green-500  hover:text-green-500  hover:dark:text-green-500
                   bg-blue-500   border-blue-500   hover:text-blue-500   hover:dark:text-blue-500
                   bg-yellow-500 border-yellow-500 hover:text-yellow-500 hover:dark:text-yellow-500"
        /> <!-- useless, just for tailwind to generate classes -->
    </button>
</template>

<script>

import {
    ChevronLeftIcon
} from '@heroicons/vue/24/outline';

export default {
    name: "CompButton",
    components: {
        ChevronLeftIcon
    },
    props: {
        icon: {
            type: [String, Object, Function],
            default: () => ChevronLeftIcon
        },
        viewBox: {
            type: String,
            default: '0 0 512 512'
        },
        color: {
            type: String,
            default: 'indigo'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        onclick: {
            type: Function,
            default: () => {}
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