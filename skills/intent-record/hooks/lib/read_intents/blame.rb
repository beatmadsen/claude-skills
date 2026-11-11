require "open3"

module ReadIntents
  class Blame
    def initialize(intent_record)
      @intent_record = intent_record
    end

    def spans(file, lines)
      porcelain = git_blame(file, lines)
      return [] if porcelain.empty?
      out, status = Open3.capture2(*@intent_record, "blame", "--format", "git-porcelain", stdin_data: porcelain)
      return [] unless status.success?
      JSON.parse(out).fetch("spans", [])
    end

    private

    def git_blame(file, lines)
      return "" unless File.file?(file)
      args = ["git", "blame", "--porcelain", *(lines && lines.blame_args), "--", File.basename(file)]
      out, _err, status = Open3.capture3(*args, chdir: File.dirname(file))
      status.success? ? out : ""
    end
  end
end
