import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      
      // Allow unused variables (you might want to be more selective about this)
      "@typescript-eslint/no-unused-vars": "off",
      
      // Allow any type (you might want to be more selective about this)
      "@typescript-eslint/no-explicit-any": "off",
      
      // Allow img elements (though consider using next/image for optimization)
      "@next/next/no-img-element": "off",
      
      // Allow missing dependencies in useEffect
      "react-hooks/exhaustive-deps": "off",
      
      // Allow prefer-const violations
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;