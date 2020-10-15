<template>
  <el-container class="home-container">
    <!-- 头部导航 -->
    <el-header>
      <div class="logo-title">
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="zoombutton" @click="toggleCollapse()">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#d44e4e"
          text-color="#fff"
          active-text-color="#fff"
          unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title" class="">
              <!-- 导航图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 导航文字 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="iconfont icon-manage"></i>
              {{ subItem.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主栏 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        125: "iconfont icon-addressbook",
        103: "iconfont icon-lock",
        101: "iconfont icon-service",
        102: "iconfont icon-activity",
        145: "iconfont icon-dynamic",
      },
      isCollapse: false,
    };
  },
  created() {
    this.getMenuList();
  },

  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #d44e4e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo-title {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
    }
    span {
      margin-left: 10px;
      color: white;
      font-size: 20px;
    }
  }
}
.el-aside {
  background-color: #d44e4e;
  .zoombutton {
    height: 30px;
    width: 100%;
    text-align: center;
    line-height: 30px;
    color: white;
    background-color: #a83f41;
    font-size: 15px;
    letter-spacing: 0.1em;
    cursor: pointer;
  }
  .el-menu {
    border: 0;
  }
}
.el-main {
  background-color: #eee;
}
.el-submenu {
  .el-icon-arrow-down {
  }
  //   color: white;
  i {
    color: white;
    margin-right: 10px;
    font-size: 20px;
  }
}
</style>>
