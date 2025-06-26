<script setup>
import PageContainer from '@/components/PageContainer.vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { artDelService, artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'

const articleList = ref([])
const total = ref(0)
const loading = ref(false)
const articleEditRef = ref()
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data
  total.value = res.total
  loading.value = false
}
getArticleList()
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
const onAddArticle = () => {
  articleEditRef.value.open({})
}
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确定要删除该文章吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}
const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <el-form inline>
      <el-form-item label="文章分类:" style="width: 300px">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:" style="width: 300px">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="articleList"
      v-loading="loading"
      :cell-style="{ padding: '20px 0' }"
    >
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" underline="never">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    >
    </el-pagination>
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
