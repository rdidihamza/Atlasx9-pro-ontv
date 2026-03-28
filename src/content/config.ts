import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    description:  z.string(),
    slug:         z.string().optional(),
    keyword:      z.string().optional(),
    date:         z.string(),
    dateModified: z.string().optional(),
    author:       z.string().default('Atlas Pro ONTV'),
    tags:         z.array(z.string()).default([]),
    category:     z.string().default('Guide IPTV'),
    image:        z.string().optional(),
    canonical:    z.string().optional(),
    noindex:      z.boolean().default(false),
    schema:       z.object({
      type:        z.string().optional(),
      name:        z.string().optional(),
      description: z.string().optional(),
      author:      z.string().optional(),
      publisher:   z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog };
