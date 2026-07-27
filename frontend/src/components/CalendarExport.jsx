import React from "react";
import { Calendar, Download, Share2 } from "lucide-react";

export default function CalendarExport({ summary, itinerary }) {
  const downloadICS = () => {
    if (!summary || !itinerary || !itinerary.length) return;

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TripForge AI Travel Planner//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    const startDateObj = new Date(summary.startDate);

    itinerary.forEach((dayItem, index) => {
      const dayDate = new Date(startDateObj);
      dayDate.setDate(dayDate.getDate() + index);

      const dateStr = dayDate.toISOString().replace(/-|:|\.\d+/g, "").substring(0, 8);

      const title = `TripForge Day ${dayItem.day}: ${dayItem.title}`;
      const description = (dayItem.activities || []).join("\\n• ");

      icsContent.push("BEGIN:VEVENT");
      icsContent.push(`UID:tf-${summary.tripId || index}-${dayItem.day}@tripforge.ai`);
      icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, "").substring(0, 15)}Z`);
      icsContent.push(`DTSTART;VALUE=DATE:${dateStr}`);
      icsContent.push(`SUMMARY:${title}`);
      icsContent.push(`DESCRIPTION:Activities:\\n• ${description}`);
      icsContent.push(`LOCATION:${summary.destination}`);
      icsContent.push("END:VEVENT");
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `TripForge_${summary.destination}_Itinerary.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={downloadICS}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-sm font-semibold transition cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Export to iCal / Calendar
      </button>

      <a
        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          `Trip to ${summary?.destination || 'Destination'}`
        )}&details=${encodeURIComponent(
          `Multi-agent planned trip from ${summary?.source} to ${summary?.destination}.`
        )}&location=${encodeURIComponent(summary?.destination || '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
      >
        <Calendar className="w-4 h-4 text-cyan-400" />
        Sync Google Calendar
      </a>
    </div>
  );
}
