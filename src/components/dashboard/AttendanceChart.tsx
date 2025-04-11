
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const data = [
  {
    name: "Mon",
    present: 45,
    absent: 5,
    late: 10,
  },
  {
    name: "Tue",
    present: 48,
    absent: 4,
    late: 8,
  },
  {
    name: "Wed",
    present: 50,
    absent: 3,
    late: 7,
  },
  {
    name: "Thu",
    present: 47,
    absent: 6,
    late: 7,
  },
  {
    name: "Fri",
    present: 46,
    absent: 8,
    late: 6,
  },
];

const AttendanceChart = () => {
  const [range, setRange] = useState("thisWeek");

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Attendance Overview</CardTitle>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-36 h-8">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="lastWeek">Last Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#3498db" name="Present" />
              <Bar dataKey="absent" fill="#e74c3c" name="Absent" />
              <Bar dataKey="late" fill="#f39c12" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
