.PHONY: bootstrap

bootstrap:
	mise install
	corepack enable pnpm
	pnpm install
