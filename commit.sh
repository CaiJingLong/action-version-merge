msg=$1

if [ -z "$msg" ]; then
    echo "Please enter a commit message"
    exit 1
fi

pnpm run dist

git add .
git commit -m "$msg"

git push
