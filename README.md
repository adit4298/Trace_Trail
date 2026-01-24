# TraceTrail

**Privacy Intelligence Platform**

[![Status](https://img.shields.io/badge/status-demo--prototype-orange)](https://app.tracetrail.in)
[![Frontend](https://img.shields.io/badge/frontend-Vercel-blue)](https://app.tracetrail.in)
[![Backend](https://img.shields.io/badge/backend-Render-green)](https://api.tracetrail.in)

---

## ⚠️ Project Status: DEMO / PROTOTYPE

**Important**: The current version of TraceTrail is a **DEMO / PROTOTYPE**. This version uses **demo data** due to security, privacy, and integration constraints. While the architecture and functionality reflect a production-ready design, the current implementation serves as a demonstration of the platform's capabilities.

The system architecture, codebase structure, and feature set are designed to be production-ready, but actual OAuth integrations and real-time data processing are simulated for demonstration purposes.

---

## What is TraceTrail?

TraceTrail is a privacy intelligence platform that helps users:

- **Monitor** their digital footprint across social media platforms (Google, Instagram, Facebook, Twitter/X)
- **Assess** privacy risk through automated analysis and health scoring
- **Act** on actionable recommendations to improve privacy posture

### Key Features

- 🔐 **OAuth Integration**: Connect multiple social accounts securely
- 📊 **Risk Scoring**: Automated privacy risk assessment (0-100 health score)
- 🚨 **Anomaly Detection**: Automatic detection of security signals and anomalies
- 📈 **Dashboard**: Comprehensive visualization of privacy metrics and trends
- 💡 **Recommendations**: Actionable, prioritized recommendations with impact scoring
- 🔄 **Real-time Sync**: Automatic synchronization of connected accounts

---

## Quick Links

- **Live Demo**: [https://app.tracetrail.in](https://app.tracetrail.in)
- **API Documentation**: [https://api.tracetrail.in/docs](https://api.tracetrail.in/docs)
- **API Health Check**: [https://api.tracetrail.in/health](https://api.tracetrail.in/health)
- **Master Documentation**: [docs/MASTER_FILE.md](docs/MASTER_FILE.md)

---

## Technology Stack

### Frontend
- **Next.js 14.2.0** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Tailwind CSS 3.4.14** - Styling
- **Recharts 2.12.7** - Data visualization

### Backend
- **FastAPI 0.115.0** - Web framework
- **Python 3.11** - Runtime
- **SQLAlchemy 2.0.35** - ORM
- **PostgreSQL 14+** - Database

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting + PostgreSQL database

---

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- Python 3.11
- PostgreSQL 14+ (or Docker)
- Docker (optional, for containerized development)

### Local Development

**Backend**:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements/base.txt
alembic upgrade head
uvicorn src.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

**Docker Compose**:
```bash
docker compose up --build
```

For detailed setup instructions, see [docs/getting_started.md](docs/getting_started.md).

---

## Project Structure

```
TraceTrail/
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend service
├── ai_module/         # AI/ML module (optional)
├── chrome_extension/  # Chrome extension (optional)
├── docs/              # Documentation
├── deployment/        # Deployment configurations
└── scripts/           # Utility scripts
```

---

## Documentation

- **[Master File](docs/MASTER_FILE.md)** - Comprehensive project documentation
- **[Getting Started](docs/getting_started.md)** - Setup and development guide
- **[System Architecture](docs/architecture/system_architecture.md)** - Architecture overview
- **[API Specification](docs/API_SPECIFICATION.md)** - Complete API documentation
- **[Frontend Implementation](docs/FRONTEND_IMPLEMENTATION.md)** - Frontend details
- **[Backend Implementation](docs/BACKEND_IMPLEMENTATION.md)** - Backend details
- **[Deployment Guide](docs/deployment/production_deployment.md)** - Deployment instructions

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to the project.

---

## License

See [LiCENSE](LiCENSE) for license information.

---

## Support

- **Issues**: GitHub Issues
- **Documentation**: [docs/](docs/)
- **API Docs**: [https://api.tracetrail.in/docs](https://api.tracetrail.in/docs)

---

**Version**: 2.0.0  
**Status**: DEMO / PROTOTYPE  
**Last Updated**: 2025
