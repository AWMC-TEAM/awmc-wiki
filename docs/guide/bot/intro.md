# AWMC BOT 基础教程

::: danger 功能维护通知
**部分功能维护中**，预计于 **6 月 19 日 23:00** 结束。

详情请查阅：[AWMC 论坛公告](https://awmc.cc/threads/179/)
:::

::: info
如果您有详细教程，欢迎通过文章底部的的 GitHub编辑 递交Pull Request！
:::

::: tip
加入QQ群参与交流 [1072033605](https://qm.qq.com/q/7157yt6n6w)
:::

::: warning
为保证机器人连续性使用，建议您加入我们的[KOOK频道](https://kook.vip/olowSD)
:::

## 绑定BOT

1. 在使用maiBot任何功能前，建议使用`maibind`指令绑定。

2. 在群内输入上述指令按照提示操作

## 上传B50

1. 在使用上传B50时，请保证你已经绑定水鱼或落雪。

::: warning
在绑定查分器之前，请先使用`maibind`指令绑定舞萌账号。
:::

绑定水鱼请使用`maibindfish`，绑定落雪请使用`maibindlx`。

水鱼需要准备好导入Token [https://maimai.diving-fish.com/](https://maimai.diving-fish.com/) ，落雪需要好友码 [https://maimai.lxns.net/user/profile](https://maimai.lxns.net/user/profile)

![diving-fish-1.png](/images/diving-fish-1.png)
![lx-1.png](/images/lx-1.png)

确保权限打开，落雪需要在 https://maimai.lxns.net/user/settings 的隐私设置中全部放行。

2. 输入`maiu`开始上传到水鱼，`maiul`上传到落雪，`maiua`全部上传。

## KOOK/QQ 绑定

如果您在QQ/KOOK已经绑定过AWMC通行证（又称舞萌账号），可以通过`bind`指令对QQ和KOOK的数据互通！

### 确认原平台和目标平台

在执行`bind`前，请先确认你原本包含数据的平台。比如我原来在QQ绑定的，我需要同步我的数据到KOOK。**那么QQ就是原平台，KOOK就是目标平台。**

### 发送bind

在你需要同步的**目标平台**发送`bind`。

```示例
例如: 原来在QQ绑定的，需要同步数据到KOOK。
平台: KOOK
您: bind
AWMC BOT: Bind 指令可用于在多个平台间绑定用户数据。绑定过程中，原始平台的用户数据将完全保留，而目标平台的用户数据将被原始平台的数据所覆盖。
					请确认当前平台是你的目标平台，并在 5 分钟内使用你的账号在原始平台内向机器人发送以下文本：
					koishi/114514
					绑定完成后，你可以随时使用「bind -r」来解除绑定状态。
```

这时候，请在**原始平台**输入`koishi/114514`（当然这个数字会变，按照机器人说的来）

```示例
例如: 原来在QQ绑定的，需要同步数据到KOOK。
平台: QQ
您：koishi/114514
AWMC BOT: 令牌核验成功！下面将进行第二步操作。
					请在 5 分钟内使用你的账号在目标平台内向机器人发送以下文本：
					koishi/258000
					注意：当前平台是你的原始平台，这里的用户数据将覆盖目标平台的数据。
```

最后，前往KOOK输入一次在QQ得到的验证码

```
例如: 原来在QQ绑定的，需要同步数据到KOOK。
平台: KOOK
您: koishi/258000
AWMC BOT: 账号绑定成功！
```

至此您的权限，信息全部同步。

## FAQ

* 查询的用户不存在或无数据

确保在水鱼个人资料中填写了**正确的QQ号**，并关闭“**禁止其他人查询我的成绩**”。
绑定成功后如果没有数据！那么请执行一次`maiu`

* 传分显示登录失败

账号还在机台登陆或小黑屋。

* B50显示的分数是整数/不准确

确保在水鱼个人资料中关闭了“**对非网页查询的成绩使用掩码**”。然后重试。
