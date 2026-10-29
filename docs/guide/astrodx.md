# AstroDX 谱面导入教程

::: tip 一句话
在 [AWMC-MaiArchive 下载站](https://download.wmc.pub) 下载 **ADX** 格式的谱面：
**安卓**在文件管理器里点一下这个文件，选「用 AstroDX 打开」；**iPhone / iPad** 在「文件」App 里把它移进
「我的 iPhone → AstroDX」文件夹，再打开游戏，就导入好了喵～
:::

本页讲的是怎么把 [download.wmc.pub](https://download.wmc.pub) 上下载的谱面导入
**AstroDX**（手机上的舞萌模拟器，安卓和 iPhone / iPad 都能玩）。教程按 AstroDX 官方文档和下载站实际打出来的包整理；
AstroDX 本身的安装、更新问题请以 [AstroDX 官方 Wiki](https://wiki.astrodx.com/cn) 为准。

## 〇、先看这里：三分钟上手

1. **安装 AstroDX 并打开一次** — 首次打开时游戏会建好自己的文件夹，之后导入才不会出问题。
2. **用系统浏览器打开下载站** — 在 [download.wmc.pub](https://download.wmc.pub) 搜索曲目，点开下载弹窗。
   QQ / 微信内置浏览器下不了文件，请点右上角「在浏览器打开」。
3. **选择「ADX · 无背景视频」** — 体积小，导入快（想要背景视频就选「ADX · 含背景视频」）。
4. **交给 AstroDX** —
   - 安卓：在文件管理器的「下载」目录里点这个 `.adx` 文件，选择「打开方式 → AstroDX」，游戏会自动装好这首歌；
   - iPhone / iPad：在「文件」App 里把 `.adx` 移动到「我的 iPhone（我的 iPad）→ AstroDX」文件夹，
     再打开游戏，等进度条走完即可，详见 [iPhone / iPad 导入](#ios-import)。

单曲下载**不需要人机验证**；按版本批量下载、多选下载才需要验证。

## 一、准备工作

### 1. 安装 AstroDX

- **安卓**：到 [AstroDX GitHub Releases](https://github.com/2394425147/astrodx/releases) 下载最新的
  `.apk` 安装。官方推荐使用最新版本，即使它是 pre-release（预发布）版本。手机提示「禁止安装未知应用」时，到系统设置里给
  浏览器打开「允许安装未知应用」即可。
- **iPhone / iPad**：AstroDX **已在 App Store 上架**，免费下载：
  [App Store · AstroDX](https://apps.apple.com/app/astrodx/id6754203760)（开发者 Kumoumi Interactive）。
  中国区 App Store 也能直接搜到，不用换外区账号。需要 iOS / iPadOS 15.0 及以上。
  以前那套 TestFlight 抢名额的流程已经不需要了，官方现在推荐用 App Store 的稳定版。
  本 Wiki 不提供 `.ipa` 安装包，AstroDX 官方也不发 ipa，请只从 App Store 下载。

安装后**先打开一次游戏**，让它完成初始化，再开始导入。刚装好时游戏里没有任何歌曲，这是正常的。

### 2. 选对下载格式

下载站每首歌都有四个按钮：

| 按钮 | 文件 | 适合 |
|------|------|------|
| **ADX · 无背景视频** | `[DX] 曲名.adx` | ⭐ 推荐。点一下就能导入，体积小 |
| ADX · 含背景视频 | `[DX] 曲名.adx` | 想要游玩时有背景视频（PV），单曲可能有几十 MB |
| ZIP · 无背景视频 | `[DX] 曲名.zip` | 手动导入，或你的手机无法用 AstroDX 打开 `.adx` |
| ZIP · 含背景视频 | `[DX] 曲名.zip` | 同上，带背景视频 |

::: info ADX 和 ZIP 有什么区别？
内容完全一样：`maidata.txt`（谱面）、`track.mp3`（音乐）、`bg.png` / `bg.jpg`（曲绘），
以及「含背景视频」版本里的 `pv.mp4`。`.adx` 其实就是改了后缀名的 `.zip`，区别只在于
AstroDX 能直接打开 `.adx` 并自动安装。
:::

曲名前的 `[DX]` / `[ST]` 是下载站加的谱面类型前缀，用来区分同名的 DX 谱和标准谱；
宴会场谱面不加前缀。

## 二、方法一：ADX 一键导入（推荐）

AstroDX 官方推荐用 ADX 文件导入（需要 Beta 2 Patch 4 及以上版本）。下载站的 `.adx` 可以直接用，
**不需要**再自己压缩或改后缀。

### 安卓

1. 在下载站下载 **ADX** 格式的谱面；
2. 打开手机自带的「文件管理」，进入「下载」(Download) 目录；
3. 点按刚下载的 `.adx` 文件，在弹出的选项里选 **打开方式 → AstroDX**；
4. AstroDX 会自动打开并安装这首歌，回到选曲界面就能看到。

导入后，这首歌在 AstroDX 里的文件夹名是 `[DX] 曲名.曲师`。
**再导入同名的歌会直接覆盖旧版本。**

::: warning 文件管理器里没有「用 AstroDX 打开」？
部分手机（例如小米、部分三星机型）的系统文件管理器不提供这个选项。可以：

- 安装 [ZArchiver](https://play.google.com/store/apps/details?id=ru.zdevs.zarchiver) 或
  [Files（Marc apps）](https://play.google.com/store/apps/details?id=com.marc.files)，用它们点按
  `.adx` 文件再选 AstroDX 打开；
- 或者把 `.adx` 后缀改回 `.zip`，按下面的 [方法二](#manual-import) 手动导入。
:::

### iPhone / iPad {#ios-import}

iOS 上不用「打开方式」，而是**把 `.adx` 放进 AstroDX 的文件夹，游戏下次打开时自动安装**。
这是 [AstroDX 官方 iOS 教程](https://wiki.astrodx.com/en/install/ios) 给的方法。

1. **先打开一次 AstroDX**，然后退出。首次启动后，「文件」App 的「我的 iPhone」（iPad 上是「我的 iPad」）里
   才会出现带 AstroDX 图标的 `AstroDX` 文件夹；
2. 用 **Safari** 打开下载站，下载 **ADX** 格式的谱面，弹出「要下载……吗？」时点「下载」；
3. 打开系统自带的 **「文件」App**，找到刚下载的 `.adx`。Safari 默认存到「iCloud 云盘 → 下载」，
   关了 iCloud 云盘的话在「我的 iPhone → 下载」；也可以点 Safari 地址栏的下载图标，再点文件旁的放大镜直接定位；
4. **长按** `.adx` 文件 → **移动** → 选「我的 iPhone」→ **`AstroDX`** → 点右上角「移动」
   （从 iCloud 云盘移过来时是「拷贝」，效果一样）；
5. 打开 AstroDX，屏幕上会出现安装进度条，走完后到选曲界面就能看到这首歌。

::: warning 放在 AstroDX 文件夹里，不是 levels 里
`.adx` 要直接放进 `AstroDX/` 这一层，**不要**放进里面的 `levels/` 文件夹，否则游戏不会安装它。
如果游戏原本就开在后台、移进去之后没出现进度条，从多任务界面把 AstroDX 划掉再重新打开。
:::

::: tip 一次导入很多首
「文件」App 右上角「⋯ → 选择」可以一次勾选多个 `.adx`，一起「移动」到 `AstroDX` 文件夹，
下次打开游戏会一次性全部装好。
:::

和安卓一样，导入后的文件夹名是 `[DX] 曲名.曲师`，**再导入同名的歌会直接覆盖旧版本**。

## 三、方法二：手动导入 ZIP {#manual-import}

手动导入就是把歌曲文件夹放进 AstroDX 的 `levels` 文件夹里。

### 1. 找到 AstroDX 的文件夹

安卓上的路径是：

```text
Android/data/com.Reflektone.AstroDX/files/
├── levels/          ← 歌曲放这里，一首歌一个文件夹
│   └── [DX] 曲名/
│       ├── maidata.txt   （必需）谱面
│       ├── track.mp3     （必需）音乐，也可以是 track.ogg
│       ├── bg.png        （可选）曲绘，也可以是 bg.jpg
│       └── pv.mp4        （可选）背景视频，H.264 / H.265 编码
└── collections/     ← 分类收藏夹（见第五节）
```

一首歌至少要有 **`maidata.txt` 和音乐文件** 才会被识别。

iPhone / iPad 上是「文件」App 里的 **我的 iPhone（我的 iPad）→ `AstroDX`**，里面同样有 `levels/` 和 `collections/`，
结构和上面一样，不需要任何额外工具。

::: warning 安卓 11 及以上打不开 Android/data？
从安卓 11 起，系统限制了普通应用访问 `Android/data`。可以：

- 使用 [ZArchiver](https://play.google.com/store/apps/details?id=ru.zdevs.zarchiver) 等支持访问 `Android/data` 的文件管理器；
- 使用 [Files（Marc apps）](https://play.google.com/store/apps/details?id=com.marc.files)（AstroDX 官方推荐的变通方法）；
- 安装 [Shizuku](https://shizuku.rikka.app/) 后，配合支持 Shizuku 的文件管理器访问；
- 用数据线连接电脑，通过 MTP（文件传输）直接把文件夹拷进去。
:::

### 2. 解压到「自己的文件夹」里

::: danger 最容易出错的一步
下载站的**单曲 ZIP 解压后直接是四个文件**，外面没有文件夹。请先在 `levels/` 里**新建一个文件夹**
（名字随意，例如 `[DX] 曲名`），再把 ZIP 解压到这个新文件夹里。直接解压到 `levels/` 会让
文件散落一地，游戏读不到。
:::

1. 进入 `Android/data/com.Reflektone.AstroDX/files/levels/`；
2. 新建文件夹，例如 `[DX] 曲名`；
3. 把下载的 `.zip` 解压到这个文件夹里，确认里面直接就是 `maidata.txt`、`track.mp3` 等文件；
4. 重新打开 AstroDX，在选曲界面找到这首歌。

::: info iPhone / iPad 手动导入
iOS 上其实更推荐 [ADX 导入](#ios-import)。一定要手动的话：在「文件」App 里**点一下** `.zip` 就会解压，
得到一个和压缩包同名的文件夹；确认里面直接就是 `maidata.txt`、`track.mp3` 等文件后，
长按这个文件夹 → 移动 → 我的 iPhone → `AstroDX` → **`levels`**，再重新打开游戏。
:::

::: tip 别随便改名或移动
AstroDX 按**文件夹路径**记录成绩和偏移设置。导入后再改名、移动或删除歌曲文件夹，这首歌的
成绩记录就会丢失。
:::

## 四、批量导入一个版本 / 全版本 / 多首歌 {#batch-import}

下载站「批量下载」可以按版本下载、下载全版本，或用「自定义下载歌曲」多选。批量下载需要先完成人机验证。

### 1. 下载到的是什么

- **单个版本**：一个**版本包**，文件名就是版本名，例如 `BUDDiES.adx` / `BUDDiES.zip`；
- **全版本**：不会给一个几十 GB 的大文件，而是**每个版本一个版本包**，一共二十多个。下载弹窗会列出全部版本包，
  可以点「全部开始下载」让浏览器逐个下载（浏览器问「是否允许下载多个文件」时选允许），也可以「复制全部链接」，
  粘贴到 IDM / aria2 / Motrix 等下载工具里批量下载；
- **自定义多选**：一个压缩包，里面是选中的那些歌。

每个版本包都是**一个压缩包，里面每首歌是一个独立的小包**：

- 选 **ADX** 时，`BUDDiES.adx` 里是一堆 `[DX] 曲名.adx`；
- 选 **ZIP** 时，`BUDDiES.zip` 里是一堆 `[DX] 曲名.zip`。

::: warning 不建议用手机流量下载
全版本「含背景视频」三十多 GB，「无背景视频」也有七八 GB，单个版本几百 MB 到几 GB。
请连 Wi-Fi 或有线网络，并确认手机 / 电脑剩余空间够用（解压时还要再占一份）。
:::

### 2. 批量解压

外层的版本包**不能直接用 AstroDX 打开**，要先解压，得到里面每首歌的小包。

::: tip .adx 版本包要先改后缀
`.adx` 其实就是 `.zip`。电脑上的 7-Zip / Bandizip 能直接认，**手机和 macOS 自带的解压要先把后缀改成 `.zip`**
（例如 `BUDDiES.adx` → `BUDDiES.zip`）。ZIP 格式的版本包不用改。
:::

- **电脑（Windows）**：全选下载好的版本包 → 右键 → 7-Zip「解压到各自文件夹」（Bandizip 是「解压到各自的文件夹」），
  每个版本包会解压到同名文件夹；
- **电脑（macOS）**：`.adx` 改成 `.zip` 后，全选双击即可逐个解压；也可以用 Keka / The Unarchiver 直接解；
- **iPhone / iPad**：在「文件」App 里把 `.adx` 版本包重命名为 `.zip`（看不到后缀先打开「显示所有文件扩展名」，见
  [常见问题](#ios-rename)），然后**逐个点一下**解压，会得到同名文件夹；
- **安卓**：安装 [ZArchiver](https://play.google.com/store/apps/details?id=ru.zdevs.zarchiver)，`.adx` 版本包先改名为 `.zip`，
  然后长按多选这些压缩包 →「解压到 ./压缩包名/」。

### 3. 导入 AstroDX

解压出来的是每首歌的 `[DX] 曲名.adx`（或 `.zip`），按单曲的方法导入：

- **安卓**：`.adx` **逐个点按 → 用 AstroDX 打开**；如果是 `.zip`，按方法二逐个新建文件夹再解压到 `levels/`；
- **iPhone / iPad**：进入解压出来的文件夹，「⋯ → 选择 → 全选」，把里面所有 `[DX] 曲名.adx` 一起**移动**到
  「我的 iPhone → `AstroDX`」，再打开 AstroDX，等进度条把整批歌装完。全版本可以一个版本一个版本地移，
  每次移完打开一次游戏让它装好。

## 五、导入分类收藏夹（collections.zip）

下载站顶部的 **「索引下载」** 会给你一个 `collections.zip`，里面是按谱面类型、流派和版本分好的收藏夹：

```text
collections/
├── DX Chart/manifest.json
├── SD Chart/manifest.json
├── 宴会場/manifest.json
├── POPSアニメ/manifest.json
├── maimai DX BUDDiES/manifest.json
└── ……
```

1. 点下载站的「索引下载」，下载 `collections.zip`（免人机验证，体积很小）；
2. 解压，把里面的 `collections/` 文件夹放进 `Android/data/com.Reflektone.AstroDX/files/`
   （iPhone / iPad 是「我的 iPhone → `AstroDX`」），也就是和 `levels/` **放在同一层**（已有 `collections/` 时合并进去即可）；
3. 重新打开 AstroDX，选曲界面就会出现这些收藏夹。

::: tip iPhone / iPad 合并 collections
在「文件」App 里点一下 `collections.zip` 即可解压。`AstroDX` 里已经有 `collections/` 时，
不要整个文件夹移过去替换，而是打开解压出来的 `collections/`，全选里面的子文件夹，再移动到已有的
`AstroDX/collections/` 里，这样你原来的收藏夹不会被覆盖。
:::

收藏夹只是一份「曲目清单」，不包含歌曲本身。**你导入了哪些歌，收藏夹里就显示哪些。**
索引同时兼容两种文件夹名：ZIP 手动导入的 `[DX] 曲名` 和 ADX 导入的 `[DX] 曲名.曲师`，
两种方式导入的歌都能被归类。

## 六、常见问题

### 把 .zip / .rar 放进 levels 了，游戏里没有

AstroDX 不会读压缩包，需要先解压，并确认是「`levels/` → 歌曲文件夹 → `maidata.txt`」这样的结构。
压缩包多套了一层文件夹（`levels/A/A/maidata.txt`）也读不到。

### 有曲绘但没有背景视频

下载时选的是「无背景视频」版本。需要背景视频请重新下载「ADX · 含背景视频」，并确认歌曲文件夹里有 `pv.mp4`。

### 同一首歌出现了两次

用 ADX 导入过一次（文件夹叫 `曲名.曲师`），又用 ZIP 手动导入了一次（文件夹叫 `曲名`），就会出现两份。
删掉其中一个文件夹即可；注意删掉的那份成绩会一起消失。

### 下载按钮点了没反应 / 下载到一半失败

- 请使用系统浏览器（Chrome、Edge、Safari 等），不要在 QQ / 微信内打开；
- 版本包一般已经提前打好，点了就开始下载；某个版本刚更新时要先重新打包，页面顶部的「状态与健康」会显示排队情况，请耐心等待；
- 单曲失败可以直接重试；仍然失败请到 [论坛](https://bbs.wmc.pub/misc/contact) 反馈，附上曲名和下载格式。

### 能放到 SD 卡吗？

AstroDX 目前不支持从 SD 卡读取歌曲，只能放在手机内部存储的上述目录里。

### iPhone：「我的 iPhone」里找不到 AstroDX 文件夹

先从 App Store 安装并**打开一次** AstroDX，再回到「文件」App 的「我的 iPhone」（iPad 上是「我的 iPad」）。
左上角显示的是「iCloud 云盘」的话，点返回切到「浏览」页，在「位置」里选「我的 iPhone」。

### iPhone：改不了后缀 / 看不到 .adx、.zip 后缀 {#ios-rename}

在「文件」App 右上角点 **⋯ → 显示选项**（iOS 26 上也可以点四个方块的「显示选项」按钮），打开
**「显示所有文件扩展名」**，之后长按文件 → 重命名就能改后缀。实在改不了后缀时，按 AstroDX 官方的说法，
把文件命名成 `名字.adx.zip` 也能被识别。下载站单曲的 `.adx` 本来就是对的后缀，不用改。

### iPhone：在微信 / QQ 里收到的 .adx 怎么导入？

在聊天里点开文件 → 右上角「⋯」→「用其他应用打开」→ **存储到「文件」**，保存位置直接选
「我的 iPhone → AstroDX」，再打开游戏即可。从电脑传文件可以用 AirDrop（Mac）或
[LocalSend](https://localsend.org/)（Windows / Linux），收到后同样移进 `AstroDX` 文件夹。

## 相关链接

- 谱面下载站：[download.wmc.pub](https://download.wmc.pub)
- 在线谱面预览：[谱面预览](/dev/chart-preview)
- AstroDX 官方 Wiki：[wiki.astrodx.com](https://wiki.astrodx.com/cn)
- AstroDX App Store 页面：[AstroDX](https://apps.apple.com/app/astrodx/id6754203760)
- AstroDX 官方安卓教程（中文）：[安卓安装教程](https://wiki.astrodx.com/cn/install/android)
- AstroDX 官方 iOS / iPadOS 教程（英文，比中文版新）：[iOS/iPadOS](https://wiki.astrodx.com/en/install/ios)
- AstroDX ADX 包结构说明：[ADX Archive Details](https://astrodx.notion.site/ADX-Archive-Details-a8346048819a40b18f0a6c014c19b0b3)
- AstroDX 收藏夹格式说明：[Collection Manifest Details](https://astrodx.notion.site/Collection-Manifest-Details-8f966de6971748e0ac01c0a0a6054594)
