<script setup lang="ts">
import { ref } from 'vue'
import useModelStore from '../store/model'

const store = useModelStore()
const newModelName = ref('')

const addModel = () => {
  if (newModelName.value.trim()) {
    store.models.push(newModelName.value.trim())
    newModelName.value = ''
    store.updateAnswersState()
  }
}

const removeModel = (index: number) => {
  store.models.splice(index, 1)
  store.updateAnswersState()
}

const closeModal = () => {
  store.isSettingsOpen = false
}
</script>

<template>
  <div v-if="store.isSettingsOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" @click="closeModal"></div>

    <div
      class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 class="text-lg font-bold text-slate-800">Configuración del Entorno IA</h2>
        <button @click="closeModal"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
        <section>
          <label class="block text-sm font-bold text-slate-800 mb-1">Clave de API Global</label>
          <p class="text-xs text-slate-500 mb-3">Tu clave se usa para autorizar las consultas a los modelos.</p>
          <input v-model="store.apiKey" type="password" placeholder="sk-..."
            class="w-full px-3 py-2.5 text-sm rounded-md border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-700 bg-white font-mono shadow-sm" />
        </section>

        <section>
          <label class="block text-sm font-bold text-slate-800 mb-1">Instrucciones del Sistema (Prompt)</label>
          <p class="text-xs text-slate-500 mb-3">Define el comportamiento general para todas las IA (ej. "Eres un asistente que responde en español...").</p>
          <textarea v-model="store.systemPrompt" rows="3" placeholder="Instrucciones para la IA..."
            class="w-full px-3 py-2.5 text-sm rounded-md border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-700 bg-white shadow-sm resize-y"></textarea>
        </section>

        <section>
          <label class="block text-sm font-bold text-slate-800 mb-1">Modelos Activos</label>
          <p class="text-xs text-slate-500 mb-4">Agrega los modelos que participarán en la comparativa de análisis.</p>

          <ul class="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto pr-2">
            <li v-for="(model, index) in store.models" :key="index"
              class="flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md shadow-sm">
              <span class="text-sm font-semibold text-slate-700">{{ model }}</span>
              <button @click="removeModel(index)"
                class="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
            <li v-if="store.models.length === 0"
              class="text-sm text-slate-500 py-3 text-center border border-dashed border-slate-300 rounded-md bg-slate-50">
              No hay modelos configurados.
            </li>
          </ul>

          <div class="flex gap-2">
            <input v-model="newModelName" @keydown.enter="addModel" type="text"
              placeholder="Nombre del modelo (Ej: openai/gpt-4-turbo)"
              class="flex-1 px-3 py-2.5 text-sm rounded-md border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-700 bg-white shadow-sm" />
            <button @click="addModel" :disabled="!newModelName.trim()"
              class="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md shadow-sm transition-colors">
              Añadir
            </button>
          </div>
        </section>
      </div>

      <div class="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
        <button @click="closeModal"
          class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors">
          Cancelar
        </button>
        <button @click="closeModal"
          class="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold rounded-md shadow-sm transition-colors">
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>
