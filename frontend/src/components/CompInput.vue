<template>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-center">
        <p
            v-if="label"
            class="flex text-lg font-semibold grow min-h-fit pr-10"
        >
            <get-text :context="label" />
        </p>
        <input
            class="bg-slate-200 dark:bg-slate-800 rounded-md p-1 px-2 font-semibold placeholder-slate-400 dark:placeholder-slate-500
                   outline-2 hover:outline hover:outline-slate-300 hover:dark:outline-slate-600 focus:outline focus:outline-indigo-500"
            :placeholder="placeholder_str"
            :type="type"
            :value="value_str"
            :name="name"
        >
    </div>
</template>

<script>
import Lang from '../scripts/Lang';
import GetText from './text/GetText.vue';

export default {
    name: "CompButton",
    components: {
        GetText
        
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
            type: [String, Object],
            default: ''
        },
        placeholder: {
            type: [String, Object],
            default: ''
        },
        value: {
            type: [String, Object],
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
        return {
            placeholder_str: '',
            value_str: ''
        };
    },
    watch: {
        placeholder() {
            this.loadPlaceholderTranslations();
        },
        value() {
            this.loadValueTranslations();
        }
    },
    mounted() {
        this.loadPlaceholderTranslations();
        this.loadValueTranslations();
    },
    methods: {
        async loadPlaceholderTranslations() {
            this.placeholder_str = await Lang.GetTextAsync(this.placeholder);
        },
        async loadValueTranslations() {
            this.value_str = await Lang.GetTextAsync(this.value);
        },
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