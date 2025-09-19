.ONESHELL:
.SHELLFLAGS = -ec

dev:
	trap 'kill 0' SIGINT

	cd web && pnpm run dev &
	cd api && uv run manage.py runserver