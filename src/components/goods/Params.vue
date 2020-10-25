<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_top">
        <el-col>
          <span
            >选择商品分类：<!-- 联级区域 -->
            <el-cascader
              v-model="selectCateKeys"
              :options="cateList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
              }"
              @change="handleChange"
            ></el-cascader
          ></span>
        </el-col>
      </el-row>
      <!-- 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 对话框显示 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框内容 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 对话框内容 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      //   级联选择框双向绑定到的数组
      selectCateKeys: [],
      activeName: "many",
      //动态参数的数据
      manyTableData: [],
      //静态参数的数据
      onlyTableData: [],
      //控制对话框的显示和隐藏
      addDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      //添加表单的验证数据对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.cateList = res.data;
      console.log(this.cateList);
    },
    // 级联选择框选中项变化，会触发函数
    handleChange() {
      if (this.selectCateKeys.length != 3) {
        this.selectCateKeys = [];
      }
      console.log(this.selectCateKeys);
      this.getParamsData();
    },
    //tab页签点击事件的处理函数
    handleClick() {
      this.getParamsData();
    },
    //获得列表的参数数据
    async getParamsData() {
      //根据所选分类的id，和当前所选的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }
      console.log(res.data);
      //区分数据是动态的还是静态的
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //监听编辑清空表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //点击编辑弹出框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id},params:{attr_sel:this.activeName}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取表单失败");
      }
      this.editForm = res.data;

      this.editDialogVisible = true;
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("参数修改失败");
        }
        this.$message.success("修改参数成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    //删除
    async removeParams(attr_id) {
      const confirmResult = this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //用户取消了删除组件
      if (confirmResult !== "confirm") {
        return this.$message.error("已取消删除");
      }
      //确定删除的逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.$message.success("删除参数成功");
      this.getParamsData();
    },
  },
  //计算属性
  //如果按钮需要禁用，则返回true,否则返回false
  computed: {
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //获取选中三级分类的ID
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
    //判断对话框标题
    titleText() {
      if (this.activeName === "many") {
        return "动态属性";
      }
      return "静态属性";
    },
  },
};
</script>
<style lang="scss" scoped>
.cat_top {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 20px;
}
</style>