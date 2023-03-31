import subprocess

def run_node(fname:str,args:list = []) -> str:
  p = subprocess.Popen(["node", fname, *args], stdout=subprocess.PIPE)
  return p.stdout.read().decode("utf-8")