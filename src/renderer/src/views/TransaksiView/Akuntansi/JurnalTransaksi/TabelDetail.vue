<script setup>
import { onMounted, ref } from 'vue'
// import { useMFAStore } from '@/stores/mfa'
// import { useRoute, useRouter } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'

// const route = useRoute()
// const router = useRouter()
// const MFA = useMFAStore()
// const Auth = useAuthStore()
// const user = ref('')
// const isLoading = ref(true)
// const signConfirmationModal = ref(false)
// const idSign = ref()

// const dateTime = ref('')
// const company_name = ref('')
// const certificate_number = ref('')
// const type_inspection = ref({
//   certification: false,
//   surveillance: false
// })
const props = defineProps({
  jurnal: { type: Object, required: true }
})
//const jurnal = props.jurnal

// const checklist = ref({
//   _1: { sat: false, unsat: false, na: false },
//   _2: { sat: false, unsat: false, na: false },
//   _3: { sat: false, unsat: false, na: false },
//   _4: { sat: false, unsat: false, na: false },
//   _5: { sat: false, unsat: false, na: false },
//   _6: { sat: false, unsat: false, na: false },
//   _7: { sat: false, unsat: false, na: false },
//   _8: { sat: false, unsat: false, na: false },
//   _9: { sat: false, unsat: false, na: false },
//   _10: { sat: false, unsat: false, na: false },
//   _11: { sat: false, unsat: false, na: false },
//   _12: { sat: false, unsat: false, na: false },
//   _13: { sat: false, unsat: false, na: false },
//   _14: { sat: false, unsat: false, na: false },
//   _15: { sat: false, unsat: false, na: false },
//   _16: { sat: false, unsat: false, na: false },
//   _17: { sat: false, unsat: false, na: false }
// })

// const inspector = ref({
//   _1: { name: '', signature: false },
//   _2: { name: '', signature: false },
//   _3: { name: '', signature: false },
//   _4: { name: '', signature: false }
// })
// const remark = ref('')

// const saveData = () => {
//   try {
//     if (user.value.role == 'admin') {
//       const id_mfa = route.params.id
//       if (company_name.value != '' && certificate_number.value != '') {
//         isLoading.value = true
//         MFA.saveItem(
//           id_mfa,
//           company_name.value,
//           certificate_number.value,
//           type_inspection.value,
//           checklist.value,
//           inspector.value,
//           remark.value,
//           dateTime.value
//         ).then(() => {
//           resetForm()
//           router.push('/maintenance-facility')
//           isLoading.value = false
//         })
//       }
//     } else {
//       alert('Please at least fill in the form company name, certificate number, and inspector name')
//     }
//   } catch (error) {
//     isLoading.value = false
//     alert('ERROR SAVE DATA' + error)
//   }
// }
// const signOn = (e) => {
//   signConfirmationModal.value = true
//   idSign.value = e
// }
// const resetForm = () => {
//   dateTime.value = ''
//   company_name.value = ''
//   certificate_number.value = ''
//   type_inspection.value = {
//     certification: false,
//     surveillance: false
//   }
//   checklist.value = {
//     _1: { sat: false, unsat: false, na: false },
//     _2: { sat: false, unsat: false, na: false },
//     _3: { sat: false, unsat: false, na: false },
//     _4: { sat: false, unsat: false, na: false },
//     _5: { sat: false, unsat: false, na: false },
//     _6: { sat: false, unsat: false, na: false },
//     _7: { sat: false, unsat: false, na: false },
//     _8: { sat: false, unsat: false, na: false },
//     _9: { sat: false, unsat: false, na: false },
//     _10: { sat: false, unsat: false, na: false },
//     _11: { sat: false, unsat: false, na: false },
//     _12: { sat: false, unsat: false, na: false },
//     _13: { sat: false, unsat: false, na: false },
//     _14: { sat: false, unsat: false, na: false },
//     _15: { sat: false, unsat: false, na: false },
//     _16: { sat: false, unsat: false, na: false },
//     _17: { sat: false, unsat: false, na: false }
//   }
//   inspector.value = {
//     _1: { name: '', signature: false },
//     _2: { name: '', signature: false },
//     _3: { name: '', signature: false },
//     _4: { name: '', signature: false }
//   }
//   remark.value = ''
// }

onMounted(async () => {
  // try {
  //   user.value = Auth.items
  //   if (!route.query.isAdd) {
  //     const data = await MFA.readDetail(route.params.id)
  //     dateTime.value = data[0].date_time
  //     company_name.value = data[0].company_name == '-' ? '' : data[0].company_name
  //     certificate_number.value = data[0].certificate_number == '-' ? '' : data[0].certificate_number
  //     type_inspection.value = data[0].type_inspection
  //     checklist.value = data[0].checklist
  //     inspector.value = data[0].inspector
  //     remark.value = data[0].remark
  //   }
  //   isLoading.value = false
  // } catch (error) {
  //   isLoading.value = false
  //   alert('ERROR MOUNTED DETAILBOX' + error)
  // }
})
</script>
<template>
  <tr>
    <td class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-20">
      {{ props.jurnal.NOPER }}
    </td>
    <td class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-max">
      {{ props.jurnal.KETERANGAN }}
    </td>
    <td class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-max">
      {{ props.jurnal.JUMLAH > 0 ? props.jurnal.JUMLAH : '' }}
    </td>
    <td class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-max">
      {{ props.jurnal.JUMLAH < 0 ? props.jurnal.JUMLAH : '' }}
    </td>
    <td class="min-w-max border-r border-b font-medium border-[#cbd5e9] p-1 w-44">
      <div class="flex justify-center">
        <a
          @click="editGet(props.jurnal.idtrans)"
          class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
          href="javascript:;"
        >
          <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
        </a>
        <a
          @click="deleteGet(props.jurnal)"
          class="flex items-center hover:text-red-800 text-danger"
          href="javascript:;"
        >
          <Trash2Icon class="w-3 h-3 mr-1" /> Hapus
        </a>
      </div>
    </td>
  </tr>

  <!-- <Modal :show="signConfirmationModal" @hidden="signConfirmationModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <FileEditIcon class="w-16 h-16 text-primary mx-auto mt-3" />
        <div class="text-lg mt-5">H Are you sure you want to sign this document?</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="signConfirmationModal = false"
          class="border-2 border-secondary p-2 rounded-md w-24 mr-5"
        >
          Cancel
        </button>
        <button
          type="button"
          class="border bg-primary text-white p-2 rounded-md border-primary w-24"
          @click=";(idSign.signature = true), (signConfirmationModal = false)"
        >
          Yes
        </button>
      </div>
    </ModalBody>
  </Modal> -->
</template>
<style scoped></style>
