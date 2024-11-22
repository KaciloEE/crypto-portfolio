<template>
  <v-autocomplete
    v-model="newModelValue"
    label="Coins"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :rules="rules"
    :variant="getVariant"
    class="autocomplete-with-img mb-2"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="props"
        :prepend-avatar="item.raw.image"
        :title="item.raw.name"
      ></v-list-item>
    </template>

    <template v-slot:selection="{ item, index }">
      <v-list-item :title="item.raw.name">
        <template #prepend>
          <img
            v-if="item.raw.image"
            :src="item.raw.image"
            alt="coin"
            class="mr-1"
          />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "AutocompleteWithImg",
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
    items: Array,
    itemTitle: String,
    itemValue: String,
    variant: String,
    rules: Array,
  },
  data() {
    return {
      newModelValue: this.modelValue,
    };
  },
  computed: {
    getVariant() {
      return this.variant ? this.variant : "solo";
    },
  },
  watch: {
    newModelValue(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
};
</script>
