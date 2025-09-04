<script setup>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase"; 

const formRef = ref(null);
const isValid = ref(false);
const name = ref("");
const email = ref("");
const role = ref(null);
const dateJoined = ref("");
const menu = ref(false);
const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");

const roles = ["Developer", "Designer", "Tester"];

const required = (v) => !!v || "Required";
const emailRule = (v) => /.+@.+\..+/.test(v) || "Invalid email";

function formatDate(date) {
  if (!date) return "";
  if (typeof date === "string") return date;

  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  if (
    !name.value.trim() ||
    !email.value.trim() ||
    !role.value ||
    !dateJoined.value
  ) {
    snackbarText.value = "Please fill all fields.";
    snackbar.value = true;
    return;
  }

  loading.value = true;
  let timeoutId;
  try {
    // Database check
    if (!db) {
      throw new Error("DB not initialized.");
    }
    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      role: role.value,
      dateJoined: formatDate(dateJoined.value),
    };
    // Add a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      loading.value = false;
      snackbarText.value = "Request timed out.";
      snackbar.value = true;
    }, 10000);

    await addDoc(collection(db, "interns"), payload);
    clearTimeout(timeoutId);
    snackbarText.value = "saved successfully!";
    snackbar.value = true;
    name.value = "";
    email.value = "";
    role.value = null;
    dateJoined.value = "";
    formRef.value.resetValidation();
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("Firestore error:", err);
    snackbarText.value =
      "Failed to save. Check Firebase config, permissions, and network.";
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-form
    ref="formRef"
    v-model="isValid"
    validate-on="submit"
    @submit.prevent="submit"
  >
    <div class="d-flex flex-column ga-4">
      <v-text-field
        label="Full Name"
        v-model="name"
        :rules="[required]"
        prepend-inner-icon="mdi-account"
        clearable
      />

      <v-text-field
        label="Email"
        v-model="email"
        :rules="[required, emailRule]"
        prepend-inner-icon="mdi-email"
        clearable
      />

      <v-select
        label="Role"
        v-model="role"
        :items="roles"
        :rules="[required]"
        prepend-inner-icon="mdi-briefcase"
        clearable
      />

      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
      >
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            label="Date Joined"
            v-model="dateJoined"
            :rules="[required]"
            prepend-inner-icon="mdi-calendar"
            readonly
            clearable
            placeholder="YYYY-MM-DD"
          />
        </template>
        <v-date-picker v-model="dateJoined" @update:modelValue="menu = false" />
      </v-menu>

      <v-btn
        type="submit"
        color="green"
        :loading="loading"
        prepend-icon="mdi-content-save"
        >Save</v-btn
      >
    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="2500"
      color="success"
      variant="flat"
      >{{ snackbarText }}</v-snackbar
    >
  </v-form>
</template>

<style scoped>
.ga-4 > * + * {
  margin-top: 16px;
}
</style>
