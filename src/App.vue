<template>
<v-app>
<v-main>
<div class="pa-6 d-flex justify-center">
<v-card elevation="2" class="w-100" max-width="720">
<v-toolbar color="green" density="comfortable" title="Registration Form" dark />
<v-card-text>
<InternForm />
</v-card-text>
</v-card>
</div>
</v-main>
</v-app>
</template>


<script setup>
import InternForm from './components/InternForm.vue'
</script>