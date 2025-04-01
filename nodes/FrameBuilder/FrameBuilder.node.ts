// @ts-nocheck
import { JSDOM } from 'jsdom';
import { IExecuteFunctions } from 'n8n-core';
import {
	INodeType,
	INodeExecutionData,
	INodeTypeDescription,
	IN8nHttpFullResponse,
} from 'n8n-workflow';

export class FrameBuilder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Farcaster: Frame builder',
		name: 'frameBuilder',
		icon: 'file:FrameBuilder.svg',
		group: ['transform', 'output'],
		version: 1,
		description: 'Generates Framecaster HTML with meta tags for provided frame parameters',
		defaults: {
			name: 'Frame builder',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Image',
				name: 'image',
				type: 'string',
				required: true,
				default: '',
				description: 'URL of frame image',
			},
			{
				displayName: 'Open Frames Support',
				name: 'openFrames',
				type: 'boolean',
				default: true,
				description: 'Whether to include additional tags to conform to the Open Frames specification',
				hint: 'Refer the <a href="https://github.com/open-frames/standard" target="_blank">Open Frames</a> standard for details.'
			},
			{
				displayName: 'Buttons',
				name: 'buttons',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'items',
						displayName: 'Button N',
						values: [
							{
								displayName: 'Label',
								name: 'label',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Action',
								name: 'action',
								type: 'options',
								options: [
									{
										name: 'Link',
										value: 'link',
									},
									{
										name: 'Mint',
										value: 'mint',
									},
									{
										name: 'Post',
										value: 'post',
									},
									{
										name: 'Redirect',
										value: 'post_redirect',
									},
									{
										name: 'Transaction',
										value: 'tx',
									},
								],
								default: 'link',
								required: true,
								// description: 'Button action',
							},
							{
								displayName: 'Action Target',
								name: 'target',
								type: 'string',
								default: '',
								// description: 'Action target',
							},
							{
								displayName: 'Post URL',
								name: 'postUrl',
								type: 'string',
								default: '',
								description: 'Custom Post URL',
							},
						],
					},
				],
				// description: '',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Aspect Ratio',
						name: 'imageAspectRatio',
						type: 'options',
						options: [
							{
								name: '1.91:1',
								value: '1.91:1',
							},
							{
								name: '1:1',
								value: '1:1',
							},
						],
						default: '1.91:1',
						description: 'Image aspect ratio',
					},
					{
						displayName: 'Input',
						name: 'inputTextLabel',
						type: 'string',
						default: '',
						description: 'Text input label',
					},
					{
						displayName: 'Callback URL',
						name: 'postUrl',
						type: 'string',
						default: '',
						description: 'Signature Packet receiver endpoint URL',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'json',
						default: '{}',
						description: 'JSON representation of state passed to the frame server',
					},
					{
						displayName: 'HTML Template',
						name: 'template',
						type: 'string',
						typeOptions: {
							editor: 'htmlEditor',
						},
						default: '<!DOCTYPE html>\n<html>\n\t<head></head>\n\t<body></body>\n</html>',
						noDataExpression: true,
						description: 'HTML template to embed meta tags into',
					},
					{
						displayName: 'Custom Meta',
						name: 'customMeta',
						type: 'fixedCollection',
						default: [],
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								name: 'items',
								displayName: 'Button N',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Custom meta tag name',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Custom meta tag value',
									},
								],
							},
						],
					},
					{
						displayName: 'Version',
						name: 'version',
						type: 'string',
						default: 'vNext',
						description: 'Version of the Frame',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = items.map((item, i) => {
			const image = this.getNodeParameter('image', i) as string;
			const buttons = this.getNodeParameter('buttons', i) as [any];
			const openFrames = this.getNodeParameter('openFrames', i) as boolean;
			const {
				imageAspectRatio = '1.91:1',
				inputTextLabel,
				postUrl,
				state,
				template,
				customMeta,
				version = 'vNext',
			} = this.getNodeParameter('additionalFields', i) as IDataObject;
			const dom = new JSDOM(template);
			const document = dom.window.document;
			function addMetaTag(name: string, value: string) {
				const meta = document.createElement('meta');
				meta.name = name;
				meta.content = value;
				document.head.append(meta);
			}
			addMetaTag('fc:frame', version);
			addMetaTag('og:image', image);
			addMetaTag('fc:frame:image', image);
			addMetaTag('fc:frame:image:aspect_ratio', imageAspectRatio);
			if (openFrames) {
				/** @see {@link https://github.com/open-frames/standard?tab=readme-ov-file#required-properties} */
				// The version label of the Open Frames spec
				// Currently the only supported version is "vNext"
				addMetaTag('of:version', 'vNext');
				addMetaTag('of:accepts', 'vNext');
				addMetaTag('of:image', image);
				addMetaTag('of:image:aspect_ratio', imageAspectRatio);
				addMetaTag('of:accepts:farcaster', version);
				//TODO: Maybe also support "of:accepts:anonymous"?
				//TODO: Maybe also support "of:image:alt"?
			}
			if (postUrl) {
				addMetaTag('fc:frame:post_url', postUrl);
				if (openFrames) {
					addMetaTag('of:post_url', postUrl);
				}
			}
			if ('items' in buttons) {
				buttons.items.forEach((button, i) => {
					addMetaTag(`fc:frame:button:${i + 1}`, button.label);
					addMetaTag(`fc:frame:button:${i + 1}:action`, button.action);
					if (openFrames) {
						addMetaTag(`of:button:${i + 1}`, button.label);
						addMetaTag(`of:button:${i + 1}:action`, button.action);
					}
					if (button.target) {
						addMetaTag(`fc:frame:button:${i + 1}:target`, button.target);
						if (openFrames) {
							addMetaTag(`of:button:${i + 1}:target`, button.target);
						}
					}
					if (button.postUrl) {
						addMetaTag(`fc:frame:button:${i + 1}:post_url`, button.postUrl);
						if (openFrames) {
							addMetaTag(`of:button:${i + 1}:post_url`, button.postUrl);
						}
					}
				});
			}
			if (inputTextLabel) {
				addMetaTag('fc:frame:input:text', inputTextLabel);
				if (openFrames) {
					addMetaTag('of:input:text', inputTextLabel);
				}
			}
			if (state && state !== '{}') {
				addMetaTag('fc:frame:state', state);
				if (openFrames) {
					addMetaTag('of:state', state);
				}
			}
			customMeta?.items.forEach(({ name, value }) => addMetaTag(name, value));
			const html = dom.serialize();
			return { json: { html } } as INodeExecutionData;
		});
		return [returnData];
	}
}
