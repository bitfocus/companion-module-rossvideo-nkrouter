import { InstanceBase, runEntrypoint, type SomeCompanionConfigField } from '@companion-module/base'
import type { TCPHelper } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpdatePresets } from './presets.js'
import { UpdateOptions, InitConnection, StopKeepAliveTimer } from './api.js'

export class NKRouterInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	socket!: TCPHelper | null

	keepAliveTimer: NodeJS.Timeout | undefined = undefined

	CHOICES_LEVELS: { id: string; label: string }[] = []
	CHOICES_INPUTS: { id: string; label: string }[] = []
	CHOICES_OUTPUTS: { id: string; label: string }[] = []

	data: any

	constructor(internal: unknown) {
		super(internal)

		this.socket as TCPHelper | null
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		UpdateOptions(this)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets

		await InitConnection(this)
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		StopKeepAliveTimer(this)

		this.socket?.destroy()

		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config

		UpdateOptions(this)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets

		await InitConnection(this)
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}
}

runEntrypoint(NKRouterInstance, UpgradeScripts)
