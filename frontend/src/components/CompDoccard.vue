<template>
    <a
        :href="'/doc/' + doc._id"
        target="_blank"
        class="group/card flex flex-col justify-center items-center w-40 h-60 md:w-56 md:h-80 border-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 overflow-hidden
                hover:bg-indigo-500/[0.1] hover:dark:bg-indigo-500/[0.1] hover:text-slate-800 hover:dark:text-slate-50 hover:border-indigo-500 hover:dark:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all"
    >
        <button
            v-show="ownerId === User.currentUser.id"
            class="show-left absolute top-2 right-2 p-1 hidden group-hover/card:flex w-fit h-fit rounded-md border-2 border-transparent
                   hover:border-red-500 hover:bg-red-500/[0.3] text-slate-800 dark:text-slate-200 transition-all"
            @click="deleteDoc"
        >
            <trash-icon class="w-6 h-6" />
        </button>
        <button
            v-show="ownerId === User.currentUser.id"
            class="show-right absolute top-2 left-2 p-1 hidden group-hover/card:flex w-fit h-fit rounded-md border-2 border-transparent
                   hover:border-indigo-500 hover:bg-indigo-500/[0.3] text-slate-800 dark:text-slate-200 transition-all"
            @click="exportDoc"
        >
            <arrow-down-tray-icon class="w-6 h-6" />
        </button>
        <div class="flex grow justify-center items-center">
            <table-cells-icon class="w-16" />
        </div>
        <div class="flex flex-col h-20 justify-evenly w-full bg-slate-950/[0.2] dark:bg-slate-950/[0.5] p-2">
            <p class="text-lg font-semibold whitespace-nowrap text-ellipsis overflow-hidden"> {{ doc.name }} </p>
            <p class="text-base font-normal whitespace-nowrap text-ellipsis overflow-hidden"> {{ ownerName }} </p>
        </div>
    </a>
</template>

<script>
import {
    TableCellsIcon,
    TrashIcon
} from '@heroicons/vue/24/outline';
import API from '../scripts/API';
import Ressources from '../scripts/Ressources';
import User from '../models/User';
import { ArrowDownTrayIcon } from "@heroicons/vue/20/solid";

export default {
    name: "CompDoccard",
    components: {
        ArrowDownTrayIcon,
        TableCellsIcon,
        TrashIcon
    },
    props: {
        doc: {
            type: Object,
            required: true
        },
        onDelete: {
            type: Function,
            required: false,
            default: () => {}
        }
    },
    data() {
        return {
            User,
            ownerId: '',
            ownerName: ''
        };
    },
    watch: {
        doc() {
            this.loadUser();
        }
    },
    mounted() {
        this.loadUser();
    },
    methods: {
        async deleteDoc(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            try {
                await API.execute_logged(API.ROUTE.SHEETS.call(this.doc._id), API.METHOD.DELETE);
                this.onDelete?.();
            } catch (err) {
                console.error(err);
            }
        },
        async exportDoc(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            try {
                const res = await API.execute_logged(API.ROUTE.SHEETS.EXPORT(this.doc._id), API.METHOD.GET);
                const blob = new Blob([JSON.stringify(res)], {
                    type: 'application/json'
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.doc.name + '.json');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (err) {
                console.error(err);
            }
        },
        loadUser() {
            Ressources.getUser(this.doc.owner._id).then(user => {
                this.owner = user;
                this.ownerId = user.id;
                this.ownerName = user.username;
            });
        }
    }
}
</script>
