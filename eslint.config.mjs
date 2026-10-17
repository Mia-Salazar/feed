import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const frameworkImports = [
  "react",
  "react-dom",
  "react/**",
  "react-redux",
  "next",
  "next/**",
  "@reduxjs/**",
];

const interfaceBan = {
  group: ["@/api/**"],
  message: "Only a page requests data. The rest of the interface uses domain entities.",
};

const outward = ["molecules", "organisms", "templates", "pages"];

function restrict(files, patterns) {
  return {
    files,
    rules: {
      "no-restricted-imports": ["error", { patterns }],
    },
  };
}

function listed(items) {
  if (items.length < 3) {
    return items.join(" or ");
  }

  return `${items.slice(0, -1).join(", ")}, or ${items.at(-1)}`;
}

const layerBans = ["atoms", "molecules", "organisms", "templates"].map((layer, index) => {
  const blocked = outward.slice(index);
  const article = layer.startsWith("a") || layer.startsWith("o") ? "An" : "A";

  return restrict([`src/presentation/${layer}/**/*.{ts,tsx}`], [
    interfaceBan,
    {
      group: blocked.map((name) => `@/presentation/${name}/**`),
      message: `${article} ${layer.slice(0, -1)} does not depend on ${listed(blocked)}.`,
    },
  ]);
});

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  restrict(["src/domain/**/*.{ts,tsx}"], [
    {
      group: [...frameworkImports, "@/api/**", "@/presentation/**", "@/app/**", "@/store/**"],
      message: "The domain depends only on itself.",
    },
  ]),
  restrict(["src/api/**/*.{ts,tsx}"], [
    {
      group: [...frameworkImports, "@/presentation/**", "@/app/**"],
      message: "API requests map responses into domain entities. They do not know the interface.",
    },
  ]),
  restrict(["src/presentation/**/*.{ts,tsx}"], [interfaceBan]),
  ...layerBans,
  restrict(["src/presentation/pages/**/*.{ts,tsx}"], [
    {
      group: ["@/app/**"],
      message: "A page does not import the Next.js route that renders it.",
    },
  ]),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
