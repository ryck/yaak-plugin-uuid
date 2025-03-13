import { CallTemplateFunctionArgs, Context, PluginDefinition } from '@yaakapp/api';
import { v1 as uuidv1, v4 as uuidv4, v6 as uuidv6, v7 as uuidv7 } from 'uuid';

const algorithms = ['v1', 'v4', 'v6', 'v7'];

export const plugin: PluginDefinition = {
    templateFunctions: algorithms.map(algorithm => ({
        name: `uuid.${algorithm}`,
        description: `Generates a ${algorithm} UUID`,
        args: [],
        async onRender(_ctx: Context, args: CallTemplateFunctionArgs): Promise<string | null> {
            let uuid;
            switch (algorithm) {
                case 'v1':
                    uuid = uuidv1();
                    break;
                case 'v4':
                    uuid = uuidv4();
                    break;
                case 'v6':
                    uuid = uuidv6();
                    break;
                case 'v7':
                    uuid = uuidv7();
                    break;
                default:
                    return null;
            }
            return uuid;

        },
    })),
};