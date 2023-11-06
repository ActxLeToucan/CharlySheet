<template>
    <div class="show-down flex h-fit border-b-2 border-slate-800 p-2">
        <div class="flex items-center w-[30%]">
            <button
                class="text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-200 hover:dark:bg-slate-600 hover:text-slate-700 hover:dark:text-slate-200 transition-all"
                @click="() => $router.go(-1)"
            >
                <chevron-left-icon class="w-6 md:w-8" />
            </button>
        </div>
        <div class="flex items-center mx-auto">
            <comp-title>CharlySheet</comp-title>
        </div>
        <div class="flex items-center w-[30%] justify-end">
            <button class="text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-200 hover:dark:bg-slate-600 hover:text-slate-700 hover:dark:text-slate-200 transition-all">
                <user-icon class="w-6 md:w-8" />
            </button>
        </div>
    </div>
</template>

<script>
import CompTitle from './CompTitle.vue'

import {
    UserIcon,
    ChevronLeftIcon
} from '@heroicons/vue/24/outline';

export default {
    name: "CompNavbar",
    components: {
        CompTitle,
        UserIcon,
        ChevronLeftIcon
    },
    data() {
        return {
            
        };
    },
    mounted() {
        
    },
    methods: {
        
    }
}
</script>
