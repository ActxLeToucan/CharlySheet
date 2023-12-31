<template>
    <comp-navbar />
    <div class="flex grow flex-col min-h-full max-h-full h-fit max-w-full w-full justify-center items-center">
        <div
            class="show-up flex flex-col h-fit w-full md:h-[40em] md:w-[40em] justify-evenly items-center p-4 md:p-8 overflow-hidden
                   bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-2xl"
        >
            <div
                ref="panels"
                class="flex grow w-full h-full"
            >
                <div
                    ref="updateAccount-panel"
                    class="flex flex-col grow space-y-8 md:space-y-16"
                >
                    <div class="flex flex-row items-center justify-center space-x-4">
                        <comp-title>
                            <get-text :context="Lang.CreateTranslationContext('parameters', 'ModifyAccount')" />
                        </comp-title>
                    </div>
                    <div
                        v-if="shownPanel === 'updateAccount-panel'"
                        ref="updateAccount-input"
                        class="flex flex-col space-y-4 mx-auto"
                    >
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'Username')"
                            :placeholder="Lang.CreateTranslationContext('home', 'Username')"
                            name="username"
                            :value="formProperties.properties.username"
                        />
                        <comp-input
                            :label="Lang.CreateTranslationContext('home', 'Email')"
                            :placeholder="Lang.CreateTranslationContext('home', 'Email')"
                            name="email"
                            :value="formProperties.properties.email"
                        />
                        <comp-button
                            class="mx-auto my-2"
                            :icon="CheckIcon"
                            :onclick="() => modifyAccount()"
                            :disabled="isButtonDisabled"
                        >
                            <get-text :context="Lang.CreateTranslationContext('parameters', 'SaveModify')" />
                        </comp-button>
                    </div>
                    

                    <comp-button
                        class="mx-auto my-2"
                        :icon="UserMinusIcon"
                        :onclick="() => disconnect()"
                    >
                        <get-text :context="Lang.CreateTranslationContext('verbs', 'LogOut')" />
                    </comp-button>

                    <div
                        class="flex flex-col grow justify-end"
                    >
                        <log-zone ref="modifyAccount-log-zone" />
                        <div class="flex flex-wrap w-full h-fit">
                            <comp-button
                                class="mx-auto my-2"
                                :icon="TrashIcon"
                                :onclick="() => goToDelete()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('parameters', 'DeleteAccount')" />
                            </comp-button>
                            <comp-button
                                class="mx-auto my-2"
                                :icon="ChevronRightIcon"
                                :onclick="() => goToModifyPwd()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('parameters', 'ModifyPassword')" />
                            </comp-button>                            
                        </div>
                    </div>
                </div>
                <div
                    ref="modifyPwd-panel"
                    class="flex flex-col grow hidden space-y-8 md:space-y-16"
                >
                    <div class="flex flex-row items-center justify-center space-x-4">
                        <comp-title>
                            <get-text :context="Lang.CreateTranslationContext('parameters', 'ModifyPassword')" />
                        </comp-title>
                    </div>
                    <div
                        v-if="shownPanel === 'modifyPwd-panel'"
                        class="flex flex-col space-y-4 mx-auto"
                    >
                        <comp-input
                            :label="Lang.CreateTranslationContext('parameters', 'OldPassword')"
                            :placeholder="Lang.CreateTranslationContext('parameters', 'OldPassword')"
                            type="password"
                            name="password-old"
                            autocomplete="off"
                            autocapitalize="off"
                        />
                        <comp-input
                            :label="Lang.CreateTranslationContext('parameters', 'NewPassword')"
                            :placeholder="Lang.CreateTranslationContext('parameters', 'NewPassword')"
                            type="password"
                            name="password-new"
                            autocomplete="off"
                            autocapitalize="off"
                        />
                        <comp-input
                            :label="Lang.CreateTranslationContext('parameters', 'ConfirmPassword')"
                            :placeholder="Lang.CreateTranslationContext('parameters', 'ConfirmPassword')"
                            type="password"
                            name="password-confirm-new"
                            autocomplete="off"
                            autocapitalize="off"
                        />
                    </div>
                    <div
                        class="flex flex-col grow justify-end"
                    >
                        <log-zone ref="changePwd-log-zone" />
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
                                :onclick="() => changePwd()"
                            >
                                <get-text :context="Lang.CreateTranslationContext('verbs', 'Confirm')" />
                            </comp-button>
                        </div>
                    </div>
                </div>

                <div
                    ref="delete-panel"
                    class="flex flex-col grow hidden space-y-8 md:space-y-16"
                >
                    <div class="flex flex-row items-center justify-center space-x-4">
                        <comp-title>
                            <get-text :context="Lang.CreateTranslationContext('parameters', 'DeleteAccount')" />
                        </comp-title>
                    </div>
                    <div
                        v-if="shownPanel === 'delete-panel'"
                        class="flex flex-col space-y-4 mx-auto"
                    >
                        <div class="flex flex-row items-center justify-center space-x-4">
                            <get-text :context="Lang.CreateTranslationContext('parameters', 'DeleteAccConfirm')" />
                        </div>
                    </div>
                    <div class="flex flex-col grow justify-end">
                        <log-zone ref="delete-log-zone" />
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
                                :color="red"
                                :onclick="() => deleteAccount()"
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
import CompNavbar from "../components/CompNavbar.vue";
import CompTitle from '../components/CompTitle.vue';
import CompInput from '../components/CompInput.vue';
import GetText from '../components/text/GetText.vue';
import LogZone from '../components/text/LogZone.vue';
import API from '../scripts/API';
import Lang from '../scripts/Lang';
import Logs from '../scripts/Logs';

import {CheckIcon, ChevronLeftIcon, ChevronRightIcon, UserMinusIcon, TrashIcon} from '@heroicons/vue/24/outline';
import User from '../models/User';

export default {
    name: "ParametersView",
    components: {
        CompNavbar,
        CompButton,
        CompTitle,
        CompInput,
        GetText,
        LogZone
    },
    data() {
        return {
            Lang,
            ChevronLeftIcon,
            ChevronRightIcon,
            UserMinusIcon,
            CheckIcon,
            TrashIcon,
            shownPanel: 'updateAccount-panel',
            formProperties: {
                properties: {
                    username: User.currentUser.username,
                    email: User.currentUser.email,
                }
            },
            isButtonDisabled: true
        };
    },
    mounted() {

        const updateAccount = this.$refs['updateAccount-input'];
        updateAccount.addEventListener('keydown', () =>{
            this.isButtonDisabled = false;
        });
        setTimeout(() => {
            const redirect = this.$route.query.redirect;
            if (redirect) {
                this.goToModifyPwd();
            } else this.goToHome('left');
        }, 200);
    },
    methods: {
        hidePanel(direction = 'left') {
            const panel = this.$refs['panels'];
            panel.classList.remove('show-left', 'show-right');
            panel.classList.add('hide-' + direction);
        },
        showPanel(name, direction = (name === 'updateAccount-panel' ? 'right' : 'left')) {
            this.hidePanel(direction);

            setTimeout(() => {
                this.shownPanel = name;
                const panels = ['updateAccount-panel', 'modifyPwd-panel', 'delete-panel'];
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
            this.showPanel('updateAccount-panel', dir);
        },
        goToModifyPwd() {
            this.showPanel('modifyPwd-panel');
        },
        goToDelete() {
            this.showPanel('delete-panel');
        },
        async modifyAccount(){
            const logZone = this.$refs['modifyAccount-log-zone'];
            const log = logZone.log('', Logs.INFO);
            Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'Updating')).then(text => {
                log.update(text);
            });

            const username = document.querySelector('input[name=username]');
            const email = document.querySelector('input[name=email]');


            if (!username.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'UsernameRequired')), Logs.WARNING);
                username.focus();
                log.delete(4000);
                return;
            }
            if (!email.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'EmailRequired')), Logs.WARNING);
                email.focus();
                log.delete(4000);
                return;
            }

            try {
                await API.execute_logged(API.ROUTE.ME(), API.METHOD.PATCH ,  {
                    username: username.value,
                    email: email.value
                });

                await User.currentUser.fetchInformations();
                User.currentUser.save();

                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'Edited')), Logs.SUCCESS);
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
        async deleteAccount(){
            const logZone = this.$refs['delete-log-zone'];
            const log = logZone.log('', Logs.INFO);
            Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'Deleting')).then(text => {
                log.update(text);
            });

            try {
                await fetch(API.execute_logged(API.ROUTE.ME(), API.METHOD.DELETE));


                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'Deleted')), Logs.SUCCESS);
                log.delete(2000);
                setTimeout(() => {
                    this.disconnect();
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
        async changePwd() {
            const logZone = this.$refs['changePwd-log-zone'];
            const log = logZone.log('', Logs.INFO);
            Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'Updating')).then(text => {
                log.update(text);
            });

            const oldPassword = document.querySelector('input[name=password-old]');
            const newPassword = document.querySelector('input[name=password-new]');
            const confirmNewPassword = document.querySelector('input[name=password-confirm-new]');

            if (!oldPassword.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'PasswordRequired')), Logs.WARNING);
                oldPassword.focus();
                log.delete(4000);
                return;
            }
            if (!newPassword.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'PasswordRequired')), Logs.WARNING);
                newPassword.focus();
                log.delete(4000);
                return;
            }
            if (!confirmNewPassword.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'ConfirmRequired')), Logs.WARNING);
                confirmNewPassword.focus();
                log.delete(4000);
                return;
            }
            if (confirmNewPassword.value !== newPassword.value) {
                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('errors', 'ConfirmInvalid')), Logs.ERROR);
                confirmNewPassword.focus();
                log.delete(4000);
                return;
            }

            try {
                await API.execute_logged(API.ROUTE.Change_PWD(), API.METHOD.PATCH, {
                    oldpassword: oldPassword.value,
                    newpassword: newPassword.value
                });

                log.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('verbs', 'Edited')), Logs.SUCCESS);
                log.delete(2000);
                setTimeout(() => {
                    this.goToHome();
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
        disconnect() {
            User.forget();
            this.$router.push({ name: 'Home' });
        },
        redirectToPage() {
            const redirect = this.$route.query.redirect;
            if (redirect) {
                this.$router.push(redirect);
            } else this.$router.push({name: 'My'});
        }
    }
}

</script>

