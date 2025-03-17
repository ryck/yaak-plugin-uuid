import { CallTemplateFunctionArgs, Context, PluginDefinition } from '@yaakapp/api';
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, v6 as uuidv6, v7 as uuidv7 } from 'uuid';


export const plugin: PluginDefinition = {
    templateFunctions: [
        {
            name: "uuid.v1",
            description: "Generates a v1 UUID",
            args: [],
            async onRender(_ctx: Context, args: CallTemplateFunctionArgs): Promise<string | null> {
                return uuidv1();
            },
        },
        {
            name: "uuid.v3",
            description: "Generates a v3 UUID",
            args: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    optional: false,
                },
                {
                    name: "namespace",
                    label: "Namespace",
                    type: "text",
                    defaultValue: uuidv1(),
                    optional: false,

                },
            ],
            async onRender(_ctx: Context, { values }: CallTemplateFunctionArgs): Promise<string | null> {
                if (!values.name || !values.namespace) {
                    console.error('Missing required arguments');
                    return null;
                };

                return uuidv3(values.name, values.namespace);
            },
        },
        {
            name: "uuid.v4",
            description: "Generates a v4 UUID",
            args: [],
            async onRender(_ctx: Context, args: CallTemplateFunctionArgs): Promise<string | null> {
                return uuidv4();
            },
        },
        {
            name: "uuid.v5",
            description: "Generates a v5 UUID",
            args: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    optional: false,
                },
                {
                    name: "namespace",
                    label: "Namespace",
                    type: "text",
                    defaultValue: uuidv1(),
                    optional: false,

                },
            ],
            async onRender(_ctx: Context, { values }: CallTemplateFunctionArgs): Promise<string | null> {
                if (!values.name || !values.namespace) {
                    console.error('Missing required arguments');
                    return null;
                };

                return uuidv5(values.name, values.namespace);
            },
        },
        {
            name: "uuid.v6",
            description: "Generates a v6 UUID",
            args: [],
            async onRender(_ctx: Context, args: CallTemplateFunctionArgs): Promise<string | null> {
                return uuidv6();
            },
        },
        {
            name: "uuid.v7",
            description: "Generates a v7 UUID",
            args: [],
            async onRender(_ctx: Context, args: CallTemplateFunctionArgs): Promise<string | null> {
                return uuidv7();
            },
        },

    ],
};