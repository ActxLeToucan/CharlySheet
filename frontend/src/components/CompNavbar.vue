<template>
    <div class="show-down flex h-fit border-b-2 border-slate-800 p-2">
        <div class="flex items-center w-[30%]">
            <comp-icon class="w-10" />
        </div>
        <div class="flex items-center mx-auto">
            <comp-title>
                <get-text :context="Lang.CreateTranslationContext('my', 'Documents')" />
            </comp-title>
        </div>
        <div class="flex items-center w-[30%] justify-end">
            <comp-button
                :icon="UserMinusIcon"
                :onclick="disconnect"
            >  
                <get-text :context="Lang.CreateTranslationContext('verbs', 'LogOut')" />
            </comp-button>
        </div>
    </div>
</template>

<script>
import CompTitle from './CompTitle.vue'

import {
    UserMinusIcon,
    // ChevronLeftIcon
} from '@heroicons/vue/24/outline';
import User from '../scripts/User';
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
            UserMinusIcon
        };
    },
    mounted() {
        
    },
    methods: {
        disconnect() {
            User.forget();
            this.$router.push({ name: 'Home' });
        }
    }
}
</script>
