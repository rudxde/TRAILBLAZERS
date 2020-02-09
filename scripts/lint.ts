import apps from './apps';
import { runCommand } from './run-command';

async function runLint(fix: boolean): Promise<void> {
    for (let app of apps) {
        let name: string;
        if (typeof app === 'string') {
            name = app;
        } else {
            name = app.name;
        }
        if (fix) {
            await runCommand('npm run lint -- --fix', name)
                .catch(err => console.error(err));
        } else {
            await runCommand('npm run lint', name)
                .catch(err => console.error(err));
        }
    }
}

const lintFix = process.argv.findIndex(x => x === '--fix') !== -1;
runLint(lintFix).then(() => {
    console.log('linted all apps');
});
