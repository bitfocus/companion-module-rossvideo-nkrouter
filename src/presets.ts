import {
	type CompanionButtonPresetDefinition,
	type CompanionTextPresetDefinition,
	type CompanionPresetDefinitions,
} from '@companion-module/base'

import type { NKRouterInstance } from './main.js'

export function UpdatePresets(self: NKRouterInstance): void {
	const presets: (CompanionButtonPresetDefinition | CompanionTextPresetDefinition)[] = []

	self.setPresetDefinitions(presets as unknown as CompanionPresetDefinitions)
}
