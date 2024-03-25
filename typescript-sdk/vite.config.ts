import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({ include: ["lib"] })
    ],
    build: {
        copyPublicDir: false,
        lib: {
            fileName: "main",
            entry: resolve(__dirname, "lib/main.ts"),
            formats: ["es"]
        },
        rollupOptions: {
            external: [
                "@kiota-community/kiota-gen",
                "@microsoft/kiota-abstractions",
                "@microsoft/kiota-http-fetchlibrary",
                "@microsoft/kiota-serialization-form",
                "@microsoft/kiota-serialization-json",
                "@microsoft/kiota-authentication-azure",
                "@microsoft/kiota-serialization-text",
                "@microsoft/kiota-serialization-multipart",
                "react",
                "react-dom",
                "react/jsx-runtime"
            ]
        }
    }
});