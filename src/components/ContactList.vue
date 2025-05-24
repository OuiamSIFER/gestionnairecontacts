<template>
  <div class="contact-list">
    <!-- Bouton Ajouter -->
    <button @click="isAddModalVisible = true" id="add">
      
      Ajouter un contact
    </button>
    <input
  v-model="searchTerm"
  type="text"
  placeholder="Rechercher par nom, email ou téléphone"
  class="form-control my-3"
/>
    <!-- Affichage état de chargement ou erreur -->
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="contacts.length === 0">Aucun contact trouvé.</div>
 <!-- Champ de recherche -->


    <!-- Tableau des contacts paginés -->
    <table v-else>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in paginatedContacts" :key="contact.id">
          <td>{{ contact.name }}</td>
          <td>{{ contact.email }}</td>
          <td>{{ contact.phone }}</td>
          <td>
            <button @click="editContact(contact)">
              <img src="@/assets/editer.png" alt="Modifier" style="width: 30px; height: 30px; margin-right: 5px;">
            </button>
            <button @click="confirmDelete(contact)">
              <img src="@/assets/bouton-supprimer.png" alt="Supprimer" style="width: 30px; height: 30px; margin-right: 5px;">
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>

      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>

    <!-- Modale Ajouter -->
    <div v-if="isAddModalVisible" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Ajouter un contact</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleAddContact">

          <div class="mb-3 row">
            <label for="name" class="col-md-3 col-form-label">Nom</label>
            <div class="col-md-9">
              <input v-model="newContact.name" type="text" class="form-control" id="name" required />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="email" class="col-md-3 col-form-label">Email</label>
            <div class="col-md-9">
              <input v-model="newContact.email" type="email" class="form-control" id="email" required />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="phone" class="col-md-3 col-form-label">Téléphone</label>
            <div class="col-md-9">
              <!-- <input v-model="newContact.phone" type="text" class="form-control" id="phone" required /> -->
              <input v-model="newContact.phone" type="text" class="form-control" id="phone"
       pattern="^[0-9]+$" title="Veuillez entrer uniquement des chiffres" required />

            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary" :disabled="loading">Ajouter</button>
            <button @click="closeModal" type="button" class="btn btn-secondary">Annuler</button>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <!-- Messages de succès ou d'erreur -->
        <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
        <p v-if="loading" class="text-info">Envoi en cours...</p>
      </div>
    </div>
  </div>
</div>

    <!-- Modale Modifier -->
   <!-- Modale Modifier (Bootstrap Version) -->
<div v-if="isEditModalVisible" class="modal fade show" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editModalLabel">Modifier le Contact</h5>
        <button type="button" class="btn-close" @click="cancelEdit" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleUpdate">
          <div class="mb-3">
            <label for="name" class="form-label">Nom</label>
            <input v-model="selectedContact.name" type="text" class="form-control" id="name" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input v-model="selectedContact.email" type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Téléphone</label>
            <input v-model="selectedContact.phone" type="text" class="form-control" id="phone" required />
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary" :disabled="loading">Modifier</button>
            <button type="button" class="btn btn-secondary" @click="cancelEdit">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>


    <!-- Modale Supprimer -->
  <!-- Modale Supprimer -->
<div v-if="isDeleteModalVisible" class="modal fade show" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteModalLabel">Confirmation de suppression</h5>
        <button type="button" class="btn-close" @click="cancelDelete" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h3>Êtes-vous sûr de vouloir supprimer ce contact ?</h3>
      </div>
      <div class="modal-footer">
        <button @click="deleteContact" class="btn btn-danger" :disabled="loading">Supprimer</button>
        <button @click="cancelDelete" type="button" class="btn btn-secondary">Annuler</button>
      </div>
    </div>
  </div>
</div>


 <!-- Message Informatif -->
<div v-if="successMessage" class="alert alert-info alert-dismissible fade show" role="alert">
  {{ successMessage }}
  <button type="button" class="btn-close" aria-label="Close" @click="successMessage = null"></button>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Données
const contacts = ref([])
const loading = ref(true)
const error = ref(null)
const successMessage = ref(null)
const isEditModalVisible = ref(false)
const isDeleteModalVisible = ref(false)
const isAddModalVisible = ref(false)
const selectedContact = ref(null)
const contactToDelete = ref(null)
const newContact = ref({ name: '', email: '', phone: '' })
const searchTerm = ref('')

const filteredContacts = computed(() => {
  if (!searchTerm.value.trim()) return contacts.value

  return contacts.value.filter(contact => {
    const term = searchTerm.value.toLowerCase()
    return (
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.toLowerCase().includes(term)
    )
  })
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredContacts.value.slice(start, start + itemsPerPage.value)
})


const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage.value))

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Récupération
async function fetchContacts() {
  try {
    const res = await axios.get('http://localhost:3000/contacts')
    contacts.value = res.data
  } catch {
    error.value = 'Erreur lors du chargement des contacts.'
  } finally {
    loading.value = false
  }
}
onMounted(fetchContacts)

// Ajouter
async function handleAddContact() {
  loading.value = true
  try {
    if (!/^\d+$/.test(newContact.value.phone)) {
  error.value = 'Le numéro de téléphone doit contenir uniquement des chiffres.'
  loading.value = false
  return
}
    const res = await axios.post('http://localhost:3000/contacts', newContact.value)
    contacts.value.push(res.data)
    newContact.value = { name: '', email: '', phone: '' }
    isAddModalVisible.value = false
    successMessage.value = 'Nouveau contact ajouté avec succès !'
   
    setTimeout(() => (successMessage.value = null), 2000)
  } catch {
    error.value = 'Erreur lors de l\'ajout du contact.'
  } finally {
    loading.value = false
  }
}

// Modifier
function editContact(contact) {
  selectedContact.value = { ...contact }
  isEditModalVisible.value = true
}
function closeModal() {
  isAddModalVisible.value = false;
  isEditModalVisible.value = false;
  isDeleteModalVisible.value = false;
}

function cancelEdit() {
  isEditModalVisible.value = false
  selectedContact.value = null
}
async function handleUpdate() {
  loading.value = true
  try {
    const res = await axios.put(`http://localhost:3000/contacts/${selectedContact.value.id}`, selectedContact.value)
    const index = contacts.value.findIndex(c => c.id === selectedContact.value.id)
    if (index !== -1) contacts.value[index] = res.data
    successMessage.value = 'Contact modifié avec succès !'
    isEditModalVisible.value=false
    setTimeout(() => {
      isEditModalVisible.value = false
      selectedContact.value = null
      successMessage.value = null
    }, 2000)
  } catch {
    error.value = 'Erreur lors de la modification.'
  } finally {
    loading.value = false
  }
}

// Supprimer
function confirmDelete(contact) {
  contactToDelete.value = contact
  isDeleteModalVisible.value = true
}
function cancelDelete() {
  isDeleteModalVisible.value = false
  contactToDelete.value = null
}
async function deleteContact() {
  loading.value = true
  try {
    await axios.delete(`http://localhost:3000/contacts/${contactToDelete.value.id}`)
    contacts.value = contacts.value.filter(c => c.id !== contactToDelete.value.id)
    successMessage.value = 'Contact supprimé avec succès !'
    isDeleteModalVisible.value = false
    setTimeout(() => {
      isDeleteModalVisible.value = false
      contactToDelete.value = null
      successMessage.value = null
    }, 1000)
  } catch {
    error.value = 'Erreur lors de la suppression.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#add {
  font-family: 'Beiruti', sans-serif;
    background-color: #92b3be;
    border: 2px solid transparent;
    padding: 5px 20px;
    cursor: pointer;
    color: white;
    float: right;
    margin-bottom: 15px;
    margin-top: 15px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.success-message {
  margin-top: 15px;
  color: green;
  font-weight: bold;
}

.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 5px;
}
.pagination button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #92b3be;
    color: white;
    border-color: transparent;
    font-family: 'Beiruti', sans-serif;
    font-size: 15px;
}
.pagination button.active {
  font-weight: bold;
  background-color: #ddd;
  font-family: 'Beiruti', sans-serif;
}


</style>
