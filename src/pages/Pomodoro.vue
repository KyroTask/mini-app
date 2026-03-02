<template>
  <div class="pomodoro-wrap flex flex-col relative w-full h-full" :class="hasActiveSession ? 'fixed inset-0 z-[100] bg-slate-900 overflow-hidden' : 'bg-slate-50 dark:bg-slate-900'">

    <!-- ═══ ACTIVE FOCUS MODE (Image 2) ═══ -->
    <template v-if="hasActiveSession">
      <!-- Beautiful Blurred Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6366f1] opacity-90"></div>
      <div class="absolute inset-0 backdrop-blur-3xl"></div>

      <div class="relative z-10 flex flex-col items-center justify-center w-full h-full p-8 transition-all duration-1000">
        
        <!-- Focus / Break text -->
        <div class="flex gap-4 mb-12 text-sm font-bold tracking-widest uppercase">
          <span :class="isWorkCycle ? 'text-white' : 'text-white/40'">Focus</span>
          <span :class="!isWorkCycle ? 'text-white' : 'text-white/40'">Break</span>
        </div>

        <!-- Huge Thin Timer -->
        <div class="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
          <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="96" fill="none" class="stroke-white/10" stroke-width="1.5"/>
            <circle cx="100" cy="100" r="96" fill="none" stroke="#ffffff" stroke-width="2"
              stroke-linecap="round" :stroke-dasharray="603" :stroke-dashoffset="totalSeconds > 0 ? 603 - (secondsLeft / totalSeconds) * 603 : 0"
              class="transition-all duration-1000 ease-linear"/>
          </svg>
          <div class="flex flex-col items-center mt-4">
            <div class="text-7xl sm:text-[8rem] font-medium text-white tracking-tighter leading-none mb-4">{{ formattedTime }}</div>
            <div class="text-xl sm:text-2xl font-medium text-white/90">
               {{ selectedProjectId ? projectStore.projects.find(p => p.id === selectedProjectId)?.name : 'Pomodoro apps' }}
            </div>
          </div>
        </div>

        <!-- Pause / Resume Button -->
        <div class="mt-16 sm:mt-24 flex flex-col items-center gap-6">
          <button @click="togglePause"
            class="px-10 py-3 rounded-[2rem] border-2 border-white text-white font-bold text-sm tracking-wide hover:bg-white/10 transition-colors uppercase">
            {{ isPaused ? 'Resume' : 'Pause' }}
          </button>
          
          <!-- Abandon / Finish early -->
          <button @click="handleAbandon" class="text-white/40 hover:text-white/80 text-xs font-semibold tracking-wide uppercase transition-colors">
            Stop Session
          </button>
        </div>
      </div>
    </template>

    <!-- ═══ IDLE MODE / LOADING / REST (Image 1) ═══ -->
    <template v-else>
      <div class="relative z-10 h-full flex flex-col flex-1 min-h-0 w-full max-w-5xl mx-auto py-6">

        <div v-if="pomodoroStore.loading" class="flex-1 flex items-center justify-center">
          <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>

        <template v-else-if="pomodoroStore.status">

          <template v-if="status.can_start_today">
            <!-- Phase Tracker Header (Image 1 Top) -->
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 shrink-0 mb-8 w-full">
              <div class="relative flex items-center justify-center gap-12 sm:gap-24 px-8">
                <!-- Bg line -->
                <div class="absolute left-16 right-16 top-[40%] -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full hidden sm:block pointer-events-none"></div>
                <!-- Filled line -->
                <div class="absolute left-16 top-[40%] -translate-y-1/2 h-0.5 rounded-full hidden sm:block transition-all duration-1000 bg-indigo-500"
                  :style="{ width: progressLineWidth }"></div>

                <div v-for="phase in phases" :key="phase.id" class="relative z-10 flex flex-col items-center gap-3">
                  <div class="w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-xl shadow-sm transition-all duration-500 bg-white dark:bg-slate-900"
                    :class="[
                      currentPhaseId === phase.id ? `${phase.glowClass} border-2 scale-110 shadow-md` :
                      isPastPhase(phase.id) ? 'border-2 border-slate-200 dark:border-slate-700 text-slate-400' :
                      'border border-slate-100 dark:border-slate-800 opacity-50 grayscale'
                    ]">
                    <!-- Emoji for phase -->
                    <span v-if="phase.id==='normal'">🌱</span>
                    <span v-else-if="phase.id==='focus'">🔥</span>
                    <span v-else-if="phase.id==='deepwork'">🧠</span>
                    <span v-else>⚡</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-[10px] font-bold uppercase tracking-widest mb-1"
                      :class="currentPhaseId === phase.id ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-600'">
                      {{ phase.name }}
                    </span>
                    <span v-if="currentPhaseId === phase.id" class="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded border border-indigo-100 dark:border-indigo-800">
                      LVL {{ currentLevel }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timer Card (Image 1 Center) -->
            <div class="flex-1 flex flex-col items-center justify-center min-h-0">
              <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-12 flex flex-col items-center relative w-full max-w-[500px]">

                <!-- "FOCUS MODE" Badge -->
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-widest mb-8 border border-indigo-100 dark:border-indigo-800/50">
                  <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Focus Mode
                </div>

                <!-- Gradient Circle Timer -->
                <div class="relative flex justify-center items-center mb-8">
                  <div class="absolute inset-0 rounded-full bg-indigo-400 blur-3xl opacity-10"></div>
                  
                  <svg class="w-72 h-72 transform -rotate-90 shadow-2xl rounded-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="88" fill="none" class="text-slate-50 dark:text-slate-800/50 stroke-current" stroke-width="12"/>
                    <circle cx="100" cy="100" r="88" fill="none" stroke="url(#timerGradIdle)" stroke-width="12"
                      stroke-linecap="round" :stroke-dasharray="553" :stroke-dashoffset="dashOffset"
                      class="transition-all duration-1000 ease-linear"/>
                    <defs>
                      <linearGradient id="timerGradIdle" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#8b5cf6"/> <!-- violet-500 -->
                        <stop offset="100%" stop-color="#3b82f6"/> <!-- blue-500 -->
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <div class="text-7xl font-black text-slate-800 dark:text-white tracking-tighter">{{ formattedTime }}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Remaining</div>
                  </div>
                </div>

                <!-- Info row -->
                <div class="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium mb-8">
                  <span>{{ status.required_work_duration }}m work</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span>{{ status.required_break_duration }}m break</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span>{{ status.target_cycles }} cycle{{ status.target_cycles > 1 ? 's' : '' }}</span>
                </div>

                <!-- Start Button & Project Selector -->
                <div class="w-full flex justify-center flex-col items-center gap-5">
                  <button @click="handleStart"
                    :disabled="status.requires_project && !selectedProjectId"
                    class="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.25rem] font-bold text-sm tracking-wide transition-all flex items-center gap-2 shadow-[0_8px_20px_-6px_rgba(99,102,241,0.6)] hover:shadow-[0_12px_24px_-8px_rgba(99,102,241,0.8)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Start Session
                  </button>

                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Project:</span>
                    <select v-model="selectedProjectId" class="bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg py-1 px-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-0">
                      <option :value="null">None (General)</option>
                      <option v-for="p in projectStore.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>
          </template>

          <div v-else class="flex-1 flex items-center justify-center">
            <div class="text-center max-w-md bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
              <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/30 mb-6 animate-bounce">🎉</div>
              <h2 class="text-3xl font-black text-slate-800 dark:text-white mb-2">Day Complete!</h2>
              <p class="text-slate-500 font-medium text-sm mb-8">Level {{ Math.max(1, currentLevel - 1) }} done. Come back tomorrow.</p>
              <div class="grid grid-cols-3 gap-4">
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div class="text-indigo-600 font-black text-xl mb-1">{{ status.required_work_duration }}m</div>
                  <div class="text-[9px] uppercase font-bold text-slate-400">Next Work</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div class="text-emerald-500 font-black text-xl mb-1">{{ status.required_break_duration }}m</div>
                  <div class="text-[9px] uppercase font-bold text-slate-400">Next Break</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div class="text-rose-500 font-black text-xl mb-1">{{ status.target_cycles }}×</div>
                  <div class="text-[9px] uppercase font-bold text-slate-400">Cycles</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { usePomodoroStore } from '../stores/pomodoro'
import { useProjectStore } from '../stores/projects'

const pomodoroStore = usePomodoroStore()
const projectStore = useProjectStore()
const showToast = inject('showToast')

// ─── Backend-driven data ───
const status = computed(() => pomodoroStore.status)
const currentLevel = computed(() => status.value?.current_level || 1)

// ─── Phase definitions ───
const phases = [
  { id: 'normal',   name: 'Normal',    emoji: '🌱', levels: 'Lv 1–9',   min: 1,  max: 9,  glowClass: 'border-indigo-500 text-indigo-500',  pulseRing: 'bg-indigo-500' },
  { id: 'focus',    name: 'Focus',     emoji: '🔥', levels: 'Lv 20–29', min: 20, max: 29, glowClass: 'border-rose-500 text-rose-500',    pulseRing: 'bg-rose-500' },
  { id: 'deepwork', name: 'Deep Work', emoji: '🧠', levels: 'Lv 30–39', min: 30, max: 39, glowClass: 'border-violet-500 text-violet-500',  pulseRing: 'bg-violet-500' },
  { id: 'hardwork', name: 'Hard Work', emoji: '⚡', levels: 'Lv 40–49', min: 40, max: 49, glowClass: 'border-amber-500 text-amber-500',   pulseRing: 'bg-amber-500' },
]

const currentPhaseId = computed(() => {
  const l = currentLevel.value
  if (l <= 9) return 'normal'
  if (l <= 29) return 'focus'
  if (l <= 39) return 'deepwork'
  return 'hardwork'
})

const currentPhase = computed(() => phases.find(p => p.id === currentPhaseId.value))
const phaseName = computed(() => currentPhase.value?.name || 'Normal')
const phaseMax = computed(() => currentPhase.value?.max || 9)
const isNormalPhase = computed(() => currentPhaseId.value === 'normal')

const phaseStyle = computed(() => ({
  normal:   { icon: '🌱', headerBg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', barActive: 'bg-indigo-500', progressLine: 'bg-indigo-500', badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  focus:    { icon: '🔥', headerBg: 'bg-rose-100 dark:bg-rose-900/30',     text: 'text-rose-600 dark:text-rose-400',     barActive: 'bg-rose-500',   progressLine: 'bg-rose-500',   badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
  deepwork: { icon: '🧠', headerBg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', barActive: 'bg-violet-500', progressLine: 'bg-violet-500', badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  hardwork: { icon: '⚡', headerBg: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-600 dark:text-amber-400',   barActive: 'bg-amber-500',  progressLine: 'bg-amber-500',  badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
}[currentPhaseId.value]))

const phaseRange = computed(() => {
  const p = currentPhase.value
  if (!p) return []
  return Array.from({ length: p.max - p.min + 1 }, (_, i) => i + p.min)
})

function isPastPhase(phaseId) {
  const order = ['normal', 'focus', 'deepwork', 'hardwork']
  return order.indexOf(phaseId) < order.indexOf(currentPhaseId.value)
}

const progressLineWidth = computed(() => {
  const order = ['normal', 'focus', 'deepwork', 'hardwork']
  const idx = order.indexOf(currentPhaseId.value)
  return `${(idx / (phases.length - 1)) * 100}%`
})

// ─── Timer State ───
const secondsLeft = ref(0)
const isWorkCycle = ref(true)
const isPaused = ref(false)
const timerRunning = ref(false)   // TRUE = session active & timer ticking
const completedCycles = ref(0)
const timerInterval = ref(null)
const selectedProjectId = ref(null)

// Whether to show Start vs Pause/Abandon
const hasActiveSession = computed(() => timerRunning.value || !!status.value?.active_session)

const formattedTime = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const totalSeconds = computed(() => {
  if (!status.value) return 1
  return (isWorkCycle.value ? status.value.required_work_duration : status.value.required_break_duration) * 60
})

const dashOffset = computed(() => 553 - (secondsLeft.value / totalSeconds.value) * 553)

// ─── Timer Engine ───
function startLocalTimer() {
  clearInterval(timerInterval.value)
  timerRunning.value = true
  timerInterval.value = setInterval(tick, 1000)
}

function stopLocalTimer() {
  clearInterval(timerInterval.value)
  timerRunning.value = false
  isPaused.value = false
}

function tick() {
  if (isPaused.value) return
  if (secondsLeft.value > 0) {
    secondsLeft.value--
  } else {
    handleTimerEnd()
  }
}

async function handleTimerEnd() {
  clearInterval(timerInterval.value)

  if (isWorkCycle.value) {
    // Work cycle finished → log to backend (sets is_on_break=true)
    try {
      await pomodoroStore.logCycle()
      completedCycles.value = pomodoroStore.status?.active_session?.completed_cycles || completedCycles.value + 1

      if (completedCycles.value >= status.value.target_cycles) {
        const completeRes = await pomodoroStore.completeLevel()
        showToast(completeRes?.message || 'Level complete! 🎉', 'success')
        stopLocalTimer()
        syncFromBackend()
        return
      }

      // Backend now has is_on_break=true and new seconds_remaining
      isWorkCycle.value = false
      secondsLeft.value = pomodoroStore.status?.seconds_remaining ?? (status.value.required_break_duration * 60)
      showToast('Work done! Take a break ☕', 'success')
      startLocalTimer()
    } catch (e) {
      showToast('Failed to sync cycle', 'error')
      stopLocalTimer()
    }
  } else {
    // Break finished → tell backend to start next work cycle
    try {
      await pomodoroStore.resumeWork()
      isWorkCycle.value = true
      secondsLeft.value = pomodoroStore.status?.seconds_remaining ?? (status.value.required_work_duration * 60)
      showToast('Break over — focus up! 🎯', 'info')
      startLocalTimer()
    } catch (e) {
      showToast('Failed to resume work', 'error')
      stopLocalTimer()
    }
  }
}

// ─── User Actions ───
async function handleStart() {
  try {
    await pomodoroStore.startSession(selectedProjectId.value)
    syncFromBackend()
    showToast('Session started! 🎯', 'success')
  } catch (err) {
    const msg = err?.response?.data?.error || ''
    if (msg.includes('already in progress')) {
      // Another tab/device already started — just sync to the existing session
      await pomodoroStore.fetchStatus()
      syncFromBackend()
      showToast('Resuming existing session', 'info')
    } else {
      showToast(msg || 'Failed to start session', 'error')
    }
  }
}

async function togglePause() {
  if (!timerRunning.value) return
  try {
    if (isPaused.value) {
      await pomodoroStore.resumeSession()
      isPaused.value = false
      secondsLeft.value = pomodoroStore.status?.seconds_remaining ?? secondsLeft.value
    } else {
      await pomodoroStore.pauseSession()
      isPaused.value = true
    }
  } catch (e) {
    showToast('Failed to toggle pause', 'error')
  }
}

async function handleAbandon() {
  if (!confirm('Abandon this session? You can retry today.')) return
  stopLocalTimer()
  try {
    await pomodoroStore.abandonSession()
    showToast('Session abandoned', 'info')
  } catch (e) {
    showToast('Failed to abandon', 'error')
  }
  syncFromBackend()
}

// ─── Sync from backend (page load, after actions) ───
function syncFromBackend() {
  const s = pomodoroStore.status
  if (!s) return

  const sess = s.active_session
  if (sess) {
    completedCycles.value = sess.completed_cycles || 0
    isWorkCycle.value = !s.is_on_break
    isPaused.value = !!s.is_paused
    secondsLeft.value = s.seconds_remaining ?? 0

    timerRunning.value = true
    clearInterval(timerInterval.value)
    timerInterval.value = setInterval(tick, 1000)
  } else {
    stopLocalTimer()
    completedCycles.value = 0
    isWorkCycle.value = true
    secondsLeft.value = s.required_work_duration * 60
  }
}

// ─── WebSocket for real-time sync across tabs/devices ───
const ws = ref(null)
const wsReconnectTimer = ref(null)

function connectWebSocket() {
  const token = localStorage.getItem('jwt')
  if (!token) return

  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const url = `${proto}//${location.host}/api/v1/ws/pomodoro?token=${encodeURIComponent(token)}`

  const socket = new WebSocket(url)

  socket.onopen = () => {
    console.log('[WS] Connected to pomodoro sync')
  }

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'pomodoro_status') {
        // Update the store with the incoming real-time data
        pomodoroStore.status = {
          ...pomodoroStore.status,
          current_level: data.current_level,
          required_work_duration: data.required_work_duration,
          required_break_duration: data.required_break_duration,
          target_cycles: data.target_cycles,
          requires_project: data.requires_project,
          active_session: data.active_session,
          seconds_remaining: data.seconds_remaining,
          is_on_break: data.is_on_break,
          is_paused: data.is_paused,
        }
        syncFromBackend()
      }
    } catch (e) {
      console.error('[WS] Parse error:', e)
    }
  }

  socket.onclose = () => {
    console.log('[WS] Disconnected, reconnecting in 3s...')
    ws.value = null
    wsReconnectTimer.value = setTimeout(connectWebSocket, 3000)
  }

  socket.onerror = (err) => {
    console.error('[WS] Error:', err)
    socket.close()
  }

  ws.value = socket
}

// ─── Lifecycle ───
onMounted(async () => {
  await pomodoroStore.fetchStatus()
  await projectStore.fetchProjects()
  syncFromBackend()
  connectWebSocket()
})

onUnmounted(() => {
  clearInterval(timerInterval.value)
  clearTimeout(wsReconnectTimer.value)
  if (ws.value) ws.value.close()
})
</script>

<style scoped>
/* Fill the entire available viewport area from MainLayout */
.pomodoro-wrap {
  flex: 1;
  position: relative;
  height: 100%;
  min-height: calc(100vh - 4rem);
  overflow: hidden;
}

/* Timer ring - responsive to fill available space */
.timer-svg {
  width: min(52vh, 16rem);
  height: min(52vh, 16rem);
}
.timer-time {
  font-size: clamp(2.5rem, 8vh, 4.5rem);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -0.03em;
}

/* Large timer for Normal phase */
.timer-svg-large {
  width: min(50vh, 18rem);
  height: min(50vh, 18rem);
}
.timer-time-large {
  font-size: clamp(2.5rem, 8vh, 4.5rem);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -0.04em;
}

/* Entrance animation */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>