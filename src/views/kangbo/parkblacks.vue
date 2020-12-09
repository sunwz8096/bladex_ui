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
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.parkblacks_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="success"
                   size="small"
                   icon="el-icon-upload"
                   plain
                   v-if="permission.parkblacks_upload"
                   @click="uploadFormVisible = true">导 入
        </el-button>
      </template>
    </avue-crud>

    <el-dialog title="Excel导入" :visible.sync="uploadFormVisible" :append-to-body="true">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="车型" >
          <el-select v-model="uploadForm.carModel" placeholder="请选择活动区域">
            <el-option label="车型1" value="111"></el-option>
            <el-option label="车型2" value="222"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="uploadForm.areaId" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :on-change="onUploadChange"
            :limit = "1"
            :on-exceed="onExceed"
            :file-list="uploadList"
            drag
            :multiple="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="uploadExcel">上 传</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove } from "@/api/kangbo/parkblacks";
  import {mapGetters} from "vuex";

  import axios from 'axios';

  export default {
    data() {
      return {
        uploadFormVisible:false,
        uploadForm:{
          carModel: '',
          areaId:''
        },
        uploadList:[],
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
          height:'auto',
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
              label: "车牌号码",
              prop: "plateNumber",
              rules: [{
                required: true,
                message: "请输入车牌号码",
                trigger: "blur"
              }]
            },
            {
              label: "车型（系统字典）",
              prop: "carModel",
              rules: [{
                required: true,
                message: "请输入车型（系统字典）",
                trigger: "blur"
              }]
            },
            {
              label: "业务区域标识列表",
              prop: "areaids",
              rules: [{
                required: true,
                message: "请输入业务区域标识列表",
                trigger: "blur"
              }]
            },
            {
              label: "开始时间",
              prop: "startDate",
              rules: [{
                required: true,
                message: "请输入开始时间",
                trigger: "blur"
              }]
            },
            {
              label: "结束时间",
              prop: "endDate",
              rules: [{
                required: true,
                message: "请输入结束时间",
                trigger: "blur"
              }]
            },
            {
              label: "加入原因",
              prop: "reason",
              rules: [{
                required: true,
                message: "请输入加入原因",
                trigger: "blur"
              }]
            },
            {
              label: "停车场编号",
              prop: "parkCode",
              rules: [{
                required: true,
                message: "请输入停车场编号",
                trigger: "blur"
              }]
            },
            {
              label: "停车场名称",
              prop: "parkName",
              rules: [{
                required: true,
                message: "请输入停车场名称",
                trigger: "blur"
              }]
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
          addBtn: this.vaildData(this.permission.parkblacks_add, false),
          viewBtn: this.vaildData(this.permission.parkblacks_view, false),
          delBtn: this.vaildData(this.permission.parkblacks_delete, false),
          editBtn: this.vaildData(this.permission.parkblacks_edit, false)
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
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
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
            this.form = res.data.data;
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
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
      },

      onUploadChange(file,fileList){
        console.log("获取到文件："+ file.name);
        console.log("此时fileList："+ fileList.length);
        console.log("this.uploadList："+ this.uploadList.length);
        this.uploadList = fileList;

      },
      onExceed(){

      },
      uploadExcel(){


        console.log("上传之前this.uploadList："+ this.uploadList.length);
        console.log("上传之前this.file："+ this.uploadList[0].name);
        console.log("上传之前this.file："+ this.uploadList[0].size);
        let f = new FormData();
        f.append("file",this.uploadList[0]);
        f.append("carModel","车型1111");
        f.append("areaName","区域122");

        axios({
          url:'/api/blade-kangbo-biz/parkblacks/upload',
          method:'post',
          data:f,
          headers:{'Content-Type':'multipart/form-data'}
        }).then(res=>{
          console.log(JSON.stringify(res.data.data));
        });

        // uploadFile(f).then(res=>{
        //   console.log(res.data.data);
        //   this.$message.success("请求成功");
        // }).catch(e=>{
        //   this.$message.error("请求异常："+ e);
        // });

      }


    }
  };
</script>

<style>
</style>
