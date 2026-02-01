{
  description = "CloudAppsProject1 - Flask + React development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        pythonEnv = pkgs.python312.withPackages (ps: [
          ps.flask
          ps.pymongo
          ps.python-dotenv
          ps.pyjwt
          ps.bcrypt
          ps.flask-mail
        ]);
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            # Python with packages
            pythonEnv

            # Node.js for frontend
            pkgs.nodejs_22

            # Containers
            pkgs.podman
            pkgs.podman-compose

            # Useful tools
            pkgs.uv
          ];

          shellHook = ''
            echo "CloudAppsProject1 Development Environment"
            echo ""
            echo "Backend (Flask):"
            echo "  python app.py           - Run Flask server"
            echo ""
            echo "Frontend (React):"
            echo "  cd frontend && npm install && npm run dev"
            echo ""
            echo "Containers (Podman):"
            echo "  podman-compose up -d    - Start MongoDB container"
            echo "  podman-compose down     - Stop containers"
            echo ""
          '';
        };
      }
    );
}
