<template>
    <div class="flex grow flex-col min-h-full h-full max-w-full w-full">
        <comp-navbar />
        <div class="h-fit w-full min-h-0 max-h-full min-w-0 max-w-full overflow-scroll">
            <div class="flex flex-col grow p-4 space-y-8 text-slate-700 dar:text-slate-300">
                <div
                    class="show-up flex flex-col space-y-4"
                    style="animation-delay: 0.0s;"
                >
                    <p class="text-2xl font-semibold tracking-wide">
                        Récents
                    </p>
                    <div class="flex w-full space-x-4 ">
                        <comp-doccard
                            v-for="doc in recentDocs"
                            :key="doc.id"
                            :doc="doc"
                        />
                    </div>
                </div>
                <div
                    class="show-up flex flex-col space-y-4"
                    style="animation-delay: 0.1s;"
                >
                    <p class="text-2xl font-semibold tracking-wide">
                        Mes tableaux personnels
                    </p>
                    <div class="flex w-full space-x-4 ">
                        <comp-doccard
                            v-for="doc in myDocs"
                            :key="doc.id"
                            :doc="doc"
                        />
                        <comp-newdoccard />
                    </div>
                </div>
                <div
                    class="show-up flex flex-col space-y-4"
                    style="animation-delay: 0.2s;"
                >
                    <p class="text-2xl font-semibold tracking-wide">
                        Tableaux partagés avec moi
                    </p>
                    <div class="flex w-full space-x-4 ">
                        <comp-doccard
                            v-for="doc in sharedDocs"
                            :key="doc.id"
                            :doc="doc"
                        />
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

const myDocs = [
    {
        id: 1,
        name: "Mon premier tableau",
        owner: {
            name: "Paul",
            id: 1
        }
    }
];

const sharedDocs = [
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
    }
];

const recentDocs = [myDocs[0]];

export default {
    name: "MyView",
    components: {
        CompNavbar,
        CompDoccard,
        CompNewdoccard
    },
    data() {
        return {
            myDocs,
            sharedDocs,
            recentDocs
        };
    },
    mounted() {
        
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
