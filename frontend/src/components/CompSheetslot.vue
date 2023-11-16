<template>
    <button
        class="flex w-full h-full items-center justify-center border border-slate-200 dark:border-slate-600 hover:border-slate-400 hover:dark:border-slate-400"
        @click="onClick"
    >
        <p class="w-fit h-fit whitespace-nowrap text-ellipsis overflow-hidden max-w-full p-1"> {{ displayMode === 'formula' ? formula : result }} </p>
    </button>
</template>

<script>
import { toRaw } from 'vue';
import User from '../models/User';
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
            formula: '',
            result: '',
            displayMode: 'formula'
        };
    },
    mounted() {
        this.slot = toRaw(this.data);
        this.slot.on('formula', formula => this.formula = formula);
        this.slot.on('result', result => {
            this.result = result;
        });
        User.currentUser.on('slot', () => {
            if (User.currentUser.slot == this.slot) this.displayMode = 'formula';
            else this.displayMode = 'result';
        });
    },
    methods: {
        onClick(ev) {
            User.currentUser.slot = this.slot;
        }
    }
}
</script>
