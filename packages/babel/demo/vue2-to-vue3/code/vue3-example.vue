<script>
import { computed, defineProps, onBeforeUnmount, reactive, watch } from 'vue'

const props = defineProps({
  firstName: {
    type: String,
    "default": 'Jour'
  }
});

const state = reactive({
  lastName: 'Tom'
});

const name = computed(function name() {
  return props.firstName + state.lastName;
});
const secondName = computed({
  get: function get() {
    return state.lastName + props.firstName;
  }
});

watch('name', (cur, prev) => {
  console.log(cur, prev);
}, {
  deep: true
});

const sayHello = aa => {
  console.log('say Hi');
  return aa;
};

onBeforeUnmount(() => {
  console.log('before unmount!');
});

</script>
