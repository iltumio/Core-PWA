<template src="./Glyphs.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { marketGlyphs } from '~/mock/marketplace'
import { GlyphMarketViewStatus } from '~/store/ui/types'
import { find, findKey, shuffle } from 'lodash'
import { ShoppingBagIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    ShoppingBagIcon,
  },
  computed: {
    ...mapState(['ui']),
    selectedPack() {
      const key = findKey(this.$mock.glyphs, ({ name }) => {
        return name === this.ui.glyphModalPack
      })
      return this.$mock.glyphs[key]
    },
    samplePack() {
      return shuffle(this.selectedPack.stickerURLs).slice(1, 4)
    },
  },
  methods: {
    closeModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'glyph',
        state: !this.ui.modals.glyph,
      })
    },
    openMarketplace() {
      this.closeModal()
      this.$store.commit('ui/toggleModal', {
        name: 'marketplace',
        state: !this.ui.modals.marketPlace,
      })
      const marketInfo = find(marketGlyphs, ({ glyph }) => {
        return glyph.name === this.selectedPack.name
      })
      this.$store.commit('ui/setGlyphMarketplaceView', {
        view: GlyphMarketViewStatus.SHOP_DETAIL,
        shopId: marketInfo.id,
      })
    },
  },
})
</script>
<style scoped lang="less" src="./Glyphs.less"></style>
