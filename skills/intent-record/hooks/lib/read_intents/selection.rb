module ReadIntents
  class Selection
    def initialize(spans, shown)
      @spans = spans
      @shown = shown.to_set
    end

    def entries
      candidates = @spans.flat_map { |span| entries_of(span) }
      candidates.uniq(&:id).reject { |entry| @shown.include?(entry.id) || entry.backfilled? }
    end

    private

    def entries_of(span)
      span.fetch("intents", []).map { |intent| Entry.new(intent, span) }
    end
  end
end
