<template src="./Heading.html" />

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'

import { mapState } from 'vuex'
dayjs.extend(duration)
export default Vue.extend({
  components: {
    MaximizeIcon,
    MinimizeIcon,
  },
  data() {
    return {
      elapsedTimeLabel: ''
    }
  },
  computed: {
    ...mapState(['ui', 'webrtc']),
  },
  mounted() {
    this.$store.commit('ui/fullscreen', false)
    this.timer = false
    this.setTimer()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    /**
     * @method toggleFullscreen
     * @description Toggles fullscreen by committing the opposite of it's current value (this.ui.fullscreen) to fullscreen in state
     * @example @click="toggleFullscreen"
     */
    toggleFullscreen() {
      this.$store.commit('ui/fullscreen', !this.ui.fullscreen)
    },
    elapsedTime(start: number): void {
      const duration = dayjs.duration(Date.now() - start)
      const hours = duration.hours()
      this.elapsedTimeLabel = `${this.$t('ui.live')} ${
        hours > 0 ? `${hours}:` : ''
      }${duration.format('mm:ss')}`
    },
    setTimer() {
      if (this.webrtc && this.webrtc.activeStream) {
        if (!this.timerId) {
          this.elapsedTime(this.webrtc.activeStream.createdAt)
          this.timerId = setInterval(() => {
            this.elapsedTime(this.webrtc.activeStream.createdAt)
          }, 1000)
        }
      }
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timerId)
        this.timer = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
