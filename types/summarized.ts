type SummarizedWeather = {
  headers: { name: string; colspan: number }[];
  columns: string[];
  data: string[][];
};

export default SummarizedWeather;
