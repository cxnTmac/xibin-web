<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <img class="login-logo" src="../../static/logo/LOGO3.jpg" />
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  import {getAllRoleFunctions} from '../api/sysApi'
  import {remoteRoutes} from '../routes'
//import codemaster from '../static/codemaster.json'
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          userName: '',
          password: ''
        },
        rules2: {
          userName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        debugger
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            let loginParams = {data:JSON.stringify({ userName: this.ruleForm2.userName, password: this.ruleForm2.password })};
            requestLogin(loginParams).then(data => {
              this.logining = false;
              //NProgress.done();
              let { msg, code, user } = data;
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                  //localStorage.setItem('mobileUrl','http://192.168.1.8:8080/%23/')
                localStorage.setItem('user', JSON.stringify(data.data))
                //记住密码
                if(this.checked){
                  localStorage.setItem('inputUserName', this.ruleForm2.userName)
                  localStorage.setItem('inputPassword', this.ruleForm2.password)
                }else{
                  localStorage.removeItem('inputUserName')
                  localStorage.removeItem('inputPassword')
                }
                // sessionStorage.setItem('user', JSON.stringify(data.data));
                let overTime = new Date().getTime() + 100000000000
                localStorage.setItem('overTime', overTime)
                getAllRoleFunctions().then((res) => {
                      let roles = res.data.data;
                      roles = remoteRoutes;//暂时用静态数据代替
                      //NProgress.done();
                      if(res.data.code == 200){
                          this.$store.dispatch('GenerateRoutes',roles).then(()=>{
                              console.log(this.$store.state.roleFunctions.addRouters);
                              //sessionStorage.setItem('roles',JSON.stringify(store.state.roleFunctions.addRouters))
                              router.addRoutes(this.$store.state.roleFunctions.addRouters);
                              next({ ...to, replace: true })
                          });
                      }else{
                          alert(res.data.msg);
                      }
                }).catch((data) => {
                      alert(data);
                });
                this.$router.push({ path: '/echarts' });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted(){
      this.ruleForm2.userName = localStorage.getItem('inputUserName')
      this.ruleForm2.password = localStorage.getItem('inputPassword')
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .login-logo {
    width: 100%;
  }
</style>