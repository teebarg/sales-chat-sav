# Makefile for AI Sales Representative Application
.PHONY: client server clean dev docker-build docker-up docker-down docker-logs test

# ANSI color codes
GREEN=$(shell tput -Txterm setaf 2)
YELLOW=$(shell tput -Txterm setaf 3)
RESET=$(shell tput -Txterm sgr0)

# Client target
client:
	cd frontend && npm install && npm start

# Server target
server:
	cd server && npm install && npm run dev

# Clean target
clean:
	rm -rf frontend/build
	rm -rf server/dist

dev: ## Serve the project in terminal
	@echo "$(YELLOW)Running development in terminal...$(RESET)"
	make -j 2 server client

# Docker commands
docker-build:
	docker compose build

docker-up:
	docker compose up

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# Test target
server-test:
	cd server && npm test
frontend-test:
	cd frontend && npm test

test: ## Run all tests
	@echo "$(YELLOW)Running tests...$(RESET)"
	make -j 2 server-test frontend-test

# Help command
help:
	@echo "Available commands:"
	@echo "  make dev           - Start both frontend and backend in development mode"
	@echo "  make docker-build  - Build Docker images for production"
	@echo "  make docker-up     - Start Docker containers for production"
	@echo "  make docker-down   - Stop Docker containers for production"
	@echo "  make docker-logs   - View Docker container logs for production"
	@echo "  make clean         - Clean up node_modules and build directories"
	@echo "  make test          - Run all tests in both server and frontend"
