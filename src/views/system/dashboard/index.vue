<template>
  <div class="dashboard-container" style="height:100%;">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import memberDashboard from './member'

export default {
  name: 'Dashboard',
  components: { adminDashboard, memberDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'manager'
    ])
  },
  created() {
    if (this.manager.Role === 0) {
      this.currentRole = 'adminDashboard'
    } else {
      this.currentRole = 'memberDashboard'
    }
  }
}
</script>
