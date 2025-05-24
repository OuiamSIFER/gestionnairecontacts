import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Contacts from '../components/ContactList.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/contacts', component: Contacts }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; // Assure-toi que cette ligne existe !
