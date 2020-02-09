import { runCommand } from './run-command';

export async function downloadMapTemplate(): Promise<void> {
    console.log('Downloading map template...');
    const downloadHost = ''; // Enter download host
    await runCommand(`wget ${downloadHost}/map-db.zip`, 'setup/template');
}

downloadMapTemplate().then(() => {
    console.log('Downloaded map template.');
});
