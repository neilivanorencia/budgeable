import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data?: {
    name: string;
    value: number;
    color?: string | null;
  }[];
};

export const RadarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />
        <PolarRadiusAxis style={{ fontSize: "12px" }} stroke="#e2e8f0" />
        <Radar dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
};
