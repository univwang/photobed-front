<template>
  <div class="globalHeader">
    <a-menu
      mode="horizontal"
      :default-selected-keys="['1']"
      @menu-item-click="toMenuClick"
      :selected-keys="selectedKeys"
    >
      <a-menu-item
        key="0"
        :style="{ padding: 0, marginRight: '38px' }"
        disabled
      >
        <div class="title-bar">
          <img class="logo" src="../assets/logo.svg" />
          <div class="title">工具箱</div>
        </div>
      </a-menu-item>
      <a-menu-item v-for="item in routes" :key="item.path">
        {{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/route";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const selectedKeys = ref(["/"]);
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
const toMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
}

.title {
  color: grey;
  margin-left: 10px;
}
</style>
