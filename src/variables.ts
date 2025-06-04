import type { CompanionVariableDefinition } from '@companion-module/base'

import type { NKRouterInstance } from './main.js'

export function UpdateVariableDefinitions(self: NKRouterInstance): void {
	const variables: CompanionVariableDefinition[] = []

	self.setVariableDefinitions(variables)
}
