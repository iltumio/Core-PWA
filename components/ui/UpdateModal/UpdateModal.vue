<template src="./UpdateModal.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ReleaseNotes } from '~/libraries/ui/ReleaseNotes'
import { RefreshCwIcon, XIcon } from 'satellite-lucide-icons'
import VueMarkdown from 'vue-markdown'

export default Vue.extend({
  components: {
    RefreshCwIcon,
    XIcon,
    VueMarkdown,
  },
  data() {
    return {
      hasMinorUpdate: false,
      requiresUpdate: false,
      releaseData: {},
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    this.getReleaseBody()
  },
  methods: {
    // clearAndReload() {
    // commented out until we can test this - we probably won't want to clean all of local storage'
    //   localStorage.removeItem('local-version')
    //   window.location.reload()
    // },
    skipVersion() {
      localStorage.setItem('local-version', this.$config.clientVersion)
      this.$data.requiresUpdate = false
      this.$data.hasMinorUpdate = false
      this.toggleVisibility()
    },
    async getReleaseBody() {
      await ReleaseNotes().then((releaseData) => {
        this.releaseData = releaseData
      })
    },
    toggleVisibility() {
      this.$store.commit('ui/toggleModal', {
        name: 'changelog',
        state: !this.ui.modals['changelog'],
      })
    },
  },
})
</script>

<style scoped lang="less" src="./UpdateModal.less"></style>
