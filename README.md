# @beat-forge/init-beatsaber

A GitHub Action to initialize a Beat Saber modding environment with stripped references for compiling mods in CI/CD.

## Quickstart 🚀

```yaml
- name: Initialize modding environment
  uses: beat-forge/init-beatsaber@v1.0.0
  with:
    token: ${{ github.token }} # required
    version: 1.29.1 # required
```

## Inputs ⚙️

| Name      | Description                                                       | Required | Default                                             |
| --------- | ----------------------------------------------------------------- | -------- | --------------------------------------------------- |
| `token`   | GitHub token to use for cloning the Beat Saber repository.        | `true`   | `${{ github.token }}` - Provided by GitHub Actions. |
| `version` | The version of Beat Saber to use for the modding environment.     | `true`   | `N/A`                                               |
| `path`    | The path to clone the stripped Beat Saber refrerences to.         | `false`  | `./Refs`                                            |
| `repo`    | The repository to clone the stripped Beat Saber refrerences from. | `false`  | `https://github.com/beat-forge/beatsaber-stripped`  |

## Contributing 🤝

Contributions, issues and feature requests are welcome! Feel free to check out the [issues page](https://github.com/beat-forge/init-beatsaber/issues).

## Stargazers over time 📈

<a href="https://star-history.com/#beat-forge/init-beatsaber&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=beat-forge/init-beatsaber&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=beat-forge/init-beatsaber&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=beat-forge/init-beatsaber&type=Date" />
  </picture>
</a>
