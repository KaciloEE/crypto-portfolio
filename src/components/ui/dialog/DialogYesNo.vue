<template>
  <v-dialog max-width="400">
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :activator-props="activatorProps">
        <v-btn
          v-if="iconActivator"
          v-bind="activatorProps"
          :class="classActivator"
          :color="colorActivator"
          :icon="iconActivator"
          :loading="isLoading ? isLoading : false"
          :disabled="isLoading ? isLoading : false"
        >
        </v-btn>
        <v-btn
          v-else
          v-bind="activatorProps"
          :class="classActivator"
          :color="colorActivator"
          :loading="isLoading ? isLoading : false"
          :disabled="isLoading ? isLoading : false"
        >
          {{ textActivator }}
        </v-btn>
      </slot>
    </template>

    <template #default="{ isActive }">
      <v-card :title="titleDialog" :color="colorDialog">
        <v-card-text>
          <slot name="text"> There's some text here... </slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <slot name="yes-no-buttons" :is-active="isActive">
            <v-btn text="Yes" @click="isActive.value = false"></v-btn>
            <v-btn text="No" @click="isActive.value = false"></v-btn>
          </slot>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogYesNo",
  props: {
    classActivator: String,
    colorActivator: String,
    iconActivator: String,
    textActivator: String,
    titleDialog: String,
    colorDialog: String,
    isLoading: Boolean,
  },
};
</script>
