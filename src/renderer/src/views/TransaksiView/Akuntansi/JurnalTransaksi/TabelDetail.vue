<script setup>
import { onMounted, ref } from 'vue'
import { useJurnalTransaksiStore } from '@renderer/stores/jurnalTransaksi.js'

const jurnalTransaksi = useJurnalTransaksiStore()
const props = defineProps({
  jurnal: { type: Object, required: true }
})

const modal_delete = ref(false)
const emit = defineEmits(['updateData'])
const updateItem = (e) => {
  emit('updateData', e)
}
</script>
<template>
  <tr>
    <td class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-20">
      {{ props.jurnal.BUKTI }}
    </td>
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
      {{ props.jurnal.JUMLAH < 0 ? Math.abs(props.jurnal.JUMLAH) : '' }}
    </td>
    <td class="min-w-max border-r border-b font-medium border-[#cbd5e9] p-1 w-44">
      <div class="flex justify-center">
        <a
          @click="updateItem(props.jurnal)"
          class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
          href="javascript:;"
        >
          <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
        </a>
        <a
          @click="modal_delete = true"
          class="flex items-center hover:text-red-800 text-danger"
          href="javascript:;"
        >
          <Trash2Icon class="w-3 h-3 mr-1" /> Hapus
        </a>
      </div>
    </td>
  </tr>

  <Modal :show="modal_delete" @hidden="modal_delete = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-lg mt-5">
          Apakah Anda yakin akan menghapus data {{ props.jurnal.KETERANGAN }},
          {{ props.jurnal.JUMLAH > 0 ? 'DEBET' : 'KREDIT' }} {{ Math.abs(props.jurnal.JUMLAH) }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="modal_delete = false"
          class="border-2 border-secondary p-2 rounded-md w-24 mr-5"
        >
          Cancel
        </button>
        <button
          type="button"
          class="border bg-danger text-white p-2 rounded-md border-danger w-24"
          @click=";(modal_delete = false), jurnalTransaksi.removeItem(props.jurnal.idtrans)"
        >
          Yes
        </button>
      </div>
    </ModalBody>
  </Modal>
</template>
<style scoped></style>
