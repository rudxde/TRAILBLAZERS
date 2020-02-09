import { exec } from 'child_process';
import { cwd } from 'process';

export function runCommand(command: string, subCwd: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const child = exec(command, { cwd: `${cwd()}/${subCwd}` });
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        child.on('exit', exitCode => {
            if (exitCode !== 0 && exitCode !== null) {
                reject(new Error(`child_process exited with code ${exitCode}`));
            } else {
                resolve(exitCode);
            }
        });
    });
}
