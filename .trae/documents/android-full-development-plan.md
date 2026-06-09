# ISDB-APP Android 开发计划

## 1. 概要

### 当前状态
- **主应用**: `android/ISDBAPP` (React Native 0.76.9)
- **已完成**: 导航系统、登录/注册、Onboarding 引导流程、UI 组件库
- **待实现**: Swipe、Matches、Projects、Profile 编辑、Groups 群组功能
- **待合并**: ISDBAPPv2 的改进（react-native-url-polyfill、完整配置）

### 目标
将 `android/ISDBAPP` 打造成完整的移动应用，包含 Web 版本（Insane-Dream-Builder）的所有核心功能。

---

## 2. 阶段一：项目整理与合并

### 2.1 合并 ISDBAPPv2 的改进
**文件**: `android/ISDBAPP/package.json`
- 添加 `react-native-url-polyfill` 依赖
- 添加 devDependencies 中的 React Native 配置包
- 统一 TypeScript 版本为 `5.6.3`

### 2.2 更新 Supabase 配置
**文件**: `android/ISDBAPP/src/config/supabase.ts`
- 使用 ISDBAPPv2 的硬编码配置（确保与主项目一致）

### 2.3 更新 package.json scripts
- 添加 `typecheck` 脚本

### 2.4 清理冗余目录
- 删除 `android/ISDBAPP-new/`
- 删除 `android/ISDBAPPv2/`

---

## 3. 阶段二：核心功能实现

### 3.1 Swipe 滑动匹配功能
**文件**: `android/ISDBAPP/src/app/swipe.tsx`

需要实现：
- 使用 `react-native-gesture-handler` 和 `react-native-reanimated` 实现卡片滑动
- 从 Supabase 获取项目列表（排除已滑动项目）
- 计算匹配分数（基于用户技能和兴趣）
- 实现滑动操作（left=pass, right=match, down=save）
- 记录滑动历史到数据库
- 支持撤销功能（10秒窗口）
- 空状态和加载状态

参考：`Insane-Dream-Builder/src/components/swipe/swipe-interface.tsx`

### 3.2 Matches 匹配列表功能
**文件**: `android/ISDBAPP/src/app/matches.tsx`

需要实现：
- 从 Supabase 获取用户的 incoming matches（别人对我项目的申请）
- 从 Supabase 获取用户的 outgoing matches（我对他人的申请）
- 显示匹配状态（pending/accepted/rejected）
- 显示匹配消息
- 支持接受/拒绝操作

参考：`Insane-Dream-Builder/src/app/(main)/matches/page.tsx`

### 3.3 Projects 项目列表功能
**文件**: `android/ISDBAPP/src/app/projects.tsx`

需要实现：
- 从 Supabase 获取项目列表
- 显示项目卡片（标题、描述、标签、创始人）
- 实现筛选功能（按标签）
- 实现搜索功能
- 创建项目按钮和页面
- 项目详情页面

参考：`Insane-Dream-Builder/src/app/(main)/projects/page.tsx`

### 3.4 Profile 个人资料编辑功能
**文件**: `android/ISDBAPP/src/app/profile.tsx`

需要实现：
- 显示当前用户资料
- 编辑基本信息（display_name, bio, country）
- 编辑技能标签（从预定义列表选择）
- 编辑兴趣标签（从预定义列表选择）
- 保存更新到 Supabase
- 显示社交链接（GitHub, Discord, Twitter）

参考：`Insane-Dream-Builder/src/components/profile/profile-form.tsx`

---

## 4. 阶段三：高级功能（可选）

### 4.1 Groups 群组功能
如果需要添加群组功能，需要创建：
- `android/ISDBAPP/src/app/groups.tsx`
- `android/ISDBAPP/src/app/groups/[id].tsx`

### 4.2 通知推送
- 集成 Expo Notifications 或 OneSignal
- 推送新的匹配通知

---

## 5. 具体实施任务

### Task 1: 项目合并与清理
- [ ] 更新 `android/ISDBAPP/package.json`
- [ ] 确认 `src/config/supabase.ts` 配置
- [ ] 删除 `android/ISDBAPP-new/`
- [ ] 删除 `android/ISDBAPPv2/`
- [ ] 重新安装依赖

### Task 2: 创建 Swipe 组件
- [ ] 创建 `src/components/swipe/swipe-card.tsx`
- [ ] 创建 `src/hooks/use-swipe.ts`
- [ ] 更新 `src/app/swipe.tsx`
- [ ] 实现手势滑动逻辑
- [ ] 测试滑动操作

### Task 3: 实现 Matches 功能
- [ ] 更新 `src/app/matches.tsx`
- [ ] 实现匹配列表获取
- [ ] 实现接受/拒绝操作
- [ ] 测试匹配流程

### Task 4: 实现 Projects 功能
- [ ] 更新 `src/app/projects.tsx`
- [ ] 创建 `src/components/projects/project-card.tsx`
- [ ] 创建 `src/app/projects/new.tsx`
- [ ] 创建 `src/app/projects/[id].tsx`
- [ ] 测试项目列表

### Task 5: 实现 Profile 编辑
- [ ] 更新 `src/app/profile.tsx`
- [ ] 创建 `src/components/profile/edit-form.tsx`
- [ ] 实现资料保存逻辑
- [ ] 测试编辑流程

### Task 6: 验证与测试
- [ ] 运行 TypeScript 检查
- [ ] 运行 ESLint 检查
- [ ] 构建 Android APK
- [ ] 测试基本流程

---

## 6. 验证步骤

1. **TypeScript 验证**: `cd android/ISDBAPP && npx tsc --noEmit`
2. **ESLint 验证**: `cd android/ISDBAPP && npm run lint`
3. **Android 构建**: `cd android/ISDBAPP && npm run android`
4. **功能测试**:
   - 登录流程
   - Onboarding 流程
   - Swipe 滑动
   - 查看 Matches
   - 浏览 Projects
   - 编辑 Profile

---

## 7. 假设与决策

1. **使用 react-native-reanimated**: 用于实现流畅的卡片动画
2. **使用 Supabase**: 所有数据存储和认证
3. **保留 New Architecture**: 保持与现有配置一致
4. **不使用 Expo**: 使用 React Native CLI（保持现有架构）
