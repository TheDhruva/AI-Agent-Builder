"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useUserDetail } from '@/context/UserDetailContext'; 
import { Agent } from '@/types/AgentType';
import { GitBranchPlus } from 'lucide-react';
import moment from 'moment'; // CRITICAL: Added import
import Link from 'next/link';

function MyAgents() {
  const { userDetail } = useUserDetail();
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const convex = useConvex();

  useEffect(() => {
    if (userDetail?._id) {
      GetUserAgents();
    }
  }, [userDetail]);

  const GetUserAgents = async () => {
    if (!userDetail?._id) return;
    try {
      const result = await convex.query(api.agents.GetUserAgents, {
        userId: userDetail._id as any 
      });
      setAgentList(result);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl tracking-tight">My Agents</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {agentList && agentList.length > 0 ? (
          agentList.map((agent: Agent, index: number) => (
            <Link href={`/agent-builder/${agent.agentId}`} 
              key={agent._id ?? index} 
              className="group p-5 border rounded-xl shadow-sm hover:border-primary hover:shadow-md transition-all cursor-pointer bg-card"
            >
              <GitBranchPlus className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-semibold text-lg">{agent.agentName}</h3>
              
              {/* FIXED: Removed h2 from inside p tag */}
              <div className="mt-2">
                <div className='text-sm text-gray-400 mb-1'> 
                  {moment(agent._creationTime).format("MMM DD, YYYY")}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${agent.published ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {agent.published ? "Live / Published" : "Draft Mode"}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-secondary/5">
             <p className="text-muted-foreground font-medium">You haven't created any agents yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAgents;