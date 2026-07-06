---
title: "Operate With Keyboard"
date: 2026-07-06
tags:
  - helper/keyboard shortcut
  - helper/mac
excerpt: "Some useful apps and vscode settings that make mac easier to use, even than Stage Manager"
---


> 由于 ai, agent 等工具已经足够好用, 这里主要说明的是设置思路
> 如果你只是想了解 mac 的设置, 可以只看第 __Manage Mac With Keyboard__(不用任何 vim 基础)

## From Vim & Tmux

> 这一块是一些废话, 毕竟现在大家都喜欢 GUI, 但这类基于 terminal 的 clean 的文本编辑器具有的将一切操作变为直觉的能力, 让我更专注于内容, 这也是后面我去探索的原因

最早接触 vim 其实是因为 csdiy 中的这篇 [教程](https://csdiy.wiki/en/%E5%BF%85%E5%AD%A6%E5%B7%A5%E5%85%B7/Vim/), 学 vim 是因为服务器上难免会用到不得不学. 
但习惯之后发现, 如果在操作的时候只用键盘, 特别是只用处于键盘中心的键, 那必然比鼠标或者边缘键盘的穿插使用更快; 并且 vim 支持对常用操作的自定义快捷键封装. 这种将一些常用操作变成直觉式的键盘操作的设计思路十分优美.
而接触 tmux, 则是由于厌倦了 terminal 一个窗口只支持一个 activity, 这完全是对于操作系统能力的退化, 并且已经习惯了 neovim(也是一个类 vim 的编辑器) 中的分屏, 分活动区的操作, 就想着在 terminal 中是否有好用的插件, 最后找到了tmux. 

> 如果你对 tmux 和 neovim 的设置感兴趣, 可以看看下面两个视频:
> [neovim](https://www.josean.com/posts/how-to-setup-neovim-2024)
> [tmux](https://www.youtube.com/watch?v=U-omALWIBos)

而将一切操作变为直觉, 说白了设计一些简单的快捷键, 上面两个软件是怎么做的呢? 

- 模式
- 前缀键


这两个设计不但能让我们复用一些真正的舒服的键, 整合相似的快捷键, 同时还能很好的规避快捷键的冲突


## Manage Mac With Keyboard

那么当我们从文本编辑器推广到 GUI, 也能通过一些软件和插件实现操作系统级别的 vim 吗?

根据使用经验, 大致有以下频繁需要鼠标的几类操作

- 打开某软件
- 全屏, 放缩为左半屏等窗口管理操作
- 在某软件的多个窗口间切换

[教程](https://youtu.be/DBifQv9AYhc?si=Xva-LBOWSLwpSmHV)

一般来说, 会把左边的大写锁定或者中/英键绑成superkey, 同时可以点按绑成 esc, 你可以抄我的设置

```
{
    "description": "CapsLock to Hyper/Escape",
    "manipulators": [
        {
            "from": {
                "key_code": "caps_lock",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                {
                    "key_code": "right_shift",
                    "lazy": true,
                    "modifiers": ["right_command", "right_control", "right_option"]
                }
            ],
            "to_if_alone": [
                {
                    "key_code": "escape",
                    "lazy": true
                }
            ],
            "type": "basic"
        },
        {
            "description": "ESC equal to CapsLock",
            "from": {
                "key_code": "escape",
                "modifiers": {
                    "mandatory": ["right_command", "right_control", "right_shift", "right_option"],
                    "optional": ["caps_lock"]
                }
            },
            "to": [
                {
                    "key_code": "caps_lock",
                    "modifiers": ["left_control"]
                }
            ],
            "type": "basic"
        },
        {
            "description": "Language switch",
            "from": {
                "key_code": "spacebar",
                "modifiers": { "mandatory": ["right_command", "right_control", "right_shift", "right_option"] }
            },
            "to": [
                {
                    "key_code": "spacebar",
                    "modifiers": ["left_control"]
                }
            ],
            "type": "basic"
        }
    ]
}
```

## To Vscode

> 在 Vscode 中自定义一些快捷键, 装 vim 插件似乎有些不伦不类, 但不可否认的是 vscode 的生态很好, 很多你需要在 neovim + mason 中不断调设置的内容, 在 vscode 中只要装一个插件就可以解决
> 那么自然的, 与其在 neovim 中半造轮子, 不如转投 vscode. 与此同时尽可能在 vscode 中尽可能的做一些设置, 让常用的操作变为直觉

我用到的插件:

[Vim](https://open-vsx.org/extension/vscodevim/vim): 主要是让 editoer 内部变为 vim 编辑器

[VSpaceCode](https://vspacecode.github.io/docs/): 但是这个插件其实不太有用, 基本我只用到了其摁两个空格取代 shift+command+P 这一个快捷键 和 ctrl+j, ctrl+k上下选择, ctrl+L 选中

一些默认的快捷键, 可以让你的整个 vscode 只有 editor:
- command+B 开关左边侧栏, option+command+B 开关右边侧栏
- ctrl + ` 打开关闭 terminal

一些自定义的快捷键(主要借鉴了 tmux 的一些快捷键):

主要是管理editor, 以及editer 的 group

```js
{
  "key": "ctrl+l",
  "command": "workbench.action.nextEditor"
}

{
  "key": "ctrl+h",
  "command": "workbench.action.previousEditor"
}
```

![alt text](image.png)
