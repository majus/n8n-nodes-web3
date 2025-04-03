import { INodeProperties } from 'n8n-workflow';

export const Blockchains = [
	{
		name: 'Ethereum Mainnet',
		endpoint: 'https://eth-mainnet.g.alchemy.com/v2/Q0PzdW9Z-cVRK5Ji8TsAgboQVhG-kdvt',
		value: 'mainnet',
	},
	{
		name: 'Testnet: Ethereum Sepolia',
		endpoint: 'https://eth-sepolia.g.alchemy.com/v2/Q0PzdW9Z-cVRK5Ji8TsAgboQVhG-kdvt',
		value: 'sepolia',
	},
	{
		name: 'Testnet: Ethereum Holesky',
		endpoint: 'https://eth-holesky.g.alchemy.com/v2/Q0PzdW9Z-cVRK5Ji8TsAgboQVhG-kdvt',
		value: 'holesky',
	},
	{
		name: 'Optimism Mainnet',
		endpoint: 'https://opt-mainnet.g.alchemy.com/v2/Q0PzdW9Z-cVRK5Ji8TsAgboQVhG-kdvt',
		value: 'optimism',
	},
	{
		name: 'Testnet: Optimism Sepolia',
		endpoint: 'https://opt-sepolia.g.alchemy.com/v2/Q0PzdW9Z-cVRK5Ji8TsAgboQVhG-kdvt',
		value: 'optimism-sepolia',
	},
	{
		name: 'Base Mainnet',
		endpoint: 'https://base-mainnet.g.alchemy.com/v2/Q0PzdW9Z-cVRK5Ji8TsAgboQVhG-kdvt',
		value: 'base',
	},
	{
		name: 'Testnet: Base Sepolia',
		endpoint: 'https://base-sepolia.g.alchemy.com/v2/Q0PzdW9Z-cVRK5Ji8TsAgboQVhG-kdvt',
		value: 'base-sepolia',
	},
];

export const Property: Record<string, INodeProperties> = {
	Blockchain: {
		displayName: 'Blockchain',
		name: 'chain',
		type: 'options',
		options: Blockchains,
		default: 'sepolia',
		description: 'Target blockchain',
	},
	Recipient: {
		displayName: 'Recipient Address',
		name: 'recipient',
		type: 'string',
		default: '',
	},
	Value: {
		displayName: 'Value',
		name: 'value',
		type: 'number',
		typeOptions: {
			numberPrecision: 8,
		},
		default: '',
		description: 'Transaction ETH value',
	},
	Abi: {
		displayName: 'ABI',
		name: 'contractAbi',
		type: 'json',
		default: '[]',
		description:
			'JSON ABI which must include encoded method type and should include potential error types',
	},
	SmartContractAddress: {
		displayName: 'Smart Contract Address',
		name: 'contractAddress',
		type: 'string',
		default: '',
	},
	SmartContractMethod: {
		displayName: 'Smart Contract Method Name',
		name: 'contractMethod',
		type: 'string',
		default: '',
	},
	SmartContractMethodArgs: {
		displayName: 'Smart Contract Method Arguments',
		name: 'contractArgs',
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
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Argument value',
					},
				],
			},
		],
		hint: 'Preserve the same number and order of aguments as in the ABI definition',
	},
	Nonce: {
		displayName: 'Nonce',
		name: 'nonce',
		type: 'number',
		default: 0,
		description: 'Transaction nonce',
	},
	GasLimit: {
		displayName: 'Gas Limit',
		name: 'gasLimit',
		type: 'number',
		default: 21000,
		description: 'Gas limit for the transaction',
	},
	Signature: {
		displayName: 'Signature',
		name: 'signature',
		type: 'string',
		default: '',
		required: true,
		description: 'Transaction signature',
	},
	Calldata: {
		displayName: 'Calldata',
		name: 'calldata',
		type: 'string',
		default: '',
		description: 'Transaction calldata',
	},
};
