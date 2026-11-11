module ReadIntents
  class ReadEvent
    def initialize(input)
      @input = input
    end

    def file
      path = tool_input["file_path"] || tool_input["path"]
      return nil unless path
      File.expand_path(path, @input["cwd"] || Dir.pwd)
    end

    def lines
      LineRange.read(tool_input["offset"].to_i, tool_input["limit"].to_i)
    end

    def session
      id = @input["session_id"] || @input["conversation_id"]
      id.to_s.gsub(/[^\w-]/, "_")
    end

    def cursor?
      @input.key?("cursor_version")
    end

    private

    def tool_input
      raw = @input["tool_input"]
      raw.is_a?(String) ? JSON.parse(raw) : raw.to_h
    end
  end
end
