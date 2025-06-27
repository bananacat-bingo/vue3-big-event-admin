<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import router from '@/router'

const formRef = ref()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const checkDifferent = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码一样'))
  } else {
    callback()
  }
}
const checkSameAsNewPwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('确认密码必须和新密码一样'))
  } else {
    callback()
  }
}
const rules = {
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
}
const userStore = useUserStore()
const submitForm = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('密码修改成功')
  userStore.setUser()
  router.push('/login')
}
const resetFrom = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <PageContainer title="修改密码">
    <el-form ref="formRef" :model="pwdForm" :rules="rules" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetFrom">重置</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
