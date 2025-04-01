// @ts-nocheck
import { IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeExecutionData, INodeTypeDescription } from 'n8n-workflow';

export class EthereumTxBuilder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Farcaster: Transaction builder',
		name: 'ethereumTxBuilder',
		icon: 'file:EthereumTxBuilder.svg',
		group: ['transform', 'output'],
		version: 1,
		description: 'Generates Framecaster frame transaction object',
		defaults: {
			name: 'Build Tx',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Blockchain',
				name: 'chainId',
				type: 'options',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Ethereum',
						value: 'eip155:1',
					},
					{
						name: 'Base',
						value: 'eip155:8453',
					},
					{
						name: 'Optimism',
						value: 'eip155:10',
					},
					{
						name: 'Degen',
						value: 'eip155:666666666',
					},
					{
						name: 'Gnosis',
						value: 'eip155:100',
					},
					{
						name: 'Zora',
						value: 'eip155:7777777',
					},
					{
						name: 'Polygon',
						value: 'eip155:137',
					},
					{
						name: 'Testnet: Ethereum Sepolia',
						value: 'eip155:11155111',
					},
					{
						name: 'Testnet: Arbitrum Sepolia',
						value: 'eip155:421614',
					},
					{
						name: 'Testnet: Base Sepolia',
						value: 'eip155:84532',
					},
					{
						name: 'Testnet: Optimism Sepolia',
						value: 'eip155:11155420',
					},
				],
				required: true,
				default: 'eip155:11155111',
				description: 'Blockchain ID in CAIP-2 format',
			},
			{
				displayName: 'Recipient',
				name: 'recipient',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'string',
				default: 'eth_sendTransaction',
				description: 'A method ID to identify the type of tx request',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				description: 'Transaction ETH value (represented in WEI)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Data',
						name: 'data',
						type: 'string',
						default: '',
						description: 'Transaction calldata',
					},
					{
						displayName: 'ABI',
						name: 'abi',
						type: 'json',
						default: '[]',
						description:
							'JSON ABI which must include encoded function type and should include potential error types',
					},
					{
						displayName: 'Attribution',
						name: 'attribution',
						type: 'boolean',
						default: false,
						description: 'Whether to include the calldata attribution suffix',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			const chainId = this.getNodeParameter('chainId', i) as string;
			const to = this.getNodeParameter('recipient', i) as string;
			const method = this.getNodeParameter('method', i) as string;
			const value = this.getNodeParameter('value', i) as string;
			const { data, abi, attribution } = this.getNodeParameter('additionalFields', i) as IDataObject;
			const json = {
				chainId,
				method,
				attribution,
				params: {
					abi,
					to,
					data,
					value,
				},
			};
			returnData.push({ json } as INodeExecutionData);
		}
		return [returnData];
	}
}
