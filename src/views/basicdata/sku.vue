<template>
	<section>
		<div v-title data-title="产品"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="配件类型" prop="fittingTypeCode">
						<popwin-button popKey="POP_FITTINGTYPE" :showName="true" :displayName="filters.fittingTypeName"
							v-model="filters.fittingTypeCode"></popwin-button>
					</el-form-item>
					<el-form-item label="产品名称" prop="fittingSkuName">
						<el-input v-model="filters.fittingSkuName" placeholder="产品名称"></el-input>
					</el-form-item>
					<el-form-item label="产品编码" prop="fittingSkuCode">
						<el-input v-model="filters.fittingSkuCode" placeholder="产品编码"></el-input>
					</el-form-item>
					<el-form-item label="车型" prop="modelCode">
						<el-autocomplete class="inline-input" v-model="filters.modelCode"
							:fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false"
							@select="handleSelect"></el-autocomplete>
						<!--<el-input v-model="filters.modelCode" placeholder="车型"></el-input>-->
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom"
						v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right" @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getSkus"><i
							class="el-icon-search el-icon--left"></i>查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
					<el-row :gutter="0" v-if="showMoreQueryCondition">
						<el-form-item label="快速编码" prop="quickCode">
							<el-input v-model="filters.quickCode" placeholder="快速编码"></el-input>
						</el-form-item>
						<el-form-item label="系列" prop="series">
							<el-select v-model="filters.series" clearable placeholder="请选择">
								<el-option v-for="item in series" :key="item.code" :label="item.name"
									:value="item.code">
									<span style="float: left">{{ item.name }}</span>
								</el-option>
							</el-select>
							<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
						</el-form-item>
						<el-form-item label="发布日期从" prop="releaseDateFm">
							<el-date-picker v-model="filters.releaseDateFm" type="date" placeholder="选择日期">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
						<el-form-item label="发布日期到" prop="releaseDateTo">
							<el-date-picker v-model="filters.releaseDateTo" type="date" placeholder="选择日期">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-row>
				</transition>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="skus" border highlight-current-row v-loading="listLoading" @selection-change="selsChange"
			style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="fittingSkuCode" label="产品编码" width="80">
			</el-table-column>
			<el-table-column prop="fittingSkuName" label="产品名称" width="120">
			</el-table-column>
			<el-table-column prop="modelCode" label="车型" width="120">
			</el-table-column>
			<el-table-column prop="series" label="系列" width="120">
			</el-table-column>
			<el-table-column prop="fittingSkuStatus" label="状态" width="80">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag :type="getStatusTagType(scope.row)">{{ formateType(scope.row) }}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="fittingTypeName" label="配件类别名称" width="120">
			</el-table-column>
			<el-table-column prop="packageCode" label="包装编码" width="80">
			</el-table-column>
			<el-table-column prop="releaseDate" label="发布时间" width="155" :formatter="formatTime">
			</el-table-column>
			<el-table-column prop="uomDesc" label="单位" width="80">
			</el-table-column>
			<el-table-column prop="type" label="包装类别" width="80" :formatter="formatISPACKED">
			</el-table-column>
			<!-- <el-table-column prop="fittingSkuRemark" label="产品备注" width="120" >
			</el-table-column> -->
			<el-table-column prop="manufacturer" label="生产厂家" width="80">
			</el-table-column>
			<el-table-column prop="materialquality" label="材质" width="80">
			</el-table-column>
			<el-table-column prop="price" label="参考价格" width="80">
			</el-table-column>
			<el-table-column prop="fittingTypeCode" label="配件类别编码" width="120">
			</el-table-column>
			<el-table-column prop="def1" label="详细尺寸" width="120">
			</el-table-column>
			<!-- <el-table-column prop="def2" label="自定义2" width="80" >
			</el-table-column>
			<el-table-column prop="def3" label="自定义3" width="80" >
			</el-table-column>
			<el-table-column prop="def4" label="自定义4" width="80" >
			</el-table-column>
			<el-table-column prop="def5" label="自定义5" width="80" >
			</el-table-column> -->
			<el-table-column label="操作" fixed="right" min-width="430">

				<template slot-scope="scope">
					<!-- <el-button type="success" size="small" @click="handleSetNew(scope.$index, scope.row)">设置为新品</el-button> -->
					<el-button type="info" size="small" @click="printLabel(scope.$index, scope.row)">标签打印</el-button>
					<el-button type="success" size="small" @click="copy(scope.$index, scope.row)">复制</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)"><i
							class="el-icon-delete2 el-icon--left"></i>删除</el-button>
					<el-button type="primary" size="small" @click="handlePicManager(scope.$index, scope.row)"><i
							class="el-icon-picture el-icon--left"></i>图片管理</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">

			<el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
			<el-button type="primary" @click="openExcelImportPopWin">excel导入金蝶编码查询产品编码</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size"
				:total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--图片管理界面-->
		<el-dialog title="图片管理" :visible.sync="dialogPicManagerVisible">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="图片上传" name="picUpload">
					<el-upload ref="upload" class="upload-demo" drag :data="currentRow"
						:on-success="uploadConnectSuccess" :on-error="uploadConnectFail"
						action="/xibin/file/uploadFittingSkuPic " :file-list="fileList" multiple list-type="picture"
						:auto-upload="true">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
					</el-upload>
					<!--<el-button type="primary" size="large" @click="startUpload">开始上传</el-button>-->
				</el-tab-pane>
				<el-tab-pane label="图片查看" name="picManage">
					<el-row>
						<el-col :span="6" v-for="(img, index) in imgs" :key="img" :offset="index > 0 ? 2 : 0">
							<el-card :body-style="{ padding: '0px' }">
								<el-tooltip :content="img.normal.fittingSkuPicName" placement="left" effect="dark">
									<img :src=img.zip.fittingSkuPicUrl class="image" @click="showNormalPic(img.normal)">
								</el-tooltip>
								<div style="padding: 14px;">
									<span>{{ img.normal.fittingSkuPicName }}</span>
									<div class="bottom clearfix">
										<time class="time">{{ img.normal.createTime }}</time>
										<!--<el-button type="danger" icon="delete"></el-button>-->
										<el-button type="text" class="button"
											@click="handleDelPic(img.normal.id, img.zip.id, img.normal.fittingSkuCode)">删除</el-button>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>

				</el-tab-pane>
				<el-tab-pane label="产品二维码" name="qrCodeManage">
					<el-button @click.native="printQrCode">打印二维码（带产品信息）</el-button>
					<el-button @click.native="printQrCodeSingle">打印二维码</el-button>
					<el-row>
						<img :src="qrCodeUrl" />
					</el-row>

				</el-tab-pane>
			</el-tabs>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-tabs v-model="editFormActiveName" @tab-click="assembleTabClick">
				<el-tab-pane label="产品信息" name="first">
					<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
						<el-row :gutter="0">
							<el-col :span="8">
								<el-form-item label="产品编码" prop="fittingSkuCode">
									<el-input v-model="editForm.fittingSkuCode" :disabled="true"
										auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="快速编码" prop="quickCode">
									<el-input v-model="editForm.quickCode" :disabled="true"
										auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="产品名称" prop="fittingSkuName">
									<el-input v-model="editForm.fittingSkuName" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="0">
							<el-col :span="8">
								<el-form-item label="车型" prop="modelCode">
									<el-input v-model="editForm.modelCode" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="配件类别" prop="fittingTypeCode">
									<popwin-button popKey="POP_FITTINGTYPE" :showName="true"
										:displayName="editForm.fittingTypeName"
										v-model="editForm.fittingTypeCode"></popwin-button>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="是否显示" prop="isShow">
									<el-switch v-model="editForm.isShow" active-color="#13ce66" inactive-color="#ff4949"
										active-value="Y" inactive-value="N">
									</el-switch>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="0">

						</el-row>



						<el-row :gutter="0">


							<el-col :span="8">
								<el-form-item label="包装规格" prop="packageCode">
									<el-input v-model="editForm.packageCode" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="单位" prop="uomDesc">
									<el-input v-model="editForm.uomDesc" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="包装类别" prop="type">
									<el-select v-model="editForm.type" placeholder="请选择">
										<el-option v-for="item in is_packed" :key="item.code" :label="item.name"
											:value="item.code">
											<span style="float: left">{{ item.name }}</span>
											<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code
												}}</span>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>

						</el-row>

						<el-row :gutter="0">
							<el-col :span="8">
								<el-form-item label="状态" prop="fittingSkuStatus">
									<el-select v-model="editForm.fittingSkuStatus" placeholder="请选择">
										<el-option v-for="item in stautus" :key="item.code" :label="item.name"
											:value="item.code">
											<span style="float: left">{{ item.name }}</span>
											<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code
												}}</span>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="是否组装" prop="needToAssemble">
									<el-select v-model="editForm.needToAssemble" placeholder="请选择">
										<el-option v-for="item in yesOrNo" :key="item.code" :label="item.name"
											:value="item.code">
											<span style="float: left">{{ item.name }}</span>
											<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code
												}}</span>
										</el-option>
									</el-select>
									<!--<el-input v-model="orderHeader.status" auto-complete="off"></el-input>-->
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="组装类型" prop="assembleType">
									<el-select v-model="editForm.assembleType" :disabled="editFormAssembleTypeStatus"
										placeholder="请选择">
										<el-option v-for="item in assembleType" :key="item.code" :label="item.name"
											:value="item.code">
											<span style="float: left">{{ item.name }}</span>
											<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code
												}}</span>
										</el-option>
									</el-select>
									<!--<el-input v-model="orderHeader.status" auto-complete="off"></el-input>-->
								</el-form-item>
							</el-col>

						</el-row>
						<el-row :gutter="0">
							<el-col :span="8">
								<el-form-item label="系列" prop="type">
									<el-select v-model="editForm.series" placeholder="请选择">
										<el-option v-for="item in series" :key="item.code" :label="item.name"
											:value="item.code">
											<span style="float: left">{{ item.name }}</span>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="发布日期" prop="releaseDate">
									<el-date-picker v-model="editForm.releaseDate" type="date" placeholder="选择日期"
										value-format="yyyy-MM-dd">
									</el-date-picker>
									<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
								</el-form-item>
								<!-- <el-form-item label="通用组" prop="groupCode">
									<popwin-button popKey="POP_SKU_GROUP" :selectValue="editForm.groupCode"
										v-model="editForm.groupCode"></popwin-button>
								</el-form-item> -->
							</el-col>
							<el-col :span="4">
							</el-col>
						</el-row>
						<el-row :gutter="0">
							<el-col :span="8">
								<el-form-item label="参考价格" prop="price">
									<el-input-number v-model="editForm.price" auto-complete="off"></el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="生产厂家" prop="manufacturer">
									<el-input v-model="editForm.manufacturer" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="材质" prop="materialquality">
									<el-input v-model="editForm.materialquality" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="0">

							<el-col :span="8">
								<el-form-item label="详细尺寸" prop="def1">
									<el-input v-model="editForm.def1" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="默认库位" prop="defaultLoc">
									<popwin-button popKey="POP_LOC" :staticCondition="{ useType: 'RS' }"
										:displayName="editForm.defaultLoc"
										v-model="editForm.defaultLoc"></popwin-button>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="最低库存数" prop="minInventory">
									<el-input-number v-model="editForm.minInventory"
										auto-complete="off"></el-input-number>
								</el-form-item>
							</el-col>

						</el-row>
						<el-row :gutter="0">
							<el-col :span="24">
								<el-form-item label="产品备注" prop="fittingSkuRemark">
									<el-input type="textarea" :rows="4" v-model="editForm.fittingSkuRemark"
										auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

					</el-form>
					<div style="float:right;">
						<el-button @click.native="editFormVisible = false">取消</el-button>
						<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane label="组装信息" name="second" :disabled="editFormAssembleSkuTabStatus">
					<el-table :data="assembleSkus" border highlight-current-row v-loading="assembleListLoading"
						@current-change="handleCurrentAssembleSkuChange" @selection-change="assembleSelsChange"
						style="width: 100%;">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="id" width="55">
						</el-table-column>
						<el-table-column prop="sSkuCode" label="子件编码" width="200">

							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<popwin-button popKey="POP_SKU" :selectValue="scope.row.sskuCode"
										v-model="scope.row.sskuCode"
										@changeValue="changePopValueForSkuCode"></popwin-button>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="sskuName" label="子件名称" width="250">
						</el-table-column>
						<el-table-column prop="num" label="数量" width="200">

							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<el-input-number v-model="scope.row.num" auto-complete="off"></el-input-number>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" fixed="right" min-width="150">

							<template slot-scope="scope">
								<!--<el-button size="small"  @click="handleDetailEdit(scope.$index, scope.row)">编辑</el-button>-->
								<el-button type="danger" size="small"
									@click="handleAssembleSkuDel(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-button type="primary" :disabled="btnAssembleSkuGridAddStatus"
							@click="addAssembleSkuHandler">新增</el-button>
						<el-button type="primary" style="float: right" :disabled="btnAssembleSkuGridAddStatus"
							@click.native="saveSkuAssemble">保存</el-button>
					</el-col>
				</el-tab-pane>
				<el-tab-pane label="通用产品" name="third" :disabled="editFormSkuGroupTabStatus">
					<el-table :data="skuGroupSkus" border highlight-current-row v-loading="skuGroupListLoading"
						style="width: 100%;">
						<el-table-column prop="groupCode" label="通用组编码" width="150">
						</el-table-column>
						<el-table-column prop="groupCode" label="通用组名称" width="150">
						</el-table-column>
						<el-table-column prop="fittingSkuCode" label="产品编码" width="200">
						</el-table-column>
						<el-table-column prop="fittingSkuName" label="产品名称" width="300">
						</el-table-column>
						<el-table-column prop="modelCode" label="车型">
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>

		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="0">
					<el-col :span="8">
						<el-form-item label="产品编码" prop="fittingSkuCode">
							<el-input v-model="addForm.fittingSkuCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="快速编码" prop="quickCode">
							<el-input v-model="addForm.quickCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品名称" prop="fittingSkuName">
							<el-input v-model="addForm.fittingSkuName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="8">
						<el-form-item label="车型" prop="modelCode">
							<el-input v-model="addForm.modelCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="配件类别" prop="fittingTypeCode">
							<popwin-button popKey="POP_FITTINGTYPE" :showName="true"
								:displayName="addForm.fittingTypeName"
								v-model="addForm.fittingTypeCode"></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否显示" prop="isShow">
							<el-switch v-model="addForm.isShow" active-color="#13ce66" inactive-color="#ff4949"
								active-value="Y" inactive-value="N">
							</el-switch>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="8">
						<el-form-item label="包装规格" prop="packageCode">
							<el-input v-model="addForm.packageCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="单位" prop="uomDesc">
							<el-input v-model="addForm.uomDesc" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="包装类别" prop="type">
							<el-select v-model="addForm.type" placeholder="请选择">
								<el-option v-for="item in is_packed" :key="item.code" :label="item.name"
									:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="8">
						<el-form-item label="状态" prop="fittingSkuStatus">
							<el-select v-model="addForm.fittingSkuStatus" placeholder="请选择">
								<el-option v-for="item in stautus" :key="item.code" :label="item.name"
									:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否组装" prop="needToAssemble">
							<el-select v-model="addForm.needToAssemble" placeholder="请选择">
								<el-option v-for="item in yesOrNo" :key="item.code" :label="item.name"
									:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
							<!--<el-input v-model="orderHeader.status" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="组装类型" prop="assembleType">
							<el-select v-model="addForm.assembleType" :disabled="addFormAssembleTypeStatus"
								placeholder="请选择">
								<el-option v-for="item in assembleType" :key="item.code" :label="item.name"
									:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
							<!--<el-input v-model="orderHeader.status" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="8">
						<el-form-item label="系列" prop="type">
							<el-select v-model="addForm.series" placeholder="请选择">
								<el-option v-for="item in series" :key="item.code" :label="item.name"
									:value="item.code">
									<span style="float: left">{{ item.name }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="发布日期" prop="releaseDate">
							<el-date-picker v-model="addForm.releaseDate" type="date" placeholder="选择日期"
								value-format="yyyy-MM-dd">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
						<!-- <el-form-item label="通用组" prop="groupCode">
							<popwin-button popKey="POP_SKU_GROUP" :selectValue="addForm.groupCode"
								v-model="addForm.groupCode"></popwin-button>
						</el-form-item> -->
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="8">
						<el-form-item label="参考价格" prop="price">
							<el-input-number v-model="addForm.price" auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="生产厂家" prop="manufacturer">
							<el-input v-model="addForm.manufacturer" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="材质" prop="materialquality">
							<el-input v-model="addForm.materialquality" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="详细尺寸" prop="def1">
							<el-input v-model="addForm.def1" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="产品备注" prop="fittingSkuRemark">
							<el-input type="textarea" :rows="4" v-model="addForm.fittingSkuRemark"
								auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<div v-show="imagePreview.show" class="transition-box">
			<transition name="el-zoom-in-top">
				<img style="z-index: 9999" v-show="imagePreview.show" :src="imagePreview.src"
					:width="imagePreview.width" :height="imagePreview.height" @click="imagePreview.show = false">
			</transition>
		</div>

		<!--打印标签界面-->
		<el-dialog title="打印标签" :visible.sync="printLabelFormVisible" :close-on-click-modal="false">
			<el-form :model="printLabelForm" label-width="80px" :rules="printLabelFormRules" ref="printLabelForm">
				<el-row :gutter="0">
					<el-form-item label="产品名称" prop="fittingSkuName">
						<el-input v-model="printLabelForm.fittingSkuName" auto-complete="off"></el-input>
					</el-form-item>
				</el-row>
				<el-row :gutter="0">
					<el-form-item label="适用车型" prop="modelCode">
						<el-input v-model="printLabelForm.modelCode" auto-complete="off"></el-input>
					</el-form-item>
				</el-row>
				<el-row :gutter="0">
					<el-form-item label="产品规格" prop="specification">
						<el-input v-model="printLabelForm.specification" auto-complete="off"></el-input>
					</el-form-item>
				</el-row>
				<el-row :gutter="0">
					<el-form-item label="包装数量" prop="packageNum">
						<el-input v-model="printLabelForm.packageNum" auto-complete="off"></el-input>
					</el-form-item>
				</el-row>
				<el-row :gutter="0"><el-form-item label="产品代码" prop="fittingSkuCode">
						<el-input v-model="printLabelForm.fittingSkuCode" auto-complete="off"></el-input>
					</el-form-item></el-row>

				<el-row :gutter="0">
					<el-form-item label="产品图号" prop="drawingNo">
						<el-input v-model="printLabelForm.drawingNo" auto-complete="off"></el-input>
					</el-form-item>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="二维码" prop="qrCode">
							<el-input v-model="printLabelForm.qrCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row :gutter="0" class="printLabelDiv">
					<!-- <el-col :span="16">
						<table>
							<tr>
								<td style="font-size: 20px;">产品名称</td>
								<td style="font-size: 30px;">{{ printLabelForm.fittingSkuName }}</td>
							</tr>
							<tr>
								<td style="font-size: 20px;">适用车型</td>
								<td style="font-size: 30px;">{{ printLabelForm.modelCode }}</td>
							</tr>
							<tr>
								<td style="font-size: 20px;">产品规格</td>
								<td style="font-size: 30px;">{{ printLabelForm.specification }}</td>
							</tr>
							<tr>
								<td style="font-size: 20px;">包装数量</td>
								<td style="font-size: 30px;">{{ printLabelForm.packageNum }}</td>
							</tr>
							<tr>
								<td style="font-size: 20px;">产品代码</td>
								<td style="font-size: 30px;">{{ printLabelForm.fittingSkuCode }}</td>
							</tr>
							<tr>
								<td style="font-size: 20px;">产品图号</td>
								<td style="font-size: 30px;">{{ printLabelForm.drawingNo }}</td>
							</tr>
						</table>
					</el-col> -->
					<el-col :span="8">
						<table>
							<tr>
								<img @click="copyQrCodePic" ref="qrCodePicImg" id="qrCodePicImg" :src="infoQrCodePic">
							</tr>
							<tr>
								<el-button type="primary" @click.native="copyQrCodePic">保存当前方案</el-button>
								<el-button type="primary" @click.native="printSkuLabelDetail">打印标签</el-button>
							</tr>
						</table>
					</el-col>
				</el-row>
			</el-form>

		</el-dialog>

		<div v-show="imagePreview.show" class="transition-box">
			<transition name="el-zoom-in-top">
				<img style="z-index: 9999" v-show="imagePreview.show" :src="imagePreview.src"
					:width="imagePreview.width" :height="imagePreview.height" @click="imagePreview.show = false">
			</transition>
		</div>
		<el-dialog title="excel导入金蝶编码查询产品编码" :visible.sync="excelImportPopWinVisible" :close-on-click-modal="false">
			<el-form :model="excelImportPopWinForm" label-width="80px" ref="excelImportPopWinForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="金蝶编码列名" prop="skuCodeColumnName">
							<el-input v-model="excelImportPopWinForm.skuCodeColumnName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="结果" prop="result">
							<el-input type="textarea" v-model="excelImportPopWinForm.result"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-upload ref="upload" class="upload-demo" drag :data="excelImportPopWinForm"
						:on-success="uploadExcelConnectSuccess" :on-error="uploadExcelConnectFail"
						:before-upload="beforeExcelUplaod" action="/xibin/fittingSku/importSkuCodesByExcel "
						:file-list="excelFileList" multiple list-type="text" :auto-upload="true">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
					</el-upload>
				</el-row>
			</el-form>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import jrQrcode from 'jr-qrcode'
import * as clipboard from "clipboard-polyfill"
import Vue from 'vue'
import NProgress from 'nprogress'
import { getSkuGroupQueryItemByGroupCode } from '../../api/skuGroupApi'
import { getAllModel } from '../../api/modelApi'
import { saveFittingSkuAssemble, getFittingSkuAssemble, getFittingSkuListPage, removeFittingSku, batchRemoveFittingSku, saveFittingSku, getFittingSkuPic, removeFittingSkuPic, getFittingSkuListForInput } from '../../api/fittingSkuApi';
import Table from '../nav1/Table.vue'
var codemaster = require('../../../static/codemaster.json');
var config = require('../../../static/config.json');
export default {
	components: { Table },
	data() {
		return {
			models: [],
			imagePreview: {
				show: false,
				width: 300,
				height: 300,
				src: ''
			},
			showMoreQueryCondition: false,
			imgs: [],
			is_packed: codemaster.WM_IS_PACKED,
			stautus: codemaster.BD_SKU_STATUS,
			series: codemaster.BS_SKU_SERIES,
			filters: {
				releaseDateFm: null,
				releaseDateTo: null,
				fittingSkuCode: '',
				fittingSkuName: '',
				modelCode: '',
				series: '',
				fittingTypeCode: '',
				fittingTypeName: '',
				quickCode: ''
			},
			skus: [],
			assembleSkus: [],
			skuGroupSkus: [],//通用产品
			removeAssembleSkus: [],
			total: 0,
			page: 1,
			size: 10,
			listLoading: false,
			loading: true,
			assembleListLoading: false,
			skuGroupListLoading: false,
			assembleSels: [],
			currentAssembleSkuRow: {},
			sels: [],//列表选中列
			currentRow: {},//当前点击按钮对应的列
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				fittingSkuCode: [
					{ required: true, message: '请输入产品编码', trigger: 'blur' }
				],
				fittingSkuName: [
					{ required: true, message: '请输入产品名称', trigger: 'blur' }
				],
				modelCode: [
					{ required: true, message: '请输入车型', trigger: 'blur' }
				],
				fittingTypeCode: [
					{ required: true, message: '请输入配件类别', trigger: 'blur' }
				]
			},
			//编辑界面数据
			editForm: {
				id: 0,
				fittingSkuCode: '',
				fittingSkuName: '',
				fittingSkuStatus: '',
				fittingSkuRemark: '',
				quickCode: '',
				manufacturer: '',
				materialquality: '',
				packageCode: '',
				uomDesc: '',
				price: '',
				modelCode: '',
				series: '',
				fittingTypeCode: '',
				type: '',
				isShow: '',
				groupCode: '',
				defaultLoc: '',
				minInventory: 0,
				def1: '',
				def2: '',
				def3: '',
				def4: '',
				def5: '',
				assembleType: '',
				needToAssemble: '',
				releaseDate: null
			},

			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				fittingSkuCode: [
					{ required: true, message: '请输入产品编码', trigger: 'blur' }
				],
				fittingSkuName: [
					{ required: true, message: '请输入产品名称', trigger: 'blur' }
				],
				modelCode: [
					{ required: true, message: '请输入车型', trigger: 'blur' }
				],
				fittingTypeCode: [
					{ required: true, message: '请输入配件类别', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {
				id: 0,
				fittingSkuCode: '',
				fittingSkuName: '',
				fittingSkuStatus: '',
				fittingSkuRemark: '',
				quickCode: '',
				manufacturer: '',
				materialquality: '',
				packageCode: '',
				uomDesc: '',
				price: '',
				modelCode: '',
				series: '',
				fittingTypeCode: '',
				type: '',
				isShow: '',
				groupCode: '',
				defaultLoc: '',
				minInventory: 0,
				def1: '',
				def2: '',
				def3: '',
				def4: '',
				def5: '',
				assembleType: '',
				needToAssemble: '',
				releaseDate: null
			},
			printLabelFormVisible: false,//打印标签界面是否显示
			printLabelFormRules: {
			},
			//新增界面数据
			printLabelForm: {
				fittingSkuName: '',
				modelCode: '',
				specification: '',
				packageNum: '',
				fittingSkuCode: '',
				drawingNo: ''
			},
			assembleType: codemaster.WM_ASSEMBLE_TYPE,
			yesOrNo: codemaster.SYS_YES_NO,
			//图片上传
			dialogPicManagerVisible: false,
			activeName: 'picUpload',
			editFormActiveName: 'first',
			fileList: [],
			//Excel上传
			excelImportPopWinVisible: false,
			excelImportPopWinForm: {
				skuCodeColumnName: '',
				result: ''
			},
			excelFileList: [],
			//二维码
			qrCodeUrl: '',
			infoQrCodePic: ''
		}
	},
	computed: {
		btnAssembleSkuGridAddStatus: function () {
			return false;
		},
		addFormAssembleTypeStatus: function () {
			if (this.addForm.needToAssemble === 'Y') {
				return false;
			} else if (this.addForm.needToAssemble === 'N') {
				return true;
			}
		},
		editFormAssembleTypeStatus: function () {
			if (this.editForm.needToAssemble === 'Y') {
				return false;
			} else if (this.editForm.needToAssemble === 'N') {
				return true;
			}
		},
		editFormAssembleSkuTabStatus: function () {
			if (this.editForm.needToAssemble === 'Y') {
				return false;
			} else if (this.editForm.needToAssemble === 'N') {
				return true;
			}
		},
		editFormSkuGroupTabStatus: function () {
			if (this.editForm.groupCode === null || this.editForm.groupCode === '') {
				return true;
			} else if (this.editForm.needToAssemble === 'N') {
				return false;
			}
		}
	},
	methods: {
		formatTime: function (row, column) {
			if (row[column.property] !== null) {
				let unixTimestamp = new Date(row[column.property]);
				return util.formatDate.format(unixTimestamp, "yyyy-MM-dd hh:mm:ss");
			}
		},
		printSkuLabel() {
			let user = JSON.parse(localStorage.getItem("user"));
			window.open(
				config.reportUrl +
				"skuLabel?companyId=" +
				user.companyId +
				"&skuCodes=" +
				this.printLabelForm.fittingSkuCode
			);
		},
		printSkuLabelDetail() {
			let user = JSON.parse(localStorage.getItem("user"));
			window.open(
				config.reportUrl +
				"skuLabelDetail?companyId=" +
				user.companyId +
				"&skuCode=" +
				this.printLabelForm.fittingSkuCode +
				"&skuName=" +
				this.printLabelForm.fittingSkuName +
				"&modelCode=" +
				this.printLabelForm.modelCode +
				"&specification=" +
				this.printLabelForm.specification +
				"&packageNum=" +
				this.printLabelForm.packageNum +
				"&drawingNo=" +
				this.printLabelForm.drawingNo +
				"&qrCode=" +
				this.printLabelForm.qrCode
			);
		},
		printQrCode() {
			let user = JSON.parse(localStorage.getItem('user'));
			// window.open(config.reportUrl+"?fittingSkuCode="+this.currentRow.fittingSkuCode+"&companyId="+user.companyId+"&URL="+"http://www.xbjg.org/productDetails.html?skucode=");
			window.open("http://localhost:8081/xibin/report/report ?url=qrCode" + "&fittingSkuCode=" + this.currentRow.fittingSkuCode + "&companyId=" + user.companyId + "&URL=" + "http://www.xbjg.org/productDetails.html?skucode=");
		},
		printQrCodeSingle() {
			let user = JSON.parse(localStorage.getItem('user'));
			// window.open(config.reportUrl+"?fittingSkuCode="+this.currentRow.fittingSkuCode+"&companyId="+user.companyId+"&URL="+"http://www.xbjg.org/productDetails.html?skucode=");
			window.open("http://localhost:8081/xibin/report/report ?url=qrCodeSingle" + "&fittingSkuCode=" + this.currentRow.fittingSkuCode + "&companyId=" + user.companyId + "&URL=" + "http://www.xbjg.org/productDetails.html?skucode=");
		},
		handleSelect(item) {
			console.log(item);
		},
		querySearch(queryString, cb) {
			var models = this.models;
			var results = queryString ? models.filter(this.createFilter(queryString)) : models;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter(queryString) {
			return (model) => {
				return (model.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
			};
		},
		queryAllModels() {
			let para = { conditions: JSON.stringify({}) }
			getAllModel(para).then((res) => {
				for (let i = 0; i < res.data.length; i++) {
					this.models.push({ value: res.data[i].modelName })
				}
				//NProgress.done();
			}).catch((data) => {
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		handleCurrentAssembleSkuChange: function (currentRow, oldCurrentRow) {
			this.currentAssembleRow = currentRow;

		},
		changePopValueForSkuCode: function (row) {
			this.currentAssembleRow['sskuName'] = row.fittingSkuName;
		},
		handleAssembleSkuDel: function (index, row) {
			if (row.id !== null) {
				this.removeAssembleSkus.push(row);
			}
			this.assembleSkus.splice(index, 1)
		},
		addAssembleSkuHandler: function () {
			this.assembleSkus.push({
				id: '',
				fSkuCode: this.currentRow.fittingSkuCode,
				sSkuCode: '',
				num: 1,
				remark: '',
				creator: '',
				createTime: '',
				modifier: '',
				modifyTime: '',
				rec_ver: '',
				companyId: ''
			});
		},
		showNormalPic(imgNormal) {
			this.imagePreview.show = true;
			this.imagePreview.src = imgNormal.fittingSkuPicUrl;
			this.imagePreview.width = imgNormal.width * (document.documentElement.clientHeight - 60) / imgNormal.height;
			this.imagePreview.height = document.documentElement.clientHeight - 60;
		},
		reset() {
			this.$refs['queryForm'].resetFields();
		},
		showMoreConditionHandler: function () {
			this.showMoreQueryCondition = !this.showMoreQueryCondition;
		},
		formatISPACKED: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_IS_PACKED, row.type);
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getSkus();
		},
		getStatusTagType: function (row) {
			if (row.fittingSkuStatus === 'NEW') {
				return 'success'
			}
		},
		formateType: function (row) {
			return util.getComboNameByValue(codemaster.BD_SKU_STATUS, row.fittingSkuStatus);
		},
		//
		getSkus() {
			let para = {
				page: this.page,
				size: this.size,
				conditions: JSON.stringify(this.filters)
			};


			this.listLoading = true;
			//NProgress.start();
			getFittingSkuListPage(para).then((res) => {
				this.total = res.data.size;
				this.skus = res.data.list;
				this.listLoading = false;
				//NProgress.done();
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		assembleTabClick(tab) {
			if (tab.name === 'second') {
				this.getSkuAssemble()
			} else if (tab.name === 'third') {
				this.getSkuGroupSkus();
			}
		},
		getSkuAssemble() {
			let para = {
				conditions: JSON.stringify({ fSkuCode: this.currentRow.fittingSkuCode })
			};
			this.assembleListLoading = true;
			getFittingSkuAssemble(para).then((res) => {
				this.assembleSkus = res.data.list;
				this.assembleListLoading = false;
			}).catch((data) => {
				this.assembleListLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		getSkuGroupSkus() {
			if (this.currentRow.groupCode === '' || this.currentRow.groupCode === null) {
				return;
			}
			let para = {
				groupCode: this.currentRow.groupCode
			};
			this.skuGroupListLoading = true;
			getSkuGroupQueryItemByGroupCode(para).then((res) => {
				this.skuGroupSkus = res.data;
				this.skuGroupListLoading = false;
				//NProgress.done();
			}).catch((data) => {
				this.skuGroupListLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},

		beforeSaveAssemble: function () {
			for (let i = 0; i < this.assembleSkus.length; i++) {
				if (this.assembleSkus[i].sskuCode === null || this.assembleSkus[i].sskuCode === '') {
					this.$message.error('输入数据不完整');
					return false;
				}
			}
			return true
		},
		saveSkuAssemble: function () {
			if (this.beforeSaveAssemble()) {
				let para = {
					details: JSON.stringify(this.assembleSkus),
					removeDetails: JSON.stringify(this.removeAssembleSkus)
				}
				saveFittingSkuAssemble(para).then((res) => {
					if (res.data.code == 200) {
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
						this.getSkuAssemble();
					} else {
						this.$message.error(res.data.msg);
					}
					//NProgress.done();
				}).catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
			}
		},
		printLabel: function (index, row) {
			this.printLabelFormVisible = true;
			this.currentRow = Object.assign({}, row);
			if (null == row.labelSkuName) {
				// 若标签产品名为空，则说明未设置过标签字段
				this.printLabelForm = Object.assign({}, row);
			} else {
				this.printLabelForm.fittingSkuName = row.labelSkuName;
				this.printLabelForm.modelCode = row.labelModelCode;
				this.printLabelForm.specification = row.labelSpecification;
				this.printLabelForm.drawingNo = row.labelDrawingNo;
				this.printLabelForm.packageNum = row.labelPackageNum;
				this.printLabelForm.fittingSkuCode = row.fittingSkuCode;
			}
			this.printLabelForm.qrCode = config.wxMiniUrl + "?skuCode=" + row.fittingSkuCode;
			var options = {
				padding: 0,
				width: 150,
				height: 150,
				reverse: false,
				background: "#ffffff",
				foreground: "#000000"
			}
			this.infoQrCodePic = jrQrcode.getQrBase64(this.printLabelForm.qrCode, options);
			let myBlob = util.base64ToBlob(this.infoQrCodePic);
			const item = new clipboard.ClipboardItem({
				"image/png": myBlob
			});
			clipboard.write([item]);
		},
		copyQrCodePic: function () {
			// let myBlob = util.base64ToBlob(this.infoQrCodePic);
			// const item = new clipboard.ClipboardItem({
			// 	"image/png": myBlob
			// });
			// clipboard.write([item]);
			let para = Object.assign({}, this.currentRow);
			para.labelSkuName = this.printLabelForm.fittingSkuName;
			para.labelModelCode = this.printLabelForm.modelCode;
			para.labelSpecification = this.printLabelForm.specification;
			para.labelDrawingNo = this.printLabelForm.drawingNo;
			para.labelPackageNum = this.printLabelForm.packageNum;
			saveFittingSku({ fittingSku: JSON.stringify(para) }).then((res) => {
				if (res.data.code == 200) {
					this.$message({
						message: res.data.msg,
						type: 'success'
					});
				} else {
					this.$message.error(res.data.msg);
				}
				this.printLabelFormVisible = false;
				this.getSkus();
			}).catch((data) => {
				this.editLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
			// navigator.clipboard.write([new window.ClipboardItem({ [myBlob.type]: myBlob })]);
		},
		copy: function (index, row) {
			this.addFormVisible = true;
			this.addForm = Object.assign({}, row);
			this.addForm.id = null;
			this.currentRow = this.addForm;
		},
		handleSetNew: function (index, row) {
			this.currentRow = Object.assign({}, row);
			this.currentRow.fittingSkuStatus = 'NEW';
			saveFittingSku({ fittingSku: JSON.stringify(this.currentRow) }).then((res) => {
				if (res.data.code == 200) {
					this.$message({
						message: res.data.msg,
						type: 'success'
					});
				} else {
					this.$message.error(res.data.msg);
				}
				this.getSkus();
			}).catch((data) => {
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		//删除
		handleDel: function (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				NProgress.start();
				let para = { id: row.id };
				removeFittingSku(para).then((res) => {
					this.listLoading = false;
					NProgress.done();

					this.getSkus();
				}).catch((data) => {
					this.listLoading = false;
					util.errorCallBack(data, this.$router, this.$message);
				});
			});
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormActiveName = 'first';
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
			this.currentRow = Object.assign({}, row);
		},
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.addForm = {
				id: 0,
				fittingSkuCode: '',
				fittingSkuName: '',
				fittingSkuStatus: '',
				fittingSkuRemark: '',
				manufacturer: '',
				materialquality: '',
				packageCode: '',
				uomDesc: '',
				price: '',
				modelCode: '',
				series: '',
				fittingTypeCode: '',
				type: '',
				isShow: 'Y',
				groupCode: '',
				defaultLoc: '',
				minInventory: 0,
				def1: '',
				def2: '',
				def3: '',
				def4: '',
				def5: '',
				assembleType: '',
				needToAssemble: 'N'
			};
			this.currentRow = this.addForm;
		},
		handleDelPic: function (idNormal, idZip, fittingSkuCode) {
			let para = { idNormal: idNormal, idZip: idZip, fittingSkuCode: fittingSkuCode }
			removeFittingSkuPic(para).then((res) => {
				this.listLoading = false;
				NProgress.done();
				if (res.data.code == 200) {
					this.$message({
						message: res.data.msg,
						type: 'success'
					});
					this.imgs = [];
					this.convertPicData(res.data);
				} else {
					this.$message.error("删除失败");
				}
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		refreshPics: function (fittingSkuCode) {
			let para = { fittingSkuCode: fittingSkuCode };
			getFittingSkuPic(para).then((res) => {
				this.listLoading = false;
				NProgress.done();
				this.imgs = [];
				this.convertPicData(res);
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		convertPicData: function (res) {
			let normalPics = [];
			let zipPics = [];
			for (let i = 0; i < res.data.length; i++) {
				if (res.data[i].type === 'NORMAL') {
					normalPics.push(res.data[i]);
				} else if (res.data[i].type === 'ZIP') {
					zipPics.push(res.data[i]);
				}
			}
			for (let z = 0; z < normalPics.length; z++) {
				for (let j = 0; j < zipPics.length; j++) {
					if (normalPics[z].fittingSkuPicName === zipPics[j].fittingSkuPicName) {
						this.imgs.push({ 'normal': normalPics[z], 'zip': zipPics[j] });
					}
				}
			}
		},
		//点击图片管理
		handlePicManager: function (index, row) {
			var options = {
				padding: 10,
				width: 256,
				height: 256,
				reverse: false,
				background: "#ffffff",
				foreground: "#000000"
			}
			var imgBase64 = jrQrcode.getQrBase64('http://www.xbjg.org/productDetails.html?skucode=' + row.fittingSkuCode, options);
			this.qrCodeUrl = imgBase64
			this.fileList = [];
			this.currentRow = Object.assign({}, row);
			this.dialogPicManagerVisible = true;
			this.refreshPics(this.currentRow.fittingSkuCode);
		},
		//编辑
		editSubmit: function () {
			let _this = this;
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						NProgress.start();
						let para = Object.assign({}, this.editForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						saveFittingSku({ fittingSku: JSON.stringify(para) }).then((res) => {
							this.editLoading = false;
							NProgress.done();
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
							} else {
								this.$message.error(res.data.msg);
							}
							_this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getSkus();
						}).catch((data) => {
							this.editLoading = false;
							util.errorCallBack(data, this.$router, this.$message);
						});
					});
				}
			});
		},
		//新增
		addSubmit: function () {
			let _this = this;
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						NProgress.start();
						let para = Object.assign({}, this.addForm);

						saveFittingSku({ fittingSku: JSON.stringify(para) }).then((res) => {
							this.addLoading = false;
							NProgress.done();
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
							} else {
								this.$message.error(res.data.msg);
							}
							_this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.getSkus();
						}).catch((data) => {
							this.addLoading = false;
							util.errorCallBack(data, this.$router, this.$message);
						});
					})
				}
			});
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		assembleSelsChange: function (sels) {
			this.assembleSels = sels;
		},
		//批量删除
		batchRemove: function () {
			var ids = this.sels.map(item => item.id).toString();
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				NProgress.start();
				let para = { ids: ids };
				batchRemoveFittingSku(para).then((res) => {
					this.listLoading = false;
					NProgress.done();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getSkus();
				}).catch((data) => {
					this.listLoading = false;
					util.errorCallBack(data, this.$router, this.$message);
				});
			})
		},
		handleClick: function (tab, event) {
			console.log(tab, event);
		},
		//			startUpload : function() {
		//				this.$refs.upload.submit();
		//			},
		openExcelImportPopWin() {
			this.excelImportPopWinVisible = true;
			this.excelImportPopWinForm = {
				skuCodeColumnName: '',
				result: ''
			}
		},
		beforeExcelUplaod: function (file) {
			if (this.excelImportPopWinForm.cutomerCode === '' || this.excelImportPopWinForm.skuCodeColumnName === '') {
				this.$message.error("请填写完整数据！");
				return false;
			}
			return true;
		},
		uploadExcelConnectSuccess: function (res, file, fileList) {
			if (res.code == 0) {
				this.$message.error(res.data.msg);
			} else if (res.code == 200) {
				let result = '';
				for (let i = 0; i < res.data.length; i++) {
					result = result + res.data[i] + '\n';
				}
				this.excelImportPopWinForm.result = result;
				this.$message({
					message: "操作成功",
					type: 'success'
				});
			}
		},
		uploadExcelConnectFail: function (err, file, fileList) {
			this.$message.error("网络连接错误，上传失败！");
		},
		uploadConnectSuccess: function (response, file, fileList) {
			if (response.code == 0) {
				this.$message.error(response.msg);

			} else if (response.code == 200) {
				this.refreshPics(this.currentRow.fittingSkuCode);
			}
		},

		uploadConnectFail: function (err, file, fileList) {
			this.$message.error("网络连接错误，上传失败！");
		}

	},
	mounted() {
		this.queryAllModels();
		this.getSkus();
	}
}

</script>

<style scoped>
.printLabelDiv tr {
	height: 50px;
}

.time {
	font-size: 13px;
	color: #999;
}

.bottom {
	margin-top: 13px;
	line-height: 12px;
}

.button {
	padding: 0;
	float: right;
}

.image {
	width: 100%;
	display: block;
}

.clearfix:after {
	display: table;
	content: "";
}

.clearfix:after {
	clear: both
}

.transition-box {
	text-align: center;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: #000;
	opacity: 1;
	z-index: 4444;
}
</style>