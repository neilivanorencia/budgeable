import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

/**
 * Properties containing structural category value breakdowns.
 */
type Props = {
  data?: {
    name: string;
    value: number;
    color?: string | null;
  }[];
};

/**
 * Renders a categorical data chart visualization formatted into a radar layout.
 */
export const RadarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
        {/* Renders structural background concentric grid rings and radial lines */}
        <PolarGrid stroke="#e2e8f0" />

        {/* Configures outer perimeter text anchors mapped to category identity fields */}
        <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />

        {/* Adds inner tick value scales to measure magnitude changes from the center point */}
        <PolarRadiusAxis style={{ fontSize: "12px" }} stroke="#e2e8f0" />

        {/* Renders the shaded polygon area representing data values across categories */}
        <Radar dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
};
