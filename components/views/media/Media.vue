<template src="./Media.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User } from '~/types/ui/user'

export default Vue.extend({
  props: {
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
    fullscreen: {
      type: Boolean,
      default: false,
      required: true,
    },
    maxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
    fullscreenMaxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      componentKey: this.fullscreen,
    }
  },
  computed: {
    propsToWatch() {
      return { users: this.users, fullscreen: this.fullscreen }
    },
    computedUsers() {
      return this.fullscreen
        ? this.users.slice(0, this.fullscreenMaxViewableUsers)
        : this.users.slice(0, this.maxViewableUsers)
    },
    ...mapState(['audio']),
  },
  watch: {
    propsToWatch({ fullscreen }) {
      const media: HTMLElement = this.$refs.media as HTMLElement
      if (!fullscreen) {
        const blocks = media.querySelectorAll('.user, .more-user')
        if (!media) return
        for (let j = 0; j < blocks.length; j++) {
          const block = blocks[j] as HTMLElement
          block.style.width = this.$device.isMobile ? '160px' : '16rem'
          block.style.height = this.$device.isMobile ? '90px' : '9rem'
        }
        media.style.paddingTop = ''
        media.style.paddingBottom = ''
      } else {
        // TODO: Listen to scroll event instead..
        this.$nextTick(() => {
          const isFit = function (
            viewportWidth: number,
            viewportHeight: number,
            blockWidth: number,
            blockHeight: number,
            blockCount: number,
          ) {
            const cols = Math.floor(viewportWidth / blockWidth)
            const rows = Math.ceil(blockCount / cols)
            return {
              fit: blockHeight * rows < viewportHeight,
              matrix: { cols, rows },
            }
          }
          if (!media) return
          const blocks = media.querySelectorAll('.user, .more-user')
          if (
            blocks.length === 0 ||
            !document.querySelectorAll('.fullscreen-media')
          )
            return

          const viewportWidth = media.clientWidth
          const viewportHeight = media.clientHeight
          const blockCount = blocks.length
          const blockStyle = window.getComputedStyle(blocks[0])
          const blockMargin = Math.floor(
            parseInt(blockStyle.margin.replace('px', '')),
          )
          const marginPerBlock = blockMargin * 2

          // Variables created that will either be declared if the user is in 'mobile fullscreen calls'
          // Else, they are left undefined and use different logic for 'desktop fullscreen calls'
          let mobileMaxBlockContentWidth
          let mobileAspectRatio

          if (this.$device.isMobile === true) {
            if (blockCount === 1) {
              mobileMaxBlockContentWidth = viewportWidth - marginPerBlock * 1.5
              mobileAspectRatio = 3 / 4
            } else if (blockCount === 2) {
              mobileMaxBlockContentWidth = viewportWidth - marginPerBlock * 1.5
              mobileAspectRatio = 1 / 2
            } else if (blockCount <= 4) {
              mobileMaxBlockContentWidth =
                viewportWidth / 2 - marginPerBlock * 1.5
              mobileAspectRatio = 4 / 3
            } else {
              mobileMaxBlockContentWidth =
                viewportWidth / 2 - marginPerBlock * 1.5
              mobileAspectRatio = 3 / 4
            }
          }

          // logic for 'desktop fullscreen calls' where we set the max block content size so that a block cannot be larger than half viewportWidth
          const maxBlockContentWidth =
            typeof mobileMaxBlockContentWidth === 'undefined'
              ? viewportWidth / 2 - marginPerBlock * 1.5
              : mobileMaxBlockContentWidth
          const aspectRatio =
            typeof mobileAspectRatio === 'undefined'
              ? 9 / 16
              : mobileAspectRatio

          let finalWidth = 160
          let finalHeight = 90
          let finalMatrix = { cols: 1, rows: 1 }
          // if max block of a content is reach, stop the loop
          let maxBlockContentWidthReached = false
          for (let i = 2; i <= 100 && !maxBlockContentWidthReached; i++) {
            maxBlockContentWidthReached =
              Math.floor((viewportWidth * i) / 100) > maxBlockContentWidth
            const blockContentWidth = maxBlockContentWidthReached
              ? maxBlockContentWidth
              : Math.floor((viewportWidth * i) / 100)

            const blockContentHeight = Math.floor(
              blockContentWidth * aspectRatio,
            )
            const blockWidth = blockContentWidth + marginPerBlock
            const blockHeight = blockContentHeight + marginPerBlock
            const { fit, matrix } = isFit(
              viewportWidth,
              viewportHeight,
              blockWidth,
              blockHeight,
              blockCount,
            )
            if (!fit) {
              break
            }
            finalWidth = blockContentWidth
            finalHeight = blockContentHeight
            finalMatrix = matrix
          }
          for (let i = 0; i < blockCount; i++) {
            const block = blocks[i] as HTMLElement
            block.style.width = finalWidth + 'px'
            block.style.height = finalHeight + 'px'
          }
          const height = finalHeight * finalMatrix.rows
          if (height <= viewportHeight) {
            const padding = Math.floor((viewportHeight - height) / 2)
            media.style.paddingTop = padding + 'px'
            media.style.paddingBottom = padding + 'px'
          }
        })
      }
    },
  },
  methods: {
    /**
     * @method volumeControlValueChange DocsTODO
     * @description Changes volume by setting new value using $Sounds.changeLevels and committing new value to setVolume in state
     * @param volume New volume level
     * @example
     */
    volumeControlValueChange(volume: number) {
      this.$Sounds.changeLevels(volume / 100)
      this.$store.commit('audio/setVolume', volume)
    },
  },
})
</script>

<style scoped lang="less" src="./Media.less"></style>
