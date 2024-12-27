import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/pages/post"}),
});

export const collections = { posts };