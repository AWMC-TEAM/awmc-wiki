# 更新日志

## 2026 年 5 月

### 2026/05/27
AWMC 版本号 `RELEASE-20260527 V26.5.19`
<Badge type="tip" text="功能追加" />

- 新增 `wife` 表情包生成功能

<Badge type="danger" text="修复" />

- 修复定数错误与浮点数精度问题
- 修复宴会场被统计入 B50 的问题
- 修复其他宴会场相关问题

AWMC 版本号 `RELEASE-20260527 V26.5.18`
<Badge type="tip" text="功能追加" />

- 新增 `dx2026b35` — 支持查询新版本 PRiSM 的 B35 信息

<Badge type="danger" text="修复" />

- 修复定数异常
- 修复宴会场被统计到 `dx2026b50` 中的问题

AWMC 版本号 `BETA-20260527 V26.5.17`
<Badge type="tip" text="功能追加" />

- 新增 `dx2026b35` — 支持查询新版本 PRiSM 的 B35 信息

### 2026/05/25
AWMC 版本号 `RELEASE-20260525 V26.5.16`
<Badge type="tip" text="功能追加" />

- `koishi-plugin-maibot` 1.9.9
  - 防小号绕过冷却机制：绑定时检查同 maiUid 是否已被其他 Bot 用户绑定，警告但允许继续（持有 SGID 证明所有权）
  - 冷却共享：同一游戏账号的所有 Bot 用户共享冷却计时（新增 `maiuid:<maiUid>` 共享键）
  - 超过 2 个绑定时拦截有冷却的命令，提示用户解绑多余账号

<Badge type="danger" text="修复" />

- `koishi-plugin-maibot` 1.9.8
  - 修复 `maibypass` 失效问题：补全 `koishi:<aid>` 统一键，能正确清除以统一键存储的冷却记录
  - `/mai管理员设置个人优先` 参数可省略，缺失时进入交互式（依次询问目标用户、时长）
  - `/mai管理员设置群组优先` 参数可省略，缺失时进入交互式（群内可发 `0` 使用当前群）

### 2026/05/24
AWMC 版本号 `BETA-20260524 V26.5.15`
<Badge type="danger" text="修复" />

- 修复 b50 锐评调用生成类 AI 不会审核输出内容

### 2026/05/23
AWMC 版本号 `RELEASE-20260523 V26.5.13`
<Badge type="tip" text="功能追加" />

- API 新增端点 `/v1/delete_score_manual`
- Bot 新增删除成绩功能

AWMC 版本号 `BETA-20260523 V26.5.14`
<Badge type="tip" text="功能追加" />

- 新增 PC (Play Count) 游玩次数统计功能
  - `更新pc数` — 引导扫码拉取游玩次数数据
  - `pc50` — B50 按游玩次数排序，卡片右下角显示 pc:xx
  - `pca50` — 无视 B35/B15 分组的紧凑版 PC 排序
  - `我的pc数` — 总游玩次数 + 最多的 15 首
  - `pc数 <歌名/ID>` — 查询某首歌游玩次数
  - `pc排行` — 群内用户按总游玩次数排名

AWMC 版本号 `BETA-20260523 V26.5.13`
<Badge type="danger" text="修复" />

- 暂时关闭舞里程功能
- 修复发票 API

### 2026/05/22
AWMC 版本号 `BETA-20260522-C2 V26.5.13`
<Badge type="danger" text="修复" />

- 修复机器人问题

AWMC 版本号 `BETA-20260522 V26.5.12`
<Badge type="tip" text="功能追加" />

- 新增 `mai上传乐曲成绩` 功能
- 新增 `mai获取收藏品` 功能

### 2026/05/20
AWMC 版本号 `RELEASE-20260520 V26.5.10`
<Badge type="warning" text="优化" />

- 服务器升级为物理机，提供极致的性能体验
- 修复了部分已知问题

- 你好我也想要个对象求分配。

### 2026/05/19
AWMC 版本号 `RELEASE-20260519 V26.5.7`
<Badge type="warning" text="变更通知" />

- Wiki、站点配置与开发者文档中的**对外示例链接**，统一展示为 **`awmc.cc` 及其子域**（如 `api.awmc.cc`、`status.awmc.cc`、`store.awmc.cc`、`wiki.awmc.cc` 等）。
- **兼容说明**：若你的书签或自建集成使用过其它域名后缀，请以 **`*.awmc.cc`** 为准并及时更新。


### 2026/05/17
AWMC 版本号 `RELEASE-20260517 V26.5.6`
<Badge type="tip" text="功能追加" />

- 新增了**520**这个特殊的暧昧的小情侣的对于神秘歌曲**Love You**的游玩次数的统计 （你好我也想要个对象求分配。）
- 新增域名 `wmc.pub`。我们做了个神秘的东西。
  

### 2026/05/14
AWMC 版本号 `BETA-20260514 V26.5.5`
<Badge type="tip" text="功能追加" />

- 支持了不同等级和难度的b50查询 比如 `13b50` `白13b50`等。
- 完全测试了 今日吃分推荐 根据最近的数据自动推荐。本功能会根据您的游玩自动推荐较为合适的铺面。
- 支持锐评你的b50，触发指令`锐评一下`。

<Badge type="danger" text="修复" />

- 修复了部分KALEIDXSCOPE网页中的问题
- 修复了KOOK机器人掉线的问题。
- 修复了由于DNS污染跳转到黄色网站的问题。
- 修复了网页加载异常卡顿问题。
- 修复API站点无法登陆的问题。
- 修复STAT无法获取数据的问题。

<Badge type="warning" text="优化" />

- 优化部分情况下使用发票指令造成的小黑屋。
- 优化生成体验和交互。
- Status页面移除了对NET的检测。

## 2026 年 4 月
### 2026/04/04
AWMC 版本号 `RELEASE-20260403 V26.4.03`
<Badge type="danger" text="修复" />

- 修复了QQ机器人无法渲染图片的问题。
- 修复了由于容器化导致的机器人协议端数据丢失。
- 修复了“我在群里有多菜”功能

### 2026/04/03
AWMC 版本号 `RELEASE-20260403 V26.4.03`
<Badge type="danger" text="修复" />

- 修复了商城支付接口出错的问题。
- 修复了KOOK机器人掉线的问题。
- 修复KALEIDXSCOPE页面上的数据的问题。

<Badge type="warning" text="优化" />

- 优化了渲染速度。
- 优化部分情况下使用发票指令造成的小黑屋。
