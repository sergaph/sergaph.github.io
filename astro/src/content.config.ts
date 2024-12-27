import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/pages/post"}),
});

export const collections = { posts };