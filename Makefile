bump_version:
	pnpm up
	pnpm run dist
	git add .
	git commit -m ":arrow_up: Bump version"
	git push

dist:
	pnpm run dist
