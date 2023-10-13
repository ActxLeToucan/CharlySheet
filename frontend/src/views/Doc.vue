<template>
    <div class="flex grow flex-col min-h-full h-full max-w-full w-full">
        <p>mode : {{ docMode == MODE_EDIT ? "Edit" : "New" }}</p>
        <p v-if="docMode === MODE_EDIT">
            doc : id={{ docId }}
        </p>
    </div>
</template>

<script>

export default {
    name: "DocView",
    components: {

    },
    data() {
        return {
            MODE_NEW: 0,
            MODE_EDIT: 1,
            docMode: (this.$route.params.id === "new" ? 0 : 1),
            docId: this.$route.params.id
        };
    },
    mounted() {
        
    },
    methods: {
        
    }
}

</script>
