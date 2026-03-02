<template>
  <div class="space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen pb-20 md:pb-6 animate-fade-in font-sans">
    
    <!-- Top Header -->
    <header class="text-center py-6 mb-2">
      <h1 class="text-2xl font-semibold text-slate-800 dark:text-white">Report</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Support statistics on project time, focus time and tasks</p>
    </header>

    <div v-if="analyticsStore.loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Main Dashboard Container -->
    <div v-else-if="analyticsStore.analytics" class="max-w-7xl mx-auto space-y-6">
      
      <!-- Top Metrics 6-Grid -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <!-- Focus Time Total -->
        <div class="p-3 border-r border-slate-100 dark:border-slate-700 last:border-r-0">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-1 h-3 rounded bg-rose-500"></div>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Focus Time</p>
          </div>
          <p class="text-3xl font-bold text-rose-500 flex items-baseline gap-1">
            {{ Math.floor(analyticsStore.analytics.pomodoros.total_focus_minutes / 60) }}<span class="text-sm font-medium">h</span>
            {{ analyticsStore.analytics.pomodoros.total_focus_minutes % 60 }}<span class="text-sm font-medium">m</span>
          </p>
        </div>
        <!-- Focus Time Week -->
        <div class="p-3 border-r border-slate-100 dark:border-slate-700 last:border-r-0 hidden md:block">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-1 h-3 rounded bg-rose-500"></div>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Focus Time / Week</p>
          </div>
          <p class="text-3xl font-bold text-rose-400 flex items-baseline gap-1">
            {{ Math.floor(analyticsStore.analytics.pomodoros.focus_minutes_this_week / 60) }}<span class="text-sm font-medium">h</span>
            {{ analyticsStore.analytics.pomodoros.focus_minutes_this_week % 60 }}<span class="text-sm font-medium">m</span>
          </p>
        </div>
        <!-- Focus Time Today -->
        <div class="p-3 border-r border-slate-100 dark:border-slate-700 last:border-r-0">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-1 h-3 rounded bg-rose-500"></div>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Focus Time Today</p>
          </div>
          <p class="text-3xl font-bold text-rose-500 flex items-baseline gap-1">
            {{ Math.floor(analyticsStore.analytics.pomodoros.focus_minutes_today / 60) }}<span class="text-sm font-medium">h</span>
            {{ analyticsStore.analytics.pomodoros.focus_minutes_today % 60 }}<span class="text-sm font-medium">m</span>
          </p>
        </div>

        <!-- Tasks Total -->
        <div class="p-3 border-r border-slate-100 dark:border-slate-700 last:border-r-0">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-1 h-3 rounded bg-blue-500"></div>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Tasks</p>
          </div>
          <p class="text-3xl font-bold text-blue-500">{{ analyticsStore.analytics.tasks.total_completed }}</p>
        </div>
        <!-- Tasks Week -->
        <div class="p-3 border-r border-slate-100 dark:border-slate-700 last:border-r-0 hidden md:block">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-1 h-3 rounded bg-blue-500"></div>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tasks / Week</p>
          </div>
          <p class="text-3xl font-bold text-blue-400">{{ analyticsStore.analytics.tasks.completed_this_week }}</p>
        </div>
        <!-- Tasks Today -->
        <div class="p-3">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-1 h-3 rounded bg-blue-500"></div>
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tasks Today</p>
          </div>
          <p class="text-3xl font-bold text-blue-500">{{ analyticsStore.analytics.tasks.completed_today }}</p>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Pomodoro Records Heatmap (Left, 2 columns) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col h-full">
          <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-6">Pomodoro Records</h3>
          <div class="flex-1 w-full overflow-x-auto min-h-[300px]">
            <!-- Responsive container for custom scatter plot via HTML Grid -->
            <div class="relative w-full h-full min-w-[600px] flex flex-col">
              <!-- Y Axis labels (Dates) -->
              <div class="absolute left-0 top-8 bottom-0 w-16 flex flex-col justify-between text-[10px] text-slate-400">
                <span v-for="d in heatmapDates" :key="d">{{ d }}</span>
              </div>
              
              <!-- Plot Area -->
              <div class="ml-16 flex-1 flex flex-col relative">
                <!-- X Axis Labels (Hours) -->
                <div class="flex justify-between text-[10px] text-slate-400 mb-4 px-2">
                  <span v-for="h in [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]" :key="h">{{ h }}:00</span>
                </div>
                
                <!-- Grid Lines -->
                <div class="absolute inset-0 top-8 flex justify-between pointer-events-none px-2 z-0">
                  <div v-for="i in 12" :key="i" class="w-px h-full bg-slate-50 dark:bg-slate-700/50"></div>
                </div>

                <!-- Data Points Container -->
                <div class="relative flex-1 bg-transparent z-10 mx-2 mt-8">
                  <div 
                    v-for="record in mappedRecords" 
                    :key="record.id"
                    class="absolute h-3 rounded-sm hover:scale-110 transition-transform cursor-pointer opacity-90 hover:opacity-100"
                    :style="{
                      top: `${record.yPercentage}%`,
                      left: `${record.xPercentage}%`,
                      width: `${Math.max(1, record.widthPercentage)}%`,
                      backgroundColor: record.project_color || '#F18C52'
                    }"
                    :title="`${record.project_name || 'No Project'}: ${record.duration}m`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column Widgets -->
        <div class="space-y-6 flex flex-col h-full">
          <!-- Focus Time Breakdown (Horizontal Bar) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex-1">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white">Focus Time</h3>
              <button class="text-[10px] text-slate-400 hover:text-indigo-500">Show Projects</button>
            </div>
            <p class="text-xs text-slate-400 mb-6">Total focus time: {{ Math.floor(analyticsStore.analytics.pomodoros.total_focus_minutes / 60) }}h {{ analyticsStore.analytics.pomodoros.total_focus_minutes % 60 }}m</p>
            
            <div class="space-y-4">
              <div v-for="proj in analyticsStore.analytics.project_stats.slice(0,4)" :key="proj.id">
                <div class="flex justify-between text-xs mb-1">
                  <span class="font-medium text-slate-700 dark:text-slate-200">{{ proj.name || 'Uncategorized' }}</span>
                  <span class="text-slate-400">{{ Math.floor(proj.total_focus_minutes / 60) }}h {{ proj.total_focus_minutes % 60 }}m</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: `${Math.min(100, (proj.total_focus_minutes / maxProjectMinutes) * 100)}%`, backgroundColor: proj.color || '#6366f1' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Habit Distribution (Doughnut) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white">Habit Distribution</h3>
            <div class="flex gap-2">
              <button @click="habitFilter = 'daily'" :class="['text-xs font-semibold px-2 py-1 rounded transition-colors', habitFilter === 'daily' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'text-slate-400 hover:text-slate-600']">Daily</button>
              <button @click="habitFilter = 'weekly'" :class="['text-xs font-semibold px-2 py-1 rounded transition-colors', habitFilter === 'weekly' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'text-slate-400 hover:text-slate-600']">Weekly</button>
              <button @click="habitFilter = 'monthly'" :class="['text-xs font-semibold px-2 py-1 rounded transition-colors', habitFilter === 'monthly' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'text-slate-400 hover:text-slate-600']">Monthly</button>
            </div>
          </div>
          
          <div class="flex flex-col md:flex-row items-center justify-center gap-12 mt-8">
            <div class="w-48 h-48 relative">
              <Doughnut v-if="habitDoughnutData" :data="habitDoughnutData" :options="doughnutOptions" />
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-2xl font-bold text-slate-800 dark:text-white">{{ analyticsStore.analytics.habit_distribution?.length || 0 }}</span>
                <span class="text-[10px] uppercase text-slate-400 font-bold">Habits</span>
              </div>
            </div>
            
            <div class="flex-1 w-full grid grid-cols-2 gap-y-4 gap-x-8">
              <div v-for="habit in (analyticsStore.analytics.habit_distribution || [])" :key="habit.id" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: habit.phase === 'identity' ? '#6366f1' : habit.phase === 'process' ? '#06b6d4' : habit.phase === 'outcome' ? '#f59e0b' : '#cbd5e1' }"></div>
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ habit.icon }} {{ habit.name || 'Unknown' }}</span>
                </div>
                <span class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ habit.total_logs }} logs</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Focus Time Goal / Stats Wrap-up -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white">Focus Statistics</h3>
          </div>
          <p class="text-xs text-slate-400 mb-6 leading-relaxed">
            Completed Goals: {{ analyticsStore.analytics.goals.completed_goals }}<br>
            Active Habits: {{ analyticsStore.analytics.habits.active_habits }}<br>
            Total Pomodoro Sessions: {{ analyticsStore.analytics.pomodoros.total_sessions_completed }}
          </p>

          <!-- Mini Calendar Placeholder mimicking the design -->
          <div class="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
            <div class="flex justify-between items-center mb-4">
              <button class="text-slate-300">&lt;</button>
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-200">Current Month</h4>
              <button class="text-slate-300">&gt;</button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 font-medium mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center text-xs text-slate-700 dark:text-slate-300 font-medium">
              <span 
                v-for="(day, index) in calendarDays" 
                :key="index"
                :class="[
                  'p-1 flex items-center justify-center h-6 w-6 mx-auto rounded-full',
                  {
                    'opacity-30': !day.isCurrentMonth,
                    'text-white bg-rose-500 shadow-sm': day.isActive && day.isToday,
                    'text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 font-bold': !day.isActive && day.isToday,
                    'border border-rose-400 text-rose-500': day.isActive && !day.isToday
                  }
                ]"
              >
                {{ day.date }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useAnalyticsStore } from '../stores/analytics'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const analyticsStore = useAnalyticsStore()

const maxProjectMinutes = computed(() => {
  if (!analyticsStore.analytics || !analyticsStore.analytics.project_stats) return 1;
  const max = Math.max(...analyticsStore.analytics.project_stats.map(p => p.total_focus_minutes));
  return max > 0 ? max : 1;
})

const habitFilter = ref('daily')

const habitDoughnutData = computed(() => {
  if (!analyticsStore.analytics || !analyticsStore.analytics.habit_distribution || analyticsStore.analytics.habit_distribution.length === 0) return null;
  
  const colors = {
    'identity': '#6366f1', // indigo
    'process': '#06b6d4',  // cyan
    'outcome': '#f59e0b'   // amber
  };

  // Filter simulation logic (since actual historical logs aren't fully returned, we scale visual ratios based on selected view for demonstrative functionality)
  const multiplier = habitFilter.value === 'monthly' ? 4 : (habitFilter.value === 'weekly' ? 1.5 : 1)

  return {
    labels: analyticsStore.analytics.habit_distribution.map(h => h.name || 'Unknown'),
    datasets: [
      {
        backgroundColor: analyticsStore.analytics.habit_distribution.map(h => colors[h.phase] || '#cbd5e1'),
        borderWidth: 0,
        data: analyticsStore.analytics.habit_distribution.map(h => Math.round(h.total_logs * multiplier))
      }
    ]
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '80%',
  plugins: {
    legend: { display: false }
  }
}

// Generate the heatmap records by calculating X/Y percentages
// X = hour of day (0-24)
// Y = day index spanning last 10 days
const heatmapDates = ref([])
const mappedRecords = computed(() => {
  if (!analyticsStore.analytics || !analyticsStore.analytics.recent_records) return []
  
  // Create last 10 days labels
  const days = []
  for (let i = 0; i < 10; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (9 - i))
    days.push(d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }))
  }
  heatmapDates.value = days

  const records = []
  const now = new Date()
  const tenDaysAgo = new Date(now)
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

  analyticsStore.analytics.recent_records.forEach(rec => {
    const started = new Date(rec.started_at)
    if (started < tenDaysAgo) return
    
    // Day index (0 to 9) mapped to Y %
    // Find index by comparing date strings to avoid timezone shifts
    const ds = started.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    const dayIndex = days.indexOf(ds)
    if (dayIndex === -1) return
    
    // Y percentage: 0% is top (day 0), 100% is bottom (day 9)
    const yPercentage = (dayIndex / 9) * 100

    // X percentage: hour (0-24) mapped to 0-100%
    const hourFloat = started.getHours() + (started.getMinutes() / 60)
    const xPercentage = (hourFloat / 24) * 100

    // Width: duration mapped to 24h
    const widthPercentage = (rec.duration / (24 * 60)) * 100

    records.push({
      ...rec,
      xPercentage,
      yPercentage,
      widthPercentage
    })
  })

  return records
})

// Dynamic Calendar Generation
const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  // Get the first day of the month
  const firstDay = new Date(year, month, 1)
  const startingDayOfWeek = firstDay.getDay()

  // Get days in previous month to fill out the first week
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      isActive: false
    })
  }

  // Get active days set
  const activeSet = new Set(analyticsStore.analytics?.pomodoros?.active_days || [])

  // Get days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate()
    // Format YYYY-MM-DD for matching
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday,
      isActive: activeSet.has(dateStr)
    })
  }

  return days
})

onMounted(() => {
  analyticsStore.fetchAnalytics()
})
</script>
