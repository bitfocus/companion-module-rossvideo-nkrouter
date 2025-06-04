import { CompanionActionDefinitions } from '@companion-module/base'
import type { NKRouterInstance } from './main.js'
import { ChangeXPT } from './api.js'

export function UpdateActions(self: NKRouterInstance): void {
	const actions: CompanionActionDefinitions = {}

	actions.routerXPT = {
		name: 'Route Crosspoint',
		description: 'Route a Source to a Destination',
		options: [
			{
				type: 'multidropdown',
				label: 'Level',
				id: 'level',
				choices: self.CHOICES_LEVELS,
				minSelection: 1,
				default: [],
			},
			{
				type: 'dropdown',
				label: 'Input',
				id: 'input',
				default: '1',
				choices: self.CHOICES_INPUTS,
			},
			{
				type: 'dropdown',
				label: 'Output',
				id: 'output',
				default: '1',
				choices: self.CHOICES_OUTPUTS,
			},
		],
		callback: async (action) => {
			const opt = action.options
			const levels = opt.level as string[]
			const output = Number(opt.output)
			const input = Number(opt.input)
			let level = 0
			for (let val of levels) {
				level += Number(val)
			}

			ChangeXPT(self, self.config.router_address, output - 1, input - 1, level)
		},
	}

	self.setActionDefinitions(actions)
}
