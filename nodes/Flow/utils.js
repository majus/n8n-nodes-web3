import * as fcl from '@onflow/fcl';
import * as types from '@onflow/types';
import { sortBy } from 'lodash';
import { Signer } from './signer';

//FIXME: Make it possible to switch dynamically
fcl.config({
	'accessNode.api': 'https://rest-testnet.onflow.org',
	'flow.network': 'testnet',
});

function normalizeArgValue(value) {
	return value === '' ? null : value;
}

function stringToType(type, t) {
	if (type.endsWith('?')) {
		return t.Optional(stringToType(type.substr(0, -1), t));
	} else if (/^[.+?]$/.test(type)) {
		return t.Array(stringToType(type.substr(1, -1), t));
	} else if (type in t) {
		return t[type];
	} else {
		throw new Error(`Unsupported type: ${type}`);
	}
}

function argsWrapper(template, args) {
	if (template.data.parameters) {
		return (arg, t) => sortBy(template.data.parameters, 'index').map((param, index) => {
			const value = normalizeArgValue(args[index]);
			const type = stringToType(param.type, t);
			return arg(value, type);
		});
		// args.map((value/* { value, type, optional } */) =>
		// 	arg(normalizeArgValue(value) , optional ? t.Optional(t[type]) : t[type]),
		// );
	}
}

function accountWrapper(account) {
	const signer = new Signer(account.privateKey);
	return (data) => {
		return {
			...data,
			tempId: `${account.address}-${account.keyId}`,
			addr: fcl.sansPrefix(account.address),
			keyId: Number(account.keyId),
			signingFunction: (signable) => {
				return Promise.resolve({
					f_type: 'CompositeSignature',
					f_vsn: '1.0.0',
					addr: fcl.withPrefix(account.address),
					keyId: Number(account.keyId),
					signature: signer.signWithKey(signable.message),
				});
			},
		};
	};
}

export async function flowQuery(template, args) {
	const result = await fcl.query({
		template,
		args: argsWrapper(template, args),
	});
	return { result };
}

export async function flowMutate(template, args, account, limit) {
	const hash = await fcl.mutate({
		template,
		limit,
		args: argsWrapper(template, args),
		authz: accountWrapper(account),
	});
	const result = await fcl.tx(hash).onceSealed();
	return result;
}
