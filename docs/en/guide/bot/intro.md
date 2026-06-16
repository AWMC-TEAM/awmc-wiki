# AWMC BOT Basic Tutorial

::: danger Maintenance Notice
**Some features are currently under maintenance**, expected to end on **June 19 at 23:00**.

For details, see: [AWMC Forum Announcement](https://awmc.cc/threads/179/)
:::

::: info
If you have a detailed tutorial to contribute, feel free to submit a Pull Request via the GitHub edit link at the bottom of the page!
:::

::: tip
Join the QQ group for discussion: [1072033605](https://qm.qq.com/q/7157yt6n6w)
:::

::: warning
To ensure continuous bot availability, we recommend joining our [KOOK server](https://kook.vip/olowSD)
:::

## Binding the BOT

1. Before using any maiBot features, it is recommended to bind your account using the `maibind` command.

2. Enter the above command in the group and follow the prompts.

## Uploading B50

1. Before uploading B50, make sure you have already bound Diving Fish or Lxns.

::: warning
Before binding a score tracker, please first use the `maibind` command to bind your maimai account.
:::

To bind Diving Fish, use `maibindfish`. To bind Lxns, use `maibindlx`.

For Diving Fish, prepare your import Token from [https://maimai.diving-fish.com/](https://maimai.diving-fish.com/). For Lxns, you need your friend code from [https://maimai.lxns.net/user/profile](https://maimai.lxns.net/user/profile).

![diving-fish-1.png](/images/diving-fish-1.png)
![lx-1.png](/images/lx-1.png)

Make sure permissions are enabled. For Lxns, you need to allow all privacy settings at https://maimai.lxns.net/user/settings.

2. Enter `maiu` to upload to Diving Fish, `maiul` to upload to Lxns, or `maiua` to upload to all.

## KOOK/QQ Binding

If you have already bound your AWMC Passport (also known as maimai account) on QQ/KOOK, you can use the `bind` command to sync data between QQ and KOOK!

### Confirm Source and Target Platforms

Before executing `bind`, first confirm which platform originally contains your data. For example, if you originally bound on QQ and need to sync your data to KOOK, **then QQ is the source platform and KOOK is the target platform.**

### Send bind

Send `bind` on the **target platform** where you want to sync data to.

```Example
Example: Originally bound on QQ, need to sync data to KOOK.
Platform: KOOK
You: bind
AWMC BOT: The bind command can be used to bind user data across multiple platforms. During the binding process, the source platform's user data will be fully preserved, while the target platform's user data will be overwritten by the source platform's data.
          Please confirm the current platform is your target platform, and within 5 minutes, use your account on the source platform to send the following text to the bot:
          koishi/114514
          After binding is complete, you can use "bind -r" at any time to unbind.
```

Then, enter `koishi/114514` on the **source platform** (the number will vary, follow the bot's instructions):

```Example
Example: Originally bound on QQ, need to sync data to KOOK.
Platform: QQ
You: koishi/114514
AWMC BOT: Token verification successful! Proceeding to step two.
          Please within 5 minutes, use your account on the target platform to send the following text to the bot:
          koishi/258000
          Note: The current platform is your source platform. User data here will overwrite the target platform's data.
```

Finally, go to KOOK and enter the verification code received on QQ:

```
Example: Originally bound on QQ, need to sync data to KOOK.
Platform: KOOK
You: koishi/258000
AWMC BOT: Account binding successful!
```

Your permissions and information are now fully synced.

## FAQ

* **User not found or no data**

Make sure you have entered the **correct QQ number** in your Diving Fish profile, and disabled "**Prohibit others from querying my scores**".
If there's no data after successful binding, please run `maiu` once.

* **Upload shows login failed**

Your account is still logged in at an arcade machine or is in a cooldown period.

* **B50 shows integer scores / inaccurate**

Make sure you have disabled "**Use mask for non-web query scores**" in your Diving Fish profile. Then retry.
