import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EthereumApi implements ICredentialType {
	name = 'ethereumApi';
	displayName = 'Ethereum API';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
