# setup-node

<p align="left">
  <a href="https://github.com/foxundermoon/setup-qshell"><img alt="GitHub Actions status" src="https://github.com/foxundermoon/setup-qshell/workflows/Main%20workflow/badge.svg"></a>
</p>

添加七牛 [qshell](https://github.com/qiniu/qshell)到PATH下面


# Usage


```yaml
name: qhsell demo
on: [push]
jobs:
  run:
    name: Run qshell
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Setup qshell
      uses: foxundermoon/setup-qshell@v5
      with:
        version: '2.6.2'
    - name: test qshell
      run: qshell version
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
