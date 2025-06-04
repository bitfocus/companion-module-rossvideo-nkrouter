import { CompanionFeedbackDefinitions } from '@companion-module/base'
import type { NKRouterInstance } from './main.js'

export function UpdateFeedbacks(self: NKRouterInstance): void {
	const feedbacks: CompanionFeedbackDefinitions = {}

	self.setFeedbackDefinitions(feedbacks)
}
