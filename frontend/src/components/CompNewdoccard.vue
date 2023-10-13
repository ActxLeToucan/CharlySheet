<template>
    <router-link
        class="flex justify-center items-center w-56 h-80 border-2 border-dashed rounded-lg text-slate-500 dark:text-slate-800 border-slate-400 dark:border-slate-800
                hover:text-slate-700 hover:dark:text-slate-200 hover:border-indigo-600 hover:dark:border-indigo-500 hover:bg-indigo-500/[0.1] hover:dark:bg-indigo-500/[0.1] transition-all"
        to="/doc/new"
    >
        <plus-icon class="w-16" />
    </router-link>
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
