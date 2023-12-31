<template>
    <div class="flex flex-col absolute bottom-0 right-0 p-4 z-50 space-y-2 pointer-events-none">
        <div
            v-for="notif in notifs"
            :key="notif.id"
            class="shadow-lg rounded-lg p-2 border-2 h-fit max-w-[15em] w-fit ml-auto"
            :class="notif.removing ? 'hide-down' : 'show-left'"
            :style="'background-color: '+notif.inner_color+'; border-color: '+notif.outer_color+';'"
        >
            <p class="text-slate-50  font-bold     text-base max-w-full w-fit"> {{ notif.message }} </p>
            <p class="text-slate-200 font-semibold text-base max-w-full w-fit"> {{ notif.description }} </p>
        </div>
    </div>
</template>

<script>
import Notify from '../scripts/Notify';
window.Notify = Notify;

export default {
    name: "CompNotify",
    components: {
        
    },
    data() {
        return {
            notifs: []
        }
    },
    mounted() {
        Notify.onNotifAdded(notif => {
            this.notifs.push(notif);
        });
        Notify.onNotifRemoved(notif => {
            const index = this.notifs.indexOf(notif);
            if (index < 0) return;

            this.notifs[index].removing = true;
            this.$forceUpdate();
            setTimeout(() => {
                this.notifs.splice(index, 1);
            }, 100);
        });
    }
};
</script>