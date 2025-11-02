import { LucideIcon } from "lucide-react";
import SummaryCardClient from "./SummaryCardClient";

interface SummaryCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: "blue" | "gold";
  subtitle?: string;
  href?: string;
}

export default function SummaryCard(props: SummaryCardProps) {
  return <SummaryCardClient {...props} />;
}

