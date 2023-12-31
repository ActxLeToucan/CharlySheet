<template>
    <div
        ref="root"
        class="show-up hidden flex justify-center items-center fixed w-full h-full top-0 left-0 bg-black/[0.3] p-4"
        style="z-index: 1000;"
    >
        <div
            ref="card"
            class="rounded-lg shadow-lg p-2 bg-slate-50 dark:bg-slate-700"
            :hoverable="false"
        >
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'CompModal',
    components: {},
    props: {

    },
    data() {
        return {
            openClicked: false
        };
    },
    mounted() {
        const root = this.$refs["root"];
        document.body.appendChild(root);

        const card = this.$refs["card"];
        card.addEventListener("click", e => {
            e.stopPropagation();
        });
        root.addEventListener("click", e => {
            this.close();
        });
    },
    methods: {
        open() {
            const root = this.$refs["root"];
            root.classList.remove("hidden", "hide-down");
            this.$el.querySelectorAll("input, textarea").forEach(input => {
                input.value = "";
            })
        },
        close() {
            const root = this.$refs["root"];
            root.classList.add("hide-down");
            setTimeout(() => {
                root.classList.add("hidden");
            }, 150);
        }
    }
}
</script>