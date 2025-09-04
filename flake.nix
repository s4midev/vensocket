{
  description = "vensocket";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      packages.vensocket = pkgs.stdenv.mkDerivation rec {
        pname = "vensocket";
        version = "1.0.0";

        src = fetchFromGitHub {
          owner = "username";
          repo = "repository";
          rev = "commit-hash";
          sha256 = "sha256-hash";
        };

        buildInputs = [pkgs.nim pkgs.nimPackages.nimble];

        installPhase = ''
          mkdir -p $out/bin
          nim compile --bin $out/bin/my-nim-package
        '';
      };
    });
}
