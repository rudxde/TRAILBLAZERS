import { runCommand } from './run-command';
import { downloadMapTemplate } from './download-map-template';
import { downloadTourTemplate } from './download-tour-template';

// npm run download-map-template ; npm run download-tour-template ; npm run install ; npm run setup

async function setupAll(): Promise<void> {
    await downloadMapTemplate();
    await downloadTourTemplate();
    await runCommand('npm run build-lib-images', '/');
    await runCommand('npm run install-apps', '/');
    await runCommand('npm run setup', '/');
}

setupAll().then(() => console.log('setup:all done'));
