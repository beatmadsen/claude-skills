module ReadIntents
  class Note
    LIMIT = 6

    def initialize(file, entries)
      @file = file
      @entries = entries
    end

    def empty?
      @entries.empty?
    end

    def shown
      @entries.first(LIMIT)
    end

    def text
      [heading, *shown.map(&:text), more].compact.join("\n\n")
    end

    private

    def heading
      "Intent records behind the lines of #{@file}. They say why those lines are as they are, " \
        "including alternatives that were rejected. Check them before changing these lines, " \
        "or before committing if you already have, and do not undo a rejected alternative without a reason."
    end

    def more
      left = @entries.size - LIMIT
      return nil unless left.positive?
      "#{left} more intents on these lines: " \
        "`git blame --porcelain -- #{@file} | intent-record blame --format git-porcelain` lists them all."
    end
  end
end
