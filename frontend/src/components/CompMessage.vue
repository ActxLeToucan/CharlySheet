<template>
    <div class="show-up flex p-2 h-fit w-full max-w-full">
        <div
            class="flex flex-col rounded-lg border-2 h-fit w-80 max-w-full p-2 bg-slate-700 shadow-md"
            :class="mine? 'ml-auto': 'mr-auto'"
            :style="'border-color: '+color+'; box-shadow: '+(mine ? '': '-')+'4px 0px 0px '+color+', 0px 4px 10px #0003;'"
        >
            <div class="flex justify-between">
                <p class="text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                    {{ username ?? message.userId }}
                </p>
                <p class="text-slate-600 dark:text-slate-400 font-semibold">
                    {{ message.time }}
                </p>
            </div>
            <p class="text-slate-800 dark:text-slate-200 font-bold text-lg">
                {{ message.message }}
            </p>
        </div>
    </div>
</template>

<script>
import User from '../models/User';
import API from '../scripts/API'
import Ressources from '../scripts/Ressources';
export default {
    name: 'CompMessage',
    components: {},
    props: {
        message: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            username: null,
            color: '#1e293b'
        }
    },
    computed: {
        mine() {
            return this.message.userId === User.currentUser.id;
        }
    },
    watch: {
        message() { this.fetchUser(); }
    },
    mounted() {
        this.fetchUser();

        const parent = this.$el.parentElement.parentElement;
        const parentBounds = parent.getBoundingClientRect();
        const scrollAmount = parent.scrollHeight - parentBounds.height;
        parent.scrollTo({
            top: scrollAmount,
            behavior: 'smooth'
        })
    },
    methods: {
        async fetchUser() {
            const user = await Ressources.getUser(this.message.userId);
            if (user) {
                this.username = user.username;
                this.color = user.color ?? '#1e293b';
            }
            this.$forceUpdate();
        }
    }
}
</script>