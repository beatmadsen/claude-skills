module ReadIntents
  class Entry
    BODY_LIMIT = 700

    def initialize(intent, span)
      @intent = intent
      @span = span
    end

    def id
      @intent["intent_id"]
    end

    def backfilled?
      @intent["body"].to_s.start_with?("Backfilled from the commit message")
    end

    def text
      "[#{id}] lines #{@span['from']}-#{@span['to']}, commit #{commit}: #{@intent['summary']}\n#{body}"
    end

    private

    def commit
      @span.fetch("asset_version", {})["external_id"].to_s[0, 8]
    end

    def body
      whole = @intent["body"].to_s
      return whole if whole.length <= BODY_LIMIT
      "#{whole[0, BODY_LIMIT]}... (cut; `intent-record show #{id}` has the rest)"
    end
  end
end
