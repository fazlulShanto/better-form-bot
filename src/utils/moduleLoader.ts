// import { fileURLToPath } from 'node:url';

import { ICommandModule } from '../commands/commandHandler';

async function loadModule(modulePath: any): Promise<ICommandModule> {
  try {
    const module = await import(modulePath);
    if (module?.default) {
      return module.default as ICommandModule;
    }
    throw new Error('Not a valid module.path:' + modulePath);
  } catch (error) {
    console.error('Error importing module:', error);
    throw error; // Re-throw the error
  }
}

// function pathToFileURL(modulePath) {
//   const fileUrl = new URL('file://' + path.resolve(modulePath));
//   return fileURLToPath(fileUrl);
// }

export default loadModule;
