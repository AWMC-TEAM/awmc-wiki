# 🖼️ Assets 静态资源 API

AWMC 提供了一系列静态资源接口，方便开发者直接获取游戏相关的媒体文件。

## 1. 资源根地址

所有的静态资源均可以通过以下根地址访问：

`https://assets.awmc.cc`


## 2. 资源分类

### 2.1 曲绘资源 (Covers)

获取指定 ID 的曲绘图片。

<ApiDemo 
  baseUrl="https://assets.awmc.cc"
  :isImage="true"
  :options="[
    {
      title: '曲绘资源 (Covers)',
      method: 'GET',
      path: '/covers/:id',
      description: '获取指定 ID 的曲绘图片（需带上 .png 后缀）。',
      params: [
        { name: 'id', type: 'string', required: '必填', desc: '曲绘 ID (含后缀)', value: '0.png' }
      ]
    }
  ]"
/>



## 3. 使用说明

- **无需鉴权**：所有的静态资源接口均可直接匿名访问。
- **缓存建议**：建议在客户端对资源进行缓存，以提高加载速度。
- **文件格式**：目前大部分资源采用 `.png` 格式，请确保在请求时包含正确的文件后缀。
