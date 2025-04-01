import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { flowMutate } from './utils';
import { Property } from './commons';
import { isString } from 'lodash';

export class FlowChainMutate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'The Flow Mutate',
		name: 'flowChainMutate',
		group: ['transform', 'output'],
		version: 1,
		description: 'Call mutate script on the Flow blockchain (Testnet)',
		icon: 'file:flow.svg',
		defaults: {
			name: 'The Flow - Mutate',
		},
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
		outputs: ['main'],
		credentials: [
			{
				name: 'flowChainApi',
				required: true,
			},
		],
		properties: [
			Property.Template,
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				description: 'Additional options',
				options: [
					Property.Arguments,
					Property.ArgumentsField,
					Property.Limit,
				],
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const account = await this.getCredentials('flowChainApi');
		const items = this.getInputData();
		const outputs = [] as INodeExecutionData[];
		// Variables could have different value for each item in case they contain an expression
		for (let index = 0; index < items.length; index++) {
			try {
				const templateRaw = this.getNodeParameter('template', index, '') as string;
				const template = isString(templateRaw) ? JSON.parse(templateRaw) : templateRaw;
				const limit = this.getNodeParameter('gasLimit', index, '') as string;
				const { argsList, argsField } = this.getNodeParameter('options', index) as any;
				// @ts-ignore
				const args = argsList?.items.map(({ value }) => value) ?? items[index].json[argsField];
				const json = await flowMutate(template, args, account, limit);
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
