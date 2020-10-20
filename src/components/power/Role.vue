<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
          <el-table :data="roleList" stripe style="width: 100%" border>
            <el-table-column type="expand" label="">
              <template slot-scope="scope">
                <el-row
                  v-for="item1 in scope.row.children"
                  :key="item1.id"
                  :class="['vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item1.id)"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      :class="['vcenter']"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="success"
                          closable
                          @close="removeRightById(scope.row, item2.id)"
                          >{{ item2.authName }}</el-tag
                        >
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag
                          type="warning"
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          closable
                          @close="removeRightById(scope.row, item3.id)"
                          >{{ item3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column prop="" label="操作" width="288">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="showSetRightDialog(scope.row)"
                  >分配权限</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      // 控制对话权限对话框显示和隐藏
      setRightDialogVisible: false,
      rightList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleId: "",
    };
  },
  created() {
    this.getRoleList();
  },

  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      console.log(this.roleList);
    },
    //根据id删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      role.children = res.data;
    },
    //展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightList = res.data;
      console.log(this.rightList);
      //递归获取三级节点
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    //监听对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    async allRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRoleList();
      this.setRightDialogVisible = false;
    },
    //点击为角色分配权限
  },
};
</script>
<style lang="scss" scoped>
.el-tag {
  margin-bottom: 10px;
  margin-right: 10px;
}
.abtop {
  border-top: 1px soild #000;
  // border: soild 1px red;
}
.abbutton {
  border-bottom: 1px soild #000;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>