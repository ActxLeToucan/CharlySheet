<template>
    <div
        class="absolute border-2 rounded pointer-events-none"
        :class="(x==0&&y==0&&width==0&&height==0) ? ' hidden ' : ''"
        :style="`top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px; border-color: ${userColor};`"
    />
</template>

<script>
import Ressources from '../scripts/Ressources';
import Selections from '../scripts/Selections';
import * as DocView from '../scripts/DocView';

export default {
    name: "CompSelector",
    components: {
        
    },
    props: {
        data: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            userColor: null
        };
    },
    async mounted() {
        Selections.addEventListener(this.data, (s1, s2) => {
            if (s1 === null || s2 === null) {
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
                return;
            }
            this.setBorderAt(s1.x, s1.y, s2.x, s2.y);
        });
        this.user = await Ressources.getUser(this.data);
        this.userColor = this.user.color;
    },
    methods: {
        getContainer() {
            return document.getElementById('grid');
        },
        getSlotAt(x, y) {
            /** @type {HTMLElement} */
            const container = this.getContainer();
            return container.children[y]?.children[x];
        },
        setBorderAt(x1, y1, x2, y2) {
            const dom1 = this.getSlotAt(x1, y1);
            const dom2 = this.getSlotAt(x2, y2);
            this.setBorder(dom1, dom2 || dom1);
        },
        setBorder(dom1, dom2) {
            dom1 = DocView.tryGetDomSlot(dom1);
            dom2 = DocView.tryGetDomSlot(dom2);

            if (!dom1 || !dom2) {
                return;
            }

            const dom1rect = dom1.getBoundingClientRect();
            const dom2rect = dom2.getBoundingClientRect();
            const container = this.getContainer();
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

            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
    }
}
</script>
