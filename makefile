test:
	clear && npm test

dev:
	clear && npm run dev

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose up -d --build --remove-orphans

docker-rebuild: docker-down docker-build
