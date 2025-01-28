import fs from 'fs';
import path from 'path';
import { Server } from 'engine.io';
import { DataSource } from 'typeorm';
import { container } from 'tsyringe';

import { APP } from '@config';

import { Di } from '@enums/Di';
import { Dependency } from '@enums/Dependency';

export const setupDi = async () => {
    log.debug({
        dependency: Dependency.tsyringe,
        message: 'Registering primary dependencies...',
    });

    await registerDependenciesByInterfaces({
        sourceFiles: {
            dirname: 'repositories',
            excludedFilenames: ['BaseRepository'],
        },
        interfacesDirname: 'repositories',
    });

    await registerDependenciesByInterfaces({
        sourceFiles: {
            dirname: 'factories',
            excludedFilenames: [],
        },
        interfacesDirname: 'factories',
    });

    return {
        registerExternalDependencies,
    };
};

function registerExternalDependencies(dependencies: {
    engineIO?: Server;
    dataSource?: DataSource;
}) {
    log.debug({
        dependency: Dependency.tsyringe,
        message: 'Registering optional dependencies...',
    });

    const { engineIO, dataSource } = dependencies;

    if (engineIO) {
        container.register(Di.EngineIO, { useValue: engineIO });
    }

    if (dataSource) {
        container.register(Di.DataSource, { useValue: dataSource });
    }
}

function registerDependenciesByInterfaces(config: {
    sourceFiles: { dirname: string; excludedFilenames: string[] };
    interfacesDirname: string;
}) {
    const {
        sourceFiles: { dirname, excludedFilenames },
        interfacesDirname,
    } = config;

    const dependencyInterfacePath = path.join(APP.BASE_DIR, 'types', interfacesDirname);

    const dir = path.join(APP.BASE_DIR, dirname);

    return new Promise(resolve => {
        fs.readdir(dir, async (error, files) => {
            for (const file of files) {
                const dependencyFilename = file.includes('.') ? file.split('.')[0] : file;

                if (excludedFilenames.includes(dependencyFilename)) {
                    continue;
                }

                const interfaceName = `I${dependencyFilename}`;

                if (
                    fs.existsSync(
                        path.join(dependencyInterfacePath, `${interfaceName}.${APP.BASE_DIR === 'dist' ? 'js' : 'ts'}`)
                    )
                ) {
                    const module = await import(`@${dirname}/${dependencyFilename}`);

                    const Dependency = module[dependencyFilename];

                    container.register(interfaceName, Dependency);
                } else {
                    log.error({
                        message: `Failed to register ${dependencyFilename}!`,
                        dependency: Dependency.tsyringe,
                    });
                }
            }

            resolve('');
        });
    });
}
