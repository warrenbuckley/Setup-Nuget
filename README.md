
# setup-nuget

This action setsup Nuget.exe as a CLI tool for use in actions by:
- optionally downloading and caching a version of nuget.exe and adds to PATH for future steps to use

# Usage

Basic:
```yaml
steps:
name: ASP.NET CI
on: [push]
jobs:
  build:
    runs-on: windows-latest

    steps:
    - uses: actions/checkout@master

    - name: Setup Nuget.exe
      uses: warrenbuckley/Setup-Nuget@v1

    - name: Nuget Push
      run: nuget push *.nupkg
```


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)