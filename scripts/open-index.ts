import { cliConfig } from '../lib/config';

const URL = `http://localhost:${cliConfig.port}`
import('open').then(({ default: open }) => {
  setTimeout(() => {
    open(URL);
  }, 1000);
})
