<template>
    <div class="flex grow flex-col min-h-full h-fit max-w-full w-full justify-center items-center">
        <div class="flex flex-col justify-evenly items-center space-y-16">
            <comp-icon class="show-up w-32" />
            <div
                class="show-up flex flex-col items-center space-y-2"
                style="animation-delay: 0.1s;"
            >
                <comp-title>
                    Oups !
                </comp-title>
                <p class="text-center text-xl italic text-slate-600 dark:text-slate-300">
                    Cette page n'existe pas ou n'est pas encore disponible.
                </p>
            </div>
            <div
                class="show-up flex justify-center w-full h-fit"
                style="animation-delay: 0.2s;"
            >
                <comp-button
                    :icon="ChevronLeftIcon"
                    :onclick="() => $router.go(-1)"
                >
                    Retour
                </comp-button>
            </div>
        </div>
    </div>
</template>

<script>
import CompButton from '../components/CompButton.vue';
import CompIcon from '../components/CompIcon.vue';

import {
    ChevronLeftIcon
} from '@heroicons/vue/24/outline';
import CompTitle from '../components/CompTitle.vue';

export default {
    name: "404View",
    components: {
        CompIcon,
        CompButton,
        CompTitle
    },
    data() {
        return {
            ChevronLeftIcon
        };
    },
    mounted() {

    },
    methods: {
        
    }
}
</script>