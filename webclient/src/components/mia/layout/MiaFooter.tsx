"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

export default function MiaFooter() {
  const { user } = useUser();

  return (
    <div className="p-4 border-t border-border/50">
      {user ? (
        <div className="flex items-center gap-2">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt=""
              className="w-6 h-6 rounded-full ring-1 ring-border/50"
            />
          )}
          <div className="min-w-0">
            <div className="text-xs font-medium text-foreground truncate">
              {user.fullName || user.firstName || "Mechanic"}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">MIA Workshop</div>
      )}
    </div>
  );
}