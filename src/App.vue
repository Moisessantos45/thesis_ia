<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
    <Header :is-settings-open="isSettingsOpen" @close-settings="isSettingsOpen = true" />
    <main class="flex-1 overflow-y-auto p-6 md:p-8">
      <div class="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8">

        <div class="w-full xl:w-[70%] flex flex-col gap-8">
          <section class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 md:p-8">
            <label for="query" class="block text-xl font-bold text-slate-800 mb-1">Planteamiento del Problema</label>
            <p class="text-sm text-slate-500 mb-6">Ingresa tu pregunta académica. La IA generará comparativas
              simultáneas.</p>

            <div class="flex flex-col gap-4">
              <textarea id="query" v-model="question" rows="3"
                class="w-full p-4 rounded-md border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-y text-slate-700 bg-slate-50/50 text-base"
                placeholder="Ej: ¿Cuáles son las implicaciones éticas de la edición genética en embriones humanos?"
                @keydown.ctrl.enter="askQuestion"></textarea>
              <div class="flex items-center justify-between">
                <p class="text-xs text-slate-400 hidden sm:block">Presiona <kbd
                    class="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-[10px] shadow-sm">Ctrl</kbd>
                  + <kbd
                    class="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-[10px] shadow-sm">Enter</kbd>
                  para enviar</p>
                <button @click="askQuestion" :disabled="!question.trim() || models.length === 0"
                  class="ml-auto px-6 py-2.5 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 disabled:hover:bg-blue-800 text-white font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 text-sm">
                  Generar Análisis
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <section class="flex flex-col gap-4">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              Perspectivas Generadas
              <span
                class="rounded-full px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-100 text-xs font-semibold">{{
                  answers.length }} Activos</span>
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="answer in answers" :key="answer.id"
                class="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm flex flex-col gap-4 hover:border-blue-200 transition-colors">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="w-7 h-7 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-800">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-slate-800">{{ answer.model }}</h3>
                  </div>
                  <span class="rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider"
                    :class="answer.status === 'Completado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : (answer.status === 'Generando' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' : 'bg-slate-50 text-slate-600 border border-slate-200/50')">
                    {{ answer.status }}
                  </span>
                </div>
                <div class="flex-1 pt-1">
                  <p class="text-slate-600 text-sm leading-relaxed"
                    :class="{ 'animate-pulse text-slate-400': answer.status === 'Generando' }">
                    {{ answer.text }}
                  </p>
                </div>
                <div class="pt-4 border-t border-slate-50 flex justify-end">
                  <button
                    class="text-xs font-semibold text-slate-400 hover:text-blue-700 transition-colors flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-md">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar Cita
                  </button>
                </div>
              </div>
            </div>

            <div v-if="answers.length === 0"
              class="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center gap-3">
              <svg class="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p class="text-slate-500 font-medium">No hay modelos configurados.</p>
              <button @click="isSettingsOpen = true"
                class="text-blue-700 hover:text-blue-800 text-sm font-semibold mt-2">Configurar IA</button>
            </div>
          </section>
        </div>

        <aside class="w-full xl:w-[30%] flex flex-col gap-6">
          <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-1">Resumen de Modelos</h3>
            <p class="text-sm text-slate-500 mb-5">Modelos activos para esta consulta.</p>

            <ul class="flex flex-col gap-2">
              <li v-for="(model, idx) in models" :key="idx"
                class="flex items-center gap-3 p-2.5 rounded-md bg-slate-50 border border-slate-100">
                <div class="w-2 h-2 rounded-full bg-blue-600"></div>
                <span class="text-sm font-semibold text-slate-700">{{ model }}</span>
              </li>
            </ul>
            <p v-if="models.length < 4"
              class="text-xs text-amber-700 mt-5 bg-amber-50 p-3 rounded-md border border-amber-200/60 flex gap-2 items-start">
              <svg class="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Se recomiendan 4 modelos para una comparativa óptima. Tienes configurados {{ models.length
                }}.</span>
            </p>
          </div>

          <div class="bg-blue-50/70 rounded-xl border border-blue-100/70 p-6">
            <h3 class="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Consejo Metodológico
            </h3>
            <p class="text-xs text-blue-800/80 leading-relaxed font-medium">
              Utiliza preguntas abiertas para permitir que los modelos exploren diferentes ángulos del tema. La
              diversidad en las respuestas enriquecerá tu investigación académica.
            </p>
          </div>
        </aside>

      </div>
    </main>
  </div>

  <SettingsModal />

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Header from './components/Header.vue'
import SettingsModal from './components/SettingsModal.vue'
import useModelStore from './store/model'

const store = useModelStore()
const { question, isSettingsOpen, models, answers } = storeToRefs(store)

const askQuestion = async () => {
  if (!question.value.trim()) return

  if (models.value.length === 0) {
    alert("Por favor, agrega al menos un modelo en la Configuración IA.")
    return
  }

  await store.sendPrompModels()
}
</script>

<style>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
