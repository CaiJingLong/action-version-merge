# Github action for auto release with tag

This action will create a release with a tag.

When the tag v1.0.0 pushed, the action will create a release with the tag v1.0.0.

And the action will merge the tag to the v1.0 and v1 branch. If the branch v1.0 not exists, the action will create it.

----

If the repo is github action, user can use owner/action@v1 to use the action.

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
      - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Release
        uses: caijinglong/action-version-merge@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
    permissions: # Required, because the action will create a release and branch, so need write permission
      deployments: write
      contents: write
      packages: read

```
