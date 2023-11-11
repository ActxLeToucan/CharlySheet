<template>
    <button
        class="flex w-full h-full items-center justify-center border border-slate-200 dark:border-slate-600 hover:border-slate-400 hover:dark:border-slate-400"
    >
        <p class="w-fit h-fit"> {{ data.result }} </p>
    </button>
</template>

<script>
export default {
    name: "CompSheetslot",
    components: {
        
    },
    props: {
        data: {
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
