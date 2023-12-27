<template>
    <div class="flex flex-col max-h-full h-full min-h-0 border-l-4 border-slate-200 dark:border-slate-600">
        <div class="flex h-fit border-b-2 border-slate-200 dark:border-slate-800">
            <p class="m-4 text-xl font-bold">
                <get-text :context="Lang.CreateTranslationContext('chat', 'Chat')" />
            </p>
        </div>
        <div class="flex flex-col grow w-full max-w-full overflow-auto">
            <div 
                v-show="messages.length > 0"
                class="flex flex-col grow h-fit w-full"
            >
                <comp-message
                    v-for="message in messages"
                    :key="message.id"
                    :message="message"
                />
            </div>
            <div
                v-show="messages.length === 0"
                class="flex flex-col grow items-center justify-center space-y-2 p-2"
            >
                <p class="text-xl font-bold text-slate-500 dark:text-slate-300 text-center">
                    <get-text :context="Lang.CreateTranslationContext('chat', 'NoMessages')" />
                </p>
                <p class="text-lg font-semibold text-slate-400 dark:text-slate-400 text-center">
                    <get-text :context="Lang.CreateTranslationContext('chat', 'NoMessagesDesc')" />
                </p>
            </div>
        </div>
        <div class="flex h-fit border-t-2 border-slate-50 dark:border-slate-800 p-2 justify-between">
            <comp-input
                :placeholder="Lang.CreateTranslationContext('chat', 'Message')"
                name="message"
                :value="text"
                @input="e => text = e.target.value"
            />

            <button
                class="bg-slate-800 px-2 rounded-lg border-2 border-transparent dark:border-transparent
                       hover:border-slate-300 hover:dark:border-slate-600 transition-all"
                @click="() => sendMessage()"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import User from '../models/User';
import EventManager from '../scripts/EventManager';
import Lang from '../scripts/Lang';
import CompInput from './CompInput.vue';
import CompMessage from './CompMessage.vue';
import GetText from './text/GetText.vue';

export default {
    name: 'CompChat',
    components: {
        GetText,
        CompInput,
        CompMessage
    },
    data() {
        return {
            Lang,
            messages: [],
            text: ''
        }
    },
    mounted() {
        this.events = EventManager.Instance;
        this.events.addEventListener('newMessage', data => {
            this.messages.push(data);
        });
        this.getInput().addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    },
    methods: {
        sendMessage(msg) {
            if (!msg) {
                const input = this.getInput();
                msg = input.value;
            }
            if (!msg || msg.trim() === '') return;
            
            this.events.sendEvent('newMessage', {
                message: msg
            });
            this.text = '';
        },
        getInput() {
            return this.$el.querySelector('input[name="message"]');
        }
    }
}
</script>