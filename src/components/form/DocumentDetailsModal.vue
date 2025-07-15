<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-[#19141461] bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                getStatusColor(document?.status)
              ]"
            ></div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ document?.ref_no }}</h1>
              <p class="text-gray-600 text-sm">{{ document?.title || 'Untitled Document' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                getStatusBadgeClass(document?.status)
              ]"
            >
              {{ document?.status }}
            </span>
            <button
              @click="closeModal"
              class="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[60vh]">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-4">
            <!-- Creation Info -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 class="text-lg font-semibold text-blue-900 mb-3">Creation Details</h3>

              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-blue-700 block">Created By</label>
                  <p class="text-blue-900">{{ document?.created_by || 'Unknown' }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-blue-700 block">Created Date</label>
                  <p class="text-blue-900">{{ formatDate(document?.created_date) }}</p>
                </div>
              </div>
            </div>

            <!-- File Attachment -->
            <div v-if="document?.file_path && canEdit " class="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 class="text-lg font-semibold text-green-900 mb-3">Attachment</h3>

              <div class="flex items-center justify-between">
                <p class="text-green-800">Document file available</p>
                <button
                  @click="downloadAttachment"
                  class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <!-- Filing Info -->
            <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h3 class="text-lg font-semibold text-orange-900 mb-3">Filing Details</h3>

              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-orange-700 block">Filed By</label>
                  <p class="text-orange-900">{{ document?.filed_by || 'Not filed yet' }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-orange-700 block">Filed Date</label>
                  <p class="text-orange-900">
                    {{ document?.filed_date ? formatDate(document.filed_date) : 'Not filed yet' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Document Details
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            v-if="canEdit"
            @click="openEditModal"
            class="px-4 py-2 bg-slate-500 hover:bg-slate-700 text-white rounded transition-colors"
          >
            Edit Document
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiDocument } from '@/types/documentTypes'

interface Props {
  isOpen: boolean
  document: ApiDocument | null
  canEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'edit', document: ApiDocument): void
  (e: 'download', document: ApiDocument): void
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false
})

const emit = defineEmits<Emits>()

const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'filed':
      return 'bg-green-500'
    case 'suspended':
      return 'bg-orange-500'
    default:
      return 'bg-red-500'
  }
}

const getStatusBadgeClass = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'filed':
      return 'bg-green-100 text-green-800'
    case 'suspended':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-red-100 text-red-800'
  }
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Not specified'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const closeModal = () => {
  emit('close')
}

const openEditModal = () => {
  if (props.document) {
    emit('edit', props.document)
  }
}

const downloadAttachment = () => {
  if (props.document) {
    emit('download', props.document)
  }
}
</script>
