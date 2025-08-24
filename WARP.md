# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Nueva Calamarca is an attendance control system for personnel management at the Nueva Calamarca company. This is a full-stack application with a planned architecture consisting of:

- **Backend**: Server-side API and business logic (currently empty)
- **Frontend**: Client-side user interface (currently empty) 
- **Docs**: Project documentation (currently empty)

## Project Structure

```
nueva-calamarca/
├── backend/          # Backend API and server logic (to be implemented)
├── frontend/         # Frontend user interface (to be implemented)
├── docs/             # Project documentation (to be implemented)
└── README.md         # Basic project description
```

## Development Setup

This is a new project with only the basic directory structure in place. The specific technologies and frameworks have not yet been determined.

### Repository Management

```powershell
# Check project status
git status

# View commit history
git log --oneline

# Create new feature branch
git checkout -b feature/your-feature-name
```

## Architecture Notes

The project is designed as a full-stack application with clear separation between:

1. **Backend**: Will likely handle user authentication, attendance tracking, employee management, and data persistence
2. **Frontend**: Will provide user interfaces for employees to clock in/out and administrators to manage the system
3. **Documentation**: Will contain technical documentation, API specs, and user guides

## Next Steps for Development

When implementing this system, consider:

- Choose appropriate backend technology stack (Node.js/Express, Python/Django, Java/Spring, etc.)
- Select frontend framework (React, Vue.js, Angular, etc.)
- Determine database solution for storing attendance records and employee data
- Plan authentication and authorization system
- Design API endpoints for attendance tracking
- Create user interfaces for different user roles (employees, administrators)

## Language and Context

This project is developed for a Spanish-speaking organization ("Nueva Calamarca" company) and the README is in Spanish. Consider internationalization requirements if multiple languages will be supported.
