<template>
    <div class="flex grow flex-col min-h-full h-full max-w-full w-full">
        <div class="flex p-2 w-full h-fit items-center justify-center">
            <div class="flex w-fit h-full items-center justify-center pr-2">
                <document-icon class="show-right w-14 h-full text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 rounded-lg p-1" />
            </div>
            <div class="flex flex-col w-full h-full space-y-2">
                <div class="flex w-full h-fit">
                    <div class="show-down flex space-x-4 items-center justify-center">
                        <button
                            v-for="menu in menus"
                            :key="menu.name"
                            class="flex items-center justify-center w-fit py-1 px-2 rounded-md text-slate-700 dark:text-slate-200
                                   hover:bg-slate-200 hover:dark:bg-slate-600 transition-all"
                        >
                            {{ menu.name }}
                        </button>
                    </div>
                </div>
                <div class="show-right flex w-full h-fit">
                    <comp-input
                        :value="doc?.name ?? Lang.CreateTranslationContext('doc', 'NewDocument')"
                        @input="setDocName($event.target.value)"
                    />
                    <div class="flex space-x-2 pl-8 w-full">
                        <comp-input
                            ref="formula-input"
                            class="md:space-x-2 w-full"
                            label="Fx"
                            :expand="true"
                            :value="currentFormula || ''"
                            :disabled="!currentSlot"
                            @change="ev => { if (currentSlot) User.currentUser.slot.formula = ev.target.value }"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="show-up flex grow min-h-0 max-h-full bg-slate-200 dark:bg-slate-600">
            <div class="flex flex-col grow min-w-0 overflow-hidden">
                <div class="flex grow h-fit w-full">
                    <span class="min-w-[128px] h-8 border-[2px] border-r-[1px] border-b-[1px] border-slate-300 dark:border-slate-500" />
                    <div
                        ref="col-bar"
                        class="flex w-full h-fit overflow-hidden"
                    >
                        <div class="flex w-fit h-fit">
                            <div
                                v-for="col in nbCols"
                                :key="col"
                                class="w-32 h-8 items-center justify-center border-t-[2px] border-[1px] border-slate-300 dark:border-slate-500"
                            >
                                <p class="flex grow w-full h-full h-full justify-center items-center">
                                    {{ getIndexName(col - 1) }}
                                </p>
                            </div>
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
                                class="w-32 h-8 items-center justify-center border-[1px] border-l-[2px] border-slate-300 dark:border-slate-500"
                            >
                                <p class="flex grow h-full justify-center items-center">
                                    {{ row }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        ref="grid-container"
                        class="flex grow relative w-full h-full overflow-auto bg-slate-50 dark:bg-slate-700"
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
                                    class="w-32 h-8 items-center justify-center comp-sheetslot"
                                >
                                    <comp-sheetslot
                                        :data="getSlotAt(col-1, row-1)"
                                        :data-x="col-1"
                                        :data-y="row-1"
                                    />
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
import CompInput from '../components/CompInput.vue';
import Slot from '../models/Slot';
import User from '../models/User';

import {
    DocumentIcon
} from '@heroicons/vue/24/outline';
import API from '../scripts/API';
import Lang from '../scripts/Lang';

const menus = [
    {name: 'Fichier'},
    {name: 'Edition'},
    {name: 'Affichage'},
    {name: 'Insertion'},
    {name: 'Format'},
    {name: 'Outils'},
    {name: 'Données'},
    {name: 'Aide'}
];

export default {
    name: "DocView",
    components: {
        CompSheetslot,
        DocumentIcon,
        CompInput
    },
    data() {
        return {
            Lang,
            User,
            MODE_NEW: 0,
            MODE_EDIT: 1,
            docMode: (this.$route.params.id === "new" ? 0 : 1),
            docId: this.$route.params.id,
            nbRows: 40,
            nbCols: 20,
            menus,
            currentFormula: '',
            currentSlot: null,
            doc: null
        };
    },
    async mounted() {
        if (this.docMode === this.MODE_NEW) {
            await this.createNewDoc();
        }

        API.execute_logged(API.ROUTE.SHEETS.call(this.docId)).then(res => {
            this.doc = res;
        }).catch(err => console.error(err));

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

        let isMouseDown = false;
        let startDiv = null;
        let endDiv = null;
        container.addEventListener('mousedown', ev => {
            if (ev.button === 2) return;
            isMouseDown = true;
            startDiv = ev.target;
            endDiv = ev.target;
            this.setBorder(startDiv, endDiv);
        });
        container.addEventListener('mouseup', ev => { isMouseDown = false; });
        container.addEventListener('contextmenu', ev => {
            ev.preventDefault();
            return;
        })
        container.addEventListener('keydown', ev => {
            if (ev.key === 'Escape') {
                document.querySelector(".border-selector")?.remove();
                User.currentUser.slot = null;
            }
            if (ev.key === 'Delete') {
                for (let x = startDiv.dataset.x; x <= endDiv.dataset.x; x++) {
                    for (let y = startDiv.dataset.y; y <= endDiv.dataset.y; y++) {
                        this.getSlotAt(x, y).formula = '';
                    }
                }
            }
        });
        container.addEventListener('mousemove', ev => {
            if (isMouseDown) {
                endDiv = ev.target;
                this.setBorder(startDiv, endDiv);
            }
        });

        User.currentUser.on('slot', slot => {
            this.currentFormula = slot?.formula;
            this.currentSlot = slot;
            
            // need to do this because Vue.JS is shitty and doesn't update the input value
            const formulaInput = this.$refs['formula-input'];
            if (formulaInput)
                formulaInput.$el.querySelector('input').value = this.currentFormula;
        });
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
            if (!window.slots) window.slots = [];
            if (!window.slots[x]) window.slots[x] = [];
            if (!window.slots[x][y]) window.slots[x][y] = new Slot();
            return window.slots[x][y];
        },
        setBorder(dom1, dom2) {
            dom1 = this.getSheetSlotDom(dom1);
            dom2 = this.getSheetSlotDom(dom2);

            const dom1rect = dom1?.getBoundingClientRect();
            const dom2rect = dom2?.getBoundingClientRect();
            /**@type {HTMLDivElement} */
            const container = this.$refs['grid-container'];
            const containerRect = container.getBoundingClientRect();

            const x = (dom2
                ? Math.min(dom1rect.x, dom2rect.x)
                : dom1rect.x) - containerRect.x + container.scrollLeft;
            const y = (dom2
                ? Math.min(dom1rect.y, dom2rect.y)
                : dom1rect.y) - containerRect.y + container.scrollTop;
            const w = dom2
                ? Math.max(dom1rect.x, dom2rect.x) - Math.min(dom1rect.x, dom2rect.x) + dom2rect.width
                : dom1rect.width;
            const h = dom2
                ? Math.max(dom1rect.y, dom2rect.y) - Math.min(dom1rect.y, dom2rect.y) + dom2rect.height
                : dom1rect.height;

            let border = document.querySelector(".border-selector");
            if (!border) {
                border = document.createElement('div');
                border.className = "border-selector";
                container.firstElementChild.appendChild(border);
            }
            border.style.position = 'absolute';
            border.style.left = x + 'px';
            border.style.top = y + 'px';
            border.style.width = w + 'px';
            border.style.height = h + 'px';
        },
        getSheetSlotDom(dom) {
            let loops = 5;
            while (dom && dom.classList && !dom.classList.contains('comp-sheetslot') && loops > 0) {
                dom = dom.parentElement;
                loops--;
            }
            return dom;
        },
        async createNewDoc() {
            this.doc = await API.execute_logged(API.ROUTE.SHEETS.call(), API.METHOD.POST, {
                name: await Lang.GetTextAsync(Lang.CreateTranslationContext('doc', 'NewDocument'))
            });
            this.docId = this.doc._id;
            this.$router.push('/doc/' + this.doc._id);
        },
        setDocName(name) {
            if (!this.doc?._id) return;
            if (this.changeDocTimeout) clearTimeout(this.changeDocTimeout);
            this.changeDocTimeout = setTimeout(async () => {
                this.changeDocTimeout = null;
                try {
                    await API.execute_logged(API.ROUTE.SHEETS.NAME(this.doc._id), API.METHOD.PUT, {name})
                } catch (err) { console.error(err); }
            }, 300);
        },
    },
    meta: {
        title: async () => {
            return "Document " + window.location.href.split('/').pop();
        }
    }
}

</script>

<style>
.border-selector {
    @apply bg-indigo-500/[0.1] border-2 border-indigo-500 rounded pointer-events-none;
}
</style>
