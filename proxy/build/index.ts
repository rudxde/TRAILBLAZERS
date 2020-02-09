import { render } from 'mustache';
import { readFileSync, writeFileSync } from 'fs';
import { environment } from '@tb/environment/dist/service';

const template = readFileSync('nginx.conf.template').toString();

if(process.env.DEBUG) {
    console.warn('building nginx.conf in debug mode');
    environment.isDebug = true;
}

const rendered = render(template, environment);

writeFileSync('nginx.conf', rendered);
