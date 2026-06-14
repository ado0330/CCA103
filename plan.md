# UniStay - Smart Off-Campus Housing & Roommate Matching System

## 1. 项目概述 (Project Overview)

### 一句话描述
UniStay 是一个面向大学生的校外租房与室友匹配平台 Demo，整合房源管理、室友匹配、租赁申请和管理后台审核功能。

### 核心问题
当前学生寻找校外住宿依赖 Facebook、WhatsApp、Telegram 等碎片化渠道，存在房源真实性不足、租房流程不透明、室友不匹配、诈骗风险高等问题。UniStay 提供一个统一平台解决这些问题。

---

## 2. 技术栈 (Tech Stack)

### Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### State Management

- Zustand

### Backend / Data Layer

> Demo 阶段不需要真实后端

- Mock Data (JSON / TypeScript Objects)
- Local State
- localStorage 持久化（可选）

### Deployment

- Vercel

### Tooling

- ESLint
- Prettier

---

## 3. 核心功能边界 (In-Scope for Demo)

### Core Features

#### 1. Property Discovery

学生可以：

- 浏览房源列表
- 查看房源详情
- 查看价格、设施、图片、空房状态
- 按预算筛选房源

#### 2. Landlord Property Management

房东可以：

- 创建房源
- 编辑房源
- 更新空房状态
- 查看申请记录

#### 3. Roommate Matching

学生可以：

- 创建个人偏好 Profile
- 获取室友推荐
- 查看匹配分数
- 发送匹配请求

#### 4. Tenancy Application Workflow

学生可以：

- 提交租房申请
- 上传模拟文件
- 查看申请状态
- 查看数字租约

房东可以：

- 批准申请
- 拒绝申请

#### 5. Admin Verification Dashboard

管理员可以：

- 审核房东
- 审核房源
- 查看举报记录
- Suspend 用户

### Out of Scope

#### Authentication

- 不做真实注册登录
- 使用 Role Switcher 模拟身份切换

#### Payment

- 不做租金支付
- 不接 Stripe
- 不接银行接口

#### Real Matching Algorithm

- 不做 AI 推荐
- 使用简单规则评分即可

#### Real Document Storage

- 文件上传仅 Mock
- 不接 S3
- 不接 Cloud Storage

#### Notifications

- 不做真实推送
- 使用 Toast 模拟

#### Multi-University Support

- 仅支持 USM

---

## 4. 数据结构 / Mock 数据模型 (Data Models)

### User

```ts
interface User {
  id: string;
  role: "student" | "landlord" | "admin";

  name: string;
  email: string;

  verified: boolean;
  avatar?: string;

  status: "active" | "suspended";
}
```

### Property

```ts
interface Property {
  id: string;
  landlordId: string;

  title: string;
  description: string;

  address: string;

  monthlyRent: number;

  images: string[];

  amenities: string[];

  availableRooms: number;

  status:
    | "pending"
    | "approved"
    | "rejected";

  createdAt: string;
}
```

### RoommatePreference

```ts
interface RoommatePreference {
  id: string;

  studentId: string;

  budgetMin: number;
  budgetMax: number;

  cleanliness: number;
  sleepSchedule: "early" | "late";
  studyHabit: "quiet" | "social";
  smoking: boolean;
}
```

### MatchResult

```ts
interface MatchResult {
  id: string;

  requesterId: string;
  targetId: string;

  compatibilityScore: number;

  status:
    | "pending"
    | "accepted"
    | "rejected";
}
```

### TenancyApplication

```ts
interface TenancyApplication {
  id: string;

  propertyId: string;
  applicantId: string;

  roommateIds: string[];

  documents: string[];

  status:
    | "pending"
    | "approved"
    | "rejected";

  createdAt: string;
}
```

### Lease

```ts
interface Lease {
  id: string;

  applicationId: string;

  propertyId: string;

  tenantIds: string[];

  leaseStart: string;
  leaseEnd: string;

  signed: boolean;
}
```

### ScamReport

```ts
interface ScamReport {
  id: string;

  reporterId: string;

  targetUserId: string;

  reason: string;

  status:
    | "open"
    | "investigating"
    | "resolved";
}
```

---

## 5. 执行路线图 (Implementation Steps)

### Phase 1: Project Setup & Routing

#### Task 1.1 Initialize Project

- [ ] Create Next.js app
- [ ] Configure Tailwind
- [ ] Install shadcn/ui
- [ ] Install Zustand

#### Task 1.2 Setup Layout

- [ ] Global layout
- [ ] Navigation sidebar
- [ ] Mobile responsive shell

#### Task 1.3 Create Routes

```txt
/
├── dashboard
├── properties
├── properties/[id]
├── roommate
├── applications
├── landlord
├── landlord/properties
├── admin
```

#### Task 1.4 Role Switcher

- [ ] Student mode
- [ ] Landlord mode
- [ ] Admin mode

---

### Phase 2: Core UI Components

#### Property Components

- [ ] PropertyCard
- [ ] PropertyGrid
- [ ] PropertyDetails
- [ ] PropertyFilters

#### Roommate Components

- [ ] PreferenceForm
- [ ] MatchCard
- [ ] MatchList
- [ ] ConnectionRequestModal

#### Application Components

- [ ] ApplicationForm
- [ ] ApplicationStatusCard
- [ ] LeaseViewer

#### Admin Components

- [ ] VerificationTable
- [ ] PropertyApprovalQueue
- [ ] ReportManagementPanel

---

### Phase 3: State Management & Mock Logic

#### Property Store

- [ ] Load mock properties
- [ ] Create property
- [ ] Edit property
- [ ] Update room availability

#### Matching Engine

匹配规则：

```txt
Budget Match       = 40%
Cleanliness        = 25%
Sleep Schedule     = 15%
Study Habit        = 10%
Smoking Preference = 10%
```

- [ ] Generate compatibility score
- [ ] Sort descending
- [ ] Return top matches

#### Application Workflow

- [ ] Submit application
- [ ] Approve application
- [ ] Reject application
- [ ] Generate lease

#### Admin Workflow

- [ ] Approve landlord
- [ ] Approve property
- [ ] Resolve report
- [ ] Suspend user

---

### Phase 4: Styling & Polish

#### UX Improvements

- [ ] Empty states
- [ ] Loading skeletons
- [ ] Success toasts
- [ ] Error states

#### Dashboard Metrics

##### Student Dashboard

- [ ] Active Applications
- [ ] Recommended Roommates
- [ ] Saved Properties

##### Landlord Dashboard

- [ ] Total Properties
- [ ] Pending Applications
- [ ] Occupancy Rate

##### Admin Dashboard

- [ ] Pending Verifications
- [ ] Open Reports
- [ ] Suspended Users

#### Demo Readiness

- [ ] Seed realistic mock data
- [ ] Mobile responsive
- [ ] Accessibility pass
- [ ] Consistent spacing system

---

## 6. Vibe & UI 指南 (UI/UX Guidelines)

### Design Direction

**Modern Student SaaS + Airbnb + LinkedIn Matching**

### Visual Style

- Clean
- Professional
- Trust-focused
- Mobile-first
- Minimal clutter

### Layout

- Left sidebar on desktop
- Bottom navigation on mobile
- Card-based information architecture

### Components

- Rounded corners (12px–16px)
- Soft shadows
- Large property images
- Status badges

### Color System

```txt
Primary: Indigo / Blue
Success: Green
Warning: Amber
Danger: Red
Background: Light Gray
```

### Typography

- Inter
- Medium density
- Clear hierarchy

### Inspiration

- Airbnb
- Zillow
- LinkedIn
- Notion
- Stripe Dashboard

### Demo Priority

Agent 应优先保证：

1. 房源浏览流程可运行
2. 室友匹配流程可运行
3. 租房申请流程可运行
4. 管理员审核流程可运行

其余功能全部可以使用 Mock Data 和本地状态实现。