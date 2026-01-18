import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAgents from './MyAgents'

function AiAgentsTab() {
  return (
    <div className='px-10 md:px-24 lg:px-32 mt-20'>
        <Tabs defaultValue="myagent" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="myagent">My Agents</TabsTrigger>
    <TabsTrigger value="templates">Templates</TabsTrigger>
  </TabsList>
  <TabsContent value="myagent"><MyAgents /></TabsContent>
  <TabsContent value="templates">TEMPLATE.</TabsContent>
</Tabs>
    </div>
  )
}

export default AiAgentsTab