import { InstanceStatus, TCPHelper } from '@companion-module/base'
import type { NKRouterInstance } from './main.js'

export function UpdateOptions(self: NKRouterInstance): void {
	self.CHOICES_LEVELS = []
	self.CHOICES_INPUTS = []
	self.CHOICES_OUTPUTS = []

	self.CHOICES_LEVELS.push({ id: '1', label: 'MD Video' })
	self.CHOICES_LEVELS.push({ id: '2', label: 'SDI Video' })
	self.CHOICES_LEVELS.push({ id: '4', label: 'AES Audio 1' })
	self.CHOICES_LEVELS.push({ id: '8', label: 'AES Audio 2' })
	self.CHOICES_LEVELS.push({ id: '16', label: 'Analog Video' })
	self.CHOICES_LEVELS.push({ id: '32', label: 'Analog Audio 1' })
	self.CHOICES_LEVELS.push({ id: '64', label: 'Analog Audio 2' })
	self.CHOICES_LEVELS.push({ id: '128', label: 'Machine Control' })

	for (let i = 1; i <= self.config.inputs; i++) {
		self.CHOICES_INPUTS.push({ id: String(i), label: i.toString() })
	}

	for (let i = 1; i <= self.config.outputs; i++) {
		self.CHOICES_OUTPUTS.push({ id: String(i), label: i.toString() })
	}
}

export function InitConnection(self: NKRouterInstance): void {
	self.log('debug', 'Initializing connection...')

	if (self.socket !== undefined) {
		self.socket?.destroy()
		StopKeepAliveTimer(self)
	}

	if (self.config.host) {
		if (self.config.port === undefined) {
			self.config.port = 5000
		}
		self.socket = new TCPHelper(self.config.host, self.config.port)

		self.socket?.on('error', (err: any) => {
			if (self.config.verbose) {
				self.log('debug', 'Network error: ' + String(err))
			}
		})

		self.socket?.on('connect', () => {
			self.updateStatus(InstanceStatus.Ok, 'Connected to NK Router')
			self.log('debug', 'Connected')
			self.socket?.send('PHOENIX-DB N\n')
			StartKeepAliveTimer(self, 10000) //Timer to send HI every 10 seconds to keep connection alive
		})

		self.socket?.on('data', (data: Buffer) => {
			ProcessData(self, data.toString('utf8').trim())
		})
	}
}

function ProcessData(self: NKRouterInstance, msg: any): void {
	if (self.config.verbose) {
		self.log('debug', `Received data: ${msg}`)
	}

	self.checkFeedbacks()
}

function StartKeepAliveTimer(self: NKRouterInstance, timeout: number) {
	StopKeepAliveTimer(self)

	// Create a reconnect timer to watch the socket. If disconnected try to connect.
	self.keepAliveTimer = setInterval(function () {
		TransmitCommand(self, Buffer.from('HI\r', 'ascii'))
	}, timeout)
}

export function StopKeepAliveTimer(self: NKRouterInstance): void {
	if (self.keepAliveTimer !== undefined) {
		clearInterval(self.keepAliveTimer)
		delete self.keepAliveTimer
	}
}

function TransmitCommand(self: NKRouterInstance, command: Buffer) {
	if (self.socket !== undefined && self.socket?.isConnected) {
		self.socket?.send(command)
	} else {
		self.log('debug', 'Socket not connected :(')
	}
}

export function ChangeXPT(self: NKRouterInstance, address: number, output: number, input: number, level: number): void {
	if (output < self.config.outputs) {
		if (input < self.config.inputs) {
			if (level <= 255 && level !== 0) {
				let string =
					'4e4b3200' +
					decimalToHex(address, 2) +
					'0409' +
					decimalToHex(output, 4) +
					decimalToHex(input, 4) +
					decimalToHex(level, 8) +
					'00'

				const crc = crc16(Buffer.from(string, 'hex')).toString(16)
				string = '504153320012' + string + crc

				TransmitCommand(self, Buffer.from(string, 'hex'))
			} else {
				self.log('error', `Selected Level out of bounds: ${level} > 255 or 0`)
			}
		} else {
			self.log('error', `Selected Input out of bounds: ${input} > ${self.config.inputs}`)
		}
	} else {
		self.log('error', `Selected Output out of bounds: ${output} > ${self.config.outputs}`)
	}
}

function decimalToHex(d: number, pad: number): string {
	let hex = d.toString(16)

	while (hex.length < pad) {
		hex = '0' + hex
	}

	return hex
}

function crc16(buffer: Buffer): number {
	let crc = 0xffff
	let odd: number

	for (let i = 0; i < buffer.length; i++) {
		crc ^= buffer[i]

		for (let j = 0; j < 8; j++) {
			odd = crc & 0x0001
			crc >>= 1
			if (odd) {
				crc ^= 0xa001
			}
		}
	}

	// Swap bytes
	crc = ((crc & 0xff) << 8) | ((crc & 0xff00) >> 8)

	return crc
}
