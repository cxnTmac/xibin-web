<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col v-if="!collapsed" :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{sysName}}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">{{bookName}}</span>
                    <span class="el-dropdown-link userinfo-inner">{{currentPeriod}}期</span>
                    <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logoutHandler">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
				<el-menu
						default-active="2"
						class="el-menu-vertical-demo diyMenu"
						@open="handleopen"
						@close="handleclose"
						background-color="#545c64"
						text-color="#fff"
						active-text-color="#ffd04b"
						:unique-opened="true"
						:collapse="collapsed">
					<el-submenu :index="index+''" v-for="(item,index) in activeMenus"  :key="item.name">
						<template slot="title">
							<i :class="item.iconCls"></i>
							<span>{{item.name}}</span>
						</template>
						<el-menu-item v-for="(child) in activeSubMenus(item.children)"   @click="$router.push(child.path)" :index="child.path" :key="child.path">{{child.name}}</el-menu-item>
					</el-submenu>
				</el-menu>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import { logout } from '../api/api';
	export default {
		data() {
			return {
				sysName:'西滨精工',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
                currentPeriod:'',
                bookName:'',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		computed: {
			activeMenus: function () {
				return this.$store.state.roleFunctions.routers.filter(function (router) {
					return !router.hidden
				})
			},
			activeSubMenus: function () {
				return function (submenu) {
                  return submenu.filter(function (router) {
					return !router.hidden
				})
              }
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logoutHandler: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
                    logout().then(data => {
                        this.logining = false;
                        //NProgress.done();
                        let { msg, code, user } = data;
                        if (code !== 200) {
                            this.$message({
                                message: msg,
                                type: 'error'
                            });
                        } else {
                            sessionStorage.removeItem('user');
                            _this.$router.push('/login');
                        }
                    });
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		
		mounted() {
			var user = localStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.currentPeriod =  user.currentPeriod;
				this.bookName = user.bookName;
				this.sysUserName = user.userName || '';
				//this.sysUserAvatar = user.avatar || '';
                this.sysUserAvatar = 'static/logo/Lucian.jpg'
			}

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: #004DA1;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
            .logoSmall {
                height:30px;
            }
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
                background: #545c64;
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 100px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
            //左上角公司名称/LOGO菜单展开
			.logo-width{
				width:201px;
			}
            //左上角公司名称/LOGO菜单收缩
			.logo-collapse-width{
				width:65px
			}
            //右上角工具栏
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
            .el-menu-vertical-demo:not(.el-menu--collapse) {
                width: 200px;
                min-height: 400px;
            }
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>