<template>
    <div class="flex grow flex-col min-h-full h-full max-w-full w-full">
        <div class="flex p-2 w-full h-fit items-center justify-center">
            <div class="flex w-fit h-full items-center justify-center pr-2">
                <document-icon class="w-14 h-full text-indigo-500 bg-slate-200 dark:bg-slate-800 rounded-lg p-1" />
            </div>
            <div class="flex flex-col w-full h-full">
                <div class="flex w-full h-fit">
                    <div class="">
                        <input
                            class="bg-slate-200 dark:bg-slate-800 rounded-md focus:outline outline-2 outline-indigo-500 py-0.5 px-1.5 font-semibold"
                            type="text"
                            value="Nouveau document"
                        >
                    </div>
                    <div>

                    </div>
                </div>
                <div class="w-full h-8">

                </div>
            </div>
        </div>
        <div class="flex grow min-h-0 max-h-full">
            <div class="flex flex-col grow min-w-0 overflow-hidden">
                <div
                    ref="col-bar"
                    class="ml-32 flex grow h-fit overflow-hidden"
                >
                    <div class="flex w-fit h-fit">
                        <div
                            v-for="col in nbCols"
                            :key="col"
                            class="w-32 h-8 bg-slate-200 dark:bg-slate-600 items-center justify-center px-[1px] py-[2px]"
                        >
                            <p class="flex grow w-full h-full h-full justify-center items-center bg-slate-50 dark:bg-slate-700">{{ getIndexName(col - 1) }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex min-w-0 w-full min-h-0 h-full">
                    <div
                        ref="row-bar"
                        class="flex min-w-fit w-fit min-h-0 h-full overflow-hidden"
                    >
                        <div class="flex flex-col w-fit h-fit">
                            <div
                                v-for="row in nbRows"
                                :key="row"
                                class="w-32 h-8 bg-slate-200 dark:bg-slate-600 items-center justify-center px-[2px] py-[1px]"
                            >
                                <p class="flex grow h-full justify-center items-center bg-slate-50 dark:bg-slate-700">{{ getIndexName(row - 1) }}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        ref="grid-container"
                        class="flex grow w-full h-full overflow-auto"
                    >
                        <div class="w-fit h-fit">
                            <div
                                v-for="row in nbRows"
                                :key="row"
                                class="flex"
                            >
                                <div
                                    v-for="col in nbCols"
                                    :key="col"
                                    class="w-32 h-8 items-center justify-center"
                                >
                                    <comp-sheetslot :data="getSlotAt(col, row)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CompSheetslot from '../components/CompSheetslot.vue';
import Slot from '@/models/Slot';

import {
    DocumentIcon
} from '@heroicons/vue/24/outline';
import CompInput from '../components/CompInput.vue';

export default {
    name: "DocView",
    components: {
        CompSheetslot,
        DocumentIcon,
        CompInput
    },
    data() {
        return {
            MODE_NEW: 0,
            MODE_EDIT: 1,
            docMode: (this.$route.params.id === "new" ? 0 : 1),
            docId: this.$route.params.id,
            nbRows: 30,
            nbCols: 19,
        };
    },
    mounted() {
        /** @type {HTMLDivElement} */
        const container = this.$refs['grid-container'];
        /** @type {HTMLDivElement} */
        const rowBar = this.$refs['row-bar'];
        /** @type {HTMLDivElement} */
        const colBar = this.$refs['col-bar'];

        container.addEventListener('scroll', ev => {
            rowBar.scrollTo(0, ev.target.scrollTop);
            colBar.scrollTo(ev.target.scrollLeft, 0);
        });

        window.colBar = colBar;
        window.rowBar = rowBar;
    },
    methods: {
        getIndexName(index) {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const nbLetters = alphabet.length;
            let name = "";
            while (index >= nbLetters) {
                name = alphabet[index % nbLetters] + name;
                index = Math.floor(index / nbLetters) - 1;
            }
            return alphabet[index] + name;
        },
        getSlotAt(x, y) {
            return new Slot();
        }
    }
}

</script>
