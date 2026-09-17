# 🦐 El Cevichazo Management System

> A web-based **expense management system** designed to centralize and streamline the administrative control of operating expenses for **El Cevichazo** restaurant.

---

## ⚡ Overview & Key Capabilities

* **Domain-Driven REST API:** Built on ASP.NET Core, utilizing a clean layered pattern (Controllers, Services, Data) to isolate business logic from server handlers.
* **Modern Client Interface:** Built with Next.js, TypeScript, and Tailwind CSS for rapid administrative workflows and clean data visualization.
* **Proof-of-Purchase Cloud Backup:** Leverages Amazon S3 to link real digital tickets and invoices directly to registered transactions.
* **Relational Consistency:** Powered by Entity Framework Core and PostgreSQL to guarantee data integrity across suppliers, categories, and logs.
* **Role-Based Security:** Features JWT integration to ensure secured API endpoints and role-filtered user access.

---

## 💻 System Architecture

```text
el-cevichazo-ms/
├── frontend/                   ← Next.js User Interface
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/                    ← ASP.NET Core API Application
│   └── ElCevichazo.Api/
│       ├── Controllers/        ← Endpoint Definitions
│       ├── Services/           ← Application & Business Logic
│       ├── Data/               ← DbContext & Entity Mappings
│       ├── DTOs/               ← Request/Response Contracts
│       └── Program.cs
└── README.md
```
---

## 🧱 Tech Stack

| **Layer** | **Technology** |
|---|---|
| **Frontend** | Next.js + TypeScript + Tailwind CSS + shadcn/ui |
| **Backend** | ASP.NET Core Web API + C# |
| **Database & ORM** | PostgreSQL + Entity Framework Core|
| **Auth & Assets** | JSON Web Tokens (JWT), Amazon S3 |

---
## 📐 Development Guidelines

* **Commit Format:** Follow **Conventional Commits** (`feat:`, `fix:`, `chore:`).
* **Branching Strategy:** Feature branches are required. Direct pushes to main branches are restricted.

---

## 📜 License
```
Distributed under the MIT License. Created as a Professional Residency Project at Instituto Tecnológico de Durango (2026).
```
