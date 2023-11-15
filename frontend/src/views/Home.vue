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
                        <comp-title>
                            <get-text :context="Lang.CreateTranslationContext('home', 'CharlySheet')" />
                        </comp-title>
                    </div>
                    <div
                        class="flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-300"
                    >
                        <p class="text-center text-xl">
                            <get-text :context="Lang.CreateTranslationContext('home', 'Welcome')" />
                        </p>
                        <p class="text-center text-xl">
                            <get-text :context="Lang.CreateTranslationContext('home', 'WelcomeDesc')" />
                        </p>
                    </div>
                    <div
                        class="flex grow items-end"
                    >
                        <div class="flex flex-wrap w-full h-fit">
                            <comp-button
                                class="mx-auto my-2"
                                :icon="UserPlusIcon"
                                :onclick="() => goToSignup()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'SignUp')" />
                            </comp-button>
                            <comp-button
                                class="mx-auto my-2"
                                :icon="UserIcon"
                                :onclick="() => goToLogin()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'LogIn')" />
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
                        <comp-title>
                            <get-text :context="Lang.CreateTranslationContext('verbs', 'LogIn')" />
                        </comp-title>
                    </div>
                    <div
                        v-if="shownPanel === 'login-panel'"
                        class="flex flex-col space-y-4 mx-auto"
                    >
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'Username')"
                            :placeholder="Lang.CreateTranslationContext('home', 'Username')"
                            name="username"
                        />
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'Password')"
                            :placeholder="Lang.CreateTranslationContext('home', 'Password')"
                            type="password"
                            name="password"
                        />
                        <button
                            class="w-fit border-b border-transparent dark:border-transparent hover:border-slate-500 hover:dark:border-slate-300"
                            @click="goToSignup"
                        >
                            <p class="flex space-x-2 text-slate-500 dark:text-slate-300 italic">
                                <get-text :context="Lang.CreateTranslationContext('home', 'NoAccountQuestion')" />
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'SignUp')" />
                            </p>
                        </button>
                    </div>
                    <div
                        class="flex flex-col grow justify-end"
                    >
                        <log-zone ref="login-log-zone" />
                        <div class="flex flex-wrap w-full h-fit">
                            <comp-button
                                class="mx-auto my-2"
                                :icon="ChevronLeftIcon"
                                :onclick="() => goToHome()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'Back')" />
                            </comp-button>
                            <comp-button
                                class="mx-auto my-2"
                                :icon="CheckIcon"
                                :onclick="() => login()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'Continue')" />
                            </comp-button>
                        </div>
                    </div>
                </div>

                <div
                    ref="signup-panel"
                    class="flex flex-col grow hidden space-y-8 md:space-y-16"
                >
                    <div class="flex flex-row items-center justify-center space-x-4">
                        <comp-icon class="w-10" />
                        <comp-title>
                            <get-text :context="Lang.CreateTranslationContext('verbs', 'SignUp')" />
                        </comp-title>
                    </div>
                    <div
                        v-if="shownPanel === 'signup-panel'"
                        class="flex flex-col space-y-4 mx-auto"
                    >
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'Username')"
                            :placeholder="Lang.CreateTranslationContext('home', 'Username')"
                            name="username"
                        />
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'Email')"
                            :placeholder="Lang.CreateTranslationContext('home', 'Email')"
                            type="email"
                            name="email"
                        />
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'Password')"
                            :placeholder="Lang.CreateTranslationContext('home', 'Password')"
                            type="password"
                            name="password"
                        />
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'ConfirmPassword')"
                            :placeholder="Lang.CreateTranslationContext('home', 'ConfirmPassword')"
                            type="password"
                            name="password-confirm"
                        />
                        <button
                            class="w-fit border-b border-transparent dark:border-transparent hover:border-slate-500 hover:dark:border-slate-300"
                            @click="goToLogin"
                        >
                            <p class="flex space-x-2 text-slate-500 dark:text-slate-300 italic">
                                <get-text :context="Lang.CreateTranslationContext('home', 'AccountQuestion')" />
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'LogIn')" />
                            </p>
                        </button>
                    </div>
                    <div
                        class="flex flex-col grow justify-end"
                    >
                        <log-zone ref="signup-log-zone" />
                        <div class="flex flex-wrap w-full h-fit">
                            <comp-button
                                class="mx-auto my-2"
                                :icon="ChevronLeftIcon"
                                :onclick="() => goToHome()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'Back')" />
                            </comp-button>
                            <comp-button
                                class="mx-auto my-2"
                                :icon="CheckIcon"
                                :onclick="() => signup()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'Continue')" />
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
import GetText from '../components/text/GetText.vue';
import LogZone from '../components/text/LogZone.vue';
import API from '../scripts/API';
import Lang from '../scripts/Lang';
import Logs from '../scripts/Logs';

import {
    UserPlusIcon,
    UserIcon,
    ChevronLeftIcon,
    CheckIcon
} from '@heroicons/vue/24/outline';
import User from '../scripts/User';

export default {
    name: "HomeView",
    components: {
        CompIcon,
        CompButton,
        CompTitle,
        CompInput,
        GetText,
        LogZone
    },
    data() {
        return {
            Lang,
            UserPlusIcon,
            UserIcon,
            ChevronLeftIcon,
            CheckIcon,
            shownPanel: 'home-panel'
        };
    },
    mounted() {
        if (User.CurrentUser) {
            this.$router.push({ name: 'My' });
            return;
        }

        const signupPanel = this.$refs['signup-panel'];
        const loginPanel = this.$refs['login-panel'];
        signupPanel.addEventListener('keydown', ev => {
            if (ev.key === 'Enter') this.signup();
        });
        loginPanel.addEventListener('keydown', ev => {
            if (ev.key === 'Enter') this.login();
        });

        setTimeout(() => {
            const redirect = this.$route.query.redirect;
            if (redirect) {
                this.goToLogin();
            } else this.goToHome('left');
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
                this.shownPanel = name;
                const panels = ['home-panel', 'signup-panel', 'login-panel'];
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
        goToSignup() {
            this.showPanel('signup-panel');
        },
        goToLogin() {
            this.showPanel('login-panel');
        },
        async login() {
            const logZone = this.$refs['login-log-zone'];
            const log = logZone.log('', Logs.INFO);
            Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'LoggingIn')).then(text => {
                log.update(text);
            });

            const username = document.querySelector('input[name=username]');
            const password = document.querySelector('input[name=password]');

            if (!username.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'UsernameRequired')), Logs.WARNING);
                username.focus();
                log.delete(4000);
                return;
            }
            if (!password.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'PasswordRequired')), Logs.WARNING);
                password.focus();
                log.delete(4000);
                return;
            }

            try {
                const response = await API.execute(API.ROUTE.LOGIN(), API.METHOD.POST, {
                    username: username.value,
                    password: password.value
                });
                
                const user = new User({ token: response.token });
                await user.fetchInformations();
                user.save();

                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'LoggedIn')), Logs.SUCCESS);
                log.delete(2000);
                setTimeout(() => {
                    this.redirectToPage();
                }, 1000);
            } catch (err) {
                switch (err.status) {
                case 401:
                    log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'InvalidCredentials')), Logs.ERROR);
                    log.delete(4000);
                    break;
                default:
                    log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'Unknown', {msg: err.message})), Logs.ERROR);
                    log.delete(4000);
                    break;
                }
            }
        },
        async signup() {
            const logZone = this.$refs['signup-log-zone'];
            const log = logZone.log('', Logs.INFO);
            Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'SigningUp')).then(text => {
                log.update(text);
            });

            const username = document.querySelector('input[name=username]');
            const email = document.querySelector('input[name=email]');
            const password = document.querySelector('input[name=password]');
            const confirm = document.querySelector('input[name=password-confirm]');

            if (!username.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'UsernameRequired')), Logs.WARNING);
                username.focus();
                log.delete(4000);
                return;
            }
            if (!password.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'PasswordRequired')), Logs.WARNING);
                password.focus();
                log.delete(4000);
                return;
            }
            if (!email.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'EmailRequired')), Logs.WARNING);
                email.focus();
                log.delete(4000);
                return;
            }
            if (!confirm.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'ConfirmRequired')), Logs.WARNING);
                confirm.focus();
                log.delete(4000);
                return;
            }
            if (confirm.value !== password.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'ConfirmInvalid')), Logs.ERROR);
                confirm.focus();
                log.delete(4000);
                return;
            }

            try {
                await API.execute(API.ROUTE.SIGNUP(), API.METHOD.POST, {
                    username: username.value,
                    email: email.value,
                    password: password.value
                });

                const response = await API.execute(API.ROUTE.LOGIN(), API.METHOD.POST, {
                    username: username.value,
                    password: password.value
                });
                
                const user = new User({ token: response.token });
                await user.fetchInformations();
                user.save();

                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'SignedUp')), Logs.SUCCESS);
                log.delete(2000);
                setTimeout(() => {
                    this.redirectToPage();
                }, 1000);
            } catch (err) {
                switch (err.status) {
                case 401:
                    log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'InvalidCredentials')), Logs.ERROR);
                    log.delete(4000);
                    break;
                default:
                    log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'Unknown', {msg: err.message})), Logs.ERROR);
                    log.delete(4000);
                    break;
                }
            }
        },
        redirectToPage() {
            const redirect = this.$route.query.redirect;
            if (redirect) {
                this.$router.push(redirect);
            } else this.$router.push({ name: 'My' });
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
