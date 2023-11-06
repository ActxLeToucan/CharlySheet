<template>
    <div class="flex grow flex-col min-h-full h-full max-w-full w-full">
        <comp-navbar />
        <div class="h-fit w-full min-h-0 max-h-full min-w-0 max-w-full overflow-scroll">
            <div class="flex flex-col grow p-4 space-y-8 text-slate-700 dark:text-slate-300">
                <div
                    v-for="(categ, index) in categs"
                    :key="categ.name"
                    class="show-up flex flex-col space-y-4"
                    :style="'animation-delay: '+index+'00ms;'"
                >
                    <p class="text-2xl font-semibold tracking-wide">
                        {{ categ.name }}
                    </p>
                    <div class="flex w-full overflow-auto">
                        <div class="flex w-fit space-x-4 py-3">
                            <comp-doccard
                                v-for="doc in categ.docs"
                                :key="doc.id"
                                :doc="doc"
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
import User from '../models/User';

const categs = [
    {
        name: 'Récents',
        docs: [
            {
                id: 1,
                name: "Mon premier tableau",
                owner: {
                    name: "Paul",
                    id: 1
                }
            }
        ]
    },
    {
        name: 'Mes tableaux personnels',
        docs: [
            {
                id: 1,
                name: "Mon premier tableau",
                owner: {
                    name: "Paul",
                    id: 1
                }
            }
        ],
        showNewCard: true
    },
    {
        name: 'Tableaux partagés avec moi',
        docs: [
            {
                id: 2,
                name: "Tableau de test",
                owner: {
                    name: "Antonin",
                    id: 2
                }
            },
            {
                id: 3,
                name: "Triple A",
                owner: {
                    name: "Antoine",
                    id: 3
                }
            },
            {
                id: 3,
                name: "Oulala ca va plus",
                owner: {
                    name: "Guillaume",
                    id: 3
                }
            }
        ]
    }
];

export default {
    name: "MyView",
    components: {
        CompNavbar,
        CompDoccard,
        CompNewdoccard
    },
    data() {
        return {
            categs
        };
    },
    mounted() {
        if (!User.currentUser) User.currentUser = new User({
            pseudo: "Paul",
            email: "paul@charlysheet.fr",
            color: "#FF0040"
        });
        // TODO : Remove that when connection is done
    },
    methods: {
        
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
