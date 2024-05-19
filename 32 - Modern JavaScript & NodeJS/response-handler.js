import fs from 'fs/promises';

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resHandler = (req, res, next) => {
  res.sendFile(join(__dirname, 'my-page.html'));
};

const resHandler2  = (req, res, next) => {  
  fs.readFile('my-page.html', 'utf8')
  .then(data => res.send(data))
  .catch(err => console.log(err));
};

export { resHandler, resHandler2 };