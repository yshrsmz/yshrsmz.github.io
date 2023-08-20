import { loadEnv } from 'vitepress'

const env = loadEnv('', process.cwd())

console.log(env)
