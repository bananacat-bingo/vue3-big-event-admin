<script setup>
import { ref, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artEditService,
  artGetDetailService,
  artPublishService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)
const defaultForm = {
  id: '',
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const formModel = ref({
  ...defaultForm
})
const formRef = ref()
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    {
      pattern: /^\S{1,15}$/,
      message: '标题必须是 1-15 位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  cover_img: [{ required: true, message: '请上传文章封面', trigger: 'change' }],
  content: [
    {
      required: true,
      message: '请输入文章内容',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value || value.replace(/<[^>]*>/g, '').trim() === '') {
          callback(new Error('请输入文章内容'))
        } else {
          callback()
        }
      }
    }
  ]
}
const imgUrl = ref('')
const editorRef = ref('')
const onContentChange = () => {
  formRef.value.clearValidate(['content'])
}
const onContentBlur = () => {
  formRef.value && formRef.value.validateField('content')
}
const emit = defineEmits(['success'])
const open = async (row) => {
  visibleDrawer.value = true
  formModel.value.id = row.id
  if (!row.id) {
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    formRef.value && formRef.value.clearValidate()
    nextTick(() => {
      editorRef.value.setHTML('')
    })
  } else {
    const res = await artGetDetailService(row.id)
    formModel.value = res.data
    imgUrl.value = baseURL + formModel.value.cover_img
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  }
}
async function imageUrlToFile(url, fileName) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })
    const file = new File([blob], fileName, { type: blob.type })
    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
  formRef.value.clearValidate(['cover_img'])
}
const onPublish = async (state) => {
  formModel.value.state = state
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (!formModel.value.id) {
    await formRef.value.validate()
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
  } else {
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  }
}
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <el-form
      :rules="rules"
      :model="formModel"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
            @update:content="onContentChange"
            @blur="onContentBlur"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">{{
          formModel.id ? '修改' : '发布'
        }}</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
