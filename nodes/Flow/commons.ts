import { INodeProperties } from 'n8n-workflow';

const Template: INodeProperties = {
	displayName: 'Template',
	name: 'template',
	type: 'json',
	default: '',
	required: true,
	description: 'FLIX template',
};

const Arguments: INodeProperties = {
	displayName: 'Arguments',
	name: 'argsList',
	// type: 'assignmentCollection',
	type: 'fixedCollection',
	default: [],
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			name: 'items',
			displayName: 'Argument',
			values: [
				// {
				// 	displayName: 'Type',
				// 	name: 'type',
				// 	type: 'options',
				// 	// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				// 	options: [
				// 		{ name: 'String', value: 'String' },
				// 		{ name: 'Address', value: 'Address' },
				// 		{ name: 'UInt', value: 'UInt' },
				// 		{ name: 'UInt8', value: 'UInt8' },
				// 		{ name: 'UInt16', value: 'UInt16' },
				// 		{ name: 'UInt32', value: 'UInt32' },
				// 		{ name: 'UInt64', value: 'UInt64' },
				// 		{ name: 'UInt128', value: 'UInt128' },
				// 		{ name: 'UInt256', value: 'UInt256' },
				// 		{ name: 'Int', value: 'Int' },
				// 		{ name: 'Int8', value: 'Int8' },
				// 		{ name: 'Int16', value: 'Int16' },
				// 		{ name: 'Int32', value: 'Int32' },
				// 		{ name: 'Int64', value: 'Int64' },
				// 		{ name: 'Int128', value: 'Int128' },
				// 		{ name: 'Int256', value: 'Int256' },
				// 		{ name: 'Word8', value: 'Word8' },
				// 		{ name: 'Word16', value: 'Word16' },
				// 		{ name: 'Word32', value: 'Word32' },
				// 		{ name: 'Word64', value: 'Word64' },
				// 		{ name: 'UFix64', value: 'UFix64' },
				// 		{ name: 'Fix64', value: 'Fix64' },
				// 		{ name: 'Character', value: 'Character' },
				// 		{ name: 'Bool', value: 'Bool' },
				// 	],
				// 	required: true,
				// 	default: 'String',
				// 	description: 'Argument type',
				// },
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'Argument value',
				},
				// {
				// 	displayName: 'Optional',
				// 	name: 'optional',
				// 	type: 'boolean',
				// 	default: false,
				// 	description: 'Whether value is optional',
				// },
			],
		},
	],
	hint: 'Preserve the same number and order of aguments as in the template definition',
};

const ArgumentsField: INodeProperties = {
	displayName: 'Arguments Field',
	name: 'argsField',
	type: 'string',
	default: 'args',
	description: 'The value of this field from the previous node output will be used',
	hint: 'The field must hold a plain array of arguments',
};

const Limit: INodeProperties = {
	displayName: 'Gas Limit',
	name: 'gasLimit',
	type: 'number',
	typeOptions: {
		minValue: 0,
	},
	default: 500,
	description: 'Gas limit in FLOW for the transaction execution',
};

export const Property: Record<string, INodeProperties> = {
	Template,
	Arguments,
	ArgumentsField,
	Limit,
};
