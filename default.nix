{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "bun-dev-env";
  version = "1.0";

  buildInputs = [
    pkgs.nodejs
    pkgs.bun
    pkgs.git
    pkgs.curl
  ];

  shellHook = ''
    echo "Welcome to the Bun development environment!"
  '';
}
