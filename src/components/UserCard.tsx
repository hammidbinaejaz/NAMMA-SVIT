import prisma from "@/lib/prisma";
import RadialProgress from "./ui/RadialProgress";
import { Users, GraduationCap, UserCheck, Shield } from "lucide-react";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  const config = {
    admin: {
      label: "Admins",
      icon: <Shield className="w-6 h-6 text-white" />,
      color: "blue" as const,
      subtitle: "System Administrators",
      max: 10,
    },
    teacher: {
      label: "Faculty",
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      color: "gold" as const,
      subtitle: "Teaching Staff",
      max: 100,
    },
    student: {
      label: "Students",
      icon: <Users className="w-6 h-6 text-white" />,
      color: "blue" as const,
      subtitle: "Enrolled Students",
      max: 500,
    },
    parent: {
      label: "Parents",
      icon: <UserCheck className="w-6 h-6 text-white" />,
      color: "gold" as const,
      subtitle: "Parent Accounts",
      max: 400,
    },
  };

  const { label, icon, color, subtitle, max } = config[type];

  return (
    <RadialProgress
      value={data}
      max={max}
      label={label}
      icon={icon}
      color={color}
      subtitle={subtitle}
    />
  );
};

export default UserCard;
