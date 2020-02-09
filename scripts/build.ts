import apps from './apps';
import { runCommand } from './run-command';

async function runBuild(prod: boolean): Promise<void> {
    for (let app of apps) {
        let name: string;
        if (typeof app === 'string') {
            name = app;
        } else {
            name = app.name;
        }
        if (prod) {
            await runCommand('npm run build:prod', name);
        } else {
            await runCommand('npm run build', name);
        }
    }
}

const buildProd = process.argv.findIndex(x => x === '--prod') !== -1;
runBuild(buildProd).then(() => {
    console.log('builded all apps.');
});
