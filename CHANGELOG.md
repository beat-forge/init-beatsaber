# Changelog

## [1.6.6](https://github.com/beat-forge/init-beatsaber/compare/v1.6.5...v1.6.6) (2024-10-10)


### Bug Fixes

* handle missing package.json gracefully ([f2f2c84](https://github.com/beat-forge/init-beatsaber/commit/f2f2c841e112d59e986e3fe0d2e57cb1a9d71289))

## [1.6.5](https://github.com/beat-forge/init-beatsaber/compare/v1.6.4...v1.6.5) (2024-10-04)


### Bug Fixes

* major refactors and fixes to error handling. should improve general reliability of this action in many different circumstances. ([426db66](https://github.com/beat-forge/init-beatsaber/commit/426db6688880aa2b508367fcf26b2db29244970b))

## [1.6.4](https://github.com/beat-forge/init-beatsaber/compare/v1.6.3...v1.6.4) (2024-09-14)


### Bug Fixes

* Remove data from path, it's in the actual dir ([3bc2a75](https://github.com/beat-forge/init-beatsaber/commit/3bc2a7522c47a3482943e3f9e102621277dde35d))

## [1.6.3](https://github.com/beat-forge/init-beatsaber/compare/v1.6.2...v1.6.3) (2024-07-19)


### Bug Fixes

* attempting to fix a strange bug with `repo` defaults. ([b44e9e1](https://github.com/beat-forge/init-beatsaber/commit/b44e9e1d72a49b07c9efeb927ee646daabb7d632))
* I forgot to update the `action.yml`. This should fix a LOT of bugs. ([c5235a9](https://github.com/beat-forge/init-beatsaber/commit/c5235a906fda27129d2381f54d4d60192b3cb115))

## [1.6.2](https://github.com/beat-forge/init-beatsaber/compare/v1.6.1...v1.6.2) (2024-07-19)


### Bug Fixes

* token is now an optional parameter ([b66159e](https://github.com/beat-forge/init-beatsaber/commit/b66159e21154a7032a08780219c4beb60feff060))

## [1.6.1](https://github.com/beat-forge/init-beatsaber/compare/v1.6.0...v1.6.1) (2024-07-18)


### Bug Fixes

* remove BOM from `manifest.json` if present ([51e47f0](https://github.com/beat-forge/init-beatsaber/commit/51e47f0312b8c8abd407bb3904d894aaf64031ef))

## [1.6.0](https://github.com/beat-forge/init-beatsaber/compare/v1.5.2...v1.6.0) (2024-07-18)


### Features

* infer Beat Saber version from manifest.json if not specified ([de0df7d](https://github.com/beat-forge/init-beatsaber/commit/de0df7dd419968115b6a4d18266dd0983ca40f68))

## [1.5.2](https://github.com/beat-forge/init-beatsaber/compare/v1.5.1...v1.5.2) (2024-07-18)


### Bug Fixes

* proper moveContents call ([11a58fd](https://github.com/beat-forge/init-beatsaber/commit/11a58fd7ed1db9043904db379afc895eb6698d38))

## [1.5.1](https://github.com/beat-forge/init-beatsaber/compare/v1.5.0...v1.5.1) (2024-07-18)


### Bug Fixes

* only use `data` ([e5b5c35](https://github.com/beat-forge/init-beatsaber/commit/e5b5c35ebd14d63fb84cf66dc4a735edb60c81b6))

## [1.5.0](https://github.com/beat-forge/init-beatsaber/compare/v1.4.13...v1.5.0) (2024-07-18)


### Features

* add host flag for customizable git URL + refactor ([b3f3198](https://github.com/beat-forge/init-beatsaber/commit/b3f3198f38b5860d5f60355c67798da0572296ab))
* init ([f323b53](https://github.com/beat-forge/init-beatsaber/commit/f323b535ec0c9f308447bc97e294cb4bca1d54cd))
* switch from file downloading to branch downloading ([31da1cd](https://github.com/beat-forge/init-beatsaber/commit/31da1cdd178cc22d7ef5ffc51b7fdcc101ebe29c))


### Bug Fixes

* `checkout` ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))
* bundling ([a4d329d](https://github.com/beat-forge/init-beatsaber/commit/a4d329db7679c8981104f1bfc1435630e924b98b))
* bundling again ([a30b6ab](https://github.com/beat-forge/init-beatsaber/commit/a30b6abf78c93d911c9834792ec5cec6771c4ac3))
* bundling again again ([9bdf6c3](https://github.com/beat-forge/init-beatsaber/commit/9bdf6c3ca2c34f892d5aceb4d009b99fd6fcc254))
* checkout ([ac73884](https://github.com/beat-forge/init-beatsaber/commit/ac738845a309c968b80843b6d4ff012da0c13b52))
* ensure the directories are actually created. ([c07ef2c](https://github.com/beat-forge/init-beatsaber/commit/c07ef2c78a315abd39837c6d415ec84643bc8c0f))
* ensure the directory is created properly ([07966dd](https://github.com/beat-forge/init-beatsaber/commit/07966dd279a16d6ecbf37c563aca038ebb5e65fb))
* fetch all branches from `origin` ([fcbd32e](https://github.com/beat-forge/init-beatsaber/commit/fcbd32e73926a16837c5e5ccc5c04acc4a46c537))
* force build ([9da0df6](https://github.com/beat-forge/init-beatsaber/commit/9da0df6a3d1473b7ac2c1caa7b2039d7909cc857))
* I'm gonna bundle myself in a minute if this doesn't work ([2a2cc20](https://github.com/beat-forge/init-beatsaber/commit/2a2cc2042bbdf41609fdac5be462259bc24bc5c3))
* identify ci ([1ba2d92](https://github.com/beat-forge/init-beatsaber/commit/1ba2d9278107040a6a90be8217becfdb3224c967))
* just a bump to release the action ([2ada7b9](https://github.com/beat-forge/init-beatsaber/commit/2ada7b9de7bd19371f590a4abea44b51655fc9e2))
* log EVERYTHING for debugging. ([5c700a0](https://github.com/beat-forge/init-beatsaber/commit/5c700a0414289fdca30b5f7b85f1e872a2692a75))
* mkdir + debugging ([a4df869](https://github.com/beat-forge/init-beatsaber/commit/a4df869c797de9aa10247b572b53254ea83191e3))
* my dyslexia ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))
* proper `raw.githubusercontent.com` link ([0e525e8](https://github.com/beat-forge/init-beatsaber/commit/0e525e85a0f358cbfe2366b326cfff1512d3f6b5))
* regression in functionality vs documentation ([4f3ad6b](https://github.com/beat-forge/init-beatsaber/commit/4f3ad6b784d8c47c856d31f15e71fcbca8dd0869))
* remove unused github (fix for force release) ([123c72a](https://github.com/beat-forge/init-beatsaber/commit/123c72afd188944f4f533fc3bd88d874d262d6cb))
* response headers logging ([3a1c7f8](https://github.com/beat-forge/init-beatsaber/commit/3a1c7f8d370c3e4ba5a05ed8449ca2e90350e7ee))
* slight rewrite, should download properly now. ([68c8af6](https://github.com/beat-forge/init-beatsaber/commit/68c8af6f90af3a1432cf811d485c6316e185e44c))
* tag subversions ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))
* the final bundle ([1a81a58](https://github.com/beat-forge/init-beatsaber/commit/1a81a58447bbc7a318181aa1afa368ae2abb1fa6))
* update bundle workflow to fetch full history ([0f2ad2f](https://github.com/beat-forge/init-beatsaber/commit/0f2ad2fc841d9e7c2bbbbc78b26149d3e6b934ae))
* update dist damn it ([3dda875](https://github.com/beat-forge/init-beatsaber/commit/3dda8757dd3193110a37ae720a5982f8dd3f45ef))
* update release workflow to include git pull before pushing changes ([b7c1db4](https://github.com/beat-forge/init-beatsaber/commit/b7c1db4f2d7958f9ef6e80c4ff1233ed41c6cf28))
* update release workflow to use RELEASE_GITHUB_TOKEN ([c7a6cad](https://github.com/beat-forge/init-beatsaber/commit/c7a6cad9f975b661dac33afcdfa0470d34121ee1))
* update tar extraction to filter only 'data/' paths ([bd649f8](https://github.com/beat-forge/init-beatsaber/commit/bd649f83772e8f77c1dd6219a62402a3be75ccb0))
* update tar extraction to filter only 'data/' paths and use `version` instead of `versions`. ([6c5ce9c](https://github.com/beat-forge/init-beatsaber/commit/6c5ce9c8ae497572b7ea5dc985ff431549bb9ae8))
* use native fetch ([30aa353](https://github.com/beat-forge/init-beatsaber/commit/30aa35394eddc842469e2f1ae64ba4b028545c5d))
* use the `data` directory ([97ab249](https://github.com/beat-forge/init-beatsaber/commit/97ab2494c3e1f3bd8dbaa635ceb13980bfc9fea6))
* who needs local CI testing right? ([fe1342f](https://github.com/beat-forge/init-beatsaber/commit/fe1342f85f8b763653c3aebce7f02e1c1cdb2e69))
* witchcraft ([f028bf6](https://github.com/beat-forge/init-beatsaber/commit/f028bf64449eb04d51b3c16a96525203791a1a25))


### Performance Improvements

* switch to `bun`! (node runtime, for now.) ([1c4c5ed](https://github.com/beat-forge/init-beatsaber/commit/1c4c5ed7ed22f30bea7f01f82f37693b88d2b6d0))

## [1.4.12](https://github.com/beat-forge/init-beatsaber/compare/v1.4.11...v1.4.12) (2024-07-18)


### Bug Fixes

* log EVERYTHING for debugging. ([5c700a0](https://github.com/beat-forge/init-beatsaber/commit/5c700a0414289fdca30b5f7b85f1e872a2692a75))

## [1.4.11](https://github.com/beat-forge/init-beatsaber/compare/v1.4.10...v1.4.11) (2024-07-18)


### Bug Fixes

* use the `data` directory ([97ab249](https://github.com/beat-forge/init-beatsaber/commit/97ab2494c3e1f3bd8dbaa635ceb13980bfc9fea6))

## [1.4.10](https://github.com/beat-forge/init-beatsaber/compare/v1.4.9...v1.4.10) (2024-07-18)


### Bug Fixes

* mkdir + debugging ([a4df869](https://github.com/beat-forge/init-beatsaber/commit/a4df869c797de9aa10247b572b53254ea83191e3))

## [1.4.9](https://github.com/beat-forge/init-beatsaber/compare/v1.4.8...v1.4.9) (2024-07-18)


### Bug Fixes

* ensure the directories are actually created. ([c07ef2c](https://github.com/beat-forge/init-beatsaber/commit/c07ef2c78a315abd39837c6d415ec84643bc8c0f))

## [1.4.8](https://github.com/beat-forge/init-beatsaber/compare/v1.4.7...v1.4.8) (2024-07-18)


### Bug Fixes

* update dist damn it ([3dda875](https://github.com/beat-forge/init-beatsaber/commit/3dda8757dd3193110a37ae720a5982f8dd3f45ef))

## [1.4.7](https://github.com/beat-forge/init-beatsaber/compare/v1.4.6...v1.4.7) (2024-07-18)


### Bug Fixes

* ensure the directory is created properly ([07966dd](https://github.com/beat-forge/init-beatsaber/commit/07966dd279a16d6ecbf37c563aca038ebb5e65fb))

## [1.4.6](https://github.com/beat-forge/init-beatsaber/compare/v1.4.5...v1.4.6) (2024-07-18)


### Bug Fixes

* checkout ([ac73884](https://github.com/beat-forge/init-beatsaber/commit/ac738845a309c968b80843b6d4ff012da0c13b52))
* fetch all branches from `origin` ([fcbd32e](https://github.com/beat-forge/init-beatsaber/commit/fcbd32e73926a16837c5e5ccc5c04acc4a46c537))
* remove unused github (fix for force release) ([123c72a](https://github.com/beat-forge/init-beatsaber/commit/123c72afd188944f4f533fc3bd88d874d262d6cb))
* slight rewrite, should download properly now. ([68c8af6](https://github.com/beat-forge/init-beatsaber/commit/68c8af6f90af3a1432cf811d485c6316e185e44c))
* update release workflow to include git pull before pushing changes ([b7c1db4](https://github.com/beat-forge/init-beatsaber/commit/b7c1db4f2d7958f9ef6e80c4ff1233ed41c6cf28))

## [1.4.5](https://github.com/beat-forge/init-beatsaber/compare/v1.4.4...v1.4.5) (2024-07-18)


### Bug Fixes

* I'm gonna bundle myself in a minute if this doesn't work ([2a2cc20](https://github.com/beat-forge/init-beatsaber/commit/2a2cc2042bbdf41609fdac5be462259bc24bc5c3))
* witchcraft ([f028bf6](https://github.com/beat-forge/init-beatsaber/commit/f028bf64449eb04d51b3c16a96525203791a1a25))

## [1.4.4](https://github.com/beat-forge/init-beatsaber/compare/v1.4.3...v1.4.4) (2024-07-17)


### Bug Fixes

* use native fetch ([30aa353](https://github.com/beat-forge/init-beatsaber/commit/30aa35394eddc842469e2f1ae64ba4b028545c5d))

## [1.4.3](https://github.com/beat-forge/init-beatsaber/compare/v1.4.2...v1.4.3) (2024-07-17)


### Bug Fixes

* bundling again again ([9bdf6c3](https://github.com/beat-forge/init-beatsaber/commit/9bdf6c3ca2c34f892d5aceb4d009b99fd6fcc254))
* the final bundle ([1a81a58](https://github.com/beat-forge/init-beatsaber/commit/1a81a58447bbc7a318181aa1afa368ae2abb1fa6))
* update bundle workflow to fetch full history ([0f2ad2f](https://github.com/beat-forge/init-beatsaber/commit/0f2ad2fc841d9e7c2bbbbc78b26149d3e6b934ae))
* update release workflow to use RELEASE_GITHUB_TOKEN ([c7a6cad](https://github.com/beat-forge/init-beatsaber/commit/c7a6cad9f975b661dac33afcdfa0470d34121ee1))
* who needs local CI testing right? ([fe1342f](https://github.com/beat-forge/init-beatsaber/commit/fe1342f85f8b763653c3aebce7f02e1c1cdb2e69))

## [1.4.2](https://github.com/beat-forge/init-beatsaber/compare/v1.4.1...v1.4.2) (2024-07-17)


### Bug Fixes

* bundling ([a4d329d](https://github.com/beat-forge/init-beatsaber/commit/a4d329db7679c8981104f1bfc1435630e924b98b))
* bundling again ([a30b6ab](https://github.com/beat-forge/init-beatsaber/commit/a30b6abf78c93d911c9834792ec5cec6771c4ac3))

## [1.4.1](https://github.com/beat-forge/init-beatsaber/compare/v1.4.0...v1.4.1) (2024-07-17)


### Bug Fixes

* force build ([9da0df6](https://github.com/beat-forge/init-beatsaber/commit/9da0df6a3d1473b7ac2c1caa7b2039d7909cc857))

## [1.4.0](https://github.com/beat-forge/init-beatsaber/compare/v1.3.0...v1.4.0) (2024-07-17)


### Features

* add host flag for customizable git URL + refactor ([b3f3198](https://github.com/beat-forge/init-beatsaber/commit/b3f3198f38b5860d5f60355c67798da0572296ab))


### Bug Fixes

* regression in functionality vs documentation ([4f3ad6b](https://github.com/beat-forge/init-beatsaber/commit/4f3ad6b784d8c47c856d31f15e71fcbca8dd0869))

## [1.3.0](https://github.com/beat-forge/init-beatsaber/compare/v1.2.1...v1.3.0) (2024-07-17)


### Features

* switch from file downloading to branch downloading ([31da1cd](https://github.com/beat-forge/init-beatsaber/commit/31da1cdd178cc22d7ef5ffc51b7fdcc101ebe29c))


### Bug Fixes

* update tar extraction to filter only 'data/' paths ([bd649f8](https://github.com/beat-forge/init-beatsaber/commit/bd649f83772e8f77c1dd6219a62402a3be75ccb0))
* update tar extraction to filter only 'data/' paths and use `version` instead of `versions`. ([6c5ce9c](https://github.com/beat-forge/init-beatsaber/commit/6c5ce9c8ae497572b7ea5dc985ff431549bb9ae8))

## [1.2.1](https://github.com/beat-forge/init-beatsaber/compare/v1.2.0...v1.2.1) (2023-09-11)


### Bug Fixes

* identify ci ([1ba2d92](https://github.com/beat-forge/init-beatsaber/commit/1ba2d9278107040a6a90be8217becfdb3224c967))

## [1.2.0](https://github.com/beat-forge/init-beatsaber/compare/v1.1.1...v1.2.0) (2023-09-11)


### Features

* init ([f323b53](https://github.com/beat-forge/init-beatsaber/commit/f323b535ec0c9f308447bc97e294cb4bca1d54cd))


### Bug Fixes

* `checkout` ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))
* just a bump to release the action ([2ada7b9](https://github.com/beat-forge/init-beatsaber/commit/2ada7b9de7bd19371f590a4abea44b51655fc9e2))
* my dyslexia ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))
* proper `raw.githubusercontent.com` link ([0e525e8](https://github.com/beat-forge/init-beatsaber/commit/0e525e85a0f358cbfe2366b326cfff1512d3f6b5))
* tag subversions ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))


### Performance Improvements

* switch to `bun`! (node runtime, for now.) ([1c4c5ed](https://github.com/beat-forge/init-beatsaber/commit/1c4c5ed7ed22f30bea7f01f82f37693b88d2b6d0))

## [1.1.1](https://github.com/beat-forge/init-beatsaber/compare/v1.1.0...v1.1.1) (2023-09-11)


### Bug Fixes

* `checkout` ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))
* just a bump to release the action ([2ada7b9](https://github.com/beat-forge/init-beatsaber/commit/2ada7b9de7bd19371f590a4abea44b51655fc9e2))
* my dyslexia ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))
* tag subversions ([8879ee4](https://github.com/beat-forge/init-beatsaber/commit/8879ee41e3ef324bb989f71e4af22461c7fd8f90))


### Performance Improvements

* switch to `bun`! (node runtime, for now.) ([1c4c5ed](https://github.com/beat-forge/init-beatsaber/commit/1c4c5ed7ed22f30bea7f01f82f37693b88d2b6d0))

## [1.1.1](https://github.com/beat-forge/init-beatsaber/compare/v1.1.0...v1.1.1) (2023-09-11)


### Bug Fixes

* just a bump to release the action ([2ada7b9](https://github.com/beat-forge/init-beatsaber/commit/2ada7b9de7bd19371f590a4abea44b51655fc9e2))


### Performance Improvements

* switch to `bun`! (node runtime, for now.) ([1c4c5ed](https://github.com/beat-forge/init-beatsaber/commit/1c4c5ed7ed22f30bea7f01f82f37693b88d2b6d0))

## [1.1.0](https://github.com/beat-forge/init-beatsaber/compare/v1.0.0...v1.1.0) (2023-08-31)


### Features

* init ([f323b53](https://github.com/beat-forge/init-beatsaber/commit/f323b535ec0c9f308447bc97e294cb4bca1d54cd))


### Bug Fixes

* proper `raw.githubusercontent.com` link ([0e525e8](https://github.com/beat-forge/init-beatsaber/commit/0e525e85a0f358cbfe2366b326cfff1512d3f6b5))

## 1.0.0 (2023-08-31)


### Features

* init ([f323b53](https://github.com/beat-forge/init-beatsaber/commit/f323b535ec0c9f308447bc97e294cb4bca1d54cd))
