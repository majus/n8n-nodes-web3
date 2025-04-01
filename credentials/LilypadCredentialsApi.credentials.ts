import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LilypadCredentialsApi implements ICredentialType {
	name = 'lilypadCredentialsApi';
	displayName = 'Lilypad Credentials API';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Wallet private key',
			name: 'key',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
