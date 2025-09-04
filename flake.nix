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
          owner = "s4midev";
          repo = "vensocket";
          rev = "6dfad41b667a5e7c70c68f693ef3fbb19729b43c";
          sha256 = "6dfad41b667a5e7c70c68f693ef3fbb19729b43c";
        };

        buildInputs = [pkgs.nim pkgs.nimPackages.nimble];

        installPhase = ''
          mkdir -p $out/bin
          nim compile --bin $out/bin/vensocket
        '';
      };
    });
}
