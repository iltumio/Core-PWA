<template src="./Aside.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { InfoIcon } from 'satellite-lucide-icons'

import { Group } from '~/types/ui/core'
import { User } from '~/types/ui/user'

export default Vue.extend({
  components: {
    InfoIcon,
  },
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
    selectedGroup: {
      type: Object as PropType<Group>,
      default: () => ({
        creator: '',
        name: '',
        members: [],
      }),
      required: true,
    },
    friends: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
  },
  computed: {
    /**
     * @method members DocsTODO
     * @description
     * @returns
     * @example
     */
    members() {
      const filterFriends = (friends: User[], members: string[]) => {
        return friends.filter((friend: User) =>
          members.includes(friend.address)
        )
      }
      return filterFriends(this.friends, this.selectedGroup.members)
    },
  },
})
</script>

<style scoped lang="less" src="./Aside.less"></style>
