import apps from './apps';
import { runCommand } from './run-command';

async function runUpdate(): Promise<void> {
    for (let app of apps) {
        let name: string;
        if (typeof app === 'string') {
            name = app;
        } else {
            name = app.name;
        }
        await runCommand('npm update', name);
    }
}

runUpdate().then(() => {
    console.log('updated all apps');
});
