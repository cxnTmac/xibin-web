<template>
    <el-dialog title="登陆" :visible.sync="dialogFormVisible">
        <el-form :model="loginForm">
            <el-form-item prop="account">
                <el-input v-model="loginForm.userName" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false">登陆</el-button>
        </div>
    </el-dialog>

</template>

<script>
    export default {
        data() {
            return {
                loginForm :{
                    userName:"",
                    password:""
                },
                dialogFormVisible : true

            }
        },
        methods: {

        }
    }



</script>

<style scoped>

</style>