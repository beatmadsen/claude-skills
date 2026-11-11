require "fileutils"

module ReadIntents
  class Ledger
    def initialize(path)
      @path = path
    end

    def shown
      return [] unless File.file?(@path)
      File.readlines(@path, chomp: true)
    end

    def add(ids)
      FileUtils.mkdir_p(File.dirname(@path))
      File.open(@path, "a") { |ledger| ledger.write(ids.map { |id| "#{id}\n" }.join) }
    end
  end
end
