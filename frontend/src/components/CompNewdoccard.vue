<template>
    <a
        class="flex justify-center items-center w-40 h-60 md:w-56 md:h-80 border-2 border-dashed rounded-lg text-slate-500 dark:text-slate-400 border-slate-400 dark:border-slate-500
                hover:text-slate-700 hover:dark:text-slate-200 hover:border-indigo-600 hover:dark:border-indigo-500 hover:bg-indigo-500/[0.1] hover:dark:bg-indigo-500/[0.1] transition-all"
        href="/doc/new"
        target="_blank"
    >
        <plus-icon class="w-16" />
    </a>
</template>

<script>
import {
    PlusIcon
} from '@heroicons/vue/24/outline';

export default {
    name: "CompNewdoccard",
    components: {
        PlusIcon
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
