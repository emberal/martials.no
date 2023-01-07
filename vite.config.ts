import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solidPlugin()],
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: "index.html",
                "404": "404.html",
                simplifyTruths: "simplify-truths.html",
            }
        }
    },
});
