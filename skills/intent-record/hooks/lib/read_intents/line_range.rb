module ReadIntents
  class LineRange
    def initialize(from, to)
      @from = from
      @to = to
    end

    def self.read(offset, limit)
      return nil if offset.negative? || (offset.zero? && !limit.positive?)
      from = [offset, 1].max
      LineRange.new(from, limit.positive? ? from + limit - 1 : nil)
    end

    def blame_args
      ["-L", "#{@from},#{@to}"]
    end
  end
end
