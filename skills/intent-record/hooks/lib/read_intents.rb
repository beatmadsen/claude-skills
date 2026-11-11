require "json"
require "set"
require "tmpdir"
require_relative "read_intents/line_range"
require_relative "read_intents/read_event"
require_relative "read_intents/blame"
require_relative "read_intents/ledger"
require_relative "read_intents/entry"
require_relative "read_intents/selection"
require_relative "read_intents/note"
require_relative "read_intents/reply"
require_relative "read_intents/hook"

module ReadIntents
  LEDGER_DIR = File.join(Dir.tmpdir, "intent-record-read-hook")
  SHIM = File.expand_path("~/.rbenv/shims/intent-record")

  def self.command
    found = ENV.fetch("PATH", "").split(File::PATH_SEPARATOR).map { |dir| File.join(dir, "intent-record") }
    found.find { |path| File.executable?(path) } || SHIM
  end
end
