// @ts-nocheck
import { IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeExecutionData, INodeTypeDescription } from 'n8n-workflow';
import { ethers } from 'ethers';
import { Blockchains, Property } from './commons';

export class EthereumTxExecutor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ethereum: Transaction executor',
		name: 'ethereumTxExecutor',
		icon: 'file:EthereumTxExecutor.svg',
		group: ['transform', 'output'],
		version: 1,
		description: 'Execute Ethereum transaction',
		defaults: {
			name: 'Execute Transaction',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ethereumApi',
				required: true,
			},
		],
		properties: [
			{ ...Property.Blockchain, required: true },
			{ ...Property.Recipient, required: true },
			Property.Value,
			{ ...Property.Nonce, required: true },
			{ ...Property.Calldata, required: true },
			{ ...Property.Signature, required: true },
			{ ...Property.GasLimit, required: true },
			// {
			// 	displayName: 'Additional Fields',
			// 	name: 'additionalFields',
			// 	type: 'collection',
			// 	placeholder: 'Add Field',
			// 	default: {},
			// },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const account = await this.getCredentials('ethereumApi');
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			const chain = this.getNodeParameter('chain', i) as string;
			const recipient = this.getNodeParameter('recipient', i) as string;
			const value = this.getNodeParameter('value', i) as string;
			const nonce = this.getNodeParameter('nonce', i) as number;
			const signature = this.getNodeParameter('signature', i) as string;
			const data = this.getNodeParameter('calldata', i) as string;
			const gasLimit = this.getNodeParameter('gasLimit', i) as number;
			const endpoint = Blockchains.find((b) => b.value === chain).endpoint;
			const provider = new ethers.getDefaultProvider(endpoint);
			const signer = new ethers.Wallet(account.privateKey, provider);
			const tx = await signer.sendTransaction({
				to: recipient,
				nonce,
				gasLimit: gasLimit || undefined,
				// maxPriorityFeePerGas: ???,
				// maxFeePerGas: ???,
				data,
				value: value && ethers.parseEther(value.toString()),
			});
			console.log('Tx hash:', tx.hash);
			const receipt = await tx.wait(1, 60000);
			returnData.push({ json: { receipt } } as INodeExecutionData);
		}
		return [returnData];
	}
}
