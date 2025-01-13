import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/pages/post" }),
});

const photos360 = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/pages/360" }),
});

export const collections = { posts, photos360 };