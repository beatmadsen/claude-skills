require "minitest/autorun"
require "tmpdir"
require "open3"
require "json"
require_relative "../lib/read_intents"

class ReadIntentsTest < Minitest::Test
  BACKFILLED_BODY = "Backfilled from the commit message; the reasoning behind this change was not recorded.\n\nOne"

  def setup
    @root = Dir.mktmpdir("read-intents")
    @repo = File.join(@root, "repo")
    @store = File.join(@root, "store")
    Dir.mkdir(@repo)
    git("init", "-q")
    @hook = ReadIntents::Hook.new(ReadIntents::Blame.new(["intent-record", "--config-dir", @store]), File.join(@root, "ledger"))
  end

  def teardown
    FileUtils.remove_entry(@root)
  end

  def test_should_show_the_summary_of_the_intent_on_the_commit_that_wrote_the_lines_read
    commit_lines("one\ntwo\n", summary: "Keep two lines because the parser counts them")

    reply = @hook.reply(claude_read)

    assert_includes reply.dig("hookSpecificOutput", "additionalContext"), "Keep two lines because the parser counts them"
  end

  def test_should_answer_in_the_post_tool_use_field_claude_code_reads
    commit_lines("one\n", summary: "Claude reads this")

    reply = @hook.reply(claude_read)

    assert_equal "PostToolUse", reply.dig("hookSpecificOutput", "hookEventName")
  end

  def test_should_answer_in_the_field_cursor_reads_when_cursor_runs_the_hook
    commit_lines("one\n", summary: "Cursor reads this")

    reply = @hook.reply(claude_read.merge("cursor_version" => "3.22.12"))

    assert_includes reply["additional_context"], "Cursor reads this"
  end

  def test_should_say_nothing_when_the_only_record_was_backfilled_from_the_commit_message
    commit_lines("one\n", summary: "Backfilled", body: BACKFILLED_BODY)

    assert_nil @hook.reply(claude_read)
  end

  def test_should_not_show_an_intent_a_second_time_in_the_same_session
    commit_lines("one\n", summary: "Shown once")
    @hook.reply(claude_read)

    assert_nil @hook.reply(claude_read)
  end

  def test_should_show_an_intent_again_in_another_session
    commit_lines("one\n", summary: "Shown per session")
    @hook.reply(claude_read)

    reply = @hook.reply(claude_read.merge("session_id" => "another"))

    assert_includes reply.dig("hookSpecificOutput", "additionalContext"), "Shown per session"
  end

  def test_should_leave_out_intents_of_lines_outside_the_offset_and_limit_read
    commit_lines("one\n", summary: "First line only")
    commit_lines("one\ntwo\n", summary: "Second line only")

    reply = @hook.reply(claude_read(offset: 2, limit: 1))

    refute_includes reply.dig("hookSpecificOutput", "additionalContext"), "First line only"
  end

  def test_should_leave_out_intents_of_lines_past_the_limit_when_the_read_has_no_offset
    commit_lines("one\n", summary: "First line only")
    commit_lines("one\ntwo\n", summary: "Second line only")

    reply = @hook.reply(claude_read(limit: 1))

    refute_includes reply.dig("hookSpecificOutput", "additionalContext"), "Second line only"
  end

  def test_should_cut_a_long_body_and_name_the_command_that_shows_it_whole
    id = commit_lines("one\n", summary: "Long", body: "x" * 2000)

    reply = @hook.reply(claude_read)

    assert_includes reply.dig("hookSpecificOutput", "additionalContext"), "intent-record show #{id}"
  end

  def test_should_say_how_many_intents_it_left_out_past_its_limit
    commit_lines((1..8).map { |n| "line #{n}\n" }.join, summary: "Shared")
    record_on_head(7)

    reply = @hook.reply(claude_read)

    assert_includes reply.dig("hookSpecificOutput", "additionalContext"), "2 more intents"
  end

  def test_should_say_nothing_for_a_file_outside_any_git_repository
    loose = File.join(@root, "loose.txt")
    File.write(loose, "one\n")

    assert_nil @hook.reply(claude_read(file: loose))
  end

  def test_should_say_nothing_for_a_path_that_does_not_exist
    assert_nil @hook.reply(claude_read(file: File.join(@root, "gone", "f.txt")))
  end

  def test_should_show_an_intent_once_when_its_commit_wrote_two_separate_spans_of_the_lines_read
    id = commit_lines("one\ntwo\nthree\n", summary: "Wrote all three")
    commit_lines("one\nTWO\nthree\n", summary: "Changed the middle")

    reply = @hook.reply(claude_read)

    assert_equal 1, reply.dig("hookSpecificOutput", "additionalContext").scan("[#{id}]").size
  end

  def test_should_exit_cleanly_with_no_output_when_the_hook_input_is_not_json
    out, status = Open3.capture2(File.expand_path("../read-intents", __dir__), stdin_data: "not json")

    assert_equal [0, ""], [status.exitstatus, out]
  end

  def test_should_keep_the_ids_another_hook_process_added_to_the_session
    path = File.join(@root, "ledger", "s")
    ReadIntents::Ledger.new(path).add(["first"])
    ReadIntents::Ledger.new(path).add(["second"])

    assert_equal %w[first second], ReadIntents::Ledger.new(path).shown
  end

  private

  def tracked_file
    File.join(@repo, "f.txt")
  end

  def claude_read(file: tracked_file, offset: nil, limit: nil)
    tool_input = { "file_path" => file, "offset" => offset, "limit" => limit }.compact
    { "session_id" => "s1", "hook_event_name" => "PostToolUse", "tool_name" => "Read", "tool_input" => tool_input }
  end

  def commit_lines(text, summary:, body: "Reasoning for #{summary}")
    File.write(tracked_file, text)
    git("add", "f.txt")
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", summary)
    record(summary, body)
  end

  def record_on_head(count)
    count.times { |n| record("Extra #{n}", "Body #{n}") }
  end

  def record(summary, body)
    payload = JSON.generate(summary: summary, body: body, commits: [git("rev-parse", "HEAD").strip])
    out, status = Open3.capture2("intent-record", "--config-dir", @store, "record", stdin_data: payload)
    raise out unless status.success?
    JSON.parse(out).fetch("intent_id")
  end

  def git(*args)
    out, status = Open3.capture2("git", *args, chdir: @repo)
    raise "git #{args.join(' ')} failed" unless status.success?
    out
  end
end
