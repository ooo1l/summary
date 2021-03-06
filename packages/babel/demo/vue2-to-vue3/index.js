import {transformSync} from '@babel/core';
import plugin from './core/transform-options-to-composition.js';

const sourceCode = `
export default {
  props: {
    firstName: {
      type: String,
      default: 'Jour'
    }
  },
  data () {
    const a = 1;
    return {
      lastName: 'Tom'
    }
  },
  computed: {
    name () {
      return this.firstName + this.lastName
    },
    secondName: {
      get () {
        return this.lastName + this.firstName
      }
    } 
  },
  watch: {
    name: {
      deep: true,
      handler (cur, prev) {
        console.log(cur, prev)
      }
    }
  },
  methods: {
    sayHello (aa) {
      console.log('say Hi')
      return aa
    }
  },
  beforeUnmount () {
    console.log('before unmount!')
  }
}`

const { code } = transformSync(sourceCode, {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  plugins: [plugin],
})

console.log(code)
