<template>
    <div class="show-down flex h-fit border-b-2 border-slate-200 dark:border-slate-800 p-2">
        <div class="flex items-center w-[30%]">
            <comp-icon
                class="w-10"
            />
        </div>
        <div class="flex items-center mx-auto">
            <comp-title class="text-slate-600 dark:text-slate-200">
                <get-text :context="Lang.CreateTranslationContext('my', 'Documents')" />
            </comp-title>
        </div>
        <div class="flex items-center w-[30%] justify-end">
            <comp-button
                :icon="Cog8ToothIcon"
                :onclick="parameter"
            >
                <get-text :context="Lang.CreateTranslationContext('my', 'Param')" />
            </comp-button>
        </div>
    </div>
</template>

<script>
import CompTitle from './CompTitle.vue'

import {
    Cog8ToothIcon,
    // ChevronLeftIcon
} from '@heroicons/vue/24/outline';
import User from '../models/User';
import CompButton from './CompButton.vue';
import GetText from './text/GetText.vue';
import Lang from '../scripts/Lang';
import CompIcon from './CompIcon.vue';

export default {
    name: "CompNavbar",
    components: {
        CompTitle,
        CompButton,
        GetText,
        CompIcon,
    // ChevronLeftIcon
    },
    data() {
        return {
            Lang,
            Cog8ToothIcon
        };
    },
    mounted() {

    },
    methods: {
        parameter() {
            this.$router.push({name: 'Parameters'});
        }
    }
}
</script>
