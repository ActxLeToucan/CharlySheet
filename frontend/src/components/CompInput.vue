<template>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-center md:space-x-8">
        <p
            v-if="label"
            class="flex text-lg font-semibold grow min-h-fit"
        >
            <get-text :context="label" />
        </p>
        <input
            class="bg-slate-200 dark:bg-slate-800 rounded-md p-1 px-2 font-semibold placeholder-slate-400 dark:placeholder-slate-500 outline-none
                   border-2 border-transparent transition-all"
            :class="(expand? ' w-full': '') + (disabled? ' opacity-50 select-none': ' hover:dark:border-slate-600 hover:border-slate-300 focus:outline focus:outline-indigo-500')"
            :placeholder="placeholder_str"
            :type="type"
            :value="value_str"
            :name="name"
            :disabled="disabled"
            :autocomplete="autocomplete"
            :autocapitalize="autocapitalize"
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
        },
        autocomplete: {
            type: String,
            default: 'on'
        },
        autocapitalize: {
            type: String,
            default: 'on'
        },
        expand: {
            type: Boolean,
            default: false
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