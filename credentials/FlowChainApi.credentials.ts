import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FlowChainApi implements ICredentialType {
	name = 'flowChainApi';
	displayName = 'Flow Blockchain API';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Account',
			name: 'address',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Key ID',
			name: 'keyId',
			type: 'number',
			default: 0,
		},
		{
			displayName: 'Private key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	supportedNodes = ['flowChainMutate', 'flowChainQuery'];
}
