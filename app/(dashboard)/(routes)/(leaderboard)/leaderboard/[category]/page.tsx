"use client";
import { fetchScores } from "@/utils/firebase";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

type LeaderboardItem = {
  id: number;
  name: string;
  designation: string;
  img: string;
  score: number;
};

const Leaderboard = ({ params }: any) => {
  const { category } = params;
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetchScores(category === "roomId" ? roomId : category);
      const sortedData = (response ?? []).sort((a: any, b: any) => b.score - a.score);
      const transformedData = sortedData.map((item: any, index: number) => ({
        id: index,
        name: item.name,
        designation: item.designation ?? "Participant",
        img: item.img,
        score: item.score,
      }));
      setData(transformedData);
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  const getPositionBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Image width={100} height={100} src="/first.png" alt="1st place" className="h-10 w-10 mx-auto rounded-full" />;
      case 1:
        return <Image width={100} height={100} src="/second.jfif" alt="2nd place" className="h-10 w-10 mx-auto rounded-full" />;
      case 2:
        return <Image width={100} height={100} src="/third.jfif" alt="3rd place" className="h-10 w-10 mx-auto rounded-full" />;
      default:
        return <span className="text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-6">
      {category === "roomId" && (
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Input
            placeholder="Enter roomId to view leaderboard"
            onChange={(e) => setRoomId(e.target.value)}
            className="flex-grow"
          />
          <Button variant="outline" onClick={fetchLeaderboard}>
            Get Leaderboard
          </Button>
        </div>
      )}
      <div className="w-full lg:w-2/3">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader2Icon className="w-12 h-12 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableCaption>Leaderboard score will be shown here</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12 text-center">Position</TableHead>
                <TableHead className="w-1/4 text-center">Avatar</TableHead>
                <TableHead className="w-1/4 text-center">Name</TableHead>
                <TableHead className="w-1/4 text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{getPositionBadge(index)}</TableCell>
                  <TableCell className="w-full flex justify-center">
                    <AnimatedTooltip item={item} />
                  </TableCell>
                  <TableCell className="font-medium text-center">{item.name}</TableCell>
                  <TableCell className="font-medium text-center">{item.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
  
};

export default Leaderboard;
``
