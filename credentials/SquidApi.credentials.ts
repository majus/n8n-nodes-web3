import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SquidApi implements ICredentialType {
	name = 'squidApi';
	displayName = 'Squid API';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Integrator ID',
			name: 'integrator',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
