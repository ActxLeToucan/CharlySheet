<template>
    <a
        :href="'/doc/' + doc.id"
        target="_blank"
        class="flex flex-col justify-center items-center w-40 h-60 md:w-56 md:h-80 border-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 overflow-hidden
                hover:bg-indigo-500/[0.1] hover:dark:bg-indigo-500/[0.1] hover:text-slate-800 hover:dark:text-slate-50 hover:border-indigo-500 hover:dark:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all"
    >
        <div class="flex grow justify-center items-center">
            <table-cells-icon class="w-16" />
        </div>
        <div class="flex flex-col h-20 justify-evenly w-full bg-slate-950/[0.2] dark:bg-slate-950/[0.5] p-2">
            <p class="text-lg font-semibold whitespace-nowrap text-ellipsis overflow-hidden"> {{ doc.name }} </p>
            <p class="text-base font-normal whitespace-nowrap text-ellipsis overflow-hidden"> {{ doc.owner.name }} </p>
        </div>
    </a>
</template>

<script>
import {
    TableCellsIcon
} from '@heroicons/vue/24/outline';

export default {
    name: "CompDoccard",
    components: {
        TableCellsIcon
    },
    props: {
        doc: {
            type: Object,
            required: true
        }
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