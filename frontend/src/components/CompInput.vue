<template>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-center">
        <p
            v-if="label"
            class="flex text-lg font-semibold grow min-h-fit pr-10"
        >
            <get-text :context="label" />
        </p>
        <input
            class="flex p-1 w-fit h-fit border-2 rounded-md text-slate-700 dark:text-white bg-white dark:bg-slate-800 overflow-hidden transition-all"
            :class="`bg-${color}-500 border-${color}-500 ` + (disabled ? `opacity-50 cursor-default` : `hover:text-${color}-500 hover:dark:text-${color}-500 hover:shadow-slate-300 hover:dark:shadow-slate-800`)"
            :placeholder="placeholder_str"
            :type="type"
            :value="value_str"
            :name="name"
        >
        <span
            class="hidden bg-indigo-500 border-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-500
                    bg-red-500    border-red-500    hover:text-red-500    hover:dark:text-red-500
                    bg-green-500  border-green-500  hover:text-green-500  hover:dark:text-green-500
                    bg-blue-500   border-blue-500   hover:text-blue-500   hover:dark:text-blue-500
                    bg-yellow-500 border-yellow-500 hover:text-yellow-500 hover:dark:text-yellow-500"
        /> <!-- useless, just for tailwind to generate classes -->
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