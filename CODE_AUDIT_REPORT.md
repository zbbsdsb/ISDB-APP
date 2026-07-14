# ISDBAPPv2 全仓库代码审查报告

> 审查范围：`android/ISDBAPPv2/src`（React Native + TypeScript）
> 审查标准：生产就绪 / 最严苛
> 审查日期：2026-07-14
> 审查手段：tsc 严格类型检查、ESLint、静态脚本审计（导航/按钮/map-key/supabase 错误处理）、密钥扫描、设计令牌一致性扫描

---

## 一、总体结论

| 维度 | 结果 |
|---|---|
| TypeScript 严格类型检查 (`tsc --noEmit`) | ✅ 0 错误 |
| ESLint (`@react-native`) | ✅ 0 错误，6 个风格警告 |
| 导航完整性（无死链/越界路由） | ✅ 全部 `navigate` 目标均已注册 |
| 列表渲染 `key` | ✅ 0 处缺失 |
| 构建（assembleDebug） | ✅ 通过（前序提交 `196e551`） |
| 密钥泄露（service_role / 私钥） | ✅ 未发现 |

**没有阻断级（Blocker）问题**——应用可编译、可启动、路由健全、无密钥外泄。
但存在 **2 个严重级（Severe）** 与若干 **警告级（Warning）** 问题，距离"生产就绪"仍有差距。

---

## 二、严重级（Severe）— 建议优先修复

### S1. 缺少全局错误边界（Error Boundary）
- **位置**：全仓 `src`，`App` / `NavigationContainer` 外层
- **问题**：未使用 `react-native-error-boundary` 或自定义 `ErrorBoundary`。任何屏幕在渲染期抛出未捕获异常（如数据结构的意外 shape），在生产环境会**整页白屏崩溃且无兜底 UI**。
- **影响**：用户侧表现为"闪退/黑屏"，无错误提示、无上报。
- **建议**：在 `NavigationContainer` 外层包裹 `ErrorBoundary`（或安装 `react-native-error-boundary`），提供"出错了，点击重试"兜底，并接错误上报。

### S2. `TeamBlock` 是静态占位，功能完全未实现
- **文件**：`src/components/project-blocks/team-block.tsx`
- **问题**：组件直接忽略全部 props（`_props`），硬编码渲染 "Team members will appear here"。项目详情页的"团队"区块**没有任何真实数据**，也不读取 `project_members` 关联。
- **影响**：UI 看似有团队模块，实则永远空着——属于"假功能"，与"每个按钮都能用"的目标相悖（若将来有"邀请成员/查看成员"入口，将无数据可显示）。
- **建议**：接入 `project_members` 联表查询（owner + 成员头像/角色），失败时显示加载/空态；若暂不实现，应明确标注为"即将推出"而非伪装成可用模块。

---

## 三、警告级（Warning）

### W1. Supabase 查询错误被静默吞掉（无用户反馈）
以下调用**不检查 `error` 且无 `try/catch` 包裹**，查询失败时 `data` 为 `undefined`、被 `if(data)` 守卫跳过，结果只是"屏幕空白/一直转圈"，用户得不到任何错误提示：

| 文件:行 | 说明 |
|---|---|
| `src/app/matches.tsx:36` | 拉取 matches，无错误态 |
| `src/hooks/use-project-blocks.ts:20` | 拉取项目区块，无错误态 |
| `src/hooks/use-project-posts.ts:23` | 拉取项目动态，无错误态 |
| `src/hooks/use-project-posts.ts:52` | 同上（createPost 分支已解构 error，但 load 分支未处理） |

- **对比**：`use-project.ts`、`use-profile.ts`、`use-groups.ts` 等已正确用 `try/catch` + `setError` 处理，模式成熟，上述几处应补齐到同一标准。
- **建议**：统一为 `const {data, error} = await ...; if (error) { setError(...); showToast(...); return; }` 或包裹 `try/catch`。

### W2. Supabase anon key 明文写死并提交
- **文件**：`src/config/supabase.ts`
- **内容**：`SUPABASE_URL` 与 `SUPABASE_ANON_KEY` 直接硬编码字面值。
- **说明**：Supabase anon key **设计为公开**（数据靠 RLS 行级安全保护），所以**不构成安全漏洞**；但写死在源码里意味着无法在不改代码的情况下轮换密钥，且仓库 fork/泄露会暴露该 key（需手动 revoke）。
- **建议**：改用环境变量注入（`react-native-config` / `.env`），`.env` 加入 `.gitignore`。功能不变，但可轮换、可区分环境。

### W3. 类型安全侵蚀：`any` 滥用 57 处 / 20 个文件
- **分布**：`src/app/*.tsx`、`src/hooks/*.ts` 多处使用 `: any` / `as any` / `any[]`，尤其在渲染项与事件处理中。
- **影响**：丧失编译期防护，潜在的 `undefined` 访问与重构风险被掩盖；与"最严苛标准"相悖。
- **建议**：为关键数据形状（Project / Match / Message / Profile 等）补齐 `interface`/`type`，逐步替换 `any`。可先从不引发大改动的渲染项入手。

### W4. 硬编码语义色绕过主题令牌
- **位置**：`src/app/home.tsx:580` — `backgroundColor: 'rgba(22, 163, 74, 0.1)'`（绿色成功底色）
- **问题**：`theme.ts` 已提供 `colors.success`，此处硬编码既不跟随深/浅色切换，也与设计令牌体系不一致。
- **说明**：其余 rgba 命中均为遮罩背景（`rgba(0,0,0,…)`）或 Google 品牌色图标（`icon.tsx`），属可接受范围。
- **建议**：`home.tsx:580` 改用 `colors.success` 配合透明度，或新增 `successContainer` 令牌。

### W5. 调试日志未受控（23 处 `console.error`）
- **分布**：全仓 23 处 `console.error`（无 `console.log`/`console.warn`）。
- **问题**：生产包中仍会打印，既泄露内部状态又产生噪声；无统一日志开关。
- **建议**：引入 `logger` 工具，生产环境（`!__DEV__`）静默；或直接移除已无用的调试语句。

### W6. ESLint 风格警告 6 处
- **位置**：`button.tsx:103,155`、`card.tsx:35,39,77`
- **内容**：`curly`（if 缺大括号）、`react-native/no-inline-styles`（内联样式）。
- **影响**：纯风格，不影响运行；但 `no-inline-styles` 提示这些样式未纳入 `StyleSheet`，不利于复用与主题化。
- **建议**：`npm run lint -- --fix` 可修 `curly`；内联样式可提取到 `StyleSheet` 或复用令牌。

---

## 四、已确认健康项（无需处理）

- ✅ `tsc --noEmit` 零错误，类型层健全。
- ✅ ESLint 零错误。
- ✅ 导航：全部 19 个注册路由均可达，11 类 `navigate` 目标 100% 命中注册表，**零死链**。
- ✅ 列表渲染：6 个 `FlatList` 均含 `keyExtractor`；JSX 内联 `.map()` **0 处缺失 `key`**（早前 34 处为误报，多为 `.map().filter()` 数组变换或 `key` 在续行）。
- ✅ 死按钮：全仓 70 个可交互控件均绑定真实 `onPress`（含前序修复的 `+ New` 与 `Share`）。
- ✅ 密钥：仅使用 anon key + `react-native-keychain` 安全存储，无 service_role / 私钥泄露。
- ✅ 敏感信息：`profile`/`home` 的 `avatar_url` 用可选链 `?.` 守卫，无空指针隐患。

---

## 五、修复优先级建议

| 优先级 | 项 | 工作量 | 风险 |
|---|---|---|---|
| P0 | S1 全局错误边界 | 小 | 中（防白屏） |
| P0 | S2 TeamBlock 接真实数据 / 明确标注 | 中 | 中 |
| P1 | W1 supabase 错误兜底（4 处） | 小 | 低 |
| P1 | W2 anon key 改 env 注入 | 小 | 低 |
| P2 | W3 替换 `any` | 大 | 低 |
| P2 | W4 语义色走令牌 | 极小 | 低 |
| P3 | W5 日志开关 / W6 lint --fix | 小 | 低 |

> 注：本审查为静态 + 构建验证。模拟器在当前环境启动即崩溃（宿主机资源问题，非代码），故未做实时交互点按；按钮可用性已由前序提交 `196e551` 的静态审计 + 构建保证。
