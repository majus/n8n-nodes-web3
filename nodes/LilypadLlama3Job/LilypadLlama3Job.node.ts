// @ts-nocheck
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { omitBy } from 'lodash';
import { queueLilypadJob } from '../commons';

export class LilypadLlama3Job implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lilypad Llama3 Job',
		name: 'lilypadLlama3Job',
		group: ['transform', 'output'],
		version: 1,
		description: 'Execute Lilypad llama3 job',
		icon: 'file:Lilypad.svg',
		defaults: {
			name: 'Lilypad llama3 job',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'lilypadCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Module',
				name: 'module',
				type: 'string',
				required: true,
				default: 'ollama-pipeline:llama3-8b-lilypad1',
			},
			{
				displayName: 'System',
				name: 'system',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'System message to set up model behavior',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				description: 'Prompt to generate a response for',
			},
			{
				displayName: 'Output Format',
				name: 'format',
				type: 'options',
				options: [
					{
						name: 'Plain Text',
						value: '',
					},
					{
						name: 'JSON',
						value: 'json',
					},
				],
				default: '',
				description: 'Format of the response output',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				description: 'Additional model parameters',
				// eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
				options: [
					{
						displayName: 'Mirostat',
						name: 'mirostat',
						type: 'options',
						options: [
							{
								name: 'Disabled',
								value: 0,
							},
							{
								name: 'Mirostat',
								value: 1,
							},
							{
								name: 'Mirostat 2.0',
								value: 2,
							},
						],
						default: 0,
						description: 'Enable Mirostat sampling for controlling perplexity',
					},
					{
						displayName: 'Mirostat ETA',
						name: 'mirostatEta',
						type: 'number',
						typeOptions: {},
						default: 0.1,
						description: 'How quickly the algorithm responds to feedback from the generated text',
						hint: 'A lower learning rate will result in slower adjustments, while a higher learning rate will make the algorithm more responsive',
					},
					{
						displayName: 'Mirostat TAU',
						name: 'mirostatTau',
						type: 'number',
						typeOptions: {},
						default: 5.0,
						description: 'Balance between coherence and diversity of the output',
						hint: 'A lower value will result in more focused and coherent text',
					},
					{
						displayName: 'Context Size',
						name: 'contextSize',
						type: 'number',
						typeOptions: {
							numberPrecision: 0,
						},
						default: 2048,
						description: 'Size of the context window used to generate the next token',
					},
					{
						displayName: 'Repeat Lookback Size',
						name: 'repeatLookback',
						type: 'number',
						typeOptions: {
							numberPrecision: 0,
						},
						default: 64,
						description: 'How far back for the model to look back to prevent repetition',
						hint: 'Default: 64, 0 = disabled, -1 = num_ctx',
					},
					{
						displayName: 'Repeat Penalty',
						name: 'repeatPenalty',
						type: 'number',
						typeOptions: {},
						default: 1.1,
						description: 'How strongly to penalize repetitions',
						hint: 'A higher value (e.g., 1.5) will penalize repetitions more strongly, while a lower value (e.g., 0.9) will be more lenient',
					},
					{
						displayName: 'Temperature',
						name: 'temp',
						type: 'number',
						typeOptions: {},
						default: 0.8,
						description: 'The temperature of the model',
						hint: 'Increasing the temperature will make the model answer more creatively',
					},
					{
						displayName: 'Seed',
						name: 'seed',
						type: 'number',
						typeOptions: {},
						default: 0,
						description: 'Random number seed to use for generation',
						hint: 'Setting this to a specific number will make the model generate the same text for the same prompt',
					},
					{
						displayName: 'Stop',
						name: 'stop',
						type: 'string',
						default: '',
						description: 'Stop sequences to use',
						hint: 'When this pattern is encountered the LLM will stop generating text and return. Multiple stop patterns may be set by specifying multiple separate stop parameters in a modelfile',
					},
					{
						displayName: 'Tail Free Sampling',
						name: 'tfs',
						type: 'number',
						typeOptions: {},
						default: 1,
						description:
							'Tail free sampling is used to reduce the impact of less probable tokens from the output',
						hint: 'A higher value (e.g., 2.0) will reduce the impact more, while a value of 1.0 disables this setting',
					},
					{
						displayName: 'Predict Limit',
						name: 'predict',
						type: 'number',
						typeOptions: {
							numberPrecision: 0,
						},
						default: 128,
						description: 'Maximum number of tokens to predict when generating text',
						hint: 'Default: 128, -1 = infinite generation, -2 = fill context',
					},
					{
						displayName: 'Top-K',
						name: 'topk',
						type: 'number',
						typeOptions: {
							numberPrecision: 0,
						},
						default: 40,
						description: 'Reduces the probability of generating nonsense',
						hint: 'A higher value (e.g. 100) will give more diverse answers, while a lower value (e.g. 10) will be more conservative',
					},
					{
						displayName: 'Top-P',
						name: 'topp',
						type: 'number',
						typeOptions: {},
						default: 0.9,
						description: 'Works together with Top-K',
						hint: 'A higher value (e.g., 0.95) will lead to more diverse text, while a lower value (e.g., 0.5) will generate more focused and conservative text',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const outputs = [];
		const items = this.getInputData();
		// Variables could have different value for each item in case they contain an expression
		for (let index = 0; index < items.length; index++) {
			try {
				const module = this.getNodeParameter('module', index, '') as string;
				const system = this.getNodeParameter('system', index, '') as string;
				const prompt = this.getNodeParameter('prompt', index, '') as string;
				const format = this.getNodeParameter('format', index, '') as string;
				const options = this.getNodeParameter('options', index, {}) as any;
				const inputs = {
					System: system,
					Prompt: prompt,
					Format: format,
					Options: JSON.stringify(
						omitBy(
							{
								mirostat: options.mirostat,
								mirostat_eta: options.mirostatEta,
								mirostat_tau: options.mirostatTau,
								num_ctx: options.contextSize,
								repeat_last_n: options.repeatLookback,
								repeat_penalty: options.repeatPenalty,
								temperature: options.temp,
								seed: options.seed,
								stop: options.stop,
								tfs_z: options.tfs,
								num_predict: options.predict,
								top_k: options.topk,
								top_p: options.topp,
							},
							(value) => value === undefined || value === '',
						),
					),
				};
				const json = await queueLilypadJob(this, 'lilypadCredentialsApi', module, inputs);
				outputs.push({ json });
			} catch (error) {
				if (this.continueOnFail()) {
					const { json } = this.getInputData(index)[0];
					items.push({ json, error, pairedItem: index });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property, only append the itemIndex
						error.context.itemIndex = index;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: index,
					});
				}
			}
		}
		return this.prepareOutputData(outputs);
	}
}
