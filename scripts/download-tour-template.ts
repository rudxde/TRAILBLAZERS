import { runCommand } from './run-command';

export async function downloadTourTemplate(): Promise<void> {
    console.log('Downloading tours template...');
    const downloadHost = ''; // Enter download host
    await runCommand(`wget ${downloadHost}tours.zip`, 'setup/template');
}

downloadTourTemplate().then(() => {
    console.log('Downloaded tours template.');
});
