import apps from './apps';
import { runCommand } from './run-command';

async function runInstall(): Promise<void> {
    for (let app of apps) {
        let name: string;
        let mode: 'install' | 'install+build';
        if (typeof app === 'string') {
            name = app;
            mode = 'install';
        } else {
            name = app.name;
            mode = app.mode as 'install' | 'install+build';
        }
        await runCommand('npm i', name);
        if(mode === 'install+build') {
            await runCommand('npm run build', name);
        }
    }
}

runInstall().then(() => {
    console.log('installed all apps');
});
