<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User } from '~/types/ui/user'
import { ArrowRightIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    ArrowRightIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => {},
    },
  },
  data() {
    return {
      text: '',
    }
  },
  computed: {
    ...mapState(['ui', 'accounts']),
  },
  mounted() {
    this.handleOverflow()
  },
  methods: {
    /**
     * @method close
     * @description Closes quickProfile by committing quickProfile false to state
     */
    close() {
      this.$store.commit('ui/quickProfile', false)
    },
    /**
     * @method close
     * @description Ensures quickProfile is positioned correctly by calculating if the div overflows the page and respositioning as needed.
     * Corrects position by commiting an adjusted position to setQuickProfilePosition in state
     */
    handleOverflow() {
      if (this.$device.isDesktop) {
        const quickProfile = this.$refs.quickProfile as HTMLElement
        if (quickProfile) {
          const position = this.ui.quickProfilePosition
          let clickX = position.x
          let clickY = position.y
          const widthOverflow =
            clickX + quickProfile.clientWidth - window.innerWidth
          const heightOverflow =
            clickY + quickProfile.clientHeight - window.innerHeight
          if (widthOverflow > -8) {
            clickX -= quickProfile.clientWidth
            this.$store.commit('ui/setQuickProfilePosition', {
              x: clickX,
              y: clickY,
            })
          }
          if (heightOverflow > -8) {
            clickY -= heightOverflow + 12
            this.$store.commit('ui/setQuickProfilePosition', {
              x: clickX,
              y: clickY,
            })
          }
        }
      }
    },
    sendMessage() {
      this.$store.dispatch('textile/sendTextMessage', {
        to: this.user?.textilePubkey,
        text: this.text,
      })
      this.close()
    },
    isMe() {
      return (
        this.accounts.details &&
        this.accounts.details.textilePubkey === this.user?.textilePubkey
      )
    },
  },
})
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
