# yudao-boot-mini vs ruoyi-vue-pro 后端对比分析

## 一、总体定位

| 维度 | yudao-boot-mini（精简版） | ruoyi-vue-pro（完整版） |
|------|---------------------------|-------------------------|
| **定位** | 面向入门学习、快速二次开发 | 面向企业级全功能业务系统 |
| **定位描述** | 芋道基础脚手架 | 芋道全模块扩展平台 |
| **版本号** | 2026.01-jdk8-SNAPSHOT | 2026.01-jdk8-SNAPSHOT（同版本） |
| **JDK** | JDK 8 | JDK 8（同分支） |
| **Spring Boot** | 2.7.18 | 2.7.18（同分支） |

> 两个项目实际上是 **同一套代码的不同模块组合**，不是两个独立分支。官方提供迁移文档，5-10 分钟即可将完整版按需迁移到精简版。

---

## 二、模块结构差异（核心区别）

### 2.1 根 POM 模块数量

#### yudao-boot-mini（4 个业务模块）

```xml
<modules>
    <module>yudao-dependencies</module>
    <module>yudao-framework</module>
    <!-- Server 主项目 -->
    <module>yudao-server</module>
    <!-- 各种 module 拓展 -->
    <module>yudao-module-system</module>
    <module>yudao-module-infra</module>
<!--        <module>yudao-module-member</module>-->
<!--        <module>yudao-module-bpm</module>-->
<!--        <module>yudao-module-report</module>-->
<!--        <module>yudao-module-mp</module>-->
<!--        <module>yudao-module-pay</module>-->
<!--        <module>yudao-module-mall</module>-->
<!--        <module>yudao-module-crm</module>-->
<!--        <module>yudao-module-erp</module>-->
<!--        <module>yudao-module-iot</module>-->
    <!-- AI 大模型的开启，请参考 https://doc.iocoder.cn/ai/build/ 文档，对 JDK 版本要要求！ -->
<!--        <module>yudao-module-ai</module>-->
</modules>
```

#### ruoyi-vue-pro（12 个业务模块，全部默认激活）

- `yudao-dependencies` — 依赖版本管理（共用）
- `yudao-framework` — 框架层（共用）
- `yudao-server` — 启动容器（共用）
- `yudao-module-system` — 系统功能（共用）
- `yudao-module-infra` — 基础设施（共用）
- `yudao-module-member` — 会员中心
- `yudao-module-bpm` — 工作流程（Flowable）
- `yudao-module-report` — 数据报表
- `yudao-module-mp` — 微信公众号
- `yudao-module-pay` — 支付系统
- `yudao-module-mall` — 商城系统（含 product/trade/promotion）
- `yudao-module-crm` — CRM 系统
- `yudao-module-erp` — ERP 系统
- `yudao-module-iot` — 物联网
- `yudao-module-ai` — AI 大模型

---

## 三、数据库层面（完全一致）

| 维度 | yudao-boot-mini | ruoyi-vue-pro |
|------|-----------------|---------------|
| SQL 文件行数 | 4,087 行 | 4,170 行 |
| 表数量 | 48 张 | 48 张 |
| 核心表 | `system_`（系统管理）、`infra_`（基础设施）、`yudao_demo*`（示例数据） | 完全相同 |

### 核心表包括：

- **系统管理（18 张）**：用户、角色、菜单、部门、岗位、租户、租户套餐、字典、通知公告、操作日志、登录日志、OAuth2、社交登录、短信、邮件等
- **基础设施（12 张）**：代码生成、文件管理、定时任务、API 日志、配置管理、数据源配置等
- **示例数据（5 张）**：Demo01 联系簿、Demo02 分类、Demo03 课程/年级/学生
- **补充 SQL 文件**：`quartz.sql`（定时任务表，284 行），两者共用

---

## 四、框架层（Framework）对比

| 组件 | yudao-boot-mini | ruoyi-vue-pro |
|------|:---:|:---:|
| yudao-common | ✅ | ✅ |
| yudao-spring-boot-starter-web | ✅ | ✅ |
| yudao-spring-boot-starter-security | ✅ | ✅ |
| yudao-spring-boot-starter-mybatis | ✅ | ✅ |
| yudao-spring-boot-starter-redis | ✅ | ✅ |
| yudao-spring-boot-starter-job | ✅ | ✅ |
| yudao-spring-boot-starter-mq | ✅ | ✅ |
| yudao-spring-boot-starter-websocket | ✅ | ✅ |
| yudao-spring-boot-starter-protection | ✅ | ✅ |
| yudao-spring-boot-starter-monitor | ✅ | ✅ |
| yudao-spring-boot-starter-excel | ✅ | ✅ |
| yudao-spring-boot-starter-biz-tenant | ✅ | ✅ |
| yudao-spring-boot-starter-biz-data-permission | ✅ | ✅ |
| yudao-spring-boot-starter-biz-ip | ✅ | ✅ |
| yudao-spring-boot-starter-test | ❌ 不包含 | ✅ 包含 |

> 唯一缺失：测试-starter（`yudao-spring-boot-starter-test`），完整版提供了单元测试基础设施。

---

## 五、依赖版本管理（dependencies BOM）对比

两个项目的 `yudao-dependencies/pom.xml` 完全一致，关键依赖版本如下：

| 技术分类 | 技术选型 | 版本 |
|---------|---------|------|
| Spring Boot | 基础框架 | 2.7.18 |
| Spring Framework | Web 层 | 5.3.39 |
| Spring Security | 安全框架 | 5.8.16 |
| MyBatis Plus | ORM 增强 | 3.5.15 |
| MyBatis Plus Join | 联表查询 | 1.5.5 |
| Dynamic Datasource | 动态数据源 | 4.5.0 |
| Druid | 连接池 | 1.2.27 |
| Redisson | Redis 客户端 | 3.52.0 |
| Flowable | 工作流引擎 | 6.8.0 |
| SkyWalking | 链路追踪 | 8.12.0 |
| Spring Boot Admin | 监控平台 | 2.7.15 |
| Knife4j | API 文档 | 4.5.0 |
| MapStruct | Bean 转换 | 1.6.3 |
| Hutool | 工具集 | 5.8.42 |
| FastExcel | Excel 处理 | 1.3.0 |
| JustAuth | 社交登录 | 1.16.7 |
| RocketMQ | 消息队列 | 2.3.5 |

---

## 六、配置文件对比

两个项目的 `yudao-server/src/main/resources/application.yaml` 完全一致（353 行），包含以下完整配置：

- Servlet、Jackson 序列化配置
- MyBatis Plus 全局配置（含字段加密）
- Flowable 工作流配置
- Redis、Kafka、RocketMQ 配置
- AI 大模型多渠道配置（DeepSeek、文心、智谱、Gemini、字节豆包、腾讯混元、硅基流动等）
- Swagger/Knife4j 文档配置
- 多租户配置（`tenant.enable: true`）
- 短信验证码、邮件、站内信配置
- 支付/物流配置
- API 加密开关

---

## 七、后端架构设计亮点（两者共有）

### 7.1 多数据源架构

```
yudao-module-system        ← 读主库
yudao-module-infra         ← 读主库
yudao-module-bpm (可选)    ← 读主库
Dynamic Datasource 自动路由
```

### 7.2 Starter 分层设计

```
yudao-server  → 聚合业务模块
yudao-module-xxx → 业务代码（Controller/Service/DAO）
yudao-framework  → 公共能力（Security/MyBatis/Redis/MQ）
yudao-dependencies → 统一版本管理
```

### 7.3 数据权限体系

- **行级权限**：通过 `yudao-spring-boot-starter-biz-data-permission` 实现
- **租户隔离**：通过 `yudao-spring-boot-starter-biz-tenant` 实现
- **字段加密**：MyBatis Plus 字段加密器
- **API 加密**：AES/RSA 双向加密

### 7.4 代码生成器

支持一键生成 Java（Controller/Service/DAO/Entity/VO）、Vue 前端代码、SQL 脚本、单元测试，支持**单表、树表、主子表**三种模式。

---

## 八、选型建议

| 场景 | 推荐使用 |
|------|---------|
| 学习 Spring Boot / Java 企业开发 | yudao-boot-mini，代码量少，结构清晰 |
| 快速搭建中小型管理系统 | yudao-boot-mini，仅需系统 + 基础设施 |
| 企业级全功能业务系统（商城/ERP/CRM） | ruoyi-vue-pro，模块全、功能齐 |
| 需要工作流（BPMN + 钉钉审批双设计器） | ruoyi-vue-pro + yudao-module-bpm |
| 需要 AI 大模型集成（RAG/对话/生图） | ruoyi-vue-pro + yudao-module-ai |
| 需要 SaaS 多租户平台 | 两者都支持，`tenant.enable: true` |
| 微服务架构 | 参考 yudao-cloud（Spring Cloud 版） |

---

## 九、一句话总结

> **yudao-boot-mini** 和 **ruoyi-vue-pro** 是同一套核心框架 + 不同模块组合。前者是最小可用系统（系统管理 + 基础设施），后者是全功能企业平台（额外叠加工作流、支付、商城、CRM、ERP、AI、IoT 等业务模块）。两者共享相同的底层框架、相同的依赖版本管理、相同的数据库表结构、相同的配置文件，本质上是同一个项目的两种分发形态。
