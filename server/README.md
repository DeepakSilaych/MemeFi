# Memefi Server

Backend server for the Memefi trading platform built with FastAPI.

## Setup

1. Install Poetry (Python package manager):
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:
```bash
poetry install
```

3. Create and configure your `.env` file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the development server:
```bash
poetry run uvicorn app.main:app --reload
```

## Project Structure

```
app/
├── api/           # API routes and endpoints
├── core/          # Core functionality, config, security
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic models/schemas
├── services/      # Business logic
└── main.py        # FastAPI application initialization

tests/             # Test files
```

## API Documentation

Once the server is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

- Format code: `poetry run black .`
- Sort imports: `poetry run isort .`
- Run linter: `poetry run flake8`
- Run type checker: `poetry run mypy .`
- Run tests: `poetry run pytest`
