<script>
import HelloWorld from 'HelloWorld'

export default {
  name: 'App',

  components: {
    HelloWorld
  },

  props: {
    firstName: {
      type: String,
      default: 'Jour'
    }
  },

  data () {
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
}
</script>
