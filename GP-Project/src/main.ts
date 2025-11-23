import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//Font Awsome 
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import countries from 'iso-3166-1/dist/iso-3166';
import CountryFlag from "vue-country-flag-next";


const app = createApp(App)
app.component("CountryFlag", CountryFlag);
app.use(createPinia())
app.use(router)

app.mount('#app')
