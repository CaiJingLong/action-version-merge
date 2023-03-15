bump_version:
	pnpm up
	pnpm run dist
	git add .
	git commit -m ":arrow_up: Bump version"
	git push

dist:
	pnpm run dist

push:
	git add .
	git commit -m ":hammer: Update docs or scripts"
	git push

clean:
	rm -rf lib
	rm -rf dist

.PHONY: bump_version dist clean commit