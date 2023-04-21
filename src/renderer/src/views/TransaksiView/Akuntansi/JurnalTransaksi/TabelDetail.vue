<script setup>
import { onMounted, ref } from 'vue'
import { useMFAStore } from '@/stores/mfa'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const MFA = useMFAStore()
const Auth = useAuthStore()
const user = ref('')
const isLoading = ref(true)
const signConfirmationModal = ref(false)
const idSign = ref()

const dateTime = ref('')
const company_name = ref('')
const certificate_number = ref('')
const type_inspection = ref({
  certification: false,
  surveillance: false
})

const checklist = ref({
  _1: { sat: false, unsat: false, na: false },
  _2: { sat: false, unsat: false, na: false },
  _3: { sat: false, unsat: false, na: false },
  _4: { sat: false, unsat: false, na: false },
  _5: { sat: false, unsat: false, na: false },
  _6: { sat: false, unsat: false, na: false },
  _7: { sat: false, unsat: false, na: false },
  _8: { sat: false, unsat: false, na: false },
  _9: { sat: false, unsat: false, na: false },
  _10: { sat: false, unsat: false, na: false },
  _11: { sat: false, unsat: false, na: false },
  _12: { sat: false, unsat: false, na: false },
  _13: { sat: false, unsat: false, na: false },
  _14: { sat: false, unsat: false, na: false },
  _15: { sat: false, unsat: false, na: false },
  _16: { sat: false, unsat: false, na: false },
  _17: { sat: false, unsat: false, na: false }
})

const inspector = ref({
  _1: { name: '', signature: false },
  _2: { name: '', signature: false },
  _3: { name: '', signature: false },
  _4: { name: '', signature: false }
})
const remark = ref('')

const saveData = () => {
  try {
    if (user.value.role == 'admin') {
      const id_mfa = route.params.id
      if (company_name.value != '' && certificate_number.value != '') {
        isLoading.value = true
        MFA.saveItem(
          id_mfa,
          company_name.value,
          certificate_number.value,
          type_inspection.value,
          checklist.value,
          inspector.value,
          remark.value,
          dateTime.value
        ).then(() => {
          resetForm()
          router.push('/maintenance-facility')
          isLoading.value = false
        })
      }
    } else {
      alert('Please at least fill in the form company name, certificate number, and inspector name')
    }
  } catch (error) {
    isLoading.value = false
    alert('ERROR SAVE DATA' + error)
  }
}
const signOn = (e) => {
  signConfirmationModal.value = true
  idSign.value = e
}
const resetForm = () => {
  dateTime.value = ''
  company_name.value = ''
  certificate_number.value = ''
  type_inspection.value = {
    certification: false,
    surveillance: false
  }
  checklist.value = {
    _1: { sat: false, unsat: false, na: false },
    _2: { sat: false, unsat: false, na: false },
    _3: { sat: false, unsat: false, na: false },
    _4: { sat: false, unsat: false, na: false },
    _5: { sat: false, unsat: false, na: false },
    _6: { sat: false, unsat: false, na: false },
    _7: { sat: false, unsat: false, na: false },
    _8: { sat: false, unsat: false, na: false },
    _9: { sat: false, unsat: false, na: false },
    _10: { sat: false, unsat: false, na: false },
    _11: { sat: false, unsat: false, na: false },
    _12: { sat: false, unsat: false, na: false },
    _13: { sat: false, unsat: false, na: false },
    _14: { sat: false, unsat: false, na: false },
    _15: { sat: false, unsat: false, na: false },
    _16: { sat: false, unsat: false, na: false },
    _17: { sat: false, unsat: false, na: false }
  }
  inspector.value = {
    _1: { name: '', signature: false },
    _2: { name: '', signature: false },
    _3: { name: '', signature: false },
    _4: { name: '', signature: false }
  }
  remark.value = ''
}

onMounted(async () => {
  try {
    user.value = Auth.items
    if (!route.query.isAdd) {
      const data = await MFA.readDetail(route.params.id)

      dateTime.value = data[0].date_time
      company_name.value = data[0].company_name == '-' ? '' : data[0].company_name
      certificate_number.value = data[0].certificate_number == '-' ? '' : data[0].certificate_number
      type_inspection.value = data[0].type_inspection

      checklist.value = data[0].checklist

      inspector.value = data[0].inspector
      remark.value = data[0].remark
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('ERROR MOUNTED DETAILBOX' + error)
  }
})
</script>
<template>
  <div class="flex mb-10 p-5 lg:px-48 bg-white">
    <RouterLink
      to="/maintenance-facility"
      class="flex items-center cursor-pointer group float-left"
    >
      <ArrowLeftIcon
        class="transition duration-500 ease-in-out group-hover:scale-150 float-left hover:text-primary"
      />
    </RouterLink>
    <div class="w-full flex items-center justify-center text-center mx-4">
      <a href="" aria-describedby="refresh" class="text-base lg:text-xl font-black">
        {{ $route.params.id }}
      </a>
    </div>
    <RouterLink
      :to="`/print-maintenance-facility/${$route.params.id}`"
      v-if="Object.getOwnPropertyNames(route.query).length == 0"
      class="flex items-center cursor-pointer group float-right uppercase min-w-max rounded-lg bg-red-500 -my-2 p-1 px-2 hover:scale-125 transition duration-500 ease-in-out text-white"
    >
      <FileDownIcon
        class="transition ease-in-out group-hover:scale-125 float-left group-hover:text-primary lg:mr-2 mr-0"
      /><span class="lg:inline text-xs font-medium hidden"> download as pdf</span>
    </RouterLink>
    <div
      v-else
      v-if="user.role == 'admin'"
      @click="saveData"
      class="flex items-center cursor-pointer group float-right uppercase min-w-max rounded-lg bg-blue-500 -my-2 p-1 px-2 hover:scale-125 transition duration-500 ease-in-out text-white"
    >
      <SaveIcon
        class="transition ease-in-out group-hover:scale-125 float-left group-hover:text-primary lg:mr-2 mr-0"
      /><span class="lg:inline text-xs font-medium hidden mr-2"> Save</span>
    </div>
  </div>
  <div class="px-5 lg:px-48 rounded-lg text-sm lg:text-base pb-[20vh]">
    <TabGroup class="w-full">
      <TabList class="nav nav-link-tabs">
        <Tab class="w-full py-2" tag="button">General</Tab>
        <Tab class="w-full py-2" tag="button">Checklist</Tab>
        <Tab class="truncate w-full py-2" tag="button">Inspector(s) Signature</Tab>
      </TabList>
      <TabPanels class="">
        <TabPanel class="">
          <div class="flex">
            <button type="button" class="flex-1">
              <h4 class="text-xl text-left py-4">General Information</h4></button
            ><button type="button" class="ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                aria-hidden="true"
                class="w-5 h-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"></path>
              </svg>
            </button>
          </div>
          <hr />
          <div class="block">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="py-2">
                <label for="form-date" class="block text-sm font-medium text-gray-700"
                  >Date & Time</label
                ><input
                  type="datetime-local"
                  id="form-date"
                  class="t-form"
                  name="date"
                  required
                  :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                  v-model="dateTime"
                />
              </div>
              <div class="py-2">
                <label for="form-company-name" class="block text-sm font-medium text-gray-700"
                  >Company Name</label
                ><input
                  type="text"
                  id="form-company-name"
                  class="t-form"
                  name="place"
                  required
                  :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                  v-model="company_name"
                />
              </div>
              <div class="py-2">
                <label for="form-cert-number" class="block text-sm font-medium text-gray-700"
                  >Certificate Number</label
                ><input
                  type="text"
                  id="form-cert-number"
                  class="t-form"
                  name="place"
                  required
                  :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                  v-model="certificate_number"
                />
              </div>
            </div>
            <div class="py-2">
              <label for="form-type-of-operation-1" class="block text-sm font-medium text-gray-700"
                >Type of Inspection</label
              >
              <div class="mt-1 border border-gray-300 rounded-md bg-white">
                <label
                  for="type_of_operation_1"
                  class="w-full flex border-b border-gray-300 hover:bg-gray-50 p-3 cursor-pointer"
                  ><input
                    id="type_of_operation_1"
                    type="checkbox"
                    name="type_of_operation_1"
                    class="mr-3 h-6 w-6"
                    :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                    v-model="type_inspection.certification"
                  /><span class="text-sm font-medium text-gray-700 uppercase"
                    >Certification</span
                  ></label
                ><label
                  for="type_of_operation_2"
                  class="w-full flex border-b border-gray-300 hover:bg-gray-50 p-3 cursor-pointer"
                  ><input
                    id="type_of_operation_2"
                    type="checkbox"
                    name="type_of_operation_2"
                    class="mr-3 h-6 w-6"
                    :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                    v-model="type_inspection.surveillance"
                  /><span class="text-sm font-medium text-gray-700 uppercase"
                    >surveillance</span
                  ></label
                >
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel class="">
          <div class="w-full">
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">1) </span>Dose the operator have adequate personnel meets
                maintenance needs based on the complexity of operation?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._1.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._1.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._1.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">2) </span>Are the maintenance and inspection ppersonnels are
                competent, qualified and trained?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._2.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._2.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._2.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">3) </span>Does the operator have current lists of authorized
                personnel for RII and maintenance release
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._3.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._3.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._3.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">4) </span>Does the operator have procedures for shift
                turnover? are the procedures for shift turnover in place?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._4.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._4.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._4.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">5) </span>Does the organisation have suitable hangars,
                docks, workshops, clean rooms and other housing facilities to enable maintenance to
                be performed in clean conditions and protected from the elements? Are the lighting,
                ventilation and general housekeeping adequate?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._5.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._5.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._5.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">6) </span>Are these facilities capable of accommodating the
                largest aircraft listed in the operation specifications?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._6.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._6.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._6.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">7) </span>Is maintenance, other than unforeseen or routine
                line maintenance as defined in the CMM, performed in appropriate facilities?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._7.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._7.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._7.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">8) </span>Does the organisation have suitable tools, jigs,
                fixtures, inspection aids, measuring tools, devices and other equipment for the type
                of work undertaken?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._8.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._8.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._8.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">9) </span>Are the measuring tools and special equipment and
                tooling available, serviceable, controlled and calibrated? Are all required items
                serviceable and within calibration criteria
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._9.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._9.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._9.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">10) </span>Are the all required technical data/manual
                available and current? If data is on microfiche, CD, web base or other softcopy
                format, ensure that readers are available and serviceable.
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._10.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._10.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._10.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">11) </span>Are spare parts and material properly organised
                and tagged?
                <ol type="a">
                  <li>(a)Procedures for receiving inspections are in place.</li>
                  <li>
                    (b)Components and hardware are properly identified and protected and identified
                    as to serviceability
                  </li>
                </ol>
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._11.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._11.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._11.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">12) </span>Is access to bonded stores restricted and
                controlled as described in the CMM?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._12.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._12.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._12.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">13) </span>Are shelf-lifed items located in the stores area
                past their expiration date?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._13.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._13.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._13.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">14) </span>Does the operator follow the procedures in the
                CMM for the control of shelf-lifed items?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._14.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._14.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._14.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">15) </span>Are aeronautical products isolated from
                non-aeronautical products? Are there segregation of serviceable and unserviceable
                components and hardware established and maintained?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._15.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._15.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._15.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">16) </span>Are Hazardous materials suitably segregated and
                properly stored?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._16.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._16.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._16.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              class="col-span-12 lg:grid grid-cols-12 border border-black p-2 rounded-lg my-3 items-center hover:scale-105 transition duration-500 ease-in-out hover:border-2 bg-white hover:bg-slate-50"
            >
              <div class="col-span-8 mb-1 p-2">
                <span class="font-bold">17) </span>Are the operator established Safety procedures,
                and proper implemented?
              </div>
              <div class="col-span-12 lg:col-span-4 lg:-my-2 -mx-2 -mb-2">
                <table class="w-full">
                  <tr>
                    <th
                      class="text-center border-b border-x-0 lg:border-x border-r border-y lg:border-t-0 border-black"
                    >
                      SAT
                    </th>
                    <th class="text-center lg:border-t-0 border-y border-b border-black">UNSAT</th>
                    <th class="text-center border-b border-l lg:border-t-0 border-t border-black">
                      N/A
                    </th>
                  </tr>
                  <tr>
                    <td class="text-center w-14 h-14 border-x lg:border-l border-l-0 border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._17.sat"
                      />
                    </td>
                    <td class="text-center w-14 h-14">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._17.unsat"
                      />
                    </td>
                    <td class="text-center w-14 h-14 border-l border-black">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="mx-2 h-9 w-9"
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="checklist._17.na"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel class="">
          <div class="lg:grid grid-cols-12 gap-x-4">
            <div class="col-span-12 lg:col-span-6">
              <div class="py-2 mt-4">
                <div class="flex">
                  <span class="block text-sm font-medium text-gray-700">DGCA INSPECTOR</span>
                </div>
                <div
                  class="border border-gray-300 rounded-md mt-1 bg-white hover:scale-105 transition duration-500 ease-in-out hover:border-2"
                >
                  <div
                    class="grid grid-cols-12 space-x-2 border-b border-gray-300 items-center p-3 pb-8"
                  >
                    <label class="col-span-12 mb-2" for="form-text">Name & Signature 1</label>
                    <div class="col text-gray-700 justify-start flex items-center">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="h-8 w-8"
                        disabled
                        v-model="inspector._1.signature"
                      />
                    </div>
                    <div class="col-span-9 justify-center text-gray-700 text-sm flex items-center">
                      <input
                        type="text"
                        id="form-text"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-white"
                        name="text"
                        required=""
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="inspector._1.name"
                      />
                    </div>
                    <div
                      class="col-span-2 text-sm font-medium text-gray-700 justify-center flex items-center"
                    >
                      <button
                        @click="signOn(inspector._1)"
                        :disabled="inspector._1.name == ''"
                        type="button"
                        class="bg-primary text-white p-2 rounded-md disabled:bg-secondary"
                        :class="
                          Object.getOwnPropertyNames(route.query).length == 0 ? ' hidden' : ''
                        "
                      >
                        Sign
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="border border-gray-300 rounded-md mt-1 bg-white hover:scale-105 transition duration-500 ease-in-out hover:border-2"
                >
                  <div
                    class="grid grid-cols-12 space-x-2 border-b border-gray-300 items-center p-3 pb-8"
                  >
                    <label class="col-span-12 mb-2" for="form-text">Name & Signature 2</label>
                    <div class="col text-gray-700 justify-start flex items-center">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="h-8 w-8"
                        disabled
                        v-model="inspector._2.signature"
                      />
                    </div>
                    <div class="col-span-9 justify-center text-gray-700 text-sm flex items-center">
                      <input
                        type="text"
                        id="form-text"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-white"
                        name="text"
                        required=""
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="inspector._2.name"
                      />
                    </div>
                    <div
                      class="col-span-2 text-sm font-medium text-gray-700 justify-center flex items-center"
                    >
                      <button
                        @click="signOn(inspector._2)"
                        :disabled="inspector._2.name == ''"
                        type="button"
                        class="bg-primary text-white p-2 rounded-md disabled:bg-secondary"
                        :class="
                          Object.getOwnPropertyNames(route.query).length == 0 ? ' hidden' : ''
                        "
                      >
                        Sign
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="border border-gray-300 rounded-md mt-1 bg-white hover:scale-105 transition duration-500 ease-in-out hover:border-2"
                >
                  <div
                    class="grid grid-cols-12 space-x-2 border-b border-gray-300 items-center p-3 pb-8"
                  >
                    <label class="col-span-12 mb-2" for="form-text">Name & Signature 3</label>
                    <div class="col text-gray-700 justify-start flex items-center">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="h-8 w-8"
                        disabled
                        v-model="inspector._3.signature"
                      />
                    </div>
                    <div class="col-span-9 justify-center text-gray-700 text-sm flex items-center">
                      <input
                        type="text"
                        id="form-text"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-white"
                        name="text"
                        required=""
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="inspector._3.name"
                      />
                    </div>
                    <div
                      class="col-span-2 text-sm font-medium text-gray-700 justify-center flex items-center"
                    >
                      <button
                        @click="signOn(inspector._3)"
                        :disabled="inspector._3.name == ''"
                        type="button"
                        class="bg-primary disabled:bg-secondary text-white p-2 rounded-md"
                        :class="
                          Object.getOwnPropertyNames(route.query).length == 0 ? ' hidden' : ''
                        "
                      >
                        Sign
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="border border-gray-300 rounded-md mt-1 bg-white hover:scale-105 transition duration-500 ease-in-out hover:border-2"
                >
                  <div
                    class="grid grid-cols-12 space-x-2 border-b border-gray-300 items-center p-3 pb-8"
                  >
                    <label class="col-span-12 mb-2" for="form-text">Name & Signature 4</label>
                    <div class="col text-gray-700 justify-start flex items-center">
                      <input
                        id="type_of_operation_1"
                        type="checkbox"
                        name="type_of_operation_1"
                        class="h-8 w-8"
                        disabled
                        v-model="inspector._4.signature"
                      />
                    </div>
                    <div class="col-span-9 justify-center text-gray-700 text-sm flex items-center">
                      <input
                        type="text"
                        id="form-text"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-white"
                        name="text"
                        required=""
                        :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                        v-model="inspector._4.name"
                      />
                    </div>
                    <div
                      class="col-span-2 text-sm font-medium text-gray-700 justify-center flex items-center"
                    >
                      <button
                        @click="signOn(inspector._4)"
                        :disabled="inspector._4.name == ''"
                        type="button"
                        class="bg-primary text-white p-2 rounded-md disabled:bg-secondary"
                        :class="
                          Object.getOwnPropertyNames(route.query).length == 0 ? ' hidden' : ''
                        "
                      >
                        Sign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 lg:col-span-6 py-2 mt-4">
              <label for="form-crew-comment" class="block text-sm font-medium text-gray-700"
                >REMARK</label
              ><textarea
                id="form-crew-comments"
                class="t-form"
                name="crew_comment"
                :disabled="Object.getOwnPropertyNames(route.query).length == 0"
                rows="11"
                v-model="remark"
              ></textarea>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
  <div
    v-show="isLoading"
    wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
  >
    <Loader2Icon class="motion-safe:animate-spin stroke-[5px] text-white h-12 w-12 mb-4" />
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-full text-center text-white">
      This may take a few seconds, please don't close this page.
    </p>
  </div>
  <!-- BEGIN: Sign Confirmation Modal -->
  <Modal :show="signConfirmationModal" @hidden="signConfirmationModal = false">
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
  </Modal>
  <!-- END: Sign Confirmation Modal -->
</template>
<style scoped></style>
