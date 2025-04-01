// @ts-nocheck
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { Squid } from '@0xsquid/sdk';
// import { ethers } from 'ethers';

export class SquidRouter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Squid Router',
		name: 'squidRouter',
		group: ['transform', 'output'],
		version: 1,
		description: 'Squid Router action',
		icon: 'file:SquidRouter.svg',
		defaults: {
			name: 'Squid Router action',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'squidApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Build Swap Route',
						value: 'route',
					},
					{
						name: 'Execute Swap',
						value: 'execute',
					},
					{
						name: 'Get Swap Status',
						value: 'status',
					},
					{
						name: 'List Chains',
						value: 'chains',
					},
					{
						name: 'List Tokens',
						value: 'tokens',
					},
				],
				default: 'route',
				required: true,
				description: 'Format of the response output',
			},
			{
				displayName: 'Sender Address',
				name: 'sender',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			{
				displayName: 'Recipient Address',
				name: 'recipient',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			{
				displayName: 'Source Chain ID',
				name: 'sourceChain',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			{
				displayName: 'Target Chain ID',
				name: 'targetChain',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			{
				displayName: 'Source Token Address',
				name: 'sourceToken',
				// eslint-disable-next-line n8n-nodes-base/node-param-type-options-password-missing
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			{
				displayName: 'Target Token Address',
				name: 'targetToken',
				// eslint-disable-next-line n8n-nodes-base/node-param-type-options-password-missing
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					numberPrecision: 8,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			{
				displayName: 'Slippage',
				name: 'slippage',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
			//TODO: Make optional
			{
				displayName: 'Enable Boost',
				name: 'boost',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['route'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const outputs = [];
		const items = this.getInputData();
		const { integrator } = await this.getCredentials('squidApi');
		const squid = new Squid({
			baseUrl: 'https://apiplus.squidrouter.com',
			// @ts-ignore
			integratorId: integrator,
		});
		await squid.init();
		for (let index = 0; index < items.length; index++) {
			try {
				const operation = this.getNodeParameter('operation', index, '') as string;
				switch (operation) {
					case 'route':
						{
							const sender = this.getNodeParameter('sender', index, '') as string;
							const recipient = this.getNodeParameter('recipient', index, '') as string;
							const sourceChain = this.getNodeParameter('sourceChain', index, '') as string;
							const targetChain = this.getNodeParameter('targetChain', index, '') as string;
							const sourceToken = this.getNodeParameter('sourceToken', index, '') as string;
							const targetToken = this.getNodeParameter('targetToken', index, '') as string;
							const amount = this.getNodeParameter('amount', index, 0) as number;
							const boost = this.getNodeParameter('boost', index) as boolean;
							const slippage = this.getNodeParameter('boost', index) as number;
							const response = await squid.getRoute({
								fromAddress: sender,
								fromChain: sourceChain,
								fromToken: sourceToken,
								fromAmount: String(amount * 10 ** 18),
								toChain: targetChain,
								toToken: targetToken,
								toAddress: recipient,
								slippage,
								enableBoost: boost,
								//TODO: quoteOnly?: boolean;
								//TODO: preHook?: Hook;
								//TODO: postHook?: Omit<Hook, "fundAmount" | "fundToken">;
								//TODO: prefer?: DexName[];
								//TODO: receiveGasOnDestination?: boolean;
								//TODO: fallbackAddresses?: FallbackAddress[];
								//TODO: bypassGuardrails?: boolean;
								//TODO: onChainQuoting?: boolean;
								// @ts-ignore
								enableForecall: true,
								// @ts-ignore
								slippageConfig: { autoMode: 1 },
							});
							outputs.push({ json: response });
						}
						break;
					case 'execute':
						break;
					case 'status':
						break;
					case 'chains':
						for (const json of squid.chains) {
							outputs.push({ json });
						}
						break;
					case 'tokens':
						for (const json of squid.tokens) {
							outputs.push({ json });
						}
						break;
					default:
						// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
						throw new Error(`Unsupported action: ${operation}`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const [{ json }] = this.getInputData(index);
					items.push({ json, error, pairedItem: index });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = index;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: index,
					});
				}
			}
		}
		// @ts-ignore
		return this.prepareOutputData(outputs);
	}
}
