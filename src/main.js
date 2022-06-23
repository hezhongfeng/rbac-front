import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import componentInit from './componentInit';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(componentInit);
app.use(router);

app.mount('#app');
