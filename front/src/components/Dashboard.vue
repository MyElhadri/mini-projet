<script setup>

</script>
<template>
<div class="sidebar">
    <h1> Dashboard </h1>
    <RouterLink class="nav-btn" to="/skills">Skills</RouterLink>
    <RouterLink class="nav-btn" to="/people">People</RouterLink>
</div>
</template>
<style scoped>

.sidebar {
  height: 100vh;
  width: 220px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 32px;
  text-align: center;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-btn {
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #f9fafb;
  color: #1f2937;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-btn:hover {
  background-color: #e5e7eb;
  color: #111827;
}
</style>
