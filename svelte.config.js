import adapter from '@sveltejs/adapter-vercel';
import dotenv from 'dotenv';

// Load environment variables from .env file in development mode
const dev = process.argv.includes('dev');
if (dev) {
  dotenv.config();
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: null,
      precompress: false,
      strict: true,
    }),
    alias: {
      '$components/*': './src/lib/components/*',
      '$data/*': './src/data/*',
      '$assets/*': './src/assets/*',
      '$stores/*': './src/lib/stores/*',
      '$utils/*': './src/lib/utils/*',
    },
    paths: {
      base: dev ? '' : process.env.BASE_PATH,
    },
  },
};

export default config;
