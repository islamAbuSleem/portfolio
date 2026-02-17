<template>
  <div class="space-y-2">
    <p class="text-4xl md:text-5xl font-bold gradient-text">{{ displayValue }}{{ suffix }}</p>
    <p class="text-gray-600 dark:text-dark-400 text-sm">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  endValue: number
  suffix?: string
  label: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  suffix: '',
  duration: 2000,
})

const displayValue = ref(0)

const animateValue = () => {
  const startValue = 0
  const endValue = props.endValue
  const duration = props.duration
  const steps = 60
  const stepDuration = duration / steps
  let currentStep = 0

  const interval = setInterval(() => {
    currentStep++
    const progress = currentStep / steps
    displayValue.value = Math.floor(startValue + (endValue - startValue) * progress)

    if (currentStep >= steps) {
      clearInterval(interval)
      displayValue.value = endValue
    }
  }, stepDuration)
}

onMounted(() => {
  // Delay animation start for visual effect
  setTimeout(animateValue, 300)
})
</script>
