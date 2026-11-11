module ReadIntents
  class Reply
    def initialize(event, text)
      @event = event
      @text = text
    end

    def to_h
      return { "additional_context" => @text } if @event.cursor?
      { "hookSpecificOutput" => { "hookEventName" => "PostToolUse", "additionalContext" => @text } }
    end
  end
end
