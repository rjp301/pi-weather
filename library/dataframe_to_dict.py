import pandas as pd

def dataframe_to_dict(df:pd.DataFrame) -> pd.DataFrame:
  result = {}
  result["index"] = df.index.to_list()
  result["columns"] = df.columns.to_list()
  result["data"] = [row.to_list() for _,row in df.iterrows()]
  return result