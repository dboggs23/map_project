build:
	docker compose up --build -d --remove-orphans certbot certonly --webroot --webroot-path /var/www/certbot/ -d daltonboggs.dev
up:
	docker compose up -d
down:
	docker compose down
show_logs:
	docker compose logs
dev:
	docker-compose -f docker-compose.development.yml up