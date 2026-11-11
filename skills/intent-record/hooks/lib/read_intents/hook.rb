module ReadIntents
  class Hook
    def initialize(blame, ledger_dir)
      @blame = blame
      @ledger_dir = ledger_dir
    end

    def reply(input)
      event = ReadEvent.new(input)
      return nil unless event.file
      ledger = Ledger.new(File.join(@ledger_dir, event.session))
      note = note_for(event, ledger)
      return nil if note.empty?
      ledger.add(note.shown.map(&:id))
      Reply.new(event, note.text).to_h
    end

    private

    def note_for(event, ledger)
      spans = @blame.spans(event.file, event.lines)
      Note.new(event.file, Selection.new(spans, ledger.shown).entries)
    end
  end
end
