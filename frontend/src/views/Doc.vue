<template>
    <div class="flex grow h-full w-full">
        <div
            class="relative flex grow flex-col min-h-full h-full max-w-full w-full min-w-0"
            :style="chatOpen ? `width: ${window.innerWidth - chatWidth}px;` : `width: 100%;`"
        >
            <div class="flex p-2 w-full h-fit items-center justify-center">
                <div class="flex w-fit h-full items-center justify-center pr-2">
                    <document-icon class="show-right w-14 h-full text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 rounded-lg p-1" />
                </div>
                <div class="flex flex-col min-w-0 max-w-full w-full h-full space-y-2">
                    <div class="flex min-w-0 max-w-full w-full h-fit">
                        <div class="show-down flex space-x-2 w-fit items-center justify-center">
                            <button
                                v-for="menu in menus"
                                :key="menu.name"
                                class="flex items-center justify-center w-fit py-1 px-2 rounded-md text-slate-700 dark:text-slate-200
                                    hover:bg-slate-200 hover:dark:bg-slate-600 transition-all"
                            >
                                {{ menu.name }}
                            </button>
                        </div>
                        <div class="flex grow justify-end min-w-0 max-w-full overflow-hidden">
                            <div class="flex items-center space-x-1 w-fit">
                                <button
                                    v-if="documentOwner === User.currentUser.id"
                                    class="show-left flex rounded-full border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 w-8 h-8 items-center justify-center
                                        hover:text-slate-50 hover:dark:text-slate-200 hover:border-slate-200 hover:dark:border-slate-200 transition-all"
                                    @click="$refs['addUserModal'].open()"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                                <div
                                    v-for="user in connectedUsers"
                                    :key="user.id"
                                    class="group/usercard show-left flex rounded-full bg-white dark:bg-slate-600 border-2 w-fit h-8 items-center justify-center shadow-md min-w-[2em] max-w-[2em] hover:max-w-[20em] transition-all overflow-hidden px-2"
                                    :style="`border-color: ${user.color};`"
                                >
                                    <p class="group-hover/usercard:hidden text-slate-600 dark:text-slate-50 font-extrabold">
                                        {{ user.username.charAt(0) }}
                                    </p>
                                    <p class="hidden group-hover/usercard:flex text-slate-600 dark:text-slate-50 font-extrabold">
                                        {{ user.username }}
                                    </p>
                                </div>
                                <button
                                    class="show-left flex rounded-full border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 w-8 h-8 items-center justify-center
                                        hover:text-slate-50 hover:dark:text-slate-200 hover:border-slate-200 hover:dark:border-slate-200 transition-all"
                                    @click="toggleChatPanel"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    <span
                                        v-show="hasUnreadMessages"
                                        class="notif-show absolute bottom-1 right-1 w-2 h-2 bg-slate-300 rounded-full"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="show-right flex min-w-0 max-w-full w-full h-fit">
                        <comp-input
                            :value="documentTitle ?? Lang.CreateTranslationContext('doc', 'NewDocument')"
                            :disabled="documentOwner !== User.currentUser.id"
                            @input="setDocName($event.target.value)"
                        />
                        <div class="flex space-x-2 pl-8 w-full">
                            <comp-input
                                ref="formula-input"
                                class="md:space-x-2 w-full"
                                label="Fx"
                                name="formula"
                                :expand="true"
                                :value="currentFormula || ''"
                                :disabled="currentSlotLocked"
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
                            id="grid-container"
                            class="flex grow relative w-full h-full overflow-auto bg-slate-50 dark:bg-slate-700"
                        >
                            <div> <!-- selectors -->
                                <comp-selector
                                    v-for="user in doc?.users.concat(doc?.owner)"
                                    :key="user.id"
                                    :data="user.id"
                                />
                            </div>
                            <div
                                v-if="doc"
                                id="grid"
                                class="w-fit h-fit"
                            >
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
                                        <comp-sheetslot
                                            class="comp-sheetslot"
                                            :data="getSlotAt(col-1, row-1)"
                                            :data-x="col-1"
                                            :data-y="row-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                v-else
                                class="flex w-full h-full items-center justify-center"
                            >
                                <div v-if="doc === undefined">
                                    <p class="text-2xl font-semibold tracking-wide">
                                        <get-text :context="Lang.CreateTranslationContext('doc', 'Loading')" />
                                    </p>
                                </div>
                                <div v-if="doc === null">
                                    <p class="text-2xl font-semibold tracking-wide">
                                        <get-text :context="Lang.CreateTranslationContext('doc', 'LoadingError')" />
                                    </p>
                                    <comp-button
                                        class="mt-4 mx-auto"
                                        @click="window.close()"
                                    >
                                        <get-text :context="Lang.CreateTranslationContext('verbs', 'Back')" />
                                    </comp-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <comp-modal ref="addUserModal">
                <div class="text-slate-700 dark:text-slate-200">
                    <p class="text-xl font-bold mx-auto w-fit h-fit mb-4 py-1">
                        <get-text :context="Lang.CreateTranslationContext('doc', 'InviteUser')" />
                    </p>
                    <p class="text-md font-semibold mr-auto w-fit h-fit text-slate-600 dark:text-slate-300">
                        <get-text
                            :context="Lang.CreateTranslationContext('doc', 'InviteUserDesc')"
                            class="flex flex-col text-center"
                        />
                    </p>
                    <div class="flex flex-col items-center w-fit mx-auto mb-4">
                        <comp-input
                            ref="userEmailInput"
                            class="w-fit"
                            :placeholder="Lang.CreateTranslationContext('doc', 'Email')"
                            @input="() => { validUserSearch = false; }"
                        />
                        <comp-completion
                            ref="userEmailCompletion"
                            :oncompletion="searchUsers"
                            :onclick="onUserCompletion"
                        />
                    </div>
                </div>
                <div class="flex grow h-fit justify-between space-x-8 mt-20">
                    <comp-button
                        :icon="XMarkIcon"
                        :onclick="() => $refs['addUserModal'].close()"
                    >
                        <get-text :context="Lang.CreateTranslationContext('verbs', 'Cancel')" />
                    </comp-button>
                    <comp-button
                        :icon="UserPlusIcon"
                        :disabled="!validUserSearch"
                        :onclick="inviteNewUser"
                    >
                        <get-text :context="Lang.CreateTranslationContext('verbs', 'Invite')" />
                    </comp-button>
                </div>
            </comp-modal>
            <comp-notify />
        </div>
        <div
            class="flex min-h-0 h-full"
            :class="resizingChat ? '' : ' transition-all'"
            :style="chatOpen ? `width: ${chatWidth}px;` : `width: 0px;`"
        >
            <span
                class="resize-chat flex w-[6px] h-full bg-slate-200 dark:bg-slate-600 cursor-col-resize select-none"
                @mousedown="resizingChat = true"
            />
            <comp-chat />
        </div>
    </div>
</template>

<script>
import CompSheetslot from '../components/CompSheetslot.vue';
import CompSelector from '../components/CompSelector.vue';
import CompInput from '../components/CompInput.vue';
import MultiDoc from '../scripts/MultiDoc';
import User from '../models/User';
import * as DocView from '../scripts/DocView';

import {
    DocumentIcon,
    UserPlusIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline';
import API from '../scripts/API';
import Lang from '../scripts/Lang';
import Notify from '../scripts/Notify';
import GetText from '../components/text/GetText.vue';
import CompButton from '../components/CompButton.vue';
import Ressources from '../scripts/Ressources';
import Selections from '../scripts/Selections';
import CompModal from '../components/CompModal.vue';
import CompCompletion from '../components/CompCompletion.vue';
import { toRaw } from 'vue';
import CompChat from '../components/CompChat.vue';
import CompNotify from '../components/CompNotify.vue';
import EventManager from '../scripts/EventManager';

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
        CompInput,
        GetText,
        CompButton,
        CompSelector,
        CompModal,
        CompCompletion,
        CompChat,
        CompNotify
    },
    data() {
        if (this.$route.params.id === "new") {
            this.createNewDoc();
            return {};
        }

        return {
            Lang,
            User,
            UserPlusIcon,
            XMarkIcon,
            MODE_NEW: 0,
            MODE_EDIT: 1,
            docMode: (this.$route.params.id === "new" ? 0 : 1),
            docId: this.$route.params.id,
            nbRows: 40,
            nbCols: 20,
            menus,
            currentFormula: '',
            currentSlot: null,
            currentSlotLocked: true,
            currentSlotLockedListener: null,
            documentTitle: null,
            documentOwner: null,
            window,
            validUserSearch: false,
            chatOpen: false,
            chatWidth: window.innerWidth * 0.25,
            connectedUsers: [],
            hasUnreadMessages: false,
            resizingChat: false
        };
    },
    async mounted() {
        this.doc = undefined;

        this.$refs['userEmailCompletion'].attachInput(
            this.$refs['userEmailInput'].$el.querySelector('input')
        );

        this.retreiveDocument().then(res => {
            this.setupDomEvents();
            this.setupUserEvents();
            this.setupSocketEvents();
        });
        this.setupChatListeners();
    },
    methods: {
        searchUsers(selector, query) {
            if (query.length < 3) return;

            API.execute_logged(API.ROUTE.SEARCHUSERS(query)).then(res => {
                const data = res.map(user => {
                    return {
                        id: user._id,
                        value: user.username,
                        desc: user.email,
                        color: User.GetUserColor(user._id)
                    };
                });
                selector.setData(data);
            }).catch(err => {
                this.notifyError(err);
                console.error(err);
            });
        },
        onUserCompletion(data) {
            this.validUserSearch = data.id;
        },
        inviteNewUser() {
            const userId = this.validUserSearch;
            this.validUserSearch = false;

            API.execute_logged(API.ROUTE.SHEETS.USERS(this.doc.id), API.METHOD.POST, [userId]).then(res => {
                this.retreiveDocument(true);
                this.$refs['addUserModal'].close();
            }).catch(err => {
                this.notifyError(err);
                console.error(err);
            });
        },
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
            return this.doc.getSlotAt(x, y);
        },
        async createNewDoc() {
            const res = await API.execute_logged(API.ROUTE.SHEETS.call(), API.METHOD.POST, {
                name: await Lang.GetTextAsync(Lang.CreateTranslationContext('doc', 'NewDocument'))
            });
            window.location.href = '/doc/' + res._id;
        },
        setDocName(name) {
            if (!this.doc?.id || name.length < 3) return;
            if (this.changeDocTimeout) clearTimeout(this.changeDocTimeout);
            this.changeDocTimeout = setTimeout(async () => {
                this.changeDocTimeout = null;
                try {
                    const res = await API.execute_logged(API.ROUTE.SHEETS.NAME(this.doc.id), API.METHOD.PUT, {name});
                    this.doc.title = res.name;
                    this.documentTitle = res.name;
                } catch (err) {
                    this.notifyError(err);
                    console.error(err);
                }
            }, 300);
        },
        async retreiveDocument(forceFetch=false) {
            return new Promise((resolve, reject) => {
                Ressources.getDocument(this.docId, forceFetch).then(doc => {
                    this.doc = doc;
                    window.doc = doc;
                    this.documentTitle = doc.title;
                    this.documentOwner = doc.owner.id;
                    this.$forceUpdate();
                    resolve();
                }).catch(err => {
                    this.doc = null;
                    this.$forceUpdate();
                    this.notifyError(err);
                    console.error(err);
                    reject();
                });
            });
        },
        setupDomEvents() {
            /** @type {HTMLDivElement} */
            const container = this.$el.querySelector('#grid-container');
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
                startDiv = DocView.tryGetDomSlot(ev.target);
                endDiv = DocView.tryGetDomSlot(ev.target);

                Selections.setUserSelection(
                    User.currentUser.id,
                    {x: startDiv.dataset.x, y: startDiv.dataset.y},
                    {x: endDiv.dataset.x, y: endDiv.dataset.y}
                );
            });
            container.addEventListener('mouseup', ev => { isMouseDown = false; });
            container.addEventListener('contextmenu', ev => {
                ev.preventDefault();
                return;
            });
            container.addEventListener('keydown', ev => {
                if (ev.key === 'Escape') {
                    if (!User.currentUser.slot) return console.warn('User has no slot');
                    Selections.setUserSelection(User.currentUser.id, null, null);
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
                    endDiv = DocView.tryGetDomSlot(ev.target);
                    Selections.setUserSelection(
                        User.currentUser.id,
                        {x: startDiv.dataset.x, y: startDiv.dataset.y},
                        {x: endDiv.dataset.x, y: endDiv.dataset.y}
                    );
                }
            });
            let keyupListenerTimeout = null;
            const formula = this.$el.querySelector('input[name=formula]');
            formula.addEventListener('keyup', ev => {
                if (!User.currentUser.slot) return console.warn('User has no slot');
                User.currentUser.slot.formula = ev.target.value;
                if (keyupListenerTimeout) clearTimeout(keyupListenerTimeout);
                keyupListenerTimeout = setTimeout(() => {
                    keyupListenerTimeout = null;
                    this.multi.askForChangeCell(
                        User.currentUser.slot.x,
                        User.currentUser.slot.y,
                        User.currentUser.slot.formula
                    );
                }, 300);
            });
        },
        setupUserEvents() {
            User.currentUser.on('slot', slot => {
                this.releaseCell();

                if (this.currentSlot) toRaw(this.currentSlot).remCallback(this.currentSlotLockedListener);
                this.currentFormula = slot?.formula ?? '';
                this.$el.querySelector('input[name=formula]').value = this.currentFormula;
                this.currentSlot = slot;
                if (!slot) return;

                this.currentSlotLockedListener = slot.on('locked', locked => {
                    this.currentSlotLocked = locked;
                });
                this.currentSlotLocked = slot.locked;
            });
        },
        setupSocketEvents() {
            /** @type {HTMLDivElement} */
            const container = this.$el.querySelector('#grid-container');
            this.multi = new MultiDoc(this.doc);

            container.addEventListener('mousedown', ev => {
                if (ev.button === 2) return;
                const cell = DocView.tryGetDomSlot(ev.target);
                if (!cell) return console.warn('Cell not found for div', ev.target);

                const slot = this.doc.getSlotAt(cell.dataset.x, cell.dataset.y);
                if (slot.equals(User.currentUser.slot)) return console.warn('User already has this slot');
                User.currentUser.slot = slot;
                slot.locked = true;

                this.multi.askForSelectCell(cell.dataset.x, cell.dataset.y).then(data => {
                    this.multi.askForAcquireCell(cell.dataset.x, cell.dataset.y).then(res => {
                        this.doc.getSlotAt(data.x, data.y).locked = false;
                    }).catch(err => {
                        // already acquired, do nothing
                    });

                }).catch(err => {
                    this.notifyError(err);
                    console.error(err);
                });
            });

            window.addEventListener('keydown', ev => {
                if (ev.key === 'Escape' && User.currentUser.slot) {
                    this.releaseCell();
                }
            });

            this.multi.getEventManager().addEventListener(MultiDoc.Events.ROOM_JOINED, async ev => {
                const userId = ev.userId;
                const user = await Ressources.getUser(userId);
                if (!user) return console.warn('User not found for id', userId);
                
                if (!this.connectedUsers.find(u => u.id === userId)) {
                    this.connectedUsers.push({
                        id: userId,
                        username: user.username,
                        color: User.GetUserColor(userId)
                    });
                }
            });

            this.multi.getEventManager().addEventListener(MultiDoc.Events.ROOM_LEFT, async ev => {
                const userId = ev.userId;
                this.connectedUsers = this.connectedUsers.filter(u => u.id !== userId);
            });

            this.multi.getEventManager().addEventListener('newMessage', ev => {
                if (!this.chatOpen)
                    this.hasUnreadMessages = true;
            });
        },
        releaseCell() {
            if (this.currentSlot && !this.currentSlotLocked) {
                const raw = toRaw(this.currentSlot);
                this.multi.askForReleaseCell(raw.x, raw.y).then(res => {
                    // noice
                }).catch(err => {
                    this.notifyError(err);
                    console.error(err);
                });
            }
            this.currentSlot = null;
            this.currentSlotLocked = true;
        },
        async notifyError(err) {
            Notify.error(
                await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'Error')),
                await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'Unknown', {msg: err.message}))
            );
        },
        inviteUser() {
            Notify.log("Invite user clicked");
        },
        toggleChatPanel() {
            this.chatOpen = !this.chatOpen;
            if (this.chatOpen) {
                this.hasUnreadMessages = false;
                const messageInput = this.$el.querySelector('input[name=message]');
                setTimeout(() => {
                    messageInput.focus();
                }, 150);
            }
        },
        setupChatListeners() {
            window.addEventListener('mouseup', ev => {
                this.resizingChat = false;
            });
            window.addEventListener('mousemove', ev => {
                if (this.resizingChat) {
                    this.chatWidth = Math.min(Math.max(window.innerWidth - ev.clientX, 300), window.innerWidth - 900);
                }
            });
        }
    },
    meta: {
        title: async () => {
            const id = window.location.href.split('/').pop();
            return (await Ressources.getDocument(id)).title;
        }
    }
}

</script>

<style scoped>
@keyframes notif-show {
    0% {
        transform: scale(0.5);
    }
    40% {
        transform: scale(1.3);
    }
    60% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}

.notif-show { animation: notif-show 0.2s ease-in-out }
</style>