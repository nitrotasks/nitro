Keys =
  'ENTER': 13
  'ESCAPE': 27
  'LEFT': 37
  'UP': 38
  'RIGHT': 39
  'DOWN': 40
  '0': 48
  '1': 49
  '2': 50
  '3': 51
  '4': 52
  '5': 53
  '6': 54
  '7': 55
  '8': 56
  '9': 57
  'A': 65
  'B': 66
  'C': 67
  'D': 68
  'E': 69
  'F': 70
  'G': 71
  'H': 72
  'I': 73
  'J': 74
  'K': 75
  'L': 76
  'M': 77
  'N': 78
  'O': 79
  'P': 80
  'Q': 81
  'R': 82
  'S': 83
  'T': 84
  'U': 85
  'V': 86
  'W': 87
  'X': 88
  'Y': 89
  'Z': 90
  'COMMA': 188
  'DASH': 189
  'PERIOD': 190

  handleKey: (keyCode) ->
    focusedInputs = $(':focus')

    # If an input is focused
    if focusedInputs.length > 0
      switch keyCode
        when Keys.ESCAPE
          focusedInputs.blur()

    # If no input is focused
    else
      switch keyCode
        when Keys.ESCAPE
          @tasks.collapseAll()

        # TODO: Refactor using Modules and Classes instead of modifying the DOM directly

        when Keys.N
          # New Task
          $('.new-task').focus().val('')

        when Keys.L
          # New List
          $('.new-list').focus().val('')

        when Keys.F
          # Search
          $('.search input').focus().val('')

        when Keys.P
          # Print
          $('.buttons .print').trigger('click')

        when Keys.COMMA
          # Settings
          $('.settingsButton img').trigger('click')

        when Keys.K
          # Go to the prev list
          if $('.sidebar .current').prev().length is 0
            # Go to completed
            $('.sidebar .completed').trigger('click')
          else
            $('.sidebar .current').prev().trigger('click')
            # Cancel the Focus if shortcut is used
            $('.new-task').blur()

        when Keys.J
          # Go to the next list
          if $('.sidebar .current').next().hasClass('lists')
            # Go to first list
            $($('.sidebar .lists').children()[0]).trigger('click')
            $('.new-task').blur()
          else
            $('.sidebar .current').next().trigger('click')
            $('.new-task').blur()


module.exports = Keys
