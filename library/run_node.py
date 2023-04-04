import subprocess

def run_node(fname:str, args:list = [], node_path="node") -> str:
  p = subprocess.Popen([node_path, fname, *args], stdout=subprocess.PIPE)
  return p.stdout.read().decode("utf-8")