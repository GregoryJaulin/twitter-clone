<template>
  <label class="select">
    <select :name="label" :required="isRequired" v-model="value" @change="$emit('update:value', this.value)">
      <option v-if="disableFirst" value="empty" disabled selected></option>
      <option v-for="(option, index) in options" :value="option" :selected="value == option" :key="index">
        {{ option }}
      </option>
    </select>
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: "Select",
  props: {
    label: String,
    options: {
      type: Array,
      required: true,
    },
    isRequired: Boolean,
    hasAutofocus: Boolean,
    disableFirst: Boolean,
    selection: [String, Number],
    emitSelectEvent: Boolean
  },
  data() {
    return {
      value: this.selection
    }
  }
};
</script>

<style lang='scss'>
@import "../assets/_variables.scss";

label.select {
  cursor: text;
  position: relative;
  display: flex;
  flex-direction: column-reverse;

  height: 3.5rem;
  padding: 0.25rem 0.5rem;

  color: $gray;
  border-radius: 0.25rem;
  border: solid 1px $gray;

  &:focus-within {
    border: solid 1px $blue;

    span {
      color: $blue;
    }
  }

  span {
    position: absolute;
    top: 50%;
    left: 0.5rem;

    font-size: 1rem;

    transform: translateY(-100%);
  }

  select {
    padding: 0.75rem 0 0.25rem 0;
    border: none;
    background: none;
    outline: none;

    color: $extra-light-gray;

    text-transform: capitalize;
  }

  option {
    background: $darker;
    border: none;
    outline: none;
  }
}
</style>