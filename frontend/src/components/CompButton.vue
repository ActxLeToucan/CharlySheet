<template>
    <button
        class="flex bg-white dark:bg-slate-800 w-fit h-fit outline-none border-2 border-transparent rounded-md text-slate-700 dark:text-white dark:shadow-slate-800/[0.5] overflow-hidden transition-all hover-resize"
        :class="`hover:border-slate-600 focus:outline-${color}-500 ` + (disabled ? `opacity-50 cursor-default` : `hover:text-slate-900 hover:dark:text-white hover:shadow-slate-300 hover:dark:shadow-slate-800`)"
        @click="triggerOnClick"
    >
        <div
            class="flex grow w-fit justify-center items-center py-1 px-2 hover-maximize transition-all rounded-r-sm"
            :class="`bg-${color}-500 ` + (disabled? '' : '')"
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
        <p class="flex font-semibold grow min-h-fit py-1 px-4 hover-minimize transition-all">
            <slot />
        </p>
        <span
            class="hidden bg-indigo-500 hover:border-indigo-500
                   bg-red-500           hover:border-red-500   
                   bg-green-500         hover:border-green-500 
                   bg-blue-500          hover:border-blue-500  
                   bg-yellow-500        hover:border-yellow-500"
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
.hover-resize:hover > .hover-maximize {
    @apply px-3;
}
.hover-resize:hover > .hover-minimize {
    @apply pl-3 pr-3;
}
</style>
