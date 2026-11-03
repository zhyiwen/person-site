---
title: Flutter 零基础学习：基本组件与开发快捷键
date: 2026-11-03
category: tech
tags: [Flutter, Dart, VS Code]
excerpt: 从前端视角入门 Flutter：基本组件与 Web 的对应关系、一段完整的 Scaffold 示例，以及 VS Code 开发快捷键速查。
---

正在学 Flutter，先把最基础的几个组件和前端已有的知识对上号——学新框架最快的方式就是挂在旧知识上。这篇记录基本组件、一段官方风格的完整示例，和 VS Code 的快捷键速查。

## Basic widgets 基本组件

[**Text**](https://api.flutter-io.cn/flutter/widgets/Text-class.html) -----> `span`

在应用程序中创建一段带样式的文本。

[**Row**](https://api.flutter-io.cn/flutter/widgets/Row-class.html) / [**Column**](https://api.flutter-io.cn/flutter/widgets/Column-class.html) -----> `display: flex; flex-direction: row/column;`

这些弹性组件允许你在水平（`Row`）和垂直（`Column`）方向上创建灵活的布局。这些对象的设计基于网页的弹性盒布局模型。

[**Stack**](https://api.flutter-io.cn/flutter/widgets/Stack-class.html) -----> `position: absolute;`

与线性排列（水平或垂直）不同，`Stack` 组件允许你按照绘制顺序将组件放置在彼此之上。然后，你可以在 `Stack` 的子组件上使用 [Positioned](https://api.flutter-io.cn/flutter/widgets/Positioned-class.html) 组件，使它们相对于堆叠的上、右、下或左边缘进行定位。堆叠基于网页的绝对定位布局模型。

[**Container**](https://api.flutter-io.cn/flutter/widgets/Container-class.html) -----> `div`

`Container` 组件可用于创建矩形视觉元素。容器可以用 [BoxDecoration](https://api.flutter-io.cn/flutter/painting/BoxDecoration-class.html) 进行装饰，例如背景、边框或阴影。`Container` 还可以设置外边距、内边距以及对其尺寸的约束。此外，`Container` 可以使用矩阵在三维空间中进行变换。

## 一段完整的示例

把上面几个组件串起来：`MyAppBar` 用 `Container` + `Row` 搭出一条导航栏，`MyScaffold` 用 `Material` + `Column` 组织页面骨架，`Expanded` 让标题占据中间剩余空间：

```dart
import 'package:flutter/material.dart';

class MyAppBar extends StatelessWidget {
  const MyAppBar({required this.title, super.key});

  // Fields in a Widget subclass are always marked "final".

  final Widget title;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56, // in logical pixels
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(color: Colors.blue[500]),
      // Row is a horizontal, linear layout.
      child: Row(
        children: [
          const IconButton(
            icon: Icon(Icons.menu),
            tooltip: 'Navigation menu',
            onPressed: null, // null disables the button
          ),
          // Expanded expands its child
          // to fill the available space.
          Expanded(child: title),
          const IconButton(
            icon: Icon(Icons.search),
            tooltip: 'Search',
            onPressed: null,
          ),
        ],
      ),
    );
  }
}

class MyScaffold extends StatelessWidget {
  const MyScaffold({super.key});

  @override
  Widget build(BuildContext context) {
    // Material is a conceptual piece
    // of paper on which the UI appears.
    return Material(
      // Column is a vertical, linear layout.
      child: Column(
        children: [
          MyAppBar(
            title: Text(
              'Example title',
              style:
              Theme.of(context) //
              .primaryTextTheme
              .titleLarge,
            ),
          ),
          const Expanded(child: Center(child: Text('Hello, world!'))),
        ],
      ),
    );
  }
}

void main() {
  runApp(
    const MaterialApp(
      title: 'My app', // used by the OS task switcher
      home: SafeArea(child: MyScaffold()),
    ),
  );
}
```

## 🚀 VS Code Flutter 开发快捷键速查表

| 类别 | 功能描述 | Windows / Linux | macOS |
| --- | --- | --- | --- |
| **🛠️ 通用开发** | **打开命令面板**（执行所有 VS Code 和 Flutter 命令的入口） | `Ctrl + Shift + P` | `Cmd + Shift + P` |
| | **快速打开文件**（按文件名搜索） | `Ctrl + P` | `Cmd + P` |
| | **打开/关闭终端** | ``Ctrl + ` `` | ``Ctrl + ` `` |
| | **格式化代码** | `Shift + Alt + F` | `Shift + Option + F` |
| | **代码注释/取消注释** | `Ctrl + /` | `Cmd + /` |
| **✨ Flutter 专属** | **快速修复 / 代码辅助**（显示灯泡菜单，可进行包裹、移除、转换 Widget 等操作） | `Ctrl + .` | `Cmd + .` |
| | **创建 StatelessWidget**（输入缩写后按回车） | `stless` | `stless` |
| | **创建 StatefulWidget**（输入缩写后按回车） | `stful` | `stful` |
| | **创建带动画的 StatefulWidget**（输入缩写后按回车） | `stanim` | `stanim` |
| **▶️ 运行与调试** | **启动调试（有断点）** | `F5` | `F5` |
| | **启动应用（无断点）** | `Ctrl + F5` | `Cmd + F5` |
| | **执行热重载 Hot Reload**（应用运行中） | `Ctrl + F5` | `Cmd + F5` |
| | **执行热重启 Hot Restart**（应用运行中） | `Ctrl + Shift + F5` | `Cmd + Shift + F5` |
| | **停止调试** | `Shift + F5` | `Shift + F5` |

个人最常用的三个：`Cmd + .` 的快速修复（包裹 Widget、移除 Widget 全靠它）、`stless` / `stful` 代码片段，以及热重载——改一行保存立刻见效，这个开发体验和 Vite 的 HMR 是一个路数。
