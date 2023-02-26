# Github action for auto release for tag

This action will create a release for a tag.

## What it does

When you push a tag to your repository, this action will create a release for that tag.

And, v1.0.0 will merge to v1.0 and v1 branch(if the branch not exists, create branch).

Such as: if the tag is v1.0.0, the version will be merged into the v1.0 and v1 branch.

## Inputs

| name    | description                                | default | required |
| ------- | ------------------------------------------ | ------- | -------- |
| token   | Github token                               | -       | true     |
| release | if true, will create a release             | true    | true     |
| minor   | if true, Such as v1.0.0 will merge to v1.0 | false   | true     |
| pre     | The dev/pre version merge                  | false   | true     |

## Example usage

```yaml
name: Tag to release
on:
  push:
    tags:
      - 'v*'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Release
        uses: caijinglong/action-version-merge@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
    permissions:
      deployments: write
      contents: write
      packages: read

```
