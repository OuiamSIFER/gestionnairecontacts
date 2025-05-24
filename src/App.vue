<script setup>
import { ref, onMounted } from 'vue'
import ContactList from './components/ContactList.vue'
import ContactForm from './components/ContactForm.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const contacts = ref([])         // Liste des contacts
const isLoading = ref(true)      // Indicateur de chargement
const error = ref('')            // Message d'erreur

// Fonction pour récupérer les contacts
async function fetchContacts() {
  isLoading.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:3000/contacts')
    if (!res.ok) throw new Error('Erreur lors de la récupération des contacts.')
    contacts.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Ajouter un contact à la liste
function addContact(newContact) {
  contacts.value.push(newContact)
}

// Chargement initial
onMounted(() => {
  fetchContacts()
})
</script>

 <!-- <template>
  <div id="app">
    <h1>Gestionnaire de contacts</h1>

 
    <ContactForm @contact-added="addContact" />

 
    <div v-if="isLoading">Chargement des contacts...</div>
    <div v-else-if="error" style="color: red;">{{ error }}</div>
    

    <ContactList :contacts="contacts" />
  </div>
</template> -->


<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Accueil</router-link>
        <router-link to="/contacts">Liste des contacts</router-link>
      </nav>
    </header>
    <router-view />
  </div>
</template>


<style>
header {
  background: linear-gradient(90deg, #77c6e9, #005f73);
  padding: 15px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

nav {
  display: flex;
  justify-content: center;
  gap: 30px;
}

nav a {
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  color: white;
  transition: color 0.3s, transform 0.2s;
}

nav a:hover {
  color: #ffdd57;
  transform: scale(1.1);
}

@font-face {
  font-family: 'Beiruti';
  src: url('@/assets/fonts/Beiruti.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}



body {
  background-image: url('@/assets/contact.jpg'); /* Si le fichier est dans /public/assets */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Beiruti', sans-serif;
  color: white;
  text-shadow: 1px 1px 2px black;
}
#app {
  padding: 40px;
  background-color:rgba(0, 0, 0, 0.1); /* Pour lisibilité sur fond */
  max-width: 1000px;
  margin: auto;
  border-radius: 10px;
}

h1 {
  text-align: center;
}

.add-contact-form {
  margin-top: 20px;
}

.container {
        background-color: rgba(255, 255, 255, 0.8);
        width: 60%;
        margin: 50px auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 10px #999;
    }

    h1 {
        text-align: center;
        color: #77c6e9;
        margin-bottom: 30px;
        text-transform: uppercase;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
    }

    th, td {
        padding: 10px;
        border-bottom: 1px solid #ccc;
        font-size: 15px;
        text-align: center;
    }

    th {
        background-color: #77c6e985;
        color: white;
        text-align: center;
        font-size: 15px;
    }

    td button {
        padding: 5px 10px;
        margin-right: 5px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: transparent;
        font-size: 13px;
    }

    .modifier {
        background-color: #ffc107;
        color: #fff;
    }

    .supprimer {
        background-color: #dc3545;
        color: #fff;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    form label {
        margin-top: 10px;
    }
    input {
    margin: 0;
    padding: 8px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
}

  

    form button {
        width: 100px;
        margin-top: 15px;
        padding: 8px;
        background-color: #77c6e985;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    form button:hover {
        background-color: #77c6e985;
    }
</style>
