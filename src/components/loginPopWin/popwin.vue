<template>
    <el-dialog  size="tiny" width ="30%" :visible.sync="dialogFormVisible" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
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
                        let loginParams = {username: this.ruleForm2.userName, password: this.ruleForm2.password };
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
                                localStorage.setItem('user', JSON.stringify(data.data));
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
            let userDetails = JSON.parse(localStorage.user);
            if(userDetails!==null){
                this.ruleForm2.userName = userDetails.username;
            }
        },
        mounted(){
        }
    }



</script>

<style scoped>

    .login-logo {
        width: 100%;
    }
</style>