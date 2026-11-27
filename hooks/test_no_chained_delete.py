import json, os, subprocess, sys, unittest

SCRIPT = os.environ.get("HOOK", os.path.join(os.path.dirname(__file__), "no-chained-delete.py"))

def run(command):
    p = subprocess.run([sys.executable, SCRIPT], input=json.dumps({"tool_input": {"command": command}}),
                       capture_output=True, text=True)
    return p.returncode

class NoChainedDelete(unittest.TestCase):
    def test_blocks_status_then_worktree_remove(self):
        self.assertEqual(2, run("git -C wt status && git worktree remove --force wt"))
    def test_blocks_ls_then_rm(self):
        self.assertEqual(2, run("ls build; rm -rf build"))
    def test_blocks_delete_before_inspect(self):
        self.assertEqual(2, run("rm -rf out && ls"))
    def test_blocks_find_delete_with_inspect(self):
        self.assertEqual(2, run("cat notes.txt | head -1 && find . -name '*.tmp' -delete"))
    def test_blocks_inspect_on_new_line(self):
        self.assertEqual(2, run("git status\ngit branch -D old"))
    def test_allows_a_lone_delete(self):
        self.assertEqual(0, run("rm -rf build"))
    def test_allows_a_lone_inspection(self):
        self.assertEqual(0, run("git status && git log -1"))
    def test_allows_cd_before_delete(self):
        self.assertEqual(0, run("cd build && rm -rf cache"))
    def test_allows_delete_then_build(self):
        self.assertEqual(0, run("rm -rf build && make"))
    def test_allows_when_input_is_garbage(self):
        p = subprocess.run([sys.executable, SCRIPT], input="not json", capture_output=True, text=True)
        self.assertEqual(0, p.returncode)

if __name__ == "__main__":
    unittest.main()
