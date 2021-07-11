<template>
  <label
    class="field"
    :class="{'with-counter': counter, 'prefixed': prefix, invalid}"
    :data-prefix="prefix"
    :data-fulfillment="counter ? value.length + ' / ' + maxLength : null"
  >
    <input
      :type="type"
      :name="name"
      :maxlength="maxLength"
      placeholder=" "
      autocomplete="off"
      :autofocus="autofocus"
      :required="required"
      v-model="value"
      @input="$emit('update:value', this.value)"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: "Input",
  props: {
    name: {
      type: String,
      default: "name",
    },
    type: {
      type: String,
      default: 'text'
    },
    label: String,
    baseValue: String,
    maxLength: {
      type: Number,
      default: -1,
    },
    prefix: String,
    required: Boolean,
    autofocus: Boolean,
    counter: Boolean,
    invalid: Boolean
  },
  data() {
    return {
      value: this.baseValue,
    };
  }
};
</script>

<style lang='scss'>
@import "../assets/_variables.scss";

label.field {
  cursor: text;
  position: relative;
  display: flex;
  flex-direction: column-reverse;

  height: 3.5rem;
  padding: 0.25rem 0.5rem;

  color: $gray;
  border-radius: 0.25rem;
  border: solid 1px $gray;

  &.invalid {
    color: $red;
    border: solid 1px $red;
  }

  &:focus-within {
    border: solid 1px $blue;

    span {
      font-size: 1rem;
      color: $blue;
      transform: translateY(-100%);
    }
  }

  span {
    position: absolute;
    top: 50%;
    left: 0.5rem;

    font-size: 1rem;

    transform: translateY(-50%);
    transition: 0.2s ease;
  }

  input {
    padding: 0.75rem 0 0.25rem 0;
    border: none;
    background: none;
    outline: none;

    color: $extra-light-gray;
  }

  input:not(:placeholder-shown) + span {
    font-size: 1rem;
    transform: translateY(-100%);
  }
}

label.field.with-counter {
  &:focus-within::after {
    content: attr(data-fulfillment);
  }

  &::after {
    position: absolute;
    content: "";
    top: 0.5rem;
    right: 0.5rem;

    font-size: 0.8rem;
  }
}

label.field.prefixed {
  span {
    transform: translateY(-100%);
  }

  input {
    transform: translate(1.25rem);
  }

  &::before {
    position: absolute;
    content: attr(data-prefix);

    transform: translateY(-.2em);
  }
} 
</style>