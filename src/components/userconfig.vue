<template>
  <div class="user-config">
      <iframe :src="`${configPath}/User/user_manage.html`" frameborder="0"></iframe>
  </div>
</template>
<script>
    export  default{
        mounted(){
            this.$Spin.hide()
        }
    }
</script>
<style>
    .user-config{
        height: 100%;
        width: 100%;
    }
    iframe{
        height: 100%;
        width: 100%;
    }
</style>
