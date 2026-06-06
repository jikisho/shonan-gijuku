"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type Course } from "@/data/courses";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FadeInList } from "@/components/PageMotion";

const phaseColors: Record<string, string> = {
  statement: "from-blue-900/40 to-blue-800/20 border-blue-500/20",
  activity: "from-green-900/40 to-green-800/20 border-green-500/20",
  "free-writing": "from-orange-900/40 to-orange-800/20 border-orange-500/20",
  optional: "from-purple-900/40 to-purple-800/20 border-purple-500/20",
};

const accentBg: Record<string, string> = {
  statement: "bg-blue-500/10",
  activity: "bg-green-500/10",
  "free-writing": "bg-orange-500/10",
  optional: "bg-purple-500/10",
};

interface Props {
  courses: Course[];
  completed: string[];
}

export default function DashboardCourseList({ courses, completed }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
      {courses.map((course, i) => {
        const courseCompleted = course.lessons.filter((l) =>
          completed.includes(`${course.id}-${l.id}`)
        ).length;
        const pct = Math.round((courseCompleted / course.totalLessons) * 100);
        return (
          <FadeInList key={course.id} index={i}>
            <Link href={`/courses/${course.id}`}>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`rounded-2xl border p-6 bg-gradient-to-br ${phaseColors[course.id]} cursor-pointer transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-2xl">{course.icon}</span>
                    <h3 className="text-base font-bold text-white mt-2">{course.title}</h3>
                    <p className="text-xs text-white/40 mt-1">{course.totalLessons} レッスン</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${accentBg[course.id]} flex items-center justify-center`}>
                    <ArrowRight className="w-4 h-4 text-white/60" />
                  </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-4">
                  {course.description}
                </p>
                <Progress value={pct} className="h-1 bg-white/10" />
                <p className="text-[10px] text-white/20 mt-1">{courseCompleted} / {course.totalLessons} 完了</p>
              </motion.div>
            </Link>
          </FadeInList>
        );
      })}
    </div>
  );
}
