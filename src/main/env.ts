
const fs = require('fs');
const port = process.env.port ? Number(process.env.port) : 3000;

const _env = JSON.parse(fs.readFileSync('secure/env.json', 'utf8'));

export const env = function(){
    return _env;
}
