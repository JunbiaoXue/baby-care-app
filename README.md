# Baby Care App 👶

宝宝护理记录 App - 使用 Vite + Vue 3 + Capacitor 构建的移动应用。

## 功能特点

- 宝宝日常护理记录（喂养、尿布、睡眠等）
- 数据统计分析
- 支持 Android/iOS 双平台

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5
- **移动桥接**: Capacitor 5
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建 Web 资源
npm run build
```

## 添加 Android 平台

```bash
# 添加 Android 平台
npx cap add android

# 同步到 Android
npx cap sync android

# 打开 Android Studio
npx cap open android
```

## 添加 iOS 平台（macOS only）

```bash
# 添加 iOS 平台
npx cap add ios

# 同步到 iOS
npx cap sync ios

# 打开 Xcode
npx cap open ios
```

## GitHub Actions 自动构建

项目配置了 GitHub Actions 工作流，推送到 main 分支时自动构建 APK：

1. 位于 `.github/workflows/android-build.yml`
2. 自动安装 Android SDK 并构建 debug APK
3. 构建产物上传为 Artifacts，可直接下载

### 触发构建

- **自动触发**: 推送 `src/` 或 `android/` 目录的更改到 main 分支
- **手动触发**: 在 GitHub 仓库页面点击 "Run workflow"

### 下载 APK

构建完成后，在 Actions 页面下载 artifact: `baby-care-app.apk`

## APK 输出路径

- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`

## 注意事项

1. 首次运行 `npx cap add android` 会初始化 Android 项目
2. 如需自定义应用图标，将对应分辨率的图片放入 `android/app/src/main/res/drawable-*/` 目录
3. release 构建需要配置签名密钥