# @beat-forge/init-beatsaber

A GitHub Action to initialize a Beat Saber modding environment with stripped references for compiling mods in CI/CD.

## Quickstart 🚀

To quickly set up the modding environment, add the following step to your GitHub Actions workflow:

```yaml
- name: Initialize modding environment
  uses: beat-forge/init-beatsaber@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

This will clone the stripped Beat Saber references to the default path `./Refs` and infer the Beat Saber version from your `manifest.json` file.

## Inputs ⚙️

| Name       | Description                                                                                                                  | Required | Default                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `token`    | GitHub token for cloning the Beat Saber repository.                                                                          | Yes      | None                                                                                |
| `version`  | Version of Beat Saber for the modding environment. If not specified, the action will try to infer it from a `manifest.json`. | No       | None                                                                                |
| `manifest` | Path to a specific `manifest.json` file for version inference. If not provided, the action will search recursively.          | No       | None                                                                                |
| `path`     | Path to clone the stripped Beat Saber references to.                                                                         | No       | `./Refs`                                                                            |
| `host`     | Host to clone the stripped Beat Saber references from.                                                                       | No       | `github.com`                                                                        |
| `repo`     | Repository to clone the stripped Beat Saber references from.                                                                 | No       | [`beat-forge/beatsaber-stripped`](https://github.com/beat-forge/beatsaber-stripped) |

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/beat-forge/init-beatsaber/issues).

## Stargazers over time 📈

<a href="https://star-history.com/#beat-forge/init-beatsaber&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=beat-forge/init-beatsaber&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=beat-forge/init-beatsaber&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=beat-forge/init-beatsaber&type=Date" />
  </picture>
</a>