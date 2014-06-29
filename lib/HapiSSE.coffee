{ Readable } = require 'stream'
util = require 'util'

class HapiSSE extends Readable

	constructor: (request, streamOptions) ->

		Readable.call @, streamOptions
		@.push '', 'utf8'

		@id = HapiSSE._index
		HapiSSE._connections[@id] = @
		HapiSSE._index += 1

		# http://hapijs.com/api#request-events
		request.on 'disconnect', =>
			HapiSSE._connections[@id].close()

	close: =>
		@.push null
		if HapiSSE._connections[@id]?
			delete HapiSSE._connections[@id]

	_read: ->

	@_index: 0
	@_connections: []

	@write: (message, options = {}) =>
		console.log options.id if options.id?
		console.log options.event if options.event?
		console.log options.retry if options.retry?
		ids = Object.keys @_connections
		data = "data: #{message}\n\n"
		ids.forEach (id) =>
			@_connections[id].push data, 'utf8'

	@closeAll: =>
		ids = Object.keys @_connections
		ids.forEach (id) =>
			@_connections[id].close()

module.exports = HapiSSE
