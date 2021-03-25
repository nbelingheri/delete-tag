# GitHub Action: Delete tag

Add following step to your workflow:

```yaml
- uses: nbelingheri/delete-tag@v0.1.0
  with:
    tag_name: v0.1.0 # tag name to delete
    repo: <owner>/<repoName> # target repo (optional). defaults to repo running this action
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
