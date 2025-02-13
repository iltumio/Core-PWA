<template src="./Enhancers.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { SmileIcon, GridIcon, ImageIcon } from 'satellite-lucide-icons'
import { EmojiPicker } from 'vue-emoji-picker'

declare module 'vue/types/vue' {
  interface Vue {
    convertRem: (value: string) => number
    toggleEnhancers: () => void
    openEmoji: () => void
    clickEvent: () => void
  }
}

export default Vue.extend({
  components: {
    SmileIcon,
    GridIcon,
    ImageIcon,
    EmojiPicker,
  },
  data() {
    return {
      search: '',
      clickEvent: () => {},
    }
  },
  computed: {
    ...mapState(['ui']),
    ...mapGetters('ui', ['getSortedMostUsedEmojis']),
    mostUsedEmojis() {
      return this.getSortedMostUsedEmojis.slice(0, 10)
    },
    route: {
      get() {
        return this.ui.enhancers.route
      },
      set(data: string) {
        this.$store.commit('ui/toggleEnhancers', {
          show: true,
          route: data,
        })
      },
    },
  },
  watch: {
    route() {
      this.openEmoji()
    },
    'ui.enhancers.show'(value) {
      if (value) this.openEmoji()
    },
  },
  mounted() {
    this.openEmoji()
  },
  methods: {
    /**
     * @method openEmoji DocsTODO
     * @description
     * @param
     * @example
     */
    openEmoji() {
      if (this.route !== 'emotes') return
      this.$nextTick(() => {
        setTimeout(() => {
          // @ts-ignore
          this.$refs.emojiInvoker?.click()
        }, 0)
      })
    },
    /**
     * Adds emoji to current text input
     * (emoji: any) Comes from <picker/> select event
     */
    /**
     * @method addEmoji
     * @description Adds emoji to either the users current chatbar or a messages emoji reactions depending on state of this.ui.settingReaction.status
     * TODO: Change reactor in dispatch addReaction to current users name instead of 'Jpanay'
     * @param emoji Emoji-mart emoji event object
     * @example v-on:select="addEmoji"
     */
    addEmoji(emoji: any, emojiName: string) {
      if (this.ui.settingReaction.status) {
        this.$store.dispatch('textile/sendReactionMessage', {
          to: this.ui.settingReaction.to,
          emoji,
          reactTo: this.ui.settingReaction.messageID,
        })
        this.toggleEnhancers()
      } else {
        this.$store.commit('ui/chatbarContent', this.ui.chatbarContent + emoji)
      }
      this.$store.commit('ui/updateMostUsedEmoji', { emoji, name: emojiName })
    },
    /**
     * @method setRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    setRoute(route: string) {
      this.$store.commit('ui/toggleEnhancers', {
        show: true,
        floating: this.$device.isMobile ? true : false,
        route,
      })
    },
    /**
     * @method toggleEnhancers DocsTODO
     * @description Toggles enhancers by committing the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
    toggleEnhancers(event: Event) {
      this.clickEvent()
      /* Ignore outside toggling when glyph & emoji toggle btn is clickd (for preventing twice-toggling)  */
      const glyphToggleElm = document.getElementById('glyph-toggle')
      const emojiToggleElm = document.getElementById('emoji-toggle')
      // @ts-ignore
      if (
        !event ||
        !(
          glyphToggleElm?.contains(event.target) ||
          emojiToggleElm?.contains(event.target)
        )
      ) {
        this.$store.commit('ui/toggleEnhancers', {
          show: !this.ui.enhancers.show,
          floating: this.$device.isMobile ? true : false,
        })
      }
      if (this.ui.settingReaction.status) {
        this.$store.commit('ui/settingReaction', {
          status: false,
          groupID: null,
          messageID: null,
        })
      }
    },
    /**
     * @method calculatePositionOnScreen
     * @description This returns a "x cordinate" to have the Enhancer window to load on the right or left screen
     * @example calculatePositionOnScreen(ui.enhancers.position[0])
     */
    calculatePositionOnScreen(locationX: number): number {
      if (
        this.convertRem(this.ui.enhancers.defaultWidth) + locationX >
        window.innerWidth
      ) {
        return locationX - this.convertRem(this.ui.enhancers.defaultWidth) * 2
      }
      return locationX - this.convertRem(this.ui.enhancers.defaultWidth)
    },
    /**
     * @method convertRem
     * @description This converts an rem value into a pixel value
     * @example convertRem('24rem') => if the document font size is 16px, this returns the value of 24*16, or 384.
     */
    convertRem(value: string): number {
      const fontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize, // Get the font size on the html tag, eg 16 (px), 2 (px), etc
      )
      const remNumber = Number(value.replace('rem', ''))
      return remNumber * fontSize
    },
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
