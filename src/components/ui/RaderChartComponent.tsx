import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export interface DataPoint {
  subject: string; // 軸のラベル
  A: number; // 1つ目のデータセットの値      // 2つ目のデータセットの値 (必要に応じて削除・変更可能)
  fullMark: number; // その項目の最大値（スケール調整用）
}
type Props = {
  status: DataPoint[];
};

export default function RadarChartComponent({ status }: Props) {
  return (
    // 親コンテナに合わせてサイズを調整するResponsiveContainerを使用
    <ResponsiveContainer width="100%" height={400}>
      {/* cx, cyは中心点の位置、outerRadiusはチャートのサイズを定義 */}
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={status}>
        {/* PolarGrid は6角形のグリッド線を描画 */}
        <PolarGrid />
        {/* PolarAngleAxis は6角形の頂点（軸）のラベルを描画 */}
        <PolarAngleAxis dataKey="subject" />
        {/* PolarRadiusAxis は中心からの距離（数値のスケール）を描画しない設定 (必要なら変更可) */}
        <PolarRadiusAxis angle={30} domain={[0, 200]} />

        {/* Radar は実際のデータ系列を描画 */}
        <Radar
          name="ステータス"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
          strokeWidth={2}
        />

        {/* Tooltip と Legend を追加してインタラクティブに */}
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
