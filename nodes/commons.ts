import {
	IExecuteFunctions,
	NodeOperationError,
} from 'n8n-workflow';
import { isObject } from 'lodash';

export function	serializeInputs(inputs: Record<string, string>) {
	return Object.entries(inputs).map(([name, value]) => {
		const sanitized = value.replace(/'/g, "'\\''").replace(/"/g, '\\"');
		return `-i ${name}='${sanitized}'`;
	}).join(' ');
}

export async function queueLilypadJob(node: IExecuteFunctions, credential: string, module: string, inputs: Record<string, string>) {
	const { key } = await node.getCredentials(credential);
	const body = await node.helpers.request({
		url: 'http://js-cli-wrapper.lilypad.tech',
		method: 'POST',
		body: {
			pk: key,
			module,
			inputs: serializeInputs(inputs),
		},
		json: true,
		timeout: 1200000, // 20 minutes
	});
	if (body.error) {
		const error = isObject(body.error) ? JSON.stringify(body.error) : body.error;
		throw new NodeOperationError(node.getNode(), error);
	}
	return body;
}
