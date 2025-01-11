"use client";

import * as React from "react";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteRSVP } from "@/app/actions/RSVPDelete";
import { useToast } from "@/hooks/use-toast";
import { ChartTable } from "./Chart";

interface RSVP {
  id: string;
  name: string;
  email: string;
  accompany: number;
  attendance: string;
}

interface RSVPTableProps {
  data: RSVP[];
}

export default function RSVPTable({ data: initialData }: RSVPTableProps) {
  const [filter, setFilter] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [data, setData] = useState(initialData);

  const filteredData = React.useMemo(() => {
    return data.filter((rsvp) =>
      rsvp.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const handleDelete = async (id: any) => {
    setIsLoading(true);
    const result = await deleteRSVP(id);

    if (result.success) {
      toast({
        title: "Success",
        description: "RSVP deleted successfully",
      });
      setData(data.filter((rsvp) => rsvp.id !== id));
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center ">
        <Input
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Number of Guests</TableHead>
              <TableHead>Attending</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="space-y-2">
            {filteredData.length > 0 ? (
              filteredData.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell>{rsvp.name}</TableCell>
                  <TableCell>{rsvp.email}</TableCell>
                  <TableCell>{rsvp.accompany || "unknown"}</TableCell>
                  <TableCell>{rsvp.attendance}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(rsvp.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ChartTable/>
    </div>
  );
}
