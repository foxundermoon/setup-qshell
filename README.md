# setup-node

<p align="left">
  <a href="https://github.com/foxundermoon/setup-qshell"><img alt="GitHub Actions status" src="https://github.com/foxundermoon/setup-qshell/workflows/Main%20workflow/badge.svg"></a>
</p>

添加七牛 qshell到PATH下面


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
      uses: foxundermoon/setup-qshell@v1
      with:
        qshell-version: '2.4.0'
    - name: test qshell
      run: qshell version
```

Matrix Testing:
```yaml
jobs:
  build:
    runs-on: ubuntu-16.04
    strategy:
      matrix:
        node: [ '10', '8' ]
    name: Node ${{ matrix.node }} sample
    steps:
      - uses: actions/checkout@v1
      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node }}
      - run: npm install
      - run: npm test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
