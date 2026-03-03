# Helpdesk-BN

Fullstack Web-Based Helpdesk System  
SMK Baktinusaantara 666

Helpdesk-BN is a centralized issue reporting platform designed to manage infrastructure-related incidents across school operational systems, including:

- Server infrastructure
- School website services
- Network connectivity
- Computer laboratory equipment

The system implements an open reporting model for end-users while maintaining controlled administrative access for ticket management and resolution.

---

## 🎥 Demonstration

The following video demonstrates:

- Public ticket submission workflow
- Administrative authentication
- Ticket lifecycle management
- System structural overview

[![Watch Demo](https://img.youtube.com/vi/U-AWs4LbyNo/0.jpg)](https://youtu.be/U-AWs4LbyNo)

Full Video: https://youtu.be/U-AWs4LbyNo

---

## Architectural Overview

Helpdesk-BN follows a separated SPA + REST API architecture within a monorepo structure.

Client (Browser)
↓
React.js SPA (Vite)
↓
Laravel REST API
↓
MySQL Database

This approach ensures:

- Clear separation of concerns
- Independent frontend/backend evolution
- Improved maintainability
- Scalability awareness
- Deployment flexibility

---

## Repository Structure
Helpdesk-BN/
│
├── Help-Desk-Backend/ # Laravel API Layer
│ ├── app/
│ ├── routes/
│ ├── database/
│ └── ...
│
├── Help-Desk-Frontend/ # React.js SPA
│ ├── src/
│ ├── components/
│ └── ...
│
└── README.md


Although maintained in a single repository, the system is architecturally modular and can be deployed independently if required.

---

## Functional Scope

### Public User (No Authentication Required)

- Submit incident ticket
- Select issue category
- Provide descriptive report
- Ticket recorded with initial status

### Administrative Panel

- Secure authentication
- Ticket review & filtering
- Status updates
- Category management

---

## Data Modeling Strategy

The database design follows relational normalization principles.

Core tables:

- tickets
- categories
- statuses
- admins

Design considerations:

- Foreign key constraints for integrity
- Indexed fields for status and category filtering
- Timestamp tracking for auditability
- Avoidance of redundant data storage

This schema supports structured ticket lifecycle management and administrative filtering efficiency.

---

## Technology Stack

Backend:
- Laravel (RESTful API layer)
- MySQL (Relational Database)

Frontend:
- React.js (SPA)
- Vite (Build Tooling)
- Axios (HTTP client)

Environment:
- Linux-based development
- Git-based version control

---

## Security Model

Given the open reporting approach, the following protections are implemented:

- Server-side validation via Laravel rules
- Sanitized request handling
- Middleware-protected administrative routes
- Environment-based secret management
- Controlled API exposure

Potential enhancements:

- API rate limiting
- CAPTCHA integration
- Logging & monitoring layer
- Abuse detection controls

---

## Local Development

### Backend Setup
```bash
cd Help-Desk-Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd Help-Desk-Frontend
npm install
npm run dev
```
## Deployment Considerations

### Designed with VPS deployment compatibility:
- Frontend production build via npm run build
- Backend served using PHP-FPM
- Reverse proxy ready (e.g., Nginx)
- Environment variable separation
- Database isolation supported

## Scalability & Risk Considerations

### Open reporting model trade-offs:

#### Advantages:

- Low friction submission
- Increased report participation

#### Risks:

- Spam submissions
- Anonymous misuse
- Increased administrative filtering

#### Mitigation strategies:

- Validation rules
- Endpoint throttling
- Structured data constraints
- Administrative oversight workflow

### Design Principles

#### The system was developed with emphasis on:

- Separation of concerns
- Maintainable code structure
- Predictable validation flow
- Relational data integrity
- Operational awareness
- Deployment-readiness

### Roadmap

#### Role-Based Access Control (RBAC)

- Ticket priority classification
- Email notification integration
- Activity logging
- Monitoring & alerting integration
- API pagination & filtering enhancements

## Author

- Rendy Julkifli Usman
- Fullstack Developer (Backend-Oriented)
- GitHub: https://github.com/goldieblink-dev
