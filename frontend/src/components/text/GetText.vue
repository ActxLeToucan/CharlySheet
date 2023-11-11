<template>
    <div v-if="!loading">
        <span
            v-for="line in text.split('\n')"
            :key="line"
        >
            {{ line }}
        </span>
    </div>
    <span
        v-else
        class="flex w-16 h-3 rounded-2xl animate-text-loading"
    />
</template>


<script>
import Lang from '../../scripts/Lang';

export default {
    name: "GetText",
    props: {
        context: {
            type: [Object, String],
            required: true
        }
    },
    data() {
        return {
            text: "",
            loading: false
        };
    },
    watch: {
        context: {
            deep: true,
            handler() { this.loadTranslation(); }
        }

    },
    mounted() {
        Lang.registerOnLanguageChange(() => this.loadTranslation());
        this.loadTranslation();
    },
    methods: {
        loadTranslation() {
            this.loading = true;
            Lang.GetTextAsync(this.context).then(text => {
                if (!text) return;
                this.text = text;
                this.loading = false;                                                                                                                           
            });
        }
    }
}
</script>

<style scoped>
@keyframes animate-text-loading {
    0%   { background-image: linear-gradient(90deg, #ffffff80, #ffffff60, #ffffff30, #ffffff30, #ffffff30, #ffffff30); }
    20%  { background-image: linear-gradient(90deg, #ffffff60, #ffffff80, #ffffff60, #ffffff30, #ffffff30, #ffffff30); }
    40%  { background-image: linear-gradient(90deg, #ffffff30, #ffffff60, #ffffff80, #ffffff60, #ffffff30, #ffffff30); }
    60%  { background-image: linear-gradient(90deg, #ffffff30, #ffffff30, #ffffff60, #ffffff80, #ffffff60, #ffffff30); }
    80%  { background-image: linear-gradient(90deg, #ffffff30, #ffffff30, #ffffff30, #ffffff60, #ffffff80, #ffffff60); }
    100% { background-image: linear-gradient(90deg, #ffffff30, #ffffff30, #ffffff30, #ffffff30, #ffffff60, #ffffff80); }
}

.animate-text-loading {
    animation: animate-text-loading 0.6s alternate infinite;
    transition: background-image 1s;
}
</style>