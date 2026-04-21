<template>
    <header class="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 md:px-8 shrink-0">
        <div class="flex-1 flex items-center">
            <h1 class="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">Thesis IA</h1>
        </div>

        <div class="flex items-center gap-4">
            <button @click="$emit('closeSettings')"
                class="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-semibold shadow-sm transition-all">
                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configuración IA
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">

defineProps<{
    isSettingsOpen: boolean;
}>();

defineEmits(['closeSettings'])

</script>
