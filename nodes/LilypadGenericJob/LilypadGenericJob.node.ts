// @ts-nocheck
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { fromPairs } from 'lodash';
import { queueLilypadJob } from '../commons';

export class LilypadGenericJob implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lilypad Generic Job',
		name: 'lilypadGenericJob',
		group: ['transform', 'output'],
		version: 1,
		description: 'Execute custom Lilypad job',
		icon: 'file:Lilypad.svg',
		defaults: {
			name: 'Lilypad job',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'lilypadCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Module',
				name: 'module',
				type: 'string',
				required: true,
				default: 'cowsay:v0.0.3',
			},
			{
				displayName: 'Inputs',
				name: 'inputs',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'items',
						displayName: 'Input',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								required: true,
								default: '',
								description: 'Custom input name',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								typeOptions: {
									rows: 4,
								},
								default: '',
								description: 'Custom input value',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const outputs = [];
		const items = this.getInputData();
		// Variables could have different value for each item in case they contain an expression
		for (let index = 0; index < items.length; index++) {
			try {
				const module = this.getNodeParameter('module', index, '') as string;
				const inputs = this.getNodeParameter('inputs', index) as {
					items: Record<string, string>[];
				};
				const json = await queueLilypadJob(
					this,
					'lilypadCredentialsApi',
					module,
					fromPairs(inputs.items?.map(({ name, value }) => [name, value])),
				);
				outputs.push({ json });
			} catch (error) {
				if (this.continueOnFail()) {
					const { json } = this.getInputData(index)[0];
					items.push({ json, error, pairedItem: index });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property, only append the itemIndex
						error.context.itemIndex = index;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: index,
					});
				}
			}
		}
		return this.prepareOutputData(outputs);
	}
}
