<template>
  <content-field>
    <a-upload
      class="upload-windows"
      draggable
      :action="appConfig().apiUrl"
      :file-list="filelist"
      @before-remove="beforeRemove"
      @before-upload="beforeUpload"
      @success="handleSuccess"
      list-type="picture"
      show-preview-button
      :show-remove-button="false"
    >
      <template #extra-button="{ fileItem }">
        <a-tooltip content="复制链接">
          <a-button class="transparent-button" @click="copyLink(fileItem)">
            <template #icon>
              <icon-copy />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip content="复制 Markdown 链接">
          <a-button
            class="transparent-button"
            @click="copyMarkdownLink(fileItem)"
          >
            <template #icon>
              <icon-attachment />
            </template>
          </a-button>
        </a-tooltip>
      </template>
    </a-upload>
  </content-field>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ref } from "vue";
import { FileItem, Modal } from "@arco-design/web-vue";
import appConfig from "@/global/globalV";
import ContentField from "@/components/ContentField.vue";

@Options({
  methods: {
    appConfig() {
      return appConfig;
    },
  },
  components: { ContentField },
})
export default class PhotoBedView extends Vue {
  filelist = ref([]);

  beforeUpload(file: FileItem) {
    console.log("Before Upload:", file);
    // 可以在这里对文件进行预处理，比如检查文件类型或大小
    return true;
  }

  handleSuccess(file: FileItem) {
    console.log("File upload success:", file);
    // 文件上传成功后的回调
  }

  handleError(file: FileItem) {
    console.error("File upload error:", file);
    // 文件上传失败后的回调
  }

  copyLink(file: FileItem) {
    this.copyToClipboard(appConfig.appName + file.response.uid);
    this.$message.info("链接复制成功");
  }

  async copyToClipboard(data: string) {
    console.log(data);
    try {
      // 使用 await 等待 writeText 操作完成
      // 安全域名才可以访问
      await navigator.clipboard.writeText(data);
    } catch (err) {
      // 捕获并处理错误
      alert("Failed to copy text: " + err);
    }
  }

  copyMarkdownLink(file: FileItem) {
    const md = "![](" + appConfig.appName + file.response.uid.toString() + ")";
    this.copyToClipboard(md);
    this.$message.info("md复制成功");
    // 文件上传失败后的回调
  }

  beforeRemove(file: FileItem) {
    console.log("Before Remove:", file);
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "确认删除",
        content: `确认删除文件 ${file.name}？`,
        onOk: () => {
          return resolve(true);
        },
        onCancel: () => reject(),
      });
    });
  }
}
</script>
<!--// %才可以自动扩展-->

<style scoped>
.upload-windows {
  width: 80%;
  height: 100%;
  margin: 200px auto;
}

.transparent-button {
  margin-left: 10px;
}

.upload-windows /deep/ .arco-upload-drag {
  margin-top: 10px;
  height: 100px !important;
  align-content: center;
}
</style>
