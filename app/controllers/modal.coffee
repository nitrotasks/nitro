# Spine
Spine  = require 'spine'
$      = Spine.$

# Utils
Keys   = require '../utils/keys.coffee'
CONFIG = require '../utils/conf.coffee'

# The base Modal class
class Modal extends Spine.Controller

	constructor: (opts) ->
		Spine.touchify(opts.events)
		super

	state: off

	show: ->
		return unless @state is off
		@state = on
		@el.show(0).addClass("show")
		if @onShow then @onShow()
		setTimeout ( =>
			@el.on "click.modal, touchend.modal", (event) =>
				if event.target.className.indexOf("modal") >= 0 then@hide()
		), 500

	hide: ->
		return unless @state is on
		@state = off
		@el.removeClass("show")
		setTimeout ( =>
			@el.hide(0)
			if @onHide then @onHide()
		), 350
		@el.off("click.modal, touchend.modal")


# Stores a reference to each modal, so we can fetch them from other files
modals = []

module.exports =

	# Return a modal
	get: (name) ->
		return modals[name]

	# Bind the modals
	init: ->

		# Deleting a task
		modals["trashTask"] = new Modal
			el: $(".modal.delete-task")
			events:
				"click .true": "delete"
				"click .false": "hide"

			run: (@task) ->
				if Setting.get("confirmDelete")
					@show()
				else
					@delete()

			delete: ->
				@task?.destroy()
				@hide()


			# Deleting a list
			modals["trashList"] = new Modal
				el: $(".modal.delete-list")
				events:
					"click .true": "delete"
					"click .false": "hide"

				run: ->
					if Setting.get "confirmDelete"
						@show()
					else
						@delete()

				delete: ->
					List.current.trigger("kill")
					@hide()



			# Emailing a list
		modals["email"] = new Modal
			el: $(".modal.email")

			elements:
				"input": "input"

			events:
				"click button": "submit"
				"keyup input": "keyup"

			keyup: (e) ->
				if e.keyCode is Keys.ENTER then @submit()

			submit: ->
				if Setting.isPro()
					email = @input.val()
					return unless email.match(/.+@.+\..+/)
					uid = require('../models/setting.coffee').get("uid")
					listId = require('../models/list.coffee').current.id
					Spine.Sync.emit("emailList", [uid, listId, email])
				else
					$(".modal.proventor").modal("show")

				@hide()

			onShow: ->
				@input.focus()

			onHide: ->
				@input.val("")

		# Sharing a list
		modals["share"] = new Modal
			el: $(".modal.share")
