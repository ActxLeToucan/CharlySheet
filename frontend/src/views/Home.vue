<template>
    <div class="flex grow flex-col min-h-full max-h-full h-fit max-w-full w-full justify-center items-center">
        <div class="flex fixed w-screen h-screen">
            <div class="flex grow back-img -rotate-[10deg] scale-[1.4] opacity-[0.2] drop-shadow-lg" />
        </div>
        <div
            class="show-up flex flex-col h-full w-full md:h-[40em] md:w-[40em] justify-evenly items-center p-4 md:p-8 overflow-hidden
                   bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-2xl"
        >
            <div
                ref="panels"
                class="flex grow w-full h-full"
            >
                <div
                    ref="home-panel"
                    class="flex flex-col grow hidden space-y-8 md:space-y-16"
                >
                    <div class="flex flex-col items-center space-y-4">
                        <comp-icon class="w-32" />
                        <comp-title>CharlySheet</comp-title>
                    </div>
                    <div
                        class="flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-300"
                    >
                        <p class="text-center text-xl">
                            Bienvenue sur CharlySheet !
                        </p>
                        <p class="text-center text-xl">
                            Avant de commencer, créez un compte ou connectez-vous.
                        </p>
                    </div>
                    <div
                        class="flex grow items-end"
                    >
                        <div class="flex flex-wrap w-full h-fit">
                            <comp-button
                                class="mx-auto my-2"
                                :icon="UserPlusIcon"
                                :onclick="() => goToRegister()"
                            >
                                S'inscrire
                            </comp-button>
                            <comp-button
                                class="mx-auto my-2"
                                :icon="UserIcon"
                                :onclick="() => goToLogin()"
                            >
                                Se connecter
                            </comp-button>
                        </div>
                    </div>
                </div>

                <div
                    ref="login-panel"
                    class="flex flex-col grow hidden space-y-8 md:space-y-16"
                >
                    <div class="flex flex-row items-center justify-center space-x-4">
                        <comp-icon class="w-10" />
                        <comp-title>Connexion</comp-title>
                    </div>
                    <div class="flex flex-col space-y-4 mx-auto">
                        <comp-input
                            label="Nom d'utilisateur"
                            placeholder="Nom d'utilisateur"
                            name="username"
                        />
                        <comp-input
                            label="Mot de passe"
                            placeholder="Mot de passe"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div
                        class="flex grow items-end"
                    >
                        <div class="flex flex-wrap w-full h-fit">
                            <comp-button
                                class="mx-auto my-2"
                                :icon="ChevronLeftIcon"
                                :onclick="() => goToHome()"
                            >
                                Retour
                            </comp-button>
                            <comp-button
                                class="mx-auto my-2"
                                :icon="CheckIcon"
                                :onclick="() => login()"
                            >
                                Continuer
                            </comp-button>
                        </div>
                    </div>
                </div>

                <div
                    ref="register-panel"
                    class="flex flex-col grow hidden space-y-8 md:space-y-16"
                >
                    <div class="flex flex-row items-center justify-center space-x-4">
                        <comp-icon class="w-10" />
                        <comp-title>Inscription</comp-title>
                    </div>
                    <div class="flex flex-col space-y-4 mx-auto">
                        <comp-input
                            label="Nom d'utilisateur"
                            placeholder="Nom d'utilisateur"
                            name="username"
                        />
                        <comp-input
                            label="Adresse e-mail"
                            placeholder="Adresse e-mail"
                            type="email"
                            name="email"
                        />
                        <comp-input
                            label="Mot de passe"
                            placeholder="Mot de passe"
                            type="password"
                            name="password"
                        />
                        <comp-input
                            label="Confirmation"
                            placeholder="Confirmation"
                            type="password"
                            name="password-confirm"
                        />
                    </div>
                    <div
                        class="flex grow items-end"
                    >
                        <div class="flex flex-wrap w-full h-fit">
                            <comp-button
                                class="mx-auto my-2"
                                :icon="ChevronLeftIcon"
                                :onclick="() => goToHome()"
                            >
                                Retour
                            </comp-button>
                            <comp-button
                                class="mx-auto my-2"
                                :icon="CheckIcon"
                                :onclick="() => register()"
                            >
                                Continuer
                            </comp-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CompButton from '../components/CompButton.vue';
import CompIcon from '../components/CompIcon.vue';
import CompTitle from '../components/CompTitle.vue';
import CompInput from '../components/CompInput.vue';

import {
    UserPlusIcon,
    UserIcon,
    ChevronLeftIcon,
    CheckIcon
} from '@heroicons/vue/24/outline';

export default {
    name: "HomeView",
    components: {
        CompIcon,
        CompButton,
        CompTitle,
        CompInput
    },
    data() {
        return {
            UserPlusIcon,
            UserIcon,
            ChevronLeftIcon,
            CheckIcon
        };
    },
    mounted() {
        setTimeout(() => {
            this.goToHome('left');
        }, 200);
    },
    methods: {
        hidePanel(direction = 'left') {
            const panel = this.$refs['panels'];
            panel.classList.remove('show-left', 'show-right');
            panel.classList.add('hide-' + direction);
        },
        showPanel(name, direction = (name === 'home-panel' ? 'right' : 'left')) {
            this.hidePanel(direction);

            setTimeout(() => {
                const panels = ['home-panel', 'register-panel', 'login-panel'];
                panels.forEach((panelName) => {
                    const panel = this.$refs[panelName];
                    if (!panel) return;
                    if (panelName === name)
                        panel.classList.remove('hidden');
                    else panel.classList.add('hidden');
                });

                const panel = this.$refs['panels'];
                panel.classList.remove('hide-left', 'hide-right', 'hidden');
                panel.classList.add('show-' + direction);
            }, 150);
        },
        goToHome(dir) {
            this.showPanel('home-panel', dir);
        },
        goToRegister() {
            this.showPanel('register-panel');
        },
        goToLogin() {
            this.showPanel('login-panel');
        },
        login() {
            this.$router.push('/my'); // TODO
        },
        register() {
            this.$router.push('/my'); // TODO
        }
    }
}

</script>

<style scoped>
.back-img {
    background-image: url('/img/background.png');
    background-size: 35em;
    background-position: 0 0;
    background-repeat: repeat;
}
</style>
