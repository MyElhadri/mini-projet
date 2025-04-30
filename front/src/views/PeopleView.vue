<template>
    <Dashboard />
    <div class="classes-page">
      <header class="header">
        <div class="container container-extended">
          <h1 class="logo">Gestion de personnes</h1> 
        </div>
      </header>
  
      <main class="main-content">
        <div class="container container-extended">
          <div class="classes-header">
            <h2 class="section-title">Liste des personnes</h2>
            <button class="btn-add" @click="toggleModal">Ajouter</button>
          </div>
          
          <div class="classes-container">
            <!-- Format liste au lieu de grille -->
            <div class="classes-list">
              <div 
                v-for="(skill, index) in skills" 
                :key="index"
                class="person-list-item clickable"
                @click="viewDetails(index)"
              >
                <div class="person-info">
                  <div class="person-avatar">
                    <img v-if="skill.imageUrl" :src="skill.imageUrl" class="avatar-image" alt="Photo">
                    <div v-else class="placeholder-avatar">
                      <span class="avatar-letter">{{ skill.title.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="person-name">{{ skill.title }}</div>
                  <div class="person-meta">
                    <span class="meta-item">
                      <i class="icon-skills"></i>
                      <span>{{ skill.criteria.length }} compétences</span>
                      <div class="skill-tags" v-if="skill.criteria.length > 0">
                        <span 
                          v-for="(compId, idx) in skill.criteria.slice(0, 2)" 
                          :key="idx" 
                          class="skill-tag"
                        >
                          {{ getCompetencyName(compId) }}
                        </span>
                        <span 
                            v-if="skill.criteria.length > 2" 
                            class="skill-more" 
                            @mouseenter="hoveredIndex = index" 
                            @mouseleave="hoveredIndex = null"
                        >+{{ skill.criteria.length - 2 }}
                              <div v-if="hoveredIndex === index" class="tooltip">
                                <span 
                                  v-for="(compId, i) in skill.criteria.slice(2)" 
                                  :key="i"
                                >
                                  {{ getCompetencyName(compId) }}
                                </span>
                              </div>
                        </span>
  
                      </div>
                    </span>
                  </div>
                </div>
                <div class="actions-container">
                  <div class="dropdown">
                    <button class="btn-menu" @click.stop="toggleDropdown(index)">
                      <span class="dots"></span>
                    </button>
                    <div class="dropdown-menu" v-if="activeDropdown === index">
                      <button class="dropdown-item" @click.stop="editPerson(index)">
                        <i class="icon-edit"></i> Modifier
                      </button>
                    </div>
                  </div>
                  <button class="btn-delete-list" @click.stop="confirmDelete(index)" title="Supprimer">&times;</button>
                </div>
              </div>
              
              <!-- Message si liste vide -->
              <div v-if="skills.length === 0" class="empty-list-message">
                Aucune personne dans la liste
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal formulaire avec flou en arrière-plan -->
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Ajouter personne</h3>
            <button class="btn-close" @click="toggleModal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addNewSkill">
              <div class="form-group">
                <label for="skillName">Nom </label>
                <input type="text" id="skillName" v-model="newSkill.title" required >
              </div>
              
                        
              <div class="criteria-section">
                <label>Compétences</label>
                
                <div class="competencies-container">
                  <div
                    v-for="competency in availableCompetencies"
                    :key="competency.id"
                    class="competency-chip"
                    :class="{ 'selected': isCompetencySelected(competency.id) }"
                    @click="toggleCompetency(competency.id)"
                  >
                    {{ competency.name }}
                  </div>
                </div>
                
                <div class="selected-competencies" v-if="newSkill.criteria.length > 0">
                  <label>Compétences sélectionnées:</label>
                  <div class="selected-chips">
                    <div 
                      v-for="compId in newSkill.criteria" 
                      :key="compId" 
                      class="selected-chip"
                    >
                      {{ getCompetencyName(compId) }}
                      <span class="remove-chip" @click.stop="removeCompetency(compId)">&times;</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-submit">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Modal de confirmation de suppression -->
      <div class="modal-overlay" v-if="showDeleteModal">
        <div class="modal-container modal-delete">
          <div class="modal-header">
            <h3>Confirmer la suppression</h3>
            <button class="btn-close" @click="cancelDelete">&times;</button>
          </div>
          <div class="modal-body text-center">
            <p>Êtes-vous sûr de vouloir supprimer cette personne ?</p>
            <div class="delete-actions">
              <button class="btn-cancel" @click="cancelDelete">Annuler</button>
              <button class="btn-confirm-delete" @click="deleteSkill">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal d'édition -->
      <div class="modal-overlay" v-if="showEditModal">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Modifier la personne</h3>
            <button class="btn-close" @click="closeEditModal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEditedPerson">
              <div class="form-group">
                <label for="editSkillName">Nom</label>
                <input type="text" id="editSkillName" v-model="editingSkill.title" required>
              </div>
              
              <div class="criteria-section">
                <label>Compétences</label>
                
                <div class="competencies-container">
                  <div
                    v-for="competency in availableCompetencies"
                    :key="competency.id"
                    class="competency-chip"
                    :class="{ 'selected': isCompetencySelectedForEdit(competency.id) }"
                    @click="toggleCompetencyForEdit(competency.id)"
                  >
                    {{ competency.name }}
                  </div>
                </div>
                
                <div class="selected-competencies" v-if="editingSkill.criteria.length > 0">
                  <label>Compétences sélectionnées:</label>
                  <div class="selected-chips">
                    <div 
                      v-for="compId in editingSkill.criteria" 
                      :key="compId" 
                      class="selected-chip"
                    >
                      {{ getCompetencyName(compId) }}
                      <span class="remove-chip" @click.stop="removeCompetencyFromEdit(compId)">&times;</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-submit btn-update">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Dashboard from '../components/Dashboard.vue'
  import { ref } from 'vue'

  const hoveredIndex = ref(null)
  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const showEditModal = ref(false)
  const skillToDelete = ref(null)
  const editingSkillIndex = ref(null)
  const activeDropdown = ref(null)
  const imagePreview = ref(null)
  
  const newSkill = ref({
    title: '',
    imageUrl: null,
    criteria: [],
    description: ''
  })
  
  const editingSkill = ref({
    title: '',
    imageUrl: null,
    criteria: [],
    description: ''
  })
  
  const availableCompetencies = ref([
    { id: 1, name: 'Communication' },
    { id: 2, name: 'Leadership' },
    { id: 3, name: "Travail d'équipe" },
    { id: 4, name: 'Résolution de problèmes' },
    { id: 5, name: 'Adaptabilité' },
    { id: 6, name: 'Pensée critique' },
    { id: 7, name: 'Créativité' },
    { id: 8, name: 'Organisation' },
    { id: 9, name: 'Gestion du temps' },
    { id: 10, name: 'Négociation' }
  ])
  
  const skills = ref([])
  
  function toggleModal() {
    showModal.value = !showModal.value
    if (!showModal.value) {
      resetForm()
    }
    document.body.style.overflow = showModal.value ? 'hidden' : ''
  }
  
  function resetForm() {
    newSkill.value = {
      title: '',
      imageUrl: null,
      criteria: [],
      description: ''
    }
    imagePreview.value = null
  }
  
  function handleImageUpload(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target.result
        newSkill.value.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  function isCompetencySelected(id) {
    return newSkill.value.criteria.includes(id)
  }
  
  function toggleCompetency(id) {
    const index = newSkill.value.criteria.indexOf(id)
    if (index === -1) {
      newSkill.value.criteria.push(id)
    } else {
      newSkill.value.criteria.splice(index, 1)
    }
  }
  
  function removeCompetency(id) {
    const index = newSkill.value.criteria.indexOf(id)
    if (index !== -1) newSkill.value.criteria.splice(index, 1)
  }
  
  function getCompetencyName(id) {
    const competency = availableCompetencies.value.find(c => c.id === id)
    return competency ? competency.name : 'Inconnu'
  }
  
  function isCompetencySelectedForEdit(id) {
    return editingSkill.value.criteria.includes(id)
  }
  
  function toggleCompetencyForEdit(id) {
    const index = editingSkill.value.criteria.indexOf(id)
    if (index === -1) {
      editingSkill.value.criteria.push(id)
    } else {
      editingSkill.value.criteria.splice(index, 1)
    }
  }
  
  function removeCompetencyFromEdit(id) {
    const index = editingSkill.value.criteria.indexOf(id)
    if (index !== -1) editingSkill.value.criteria.splice(index, 1)
  }
  
  function addNewSkill() {
    skills.value.push({ ...newSkill.value })
    toggleModal()
  }
  
  function confirmDelete(index) {
    skillToDelete.value = index
    showDeleteModal.value = true
    document.body.style.overflow = 'hidden'
  }
  
  function cancelDelete() {
    showDeleteModal.value = false
    skillToDelete.value = null
    document.body.style.overflow = ''
  }
  
  function deleteSkill() {
    if (skillToDelete.value !== null) {
      skills.value.splice(skillToDelete.value, 1)
      cancelDelete()
    }
  }
  
  function viewDetails(index) {
    //should add smth later here idk ...
  }
  
  function toggleDropdown(index) {
    activeDropdown.value = activeDropdown.value === index ? null : index
  }
  
  function editPerson(index) {
    editingSkill.value = JSON.parse(JSON.stringify(skills.value[index]))
    editingSkillIndex.value = index
    showEditModal.value = true
    activeDropdown.value = null
    document.body.style.overflow = 'hidden'
  }
  
  function closeEditModal() {
    showEditModal.value = false
    editingSkillIndex.value = null
    document.body.style.overflow = ''
  }
  
  function saveEditedPerson() {
    if (editingSkillIndex.value !== null) {
      skills.value.splice(editingSkillIndex.value, 1, editingSkill.value)
    }
    closeEditModal()
  }
  </script>
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .classes-page{
    margin-left : 500px;
  }
  html, body {
    width: 100%;
    overflow-x: hidden;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #1e90ff; 
    color: #333;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  .container-extended {
    max-width: 1800px;
    width: 95%;
  }
  
  /* Header */
  .header {
    background-color: #fff;
    padding: 15px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }
  
  .header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  /* Main Content */
  .main-content {
    padding: 40px 0;
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }
  
  .classes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  .btn-add {
    background-color: #0091ea;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-add:hover {
    background-color: #0070c0;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: #fff;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: modalFadeIn 0.3s ease;
  }
  
  .modal-delete {
    max-width: 400px;
  }
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 22px;
    color: #999;
    cursor: pointer;
  }
  
  .btn-close:hover {
    color: #333;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .text-center {
    text-align: center;
  }
  
  /* Formulaire */
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label,
  .criteria-section > label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #444;
    text-align: center;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .form-group textarea {
    resize: vertical;
  }
  
  /* Critères */
  .criteria-section {
    margin-bottom: 20px;
  }
  
  .criterion-item {
    margin-bottom: 10px;
  }
  
  .input-with-button {
    display: flex;
    align-items: center;
  }
  
  .input-with-button input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .btn-remove {
    background: none;
    border: none;
    color: #ff5252;
    font-size: 18px;
    cursor: pointer;
    padding: 0 5px;
  }
  
  .btn-add-criterion {
    background: none;
    border: 1px dashed #0091ea;
    color: #0091ea;
    border-radius: 6px;
    padding: 8px 15px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    font-size: 14px;
    transition: background-color 0.2s;
  }
  
  .btn-add-criterion:hover {
    background-color: #f0f7ff;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
  }
  
  .btn-submit {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-submit:hover {
    background-color: #388E3C;
  }
  
  /* Classes Container et Liste */
  .classes-container {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 30px;
    margin-bottom: 40px;
  }
  
  /* Nouveau style pour la liste */
  .classes-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .person-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
  }
  
  .person-list-item:hover {
    background-color: #f0f7ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .person-info {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-grow: 1;
  }
  
  .person-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder-avatar {
    width: 100%;
    height: 100%;
    background-color: #64b5f6;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-letter {
    color: white;
    font-weight: bold;
    font-size: 18px;
    text-transform: uppercase;
  }
  
  .person-name {
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }
  
  .person-meta {
    color: #777;
    font-size: 14px;
    margin-left: auto;
    margin-right: 20px;
  }
  
  .clickable {
    cursor: pointer;
  }
  
  .btn-delete-list {
    background: none;
    border: none;
    color: #ff5252;
    font-size: 24px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s, color 0.2s;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .btn-delete-list:hover {
    opacity: 1;
    color: #d32f2f;
    background-color: #ffebee;
  }
  
  .empty-list-message {
    text-align: center;
    padding: 30px;
    color: #777;
    font-style: italic;
  }
  
  .icon-skills:before {
    content: "🔍";
    margin-right: 5px;
  }
  
  /* Modal de confirmation de suppression */
  .delete-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .btn-cancel {
    background-color: #f5f5f5;
    color: #333;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-cancel:hover {
    background-color: #e0e0e0;
  }
  
  .btn-confirm-delete {
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-confirm-delete:hover {
    background-color: #d32f2f;
  }
  
  /* Dropdown styles */
  .actions-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .dropdown {
    position: relative;
  }
  
  .btn-menu {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .btn-menu:hover {
    background-color: #f1f1f1;
  }
  
  .dots {
    width: 5px;
    height: 5px;
    background-color: #777;
    border-radius: 50%;
    position: relative;
  }
  
  .dots::before,
  .dots::after {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #777;
    border-radius: 50%;
  }
  
  .dots::before {
    top: -8px;
  }
  
  .dots::after {
    top: 8px;
  }
  
  .dropdown-menu {
    position: absolute;
    right: 0;
    top: 40px;
    background-color: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    min-width: 150px;
    z-index: 10;
    animation: fadeInMenu 0.2s ease;
  }
  
  @keyframes fadeInMenu {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    font-size: 14px;
    color: #333;
    transition: background-color 0.2s;
  }
  
  .dropdown-item:hover {
    background-color: #f5f5f5;
  }
  
  .icon-edit:before {
    content: "✏️";
    margin-right: 8px;
  }
  
  .btn-update {
    background-color: #0091ea;
  }
  
  .btn-update:hover {
    background-color: #0070c0;
  }
  
  /* Styles pour les compétences sélectionnables */
  .competencies-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .competency-chip {
    background-color: #f1f1f1;
    border-radius: 30px;
    padding: 8px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .competency-chip:hover {
    background-color: #e0e0e0;
  }
  
  .competency-chip.selected {
    background-color: #0091ea;
    color: white;
  }
  
  .selected-competencies {
    margin-top: 20px;
  }
  
  .selected-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  
  .selected-chip {
    background-color: #e3f2fd;
    border-radius: 30px;
    padding: 5px 12px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  .remove-chip {
    margin-left: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s;
  }
  
  .skill-tags {
    display: flex;
    gap: 5px;
    margin-top: 5px;
    flex-wrap: wrap;
  }
  
  .skill-tag {
    font-size: 12px;
    padding: 2px 8px;
    background-color: #e3f2fd;
    border-radius: 12px;
    color: #0070c0;
  }
  
  .skill-more {
    font-size: 12px;
    padding: 2px 8px;
    background-color: #f1f1f1;
    border-radius: 12px;
    color: #777;
  }
  
  /* Responsive */
  @media (min-width: 1921px) {
    .container-extended {
      max-width: 2000px;
    }
  }
  
  @media (max-width: 1440px) {
    .container-extended {
      max-width: 1400px;
      width: 95%;
    }
  }
  
  @media (max-width: 1200px) {
    .container-extended {
      max-width: 1100px;
      width: 95%;
    }
  }
  
  @media (max-width: 992px) {
    .container-extended {
      max-width: 900px;
      width: 95%;
    }
  }
  
  @media (max-width: 768px) {
    .container-extended {
      max-width: 700px;
      width: 92%;
    }
    
    .classes-container {
      padding: 20px;
    }
    
    .person-info {
      gap: 10px;
    }
    
    .person-name {
      font-size: 14px;
    }
    
    .person-meta {
      font-size: 12px;
    }
    
    .modal-container {
      width: 95%;
    }
  }
  
  @media (max-width: 576px) {
    .container-extended {
      width: 90%;
    }
    
    .classes-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
    
    .classes-container {
      padding: 15px;
    }
    
    .logo {
      font-size: 20px;
    }
    
    .section-title {
      font-size: 20px;
    }
    
    .person-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
    
    .person-meta {
      margin-left: 0;
      margin-top: 5px;
    }
    
    .form-group input, 
    .form-group textarea,
    .input-with-button input {
      font-size: 14px;
    }
  }
  
  @media (max-width: 375px) {
    .btn-add, .btn-submit {
      padding: 8px 16px;
      font-size: 12px;
    }
    
    .modal-header h3 {
      font-size: 18px;
    }
    
    .person-list-item {
      padding: 10px;
    }
  }
  
  .skill-more {
    position: relative;
    cursor: pointer;
  }
  
  .tooltip {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 20;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    padding: 10px;
    border-radius: 6px;
    font-size: 13px;
    white-space: nowrap;
    margin-top: 5px;
  }
  .tooltip span {
    display: block;
    margin-bottom: 4px;
  }
  
  
  </style>