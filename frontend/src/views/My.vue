<template>
    <div class="flex grow flex-col min-h-full h-full max-w-full w-full">
        <comp-navbar />
        <div class="h-fit w-full min-h-0 max-h-full min-w-0 max-w-full overflow-scroll">
            <div class="flex flex-col grow p-4 space-y-8 text-slate-700 dark:text-slate-300">
                <div
                    v-for="(categ, index) in categs"
                    v-show="categ.docs.length > 0 || categ.id === 'ME'"
                    :key="categ.name"
                    class="show-up flex flex-col space-y-4"
                    :style="'animation-delay: '+index+'00ms;'"
                >
                    <p class="text-2xl font-semibold tracking-wide">
                        <get-text :context="categ.name" />
                    </p>
                    <div class="flex w-full overflow-auto">
                        <div class="flex w-fit space-x-4 py-3">
                            <comp-doccard
                                v-for="doc in categ.docs"
                                :key="doc.id"
                                :doc="doc"
                                :on-delete="retreiveSheets"
                            />
                            <comp-newdoccard v-if="categ.showNewCard" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CompNavbar from '../components/CompNavbar.vue';
import CompDoccard from '../components/CompDoccard.vue';
import CompNewdoccard from '../components/CompNewdoccard.vue';
import Lang from '../scripts/Lang';
import GetText from '../components/text/GetText.vue';
import API from '../scripts/API';
import Notify from '../scripts/Notify';

export default {
    name: "MyView",
    components: {
        CompNavbar,
        CompDoccard,
        CompNewdoccard,
        GetText
    },
    data() {
        return {
            categs: [
                {
                    name: Lang.CreateTranslationContext('my', 'Recent'),
                    id: "RECENTS",
                    docs: []
                },
                {
                    name: Lang.CreateTranslationContext('my', 'Personnal'),
                    id: "ME",
                    docs: [],
                    showNewCard: true
                },
                {
                    name: Lang.CreateTranslationContext('my', 'Shared'),
                    id: "SHARED",
                    docs: []
                }
            ],
            continousUpdate: true
        };
    },
    mounted() {
        this.retreiveSheets();

        if (this.continousUpdate) {
            const interval = setInterval(() => {
                this.retreiveSheets()
                    .then(() => {})
                    .catch(async e => {
                        Notify.error(
                            await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'Error')),
                            await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'Unknown', {msg: e.message}))
                        );
                        clearInterval(interval);
                    });
            }, 2000);
        }
    },
    methods: {
        async retreiveSheets() {
            const ME = await API.execute_logged(API.ROUTE.SHEETS.ME());
            const RECENTS = await API.execute_logged(API.ROUTE.SHEETS.RECENTS());
            const SHARED = await API.execute_logged(API.ROUTE.SHEETS.SHARED());

            this.categs.find(c => c.id === "ME").docs = ME;
            this.categs.find(c => c.id === "RECENTS").docs = RECENTS;
            this.categs.find(c => c.id === "SHARED").docs = SHARED;
        }
    }
}

</script>

<style scoped>
@keyframes bg-scroll {
    0% { background-position: 0 0; }
    100% { background-position: 100% 0; }
}

.back-img {
    background-image: url('/img/background.png');
    background-size: 35em;
    background-position: 0 0;
    background-repeat: repeat;
    animation: bg-scroll 200s linear infinite;
}
</style>
