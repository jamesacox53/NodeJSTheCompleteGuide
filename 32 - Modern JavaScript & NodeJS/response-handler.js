// import fs from 'fs';

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resHandler = (req, res, next) => {
  res.sendFile(join(__dirname, 'my-page.html'));  
  
  // fs.readFile('my-page.html', 'utf8', (err, data) => {
      // res.send(data);
    // });
};

export default resHandler;