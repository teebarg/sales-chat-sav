# Makefile for AI Sales Representative Application

# ANSI color codes
GREEN=$(shell tput -Txterm setaf 2)
YELLOW=$(shell tput -Txterm setaf 3)
RESET=$(shell tput -Txterm sgr0)

# Default target
all: client server

# Client target
client:
	cd client && npm install && npm start

# Server target
server:
	cd server && npm install && npm run dev

# Clean target
clean:
	rm -rf client/build
	rm -rf server/dist

dev: ## Serve the project in terminal
	@echo "$(YELLOW)Running development in terminal...$(RESET)"
	make -j 2 server client

.PHONY: all client server clean
