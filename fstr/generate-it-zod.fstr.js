const recipe = {
  name: "generate-it-zod",
  scripts: {
    before: "rm -rf ../tpl ../modified-tpl ../proj && mkdir ../tpl ../modified-tpl ../proj", // This is needed because of bug/feature
  },
  recipes: [
    // Generate-it part
    {
      name: "clone-tpl",
      scripts: {
        after: "git clone https://github.com/acr-lfr/generate-it-typescript-server.git ../tpl"
      }
    },
    {
      name: "modify-tpl",
      from: "../tpl",
      to: "../modified-tpl",
      fileHandler: "scripts/tpl-file-handler.js",
      depends: ["clone-tpl"],
    },
    {
      name: "generate-it",
      scripts: {
        after: "cd ../proj && npm init -y && npm i -D generate-it && npx generate-it --dont-run-comparison-tool --yes -m -t ../modified-tpl ../spec/swagger.yml",
      },
      depends: ["modify-tpl"],
    },

    // Zod part
    {
      name: "generate-zodios",
      scripts: {
        after: "cd ../proj && mkdir -p ./src/interfaces && npm i -D openapi-zod-client && npx openapi-zod-client ../spec/swagger.yml -o ./src/interfaces/oas.ts --export-schemas",
      },
    },

    // Clean up
    {
      name: "clean-up",
      scripts: {
        after: "rm -rf ../tpl ../modified-tpl",
      },
      depends: ["generate-it", "generate-zodios"],
    }
  ]
}

console.log(JSON.stringify(recipe))
