import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/aura-light-green/theme.css'


const app = createApp(App)

app.use(PrimeVue);
app.use(ToastService);

app.component("TabView", TabView);
app.component("TabPanel", TabPanel);

app.mount('#app')
