<template>
  <input
    v-on:change="validateInput"
    v-on:keydown="validateInput"
    v-on:paste="validateInput"
    v-model="propModel"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :className="validatedClassName" />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    validator: {
      type: Function,
      default () {
        const formErrors = []
        return formErrors
      }
    },
    placeholder: {
      type: String,
      default: 'Enter text'
    },
    maxlength: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      formErrors: []
    }
  },
  computed: {
    validatedClassName () {
      return this.formErrors.length ? 'not-ok' : 'ok'
    },
    propModel: {
      get () { return this.modelValue },
      set (value) { this.$emit('update:modelValue', value) }
    }
  },
  methods: {
    validateInput () {
      setTimeout(() => {
        this.formErrors = this.validator()
      }, 0)
      return true
    }
  },
  watch: {
    modelValue () {
      this.validateInput()
    }
  }
}
</script>

<style scoped>
input {
  margin: 0.5em;
}
input {
  border: 1px solid black;
  border-radius: 0.4em;
  color: black;
  background: white;
  margin: 0.2em;
  padding: 0.4em 1.2em;
  font-size: 0.9em;
  text-decoration: none;
  font-family: inherit;
  cursor: default;
}
input:focus {
  background: rgb(248, 187, 102);
  outline: 1px solid orange;
}
input.not-ok {
  background: rgb(244, 124, 124);
  outline: 1px solid red;
}
</style>
