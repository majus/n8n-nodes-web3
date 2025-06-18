import { INodeProperties } from 'n8n-workflow';

export const Blockchains = [
	{
		name: 'Ethereum Mainnet',
		value: 'mainnet',
	},
	{
		name: 'Testnet: Ethereum Sepolia',
		value: 'sepolia',
	},
	{
		name: 'Testnet: Ethereum Holesky',
		value: 'holesky',
	},
	{
		name: 'Arbitrum Mainnet',
		value: 'arbitrum',
	},
	{
		name: 'Testnet: Arbitrum Sepolia',
		value: 'arbitrum-sepolia',
	},
	{
		name: 'Optimism Mainnet',
		value: 'optimism',
	},
	{
		name: 'Testnet: Optimism Sepolia',
		value: 'optimism-sepolia',
	},
	{
		name: 'Base Mainnet',
		value: 'base',
	},
	{
		name: 'Testnet: Base Sepolia',
		value: 'base-sepolia',
	},
	{
		name: 'Linea Mainnet',
		value: 'linea',
	},
	{
		name: 'Testnet: Linea Sepolia',
		value: 'linea-sepolia',
	},
	{
		name: 'BNB Chain Mainnet',
		value: 'bnb',
	},
	{
		name: 'Testnet: BNB Chain Testnet',
		value: 'bnbt',
	},
	{
		name: 'Custom',
		endpoint: '',
		value: '',
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
		hint: 'The default RPC endpoints are provided as a highly-throttled, so consider using a custom RPC endpoint',
	},
	CustomRPC: {
		displayName: 'Custom RPC',
		name: 'rpc',
		type: 'string',
		default: '',
		description: 'Custom blockchain RPC endpoint URL',
		displayOptions: {
			show: {
				'chain': [''],
			},
		},
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
