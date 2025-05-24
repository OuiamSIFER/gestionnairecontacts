<template>
    <div>
      <!-- Bouton pour afficher la modale -->
  
 <!-- Modale de formulaire d'ajout de contact -->
<!-- Modale de formulaire d'ajout de contact -->


    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Variables de formulaire
  const name = ref('')
  const email = ref('')
  const phone = ref('')
  const loading = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')
  const showModal = ref(false) // État pour gérer l'affichage de la modale
  
  // Définir l'événement 'contact-added'
  const emit = defineEmits(['contact-added'])
  
  // Validation de l'email
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  // Soumettre le formulaire
  async function handleSubmit() {
    if (!name.value || !email.value || !phone.value) {
      errorMessage.value = 'Tous les champs sont requis.'
      return
    }
  
    if (!validateEmail(email.value)) {
      errorMessage.value = 'Format d\'email invalide.'
      return
    }
  
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
  
    try {
      const response = await fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          phone: phone.value
        })
      })
  
      if (!response.ok) throw new Error('Erreur lors de l\'ajout')
  
      const newContact = await response.json()
  
      // Émettre l'événement pour ajouter le contact dans le parent (par exemple, dans ContactList.vue)
      emit('contact-added', newContact)
  
      successMessage.value = 'Contact ajouté avec succès !'
  
      // Fermer la modale après un délai pour voir le message de succès
      setTimeout(() => {
        closeModal()
      }, 2000)  // Fermer la modale après 2 secondes
  
      // Réinitialiser le formulaire
      name.value = ''
      email.value = ''
      phone.value = ''
    } catch (err) {
      errorMessage.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  // Fermer la modale
  function closeModal() {
    showModal.value = false
    successMessage.value = ''
  }
  </script>
  
  