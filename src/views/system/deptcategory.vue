<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <!--自定义机构类型选择器-->
      <template slot="childKeysForm" slot-scope="{row,label,dic,$index}">
        <el-select v-model="row.childKeys" multiple placeholder="请选择">
          <el-option
            v-for="item in deptCategoryList"
            :key="parseInt(item.categoryKey)"
            :label="item.categoryName"
            :value="parseInt(item.categoryKey)">
          </el-option>
        </el-select>
      </template>

      <template slot-scope="{row}"
                slot="canBeTop">
        <el-tag v-if="row.canBeTop">顶级机构</el-tag>
        <el-tag v-else type="warning">非顶级机构</el-tag>
      </template>

      <template slot-scope="{row}"
                slot="isLock">
        <el-tag v-if="!row.isLock">正常</el-tag>
        <el-tag v-else type="warning">锁定</el-tag>
      </template>

      <template slot-scope="{row}"
                slot="childKeys">
        <el-tag style="margin: 3px 3px" v-if="row.childKeys"
                v-for="item in (row.childKeys || '').split(',').filter(i => i).map(c => deptCategoryList.find(category => category.categoryKey === parseInt(c)))">
          {{(item||{categoryName: '未知类型'}).categoryName}}
        </el-tag>
      </template>

      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.deptcategory_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, getAllList} from "@/api/system/deptcategory";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        deptCategoryList: [],
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "",
              prop: "id",
              hide: true,
              display: false
            },
            {
              label: "类型值",
              prop: "categoryKey",
              rules: [{
                required: true,
                message: "请输入类型值",
                trigger: "blur"
              }]
            },
            {
              label: "类型名称",
              prop: "categoryName",
              rules: [{
                required: true,
                message: "请输入类型名称",
                trigger: "blur"
              }]
            },
            {
              label: "顶级机构",
              type: "switch",
              value: true,
              prop: "canBeTop",
              slot: true,
            },
            {
              label: "下级类型",
              prop: "childKeys",
              formslot: true,
              slot: true,
            },
            {
              label: "排序",
              type: "number",
              minRows: 0,
              step: 1,
              value: 0,
              prop: "sort",
            },
            {
              label: "锁定",
              type: "switch",
              value: false,
              prop: "isLock",
              slot: true,
            },
            {
              label: "备注",
              prop: "remark",
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.deptcategory_add, false),
          viewBtn: this.vaildData(this.permission.deptcategory_view, false),
          delBtn: this.vaildData(this.permission.deptcategory_delete, false),
          editBtn: this.vaildData(this.permission.deptcategory_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    created() {
      this.getAllList()
      console.log(this.deptCategoryList)
    },
    methods: {
      async getAllList() {
        this.deptCategoryList = (await getAllList()).data.data
      },
      rowSave(row, done, loading) {
        let newRow = Object.assign({}, row)
        newRow.childKeys = newRow.childKeys.join()
        add(newRow).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getAllList()
          done();
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowUpdate(row, index, done, loading) {
        let newRow = Object.assign({}, row)
        newRow.childKeys = newRow.childKeys.join()
        update(newRow).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getAllList()
          done();
        }, error => {
          loading();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.getAllList()
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.getAllList()
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            let newForm = res.data.data;
            newForm.childKeys = newForm.childKeys.split(",").filter(item => item).map(item => parseInt(item))
            this.form = newForm;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
