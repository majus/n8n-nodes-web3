// @ts-nocheck
import { IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeExecutionData, INodeTypeDescription } from 'n8n-workflow';
import { ethers } from 'ethers';
import { Blockchains, Property } from './commons';

export class EthereumTxBuilder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ethereum: Transaction builder',
		name: 'ethereumTxBuilder',
		icon: 'file:EthereumTxBuilder.svg',
		group: ['transform', 'output'],
		version: 1,
		description: 'Generate Ethereum transaction data',
		defaults: {
			name: 'Build Transaction',
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
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					Property.Abi,
					Property.SmartContractAddress,
					Property.SmartContractMethod,
					Property.SmartContractMethodArgs,
				],
			},
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
			const { contractAbi, contractAddress, contractMethod, contractArgs } = this.getNodeParameter(
				'additionalFields',
				i,
			) as IDataObject;
			let data = null;
			if (contractAbi) {
				const contract = new ethers.Contract(contractAddress, contractAbi, provider);
				data = contract.interface.encodeFunctionData(contractMethod, contractArgs);
			}
			const endpoint = Blockchains.find((b) => b.value === chain).endpoint;
			const provider = new ethers.getDefaultProvider(endpoint);
			const signer = new ethers.Wallet(account.privateKey, provider);
			const nonce = await signer.getNonce();
			const signature = await signer.signTransaction({
				to: recipient,
				nonce,
				data,
				value: value && ethers.parseEther(value.toString()),
			});
			returnData.push({ json: { recipient, signature, nonce, data, value } } as INodeExecutionData);
		}
		return [returnData];
	}
}
