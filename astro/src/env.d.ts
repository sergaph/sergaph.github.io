/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
    readonly PUBLIC_UNSPLASH_CLIENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}