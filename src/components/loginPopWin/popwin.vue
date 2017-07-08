<template>
    <el-dialog  size="tiny" :visible.sync="dialogFormVisible" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-form :model="ruleForm2" label-width="0px" label-position="left" ref="ruleForm2" :rules="rules2">
            <img class="login-logo" src="../../../static/logo/LOGO3.jpg" />
            <el-form-item>
                <h3>登陆超时，请重新登陆</h3>
            </el-form-item>
            <el-form-item prop="userName" >
                <el-input v-model="ruleForm2.userName" :disabled="true" auto-complete="off" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button style="width:100%" type="primary" @click="handleSubmit2" :loading="logining">登陆</el-button>
        </div>
        <!--<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">-->
            <!--<img class="login-logo" src="../../../static/logo/LOGO3.jpg" />-->
            <!--<h3 class="title">登陆超时</h3>-->
            <!--<el-form-item prop="account">-->
                <!--<el-input type="text" v-model="ruleForm2.userName" auto-complete="off" placeholder="账号"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item prop="checkPass">-->
                <!--<el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
            <!--<el-form-item style="width:100%;">-->
                <!--<el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>-->
                <!--&lt;!&ndash;<el-button @click.native.prevent="handleReset2">重置</el-button>&ndash;&gt;-->
            <!--</el-form-item>-->
        <!--</el-form>-->
    </el-dialog>

</template>

<script>
    import { requestLogin } from '@/api/api';
    export default {
        data() {
            return {
                dialogFormVisible:true,
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
            }
        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {
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
                                sessionStorage.setItem('user', JSON.stringify(data.data));
                                this.dialogFormVisible = false;
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        created(){
            debugger
            let userDetails = JSON.parse(sessionStorage.user);
            if(userDetails!==null){
                this.ruleForm2.userName = userDetails.userName;
            }
        },
        mounted(){
        }
    }



</script>

<style scoped>
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