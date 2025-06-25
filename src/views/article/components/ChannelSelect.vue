<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data
}
getChannelList()
defineProps({
  modelValue: {
    type: [Number, String]
  }
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <el-form-item label="文章分类:" style="width: 300px">
    <el-select
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    >
      <el-option
        v-for="item in channelList"
        :key="item.id"
        :label="item.cate_name"
        :value="item.id"
      ></el-option>
    </el-select>
  </el-form-item>
</template>
