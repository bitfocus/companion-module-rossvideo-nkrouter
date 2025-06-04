import type { SomeCompanionConfigField } from '@companion-module/base'
import { Regex } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: number
	router_address: number
	inputs: number
	outputs: number
	verbose: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls Ross NK series video routers connected via NK-NET adapters.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP of NK-Net adapter',
			width: 6,
			regex: Regex.IP,
			required: true,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port (default 5000)',
			width: 6,
			min: 1,
			max: 65535,
			default: 5000,
		},
		{
			type: 'number',
			id: 'router_address',
			label: 'T-Bus Address of Router',
			width: 12,
			min: 0,
			max: 255,
			default: 1,
			required: true,
		},
		{
			type: 'number',
			id: 'inputs',
			label: 'Number of Router Inputs',
			width: 12,
			min: 1,
			max: 512,
			default: 16,
			required: true,
		},
		{
			type: 'number',
			id: 'outputs',
			label: 'Number of Router Outputs',
			width: 12,
			min: 1,
			max: 512,
			default: 16,
			required: true,
		},
		{
			type: 'static-text',
			id: 'hr1',
			width: 12,
			label: ' ',
			value: '<hr />',
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Enable Verbose Logging',
			default: false,
			width: 4,
		},
	]
}
