<template>
  <content-field>
    <div class="byr">
      <h1>北邮人论坛</h1>

      <!-- Category Dropdown -->
      <label for="category">选择分类:</label>
      <select v-model="selectedCategory" id="category">
        <option value="">全部</option>
        <option
          v-for="category in categories"
          :key="category.value"
          :value="category.value"
        >
          {{ category.label }}
        </option>
      </select>

      <!-- Search Options -->
      <div>
        <label>
          <input type="checkbox" v-model="searchTitle" />
          搜索标题
        </label>
        <label>
          <input type="checkbox" v-model="searchContent" />
          搜索内容
        </label>
      </div>

      <!-- Search Input and Buttons -->
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="请输入搜索关键词"
        />
        <button @click="onSearch">搜索</button>
        <button @click="toggleContentVisibility">
          {{ showContent ? "隐藏内容" : "显示内容" }}
        </button>
        <button @click="sortResults">
          {{ sortOrder === "desc" ? "按时间升序" : "按时间降序" }}
        </button>
      </div>

      <!-- Pagination Controls -->
      <div v-if="results.length > 0">
        <button :disabled="currentPage === 1" @click="prevPage">上一页</button>
        <span>第 {{ currentPage }} 页</span>
        <button :disabled="results.length < pageSize" @click="nextPage">
          下一页
        </button>
      </div>

      <!-- Search Results Display -->
      <div v-if="results.length > 0">
        <h2>搜索结果</h2>
        <div class="results-container">
          <div
            class="result-item"
            v-for="result in paginatedResults"
            :key="result.id"
          >
            <h3>{{ result.title }}</h3>
            <p>分类: {{ result.category }}</p>
            <p>作者: {{ result.author }}</p>
            <p>发布日期: {{ result.post_time }}</p>
            <p v-if="showContent" class="content">
              {{ result.content.slice(0, 60)
              }}{{ result.content.length > 60 ? "..." : "" }}
            </p>
            <a :href="result.link" target="_blank">查看帖子</a>
          </div>
        </div>
      </div>
    </div>
  </content-field>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ContentField from "@/components/ContentField.vue";

// Category List Initialization
const categories = [
  { value: "Advertising", label: "跳蚤市场" },
  { value: "Friends", label: "缘来如此" },
  { value: "Job", label: "毕业生找工作" },
  { value: "IWhisper", label: "悄悄话" },

  // More categories can be added here
];

const selectedCategory = ref("");
const searchTitle = ref(true); // Default title search checked
const searchContent = ref(false);
const searchQuery = ref("");
const results = ref<
  Array<{
    id: string;
    title: string;
    category: string;
    author: string;
    post_time: string;
    link: string;
    content: string;
  }>
>([]);

const showContent = ref(true); // Control content visibility
const sortOrder = ref("desc"); // Default sort order
const currentPage = ref(1); // Page number for pagination
const pageSize = ref(10); // Number of posts per page, adjustable as needed

// Toggle content visibility without re-fetching
const toggleContentVisibility = () => {
  showContent.value = !showContent.value;
};

// Sort results based on post_time without re-fetching
const sortResults = () => {
  sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
  results.value.sort((a, b) => {
    if (sortOrder.value === "asc") {
      return new Date(a.post_time).getTime() - new Date(b.post_time).getTime();
    } else {
      return new Date(b.post_time).getTime() - new Date(a.post_time).getTime();
    }
  });
};

// Fetch data with ElasticSearch
const onSearch = async () => {
  const fields: string[] = []; // Explicitly define the type as string array
  if (searchTitle.value) fields.push("title");
  if (searchContent.value) fields.push("content");
  type QueryBody = {
    query: {
      bool: {
        must: Array<
          | { multi_match: { query: string; fields: string[] } }
          | { term: { category: string } }
        >;
      };
    };
    sort: Array<{ post_time: { order: string } }>;
    from: number;
    size: number;
  };
  // 然后声明 queryBody
  const queryBody: QueryBody = {
    query: {
      bool: {
        must: [],
      },
    },
    sort: [{ post_time: { order: "desc" } }],
    from: (currentPage.value - 1) * pageSize.value,
    size: pageSize.value,
  };

  // Check if the search query is not empty
  if (searchQuery.value) {
    queryBody.query.bool.must.push({
      multi_match: {
        query: searchQuery.value,
        fields: fields, // This should now be correctly typed
      },
    });
  }

  // Add category filter if selected
  if (selectedCategory.value) {
    queryBody.query.bool.must.push({
      term: { category: selectedCategory.value },
    });
  }

  try {
    const response = await fetch(
      "https://search.wangqianyv.eu.org/byrbbs_posts/_search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    results.value = data.hits.hits.map((hit: any) => ({
      id: hit._id,
      title: hit._source.title,
      category: hit._source.category,
      author: hit._source.author,
      post_time: hit._source.post_time,
      link: hit._source.link,
      content: hit._source.content,
    }));
  } catch (error) {
    console.error("搜索出错：", error);
  }
};
// Pagination functions
const nextPage = () => {
  currentPage.value++;
  onSearch();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    onSearch();
  }
};

// Computed property to get paginated results for the current page
const paginatedResults = computed(() => {
  return results.value;
});
</script>

<style scoped>
.byr {
  padding: 20px;
  line-height: 2;
}

h1 {
  color: #333;
}

label {
  margin-right: 10px;
}

input[type="text"] {
  margin-right: 5px;
}

button {
  margin-top: 10px;
}

h2 {
  margin-top: 20px;
}

/* Three-column layout for results */
.results-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.result-item {
  flex: 1 1 calc(33.33% - 20px); /* Three columns with spacing */
  border: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  text-align: left;
}

h3 {
  font-size: 1.1em;
}

.content {
  text-align: left; /* Ensure left alignment for content */
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
