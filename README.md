#  Secure Warehouse Management System (WMS)

> **Course:** Secure Software Design & Engineering (CY-321)  

##  Project Overview

A secure and scalable Warehouse Management System built using **Node.js**,**Flask**,**MySQL**, and modern cybersecurity practices. This project ensures **data integrity**, **access control**, and **audit traceability** across the system.

---

##  Key Security Features

- ✅ **Multi-Factor Authentication (MFA)**
- ✅ **Password Hashing** with bcrypt
- ✅ **JWT-based Authentication** for session security
- ✅ **AES-256 Encryption** for sensitive inventory data
- ✅ **Input Validation & Sanitization**
- ✅ **Role-Based Access Control (RBAC)**
- ✅ **HTTPS Communication**
- ✅ **Audit Logging** of all sensitive actions

---

##  Threat Modelling

Threat modelling conducted using **IriusRisk** helped identify and mitigate:

| Threat                    | Mitigation                                 |
|--------------------------|---------------------------------------------|
| SQL Injection            | Prepared statements, input validation       |
| Cross-Site Scripting (XSS)| sanitize-html & escaping outputs            |
| Privilege Escalation     | Role-based access control (RBAC)            |
| Session Hijacking        | JWT + Secure Cookies + Session expiry       |

---

##  System Architecture

###  High-Level Flow

- **User Browser** → `HTTPS` → **Web Server**
- **Web Server** → Auth Module (MFA + Bcrypt)
- **Web Server** ↔ Business Logic ↔ Encrypted Database
- **Audit Logger** logs all CRUD operations and access attempts

###  Components

- **Frontend:** Simple HTML/JS interface
- **Backend:** Node.js + Express API
- **Database:** MySQL with secure role configuration
- **Security:** Helmet headers, sanitize-html, bcrypt, crypto, speakeasy

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/aurangzebhatti/SSD_Project

# 2. Install dependencies
npm install

# 3. Configure database (MySQL)
# Run the database.sql script in your MySQL

# 4. Start the server
node server.js

---

##  Notes

- The encryption key is hardcoded for demo purposes. For production, use an environment-secured Key Management System.
- MFA assumes an authenticator app like Google Authenticator.
- For production deployments, prefer HTTPS-only cookies, CSP headers, and CSP reports.

---

## 💡 Future Improvements

- Build a fully responsive frontend with **React**
- Integrate secure file uploads (e.g., invoices, stock images)
- Add real-time analytics and dashboard
- Run automated vulnerability scans (e.g., OWASP ZAP)
